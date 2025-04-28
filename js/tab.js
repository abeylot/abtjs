//dependencies

var abtjs_tab = {}
if(typeof abtjs_base == 'undefined') alert('base.js is needed before tab.js');
/**********************************************************************/
abtjs.tabContainer = function()
{
	abtjs.container.call(this);
	this.defaultTab = 0;
	//this.view  = document.createElement('DIV');
	this.headerView = document.createElement('DIV');
	this.headerView.className = 'tabHeader';
	this.contentView = document.createElement('DIV');
	this.contentView.style.overflow = 'hidden';
	this.headerFiller = document.createElement('DIV');
	this.headerFiller.className = 'tabHeaderFiller';
	this.headerView.appendChild(this.headerFiller);
	this.view.appendChild(this.headerView);
	this.view.appendChild(this.contentView);
	
	
	//if(disposition == "HORIZONTAL")	this.view.className = 'container horizontal final';
	//else this.view.className = 'container vertical final';

	//method to append a container in this container
	//myContainer : container to append
	//rank : where to append, at the end if not defined
	this.appendChild = function(myContainer, rank)
	{
		var isFinal =myContainer.view.classList.contains('final');
		//alert(myContainer.view.className);
		

		var rank = typeof rank !== 'undefined' ? rank : null;

		var headerCell = document.createElement('DIV');
		headerCell.className = 'tabHeaderCell';
		headerCell.innerHTML = myContainer.view.id;
		if(rank==null)
		
		{
			rank = this.childrens.length;
			this.childrens[this.childrens.length] = myContainer;
			this.contentView.appendChild(myContainer.view);
			this.headerView.insertBefore(headerCell, this.headerFiller);
			headerCell.addEventListener('click', this.setCurrentHeaderCell.bind(this,headerCell));
		}
		else
		{
			if(rank <= this.childrens.length)
			{
				for (var i=this.childrens.length; i > rank; i--) this.childrens[i] = this.childrens[i-1];
				this.childrens[rank] = myContainer;
				this.contentView.insertBefore(myContainer.contentView, this.contentView.childNodes[rank]);
				this.headerView.insertBefore(myContainer.headerView, this.headerView.childNodes[rank]);
			}
		}

		if(isFinal && (rank == this.defaultTab)) myContainer.view.className = 'tabContentSel final';
		else if(rank == this.selectedTab) myContainer.view.className = 'tabContentSel';
		else if(isFinal) myContainer.view.className = 'tabContent final';
		else myContainer.view.className = 'tabContent';

		if (rank == this.defaultTab) headerCell.className = 'tabHeaderCellSel';

		this.resize();
	}
	
	
	//method to resize childrens
	this.computeChidrensSize = function()
	{

		var xSize = parseInt(window.getComputedStyle(this.contentView).width);
		var ySize = parseInt(window.getComputedStyle(this.contentView).height);

		for(var i=0; i < this.childrens.length; i++)
		{
			this.childrens[i].posx  = 0;
			this.childrens[i].posy  = parseInt(getComputedStyle(this.headerView).height);
			this.childrens[i].sizeY = ySize - (abtjs.getBorderSize(this.childrens[i],"top") + abtjs.getBorderSize(this.childrens[i],"bottom"));
			this.childrens[i].sizeX = xSize - (abtjs.getBorderSize(this.childrens[i],"left") + abtjs.getBorderSize(this.childrens[i],"right"));
			this.childrens[i].resize();
		}
	}
	
	//method to resize this container
	this.resize = function(x,y)
	{
		var x = typeof x !== 'undefined' ? x : null;
		var y = typeof y !== 'undefined' ? y : null;
		if(x!=null) this.sizeX=x;
		if(y!=null) this.sizeY=y;
		var h = parseInt(getComputedStyle(this.headerView).height);
		if(this.sizeX > 0) this.view.style.width = this.sizeX + "px";
		if(this.sizeY > 0) this.view.style.height = this.sizeY + "px";
		if(this.sizeX > 0) this.contentView.style.width = this.sizeX  + "px";
		if(this.sizeY > 0) this.contentView.style.height = this.sizeY -h + "px";

		this.view.style.left = this.posx + abtjs.getBorderSize(this.parent,"left") + "px";
		this.view.style.top = this.posy + abtjs.getBorderSize(this.parent,"top") + "px";

		var error = false;
		this.computeChidrensSize(false)
		abtjs.itemDispatchEvent(this.contentView,"containerResize");
		return error;
	}

	this.setCurrentHeaderCell = function(headerCell)
	{
		var divs = this.view.getElementsByTagName('DIV');
		var i=0;
		var index = -1;
		for(var j=0; j < divs.length; j++)
		{
			if(divs[j].classList.contains('tabHeaderCell')||divs[j].classList.contains('tabHeaderCellSel'))
			{
				if( divs[j] == headerCell )
				{
					index = i;
					divs[j].classList.remove('tabHeaderCell');
					divs[j].classList.add('tabHeaderCellSel');
					this.currentTab = divs[j]; 
				}else
				{
					divs[j].classList.add('tabHeaderCell');
					divs[j].classList.remove('tabHeaderCellSel');
				}
				i++;
			}
		}
		i=0;
		for(var j=0; j < divs.length; j++)
		{
			if(divs[j].classList.contains('tabContent')||divs[j].classList.contains('tabContentSel'))
			{
				if( i == index )
				{
					divs[j].classList.add('tabContentSel');
					divs[j].classList.remove('tabContent');
					//this.currentTab = this.divs[j]; 
				}else
				{
					divs[j].classList.add('tabContent');
					divs[j].classList.remove('tabContentSel');
				}
				i++;
			}
		}
		window.dispatchEvent(new Event('resize'));
	}

}
