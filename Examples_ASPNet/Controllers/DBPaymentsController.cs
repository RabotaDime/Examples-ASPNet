using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Examples_ASPNet.DBPayments;
using Examples_ASPNet.Models;



namespace Examples_ASPNet.Controllers
{
    public class DBPaymentsController : Controller
    {
		private PaymentsEntities PaymentsData = new PaymentsEntities();



		///   																						  
        ///   Простой просмотр содержания базы сотрудников 											  
		///___________________________________________________________________________________________
        public ActionResult Index()
        {
            return View();
        }

		public PartialViewResult Partial_EmployeesList ()
		{
			List<Examples_ASPNet.Models.Employee> EmployeesList = PaymentsData.Employees.ToList();

			return PartialView(EmployeesList);
		}

		public PartialViewResult Partial_DepartmentsList ()
		{
			List<Examples_ASPNet.Models.Department> DepartmentsList = PaymentsData.Departments.ToList();

			return PartialView(DepartmentsList);
		}

		public PartialViewResult Partial_EmployeesByDepartments ()
		{
			Hashtable DepartmentGroups = new Hashtable();
			Hashtable DepartmentsNames = new Hashtable();
			List<int> DepartmentsOrderedByNames = new List<int> ();

			///   Выборка всех отделов, по алфавиту. 
			IEnumerable<Models.Department> DepartmentsList =
				from D in PaymentsData.Departments
				orderby D.Name ascending
				select D;

			foreach (Models.Department D in DepartmentsList)
			{
				///   Подготавливаю для работы ассоциативный список сотрудников по отделам. 
				DepartmentGroups.Add(D.DepartmentID, new List<Models.Employee> ());
				///   Составляю словарь имен отделов по идентификатору. 
				DepartmentsNames.Add(D.DepartmentID, D.Name);
				///   Массив отделов, отсортированный по алфавиту. 
				DepartmentsOrderedByNames.Add(D.DepartmentID);
			}

			///   Выборка всех сотрудников, с данными по отделам. 
			IEnumerable<Models.Employee> EmployeesList =
				from E in PaymentsData.Employees
				join D in PaymentsData.Departments
					on E.DepartmentID equals D.DepartmentID
				orderby D.DepartmentID ascending, E.Name ascending
				select E;

			///   Заполнение ассоциативного массива сотрудников по отделам. 
			foreach (Models.Employee E in EmployeesList)
			{
				var AssocDepartmentList = (List<Models.Employee>) DepartmentGroups[E.DepartmentID];
				AssocDepartmentList.Add(E);
			}

			///   Дополнительный список сотрудников, которые не привязаны ни к какому отделу. 
			IEnumerable<Models.Employee> NullDepEmployees =
				from E in PaymentsData.Employees
				orderby E.Name ascending
				where E.DepartmentID == null
				select E;

			return PartialView (new DepartmentsListOfEmployees()
			{
				DepartmentsOrderedByNames	= DepartmentsOrderedByNames,
				DepartmentsArray			= DepartmentGroups,
				DepartmentsNames			= DepartmentsNames,
				EmployeesTotalCount			= EmployeesList.Count() + NullDepEmployees.Count(),
				EmployeesWithoutDepartment	= NullDepEmployees.ToList(),
			});
		}



		///   																						  
		///   Бонусы у сотрудников по отделам 														  
		///___________________________________________________________________________________________
        public ActionResult Bonuses()
        {
            return View();
        }

        public PartialViewResult Partial_BonusesForEmployees_SQL()
        {
            return PartialView();
        }

		///   Бонусы у сотрудников по отделам 
        public PartialViewResult Partial_BonusesForEmployees_LINQ()
        {
			IEnumerable<Models.EmployeeBonusInfo> EmployeesBonusesList =
				from B in PaymentsData.Bonuses						///   Собираем все записи о бонусах. 
				join E in PaymentsData.Employees					///   Присоединяем данные о сотрудниках, которые 
					on B.EmployeeID equals E.EmployeeID				///      связаны с перечисленными бонусами. 
				join D in PaymentsData.Departments					///   Присоединяем данные об отделах, которые 
					on E.DepartmentID equals D.DepartmentID			///      связаны с присоединенными выше сотрудниками. 
				orderby D.Name, E.Name								///   Сортируем результаты по имени отдела + имени сотрудника. 
				select												///   Выборка нужных данных из полученного набора записей. 
					new EmployeeBonusInfo () {
						EmployeeID		= E.EmployeeID,
						EmployeeName	= E.Name,
						DepartmentID	= D.DepartmentID,
						DepartmentName	= D.Name,
						BonusValue		= B.Value,	
					};

			///    Выводим список данных о бонусах, отсортированных по отделам и по именам. 
            return PartialView(EmployeesBonusesList);
        }



		///   																						  
		///   Отделы с большими бонусами 															  
		///___________________________________________________________________________________________
        public PartialViewResult Partial_BonusesByDepartments_SQL()
        {
            return PartialView();
        }

        public PartialViewResult Partial_BonusesByDepartments_LINQ(/* decimal reportsum */)
        {
			BonusesViewParams PageParams = new BonusesViewParams (Request);

			decimal param_ReportBonusSum = PageParams.ReportBonusSum.ParamValue;

			var Query1 =
				from B in PaymentsData.Bonuses
				join E in PaymentsData.Employees
					on B.EmployeeID equals E.EmployeeID
				join D in PaymentsData.Departments
					on E.DepartmentID equals D.DepartmentID
				group B by D.DepartmentID into GroupedData
				let TotalBonusSum = GroupedData.Sum(x => x.Value)
				where TotalBonusSum >= param_ReportBonusSum
				select new
				{
					DepartmentID		= GroupedData.Key,
					TotalBonusValue		= TotalBonusSum,
				};

			IEnumerable<Models.DepartmentTotalBonusInfo> DepartmentBonusList =
				from Q in Query1
				join D in PaymentsData.Departments
					on Q.DepartmentID equals D.DepartmentID
				select new Models.DepartmentTotalBonusInfo {
					DepartmentID		= Q.DepartmentID,
					DepartmentName		= D.Name,
					TotalBonusValue		= Q.TotalBonusValue,
				};

            return PartialView(DepartmentBonusList);
        }
    }
}