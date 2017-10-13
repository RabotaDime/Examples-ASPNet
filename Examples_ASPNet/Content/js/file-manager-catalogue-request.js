
///================================================================================================

function CFileCatalogue ()
{
    this.Base = new CObject();
}

CFileCatalogue.prototype.Address = "";
CFileCatalogue.prototype.NodeList = [];



CFileCatalogue.prototype.Constructor = function (aAddress)
{
    this.Address = aAddress;
    this.NodeList = [];
}



///================================================================================================

function CFileCatalogueRequest ()
{
    this.Base = new CObject();
}

CFileCatalogueRequest.prototype.BackgroundWorker    = null;
CFileCatalogueRequest.prototype.CatalogueObjects    = [];
CFileCatalogueRequest.prototype.FileManager         = null;



CFileCatalogueRequest.prototype.Constructor = function (aFileManager)
{
    if (aFileManager === undefined) aFileManager = null;

    this.BackgroundWorker = GlobalBackgroundWorker;
    this.BackgroundWorker.AttachParent(this);

    this.CatalogueObjects = [];

    this.FileManager = aFileManager;
}



CFileCatalogueRequest.prototype.Drop = function ()
{
    this.CatalogueObjects = [];
}



CFileCatalogueRequest.prototype.WorkerResult = function (aSuccess, aInputData, aStatusCode)
{
    if (aStatusCode === undefined) aStatusCode = 200;

    if ((! aSuccess) || (aStatusCode != 200))
    {
        alert("Ошибка запроса: " + aStatusCode);
        return;
    }

    var JSONObject = JSON.parse(aInputData);

    //alert(aSuccess + "(" + aStatusCode + ") = [" + aInputData + "]");
    //console.dir(JSONObject);

    try
    {
        if (JSONObject.Catalogues.length > 0)
        {
            for (var CI = 0; CI < JSONObject.Catalogues.length; CI++)
            {
                var CatalogueJSON = JSONObject.Catalogues[CI];

                var Catalogue = new CFileCatalogue();
                Catalogue.Constructor(CatalogueJSON.Address);

                for (var OI = 0; OI < CatalogueJSON.Objects.length; OI++)
                {
                    var FileNodeJSON = CatalogueJSON.Objects[OI];

                    var FileNode = new CFileNode();
                    //FileNode.Constructor(); /* TODO_1 ??? */ 

                    FileNode.NodeName = FileNodeJSON.Name;
                    FileNode.NodeType = FileNodeJSON.Type;

                    FileNode.NodeData = {
                        SizeInfo    : FileNodeJSON.SizeText,
                        DateTime    : "01.01.2017&nbsp;12:34",
                        Flags       : FileNodeJSON.Flags,
                        Owner       : FileNodeJSON.Owner,
                    };

                    Catalogue.NodeList.push(FileNode);
                }

                this.FileManager.InputCatalogue(Catalogue /* CFileCatalogue */);
            }
        }
    }
    catch (E)
    {
        console.log ("Ошибка внесения данных в каталог.\n" + E);
        alert       ("Ошибка внесения данных в каталог.\n" + E);
    }
    finally
    {
    }
}



CFileCatalogueRequest.prototype.RequestSingleForPath = function (aPath, aOrder, aTypes)
{
    if (aOrder === undefined) aOrder = "Name,Type";
    if (aTypes === undefined) aTypes = "Root,Directory";


    var PathBuilder = new CFilePathBuilder();
    PathBuilder.Constructor(EFilePathType.WindowsLFS);

    var ValidPath = PathBuilder.GetPathString();

    var JSONData = {
        Catalogues: [{
            Address: CatalogueAddress,
            OrderBy: aOrder,
            Types: aTypes,
        }],
    };

    if (this.BackgroundWorker.Reset())
    {
        return this.BackgroundWorker.Execute("/filemanager/list_winlfs/", JSONData);
    }
    else
    {
        ///  Фоновый загрузчик занят, и в данный момент его невозможно сбросить.
        return false;
    }
}



CFileCatalogueRequest.prototype.RequestMutlipleForPath = function (aPath, aOrder, aTypes)
{
    if (aOrder === undefined) aOrder = "Name,Type";
    if (aTypes === undefined) aTypes = "Root,Directory";


    var PathBuilder = new CFilePathBuilder();
    PathBuilder.Constructor(EFilePathType.WindowsLFS);
    PathBuilder.BuildFromString(aPath);

    var N;
    var CatalogueAddress = "";

    var JSONData = {
        Catalogues: [],
    };

    for (N = PathBuilder.RootNode; N != null ; N = N.NextNode)
    {
        CatalogueAddress += N.NodeName + "|";

        if (N.NextNode == null)
            aTypes += ",File";

        JSONData.Catalogues.push(
        {
            Address: CatalogueAddress,
            OrderBy: aOrder,
            Types: aTypes,
        });
    }

    if (this.BackgroundWorker.Reset())
    {
        return this.BackgroundWorker.Execute("/filemanager/list_winlfs/", JSONData);
    }
    else
    {
        ///  Фоновый загрузчик занят, и в данный момент его невозможно сбросить.
        return false;
    }
}



///================================================================================================



CChromeTests.prototype.CFileCatalogueRequest_Request1 = function ()
{
    var CR1 = new CFileCatalogueRequest();
    CR1.Constructor();

    CR1.RequestMutlipleForPath("C:\\Users\\ChuckNorris\\Desktop\\\\\/\(Работа)\\Examples_ASPNet\\test.ru\\www\\");
}

GlobalTests.Add(new CTestFunction("CFileCatalogueRequest : Request test #1",
    CChromeTests.CFileCatalogueRequest_Request1));



///================================================================================================
