function tabSet()
{
	this.isRoot=false;
	this.flow=false;
	this.sizeX=0;
	this.sizeY=0;
	this.minXSize = 0;
	this.minYSize = 0;
	this.elastX = 1;
	this.elastY = 1;
	this.priority = 0;
	this.parent = null;

	//******************
	//* PUBLIC METHODS *
	//******************
	//
	
	//*
	//* Set tab description 
	//*
	
	this.setTabNames = function(myTabNames)
	{
		this.tabNames = myTabNames;
		if(this.view != null)
			this.view.innerHTML = this.buildHTML();
	}


	this.attachToContainer = function(container)
	{
		this.view = this.buildMe();
		this.view.innerHTML =this.buildHTML();
		container.appendChild(this);
		this.divs = this.view.getElementsByTagName('DIV');
		this.registerEvents();
		//container.addEventListener('containerResize', this.onResize.bind(this));
	}
	

	//*
	//* delete self from document
	//*
	//this.destroy = function()
	//{
	//	this.parent.removeChild(this);
	//}
	
	this.getTabAt = function(index)
	{
		var i=0;
		for(var j=0; j < this.divs.length; j++)
		{
			if((this.divs[j].className == 'tabContent')||(this.divs[j].className == 'tabContentSel'))
			{
				if( i == index )
				{
					return this.divs[j];
				}
				i++;
			}
		}
	}
	
	
	this.setContent = function(tab,content)
	{
		var c = document.createElement('DIV');
		c.className = 'htmlContainer';
		c.innerHTML = content;
		this.getTabAt(tab).appendChild(c);
	}
		


	//**************************
	//* EVENTS                 *
	//**************************

	//**************
	//* PROPERTIES *
	//**************
	this.iCur = 0;
	this.view = null;
	this.tabNames = null;

	//*******************
	//* PRIVATE METHODS *
	//*******************
	//
	
	this.setCurrent = function(index)
	{
		var i=0;
		for(var j=0; j < this.divs.length; j++)
		{
			if((this.divs[j].className == 'tabHeaderCell')||(this.divs[j].className == 'tabHeaderCellSel'))
			{
				if( i == index )
				{
					this.divs[j].className = 'tabHeaderCellSel';
					this.currentTab = this.divs[j]; 
				}else
				{
					this.divs[j].className = 'tabHeaderCell';
				}
				i++;
			}
		}
		i=0;
		for(var j=0; j < this.divs.length; j++)
		{
			if((this.divs[j].className == 'tabContent')||(this.divs[j].className == 'tabContentSel'))
			{
				if( i == index )
				{
					this.divs[j].className = 'tabContentSel';
					this.currentTab = this.divs[j]; 
				}else
				{
					this.divs[j].className = 'tabContent';
				}
				i++;
			}
		}
		this.resize();
	}
	
	this.buildHTML = function()
	{
		var c = '';
		c+='<div class="tabHeader">';
		for(var i = 0; i < this.tabNames.length; i++)
		{
			if(i!=(this.tabNames.length-1))
				c+= '<div class = "tabHeaderCell">'+this.tabNames[i]+'</div>';
			else
				c+= '<div class = "tabHeaderCell" style="margin-right:0">'+this.tabNames[i]+'</div>';
		}
		c+=	'<div class = "tabHeaderFiller"></div></div>';
		//c+=	'</div>';
		for(var i = 0; i < this.tabNames.length; i++)
		{
			c+= '<div class = "tabContent"></div>';
		}
		return c;
	}


	this.buildMe = function(myWidth, myHeight)
	{
		var elt = document.createElement("DIV");
		elt.className = "tabContainer";
		this.view=elt;
		return elt;
	}

	this.registerEvents = function()
	{
		//alert('b');
		var i = 0;
		for(var j=0; j < this.divs.length; j++)
		{
			if((this.divs[j].className == 'tabHeaderCell')||(this.divs[j].className == 'tabHeaderCellSel'))
			{
				this.divs[j].addEventListener('click', this.setCurrent.bind(this,i));
				i++;
			}
		}

	}
	
	this.resize = function(x,y){
		if(this.currentTab != null)
		{
			var h = 0;
			var x = typeof x !== 'undefined' ? x : null;
			var y = typeof y !== 'undefined' ? y : null;
			if(x!=null) this.sizeX=x;
			if(y!=null) this.sizeY=y;
			for(var j=0; j < this.divs.length; j++)
			{
				if(this.divs[j].className == 'tabHeader')
				{
					h = parseInt(getComputedStyle(this.divs[j]).height);
				}
			}
			var style=getComputedStyle(this.view.parentElement); 
			var myStyle=getComputedStyle(this.view); 
			var deltax = getBorderSize(this,"left") + getBorderSize(this,"right");   
			var deltay = getBorderSize(this,"top") + getBorderSize(this,"bottom");

			this.view.style.width = this.sizeX - deltax+'px';
			this.view.style.height = this.sizeY - deltay+'px';
			this.view.style.left = this.posx + getBorderSize(this.parent,"left") + "px";
			this.view.style.top = this.posy + getBorderSize(this.parent,"top") + "px";

			//alert(this.sizeY);

			for( j=0; j < this.divs.length; j++)
			{
				//alert(this.divs[j].className);
				if((this.divs[j].className == 'tabContent')||(this.divs[j].className == 'tabContentSel'))
				{
					//alert("rr" + this.sizeY - h  - deltay - getDirBorderSize(this.divs[j],"top") - getDirBorderSize(this.divs[j],"bottom") + 'px');
					this.divs[j].style.width = this.sizeX - deltax  - getDirBorderSize(this.divs[j],"left") - getDirBorderSize(this.divs[j],"right") + "px";;
					this.divs[j].style.height = this.sizeY - h  - deltay - getDirBorderSize(this.divs[j],"top") - getDirBorderSize(this.divs[j],"bottom") + 'px';
				}
			}


		}
	}
}


