
///================================================================================================

var EFileNodeType =
{
    Undefined   : 0,
    Root        : 1,
    Directory   : 2,
    File        : 3,
};

///================================================================================================

function CFileNode ()
{
    this.Base = new CObject();
}

CFileNode.prototype.ParentNode      = null;
CFileNode.prototype.NextNode        = null;
CFileNode.prototype.PrevNode        = null;
CFileNode.prototype.ChildNodes      = [];

CFileNode.prototype.NodeName        = "UNDEFINED";
CFileNode.prototype.NodeType        = EFileNodeType.Undefined;
CFileNode.prototype.NodeData        = null;
CFileNode.prototype.NodeDOMInfo     = null;



CFileNode.prototype.Constructor = function (aParentNode, aNodeName, aNodeType)
{
    this.ParentNode = aParentNode;

    if (aParentNode != null)
    {
        this.ParentNode.AddChild(this);
    }

    this.NextNode        = null;
    this.PrevNode        = null;
    this.ChildNodes      = [];

    this.NodeName        = aNodeName;
    this.NodeType        = aNodeType;
    this.NodeData        = null;

    this.NodeDOMInfo     = null;
}

CFileNode.prototype.FindChildLike = function (aLikeNode)
{
    if (IsUndefined(aLikeNode) || (aLikeNode == null)) return null;

    ///   Потом создать хороший поиск по имени. А пока просто перебором.
    for (var I = 0; I < this.ChildNodes.length; I++)
    {
        if (this.ChildNodes[I].IsEqual(aLikeNode))
            return this.ChildNodes[I];
    }

    return null;
}

CFileNode.prototype.DropChilds = function ()
{
    this.ChildNodes = [];
}

CFileNode.prototype.IsEqual = function (aOtherNode)
{
    return (this.NodeName.localeCompare(aOtherNode.NodeName) == 0) &&
           (this.NodeType == aOtherNode.NodeType);
}

CFileNode.prototype.Assign = function (aNode, aAssignPointers, aCopyChilds)
{
    if (aAssignPointers === undefined) aAssignPointers = false;
    if (aCopyChilds     === undefined) aCopyChilds = false;

    this.NodeName = aNode.NodeName;
    this.NodeType = aNode.NodeType;
    this.NodeData = aNode.NodeData;

    if (aAssignPointers)
    {
        this.ParentNode     = aNode.ParentNode;
        this.NextNode       = aNode.NextNode;
        this.PrevNode       = aNode.PrevNode;
    }
    else
    {
        this.ParentNode     = null;
        this.NextNode       = null;
        this.PrevNode       = null;
    }

    if (aCopyChilds)
    {
        this.ChildNodes = aNode.ChildNodes;
    }
    else
    {
        this.ChildNodes = [];
    }
}

CFileNode.prototype.GetFullAddress = function ()
{
    var ResultPath = this.NodeName;
    var N = this.ParentNode;

    while (N != null)
    {
        ResultPath = N.NodeName + "|" + ResultPath;
        N = N.ParentNode;
    }

    return ResultPath;
}

CFileNode.prototype.AddChild = function (aNode)
{
    var PrevChild = (this.ChildNodes.length <= 0) ? null : this.ChildNodes[this.ChildNodes.length - 1];

    aNode.PrevNode = PrevChild;
    aNode.NextNode = null;

    this.ChildNodes.push(aNode);
}

CFileNode.prototype.SortChildsByName = function (aSortChilds)
{
    if (aSortChilds === undefined) aSortChilds = false;

    this.ChildNodes.sort(function (a, b) {
        return a.NodeName.localeCompare(b.NodeName);
    });

    if (aSortChilds) for (var I = 0; I < this.ChildNodes.length; I++)
    {
        this.ChildNodes[I].SortChildsByName(aSortChilds);
    }
}

CFileNode.prototype.ConsolePrint = function (aLevel)
{
    if (aLevel === undefined) aLevel = 0;

    var LevelString = "";
    var Level = aLevel;

    while (Level > 0)
    {
        LevelString += "+-";
        Level--;
    }

    console.log(LevelString + "Node:" + this.NodeType + " [" + this.NodeName + "] " +
        ((this.NodeData == null) ? "<no data>" : JSON.stringify(this.NodeData)));

    for (var I = 0; I < this.ChildNodes.length; I++)
        this.ChildNodes[I].ConsolePrint(aLevel + 1);
}



///================================================================================================



CChromeTests.prototype.CFileNode_Init1 = function ()
{
    var MyRoot1      = null;
    var MyChild1     = null;
    var MySubChild1  = null;

    MyRoot1 = new CFileNode();
    MyRoot1.Constructor(null, "Dir1", EFileNodeType.Directory);

        MyChild1 = new CFileNode();
        MyChild1.Constructor(MyRoot1, "FileXYZ.png", EFileNodeType.File);

        MyChild1 = new CFileNode();
        MyChild1.Constructor(MyRoot1, "File3.png", EFileNodeType.File);

        MyChild1 = new CFileNode();
        MyChild1.Constructor(MyRoot1, "File1.png", EFileNodeType.File);

        MyChild1 = new CFileNode();
        MyChild1.Constructor(MyRoot1, "FileABC.png", EFileNodeType.File);

        MyChild1 = new CFileNode();
        MyChild1.Constructor(MyRoot1, "File10.png", EFileNodeType.File);

        MyChild1 = new CFileNode();
        MyChild1.Constructor(MyRoot1, "OtherFiles", EFileNodeType.Directory);

            MySubChild1 = new CFileNode();
            MySubChild1.Constructor(MyChild1, "Файл 1.png", EFileNodeType.File);

            MySubChild1 = new CFileNode();
            MySubChild1.Constructor(MyChild1, "Аайл 2.png", EFileNodeType.File);

            MySubChild1 = new CFileNode();
            MySubChild1.Constructor(MyChild1, "Яайл 3.png", EFileNodeType.File);

            MySubChild1 = new CFileNode();
            MySubChild1.Constructor(MyChild1, "äарл 4.png", EFileNodeType.File);

    MyRoot1.SortChildsByName(true);

    console.dir(MyRoot1);

    MyRoot1.ConsolePrint();
}

GlobalTests.Add(new CTestFunction("CFileNode : Initialization test #1",
    CChromeTests.CFileNode_Init1));



///================================================================================================
