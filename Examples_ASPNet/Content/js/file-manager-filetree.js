
///================================================================================================

function CVisualFileTree ()
{
    this.Base = new CObject();
}

CVisualFileTree.prototype.RootNode = null;



CVisualFileTree.prototype.Constructor = function ()
{
    this.RootNode = null;
}



function NavigationHelper_FileManagerTree_GoTo (event)
{
    if (IsUndefined(event)) event = window.event;

    var Sender = event.srcElement || event.target;

    //var TestLevel = 0;
    //var TestString = "";
    while ((Sender != null) && (! IsUndefined(Sender)) && (Sender != document.body) && (Sender.getAttribute("id") != "TreeElementParent"))
    {
        //TestString = TestString + "\n" + TestLevel + ": [" + Sender.nodeName + "][" + Sender.getAttribute("id") + "]";// + "{" + Sender.innerText + "}";
        //TestLevel++;
        Sender = Sender.parentElement;
    }

    var SenderID    = Sender.getAttribute("id");
    var SenderData  = Sender.getAttribute("data-path");

    try
    {
        //alert("[" + SenderID + "]\n[" + SenderData + "]");
        GlobalFileManager.Go(SenderData);
    }
    catch (E)
    {
        alert("Ошибка перехода по адресу.\n" + E);
    }

    event.stopPropagation();
    return false;
}



CVisualFileTree.prototype.CreateVisualNodeFor = function (aNode)
{
    var DOMNode = DOMCreateNode
    (
        "DIV", "FMControl_CDirTreeList MainContainer",
        //"[" + aNode.NodeName + ":" + aNode.NodeType + "]"
        ""
    );

    DOMNode.setAttribute("id", "TreeElementParent");

    DOMNode.setAttribute("data-path", aNode.GetFullAddress());
    DOMNode.setAttribute("onclick", "NavigationHelper_FileManagerTree_GoTo(event)");
    //DOMNode.onclick = function() { GlobalFileManager.Go();};

    var UpperContainer = DOMChildAppend(DOMNode, DOMCreateNode
    (
        "DIV", "FMControl_CDirTreeList UpperContainer",
        "<div class='FMControl_CDirTreeList DirToggleIcon'><div class='IconSize'></div></div>" + 
        "<div class='FMControl_CDirTreeList DirFolderIcon'><div class='IconSize'></div></div>" + 
        "<div class='FMControl_CDirTreeList DirNameBlock'><span class='FMControl_CDirTreeList DirName'>" + aNode.NodeName + "</span></div>" + 
        "<div class='ClearFix'></div>"
    ));

    var MidContainer = DOMChildAppend(DOMNode, DOMCreateNode
    (
        "DIV", "FMControl_CDirTreeList MiddleContainer",
        ""
    ));

    var SubContainer1 = DOMChildAppend(MidContainer, DOMCreateNode
    (
        "DIV", "FMControl_CDirTreeList DirListContainer",
        ""
    ));

    var SubContainer2 = DOMChildAppend(SubContainer1, DOMCreateNode
    (
        "DIV", "FMControl_CDirTreeList DirList",
        ""
    ));



    var NodeDOMInfo = {
        BaseDOMNode         : DOMNode,
        ContainerDOMNode    : SubContainer2
    };

    aNode.NodeDOMInfo = NodeDOMInfo;
    return NodeDOMInfo;
}



CVisualFileTree.prototype.InsertVisualNodeFor = function (aNode)
{
    if (IsUndefined(aNode) || (aNode == null))
    {
        return;
    }
    
    if (aNode.ParentNode == null)
    {
        this.RecreateView();

        this.RootNode = aNode;
        this.CreateVisualNodeFor(aNode);

        return;
    }


    var ParentDOMNode = aNode.ParentNode.NodeDOMObject;

    var DOMNode = DOMCreateNode("DIV", "", "");

    //ParentDOMNode.



    aNode.NodeDOMObject = DOMNode;

    return DOMNode;
}



CVisualFileTree.prototype.RecreateTreeFor = function (aDOMContainer, aTreeNode, aLevel)
{
    if (aLevel === undefined) aLevel = 0;
    if (aLevel > 32) return;


    aTreeNode.SortChildsByName(false);


    var VNodeInfo = this.CreateVisualNodeFor(aTreeNode);

    DOMChildAppend(aDOMContainer, VNodeInfo.BaseDOMNode);

    var ChildN;
    for (var I = 0; I < aTreeNode.ChildNodes.length; I++)
    {
        ChildN = aTreeNode.ChildNodes[I];

        if (ChildN.NodeType == EFileNodeType.Directory)
        {
            this.RecreateTreeFor(VNodeInfo.ContainerDOMNode, ChildN, aLevel + 1);
        }
    }
}

CVisualFileTree.prototype.RecreateTree = function ()
{
    var VTreeContainer = document.getElementById("FM_Tree_MainContainer");

    if ((VTreeContainer == null) || IsUndefined(VTreeContainer)) {
        return;
    }

    DOMDeleteChildNodes(VTreeContainer);


    this.RecreateTreeFor(VTreeContainer, this.RootNode);
}



CVisualFileTree.prototype.RecreateView = function ()
{
    var VTreeContainer = document.getElementById("FM_Tree_MainContainer");

    if ((VTreeContainer == null) || IsUndefined(VTreeContainer)) {
        return;
    }

    DOMDeleteChildNodes(VTreeContainer);

    this.RootNode = new CFileNode();
    this.RootNode.Constructor(null, "Root", EFileNodeType.Undefined);

    var VNode = this.CreateVisualNodeFor(this.RootNode);

    DOMChildAppend(VTreeContainer, VNode);
}



CVisualFileTree.prototype.AddViewNode = function (aN)
{
    var VTreeContainer = document.getElementById("FM_Tree_MainContainer");

    if ((VTreeContainer == null) || IsUndefined(VTreeContainer)) {
        return;
    }

    //VTreeContainer
}



CVisualFileTree.prototype.RecreateNode = function (aNode)
{
    //aNode.

    ///   Обходим предыдущие узлы перед их удалением. 
    for (var CI = 0; CI < aNode.ChildNodes.length; CI++)
    {
        if (aNode.ChildNodes[CI].NodeDOMObject != null)
        {
        }
    }
}



CVisualFileTree.prototype.ProvideNodesForCatalogue = function (aC, aForceUpdateRoot)
{
    if (aForceUpdateRoot === undefined) aForceUpdateRoot = false;


    ///   Обрабатываем путь для нового каталога данных о поступивших файловых объектах. 
    var NewPath = aC.Address;

    var PathBuilder = new CFilePathBuilder();
    PathBuilder.Constructor(EFilePathType.WindowsLFS);

    PathBuilder.BuildFromString(NewPath);


    var PathN, TreeN, NewN;


    TreeN = this.RootNode;
    PathN = PathBuilder.RootNode;

    ///   Заменяем главный узел дерева, если он отличается (именем и типом). 
    if ((TreeN == null) || (! TreeN.IsEqual(PathN)) || aForceUpdateRoot)
    {
        this.RootNode = new CFileNode();
        this.RootNode.Constructor(null, PathN.NodeName, PathN.NodeType);
        this.RootNode.Assign(PathN, false, false);
        this.RootNode.ParentNode = null;

        //this.RecreateTree();
    }


    ///   Обходим узлы указанного пути/адреса. 
    ///   Если находим совпадающие узлы, то продолжаем обход. 
    TreeN = this.RootNode;

    for (PathN = PathBuilder.RootNode; (PathN != null) && (TreeN != null); PathN = PathN.NextNode)
    {
        ///   Прерываем обход/цикл, если больше нет узлов в пути, которые 
        ///   необходимо вставить/обойти в текущем дереве. 
        if (PathN.NextNode == null) break;


        var Node = TreeN.FindChildLike(PathN.NextNode);

        ///   Если подобного узла не найдено, значит создаем новый 
        ///   для внесения новых данных из поступившего каталога. 
        if (Node == null)
        {
            Node = new CFileNode();
            Node.Constructor(TreeN, PathN.NextNode.NodeName, PathN.NextNode.NodeType);
            Node.Assign(PathN.NextNode, false, false);
            Node.ParentNode = TreeN;

            //TreeN.AddChild(Node);
        }


        ///   Указываем следующий узел для продолжения обхода в цикле. 
        TreeN = Node;
    }

    return TreeN;
}



///================================================================================================

