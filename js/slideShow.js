function SlideShow(timeOut)
{
	//******************
	//* PUBLIC METHODS *
	//******************
	//
	
	// fill data to be displayed.
	// data is an array of images,

	this.setData = function(myData)
	{
		this.data = myData;
	}


	var nextImg;
	var posted = 0;
	var delayMs = timeOut;

	this.changeDisplay=function()
	{
		var that = this;
		var img = this.view.getElementsByTagName('IMG')[0];
		var div = this.view.getElementsByTagName('DIV')[0];
		//console.log(posted);
		if (posted == 0)
		{
			this.i++;
			posted=1;
			nextImg = document.createElement("IMG");
			nextImg.src = this.data[this.i%(this.data.length)];
			nextImg.className = "slideShow slideShowHide";
			img.className = "slideShow slideShowHide";
			setTimeout(function(){that.changeDisplay()},1000);
		}
		else if(posted == 2)
		{
			posted = 0;
			img.className = "slideShow slideShowShow";
			setTimeout(function(){that.changeDisplay()},delayMs);
			return;
		}
		else if(posted == 1)
		{
			posted = 2;
			div.removeChild(img);
			div.appendChild(nextImg);
			setTimeout(function(){that.changeDisplay()},1000);
		}

	}

	this.attachToContainer = function(containerName)
	{
		var obj;
		if((obj=document.getElementById(containerName)) == null)
		{
			obj = containerName;
		}
		var container = obj;
		container.appendChild(this.buildMe());
		this.view.innerHTML =this.buildHTML();
		this.registerEvents();
		container.addEventListener('containerResize', this.resizeListener.bind(this));
		this.resizeMe();
		var that = this;
		setTimeout(function(){that.changeDisplay()},delayMs);
	}

	//*
	//* delete self from document
	//*
	this.destroy = function()
	{
		this.parent.removeChild(this);
	}


	//**************************
	//* EVENTS                 *
	//**************************
	//**************
	//* PROPERTIES *
	//**************
	this.data = null;
	this.view = null;

	// default values for the following sizes will be overriden progamatically
	this.sizesInitialized = false;
	this.borderAndPaddingCellHeight = 2;
	this.borderAndPaddingCellWidth  = 2;
	this.borderAndPaddingTableWidth  = 2;
	this.borderAndPaddingTableHeight  = 2;
	this.borderAndPaddingViewWidth  = 2;
	this.borderAndPaddingViewHeight  = 2;
	this.scrollbarWidth = 20;
	this.headerHeight=30;
	this.i=0;


	//*******************
	//* PRIVATE METHODS *
	//*******************
	//
	// callback, called when user resizes browser window
	//
	this.resizeListener = function()
	{
		this.resizeMe();
	}
	



	this.buildHTML = function()
	{
		var res = "";
		res +='<div class="maindiv" style="max-width:100%;max-height:100%;text-align:center">';
		res += '<img class ="slideShow slideShowShow" src="'+this.data[0]+'"> ';
		res +='</img></div>'
		return res;
	}

	this.buildMe = function()
	{
		this.widthPercent = 100;
		this.heightPercent = 100;
		var elt = document.createElement("DIV");
		elt.className = "slideShowContainer";
		this.view=elt;
		return elt;
	}



	this.resize = function(evt)
	{
		//this.resizeMe();
	}

	
	this.resizeMe = function()
	{
		var view = this.view;
		if(view != null)
		{
			var style=getComputedStyle(view.parentElement); 
			var myStyle=getComputedStyle(view); 
			var deltax = parseInt(myStyle.paddingLeft) + parseInt(myStyle.paddingRight) + parseInt(style.marginLeft) + 1;  
			var deltay = parseInt(myStyle.paddingTop) + parseInt(myStyle.paddingBottom);
			var width =  Math.floor((this.widthPercent / 100) * (parseInt(style.width)) - deltax);
			this.view.style.width = width +'px';
			this.view.style.height = Math.floor((this.heightPercent / 100) * (parseInt(style.height)) - deltay)+'px';
		}

	}
	
	

	this.registerEvents = function()
	{
	}

	//******************
	//* COMPONENT INIT *
	//******************

	//
	// constants
	//


}
