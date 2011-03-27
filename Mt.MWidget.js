Mt.MWidget = new Class({
	Extends: Mt.MObject,
	Implements: [Events, Options],
	options: {
		onClose: function(){},
		onFocusInEvent: function(){},
		onFocusOutEvent: function(){},
		onMouseMove: function(){},
		onFocus: function(){},
		onBlur: function(){},
		onMouseReleaseEvent: function(){},
		onMousePressEvent: function(){},
		onClick: function(){},
		onMouseDoubleClickEvent: function(){},
		onMouseWheel: function(){},
		onResize: function(){},
		position: new Mt.MPoint(),
		size: new Mt.MSize(500,500)
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		this.parentObj = (parent == null) ? $(document.body) : parent;
		this.setOptions(options);
		
		this.MWidget = true;
		this.guid = Mt.getGUID();
		
		this.container = new Element('div', {
			'class': 'MWidget',
			'id': 'Mt_' + this.guid,
			'load': {
				onFailure: function(){
					alert('failed to load content')
				}
			}
		}).inject($(this.parentObj));
		
		this.focus = false;
		this.enabled = true;
		this.visible = true;
		this.acceptsDrops = false;
		this.__geometry = new Mt.MRect();
		this.__layout = new Mt.MLayout();
		this.__maxSize = new Mt.MSize();
		this.__minSize = new Mt.MSize();
		this.__savedGeo = null;
		this.__modality = Mt.WindowModality.NonModal;
		
		this.setGeometry(this.container.getPosition().x, this.container.getPosition().y, this.options.size.width(), this.options.size.height());
		
		this.binds();
		this.element = this.__build();
		this.element.inject(this.container);
		this.setGeometry(this.container.getPosition().x, this.container.getPosition().y, this.options.size.width(), this.options.size.height());
		if (typeOf(this.parentWidget()) == 'object') {
			this.parentWidget().layout().update();
		}
	},
	__type: function() {
		this.type = 'MWidget';
		return this.type;
	},
	__build: function() {
		// Override to build the HTML elements
		// Should return element (DIV)
		var element = new Element('div', {
			events: this.events,
			'class': this.type,
			styles: {
				width: this.size().width(),
				height: this.size().height()
			}
		});
		
		return element;
	},
	binds: function() {
		this.events = {
			'mouseover': this.focusInEvent.bind(this),
			'mousedown': this.mousePressEvent.bind(this),
			'mouseleave': this.focusOutEvent.bind(this),
			'mouseup': this.mouseReleaseEvent.bind(this),
			'mousemove': this.mouseMoveEvent.bind(this),
			'click': this.changeEvent.bind(this),
			'dblclick': this.mouseDoubleClickEvent.bind(this),
			'move': this.moveEvent.bind(this)
		}
	},
	actions: function() {
		throw 'Not Yet Implemented';
	},
	addAction: function(action) {
		throw 'Not Yet Implemented';
	},
	addActions: function(list) {
		throw 'Not Yet Implemented';
	},
	adjustSize: function() {
		throw 'Not Yet Implemented';
	},
	baseSize: function() {
		throw 'Not Yet Implemented';
	},
	changeEvent: function(e) {
		this.fireEvent('onChange', [e])
	},
	childrenRect: function() {
		throw 'Not Yet Implemented';
	},
	childrenRegion: function() {
		throw 'Not Yet Implemented';
	},
	clearFocus: function() {
		throw 'Not Yet Implemented';
	},
	clearMask: function() {
		throw 'Not Yet Implemented';
	},
	close: function() {
		this.fireEvent('onClose')
		
		return this;
	},
	create: function() {
		
	},
	contentsRect: function() {
		throw 'Not Yet Implemented';
	},
	cursor: function() {
		return this.container.getStyle('cursor');
	},
	destroy: function() {
		this.container.destroy();
		this.fireEvent('onDestroy');
		
		return this;
	},
	focusInEvent: function(e) {
		this.fireEvent('onFocusInEvent', [e]);
	},
	focusNextChild: function() {
		throw 'Not Yet Implemented';
	},
	focusNextPrevChild: function(next) {
		throw 'Not Yet Implemented';
	},
	focusOutEvent: function(e) {
		this.fireEvent('onFocusOutEvent', [e]);
	},
	geometry: function() {
		return this.__geometry;
	},
	handle: function() {
		return this.guid;
	},
	hasFocus: function() {
		throw 'Not Yet Implemented';
	},
	height: function() {
		this.container.getHeight();
	},
	hide: function() {
		this.container.hide();
	},
	insertAction: function(before, action) {
		throw 'Not Yet Implemented';
	},
	insertActions: function(before, list) {
		throw 'Not Yet Implemented';
	},
	isAncestorOf: function(widget) {
		this.children.each(function(child) {
			if (widget == child) {
				return true;
			}
		})
		
		return false;
	},
	isEnabled: function() {
		return this.enabled;
	},
	isHidden: function() {
		return !this.isVisible();
	},
	isVisible: function() {
		return this.container.isVisible();
	},
	layout: function() {
		return this.__layout;
	},
	mask: function() {
		throw 'Not Yet Implemented';
	},
	maximumHeight: function() {
		return this.__maxSize.height();
	},
	maximumSize: function() {
		return this.__maxSize;
	},
	maximumWidth: function() {
		return this.__maxSize.width();
	},
	minimumHeight: function() {
		return this.__minSize.height();
	},
	minimumSize: function() {
		return this.__minSize;
	},
	minimumWidth: function() {
		return this.__minSize.width();
	},
	move: function() {
		var point = (arguments.length > 1) ? new Mt.MPoint(arguments[0], arguments[1]) : arguments[0];
		
		this.geometry().moveCenter(point);
	},
	mouseDoubleClickEvent: function(e) {
		this.fireEvent('onMouseDoubleClickEvent', [e]);
	},
	mouseMoveEvent: function(e) {
		this.fireEvent('onMouseMoveEvent', [e]);
	},
	mousePressEvent: function(e) {
		this.fireEvent('onMousePressEvent', [e]);
	},
	mouseReleaseEvent: function(e) {
		this.fireEvent('onMouseReleaseEvent', [e]);
	},
	moveEvent: function(e) {
		this.fireEvent('onMoveEvent', [e]);
	},
	parentWidget: function() {
		return this.parentObj;
	},
	pos: function() {
		var pos = this.container.getPosition();
		return new Mt.MPoint(pos.x, pos.y);
	},
	rect: function() {
		return this.geometry();
	},
	render: function() {
		throw 'Not Yet Implemented';
	},
	resize: function() {
		var size = (arguments.length > 1) ? new Mt.MSize(arguments[0], arguments[1]) : arguments[0];
		console.log(this.geometry().setSize(size));
		this.setGeometry(this.geometry().setSize(size));
	},
	restoreGeometry: function() {
		return this.geometery().setRect(this.__savedGeo.x, this.__savedGeo.y, this.__savedGeo.width, this.__savedGeo.height);
	},
	saveGeometry: function() {
		var geo = this.geometry();
		var obj = {
			x: geo.x(),
			y: geo.y(),
			width: geo.width(),
			height: geo.height()
		}
		this.__savedGeo = obj;
		
		return this.__savedGeo;
	},
	scroll: function(x, y) {
		throw 'Not Yet Implemented';
	},
	setCursor: function(cursor) {
		this.container.setStyle('cursor', cursor);
	},
	setDiabled: function(bool) {
		bool = (bool == undefined) ? true : bool;
		this.setEnabled(!bool);
	},
	setEnabled: function(bool) {
		bool = (bool == undefined) ? true : bool;
		if (bool) {
			if (this.disabledFrame) {
				this.disabledFrame.destroy();
			}
			this.element.removeClass('MWidgetDisabled');
		}
		else {
			this.disabledFrame = new Element('div', {'class':'MWidgetDisabledFrame'}).inject(this.container, 'top');
			this.disabledFrame.setStyles(this.disabledFrame.getNext().getDimensions());
			this.element.addClass('MWidgetDisabled');
		}
		
		return this
	},
	setFixedHeight: function() {
		throw 'Not Yet Implemented';
	},
	setFixedSize: function() {
		throw 'Not Yet Implemented';
	},
	setFixedWidth: function() {
		throw 'Not Yet Implemented';
	},
	setFocus: function() {
		this.container.focus();
	},
	setGeometry: function() {
		if (arguments.length > 1) {
			this.__geometry = new Mt.MRect(arguments[0],arguments[1],arguments[2],arguments[3]);
		}
		else {
			this.__geometry = arguments[0];
		}
		this.container.setStyles({
			//top: this.__geometry.top(),
			//left: this.__geometry.left(),
			width: this.__geometry.width(),
			height: this.__geometry.height()
		});
		
		return this;
	},
	setHidden: function(bool) {
		bool = (bool == undefined) ? true : bool;
		this.setVisible(!bool);
	},
	setLayout: function(layout) {
		this.__layout = layout;
		this.__layout.setParent(this);
		this.__layout.update();
	},
	setMask: function(mask) {
		throw 'Not Yet Implemented';
	},
	setMaximumHeight: function(height) {
		this.__maxSize.setHeight(height);
	},
	setMaximumSize: function() {
		this.__maxSize = (arguments.length > 1) ? new Mt.MSize(arguments[0], arguments[1]) : arguments[0];
	},
	setMaximumWidth: function(width) {
		this.__maxSize.setWidth(width);
	},
	setMinimumHeight: function(height) {
		this.__minSize.setHeight(height);
	},
	setMinimumSize: function() {
		this.__minSize = (arguments.length > 1) ? new Mt.MSize(arguments[0], arguments[1]) : arguments[0];
	},
	setMinimumWidth: function(width) {
		this.__minSize.setWidth(width);
	},
	setParent: function(widget) {
		if (widget.MWidget) {
			this.parentObj = widget;
			widget.children.push(this);
			$(widget).grab(this.element);
			widget.layout().update();
			
			return this;
		}
		if (typeOf(widget) == 'element') {
			this.parentObj = widget;
			$(widget).grab(this.container);
			
			return this;
		}
		throw("MWidget or Element required")
	},
	setSizePolicy: function() {
		var size = (arguments.length == 2) ? new Mt.MSize(arguments[0], arguments[1]) : s;
		this.__size = size;
		this.container.setStyles({
			width: size.width(),
			height: size.height()
		});
	},
	setTooltip: function(tooltip) {
		this.container.alt = tooltip;
	},
	setVisible: function(bool) {
		bool = (bool == undefined) ? true : bool;
		this.__visible = bool;
		if (bool) {
			this.container.show();
		}
		else {
			this.container.hide();
		}
	},
	setWindowModality: function(modality) {
		modality = (modality == undefined) ? Mt.WindowModality.NonModal : modality;
	},
	show: function() {
		
	},
	size: function() {
		return this.geometry().size();
	},
	sizeHint: function() {
		
	},
	tooltip: function() {
		return this.container.alt;
	},
	underMouse: function() {
		throw 'Not Yet Implemented';
	},
	update: function() {
		throw 'Not Yet Implemented';
	},
	updateGeometry: function() {
		throw 'Not Yet Implemented';
	},
	visibleRegion: function() {
		throw 'Not Yet Implemented';
	},
	windowModality: function() {
		return this.__modality;
	},
	width: function() {
		this.container.getWidth();
	},
	x: function() {
		this.container.getPosition().x;
	},
	y: function() {
		this.container.getPosition().y;
	},
	toElement: function() {
		return this.element;
	},
	__postInit: function() {
		// Method to do things after the parent init has gone through
		// Must be explicitly called
	}
});