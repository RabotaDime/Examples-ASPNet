
///================================================================================================



function DOMCreateNode (aNodeType, aClassID, aNodeInnerHTML)
{
    var DOMNode = document.createElement(aNodeType);

    DOMSetClass(DOMNode, aClassID);

    DOMNode.innerHTML = aNodeInnerHTML;

    return DOMNode;
}



function DOMCreateNodeP (aNodeType, aClassID, aSubNodes)
{
    var DOMNode = document.createElement(aNodeType);

    DOMSetClass(DOMNode, aClassID);

    for (var I = 0; I < aSubNodes.length; I++)
    {
        DOMChildAppend(DOMNode, aSubNodes[I]);
    }

    return DOMNode;
}



function DOMCreateTextNode (aText)
{
    return document.createTextNode(aText);
}



function DOMChildAppend (aParentNode, aNewNode)
{
    aParentNode.appendChild(aNewNode);
    return aNewNode;
}



function DOMChildInsertBefore (aParentNode, aCurrentNode, aNewNode)
{
    aParentNode.insertBefore(aNewNode, aCurrentNode);
}



function DOMSetClass (aN, aClassID)
{
    aN.setAttribute("class"     , aClassID);
    aN.setAttribute("className" , aClassID);
}



function DOMDeleteChildNodes (aN)
{
    if (IsUndefined(aN)) return;

    while (aN.firstChild)
    {
        aN.removeChild(aN.firstChild);
    }
}



///================================================================================================

