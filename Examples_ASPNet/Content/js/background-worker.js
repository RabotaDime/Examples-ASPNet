
///================================================================================================

function CObject() { }



///================================================================================================

function CTestFunction (aName, aF, aArgs)
{
    if (aArgs === undefined) aArgs = null;
/*
    var Args = []

    for (var I = 2; I < arguments.length; I++)
    {
        Args.push(arguments[I]);
    }
*/

    this.TestName = aName;
    this.TestFunc = aF;
    this.TestArgs = aArgs;
}

function CTests ()
{
    this.Chrome = new CChromeTests();

    this.Functions = [];
}

CTests.prototype.Add = function (aT)
{
    this.Functions.push(aT);
}

CTests.prototype.Run = function ()
{
    for (var I = 0; I < this.Functions.length; I++)
    {
        this.Functions[I].TestFunc(this.Functions[I].TestArgs);
    }
}

function CChromeTests ()
{
    this.Functions = [];
}

var GlobalTests = new CTests();



///================================================================================================

var EWorkerState =
{
    Undefined     : 0,  ///  Запрос не установлен. 
    Loading       : 1,  ///  Соединение устанавливается. 
    Loaded        : 2,  ///  Получен ответ. 
    Processing    : 3,  ///  Обработка ответа. 
    Complete      : 4,  ///  Запрос выполнен, операция завершена. 
};

///================================================================================================

function CBackgroundWorker ()
{
    this.Base = new CObject();

    this.IsBusy = false;
}

CBackgroundWorker.prototype.WorkerObject = null;
CBackgroundWorker.prototype.ParentObject = null;



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

    return Result;
}

CBackgroundWorker.prototype.internal_SetBusy = function (aNewBusyState)
{
    this.IsBusy = aNewBusyState;
}



CBackgroundWorker.prototype.AttachParent = function (aParent)
{
    this.ParentObject = aParent;
}



CBackgroundWorker.prototype.Reset = function ()
{
    if (this.IsBusy)
    {
        ///  Если фоновый обработчик занят, пока будем считать, что его нельзя сбросить. 
        return false;
    }
    else
    {
        return true;
    }
}



CBackgroundWorker.prototype.Response = function (aStatusCode, aInputData)
{
    if (IsUndefined(this.ParentObject))
    {
        console.log("BackgroundWorker: Parent is NULL.");
        return;
    }

    if (aStatusCode == 200)
    {
        this.ParentObject.WorkerResult(true, aInputData);
    }
    else
    {
        this.ParentObject.WorkerResult(false, aInputData, aStatusCode);
    }
}



CBackgroundWorker.prototype.Execute = function (aResourceURL, aJSONData)
{
    if (this.IsBusy) return false;

    this.internal_SetBusy(true);

    this.WorkerObject.onreadystatechange = function ()
    {
        if (this.readyState == EWorkerState.Complete)
        {
            if (IsUndefined(GlobalBackgroundWorker)) return;

            GlobalBackgroundWorker.Response(this.status, this.responseText);
            GlobalBackgroundWorker.internal_SetBusy(false);
        }
    };

    this.WorkerObject.open("POST", aResourceURL, true);
    this.WorkerObject.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    this.WorkerObject.send(JSON.stringify(aJSONData));

    return true;
}



var GlobalBackgroundWorker = new CBackgroundWorker();
GlobalBackgroundWorker.Constructor();


