//---
// file fromHtml.js
// A. Beylot 05 2016
// this files contains code to convert HTML <div> tags with attribute
// data-type to abtjs objects.
//---

//dependencies check
var abtjs_fromHtml = true;
if(typeof abtjs_base == 'undefined') alert('base.js is needed before fromHtml.js');
if(typeof abtjs_alt == 'undefined') alert('alt.js is needed before fromHtml.js');
if(typeof abtjs_tab == 'undefined') alert('tab.js is needed before fromHtml.js');
//


// function parseContainer
// parent : the abtjs parent container
// child : the div to convert into abtjs tabSet
// returns the new abtjs object

abtjs.fillObjectProperty = function(object,child,tagName,varName,funcName)
{
	var myString = child.getAttribute(tagName)
	if( myString != undefined)
	{
		if (myString.search('return') >= 0)
		{
			object['f_' + varName] = Function('x','y','obj','abtjs',myString);
			//console.log('f_' + varName + ' is now : '+ object['f_' + varName]); 
		}
		else
		{
			var isNumber = !(isNaN(parseInt(myString)));
			if(varName == 'altLimits') isNumber = false;
			if (isNumber) object[varName] = Number(myString);
			else object[varName] = myString;
			console.log(varName + ' is now : '+ object[varName] + ' is integer ? ' + isNumber ); 
		}
	}

}

abtjs.parseAltSet = function(parent, child)
{	
	var altLimits;
	var objType =  child.getAttribute("data-type");
	if(objType == "altSet")
	{
		var myAltSet = new abtjs.alternative();
		abtjs.fillObjectProperty(myAltSet,child,"data-altLimits","altLimits");
		abtjs.fillObjectProperty(myAltSet,child,"data-altFunction","compute");
		myAltSet.setAltLimits();
		myAltSet.attachToContainer(parent);	
		for(var a in child.style)
		{
			myAltSet.view.style[a] = child.style[a];
		}
		return myAltSet;
	}
//	else if(objType == "alt")
//	{
//		var myParent = child.parentNode;
//		if(myParent != null)
//		{
//			var parChilds = myParent.children;
//			var rank = -1;
//			for(var i = 0; i < parChilds.length ; i++)
//			{
//				if(child  == parChilds[i])
//				{
//					rank = i;
//					break;
//				}
//			}
//			if(rank != -1)
//			{
//				parent.setContent(rank,child.innerHTML,child.id,child.style);
//			}
//		}
//		return null;
//	}
}

// function parseContainer
// parent : the abtjs parent container
// child : the div to convert into abtjs container
// returns the new abtjs object

abtjs.parseContainer = function(parent, child)
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
	//alert ("parsecontainer "+objType);

	/* build containers */

	var newCont = null;

	if(objType == "rootContainer")
	{
		newCont = new abtjs.rootContainer(disposition);
	}
	if(objType == "container")
	{
		newCont = new abtjs.container(disposition,minXSize,minYSize,elastX,elastY,priority);
	}
	if(objType == "tabContainer")
	{
		newCont = new abtjs.tabContainer();
		abtjs.fillObjectProperty(newCont,child,"data-defaultTab","defaultTab");
	}
	if(objType == "altContainer")
	{
		newCont = new abtjs.altContainer();
		abtjs.fillObjectProperty(newCont,child,"data-altLimits","altLimits");
		abtjs.fillObjectProperty(newCont,child,"data-altFunction","compute");
		newCont.setAltLimits();
	}
	if(newCont != null)
	{
		abtjs.fillObjectProperty(newCont,child,"data-disposition","disposition");
		abtjs.fillObjectProperty(newCont,child,"data-minXSize","minXSize");
		abtjs.fillObjectProperty(newCont,child,"data-minYSize","minYSize");
		abtjs.fillObjectProperty(newCont,child,"data-elastX","elastX");
		abtjs.fillObjectProperty(newCont,child,"data-elastY","elastY");
		abtjs.fillObjectProperty(newCont,child,"data-priority","priority");
	}
	if((newCont!=null)&&(parent != null))
	{

		for(var a in child.style)
		{
			newCont.view.style[a] = child.style[a];
		}
		newCont.view.id = child.id;
		var divs = child.getElementsByTagName('DIV');
		var hasChildren = false;
		for(var i=0; i < divs.length ; i++)
		{
			if (
				(divs[i].getAttribute("data-type") != '') && (divs[i].getAttribute("data-type") != null)
			)
			hasChildren = true;
		}

		if(! hasChildren)
		{
			newCont.view.innerHTML = child.innerHTML;
			newCont.view.classList.add('final');
		}
		parent.appendChild(newCont);
	}
	return newCont;
}

// function parseObject
// parent : the abtjs parent container
// child : the div to convert into abtjs object
// returns the new abtjs object
 
abtjs.parseObject = function(parent,child)
{

	var objType =  child.getAttribute("data-type");
	//alert("---"+ objType);
	if( (objType =="container") || (objType =="rootContainer") || (objType =="tabContainer") || (objType =="altContainer") ) 
	{
		return abtjs.parseContainer(parent, child);
	}
	//else if (objType == "altSet" || objType == "alt")
	//{
	//	return abtjs.parseAltSet(parent, child);
	//}
	return null;

}
		
// function parse
// parent : the parent abtjs object
// child : the div to process
// hook : callback function with the signature (parent, child)		
// this function calls itself.
		
abtjs.parse = function(parent,child,hook)
{
	var prt = hook(parent,child);
	var childs=child.childNodes;
	for(var j=0; j<childs.length;j++)
	{
		var obj = childs[j];
		if(obj.nodeName == "DIV" && obj.getAttribute("data-type") != undefined) 
		{
			//alert(obj.getAttribute("id") + "----++" + obj.getAttribute("data-type"));
			abtjs.parse(prt,obj,hook);
		}
	}
	return prt;  
	//prt.resize();
}
		

// function onload
// this is the main function to call it should be called on <body> onload event
abtjs.onLoad = function()
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
		//abtjs.root = abtjs.parse(null,document.body,abtjs.parseObject);
		abtjs.root = abtjs.parse(null,rootContainer,abtjs.parseObject);
	}
	//rootContainer.remove();
	document.body.removeChild(rootContainer);
}
