
///================================================================================================

function CFileManager ()
{
    this.Base = new CObject();
}

CFileManager.prototype.CatalogueRequest     = null;
CFileManager.prototype.DebugMode            = true;
CFileManager.prototype.FileTree             = null;
CFileManager.prototype.FileList             = null;



CFileManager.prototype.Constructor = function ()
{
    this.CatalogueRequest = new CFileCatalogueRequest();
    this.CatalogueRequest.Constructor(this);

    this.FileTree = new CVisualFileTree();
    this.FileTree.Constructor();

    this.FileList = new CVisualFileList();
    this.FileList.Constructor();
}



CFileManager.prototype.Go = function (aPath, aOrder, aTypes)
{
    if (aOrder === undefined) aOrder = "Name,Type";
    if (aTypes === undefined) aTypes = "Root,Directory";

    this.CatalogueRequest.RequestMutlipleForPath(aPath, aOrder, aTypes);
}

CFileManager.prototype.AskForLocation = function ()
{
    var NewPath = prompt("Пожалуйста, введите новый путь", "C:\\Users\\ChuckNorris\\Desktop\\\\\/\(Работа)\\Examples_ASPNet\\test.ru\\www\\");

    if (NewPath == null) return;
    if (! (typeof NewPath === "string")) return;
    if (NewPath == "") return;
    //if (isNaN(NewPath)) return;

    this.Go(NewPath);
}



CFileManager.prototype.InputCatalogue = function (aC /* CFileCatalogue */)
{
    if (this.DebugMode)
    {
        console.log("Catalogue:Begin [" + aC.Address + "]");

        for (var I = 0; I < aC.NodeList.length; I++) {
            var Node = aC.NodeList[I];

            console.log(" + [" + Node.NodeName + ":" + Node.NodeType + "] (" +
                Node.NodeData.SizeInfo + ", " +
                Node.NodeData.DateTime + ", " +
                Node.NodeData.Flags + ", " +
                Node.NodeData.Owner + ")");
        }

        console.log("Catalogue:End");
    }


    ///   Пересоздаем главный узел если он отсутствует, и обновляем дерево. 
    if (this.FileTree.RootNode == null)
    {
        //this.FileTree.RecreateView();
    }


    var CatalogueNode = this.FileTree.ProvideNodesForCatalogue(aC);

    ///   Обновляем текущий визуальный узел у дерева, так как для него
    ///   поступили новые данные (список объектов из каталога). 
    //this.FileTree.RecreateNode(CatalogueNode);


    ///   Удаляем предыдущие узлы. 
    CatalogueNode.DropChilds();

    ///   Добавляем все новые элементы из поступившего каталога. 
    for (var I = 0; I < aC.NodeList.length; I++) {
        var Node = aC.NodeList[I];

        var NewNode = new CFileNode();
        NewNode.Constructor(CatalogueNode, Node.NodeName, Node.NodeType);
        NewNode.Assign(Node, false, false);
        NewNode.ParentNode = CatalogueNode;

        //CatalogueNode.AddChild(NewNode);
    }

    this.FileTree.RecreateTree();

    console.dir(this.FileTree.RootNode);

    this.FileList.InputCatalogue(aC);
}



var GlobalFileManager = new CFileManager();

GlobalFileManager.Constructor();

///================================================================================================

