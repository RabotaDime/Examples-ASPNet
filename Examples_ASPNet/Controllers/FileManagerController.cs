using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Examples_ASPNet.Models;

namespace Examples_ASPNet.Controllers
{
    public class FileManagerController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }



        public ActionResult TestCSS()
        {
            return View("Index");
        }



		[HttpPost]
		public ActionResult List_WinLFS(CatalogueRequest model)
		{
			if ((model == null) || (model.Catalogues == null) || (model.Catalogues.Count <= 0))
			{
				return Json(new { Status = "Invalid or empty request." });
			}

			foreach (CatalogueRequestData C in model.Catalogues)
			{
			}

			return Json(new int[5] {1, 2, 3, 4, 5});
		}
    }
}

