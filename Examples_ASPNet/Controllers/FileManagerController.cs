using System;
using System.Collections.Generic;
using System.IO;
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
            return View();
        }



		[HttpPost]
		public ActionResult List_WinLFS(CatalogueRequest model)
		{
			if ((model == null) || (model.Catalogues == null) || (model.Catalogues.Count <= 0))
			{
				return Json(new { StatusInfo = "Invalid or empty request.", StatusCode = -1 });
			}

			CatalogueResponse Response = new CatalogueResponse();

			Int32 ResultStatusCode = 1;

			foreach (CatalogueRequestData C in model.Catalogues)
			{
				CatalogueResult CatalogResult = new CatalogueResult(C);

				///   Выполняем получение результата по каталогу. 
				Int32 StatusCode = CatalogResult.Execute();

				if (StatusCode != 1) ResultStatusCode = StatusCode;

				///   Добавляю каталог в результат. 
				Response.Catalogues.Add(CatalogResult);
			}

			Response.StatusInfo = "Success";
			Response.StatusCode = ResultStatusCode;

			//return Json(new int[5] {1, 2, 3, 4, 5});
			return Json(Response);
		}
    }
}

