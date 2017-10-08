
///================================================================================================

function CFileManager ()
{
    this.Base = new CObject();
}

CFileManager.prototype.CatalogueRequest = null;



CFileManager.prototype.Constructor = function ()
{
    this.CatalogueRequest = new CFileCatalogueRequest();
}



CFileManager.prototype.Go = function (aPath)
{
    this.CatalogueRequest.RequestFor(aPath);
}



///================================================================================================

