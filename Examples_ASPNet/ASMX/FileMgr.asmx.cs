using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

namespace Test2
{
    /// <summary>
    /// Summary description for WebServiceASMX1
    /// </summary>
    [ScriptService]
    [WebService(Namespace = "Test2")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    //[System.ComponentModel.ToolboxItem(false)]
    public class WebServiceASMX1 : WebService
    {
        [WebMethod(Description = "Test test test.")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void FileListing()
        {
            FileList TestListing1 = new FileList ();

            TestListing1.ResultCount = 5;
            TestListing1.ResultReport = "Success";
            TestListing1.ResultList = new List<FileItem> (1024);
            TestListing1.ResultList.Add(new FileItem() { Name = "File1.test", Size = 1100 });
            TestListing1.ResultList.Add(new FileItem() { Name = "File2.test", Size = 1200 });
            TestListing1.ResultList.Add(new FileItem() { Name = "File3.test", Size = 1300 });
            TestListing1.ResultList.Add(new FileItem() { Name = "File4.test", Size = 1400 });
            TestListing1.ResultList.Add(new FileItem() { Name = "File5.test", Size = 1500 });


            //https://stackoverflow.com/questions/12989373/listing-all-files-on-my-computer-and-sorting-by-size
            //https://www.dotnetperls.com/directory-size
            //Directory.GetFiles()


            Context.Response.AddHeader("Content-Type", "application/json");


            using (var DataStream = new MemoryStream(1024 * 32))
            {
                char[]          TextBuffer = new char [1024];
                StreamReader    TextReader = new StreamReader(DataStream);

                DataContractJsonSerializer JSONSerializer = new DataContractJsonSerializer(typeof(FileList));
                JSONSerializer.WriteObject(DataStream, TestListing1);

                DataStream.Seek(0, SeekOrigin.Begin);
                while (DataStream.Position < DataStream.Length)
                {
                    Int32 CharsReaded = TextReader.ReadBlock(TextBuffer, 0, 1024);
                    Context.Response.Write(TextBuffer, 0, CharsReaded);
                }
            }
        }
    }


    [DataContract]
    public class FileList
    {
        [DataMember]
        public String ResultReport;

        [DataMember]
        public Int32 ResultCount;

        [DataMember]
        public List<FileItem> ResultList;
    }


    [DataContract]
    public class FileItem
    {
        [DataMember]
        public String Name;

        [DataMember]
        public Int32 Size;
    }
}
