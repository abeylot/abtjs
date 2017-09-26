//dependencies check
var abtjs_alt = true;
if(typeof abtjs_base == 'undefined') alert('base.js is needed before alt.js');
//
/**********************************************************************/
abtjs.altContainer = function()
{
	abtjs.container.call(this);
	var elt = document.createElement("DIV");
	this.view.className = "AltContainer";
	this.currentAlt = -1;
	this.appendChild = function(myContainer, rank)
	{
		console.log('New ALT!!!');
		var isFinal =myContainer.view.classList.contains('final');
		if(isFinal) myContainer.view.className = 'AltContent final';
		else myContainer.view.className = 'AltContent';

		var rank = typeof rank !== 'undefined' ? rank : null;

		if(rank==null)
		
		{
			this.childrens[this.childrens.length] = myContainer;
			this.view.appendChild(myContainer.view);
			if(this.childrens.length == (1+this.currentAlt))
			{
				this.view.classList.remove('AltContent');
				this.view.classList.remove('AltContentSel');
			}
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

		for(var i=0; i < this.childrens.length; i++)
		{
			this.childrens[i].posx  = 0;
			this.childrens[i].posy  = 0;
			this.childrens[i].sizeY = ySize - (abtjs.getBorderSize(this.childrens[i],"top") + abtjs.getBorderSize(this.childrens[i],"bottom"));
			this.childrens[i].sizeX = xSize - (abtjs.getBorderSize(this.childrens[i],"left") + abtjs.getBorderSize(this.childrens[i],"right"));
			this.childrens[i].resize();
		}
	}
	
	//method to resize this container
	this.resize = function(x,y)
	{
		//var h = parseInt(getComputedStyle(this.headerView).height);
		if(this.sizeX > 0) this.view.style.width = this.sizeX + "px";
		if(this.sizeY > 0) this.view.style.height = this.sizeY + "px";

		var i = 0;
		var comp = this.f_compute(this.sizeX,this.sizeY,this,abtjs);
		while((i < this.altLimits.length) && (parseInt(this.altLimits[i]) < comp))
		{
			//console.log('alt:' + this.altLimits[i]);
			i++;
		}
		console.log('current:' + this.currentAlt + '-' + i);
		if(i != this.currentAlt) this.setCurrent(i);
		//this.setCurrent(i);

		this.computeChidrensSize(false)
		abtjs.itemDispatchEvent(this.view,"containerResize");
	}

	this.setAltLimits = function(myAltLimits)
	{
		if(myAltLimits)  this.altLimits = myAltLimits;
		this.altLimits = this.altLimits.split('|');
	}

	this.f_compute = function(x,y,obj,abtjs) {return x;}

	this.setCurrent = function(index)
	{
		var i=0;
		divs = this.view.getElementsByTagName('DIV');
		for(var j=0; j < divs.length; j++)
		{
			if(divs[j].classList.contains('AltContent')||divs[j].classList.contains('AltContentSel'))
			{
				if( i == index )
				{
					divs[j].classList.add('AltContentSel');
					divs[j].classList.remove('AltContent');
					this.currentAlt = index;
					//this.currentAlt = this.divs[j];
					abtjs.itemDispatchEvent(divs[j],"containerResize");

				}else
				{
					divs[j].classList.add('AltContent');
					divs[j].classList.remove('AltContentSel');
				}
			i++;
			}
		}
		//this.currentAlt = index;
		//this.resize();
	}
}
