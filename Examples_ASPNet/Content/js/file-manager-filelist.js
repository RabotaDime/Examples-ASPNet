
///================================================================================================

function CVisualFileList ()
{
    this.Base = new CObject();
}



CVisualFileList.prototype.Constructor = function ()
{
}



CVisualFileList.prototype.InputCatalogue = function (aC)
{
    this.ClearList();


    var VListContainer = document.getElementById("FM_List_MainContainer");

    if ((VListContainer == null) || IsUndefined(VListContainer)) {
        return;
    }


    for (var I = 0; I < aC.NodeList.length; I++)
    {
        var DOMElement = this.CreateItemForNode(aC.NodeList[I]);

        DOMChildAppend(VListContainer, DOMElement);
    }
}



CVisualFileList.prototype.ClearList = function ()
{
    var VListContainer = document.getElementById("FM_List_MainContainer");

    if ((VListContainer == null) || IsUndefined(VListContainer)) {
        return;
    }

    DOMDeleteChildNodes(VListContainer);
}



CVisualFileList.prototype.CreateItemForNode = function (aNode)
{
/*
<div class="FMFileListItem LayoutContainer"><!--
     --><div class="FMFileListItem LayoutElement IconNameGroup"><!--
         --><div class="FMFileListItem Icon"></div><!--
         --><div class="FMFileListItem Name"><span>File Name 123.png</span></div><!--
         --><div class="LayoutClear"></div><!--
     --></div><!--
     --><div class="FMFileListItem LayoutElement DetailsGroup"><!--
         --><div class="FMFileListItem InfoElement InfoGradientIcon"></div><!--
         --><div class="FMFileListItem InfoElement InfoSize"><span>20 КБ</span></div><!--
         --><div class="FMFileListItem InfoElement InfoDate"><span>09.10.2017&nbsp;17:07</span></div><!--
         --><div class="FMFileListItem InfoElement InfoFlags"><span>0755</span></div><!--
         --><div class="FMFileListItem InfoElement InfoOwner"><span>PrivetDime</span></div><!--
     --></div><!--
     --><div class="LayoutClear"></div><!--
 --></div>
*/

    var IconClass = " FileIconUnknown";

    if (aNode.NodeType == EFileNodeType.Root)
    {
        IconClass = " FileIconRoot";
    }
    else if (aNode.NodeType == EFileNodeType.Directory)
    {
        IconClass = " FileIconDirectory";
    }
    else if (aNode.NodeType == EFileNodeType.File)
    {
        IconClass = " FileIconFile";

        var PictureExts = [".PNG", ".JPG", ".JPEG", ".GIF", ".BMP", ".WEBP"];
        var IsPictureFile = false;

        for (var PI = 0; PI < PictureExts.length; PI++)
        {
            if (String_EndsWith(aNode.NodeName.toLocaleUpperCase(), PictureExts[PI]))
            {
                IsPictureFile = true;
                IconClass = " FileIconPictureFile";
                break;
            }
        }
    }



    var Main_Element = DOMCreateNode
    (
        "DIV", "FMFileListItem LayoutContainer",
        ""
    );

    var IconNameGroup_Element = DOMChildAppend(Main_Element, DOMCreateNode
    (
        "DIV", "FMFileListItem LayoutElement IconNameGroup",
        "<div class='FMFileListItem Icon " + IconClass + "'></div>" +
        "<div class='FMFileListItem Name'><span>" + aNode.NodeName + "</span></div>" +
        "<div class='LayoutClear'></div>"
    ));


    var InfoSizeText  = (aNode.NodeData == null) ? "" : aNode.NodeData.SizeInfo;
    var InfoDateText  = (aNode.NodeData == null) ? "" : aNode.NodeData.DateTime;
    var InfoFlagsText = (aNode.NodeData == null) ? "" : aNode.NodeData.Flags;
    var InfoOwnerText = (aNode.NodeData == null) ? "" : aNode.NodeData.Owner;



    var DetailsGroup_Element = DOMChildAppend(Main_Element, DOMCreateNode
    (
        "DIV", "FMFileListItem LayoutElement DetailsGroup",
        "<div class='FMFileListItem InfoElement InfoGradientIcon'></div>" +
        "<div class='FMFileListItem InfoElement InfoSize'><span>"  + InfoSizeText + "</span></div>" +
        "<div class='FMFileListItem InfoElement InfoDate'><span>"  + InfoDateText + "</span></div>" +
        "<div class='FMFileListItem InfoElement InfoFlags'><span>" + InfoFlagsText + "</span></div>" +
        "<div class='FMFileListItem InfoElement InfoOwner'><span>" + InfoOwnerText + "</span></div>"
    ));

    var LayoutClear_Element = DOMChildAppend(Main_Element, DOMCreateNode
    (
        "DIV", "LayoutClear",
        ""
    ));



    return Main_Element;
}



///================================================================================================

