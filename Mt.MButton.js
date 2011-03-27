Mt.MAbstractButton = new Class({
	Extends: Mt.MWidget,
	options: {
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
		
		return action;
	},
	setCheckable: function(bool) {
		this.checkable = bool;
		
		return this;
	},
	setChecked: function(bool) {
		this.checked = bool;
		
		return this;
	},
	setDown: function(bool) {
		this.down = bool;
		
		return this;
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
				this.iconSrc = Mt.MBlankIcon;
				break;
		}
		this.icon.src = this.iconSrc;
		
		return this;
	},
	setIconSize: function(size) {
		this.iconSize = size;
		this.icon.setStyles({
			width: size.width(),
			height: size.height()
		});
		
		return this;
	},
	setOrientation: function(o) {
		this.orientation = o;
		
		return this;
	},
	setShortcut: function(string) {
		this.shortbut = string;
		
		return this;
	},
	setText: function(string) {
		this.__text = string;
		this.label.set('text', this.__text);
		
		return this;
	},
	text: function() {
		return this.__text;
	},
	toggle: function() {
		this.checked = (this.checked) ? false : true;
		
		return this;
	}
});
Mt.MAbstractButton.Orientation = new Enum('TextOnRight TextOnLeft TextOnTop TextOnBottom');


Mt.MPushButton = new Class({
	Extends: Mt.MAbstractButton,
	options: {
		align: 'center',
		size: new Mt.MSize('auto', 24),
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
		this.fireEvent('click', [e]);
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
			if (e.target == this.menuElement && !e.rightClick) {
				e.stop();
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
		this.geometry.width =  newScale.width();
		this.geometry.height =  newScale.height();
		
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
		
		return this;
	},
	setFlat: function(bool) {
		this.flat = bool;
		this.element.addClass('MButtonFlat');
		
		return this;
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
				this.iconSrc = Mt.MBlankIcon;
				break;
		}
		this.icon.src = this.iconSrc;
		if (this.orientation > Mt.MAbstractButton.Orientation.TextOnLeft) {
			this.iconShim.setStyle('height', 0);
		}
		else {
			var padding = Mt.StyleParser.toList(this.element.getStyle('padding'));
			if (this.icon.complete) {
				var iconShimHeight = (this.geometry().size().height() / 2) - (this.icon.height / 2) - padding[0];
				this.iconShim.setStyle('height', Math.max(0, iconShimHeight));
			}
			else {
				this.icon.onload = function(img) {
					var iconShimHeight = (this.geometry().height() / 2) - (this.icon.height / 2) - padding[0];
					this.iconShim.setStyle('height', Math.max(0, iconShimHeight));
					this.setText(this.text());
				}.bind(this);
			}
		}
		
		return this;
	},
	setMenu: function(menu) {
		//this.menu = menu;
		//new Element('img', {src: '../i/DownArrow.png','style':'padding: 0px 4px;'}).inject(this.label)
		this.menu = menu;
		this.menuElement = new Element('div', {
			'class': 'MSplitButton',
			styles: {
				'height': this.size().height()
			}
		}).inject(this.label, 'before');
		this.label.setStyle('width', this.label.getWidth() + 16); // $FIXME$ width of menu arrow + padding
		
		return this;
	},
	setText: function(string) {
		if (this.orientation > Mt.MAbstractButton.Orientation.TextOnLeft) {
			this.textShim.setStyle('height', 0);
		}
		else {
			var padding = Mt.StyleParser.toList(this.element.getStyle('padding'));
			var textShimHeight = (this.size().height() / 2) - (14 / 2) - padding[0]; //FIXME text line height
			this.textShim.setStyle('height', Math.max(0, textShimHeight));
		}
		this.__text = string;
		this.label.set('text', this.text());
		
		return this;
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
		this.setText(this.__text);
		this.setIcon(this.icon);
		
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
			width: this.__geometry.width(),
			height: this.__geometry.height()
		});
		
		if (this.element) {
			this.element.setStyles({
				width: this.__geometry.width() - 10,
				height: this.__geometry.height() - 10
			});
			this.setText(this.__text);
			this.setIcon(this.icon);
		}
		
		return this;
	},
	showMenu: function() {
		this.menu.popup(new Mt.MPoint(this.geometry().x(), this.geometry().y() + this.geometry().height()));
	}
});


Mt.MSplitButton = new Class({
	Extends: Mt.MPushButton,
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
			if (e.target == this.menuElement && !e.rightClick) {
				this.showMenu();
			}
		}
	},
	setMenu: function(menu) {
		this.menu = menu;
		this.menuElement = new Element('div', {
			'class': 'MSplitButton',
			styles: {
				'height': this.size().height() - 10 // $FIXME$ padding + border
			}
		}).inject(this.label, 'before');
		this.label.setStyle('width', this.label.getWidth() + 16); // $FIXME$ width of menu arrow + padding
	}
});