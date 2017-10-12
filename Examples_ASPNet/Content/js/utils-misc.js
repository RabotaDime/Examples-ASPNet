
///================================================================================================



function IsUndefined (aV)
{
    return (typeof aV === "undefined");
}



function ArrayLast (aArray)
{
    if (aArray.length > 0)
    {
        return aArray[aArray.length - 1];
    }

    return null;
}



function String_EndsWith (aText, aMask)
{
    return aText.indexOf(aMask, aText.length - aMask.length) !== -1;
}



///================================================================================================

