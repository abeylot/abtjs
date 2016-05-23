//---
// file fromHtml.js
// A. Beylot 05 2016
// this files contains code to convert HTML <div> tags with attribute
// data-type to abtjs objects.
//---


// function parseObject
// parent : the abtjs parent container
// child : the div to convert into abtjs object
// returns the new abtjs object
 
function parseObject(parent,child)
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

	for(var a in child.style)
	{
		newCont.view.style[a] = child.style[a];
	}
	//newCont.view.id = child.id;
	if(objType == "finalContainer")
	{
		newCont.view.innerHTML = child.innerHTML;
	}
		parent.appendChild(newCont);
	}
	return newCont;
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
	prt.resize();
}
		

// function onload
// this is the main function to call it should be called on <body> onload event

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
		parse(null,rootContainer,parseObject);
	}
	rootContainer.remove();
}
