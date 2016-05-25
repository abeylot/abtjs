function tabSet()
{
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


	this.attachToContainer = function(containerName)
	{
		var container = null
		container = containerName;
		container.appendChild(this.buildMe());
		this.view.innerHTML =this.buildHTML();
		this.divs = this.view.getElementsByTagName('DIV');
		//alert(this.divs.length);
		this.registerEvents();
		container.addEventListener('containerResize', this.onResize.bind(this));
	}
	

	//*
	//* delete self from document
	//*
	this.destroy = function()
	{
		this.parent.removeChild(this);
	}
	
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
		this.onResize();
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
	
	this.onResize = function(){
		//alert('resize!');
		if(this.currentTab != null)
		{
			var h = 0;
			for(var j=0; j < this.divs.length; j++)
			{
				if(this.divs[j].className == 'tabHeader')
				{
					h = parseInt(getComputedStyle(this.divs[j]).height);
				}
			}
			//var curStyle=getComputedStyle(this.currentTab); 
			//h += parseInt(curStyle.paddingTop);
			//h += parseInt(curStyle.paddingBottom);
			var style=getComputedStyle(this.view.parentElement); 
			var myStyle=getComputedStyle(this.view); 
			var deltax = getBorderSize(this,"left") + getBorderSize(this,"right");   
			var deltay = getBorderSize(this,"top") + getBorderSize(this,"bottom");

			this.view.style.width = parseInt(style.width) - deltax+'px';
			this.view.style.height = parseInt(style.height) - deltay+'px';

			this.currentTab.style.height = parseInt(getComputedStyle(this.view).height) - h + 'px';
			//alert(h);
			itemDispatchEvent(this.currentTab,"containerResize");
		}
	}

	
	//******************
	//* COMPONENT INIT *
	//******************

}

//tabSet.prototype = new baseWidget;

