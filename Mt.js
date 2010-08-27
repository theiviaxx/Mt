var Mt = {};

Mt.MObject = new Class({
	initialize: function(parent) {
		this.parentObj = $(parent) || null;
		this.children = [];
		this.type = 'MObject';
		this.name = '';
		
		if (parent) {
			parent.children.push(this);
		}
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

Mt.MSize = new Class({
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
		var newSize = new Mt.Size();
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

Mt.MRect = new Class({
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

Mt.MPoint = new Class({
	initialize: function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		this.type = 'MPoint';
	}
});

Mt.MWidget = new Class({
	Extends: Mt.MObject,
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
		onResize: $empty,
		width: 500,
		height: 500
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		this.parentObj = (parent == null) ? $(document.body) : parent;
		this.setOptions(options);
		this.size = new Mt.MSize(this.options.width, this.options.height)
		this.pos = new Mt.MPoint();
		this.geometry = new Mt.MRect(this.pos, this.size);
		this.type = 'MWidget';
		
		this.container = new Element('div', {
			'load': {
				onFailure: function(){
					alert('failed to load content')
				}
			}
		});
		this.container.addClass('MWidget');
		
		this.element = new Element('div', {
			events: {
				'click': function(e) {
					e.stop();
					this.fireEvent('click', [e])
				}.bind(this),
				'dblclick': function(e) {
					e.stop();
					this.fireEvent('dblclick', [e])
				}.bind(this)
			},
			styles: {
				width: this.size.width,
				height: this.size.height
			}
		}).inject(this.container);
		
		if (this.parentObj != document.body) {
			this.parentObj.children.push(this);
		}
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
	},
	toElement: function() {
		return this.element;
	},
})

Mt.MDialog = new Class({
	Extends: Mt.MWidget,
	options: {
		onOpen: $empty,
		onClose: $empty,
		width: 400,
		height: 400,
		top: 0,
		left: 0,
		label: '',
		image: '../i/blank.png',
		content: new Element('div'),
		modal: true,
		resize: false
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		this.size = new Mt.MSize(this.options.width, this.options.height);
		this.pos = new Mt.MPoint(this.options.left, this.options.top);
		this.type = 'MDialog';
		this.container.addClass('MDialog');
		this.container.setStyles({
			width: this.size.width,
			height: this.size.width,
			display: 'none'
		});
		var contentElement = $(this.options.content);
		this.content = (contentElement) ? contentElement : new Element('div', {'html': this.options.content});
		this.content.addClass('MWidget');
		this.content.setStyles({
			width: '100%',
			height: '100%',
			position: 'absolute',
			overflow: 'auto'
		}).inject(this.element);
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
		})
		
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
		
		var actions = new Element('div', {'class':'actions'}).inject(this.container);
		new Element('div', {events: {'click': this.close.bindWithEvent(this)}, styles: {},'class':'action close'}).inject(actions);
		new Element('div', {styles: {},'class':'action minimize'}).inject(actions);
		new Element('div', {styles: {},'class':'action maximize'}).inject(actions);
		
		this.container.inject(this.parentObj);
		
		if (this.options.resize) {
			this.__sizeGrip();
		}
		
		return this;
	},
	toElement: function() {
		return this.content;
	},
	render: function(el) {
		var el = el || this.container;
		el.setStyles({
			width: this.size.width,
			height: this.size.height,
			top: this.pos.y,
			left: this.pos.x
		})
		
		return this;
	},
	renderPreview: function(el) {
		var el = el || this.container;
		el.setStyles({
			width: this.size.width,
			height: this.size.height + 50
		})
		
		return this;
	},
	center: function() {
		this.pos.x = (window.getSize().x / 2) - (this.size.width / 2);
		this.pos.y = (window.getSize().y / 2) - (this.size.height / 2);
		
		return this.render();
	},
	open: function() {
		console.log('open')
		new Drag.Move(this.container, {
			handle: this.label,
			onComplete: function(el, e) {
				var pos = el.getPosition();
				this.pos.x = pos.x;
				this.pos.y = pos.y;
			}.bind(this)
		})
		this.container.setStyle('display', 'block');
		if (this.options.modal) {
			this.mask = new Mask({hideOnClick: true});
			this.mask.show();
		}
		this.render();
		this.fireEvent('onOpen');
		
		return this;
	},
	close: function(e) {
		console.log('close');
		this.container.hide();
		if (this.options.modal) {
			this.mask.hide();
		}
		
		return this;
	},
	destroy: function(e) {
		$(this).destroy();
	},
	set: function(arg, value, url) {
		var url = (url != undefined) ? true : false;
		switch (arg) {
			case 'content':
				switch($type(value)) {
					case 'string':
						if (url) {
							this.content.load(value);
						}
						else {
							this.content.set('html', value);
						}
						break;
					case 'element':
						this.content.grab(value);
						break;
				}
				break;
			case 'label':
				this.label.set('text', value.toString());
				break;
			case 'image':
				this.image.set('src', value.toString());
				break;
		}
	},
	get: function(arg) {
		switch (arg) {
			case 'content':
				return $(this.content)
				break;
			case 'label':
				return this.label.get('text');
				break;
			case 'image':
				return $(this.image);
				break;
		}
	},
	__sizeGrip: function() {
		var grip = new Element('div', {
			'class': 'MDialogSizeGrip'
		});
		var isMouseDown = false;
		var pos = this.container.getPosition();
		var self = this;
		
		grip.addEvent('mousedown', function(e) {
			e.stop();
			isMouseDown = true;
			self.scalePreview = new Element('div', {'class':'MSizePreview'}).inject(self.container);
		});
		window.addEvent('mouseup', function(e) {
			isMouseDown = false;
			self.scalePreview.destroy();
			self.render();
		});
		window.addEvent('mousemove', function(e) {
			if (isMouseDown) {
				var w = e.client.x - self.pos.x + 10;
				var h = e.client.y - self.pos.y - 30;
				if (w > 200) {
					self.size.width = w;
				}
				if (h > 200) {
					self.size.height = h;
				}
				self.renderPreview(self.scalePreview);
			}
		});
		
		grip.inject(this.container);
	}
})

Mt.MButton = new Class({
	Extends: Mt.MWidget,
	options: {
		align: 'center',
		icon: null,
		label: '',
		width: 'auto',
		height: 14,
		onClick: $empty
	},
	initialize: function(parent, options) {
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MButton';
		this.isMouseDown = false;
		this.isFocus = false;
		
		var self = this;
		this.element.addClass('MWidget MButton');
		
		this.element.setStyles({
			height: this.options.height,
			width: this.options.width,
			'text-align': this.options.align
		});
		var f = new Element('div').inject(this.element);
		f.setStyles({
			height: this.size.height / 2 - 8
		})
		var floater = new Element('div', {'class':'vcenter'}).inject(this.element);
		this.label = new Element('span', {text: this.options.label}).inject(floater);
		if (this.options.icon) {
			this.icon = new Element('img', {src: this.options.icon}).inject(this.label);
		}
		else {
			this.icon = null;
		}
		
		
		
		this.element.addEvent('mousedown', function(e) {
			e.stop();
			self.isMouseDown = true;
			self.isFocus = true;
			self.element.addClass('MButtonDown');
		})
		this.element.addEvent('mouseup', function(e) {
			e.stop();
			self.isMouseDown = false;
			self.element.removeClass('MButtonDown');
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
		
		this.container.inject($(this.parentObj))
		
		
		return this;
	},
	toElement: function() {
		return this.container;
	},
	set: function(arg, value) {
		switch (arg) {
			case 'label':
				this.label.set('text', value.toString());
				break;
			case 'image':
				if (!this.image) {
					this.image = new Element('img').inject(this.container, 'top');
					this.image.setStyle('height', this.size.height)
				}
				this.image.set('src', value.toString());
				break;
		}
	},
	get: function(arg) {
		switch (arg) {
			case 'label':
				return this.label.get('text');
				break;
			case 'image':
				return $(this.image);
				break;
		}
	}
})

Mt.MLineEdit = new Class({
	Extends: Mt.MWidget,
	options: {
		align: 'left',
		width: 'auto',
		height: 22
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.size = new Mt.MSize(0, this.options.height);
		this.type = 'MLineEdit';
		
		var self = this;
		this.element = new Element('input', {'type': 'text', 'class': 'MLineEdit'}).inject(this.container);
		this.element.addEvent('mouseover', function() {
			self.element.addClass('MLineEditHover')
		});
		
		this.container.inject(this.parentObj);
	},
	clear: function() {
		this.element.value = '';
	},
	set: function(arg, value) {
		switch (arg) {
			case 'text':
			case 'value':
				this.element.value = value.toString();
				break;
		}
	},
	get: function(arg) {
		switch (arg) {
			case 'text':
			case 'value':
				return this.element.value;
				break;
		}
	}
});


Mt.MListWidget = new Class({
	Extends: Mt.MWidget,
	options: {
		width: 200,
		height: 80,
		multiple: false
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MListWidget';
		
		this.items = [];
		this.element.addClass('MListWidget MFrame');
		
		this.container.inject(this.parentObj);
	},
	addItem: function(arg) {
		return this.insertItem(this.items.length, arg);
	},
	addItems: function(items) {
		return this.insertItems(this.items.length, items);
	},
	clear: function() {
		this.items.each(function(item) {
			item.unselect();
		})
	},
	insertItem: function(index, item) {
		var self = this;
		if ($type(item) == 'string') {
			var item = new Mt.MListWidgetItem(this, {label: item});
		}
		item.parentObj = $(this);
		item.addEvent('click', function(e) {
			if (e.control) {
				self.unselect(this);
			}
			else {
				self.select(this);
			}
			
		});
		var el = $(this).getChildren()[index];
		if (el) {
			item.element.inject($(el), 'before');
		}
		else {
			item.element.inject($(this));
		}
		
		this.items.splice(index, 0, item);
	},
	insertItems: function(index, items) {
		items.each(function(itemString) {
			this.insertItem(index, itemString.toString());
		}, this);
	},
	itemFromIndex: function(index) {
		return this.items[index];
	},
	indexFromItem: function(item) {
		return this.items.contains(item);
	},
	pop: function(index) {
		var item = (index) ? this.items[index] : this.items.getLast();
		if (item) {
			this.items.erase(item);
			item.destroy();
			
			return item;
		}
		return null;
	},
	removeItem: function(item) {
		item.destroy();
		this.items.erase(item);
	},
	scrollToItem: function(item) {
		$(this).scrollTo(0, this.indexFromItem(item) * 14);
	},
	sortItems: function(fn) {
		var fn = fn || this.__sortFunc;
		this.items.sort(fn);
		this.items.each(function(item) {
			$(item).inject($(this), 'bottom')
		}, this)
	},
	select: function(item) {
		if (!this.options.multiple) {
			this.items.each(function(item) {item.unselect()});
		}
		item.select();
	},
	unselect: function(item) {
		item.unselect();
	},
	get: function(arg) {
		switch(arg) {
			case 'selected':
				var sel = [];
				this.items.each(function(item) {
					if (item.isSelected) {
						sel.push(item);
					}
				})
				return (this.options.multiple) ? sel : sel[0];
				break;
		}
	},
	set: function(arg, val) {
		switch(arg) {
			case 'current':
			case 'currentItem':
				break;
			case 'selected':
				val.isSelected = false;
				val.element.addClass('MListItemWidgetSelected');
				break;
		}
	},
	__sortFunc: function(a,b) {
		if (a.text > b.text) {
			return 1
		}
		else if (a.text == b.text) {
			return 0
		}
		else {
			return -1
		}
	}
});


Mt.MListWidgetItem = new Class({
	Extends: Mt.MObject,
	Implements: [Events, Options],
	options: {
		label: '',
		icon: false,
		backgroundColor: 'transparent',
		foregroundColor: '#000000'
	},
	initialize: function(parent, options){
		this.parent(parent, options);
		this.setOptions(options);
		this.type = 'MListWidgetItem';
		
		this.backgroundColor = this.options.backgroundColor;
		this.foregroundColor = this.options.foregroundColor;
		this.isSelected = false;
		this.checkState = 0;
		this.text = this.options.label;
		
		var self = this;
		
		this.element = new Element('div', {
			events: {
				'click': function(e) {e.stop();self.fireEvent('click', [e])}
			}
		})
		
		if (this.options.icon) {
			this.icon = new Element('img', {src:this.options.icon});
			this.icon.inject(this.element);
		}
		this.label = new Element('span', {'html':this.options.label}).inject(this.element);
		this.element.addClass('MListWidgetItem');
		
		if (this.parentObj) {
			this.element.inject(this.parentObj);
		}
		
	},
	toElement: function() {
		return this.element;
	},
	destroy: function() {
		this.element.destroy();
		this.fireEvent('onDestroy');
		
		return this;
	},
	select: function(sel) {
		var sel = (sel == undefined) ? true : false;
		this.isSelected = sel;
		if (sel) {
			this.element.addClass('MListItemWidgetSelected');
		}
		else {
			this.element.removeClass('MListItemWidgetSelected');
		}
	},
	unselect: function() {
		this.select(false);
	},
	set: function(arg, val) {
		switch(arg) {
			case 'label':
			case 'text':
				this.text = val;
				this.label.set('text', val);
				break;
			case 'backgroundColor':
				this.label.setStyle('background', val);
				break;
			case 'foregroundColor':
			case 'fontColor':
				this.label.setStyle('color', val);
				break;
		}
	}
});

Mt.MTemplate = new Class({
	Extends: Mt.MWidget,
	options: {
		
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MCheckbox';
		
		this.container.inject(this.parentObj);
	}
});

// TODO
// Disabled state
Mt.MListWidget;
Mt.MSpinBox;
Mt.MSlider;
Mt.MComboBox;
Mt.MPanel;
Mt.MRollout;
Mt.MTab;
Mt.MToolBar;

