using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Examples_ASPNet.Models
{
    public class DepartmentsListOfEmployees
    {
        public Dictionary<int, List<Models.Employee>>   DepartmentsArray;
        public Dictionary<int, string>                  DepartmentsNames;

        public List<int>    DepartmentsOrderedByNames;
        public int            EmployeesTotalCount;

        public List<Models.Employee> EmployeesWithoutDepartment;
    }



    public class EmployeeBonusInfo
    {
        public int EmployeeID { get; set; }

        public string EmployeeName { get; set; }

        public int DepartmentID { get; set; }

        public string DepartmentName { get; set; }

        public decimal BonusValue { get; set; }
    }



    public class DepartmentTotalBonusInfo
    {
        public int DepartmentID { get; set; }

        public string DepartmentName { get; set; }

        public decimal TotalBonusValue { get; set; }

        //public DepartmentTotalBonusInfo (int BonusSum)
        //{
        //}
    }



/*
    public class Employee
    {
        public int EmployeeID { get; set; }

        public string Name { get; set; }

        public int DepartmentID { get; set; }
    }



    public class Department
    {
        public int DepartmentID { get; set; }

        public string Name { get; set; }
    }



    public class Bonus
    {
        public int BonusID { get; set; }

        public int EmployeeID { get; set; }

        public decimal Value { get; set; }
    }
*/
}
