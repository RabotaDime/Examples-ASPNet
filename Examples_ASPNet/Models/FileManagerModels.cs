using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
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



    public class CatalogueResponse
    {
        public List<CatalogueResult> Catalogues { get; set; }

        public string    StatusInfo { get; set; }
        public int        StatusCode { get; set; }

        public CatalogueResponse ()
        {
            this.Catalogues = new List<CatalogueResult> (64);
        }
    }



    [DataContract]
    public class CatalogueResult
    {
        public const Int32 StatusResult_Undefined            = 0;
        public const Int32 StatusResult_Success                = 1;
        public const Int32 StatusResult_UnknownError        = -1;



        [DataMember]
        public string Address { get; set; }

        [DataMember]
        public List<FileRecord> Objects { get; set; }



        private Boolean ReturnDirectories;
        private Boolean ReturnFiles;



        public CatalogueResult (CatalogueRequestData aRequestData)
        {
            this.Objects = new List<FileRecord> (1024 * 8);

            this.Address = aRequestData.Address;

            this.ReturnDirectories    = false;
            this.ReturnFiles        = false;

            String[] InterestTypes = aRequestData.Types.Split(',');
            foreach (String TypeID in InterestTypes)
            {
                if ((TypeID == "Directory") || (TypeID == "Root"))
                    this.ReturnDirectories = true;
                else if (TypeID == "File")
                    this.ReturnFiles = true;
            }
        }



        public Int32 Execute ()
        {
            String WinLFS_Path = this.Address.Replace('|', '\\');
            DirectoryInfo DirectoryListRequest = new DirectoryInfo(WinLFS_Path);


            if (this.ReturnDirectories)
            {
                List<DirectoryInfo> DirList = new List<DirectoryInfo> (1024 * 4);
                DirList.AddRange(DirectoryListRequest.GetDirectories());

                var Dirs = 
                    from D in DirList
                    where (D.Attributes & (FileAttributes.System | FileAttributes.Hidden)) == 0
                    select D;

                foreach (var DirInfo in Dirs)
                {
                    this.Objects.Add(new FileRecord ()
                    {
                        Type        = (int) EFileNodeType.Directory,
                        Name        = DirInfo.Name,
                        SizeText    = "",
                        Owner        = "ChuckNorris",
                        Flags        = (int) DirInfo.Attributes,
                    });
                }
            }


            if (this.ReturnFiles)
            {
                List<FileInfo> FileList = new List<FileInfo> (1024 * 4);
                FileList.AddRange(DirectoryListRequest.GetFiles());

                var Files =
                    from F in FileList
                    where (F.Attributes & (FileAttributes.System | FileAttributes.Hidden)) == 0
                    select F;

                foreach (var FileInfo in Files)
                {
                    this.Objects.Add(new FileRecord ()
                    {
                        Type        = (int) EFileNodeType.File,
                        Name        = FileInfo.Name,
                                      //  Размер файлов я пока передаю строкой. Так как в JSON нет полноценной поддержки Int64. 
                        SizeText    = MyFileHelper.GetSizeHint(FileInfo.Length),
                        Owner        = "ChuckNorris",
                        Flags        = (int) FileInfo.Attributes,
                    });
                }
            }


            return StatusResult_Success;
        }



        public void PopulateTestFolders (bool aWinLFS = true)
        {
            if (aWinLFS)
            {
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.Directory, Name = "Папка 1"            , SizeText = "20 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.Directory, Name = "Папка 2"            , SizeText = "21 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.Directory, Name = "Папка 3"            , SizeText = "1023 МБ"    , Owner = "ChuckNorris", Flags = 0755 });
            }
            else
            {
            }
        }

        public void PopulateTestFiles (bool aWinLFS = true)
        {
            if (aWinLFS)
            {
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "Прочти меня.txt"        , SizeText = "20 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "CookbookModel.cs"        , SizeText = "21 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "Отчет за квартал.doc"    , SizeText = "1023 МБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "nvidia.cfg"            , SizeText = "23 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "index.html"            , SizeText = "24 КБ"    , Owner = "ChuckNorris", Flags = 0755 });

                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "File Name 123.png"    , SizeText = "20 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "File Name 456.gif"    , SizeText = "21 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "File Name 789.webp"    , SizeText = "1023 МБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "File Name ABC.jpeg"    , SizeText = "23 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
                this.Objects.Add(new FileRecord () { Type = (int) EFileNodeType.File, Name = "File Name DEF.jpg"    , SizeText = "24 КБ"    , Owner = "ChuckNorris", Flags = 0755 });
            }
            else
            {
            }
        }
    }



    public class FileRecord
    {
        public string Name { get; set; }

        public int Type { get; set; }

        public string SizeText { get; set; }

        public string Owner { get; set; }

        public int Flags { get; set; }
    }



    public enum EFileNodeType : int
    {
        Undefined   = 0,
        Root        = 1,
        Directory   = 2,
        File        = 3,
    }



/*
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
*/
}