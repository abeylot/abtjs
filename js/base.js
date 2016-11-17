//---
// file base.js
// A. Beylot 05 2016
// this files contains basic container classes
//---

//dependencies check
var abtjs_base = true;
//


var abtjs = {};

abtjs.itemDispatchEvent = function (item,eventName,eventData)
{
	var evt = document.createEvent('Event');
	evt.initEvent(eventName,false,true);
  evt.detail = eventData;

	item.dispatchEvent(evt);
}

abtjs.getBorderSize = function(obj,dir)
{
		if(obj == null) return 0;
		return abtjs.getDirBorderSize(obj.view,dir);
}

abtjs.getMmSize = function()
{
	var style = getComputedStyle(abtjs.sample);
	return parseFloat(style.width);
}


abtjs.getDirBorderSize = function(obj,dir)
{
	if(obj == null) return 0;
	var st = window.getComputedStyle(obj);
	if(dir=="top")
	{
		return parseInt(st.paddingTop) + parseInt(st.marginTop)  + parseInt(st.borderTopWidth);
	}
	if(dir=="bottom")
	{
		return parseInt(st.paddingBottom) + parseInt(st.marginBottom) + parseInt(st.borderBottomWidth);
	}
	if(dir=="left")
	{
		return parseInt(st.paddingLeft) + parseInt(st.marginLeft) + parseInt(st.borderLeftWidth);
	}
	if(dir=="right")
	{
		return parseInt(st.paddingRight) + parseInt(st.marginRight) + parseInt(st.borderRightWidth);
	}
	
}


// class container

abtjs.container = function(disposition, minXSize, minYSize, elastX, elastY, priority )
{	
	getRoot = function(){return abtjs.root;}
	var disposition = typeof disposition !== 'undefined' ? disposition : "HORIZONTAL";
	var minXSize = typeof minXSize !== 'undefined' ? minXSize : 0;
	var minYSize = typeof minYSize !== 'undefined' ? minYSize : 0;
	var elastX = typeof elastX !== 'undefined' ? elastX : 1;
	var elastY = typeof elastY !== 'undefined' ? elastY : 1;
	var priority = typeof priority !== 'undefined' ? priority : 0;
	var pos=0;
	
	// indicates if this instance is the root container
	this.isRoot=false;
	
	// if false container expands to its parent size
	// vertically if parents disposition is horizontal
	// horizontally otherwise 
	this.flow=false;

	// container width
	this.sizeX=0;
	
	//container height
	this.sizeY=0;
	
	//container disposition HORIZONTAL or VERTICAL
	this.disposition = disposition;
	
	//container minimum width, it might be removed 
	// if this size isn't available
	this.minXSize = minXSize;
	
	
	//container minimum height, it might be removed 
	// if this size isn't available
	this.minYSize = minYSize;
	
	//horizontal elasticity
	//contol how much container expands horizontally
	this.elastX = elastX;
	
	//vertical elasticity
	//contol how much container expands vertically
	this.elastY = elastY;
	
	//containers with smaller priority will be removed last
	//in case of missing space.
	this.priority = priority;
	
	//containers parent
	this.parent = null;
	
	//containers childrens
	this.childrens = [];
	
	//temporary storage for childrens
	this.childrensTmp = [];
	
	//containers view
	this.view  = document.createElement('DIV');
	
	
	if(disposition == "HORIZONTAL")	this.view.className = 'container horizontal';
	else this.view.className = 'container vertical';

	//method to append a container in this container
	//myContainer : container to append
	//rank : where to append, at the end if not defined
	this.appendChild = function(myContainer, rank)
	{
		var rank = typeof rank !== 'undefined' ? rank : null;

		if(rank==null)
		{
			this.childrens[this.childrens.length] = myContainer;
			this.view.appendChild(myContainer.view);
		}
		else
		{
			if(rank <= this.childrens.length)
			{
				for (var i=this.childrens.length; i > rank; i--) this.childrens[i] = this.childrens[i-1];
				this.childrens[rank] = myContainer;
				this.view.insertBefore(myContainer.view, this.view.childNodes[rank]);
			}
		}
		this.resize();
		
	}
	
	
	//method to resize childrens
	this.computeChidrensSize = function()
	{
		var xSize = parseInt(window.getComputedStyle(this.view).width);
		var ySize = parseInt(window.getComputedStyle(this.view).height);
		//fill childrensTmp array;
		this.childrensTmp = [];
		pos=0;
		for (var i=0; i < this.childrens.length; i++)
		{
			var child = this.childrens[i];
			var obj = {};
			obj.index=i;
			obj.xSz = 0;
			obj.ySz = 0;
			obj.shown = true;
			obj.priority = this.childrens[i].priority;
			this.childrensTmp[i] = obj;

			if(typeof child.f_minXSize === 'function')
			{
				child.minXSize = child.f_minXSize(xSize,ySize,this,abtjs);
			}

			if(typeof child.f_minYSize === 'function')
			{
				child.minYSize = child.f_minYSize(xSize,ySize,this,abtjs);
			}

			if(typeof child.f_elastX === 'function')
			{
				child.elastX = child.f_elastX(xSize,ySize,this,abtjs);
			}

			if(typeof child.f_elastY === 'function')
			{
				child.elastY = child.f_elastY(xSize,ySize,this,abtjs);
			}

			if(typeof child.f_disposition === 'function')
			{
				child.disposition = child.f_disposition(xSize,ySize,this,abtjs);
			}
		}
		this.childrensTmp.sort(function(a,b){return (a.priority - b.priority)});
		//compute minimum size
		var minSz = 0;
		var size =0;
		var elast =0;
		if(this.disposition == "HORIZONTAL")	size = parseInt(window.getComputedStyle(this.view).width);
		else
		{
			size=parseInt(window.getComputedStyle(this.view).height);
			if(this.isRoot)
			{
				size = window.innerHeight;
			}
		}
		
		//
		//	 remove items until there is enough space
		//	according to priorities
		//
		
		do
		{
			minSz =0;
			elast =0;
			for(var i = 0; i < this.childrensTmp.length; i++)
			{
				if(this.childrensTmp[i].shown)
				{
					if(this.disposition == "HORIZONTAL")
					{
						var szx=0;
						szx = this.childrens[this.childrensTmp[i].index].minXSize +
						      abtjs.getBorderSize(this.childrens[this.childrensTmp[i].index],"left") +
						      abtjs.getBorderSize(this.childrens[this.childrensTmp[i].index],"right") ;
						minSz += szx;
						elast += this.childrens[this.childrensTmp[i].index].elastX;
					}
					else
					{
						var szy=0;
						szy = this.childrens[this.childrensTmp[i].index].minYSize +
						      abtjs.getBorderSize(this.childrens[this.childrensTmp[i].index],"top") +
						      abtjs.getBorderSize(this.childrens[this.childrensTmp[i].index],"bottom") ;
						minSz += szy;
						elast += this.childrens[this.childrensTmp[i].index].elastY;
					}
					
				}
				
			} 
			if(minSz > size)
			{
				var done = false;
				var somethingDone = false;
				for(var i= this.childrensTmp.length -1 ; i >=0 ; i--)
				{
					if(this.childrensTmp[i].shown)
					{
						this.childrensTmp[i].shown = false;
						break;	
					} 
				}
			}
		}
		while(minSz > size)
		
		//
		//	Dispatch remaining space
		//
		if(elast > 0)
		{
			delta = (size - minSz)/elast;
			if(delta < 0) delta = 0;
			delta2  = size;
			if(delta == 0) delta2 = 0;
			for(var j=0; j < this.childrens.length; j++)
			{
				var i=0;
				for(i=0; i < this.childrensTmp.length;i++)
				{
					if(this.childrensTmp[i].index == j) break;
				}
				if(this.childrensTmp[i].shown)
				{
					if(this.disposition == "HORIZONTAL")
					{
						if(this.childrens[j].flow) this.childrens[j].sizeY = -1;
						else  this.childrens[j].sizeY = this.sizeY - (abtjs.getBorderSize(this.childrens[j],"top") + abtjs.getBorderSize(this.childrens[j],"bottom"));
						this.childrens[j].sizeX = this.childrens[j].minXSize;
						if(this.childrens[j].elastX > 0)
						{
							this.childrens[j].sizeX += Math.floor(this.childrens[j].elastX*delta);
							if(delta2 > 0) delta2 -= Math.floor(this.childrens[j].elastX*delta);
							if(i == this.childrensTmp.length)
							{
								this.childrens[j].sizeX += delta2;
								delta2 = 0;
							} 
							this.childrens[j].posy = 0;
						}  
						this.childrens[j].posx = pos;
						pos+=this.childrens[j].sizeX + abtjs.getBorderSize(this.childrens[j],"left") + abtjs.getBorderSize(this.childrens[j],"right") ;
					}
					else
					{
						this.childrens[j].sizeY = this.childrens[j].minYSize;
						if(this.childrens[j].flow) this.childrens[j].sizeX = -1;
						else  this.childrens[j].sizeX = this.sizeX - (abtjs.getBorderSize(this.childrens[j],"left") + abtjs.getBorderSize(this.childrens[j],"right"));
							this.childrens[j].posx = 0;
						if(this.childrens[j].elastY > 0)
						{
							this.childrens[j].sizeY += Math.floor(this.childrens[j].elastY*delta);
							if(delta2 > 0) delta2 -= Math.floor(this.childrens[j].elastY*delta);
							if(i == this.childrensTmp.length)
							{
								this.childrens[j].sizeY += delta2;
								delta2 = 0;
							} 
						}
						this.childrens[j].posy = pos;
						pos+=this.childrens[j].sizeY + abtjs.getBorderSize(this.childrens[j],"top") + abtjs.getBorderSize(this.childrens[j],"bottom") ;
					}
					this.childrens[j].view.style.display="inline-block";
				}
				else
				{
					this.childrens[j].view.style.display="none";
				}
			}
		}
		var error = false;
		for(var i=0; i < this.childrens.length; i++)
			error = error || this.childrens[i].resize();
	}
	
	//method to resize this container
	this.resize = function(x,y)
	{
		var error = false;
		var x = typeof x !== 'undefined' ? x : null;
		var y = typeof y !== 'undefined' ? y : null;
		if(x!=null) this.sizeX=x;
		if(y!=null) this.sizeY=y;
		
		if(this.sizeX > 0)this.view.style.width = this.sizeX + "px";
		if(this.sizeY > 0) this.view.style.height = this.sizeY + "px";
			
		this.view.style.left = this.posx + abtjs.getBorderSize(this.parent,"left") + "px";
		this.view.style.top = this.posy + abtjs.getBorderSize(this.parent,"top") + "px";
			
		this.computeChidrensSize(false)

		abtjs.itemDispatchEvent(this.view,"containerResize");
		return error;
	}


}


//class rootContainer
//inherits from container
abtjs.rootContainer = function(disposition)
{
	this.oldX = 0;
	this.oldY = 0;
	abtjs.container.call(this);
	this.isRoot=true;
	var disposition = typeof disposition !== 'undefined' ? disposition : "HORIZONTAL";
	this.flow=false;
	this.disposition = disposition;
	if(disposition == "HORIZONTAL")	this.view.className = 'container horizontal';
	else this.view.className = 'container vertical';
	document.body.appendChild(this.view);
	
	this.resize = function()
	{
		if((this.oldX == window.innerWidth) && (this.oldY == window.innerHeight))
		{
			this.resizing = false;
			this.sizeX=window.innerWidth;
			this.sizeY=window.innerHeight;

			var style=getComputedStyle(this.view.parentElement);
			this.view.style.height = this.sizeY + "px";
			this.view.style.width =  this.sizeX + "px";
			this.computeChidrensSize(false);
							
				var msize = window.innerWidth;
				var fSize = Math.floor(msize/100);
				var m = 12*abtjs.getMmSize()/3;
				if (fSize < m) fSize = m;
				document.body.style.fontSize = fSize+'px';

		}else{
			clearTimeout(this.resizing);
			this.resizing = setTimeout(this.resize.bind(this),500);
			this.computeChidrensSize(false);
		}
		this.oldX = window.innerWidth;
		this.oldY = window.innerHeight;
	}

	window.addEventListener('resize',this.resize.bind(this));
	this.resizing = setTimeout(this.resize.bind(this),500);
	var sample  = document.createElement('DIV');
	sample.className = 'sample';
	document.body.appendChild(sample);
	abtjs.sample = sample;

}


//class finalContainer
//inherits from container
abtjs.finalContainer = function(disposition, minXSize, minYSize, elastX, elastY, priority )
{
	abtjs.container.call(this,disposition, minXSize, minYSize, elastX, elastY, priority);
	this.view.className='container horizontal final';
	this.flow=false;
	this.view.style.overflow="hidden";
	document.body.style.overflow="hidden"
}
abtjs.root = {};
