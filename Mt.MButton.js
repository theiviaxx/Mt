Mt.MAbstractButton = new Class({
	Extends: Mt.MWidget,
	initialize: function(parent, options){
		this.parent(parent, options)
		this.type = 'MAbstractButton';
		
		// Member variables
		this.action = null;
		this.iconSrc = '/static/javascript/Mt/i/blank.png';
		this.iconSize = new Mt.MSize(1,1);
		this.checkable = false;
		this.checked = false;
		this.down = false;
		this.text = '';
		
		// HTML Elements
		this.label = new Element('div', {text: this.text});
		this.icon = new Element('img', {src: this.iconSrc});
		
		// Final injection into DOM
		this.container.inject(this.parentObj);
	},
	addAction: function(action) {
		this.removeEvents('click');
		action.associatedWidgets.push(this);
		this.addEvent('click', action.activate.bindWithEvent(action));
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
		switch ($type(icon)) {
			case 'string':
				this.iconSrc = icon;
				break;
			case 'element':
				this.iconSrc = icon.src;
				break;
		}
		this.icon.src = this.iconSrc;
	},
	setIconSize: function(size) {
		this.iconSize = size;
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

Mt.MButton = new Class({
	Extends: Mt.MAbstractButton,
	options: {
		align: 'center',
		icon: null,
		text: '',
		size: new Mt.MSize('auto', 14),
		onClick: function(){}
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		this.type = 'MButton';
		
		// Member Variables
		this.flat = false;
		this.menu = null;
		
		this.setText(this.options.text);
		if (this.options.icon) {
			this.setIcon(this.options.icon);
			this.setIconSize(new Mt.MSize(16, 16));
		}
		
		this.build();
		
		this.container.inject($(this.parentObj))
		
		
		return this;
	},
	build: function() {
		var self = this;
		this.element.addClass('MWidget MButton');
		
		this.element.setStyles({
			height: this.size.height,
			width: this.size.width,
			'text-align': this.options.align
		});
		this.shim = new Element('div').inject(this.element);
		this.shim.setStyles({
			height: this.size.height / 2 - 8
		})
		var floater = new Element('div', {'class':'vcenter'}).inject(this.element);
		this.icon.inject(floater);
		this.label.inject(floater);
		
		this.element.addEvent('mousedown', function(e) {
			e.stop();
			self.isMouseDown = true;
			self.isFocus = true;
			var newClass = (this.flat) ? 'MButtonFlatDown' : 'MButtonDown';
			self.element.addClass(newClass);
		})
		//this.element.addEvent('mouseup', function(e) {
		window.addEvent('mouseup', function(e) {
			e.stop();
			self.isMouseDown = false;
			var newClass = (this.flat) ? 'MButtonFlatDown' : 'MButtonDown';
			self.element.removeClass(newClass);
		});
		this.element.addEvent('click', function(e) {
			this.fireEvent('onClick', [e]);
		})
		
		this.element.addEvent('mousemove', function(e) {
			
		})
		this.container.addEvent('mouseleave', function(e) {
			e.stop();
			self.isFocus = false;
		});
		this.element.addEvent('mouseenter', function(e) {
			e.stop();
			self.isFocus = true;
		});
	},
	resize: function(width, height, ratio) {
		var newScale;
		ratio = ratio || Mt.AspectRatioMode.IgnoreAspectRatio;
		if ($type(width) == 'number') {
			newScale = this.size.scale(width, height, ratio);
		}
		else {
			newScale = this.size.scale(width, ratio)
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
	setFlat: function(bool) {
		this.flat = bool;
		this.element.addClass('MButtonFlat');
	},
	setMenu: function(menui) {
		
	},
	showMenu: function() {
		
	}
})