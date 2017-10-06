
function CObject() { }



function CBackgroundWorker ()
{
    CObject.apply(this, arguments);
}

CBackgroundWorker.prototype = CObject;

CBackgroundWorker.prototype.WorkerObject = null;

CBackgroundWorker.prototype.Constructor = function ()
{
    this.WorkerObject = this.internal_CreateWorker();
}

CBackgroundWorker.prototype.internal_CreateWorker = function ()
{
    var Result = null;

    if (window.XMLHttpRequest)
    {
        ///   Обычный объект (Браузеры: Chrome, IE7+, Mozilla, Safari) 
        Result = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        ///   Объект ActiveX (для IE5, IE6). 
        Result = new ActiveXObject('MSXML2.XMLHTTP.3.0');
    }
}



