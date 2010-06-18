var Mooey = {};

Mooey.MObject = new Class({
	initialize: function(parent) {
		this.parentObj = parent || null;
		this.children = [];
		this.type = 'MObject';
		this.name = '';
	},
	findChild: function(type, name) {
		this.children.each(function(item) {
			if (item.type == type && item.name == name) {
				return item;
			}
		})
		
		return false;
	},
	findChildren: function(type, name) {
		var found = [];
		this.children.each(function(item) {
			switch ($type(name)) {
				case 'string':
					if (item.type == type && item.name == name) {
						found.push(item);
					}
					break;
				case 'regexp':
					if (item.type == type && item.name == name) {
						found.push(item);
					}
					break;
			}
		})
		
		return found;
	},
	inherits: function(type) {
		return (this.parentObj.type == type) ? true : false;
	},
	isWidgetType: function() {
		return this.inherits('MWidget');
	}
});

Mooey.MSize = new Class({
	Implements: Options,
	initialize: function(width, height) {
		this.width = width || 0;
		this.height = height || 0;
		this.type = 'MSize';
	},
	isEmpty: function() {
		return (this.width <= 0 || this.height <= 0) ? true : false;
	},
	isNull: function() {
		return (this.width <= 0 && this.height <= 0) ? true : false;
	},
	scale: function(width, height, ratioMode) {
		if ($type(width) == 'number') {
			width = width;
			height = height;
			ratioMode = ratioMode || 'ignore'
		}
		else {
			width = width.width;
			height = width.height;
			ratioMode = height;
		}
		var newSize = new Mooey.Size();
		var ratio = width / height;
		switch (ratioMode) {
			case 'ignore':
				newSize.width = width;
				newSize.height = height;
				break;
			case 'keep':
				if (ratio > 1.0) {
					// wide
					newSize.width = width;
					newSize.height = height * ratio;
				}
				else {
					// tall
					newSize.width = width * ratio;
					newSize.height = height;
				}
				break;
			case 'expand':
				if (ratio > 1.0) {
					// wide
					newSize.width = width * ratio;
					newSize.height = height;
				}
				else {
					// tall
					newSize.width = width;
					newSize.height = height * ratio;
				}
				break;
		}
		
		return newSize;
	},
	transpose: function() {
		var w = this.width;
		var h = this.height;
		this.width = h;
		this.height = w;
		
		return this;
	}
});

Mooey.MRect = new Class({
	initialize: function(args) {
		this.type = 'MRect';
		if (args.length == 2) {
			switch(args[1].type) {
				case 'MPoint':
					this.x = args[0].x;
					this.y = args[0].y;
					this.width = args[1].x - this.x;
					this.height = args[1].y - this.y;
					break;
				case 'MSize':
					this.x = args[0].x;
					this.y = args[0].y;
					this.width = args[1].width;
					this.height = args[1].height;
					break;
			}
		}
		if (args.length == 4) {
			this.x = args[0];
			this.y = args[1];
			this.width = args[2];
			this.height = args[3];
		}
	}
});

Mooey.MPoint = new Class({
	initialize: function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		this.type = 'MPoint';
	}
});

Mooey.MWidget = new Class({
	Extends: Mooey.MObject,
	Implements: [Events, Options],
	options: {
		onClose: $empty,
		onMouseOver: $empty,
		onMouseOut: $empty,
		onMouseMove: $empty,
		onFocus: $empty,
		onBlur: $empty,
		onMouseUp: $empty,
		onMouseDown: $empty,
		onClick: $empty,
		onDoubleClick: $empty,
		onMouseWheel: $empty,
		onResize: $empty
	},
	initialize: function(parent, options) {
		this.parentObj = (parent == null) ? $(document.body) : parent;
		this.setOptions(options);
		this.size = new Mooey.MSize()
		this.pos = new Mooey.MPoint();
		this.geometry = new Mooey.MRect(this.pos, this.size);
		this.type = 'MWidget';
	},
	close: function() {
		this.fireEvent('onClose')
		
		return this;
	},
	create: function() {
		
	},
	destroy: function() {
		this.fireEvent('onDestroy');
		
		return this;
	},
	resize: function(width, height) {
		var newScale;
		if ($type(width) == 'number') {
			newScale = this.size.scale(width, height, 'keep');
		}
		else {
			newScale = this.size.scale(width, 'keep')
		}
		
		this.fireEvent('onResize', newScale)
		return newScale;
	}
})

Mooey.MDialog = new Class({
	Extends: Mooey.MWidget,
	options: {
		onOpen: $empty,
		onClose: $empty,
		width: 400,
		height: 400,
		label: '',
		image: '/static/images/blank.png',
		content: new Element('div'),
		modal: true
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		this.size = new Mooey.MSize(this.options.width, this.options.height);
		this.container = new Element('div', {
			'class': 'MDialog',
			styles: {
				width: this.size.width,
				height: this.size.width,
				display: 'none'
			}
		});
		this.options.content.setStyles({
			left: -24,
			width: this.container.getStyle('width').toInt() + 48,
			height: '100%',
			position: 'absolute'
		}).inject(this.container);
		
		this.label = new Element('span', {
			'class': 'label',
			text: this.options.label
		}).inject(this.container);
		this.image = new Element('img', {
			src: this.options.image,
			styles: {
				'margin-top': 2
			}
		}).inject(this.label, 'top');
		
		var actions = new Element('div', {'class':'actions'}).inject(this.container)
		new Element('div', {styles: {},'class':'action close'}).inject(actions)
		new Element('div', {styles: {},'class':'action minimize'}).inject(actions)
		new Element('div', {styles: {},'class':'action maximize'}).inject(actions)
		
		return this;
	},
	toElement: function() {
		return this.container;
	},
	center: function() {
		this.container.setStyles({
			top: (window.getSize().y / 2) - ((this.options.height + 100) / 2),
			left: (window.getSize().x / 2) - ((this.options.width + 100) / 2)
		})
	},
	open: function() {
		new Drag.Move(this.container, {
			handle: this.label
		})
		this.container.setStyle('display', 'block');
		if (this.options.modal) {
			new Mask({hideOnClick: true}).show();
		}
		this.fireEvent('onOpen');
	},
	close: function() {
		
	}
})
