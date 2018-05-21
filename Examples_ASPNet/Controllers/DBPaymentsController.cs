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



        //                                                                                             
        //   Простой просмотр содержания базы сотрудников                                               
        //___________________________________________________________________________________________
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
            var DepartmentGroups = new Dictionary<int, List<Models.Employee>> ();
            var DepartmentsNames = new Dictionary<int, string> ();

            List<int> DepartmentsOrderedByNames = new List<int> ();

            //   Выборка всех отделов, по алфавиту. 
            IEnumerable<Models.Department> DepartmentsList =
                from D in PaymentsData.Departments
                orderby D.Name ascending
                select D;

            foreach (Models.Department D in DepartmentsList)
            {
                //   Подготавливаю для работы ассоциативный список сотрудников по отделам. 
                DepartmentGroups.Add(D.DepartmentID, new List<Models.Employee> ());
                //   Составляю словарь имен отделов по идентификатору. 
                DepartmentsNames.Add(D.DepartmentID, D.Name);
                //   Массив отделов, отсортированный по алфавиту. 
                DepartmentsOrderedByNames.Add(D.DepartmentID);
            }

            //   Выборка всех сотрудников, с данными по отделам. 
            IEnumerable<Models.Employee> EmployeesList =
                from E in PaymentsData.Employees
                join D in PaymentsData.Departments
                    on E.DepartmentID equals D.DepartmentID
                orderby D.DepartmentID ascending, E.Name ascending
                select E;

            //   Заполнение ассоциативного массива сотрудников по отделам. 
            foreach (Models.Employee E in EmployeesList)
            {
                if (E.DepartmentID.HasValue && DepartmentGroups.ContainsKey(E.DepartmentID.Value))
                {
                    DepartmentGroups[E.DepartmentID.Value].Add(E);
                }
            }

            //   Дополнительный список сотрудников, которые не привязаны ни к какому отделу. 
            IEnumerable<Models.Employee> NullDepEmployees =
                from E in PaymentsData.Employees
                orderby E.Name ascending
                where E.DepartmentID == null
                select E;

            return PartialView (new DepartmentsListOfEmployees()
            {
                DepartmentsOrderedByNames    = DepartmentsOrderedByNames,
                DepartmentsArray            = DepartmentGroups,
                DepartmentsNames            = DepartmentsNames,
                EmployeesTotalCount            = EmployeesList.Count() + NullDepEmployees.Count(),
                EmployeesWithoutDepartment    = NullDepEmployees.ToList(),
            });
        }



        //                                                                                             
        //   Бонусы у сотрудников по отделам                                                           
        //___________________________________________________________________________________________
        public ActionResult Bonuses()
        {
            return View();
        }

        public PartialViewResult Partial_BonusesForEmployees_SQL()
        {
            return PartialView();
        }

        //   Бонусы у сотрудников по отделам 
        public PartialViewResult Partial_BonusesForEmployees_LINQ()
        {
            IEnumerable<Models.EmployeeBonusInfo> EmployeesBonusesList =
                from B in PaymentsData.Bonuses                  //   Собираем все записи о бонусах. 
                join E in PaymentsData.Employees                //   Присоединяем данные о сотрудниках, которые 
                    on B.EmployeeID equals E.EmployeeID         //      связаны с перечисленными бонусами. 
                join D in PaymentsData.Departments              //   Присоединяем данные об отделах, которые 
                    on E.DepartmentID equals D.DepartmentID     //      связаны с присоединенными выше сотрудниками. 
                orderby D.Name, E.Name                          //   Сортируем результаты по имени отдела + имени сотрудника. 
                select                                          //   Выбираем нужные данные: 
                    new EmployeeBonusInfo () {                        
                        EmployeeID      = E.EmployeeID,         //     а) ИД-сотрудника 
                        EmployeeName    = E.Name,               //     б) имя сотрудника 
                        DepartmentID    = D.DepartmentID,       //        в) ИД-отдела 
                        DepartmentName  = D.Name,               //        г) название отдела 
                        BonusValue      = B.Value,              //     д) значение бонуса 
                    };

            //    Выводим список данных о бонусах, отсортированных по отделам и по именам. 
            return PartialView(EmployeesBonusesList);
        }



        //                                                                                             
        //   Отделы с большими бонусами                                                               
        //___________________________________________________________________________________________
        public PartialViewResult Partial_BonusesByDepartments_SQL()
        {
            return PartialView();
        }

        public PartialViewResult Partial_BonusesByDepartments_LINQ(/* decimal reportsum */)
        {
            BonusesViewParams PageParams = new BonusesViewParams (this.Request);

            //   Сумма ограничения бонусов по отделам из запроса страницы. 
            decimal param_ReportBonusSum = PageParams.ReportBonusSum.ParamValue;

            //                                                                                    
            //   Создаем описание первого запроса к данным.                                        
            //   Мы будем использовать этот запрос ниже, внутри второго, основного запроса.       
            //                                                                                    
            //   Следует отметить, что LINQ не отправляет никакие запросы до тех пор, пока        
            //   данные по нему не будут либо вызваны (например, в месте энумерации списка),        
            //   либо полностью сформирован (если один запрос используется внутри другого).        
            //                                                                                    
            var Query1 =
                from B in PaymentsData.Bonuses                        //   Собираем все записи о бонусах. 
                join E in PaymentsData.Employees                    //   Присоединяем данные о сотрудниках, которые 
                    on B.EmployeeID equals E.EmployeeID                //      связаны с этими бонусами. 
                join D in PaymentsData.Departments                    //      А также присоединяем данные об отделах, которые 
                    on E.DepartmentID equals D.DepartmentID            //         связаны с присоединенными только что сотрудниками. 
                group B by D.DepartmentID into GroupedData            //      Группируем выборку по отделам. 
                let TotalBonusSum = GroupedData.Sum(x => x.Value)    //      Создаем переменную и создаем для нее агрегатный запрос суммы. 
                where TotalBonusSum >= param_ReportBonusSum            //      Делаем выборку по полученному запросу. 
                select new                                            //   Выбираем нужные данные: 
                {
                    DepartmentID        = GroupedData.Key,            //     а) поле Идентификатора отдела 
                    TotalBonusValue     = TotalBonusSum,            //     б) и сумму бонусов по этому отделу 
                };

            //   Создаем второй основной комплексный запрос на основе первого.                   
            //   К данным по суммам бонусам нам нужно присоединить название отдела.               
            IEnumerable<Models.DepartmentTotalBonusInfo> DepartmentBonusList =
                from Q in Query1
                join D in PaymentsData.Departments
                    on Q.DepartmentID equals D.DepartmentID
                select new Models.DepartmentTotalBonusInfo {
                    DepartmentID        = Q.DepartmentID,
                    DepartmentName      = D.Name,
                    TotalBonusValue     = Q.TotalBonusValue,
                };

            //   Передаем запрос. Обращение к базе данных произойдет *только* при первом обращении 
            //   к списку энумерации. То есть, только внутри Вида. 
            return PartialView(DepartmentBonusList);
        }
    }
}

