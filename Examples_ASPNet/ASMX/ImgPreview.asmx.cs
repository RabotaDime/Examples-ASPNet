using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

namespace Test2
{
    /// <summary>
    /// Summary description for ImgPreview
    /// </summary>
    [WebService(Namespace = "http://localhost/", Name = "My Test", Description = "Some info.")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [ScriptService]
    public class ImgPreview : System.Web.Services.WebService
    {

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void GetThumbnail()
        {
            Context.Response.ContentType = "image/jpeg"; // .AddHeader("Content-Type", "application/json");

            //WriteImage(@"D:\F\YD\Diovizor\P\photo_2017-09-12_12-05-16.jpg", 512, 512, Context);
            WriteImage(@"C:\Users\D\Desktop\giphy.gif", 512, 512, Context);

            return;
/*
            using (var DataStream = new MemoryStream(1024 * 64))
            {
                char[]          DataBuffer = new char [1024];
                StreamReader    DataReader = new StreamReader(DataStream);

                

                //DataContractJsonSerializer JSONSerializer = new DataContractJsonSerializer(typeof(FileList));
                //JSONSerializer.WriteObject(DataStream, TestListing1);

                DataStream.Seek(0, SeekOrigin.Begin);
                while (DataStream.Position < DataStream.Length)
                {
                    Int32 CharsReaded = DataReader.ReadBlock(DataBuffer, 0, 1024);
                    Context.Response.Write(DataBuffer, 0, CharsReaded);
                }
            }
*/
        }


        public void WriteImage(string aFile, int width, int height, HttpContext aOutputContext)
        {
            Bitmap srcBmp = new Bitmap(aFile);
            float ratio = srcBmp.Width / (float)srcBmp.Height;
            SizeF newSize = new SizeF(width, height * ratio);
            Bitmap target = new Bitmap((int) newSize.Width,(int) newSize.Height);

            //HttpContext.Response.Clear();
            //HttpContext.Response.ContentType = "image/jpeg";
            using (Graphics graphics = Graphics.FromImage(target))
            {
                graphics.CompositingQuality = CompositingQuality.HighSpeed;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.DrawImage(srcBmp, 0, 0, newSize.Width, newSize.Height);
                using (MemoryStream memoryStream = new MemoryStream(1024 * 64)) 
                {
                    target.Save(memoryStream, ImageFormat.Jpeg);
                    memoryStream.WriteTo(aOutputContext.Response.OutputStream);
                }
            }
            //Response.End();
        }
    }
}
