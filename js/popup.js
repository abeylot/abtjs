function popup()
{
	this.view = document.createElement("DIV");
	this.view.style.position = 'fixed';
	this.view.style.top = 0;
	this.view.style.left = 0;
	this.view.className = 'popup';
	this.view.innerHTML = "";

	this.show = function()
	{
		document.body.appendChild(this.view);
	}
	this.hide = function()
	{
		document.body.removeChild(this.view);
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
