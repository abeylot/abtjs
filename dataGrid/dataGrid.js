
	function itemDispatchEvent(item,eventName,eventData)
{
	var evt = document.createEvent('Event');
	evt.initEvent(eventName,true,true);
	for(var key in eventData){
     evt[key] = eventData[key];
     //alert(evt.key + ' ' + evt[key]);
  }
	item.dispatchEvent(evt);
}


function scrollTo(inner,outer){
  var topPos = inner.offsetTop;
  outer.scrollTop = topPos-10;
}
	function DataGrid()
{
	//******************
	//* PUBLIC METHODS *
	//******************
	//

	// fill data to be displayed.
	// data is an array of lines,
	// each line is an array of values
	// data will be displayed by calling datadictionnary's buildHTML(value) method

	this.setData = function(myData)
	{
		this.updateData(myData);
	}

	// update data to be displayed.
	// data is either
	//	the full data array by calling 	updataData(data)
	//	a line of datas by calling 			updateData(data,line);
	//	a cell value by calling					updateData(data,line,column);

	this.updateData = function(value,line,column)
	{
		var clignote=function(object){
			if(!object.clignote)object.clignote = true;
			else return;
			var bg = object.className;
			object.className = object.ClassName +' clignote';
			//object.style.backgroundColor='#FFFF00';
			setTimeout(function(){object.className = bg; object.clignote=false},100);
		}
		if(typeof(line) == 'undefined')//no variable provided in function call
		{
			this.iCur = -1;
			this.data = value;
			var i=0;
			if(this.view == null) return;
			this.view.innerHTML = this.buildHTML();
			this.registerEvents();
			this.resizeMe();
		}
		else if(typeof(column) == 'undefined')
		{
			//this.data[line] = [line.toString()].concat(value);
			var row = this.view.getElementsByTagName('TABLE')[1].rows[line];
			clignote(row);
			row.innerHTML = this.buildLineInnerHTML(line);
			this.resizeMe();
			this.valueChanged(line);
		}else{
			var myCol = 0;
			for(var i=0; i < (column) ; i++)
			{
				if(this.columns[i].show == false) continue;
				else myCol++;
			}
			var totalSize = 0;
			this.data[line][column] = value;
			var cell = this.view.getElementsByTagName('TABLE')[1].rows[line].cells[myCol];
			if ((cell != undefined ) && (this.columns[column].show == true))
			{
				clignote(cell);//xxx
				var myHtml = this.columns[column].dataDescriptor.buildHTML(this.data[line][column],this.data[line]);
				var res ="";
				res += '<td style="width:'+this.columns[column].size+'px">'+myHtml +'</td>';
				cell.innerHTML = res;
			}
			this.valueChanged(line,column);
		}
	}


	this.appendLine = function(value)
	{
			var i = this.data.length;
			this.data[i] = [i.toString()].concat(value);
			var dataTable = this.view.getElementsByTagName('TBODY')[1];
			var myClass = 'even';
			if(this.data.length%2 != 0) myClass='odd';
			var row = dataTable.insertRow();
			row.className = myClass;
			row.innerHTML = this.buildLineInnerHTML(this.data.length-1);
			this.resizeMe();
			this.valueChanged(this.data.length-1);
	}


	//*
	//* Set columns description
	//*

	this.setColumns = function(myColNames)
	{
		this.columns = myColNames;
		var totalSize = 0;
		for(var i=0; i < this.columns.length; i++)
		{
			if(! this.columns[i].hasOwnProperty("lib"))			{this.columns[i].lib="";}
			if(! this.columns[i].hasOwnProperty("dataType")){this.columns[i].dataType="text";}
			if(! this.columns[i].hasOwnProperty("sortable")){this.columns[i].sortable=false;}
			if(! this.columns[i].hasOwnProperty("size")){this.columns[i].size=8;}
			if(! this.columns[i].hasOwnProperty("show")){this.columns[i].show=true;}
			if(! this.columns[i].hasOwnProperty("style")){this.columns[i].style="";}
			if(this.dataDescriptor == null)
			{
				this.columns[i].dataDescriptor = dataDictionnary.getDataDescriptor(this.columns[i].dataType);
			}
			this.columns[i].sortChar=' ';
			if(this.columns[i].sortable) this.columns[i].sortChar=cDgSortable;
			totalSize += this.columns[i].size;
		}
		for(var i=0; i < this.columns.length; i++)
		{
			this.columns[i].propSize = this.columns[i].size * 100.0 / totalSize;
		}
	}

	//*
	//* Set column groups
	//*

	this.setColGroups = function(myColGroups)
	{
		this.colGroups = [{end:0, start:0}].concat(myColGroups);
		for(var i=0; i < this.colGroups.length; i++)
		{
			if(! this.colGroups[i].hasOwnProperty("lib"))	{this.colGroups[i].lib="";}
			if(! this.colGroups[i].hasOwnProperty("first"))	{this.colGroups[i].first=0;}
			if(! this.colGroups[i].hasOwnProperty("last"))	{this.colGroups[i].first=0;}
			if(! this.colGroups[i].hasOwnProperty("style")){this.colGroups[i].style="";}
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
		container.appendChild(this.buildMe(100,100));
		this.view.innerHTML =this.buildHTML();
		this.registerEvents();
		//window.addEventListener('resize', this.resizeListener.bind(this));
		if(container.classList.contains('container'))
			container.addEventListener('containerResize', this.resizeListener.bind(this));
		else
			window.addEventListener('resize', this.resizeListener.bind(this));
		this.resizeMe();
		this.view.addEventListener('contextmenu', function(event){event.preventDefault()});
	}

	//*
	//* delete self from document
	//*
	this.destroy = function()
	{
		window.removeEventListener('resize', this.resizeListener);
		this.parent.removeChild(this);
	}

	this.getCurrentLine = function()
	{
		return this.iCur;
	}


	//**************************
	//* EVENTS                 *
	//**************************
	this.selectionChanged = function()
	{
		itemDispatchEvent(this.view,'selectionChanged');
	}

	this.valueChanged = function(line,column)
	{
			itemDispatchEvent(this.view,'valueChanged',{line:line, column:column});
	}

	//**************
	//* PROPERTIES *
	//**************
	this.iCur = -1;
	this.data = null;
	this.view = null;
	this.viewTable = null;
	this.columns = null;
	this.colGroups = null;
	this.widthPercent = 0;
	this.heightPercent = 0;
	this.curResize = -1;
	this.xRsz = -1;

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



	//*******************
	//* PRIVATE METHODS *
	//*******************
	//
	// callback, called when user resizes browser window
	//
	this.resizeListener = function()
	{
        setTimeout(this.resizeMe.bind(this),2000);
	}

	this.startResize = function(i,evt)
	{
		this.curResize2 = i - 1;
		while((this.curResize2 >= 0)&& !this.columns[this.curResize2].show) this.curResize2--;
		if(this.curResize2 < 0) return;
		this.view.style.cursor = "ew-resize";
		this.curResize = i;
		this.xRsz = evt.clientX;
	}

	this.stopResize = function(evt)
	{
		this.view.style.cursor = "auto";
		this.curResize = -1;
	}

	this.resize = function(evt)
	{
		if(this.curResize >= 0)
		{
			evt.preventdefault;
			var delta = evt.clientX - this.xRsz
			if((this.columns[this.curResize].size - delta > 0)&&(this.columns[this.curResize2].size + delta > 0))
			{
				this.columns[this.curResize].size -= delta;
				this.columns[this.curResize2].size += delta;

				var total = 0;
				for(var i=0; i < this.columns.length; i++)
				{
					total += this.columns[i].size
				}
				this.columns[this.curResize].propSize = this.columns[this.curResize].size * 100.0 / total;
				this.columns[this.curResize2].propSize = this.columns[this.curResize2].size * 100.0 / total;

				this.xRsz = evt.clientX;
				this.resizeMe();
			}
			else
			{
				this.curResize = -1;
				this.view.style.cursor = "auto";
			}
		}
	}

	this.buildLineInnerHTML = function(line)
	{
			var res='';
			for(var j = 0; j < this.data[line].length; j++)
			{
				if(this.columns[j].show == false) continue;
				var myHtml = this.columns[j].dataDescriptor.buildHTML(this.data[line][j],this.data[line]);
				res += '<td>'+myHtml +'</td>';
			}
			return res;
	}

	this.buildLineHTML = function(line)
	{
			var res='';
			var myclass="even";
			if(line%2 == 0) myclass='odd';
			if(line == this.iCur) myclass='current';
			res +='<tr class="'+myclass+'" >';
			res += this.buildLineInnerHTML(line);
			res += '</tr>';
			return res;
	}

	this.buildHTML = function()
	{
		var iCur = this.iCur;
		var dg = this;
		var res = "";
		res +='<div class ="ZZZ" > ';
		res +='<table class="dataGrid">';
		res +='<tr class="datagridHeader">'
		if(this.colGroups != null)
		{
			for(var i=0; i < this.colGroups.length; i++)
			{
				var style="";
				if(this.colGroups[i].style != "") style='style="'+this.colGroups[i].style+'"';
				res += '<th '+style+'>';
				if(this.colGroups[i].start !=0) res+='<div class = "CCC" style="width:4px;cursor:ew-resize;display:inline-block" ></div>';
				res += '<div  style="display:inline-block;width:100%" class="header">'+this.colGroups[i].lib+'</div>';
				res+='</th>';
			}
		}
		res+='</tr>';
		res +='<tr class="datagridHeader">';

		for(var i=0; i < this.columns.length; i++)
		{
			if(this.columns[i].show == false) continue;
			var style = "";
			if(this.columns[i].style != "") style='style="'+this.columns[i].style+'"';
			res += '<th '+style+'">';
			if(i!=0) res+='<div class = "CCC" style="width:4px;cursor:ew-resize;display:inline-block" ></div>';
			res += '<div class = "BBB" style="display:inline-block;width:100%">'+this.columns[i].lib+' '+this.columns[i].sortChar+'</div>';
			res+='</th>';;
		}

		res +='</tr>';
		res +='</table>'
		res +='</div>';
		res +='<div class="AAA" style="overflow-y:auto;overflow-x:hidden;">';
		res +='<table class="dataGrid"><tbody>';

		for(var i=0; i < this.data.length; i++)
		{
			res += this.buildLineHTML(i);

		}
		res +='</tbody></table>'
		res +='</div>'
		return res;
	}

	this.buildMe = function(myWidth, myHeight)
	{
		this.widthPercent = myWidth;
		this.heightPercent = myHeight;
		var elt = document.createElement("DIV");
		elt.className = "dataGridContainer rounded shadowed";
		this.view=elt;
		return elt;
	}

	this.initSizes = function()
	{
		this.sizesInitialized = true;
		var headerRow = null;
		var headerCell = null;
		var dataRow = null;
		var dataCell = null;
		var headerTable = this.view.getElementsByTagName('TABLE')[0];

		this.borderAndPaddingViewWidth = this.view.offsetWidth - Math.round(parseFloat(getComputedStyle(this.view).width));
		this.borderAndPaddingViewHeight =  this.view.offsetHeight - Math.round(parseFloat(getComputedStyle(this.view).height));

		if(headerTable != null)
		{
			this.headerHeight = headerTable.offsetHeight;
			headerRow = headerTable.rows[0];
			if(headerRow) headerCell = headerRow.cells[0];
		}
		var dataTable = this.view.getElementsByTagName('TABLE')[1];
		if(dataTable != null)
		{
			this.borderAndPaddingTableHeight = dataTable.offsetHeight - Math.round(parseFloat(getComputedStyle(dataTable).height));
			this.borderAndPaddingTableWidth =  dataTable.offsetWidth - Math.round(parseFloat(getComputedStyle(dataTable).width));
			dataRow = dataTable.rows[0];
			if(dataRow) dataCell = dataRow.cells[0];
		}

		var scrollbarDiv = null;
		var divs = this.view.getElementsByTagName('DIV');
		if(divs != null)
		{
			for(var i = 0; i < divs.length;i++)
			{
				if(divs[i].className == 'AAA')
				{
					scrollbarDiv = divs[i];
				}
			}

			if(scrollbarDiv != null)
			{
				this.scrollbarWidth = scrollbarDiv.offsetWidth - scrollbarDiv.clientWidth;
			}

			if(dataCell != null)
			{
				this.borderAndPaddingCellWidth = dataCell.offsetWidth - Math.round(parseFloat(getComputedStyle(dataCell).width));
				this.borderAndPaddingCellHeight = dataCell.offsetHeight - Math.round(parseFloat(getComputedStyle(dataCell).height));
			}

		}
	}


	this.resizeMe = function()
	{
		this.headerHeight = this.view.getElementsByTagName('TABLE')[0].offsetHeight;
		if(!this.sizesInitialized)this.initSizes();

		var pStyle = getComputedStyle(this.view.parentElement);
		var myStyle = getComputedStyle(this.view);

		var deltax = this.view.offsetWidth - parseInt(myStyle.width);
		var deltay = this.view.offsetHeight - parseInt(myStyle.height);
		width =  Math.floor((this.widthPercent / 100) * (parseInt(pStyle.width)) - deltax);
		height = Math.floor((this.heightPercent / 100) * (parseInt(pStyle.height)) - deltay);


		var smallHeight = height - (this.headerHeight + this.borderAndPaddingTableHeight + 	this.borderAndPaddingViewHeight );
		var smallWidth = width - this.scrollbarWidth;
		var totalSize = 0;
		var cols=0;
		var pos=0;
		var start = [];
		var end = [];

		var aColumnIsTooSmall = true;

		//
		// resize columns untill all column have enough space
		//
		while (aColumnIsTooSmall)
		{
			aColumnIsTooSmall = false;
			cols=0;
			totalSize = 0;
			for(var i=0; i < this.columns.length; i++) {
				if(this.columns[i].show == false)
				{
					continue;
				}
				totalSize += this.columns[i].propSize;
				cols++;
			}
			for(var i=0; i < this.columns.length; i++) {
				if(this.columns[i].show == false)
				{
					this.columns[i].size = 0;
					continue;
				}
				if((this.columns[i].propSize * 5) < (totalSize/cols))
				{
					this.columns[i].propSize++;
					aColumnIsTooSmall = true;
					this.curResize = -1;
					totalSize = 0;
					for(var i=0; i < this.columns.length; i++) {
						if(this.columns[i].show == false) continue;
						totalSize += this.columns[i].propSize;
					}
				}
			}
		}

		var total = 0;

		for(var i=0; i < this.columns.length; i++) {
			start[i] = total;
			if(this.columns[i].show == false)
			{
				end[i]=total;
				continue;
			}
			this.columns[i].size = Math.floor((smallWidth * this.columns[i].propSize) / totalSize) ;
			total += this.columns[i].size;
			end[i]=total;
		}
		var delta = smallWidth - total;


		this.view.style.width= width + "px";

		var myStyle = getComputedStyle(this.view);
		var deltay = this.view.offsetHeight - parseInt(myStyle.height);
		height = Math.floor((this.heightPercent / 100) * (parseInt(pStyle.height)) - deltay);

		this.view.style.height= height + "px";
		var divs = this.view.getElementsByTagName('DIV');

		for(var i = 0; i < divs.length;i++)
		{
			if(divs[i].className == 'ZZZ')
			{
				divs[i].style.width = width+"px";
			}
			if(divs[i].className == 'AAA')
			{
				divs[i].style.width = width+"px";
				divs[i].style.maxHeight = smallHeight+"px";
				divs[i].style.minHeight = smallHeight+"px";
			}
		}

		//
		// resize headers;
		//

		this.view.getElementsByTagName('TABLE')[0].style.width = width + "px";
		var rows = this.view.getElementsByTagName('TABLE')[0].rows;
		var row = rows[rows.length -1];
		var groupRow = rows[0];
		var iCur=0;
		if(this.colGroups != null)
		{
			var last = null;
			var lasti = 0;
			for(var i=0; i < this.colGroups.length; i++) {
				var cell = groupRow.cells[i];
				if(((end[this.colGroups[i].end] - start[this.colGroups[i].start]) - this.borderAndPaddingCellWidth) <= 0)
				{
					cell.style.display = 'none';
				}
				else
				{
					last = cell;
					lasti = i;
					cell.style.display='flex'
					cell.style.width = (end[this.colGroups[i].end] - start[this.colGroups[i].start]) - this.borderAndPaddingCellWidth+'px';
				}
				cell.style.left = start[this.colGroups[i].start]+'px';
			}
			if(last != null)
				last.style.width = (end[this.colGroups[lasti].end] - start[this.colGroups[lasti].start]) - this.borderAndPaddingCellWidth + this.scrollbarWidth + delta + 'px';

		}

		last=null;lasti=0;
		for(var i = 0; i < this.columns.length;i++)
		{
			if(this.columns[i].show == false) continue;
			last = row.cells[iCur];
			lasti = i;
			row.cells[iCur].style.width = this.columns[i].size - this.borderAndPaddingCellWidth + "px";
			var divs = row.cells[iCur].getElementsByTagName('DIV');
			iCur++;
		}
		if(last != null)
			last.style.width = this.columns[lasti].size - this.borderAndPaddingCellWidth +  this.scrollbarWidth + delta +"px";

	//
	//	resize content
	//

		this.view.getElementsByTagName('TABLE')[1].style.width = smallWidth + "px";
		var rows = this.view.getElementsByTagName('TABLE')[1].rows;
		lasti = -1;
		last = null;
		for(var j=0; j < rows.length;j++)
		{
			row = rows[j];
			var iCur=0;
			for(var i = 0; i < this.columns.length;i++)
			{
				if(this.columns[i].show == false) continue;
				row.cells[iCur].style.width = this.columns[i].size - this.borderAndPaddingCellWidth + "px";
				iCur++;
				lasti = i;
				last=row.cells[iCur];
			}
		}
		if(last != null)
			last.style.width = this.columns[lasti].size - this.borderAndPaddingCellWidth +  this.scrollbarWidth + delta +"px";
		var sc = this.scrollbarWidth;
		this.initSizes();
		if(this.scrollbarWidth != sc) this.resizeMe();
	}

	this.registerEvents = function()
	{
		var rows = this.view.getElementsByTagName('TABLE')[0].rows;
		var row = rows[rows.length -1];
		if(rows.length > 1)
		{
			var rowGrp = rows[0];
			rowGrp.addEventListener('mousedown',this.headerMouseDown.bind(this));
			if(this.colGroups != null)
			{
				rowGrp.addEventListener('mouseup', this.stopResize.bind(this));
				rowGrp.addEventListener('mousemove',this.resize.bind(this));
				rowGrp.addEventListener('mousedown',this.headerMouseDown.bind(this));
				for(var i = 0; i < this.colGroups.length; i++)
				{
					var start = this.colGroups[i].start;
					while(!this.columns[start].show && (start < this.colGroups[i].end))
					{
						start++;
					}
					if(start < this.colGroups[i].end)
					{
						var divs = rowGrp.cells[i].getElementsByTagName('DIV');
						for(var j=0; j < divs.length; j++)
						{
						if(divs[j].className == 'CCC')
							divs[j].addEventListener('mousedown', this.startResize.bind(this,start));
						}
					}
				}
			}
		}
		row.addEventListener('mouseup', this.stopResize.bind(this));
		row.addEventListener('mousemove',this.resize.bind(this));
		row.addEventListener('mousedown',this.headerMouseDown.bind(this));
		var iCur=0;
		for(var i = 0; i < this.columns.length;i++)
		{
			if(this.columns[i].show == false) continue;
			var divs = row.cells[iCur].getElementsByTagName('DIV');

			for(var j=0; j < divs.length; j++)
			{
				if(divs[j].className == 'BBB')
					divs[j].addEventListener('click', this.headerClicked.bind(this,i));
				if(divs[j].className == 'CCC')
					divs[j].addEventListener('mousedown', this.startResize.bind(this,i));
			}
			iCur++;
		}

		var rows = this.view.getElementsByTagName('TABLE')[1].rows;
		for(var j=0; j < rows.length;j++)
		{
			rows[j].addEventListener('click', this.lineClicked.bind(this,j,false));
		}
	}

	this.headerClicked = function(i,event)
	{
		var unSort = false;
		if (!this.columns[i].sortable) return;
		var sens = 1;
		if(this.columns[i].sortChar == cDgSortable)
		{
			this.columns[i].sortChar = cDgUp;
		}
		else if(this.columns[i].sortChar == cDgDown)
		{
			this.columns[i].sortChar = cDgUp;
		}
		else if(this.columns[i].sortChar == cDgUp)
		{
			this.columns[i].sortChar = cDgDown;
			sens = -1;
		}
		for(var j=0; j < this.columns.length; j++)
		{
			if((i != j)&&(this.columns[j].sortable)){this.columns[j].sortChar = cDgSortable};
		}
		var myCmp = function(i,a,b){return this.columns[i].dataDescriptor.compare(a[i],b[i])*sens};
		this.data.sort(myCmp.bind(this,i));
		this.view.innerHTML = this.buildHTML();
		this.registerEvents();
		this.resizeMe();
	}

	this.setColumnsDisplay = function(checkBoxes)
	{
		var icur = 0;
		for(var i=0; i < checkBoxes.length;i++)
		{
			if(checkBoxes[i].type == 'checkbox')
			{
 				this.columns[icur].show = checkBoxes[i].checked;
				icur++;
			}
		}
		this.colPopup.hide();
		this.view.innerHTML = this.buildHTML();
		this.registerEvents();
		this.resizeMe();
	}

	this.headerMouseDown = function(event)
	{
		if(event.which != 3) return;
		if(this.colPopup == null) alert('popup null!');
		this.colPopup.setInnerHTML("<form id = 'dgPopup' >Column selector</form>");
		this.colPopup.setPos(event.clientX,event.clientY);
		this.colPopup.show();
		var myForm = document.getElementById('dgPopup');
		var myTB = document.createElement("TABLE");
		for(var i = 0; i < this.columns.length; i++)
		{
			var myRow = document.createElement("TR");
			var myCell = document.createElement("TD");
			myCell.innerHTML = this.columns[i].lib;
			myRow.appendChild(myCell);
			myCell = document.createElement("TD");
			var myCB = document.createElement("INPUT");
			myCB.type='checkbox';
			myCB.checked = this.columns[i].show;
			myCell.appendChild(myCB);
			myRow.appendChild(myCell);
			myTB.appendChild(myRow);
		}
		myForm.appendChild(myTB);
		var myBut = document.createElement("INPUT");
		myBut.type='button';
		myBut.value = 'OK';
		myForm.appendChild(myBut);
		myBut.addEventListener('click',this.setColumnsDisplay.bind(this,myForm.getElementsByTagName('INPUT')));
		myBut = document.createElement("INPUT");
		myBut.type='button';
		myBut.value = 'Cancel';
		myForm.appendChild(myBut);
		myBut.addEventListener('click',this.colPopup.hide.bind(this.colPopup));
		this.colPopup.view.style.width = 50 + 'px';
		this.colPopup.view.style.width = this.colPopup.view.scrollWidth + 'px';
		event.stopPropagation();
	}

	this.lineClicked = function(i,scroll)
	{
		var cur;
		this.iCur = i;
		for(var j=0; j < this.data.length; j++)
		{
			var row = this.view.getElementsByTagName('TABLE')[1].rows[j];
			if(i != j)
			{
				if(j%2 == 0) {row.className='odd';}
				else {row.className = 'even';}
			}
			else {row.className='current'; cur = row}

		}
		if(scroll) scrollTo(cur,this.view.getElementsByClassName('AAA')[0]);
		this.selectionChanged();
	}

	//******************
	//* COMPONENT INIT *
	//******************

	//
	// constants
	//
	var cDgSortable = ' ';
	var cDgUp = '&utrif;';
	var cDgDown = '&dtrif;';

	this.colPopup=new popup();

	//
	// register callback in case of browser's window resize
	//
	window.addEventListener('resize', this.resizeListener.bind(this));
//-- *JAVASCRIPT FOR POPUP *************************************************
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
		//alert(x+','+y);
		this.view.style.top = y+'px';
		this.view.style.left = x+"px";
	}
}
//-- *JAVASCRIPT FOR DATA DESCRIPTION ******************************************

}
function DataDescriptor(name)
{
	this.dataType = name;
	this.buildHTML = function(value)
	{
		return value;
	}
	this.compare = function(value1, value2)
	{
		if(value1 < value2) {return -1;}
		else if(value1 == value2) {return 0;}
		return 1;
	}
}

function DataDictionnary()
{
	this.dataDescriptors = [];
	this.appendDataType = function(type)
	{
		this.dataDescriptors[type.dataType] = type;
	}

	this.getDataDescriptor = function(dataType)
	{
		var res = this.dataDescriptors[dataType];
		if(res == null){return this.dataDescriptors["text"];}
		else{return res;}
	}

	var newType = new DataDescriptor("text");
	newType.buildHTML = function(value)
	{
		var res = ""
		//res += "<div style='text-align:left; padding:0.25em;text-overflow: ellipsis; overflow:hidden'>" + value + "</div>";
		res += "<div style='text-align:left; padding:0.25em; overflow:hidden'>" + value + "</div>";
		return res;
	}
	this.appendDataType(newType);

	var newType = new DataDescriptor("number");
	newType.buildHTML = function(value)
	{
		var res = ""
		//res += "<div style='width:100%;text-align:right; padding:0.25em;'><div style=' text-overflow: ellipsis; overflow:hidden;'>" + value + "</div></div>";
		res += "<div style='width:100%;text-align:right; padding:0.25em;'><div style='overflow:hidden;'>" + value + "</div></div>";
		return res;
	}
	newType.compare = function(a,b)
	{
		value1=parseFloat(a);
		value2=parseFloat(b);
		if(value1 < value2) {return -1;}
		else if(value1 == value2) {return 0;}
		return 1;
	}
	this.appendDataType(newType);

}
dataDictionnary = new DataDictionnary();
