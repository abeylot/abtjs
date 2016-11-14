function alternative()
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
	//* Set aternatives limits 
	//*
	
	this.setAltLimits = function(myAltLimits)
	{
		this.altLimits = myAltLimits;
		if(this.view != null)
			this.view.innerHTML = this.buildHTML();
		this.resize;
	}

	

	this.attachToContainer = function(container)
	{
		this.view = this.buildMe();
		this.view.innerHTML =this.buildHTML();
		container.appendChild(this);
		this.divs = this.view.getElementsByTagName('DIV');
		this.registerEvents();
		this.setCurrent(0);
	}
	

	
	this.getAltAt = function(index)
	{
		var i=0;
		for(var j=0; j < this.divs.length; j++)
		{
			if(this.divs[j].classList.contains('AltContent')||this.divs[j].classList.contains('AltContentSel'))
			{
				if( i == index )
				{
					return this.divs[j];
				}
				i++;
			}
		}
	}
	
	
	this.setContent = function(Alt,content)
	{
		var c = document.createElement('DIV');
		c.className = 'htmlContainer';
		c.innerHTML = content;
		this.getAltAt(Alt).appendChild(c);
	}
	
	this.setChooserFunction = function(f)
	{
		this.chooserFunction = f;
	}
	
		


	//**************************
	//* EVENTS                 *
	//**************************

	//**************
	//* PROPERTIES *
	//**************
	this.iCur = 0;
	this.view = null;
	this.chooserFunction = function(x,y) {return x;}

	//*******************
	//* PRIVATE METHODS *
	//*******************
	//
	
	this.setCurrent = function(index)
	{
		var i=0;
		for(var j=0; j < this.divs.length; j++)
		{
			if(this.divs[j].classList.contains('AltContent')||this.divs[j].classList.contains('AltContentSel'))
			{
				if( i == index )
				{
					this.divs[j].classList.add('AltContentSel');
					this.divs[j].classList.remove('AltContent');
					this.currentAlt = this.divs[j]; 
				}else
				{
					this.divs[j].classList.add('AltContent');
					this.divs[j].classList.remove('AltContentSel');
				}
				i++;
			}
		}
		this.currentAlt = index;
		this.resize();
	}
	
	this.buildHTML = function()
	{
		var c = '';
		for(var i = 0; i < this.altLimits.length + 1; i++)
		{
			c+= '<div class = "AltContent"></div>';
		}
		return c;
	}


	this.buildMe = function(myWidth, myHeight)
	{
		var elt = document.createElement("DIV");
		elt.className = "AltContainer";
		this.view=elt;
		return elt;
	}

	this.registerEvents = function()
	{
	}
	
	this.resize = function(x,y){
		if(this.currentAlt != null)
		{
			var x = typeof x !== 'undefined' ? x : null;
			var y = typeof y !== 'undefined' ? y : null;
			if(x!=null) this.sizeX=x;
			if(y!=null) this.sizeY=y;
			var style=getComputedStyle(this.view.parentElement); 
			var myStyle=getComputedStyle(this.view); 
			var deltax = getBorderSize(this,"left") + getBorderSize(this,"right");   
			var deltay = getBorderSize(this,"top") + getBorderSize(this,"bottom");

			this.view.style.width = this.sizeX - deltax+'px';
			this.view.style.height = this.sizeY - deltay+'px';
			this.view.style.left = this.posx + getBorderSize(this.parent,"left") + "px";
			this.view.style.top = this.posy + getBorderSize(this.parent,"top") + "px";

			for( j=0; j < this.divs.length; j++)
			{
				if(this.divs[j].classList.contains('AltContent')||this.divs[j].classList.contains('AltContentSel'))
				{
					this.divs[j].style.width = this.sizeX - deltax  - getDirBorderSize(this.divs[j],"left") - getDirBorderSize(this.divs[j],"right") + "px";;
					this.divs[j].style.height = this.sizeY  - deltay - getDirBorderSize(this.divs[j],"top") - getDirBorderSize(this.divs[j],"bottom") + 'px';
				}
			}
			if(this.divs)
			{
				var i = 0;
				var comp = this.chooserFunction(this.sizeX,this.sizeY);
				while((i < this.altLimits.length) && (parseInt(this.altLimits[i]) < comp))
					i++;
				if(i != this.currentAlt) this.setCurrent(i);
			}
		}
	}
}


