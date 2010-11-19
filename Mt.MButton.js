Mt.MAbstractButton = new Class({
	Extends: Mt.MWidget,
	options: {
		icon: '/static/javascript/Mt/i/blank.png',
		text: ''
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		this.action = null;
		this.checkable = false;
		this.checked = false;
		this.down = false;
		this.setText(this.options.text);
		this.setIcon(this.options.icon);
		this.setOrientation(Mt.MAbstractButton.Orientation.TextOnRight);
	},
	__type: function() {
		this.type = 'MAbstractButton';
		return this.type;
	},
	addAction: function(action) {
		this.removeEvents('change');
		action.associatedWidgets.push(this);
		this.addEvent('change', function(e) {
			action.activate(Mt.MAction.ActionEvent.Trigger, e);
		});
		this.action = action;
		this.action.setText();
	},
	setCheckable: function(bool) {
		this.checkable = bool;
	},
	setChecked: function(bool) {
		this.checked = bool;
	},
	setDown: function(bool) {
		this.down = bool;
	},
	setIcon: function(icon) {
		switch (typeOf(icon)) {
			case 'string':
				this.iconSrc = icon;
				break;
			case 'element':
				this.iconSrc = icon.src;
				break;
			case 'boolean':
			case 'null':
				this.iconSrc = '/static/javascript/Mt/i/blank.png';
				break;
		}
		this.icon.src = this.iconSrc;
	},
	setIconSize: function(size) {
		this.iconSize = size;
		this.icon.setStyles({
			width: size.width,
			height: size.height
		});
	},
	setOrientation: function(o) {
		this.orientation = o;
	},
	setShortcut: function(string) {
		this.shortbut = string;
	},
	setText: function(string) {
		this.text = string;
		this.label.set('text', this.text);
	},
	toggle: function() {
		this.checked = (this.checked) ? false : true;
	}
});
Mt.MAbstractButton.Orientation = new Enum('TextOnRight TextOnLeft TextOnTop TextOnBottom');


Mt.MButton = new Class({
	Extends: Mt.MAbstractButton,
	options: {
		align: 'center',
		size: new Mt.MSize('auto', 14),
		onClick: function(){}
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		
		// Member Variables
		this.flat = false;
		this.menu = null;
		
		return this;
	},
	binds: function() {
		this.events = {
			'click': this.changeEvent.bind(this),
			'mouseup': this.mouseReleaseEvent.bind(this),
			'mousedown': this.mousePressEvent.bind(this),
			'mouseenter': this.focusInEvent.bind(this),
			'mouseleave': this.focusOutEvent.bind(this)
		}
	},
	__type: function() {
		this.type = 'MButton';
		return this.type;
	},
	__build: function() {
		var element = new Element('div', {
			'class': 'MButton',
			styles: {
				'text-align': this.options.align
			},
			events: this.events
		});
		var textDiv = new Element('div').inject(element);
		var iconDiv = new Element('div').inject(element);
		// HTML Elements
		this.label = new Element('div').inject(textDiv);
		this.icon = new Element('img').inject(iconDiv);
		
		//if (this.orientation == Mt.MAbstractButton.Orientation.TextOnRight || this.orientation == Mt.MAbstractButton.Orientation.TextOnLeft) {
			this.textShim = new Element('div').inject(textDiv, 'top');
			this.iconShim = new Element('div').inject(iconDiv, 'top');
		//}
		
		window.addEvent('mouseup', this.events['mouseup']);
		
		return element;
	},
	changeEvent: function(e) {
		if (this.checkable) {
			var checkState = (this.checked) ? false : true;
			this.setChecked(checkState);
		}
		this.fireEvent('change', [e]);
	},
	focusInEvent: function(e) {
		e.stop();
		this.isFocus = true;
	},
	focusOutEvent: function(e) {
		e.stop();
		this.isFocus = false;
	},
	mouseMoveEvent: function(e) {
		
	},
	mousePressEvent: function(e) {
		e.stop();
		this.isMouseDown = true;
		this.isFocus = true;
		var newClass = (this.flat) ? 'MButtonFlatDown' : 'MButtonDown';
		this.element.addClass(newClass);
	},
	mouseReleaseEvent: function(e) {
		e.stop();
		this.isMouseDown = false;
		var newClass = (this.flat) ? 'MButtonFlatDown' : 'MButtonDown';
		if (!this.checkable) {
			this.element.removeClass(newClass);
		}
		if (this.menu) {
			var children = this.container.getElements('*');
			if (children.contains(e.target)) {
				this.showMenu();
			}
		}
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
		
		this.shim.setStyles({
			height: newScale.height / 2 - 8
		});
		
		this.render();
		this.fireEvent('onResize', newScale);
		
		return newScale;
	},
	setChecked: function(bool) {
		this.checked = bool;
		var newClass = (this.flat) ? 'MButtonFlatDown' : 'MButtonDown';
		if (bool) {
			this.element.addClass(newClass);
		}
		else {
			this.element.removeClass(newClass);
		}
	},
	setFlat: function(bool) {
		this.flat = bool;
		this.element.addClass('MButtonFlat');
	},
	setIcon: function(icon) {
		switch (typeOf(icon)) {
			case 'string':
				this.iconSrc = icon;
				break;
			case 'element':
				this.iconSrc = icon.src;
				break;
			case 'boolean':
			case 'null':
				this.iconSrc = '/static/javascript/Mt/i/blank.png';
				break;
		}
		this.icon.src = this.iconSrc;
		if (this.orientation > Mt.MAbstractButton.Orientation.TextOnLeft) {
			this.iconShim.setStyle('height', 0);
		}
		else {
			this.icon.onload = function(img) {
				var iconShimHeight = (this.size().height / 2) - (this.icon.height / 2);
				this.iconShim.setStyle('height', Math.max(0, iconShimHeight));
				this.setText(this.text);
			}.bind(this);
		}
		
	},
	setMenu: function(menu) {
		this.menu = menu;
		new Element('img', {src: '/static/javascript/Mt/i/DownArrow.png','style':'padding: 0px 4px;'}).inject(this.label)
	},
	setText: function(string) {
		if (this.orientation > Mt.MAbstractButton.Orientation.TextOnLeft) {
			this.textShim.setStyle('height', 0);
		}
		else {
			var textShimHeight = (this.size().height / 2) - (14 / 2); //FIXME text line height
			this.textShim.setStyle('height', Math.max(0, textShimHeight));
		}
		this.text = string;
		this.label.set('text', this.text);
	},
	setOrientation: function(o) {
		this.orientation = o;
		if (this.orientation > Mt.MAbstractButton.Orientation.TextOnLeft) {
			this.element.removeClass('MButtonH');
			this.element.addClass('MButtonV');
			this.container.setStyle('height', 'auto');
		}
		else {
			this.element.removeClass('MButtonV');
			this.element.addClass('MButtonH');
		}
		switch (this.orientation) {
			case Mt.MAbstractButton.Orientation.TextOnRight:
				this.label.parentNode.inject(this.element, 'bottom');
				break;
			case Mt.MAbstractButton.Orientation.TextOnLeft:
				this.label.parentNode.inject(this.element, 'top');
				break;
			case Mt.MAbstractButton.Orientation.TextOnTop:
				this.label.parentNode.inject(this.element, 'top');
				break;
			case Mt.MAbstractButton.Orientation.TextOnBottom:
				this.label.parentNode.inject(this.element, 'bottom');
				break;
		}
		this.setText(this.text);
		this.setIcon(this.icon);
	},
	showMenu: function() {
		this.menu.popup(new Mt.MPoint(this.container.getPosition().x, this.container.getPosition().y + this.element.getHeight()));
	}
});


Mt.MSplitButton = new Class({
	Extends: Mt.MButton,
	options: {
		
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		
		// Member variables
	},
	__type: function() {
		this.type = 'MSplitButton';
		return this.type;
	},
	mouseReleaseEvent: function(e) {
		e.stop();
		this.isMouseDown = false;
		var newClass = (this.flat) ? 'MButtonFlatDown' : 'MButtonDown';
		this.element.removeClass(newClass);
		if (this.menu) {
			if (e.target == this.menuElement) {
				this.showMenu();
			}
		}
	},
	setMenu: function(menu) {
		this.menu = menu;
		this.menuElement = new Element('div', {
			'class': 'MSplitButton',
			styles: {
				'height': this.size().height
			}
		}).inject(this.label, 'before');
	}
});