
Mt.MResize = new Class({
	Implements: [Events, Options],
	options: {
		onMouseDown: function(){},
		onMouseMove: function(){},
		onMouseUp: function(){},
		handleSize : 6,
		//handleStyle : { 'border' : '1px solid #000', 'background-color' : '#ccc' , opacity : .75  },
		zindex : 10000,
		min: {width: 100, height: 100}
	},
	binds: {},
	initialize: function(el, options) {
		this.element = $(el);
		this.setOptions(options);
		
		// Members
		this.isMouseDown = false;
		this.currentHandle = null;
		
		// Init coords and make the easier to access
		var coords = this.element.getCoordinates();
		coords.x = coords.left; coords.y = coords.top; coords.w = coords.width; coords.h = coords.height;
		this.coords = coords;
		
		this.container = new Element('div', {'class': 'MDialogResizeContainer'}).inject(this.element, 'after');
		this.container.setStyles({
			position: 'absolute',
			top: coords.top,
			left: coords.left,
			width: coords.width,
			height: coords.height,
			zIndex: 2300
		});
		this.coords.container = coords;
		this.coords.start = coords;
		this.__binds();
		
		// Kill drag events
		document.body.onselectstart = function(e){ e = new Event(e).stop(); return false; };
		// better alternative?
		this.removeDOMSelection = (document.selection && document.selection.empty) ? function(){ document.selection.empty(); } : 
			(window.getSelection) ? function(){ var s=window.getSelection();if(s && s.removeAllRanges) s.removeAllRanges();} : $lambda(false);
		
		// Create corner handles
		this.handles = {}; // stores resize handler elements
		// important! this setup a matrix for each handler, patterns emerge when broken into 3x3 grid. Faster/easier processing.
		this.handlesGrid = { 'NW':[0,0], 'N':[0,1], 'NE':[0,2], 'W':[1,0], 'E':[1,2], 'SW':[2,0], 'S':[2,1], 'SE':[2,2] };
		// this could be more elegant!			
		['NW','N','NE','W','E','SW','S','SE'].each(function(handle){
			var grid = this.handlesGrid[handle]; // grab location in matrix 
			this.handles[handle] = new Element("div", {
			'styles' : Object.merge({ 'position' : 'absolute', 
						 'display' : 'block',
						 'visibility' : 'hidden',
						 'width' : this.options.handleSize, 
						 'height' : this.options.handleSize, 
						 'overflow' : 'hidden', 
						 'cursor' : (handle.toLowerCase()+'-resize'),
						 'z-index' : this.options.zindex+2
					  },this.options.handleStyle),
				'events': {
					'mousedown': function(e){
						this.events['mousedown'](e, handle);
					}.bind(this)
				}
			}).inject(this.container,'after');
		},this);
		//this.showHandles();
	},
	__binds: function() {
		this.events = {
			'mouseup': this.mouseReleaseEvent.bind(this),
			'mousedown': this.mousePressEvent.bind(this),
			'mousemove': this.mouseMoveEvent.bind(this),
		}
	},
	showHandles: function() {
		var box = this.coords.start;
		var tops = [], lefts = [], pxdiff = this.options.handleSize + 1; // used to store location of handlers
		for(var cell = 0, cells = 2; cell <= cells; cell++ ){  // using matrix again
			tops[cell] = ( (cell == 0) ? box.y + pxdiff : ((cell == 2) ? box.h + box.y : box.y + pxdiff  ) ) - pxdiff;
			lefts[cell] = ( (cell == 0) ? box.x + pxdiff : ((cell == 2) ? box.w + box.x : box.x + pxdiff ) ) - pxdiff;
		}

		for(var handleID in this.handlesGrid){ // get each handler's matrix location
			var grid = this.handlesGrid[handleID], handle = this.handles[handleID];
			var style = {
				'visibility' : 'visible',
				'top' : tops[grid[0]],
				'left' : lefts[grid[1]]
			}
			if (handleID == "N" || handleID == "S") {
				style.width = this.coords.start.w - pxdiff;
				style.height = this.options.handleSize;
			}
			if (handleID == "W" || handleID == "E") {
				style.height = this.coords.start.h - pxdiff;
				style.width = this.options.handleSize;
			}
			handle.setStyles(style); // just grab from grid
		}
	},
	hideHandles: function() {
		for (var handleID in this.handlesGrid) { // get each handler's matrix location
			var handle = this.handles[handleID];
			handle.hide();
		}
	},
	mouseMoveEvent: function(e) {
		if (this.isMouseDown) {
			var h = this.currentHandle;
			var coords = {top: this.coords.start.y, left: this.coords.start.x, width: this.coords.start.w, height: this.coords.start.h};
			var hc = {};
			var dx = e.client.x - this.coords.start.x;
			var dy = e.client.y - this.coords.start.y;
			if (h.row == 1) {
				if (h.col == 0) { // E
					coords.left = dx + this.coords.start.x;
					coords.width = this.coords.start.w - dx;
				}
				if (h.col == 2) { // W
					coords.width = dx;
				}
				hc.left = e.client.x - (this.options.handleSize / 2);
			}
			if (h.col == 1) {
				if (h.row == 0) { // N
					coords.top = dy + this.coords.start.y;
					coords.height = this.coords.start.h - dy;
				}
				if (h.row == 2) { // S
					coords.height = dy;
				}
				hc.top = e.client.y - (this.options.handleSize / 2);
			}
			if (h.row == 0) {
				if (h.col == 0) { //NW
					coords.left = dx + this.coords.start.x;
					coords.width = this.coords.start.w - dx;
					coords.top = dy + this.coords.start.y;
					coords.height = this.coords.start.h - dy;
				}
				if (h.col == 2) { //NE
					coords.width = dx;
					coords.top = dy + this.coords.start.y;
					coords.height = this.coords.start.h - dy;
				}
				if (h.col == 0 || h.col == 2) {
					hc.left = e.client.x - (this.options.handleSize / 2);
					hc.top = e.client.y - (this.options.handleSize / 2);
				}
			}
			if (h.row == 2) {
				if (h.col == 0) { //SW
					coords.left = dx + this.coords.start.x;
					coords.width = this.coords.start.w - dx;
					coords.height = dy;
				}
				if (h.col == 2) { //SE
					coords.width = dx;
					coords.height = dy;
				}
				if (h.col == 0 || h.col == 2) {
					hc.left = e.client.x - (this.options.handleSize / 2);
					hc.top = e.client.y - (this.options.handleSize / 2);
				}
			}
			coords.width = (coords.width < this.options.min.width) ? this.options.min.width : coords.width;
			coords.height = (coords.height < this.options.min.height) ? this.options.min.height : coords.height;
			this.currentHandle.handle.setStyles(hc);
			this.container.setStyles(coords);
			this.fireEvent('onMouseMove');
		}
	},
	mouseReleaseEvent: function(e) {
		this.isMouseDown = false;
		this.currentHandle = null;
		var coords = this.container.getCoordinates();
		this.coords.start = {
			x:coords.left,
			y:coords.top,
			w:coords.width,
			h:coords.height
		};
		this.showHandles();
		this.container.setStyle('border', '0px dashed #000');
		this.container.hide();
		window.removeEvent('mousemove', this.events['mousemove']);
		window.removeEvent('mouseup', this.events['mouseup']);
		this.fireEvent('onMouseUp', [coords]);
	},
	mousePressEvent: function(e, handle) {
		this.isMouseDown = true;
		this.currentHandle = { 'handle' : this.handles[handle], 'row' : this.handlesGrid[handle][0], 'col' : this.handlesGrid[handle][1]}; // important! used for easy matrix transforms.
		this.container.setStyle('border', '1px dashed #000');
		this.container.show();
		window.addEvent('mousemove', this.events['mousemove']);
		window.addEvent('mouseup', this.events['mouseup']);
		this.fireEvent('onMouseDown');
	}
})


Mt.DialogActions = new Enum('Close Maximize Minimize');

Mt.MPanel = new Class({
	Extends: Mt.MWidget,
	options: {
		onOpen: function(){},
		onClose: function(){},
		size: new Mt.MSize(400,400),
		text: '',
		icon: null,
		content: new Element('div')
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		this.__text = this.options.text;
		this.iconSrc = Mt.MBlankIcon;
		this.label = new Element('span', {'class': 'label', text: this.__text});
		this.icon = new Element('img', {src: this.iconSrc, styles: {'margin-top': 2}});
		this.__toolbarContainer = new Element('div', {
			styles: {
				height: 0
			} 
		}).inject(this.element);
		
		var contentElement = $(this.options.content);
		this.content = (contentElement) ? contentElement : new Element('div', {'html': this.options.content});
		this.content.inject(this.element);
		
		this.label.inject(this.container);
		this.icon.inject(this.label, 'top');
		
		this.container.addClass(this.__type());
	},
	__type: function() {
		this.type = 'MPanel';
		return this.type;
	},
	__build: function() {
		// Override to build the HTML elements
		// Should return element (DIV)
		var element = new Element('div', {
			events: this.events
		});
		
		return element;
	},
	toElement: function() {
		return this.content;
	},
	addToolBar: function() {
		this.__toolbar = new Mt.MToolBar(this);
		this.__toolbar.container.inject(this.__toolbarContainer);
		this.__toolbarContainer.setStyle('height', 35);
	},
	insertToolBar: function() {
		
	},
	menuBar: function() {
		
	},
	menuWidget: function() {
		
	},
	removeToolBar: function() {
		
	},
	setContent: function(content) {
		if ($(content) == null) {
			this.content.set('html', content);
		}
		else {
			this.content.grab(content);
		}
	},
	setContentURL: function(url) {
		this.content.load(url);
	},
	setIcon: function(icon) {
		this.icon.set('src', icon.toString());
	},
	setMenuBar: function() {
		
	},
	setMenuWidget: function() {
		
	},
	setStatusBar: function(statusBar) {
		if (statusBar === false) {
			if (this.__statusBar) {
				this.__statusBar.destroy();
			}
			this.container.removeClass('MPanelStatusBar');
		}
		else {
			this.container.addClass('MPanelStatusBar');
			this.__statusBar = statusBar;
		}
		
	},
	setToolButtonStyle: function() {
		
	},
	setWindowTitle: function(val) {
		this.label.set('text', val);
		this.icon.inject(this.label);
	},
	statusBar: function() {
		return this.statusBarEl;
	},
	toolBar: function() {
		return this.__toolbar;
	},
	toolButtonStyle: function() {
		
	},
	windowTitle: function() {
		return this.label.get('text');
	}
});


Mt.MPanel.Request = new Class({
	Extends: Mt.MPanel,
	options: {
		url: ''
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		
		this.content.set('load', {
			method: 'get',
			onFailure: function(e) {
				switch(e.status) {
					case 404:
						this.set('content', Mt.WindowURL_404);
						break;
					case 500:
						this.set('content', Mt.WindowURL_500);
						break;
				}
			}.bind(this)
		});
		
		if (this.options.contentURL) {
			this.content.load(this.options.contentURL);
		}
	},
	request: function() {
		this.content.load(this.url);
	},
	setURL: function(url) {
		this.url = url;
		this.request();
	}
})


Mt.MDialog = new Class({
	Extends: Mt.MPanel,
	options: {
		onMaximize: function(){},
		resize: false,
		move: true,
		actions: [Mt.DialogActions.Close]
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		
		this.isMaximized = false;
		
		this.container.addClass('MDialog');
		this.container.addClass('MPanel');
		var actions = new Element('div', {'class':'actions'}).inject(this.container);
		if (this.options.actions.contains(Mt.DialogActions.Close)) {
			new Element('div', {
				events: {
					'click': function(e){
						this.done()
					}.bind(this)
				},
				styles: {},
				'class':'action close'
			}).inject(actions);
		}
		if (this.options.actions.contains(Mt.DialogActions.Maximize)) {
			this._btnMaximize = new Element('div', {
				styles: {},
				'class':'action maximize',
				'events': {
					'click': function(e){
						this.maximize();
					}.bind(this)
				}
			}).inject(actions);
		}
		if (this.options.actions.contains(Mt.DialogActions.Minimize)) {
			new Element('div', {styles: {},'class':'action minimize'}).inject(actions);
		}
		
		if (this.options.move) {
			this.label.addClass('MPanelMove');
		}
		
		this.container.hide()
		
		if (this.options.resize) {
			this.sizer = new Mt.MResize(this.container, {
				onMouseUp: function(coords) {
					var w = coords.width - 12; // $FIXME$ This is the border-image width
					var h = coords.height - 53; // $FIXME$ This is the border-image height
					var y = coords.top;
					var x = coords.left;
					this.setGeometry(x,y,w,h);
				}.bind(this)
			});
			this.sizer.showHandles();
		}
		
		return this;
	},
	__type: function() {
		this.type = 'MDialog';
		return this.type;
	},
	binds: function() {
		this.events = {
			'open': this.showEvent.bind(this),
			'close': this.closeEvent.bind(this),
			'contextmenu': this.contextMenuEvent.bind(this),
			'resize': this.resizeEvent.bind(this)
		}
	},
	center: function() {
		var x = window.getSize().x / 2;
		var y = window.getSize().y / 2;
		var p = new Mt.MPoint(x, y);
		
		this.setGeometry(this.geometry().moveCenter(p));
		
		//return this.render();
	},
	closeEvent: function() {
		
	},
	contextMenuEvent: function() {
		
	},
	destroy: function(e) {
		$(this).destroy();
	},
	done: function() {
		this.container.hide();
		if (this.windowModality() > Mt.WindowModality.NonModal) {
			this.mask.hide();
		}
		if (this.options.resize) {
			this.sizer.hideHandles();
		}
		
		this.events.close();
		
		return 1;
	},
	maximize: function(up) {
		if (up == undefined || typeOf(up) == 'event') {
			var up = (this.isMaximized) ? false : true;
		}
		var winSize = window.getSize();
		
		if (!this.isMaximized) {
			this.floatSize = {
				w: this.size().width(),
				h: this.size().height(),
				x: this.pos.x,
				y: this.pos.y
			};
		}
		
		if (up) {
			this.size().setWidth(winSize.x - 6);
			this.size().setHeight(winSize.y - 45);
			this.pos.x = 0;
			this.pos.y = 0;
			document.body.setStyle('overflow', 'hidden');
			this.isMaximized = true;
			this._btnMaximize.addClass('restore');
		}
		else {
			this.size().setWidth(this.floatSize.w);
			this.size().setHeight(this.floatSize.h);
			this.pos.x = this.floatSize.x;
			this.pos.y = this.floatSize.y;
			this.isMaximized = false;
			document.body.setStyle('overflow', 'auto');
			this._btnMaximize.removeClass('restore');
		}
		
		this.render();
	},
	open: function() {
		if (this.options.move) {
			var myDrag = new Drag(this.container, {
				handle: this.label,
				onComplete: function(el, e) {
					var pos = el.getPosition();
					this.pos.x = pos.x;
					this.pos.y = pos.y;
					if (pos.y < 20) {
						this.maximize(true);
					}
					this.render();
				}.bind(this),
				onStart: function(el, e) {
					if (this.isMaximized) {
						this.isMaximized = false;
						var pos = el.getPosition();
						var offset = (this.floatSize.w * (e.client.x / window.getWidth()));
						this.pos.x = e.client.x;
						
						this.setGeometry(this.pos.x, this.pox.y, this.floatSize.w, this.floatSize.h)
						
						this._btnMaximize.removeClass('restore');
					}
				}.bind(this),
				onDrag: function(e) {
					this.fireEvent('onMoveEvent', [e]);
				}.bind(this)
			})
		}
		this.container.setStyle('display', 'block');
		if (this.windowModality() > Mt.WindowModality.NonModal) {
			this.mask = new Mask({destroyOnHide: true});
			this.mask.show();
		}
		//this.render();
		if (this.options.resize) {
			this.sizer.showHandles();
		}
		this.fireEvent('onOpen');
		this.events.open();
		
		return this;
	},
	setGeometry: function() {
		if (arguments.length > 1) {
			this.__geometry = new Mt.MRect(arguments[0],arguments[1],arguments[2],arguments[3]);
		}
		else {
			this.__geometry = arguments[0];
		}
		this.container.setStyles({
			top: this.__geometry.top(),
			left: this.__geometry.left(),
			width: this.__geometry.width(),
			height: this.__geometry.height()
		});
	},
	setWindowModality: function(modality) {
		this.__modality = (modality == undefined) ? Mt.WindowModality.NonModal : modality;
	},
	render: function(el) {
		var el = el || this.container;
		el.setStyles({
			width: this.geometry().width(),
			height: this.geometry().height(),
			top: this.geometry().y(),
			left: this.geometry().x()
		});
		
		if (this.options.resize) {
			var coords = el.getCoordinates();
			coords.x = coords.left; coords.y = coords.top; coords.w = coords.width; coords.h = coords.height;
			this.sizer.coords.start = coords;
			this.sizer.showHandles();
		}
		// $FIXME$ Border width padding
		var actionIconWidth = 14;
		var borderWidth = 12;
		this.label.setStyle('width', this.size().width() - (actionIconWidth * this.options.actions.length) - this.label.getStyle('padding-left').toInt() - borderWidth);
		
		return this;
	},
	resizeEvent: function() {
		
	},
	showEvent: function() {
		
	},
	__sizeGrip: function() {
		var grip = new Element('div', {
			'class': 'MDialogSizeGrip'
		});
		var isMouseDown = false;
		var pos = this.container.getPosition();
		var self = this;
		grip.inject(this.container);
		/*
		this.container.makeResizable({
			handle: grip,
			limit: {x: [200, window.getWidth()], y: [200, window.getHeight()]}
		});
		*/
	}
});

Mt.MMessageBox = new Class({
	Extends: Mt.MDialog,
	initialize: function(parent, options) {
		var options = options || {};
		var defaults =  {
			icon: Mt.MMessageBox.Icon.NoIcon,
			title: '',
			text: ''
			//buttons: Mt.MMessageBox.StandardButton.NoButton
		};
		options = Object.merge(options, defaults);
		var parentOptions = {
			size: new Mt.MSize(400,100),
			text: options.title,
			icon: options.icon,
			content: new Element('div'),
			modal: true,
			resize: false,
			move: false,
			actions: [Mt.DialogActions.Close]
		}
		this.parent(parent, parentOptions);
		
		this.__informativeText = null;
		this.__detailedText = null;
		this.__text = options.text;
		this.__buttons = [];
		this.__defaultButton = null;
		this.__icon = options.icon;
		
		this.element.addClass('MMessageBox');
		new Element('p').inject(this.content);
		new Element('p').inject(this.content, 'bottom')
		this.setText(this.text());
		this.setIcon();
		
		// Center and open
		this.center();
	},
	addButton: function(button, role) {
		switch (typeOf(arguments[0])) {
			case 'number':
				// From Enum
				var button = new Mt.MButton(this, {text: Mt.MMessageBox.StandardButton.getName(button)});
				break;
			case 'string':
				// Create a button
				break;
			case 'object':
				// Probably a button widget
				break;
		}
	},
	done: function() {
		this.container.destroy();
		if (this.options.modal) {
			this.mask.destroy();
		}
		
		this.events.close();
		
		return 1;
	},
	setButtonText: function(index, string) {
		this.buttons[index].setText(string);
	},
	setDefaultButton: function(index, string) {
		
	},
	setDetailedText: function(index, string) {
		
	},
	setIcon: function(icon) {
		var img = this.content.getElements('img');
		if (img.length == 0) {
			var img = new Element('img').inject(this.content, 'top');
		}
		else {
			img = img[0];
		}
		img.className = '';
		switch (icon) {
			case Mt.MMessageBox.Icon.Information:
				img.addClass('MMessageBoxIconInformation');
				break;
			case Mt.MMessageBox.Icon.Warning:
				img.addClass('MMessageBoxIconWarning');
				break;
			case Mt.MMessageBox.Icon.Critical:
				img.addClass('MMessageBoxIconCritical');
				break;
			case Mt.MMessageBox.Icon.Question:
				img.addClass('MMessageBoxIconQuestion');
				break;
		}
		img.src = Mt.MBlankIcon;
	},
	setStandardButtons: function() {
		for (var i=0;i<arguments.length;i++) {
			var item = arguments[i];
			this.addButton(item);
		}
	},
	setText: function(string) {
		this.__text = string;
		this.content.getElements('p')[0].set('text', this.__text);
	},
	setWindowTitle: function(string) {
		this.label.set('text', string);
	},
	setInformativeText: function(string) {
		this.content.lastChild.set('text', string);
	},
	text: function() {
		return this.__text;
	}
});
Mt.MMessageBox.ButtonRole = new Enum('InvalidRole AcceptRole RejectRole DestructableRole ActionRole HelpRole YesRole NoRole ApplyRole ResetRole', '-1 0 1 2 3 4 5 6 8 7');
Mt.MMessageBox.Icon = new Enum('NoIcon Information Warning Critical Question');
Mt.MMessageBox.StandardButton = new Enum('Ok Open Save Cancel Close Discard Apply Reset RestoreDefaults Help SaveAll Yes YesToAll No NoToAll Abort Restry Ignore NoButton', '0x00000400 0x00002000 0x00000800 0x00400000 0x00200000 0x00800000 0x02000000 0x04000000 0x08000000 0x01000000 0x00001000 0x00004000 0x00008000 0x00010000 0x00020000 0x00040000 0x00080000 0x00100000 0x00000000')
