//---
// file fromHtml.js
// A. Beylot 05 2016
// this files contains code to convert HTML <div> tags with attribute
// data-type to abtjs objects.
//---

// function parseContainer
// parent : the abtjs parent container
// child : the div to convert into abtjs tabSet
// returns the new abtjs object


function parseTabSet(parent, child)
{	
	var tabNames;
	var objType =  child.getAttribute("data-type");
	if(objType == "tabSet")
	{
		var myTabSet = new tabSet();
		if(child.getAttribute("data-tabNames") != undefined)
		{
			tabNames = child.getAttribute("data-tabNames");
		}
		myTabSet.setTabNames(tabNames.split('|'));
		myTabSet.attachToContainer(parent);	
		for(var a in child.style)
		{
			myTabSet.view.style[a] = child.style[a];
		}
		return myTabSet;
	}
	else if(objType == "tab")
	{
		var myParent = child.parentNode;
		if(myParent != null)
		{
			var parChilds = myParent.children;
			var rank = -1;
			for(var i = 0; i < parChilds.length ; i++)
			{
				if(child  == parChilds[i])
				{
					rank = i;
					break;
				}
			}
			if(rank != -1)
			{
				//alert(rank);
				parent.setContent(rank,child.innerHTML);
			}
		}
		return null;
	}
}


function parseAltSet(parent, child)
{	
	var altLimits;
	var objType =  child.getAttribute("data-type");
	if(objType == "altSet")
	{
		var myAltSet = new alternative();
		if(child.getAttribute("data-altLimits") != undefined)
		{
			altLimits = child.getAttribute("data-altLimits");
		}
		if(child.getAttribute("data-altFunction") != undefined)
		{
			altLimits = child.getAttribute("data-altLimits");
		}
		myAltSet.setAltLimits(altLimits.split('|'));
		myAltSet.attachToContainer(parent);	
		if(child.getAttribute("data-altFunction") != undefined)
		{
			altFunction = Function('x','y',child.getAttribute("data-altFunction"));
			myAltSet.chooserFunction = altFunction;
		}
		for(var a in child.style)
		{
			myAltSet.view.style[a] = child.style[a];
		}
		return myAltSet;
	}
	else if(objType == "alt")
	{
		var myParent = child.parentNode;
		if(myParent != null)
		{
			var parChilds = myParent.children;
			var rank = -1;
			for(var i = 0; i < parChilds.length ; i++)
			{
				if(child  == parChilds[i])
				{
					rank = i;
					break;
				}
			}
			if(rank != -1)
			{
				//alert(rank);
				parent.setContent(rank,child.innerHTML);
			}
		}
		return null;
	}
}


function parseAltSet(parent, child)
{	
	var altLimits;
	var objType =  child.getAttribute("data-type");
	if(objType == "altSet")
	{
		var myAltSet = new alternative();
		if(child.getAttribute("data-altLimits") != undefined)
		{
			altLimits = child.getAttribute("data-altLimits");
			myAltSet.setLimits(altLimits.split('|'));
		}
		myAltSet.attachToContainer(parent);	
		for(var a in child.style)
		{
			myAltSet.view.style[a] = child.style[a];
		}
		return myAltSet;
	}
	else if(objType == "alt")
	{
		var myParent = child.parentNode;
		if(myParent != null)
		{
			var parChilds = myParent.children;
			var rank = -1;
			for(var i = 0; i < parChilds.length ; i++)
			{
				if(child  == parChilds[i])
				{
					rank = i;
					break;
				}
			}
			if(rank != -1)
			{
				//alert(rank);
				parent.setContent(rank,child.innerHTML);
			}
		}
		return null;
	}
}

// function parseContainer
// parent : the abtjs parent container
// child : the div to convert into abtjs container
// returns the new abtjs object

function parseContainer(parent, child)
{
	/* initialisations */
	var disposition = "HORIZONTAL";
	var minXSize = 100;
	var minYSize = 100;
	var elastX = 1;
	var elastY = 1;
	var priority = 1;

	/*fill variables from attribute*/

	var objType =  child.getAttribute("data-type");

	if(child.getAttribute("data-disposition") != undefined)
	{
		disposition = child.getAttribute("data-disposition");
	}
	if(child.getAttribute("data-minXSize") != undefined)
	{
		minXSize = Number(child.getAttribute("data-minXSize"));
	}
	if(child.getAttribute("data-minYSize") != undefined)
	{
		minYSize = Number(child.getAttribute("data-minYSize"));
	}
	if(child.getAttribute("data-elastX") != undefined)
	{
		elastX = Number(child.getAttribute("data-elastX"));
	}
	if(child.getAttribute("data-elastY") != undefined)
	{
		elastY = Number(child.getAttribute("data-elastY"));
	}
	if(child.getAttribute("data-priority") != undefined)
	{
		priority = Number(child.getAttribute("data-priority"));
	}
			


	/* build containers */

	var newCont = null;

	if(objType == "rootContainer")
	{
		newCont = new rootContainer(disposition);
	}
	if(objType == "finalContainer")
	{
		newCont = new finalContainer(disposition,minXSize,minYSize,elastX,elastY,priority);
	}
	if(objType == "container")
	{
		newCont = new container(disposition,minXSize,minYSize,elastX,elastY,priority);
	}
	if((newCont!=null)&&(parent != null))
	{


		if(child.getAttribute("data-xFunction") != undefined)
		{
			newCont.xFunction = Function('x','y',child.getAttribute("data-xFunction"));
		}
		if(child.getAttribute("data-xFunction") != undefined)
		{
			newCont.yFunction = Function('x','y',child.getAttribute("data-yFunction"));
		}
		if(child.getAttribute("data-elxFunction") != undefined)
		{
			newCont.elxFunction = Function('x','y',child.getAttribute("data-elxFunction"));
		}
			if(child.getAttribute("data-elyFunction") != undefined)
		{
			newCont.elyFunction = Function('x','y',child.getAttribute("data-elyFunction"));
		}


		for(var a in child.style)
		{
			newCont.view.style[a] = child.style[a];
		}
		newCont.view.id = child.id;
		if(objType == "finalContainer")
		{
			newCont.view.innerHTML = child.innerHTML;
		}
		parent.appendChild(newCont);
	}
	return newCont;
}

// function parseObject
// parent : the abtjs parent container
// child : the div to convert into abtjs object
// returns the new abtjs object
 
function parseObject(parent,child)
{

	var objType =  child.getAttribute("data-type");
	
	if( (objType =="container") || (objType =="finalContainer") || (objType =="rootContainer") ) 
	{
		return parseContainer(parent, child);
	}
	else if (objType == "tabSet" || objType == "tab")
	{
		return parseTabSet(parent, child);
	}
	else if (objType == "altSet" || objType == "alt")
	{
		return parseAltSet(parent, child);
	}
	return null;

}
		
// function parse
// parent : the parent abtjs object
// child : the div to process
// hook : callback function with the signature (parent, child)		
// this function calls itself.
		
function parse(parent,child,hook)
{
	var prt = hook(parent,child);
	var childs=child.childNodes;
	for(var j=0; j<childs.length;j++)
	{
		var obj = childs[j];
		if(obj.nodeName == "DIV" && obj.getAttribute("data-type") != undefined) 
		{
			parse(prt,obj,hook);
		}
	}
	return prt;  
	//prt.resize();
}
		

// function onload
// this is the main function to call it should be called on <body> onload event
var root = null;
function onLoad()
{
	var divs = document.body.getElementsByTagName('DIV');
	var rootContainer = null;
	for(var i=0; i < divs.length ; i++)
	{
		if(divs[i].getAttribute("data-type") == "rootContainer")
		{
			rootContainer = divs[i];
		}
	}
	if(rootContainer != null)
	{
		root = parse(null,rootContainer,parseObject);
	}
	//rootContainer.remove();
	document.body.removeChild(rootContainer);
}
