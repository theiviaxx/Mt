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
		
		this.container = new Element('div', {
			'class': 'MWidget',
			'load': {
				onFailure: function(){
					alert('failed to load content')
				}
			}
		}).inject($(this.parentObj));
		
		this.setPosition(this.options.position);
		this.setSize(this.options.size); 
		
		this.MWidget = true;
		
		this.focus = false;
		this.enabled = true;
		this.visible = true;
		this.acceptsDrops = false;
		
		
		
		this.binds();
		this.element = this.__build();
		this.element.inject(this.container);
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
				width: this.size().width,
				height: this.size().height
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
	changeEvent: function(e) {
		this.fireEvent('onChange', [e])
	},
	close: function() {
		this.fireEvent('onClose')
		
		return this;
	},
	create: function() {
		
	},
	destroy: function() {
		this.container.destroy();
		this.fireEvent('onDestroy');
		
		return this;
	},
	focusInEvent: function(e) {
		this.fireEvent('onFocusInEvent', [e]);
	},
	focusOutEvent: function(e) {
		this.fireEvent('onFocusOutEvent', [e]);
	},
	geometry: function() {
		return new Mt.MRect(this.position(), this.size());
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
	isVisible: function() {
		return this.visible;
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
	position: function() {
		var pos = this.container.getPosition();
		return new Mt.MPoint(pos.x, pos.y);
	},
	render: function() {
		var geo = this.geometry();
		this.element.setStyles({
			width: geo.width,
			height: geo.height,
			top: geo.y,
			left: geo.x
		});
		
		return this;
	},
	resize: function(width, height, ratio) {
		var newScale;
		ratio = ratio || Mt.AspectRatioMode.IgnoreAspectRatio;
		if ($type(width) == 'number') {
			newScale = this.size().scale(width, height, ratio);
		}
		else {
			newScale = this.size().scale(width, ratio)
		}
		this.geometry.width =  newScale.width;
		this.geometry.height =  newScale.height;
		this.render();
		
		this.fireEvent('onResize', newScale)
		return newScale;
	},
	setAcceptsDrops: function(bool) {
		this.acceptsDrops = bool
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
			this.disabledFrame = new Element('div', {'class':'MWidgetDisabledFrame'}).inject(this.container);
			this.element.addClass('MWidgetDisabled');
		}
		this.render();
		
		return this
	},
	setFocus: function() {
		
	},
	setGeometry: function(rect, h, x, y) {
		if ($type(rect) == 'number') {
			this.pos.x = x;
			this.pos.y = y;
			this.size().width = rect;
			this.size().height = h;
		}
		else {
			this.geometry = rect;
		}
		
		return this;
	},
	setSize: function(s) {
		this.container.setStyles({
			width: s.width,
			height: s.height
		})
	},
	setVisible: function(bool) {
		this.visible = bool;
		if (bool) {
			this.element.show();
		}
		else {
			this.element.hide();
		}
	},
	setParent: function(widget) {
		if (widget.MWidget) {
			this.parentObj = widget;
			widget.children.push(this);
			$(widget).grab(this.element);
			
			return this;
		}
		throw("MWidget required")
	},
	setPosition: function(p) {
		this.pos = p;
		this.container.setStyles({
			top: p.y,
			left: p.x
		});
	},
	size: function() {
		return new Mt.MSize(this.container.getWidth(), this.container.getHeight());
	},
	sizeHint: function() {
		
	},
	show: function() {
		
	},
	/*
	setSize: function(size, height) {
		if (typeOf(size) == 'number') {
			this.geometry.width = size;
			this.geometry.height = height;
		}
		else {
			this.geometry.width = size.width;
			this.geometry.height = size.height;
		}
		this.render();
		return this;
	},
	*/
	toElement: function() {
		return this.element;
	},
	__postInit: function() {
		// Method to do things after the parent init has gone through
		// Must be explicitly called
	}
});