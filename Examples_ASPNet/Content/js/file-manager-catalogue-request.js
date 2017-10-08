
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

CFileCatalogueRequest.prototype.BackgroundWorker = null;
CFileCatalogueRequest.prototype.CatalogueObjects = [];



CFileCatalogueRequest.prototype.Constructor = function ()
{
    this.BackgroundWorker = GlobalBackgroundWorker;
    this.BackgroundWorker.AttachParent(this);

    this.CatalogueObjects = [];
}



CFileCatalogueRequest.prototype.Drop = function ()
{
    this.CatalogueObjects = [];
}



CFileCatalogueRequest.prototype.WorkerResult = function (aSuccess, aInputData, aStatusCode)
{
    if (aStatusCode === undefined) aStatusCode = 200;

    //var JSONObject = JSON.parse(aInputData);

    alert(aSuccess + "(" + aStatusCode + ") = [" + aInputData + "]");
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
