
///================================================================================================

var EFilePathType =
{
    Undefined   : 0,
    RemoteFTP   : 1,
    WindowsLFS  : 2,
};

///================================================================================================

function CFilePathBuilder ()
{
    this.Base = new CObject();
}

CFilePathBuilder.prototype.RootNode         = null;
CFilePathBuilder.prototype.Nodes            = [];
CFilePathBuilder.prototype.PathSeparators   = [];



CFilePathBuilder.prototype.Constructor = function (aPathType)
{
    this.RootNode = null;
    this.Nodes = [];

    if (aPathType == EFilePathType.WindowsLFS)
    {
        this.PathSeparators = [ "|", "/" , "\\" ];
    }
}

CFilePathBuilder.prototype.AppendNode = function (aNode)
{
    var NewNode = new CFileNode();
    var LastNode = ArrayLast(this.Nodes);

    LastNode.NextNode = NewNode;

    PathNode.ParentNode     = LastNode;
    PathNode.PrevNode       = LastNode;

    Nodes.push(PathNode);
}

CFilePathBuilder.prototype.BuildFromString = function (aS)
{
    const MaxPathSplit = 64;

    if (this.PathSeparators.length <= 0)
        this.PathSeparators.push("|");

    for (var SI = 1; SI < this.PathSeparators.length; SI++)
        aS = aS.split(this.PathSeparators[SI], MaxPathSplit).join(this.PathSeparators[0]);

    var PathElements = aS.split(this.PathSeparators[0], MaxPathSplit);

    this.RootNode   = null;
    this.Nodes      = [];

    var PI, PrevNode;
    for (PI = 0, PrevNode = null; PI < PathElements.length; PI++)
    {
        var FileObjectID        = PathElements[PI];
        var FileObjectType      = EFileNodeType.Undefined;

        if (FileObjectID.length <= 0) continue;

        if (FileObjectID.replace(":", "?") != FileObjectID)
            FileObjectType = EFileNodeType.Root;
        else
            FileObjectType = EFileNodeType.Directory;


        var Node = new CFileNode();
        Node.Constructor(PrevNode, FileObjectID, FileObjectType);

        Node.PrevNode = PrevNode;

        if (PrevNode != null)
        {
            PrevNode.NextNode = Node;
        }


        this.Nodes.push(Node);
        PrevNode = Node;
    }

    this.RootNode = (this.Nodes.length > 0) ? this.Nodes[0] : null;
}



///================================================================================================



CChromeTests.prototype.CFilePathBuilder_Init1 = function ()
{
    var MyPathBuilder = null;

    MyPathBuilder = new CFilePathBuilder();
    MyPathBuilder.Constructor(EFilePathType.WindowsLFS);

    ///   Путь с некоторыми ошибками для проверки: 
    MyPathBuilder.BuildFromString("C:\\Users\\ChuckNorris\\Desktop\\\\\/\(Работа)\\Examples_ASPNet\\test.ru\\www\\");

    MyPathBuilder.RootNode.ConsolePrint();
}

GlobalTests.Add(new CTestFunction("CFilePathBuilder : Initialization test #1",
    CChromeTests.CFilePathBuilder_Init1));



///================================================================================================
