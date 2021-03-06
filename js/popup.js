//dependencies check
var abtjs_popup = true;
//

abtjs.popup = function()
{
	abtjs.container.call(this);
	this.shown = false;
	//this.view = document.createElement("DIV");
	this.view.style.position = 'fixed';
	this.view.style.top = 0;
	this.view.style.left = 0;
	this.view.className = 'popup';
	//this.view.innerHTML = "";

	this.show = function()
	{
		if(this.shown) return;
		document.body.appendChild(this.view);
		this.shown = true;
		this.view.style.maxHeight = window.innerHeight 
			- abtjs.getBorderSize(this,"top") 
			- abtjs.getBorderSize(this,"bottom") +'px';

		this.view.style.maxWidth = window.innerWidth+'px';
			- abtjs.getBorderSize(this,"left") 
			- abtjs.getBorderSize(this,"right") +'px';
	}

	this.hide = function()
	{	
		if (!this.shown) return;
		document.body.removeChild(this.view);
		this.shown = false;
	}
	this.setInnerHTML = function(innerHTML)
	{
		this.view.innerHTML = innerHTML;
	}
	this.setPos = function(x,y)
	{
		this.view.style.top = y+'px';
		this.view.style.left = x+"px";
	}
}


abtjs.leftPopup = function()
{
abtjs.popup.call(this);
	this.show = function()
	{
		if(this.shown) return;
		this.shown = true;
		this.view.style.left = -100+'%';
		document.body.appendChild(this.view);
		this.view.style.maxHeight = window.innerHeight 
			- abtjs.getBorderSize(this,"top") 
			- abtjs.getBorderSize(this,"bottom") +'px';

		this.view.style.maxWidth = window.innerWidth
			- abtjs.getBorderSize(this,"left") 
			- abtjs.getBorderSize(this,"right") +'px';
		this.view.style.top = 0 + 'px';
		this.view.style.left = 0 + 'px';
	}

}

abtjs.rightPopup = function()
{
abtjs.popup.call(this);
	this.show = function()
	{
		if(this.shown) return;
		this.shown = true;
		this.view.style.right = 200+'%';
		document.body.appendChild(this.view);
		this.view.style.maxHeight = window.innerHeight 
			- abtjs.getBorderSize(this,"top") 
			- abtjs.getBorderSize(this,"bottom") +'px';

		this.view.style.maxWidth = window.innerWidth+'px';
			- abtjs.getBorderSize(this,"left") 
			- abtjs.getBorderSize(this,"right") +'px';
		this.view.style.top = 0 + 'px';
		this.view.style.right = 0 + '%';
	}

}
