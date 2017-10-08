using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Examples_ASPNet.Models
{
	public class CatalogueRequest
	{
		public List<CatalogueRequestData> Catalogues { get; set; }
	}



	public class CatalogueRequestData
	{
		public string Address { get; set; }

		public string OrderBy { get; set; }

		public string Types { get; set; }
	}



	public class FileRecord
	{
	}
}