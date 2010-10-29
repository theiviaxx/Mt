var Enum = new Class({
	initialize: function(vals, order) {
		var i = 0;
		order = order || '';
		order = order.split();
		vals.split().each(function(item) {
			if (order[item]) {
				this[item] = order[item];
			}
			else {
				this[item] = i;
				i += 1;
			}
		}, this);
	}
})


var Mt = {};

// Find image regex
// string.test('(jpg|png|gif)')

// Global Enums
Mt.AspectRatioMode = new Enum('IgnoreAspectRatio KeepAspectRatio KeepAspectRatioByExpanding');
Mt.ScrollBarPolicy = new Enum('ScrollBarAsNeeded ScrollBarAlwaysOff ScrollBarAlwaysOn');
Mt.Orientation = new Enum('Horizontal Vertical');
Mt.ToolButtonStyle = new Enum('ToolButtonIconOnly ToolButtonTextOnly ToolButtonTextBesideIcon ToolButtonTextUnderIcon ToolButtonFollowStyle');

// Window messages
Mt.WindowURL_404 = "The URL requested was not found";
Mt.WindowURL_500 = "The URL requested caused a server error";

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
			ratioMode = ratioMode || Mt.AspectRatioMode.IgnoreAspectRatio
		}
		else {
			width = width.width;
			height = width.height;
			ratioMode = height;
		}
		var newSize = new Mt.MSize();
		var ratio = width / height;
		switch (ratioMode) {
			case Mt.AspectRatioMode.IgnoreAspectRatio:
				newSize.width = width;
				newSize.height = height;
				break;
			case Mt.AspectRatioMode.KeepAspectRatio:
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
			case Mt.AspectRatioMode.KeepAspectRatioByExpanding:
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
		if (arguments.length == 2) {
			switch(arguments[1].type) {
				case 'MPoint':
					this.x = arguments[0].x;
					this.y = arguments[0].y;
					this.width = arguments[1].x - this.x;
					this.height = arguments[1].y - this.y;
					break;
				case 'MSize':
					this.x = arguments[0].x;
					this.y = arguments[0].y;
					this.width = arguments[1].width;
					this.height = arguments[1].height;
					break;
			}
		}
		if (arguments.length == 4) {
			this.x = arguments[0];
			this.y = arguments[1];
			this.width = aargumentsrgs[2];
			this.height = arguments[3];
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
		onClose: function(){},
		onMouseOver: function(){},
		onMouseOut: function(){},
		onMouseMove: function(){},
		onFocus: function(){},
		onBlur: function(){},
		onMouseUp: function(){},
		onMouseDown: function(){},
		onClick: function(){},
		onDoubleClick: function(){},
		onMouseWheel: function(){},
		onResize: function(){},
		position: new Mt.MPoint(),
		size: new Mt.MSize(500,500)
	},
	initialize: function(parent, options) {
		this.parent(parent, options);
		this.parentObj = (parent == null) ? $(document.body) : parent;
		this.setOptions(options);
		this.size = this.options.size;
		this.pos = this.options.position;
		this.geometry = new Mt.MRect(this.pos, this.size);
		this.type = 'MWidget';
		this.MWidget = true;
		
		this.focus = false;
		this.enabled = true;
		this.visible = true;
		this.acceptsDrops = false;
		
		this.container = new Element('div', {
			'load': {
				onFailure: function(){
					alert('failed to load content')
				}
			}
		});
		this.container.addClass(this.type);
		
		this.element = this.__build();
		this.element.inject(this.container);
		
		
		if (this.parentObj != document.body) {
			this.parentObj.children.push(this);
		}
	},
	__build: function() {
		// Override to build the HTML elements
		// Should return element (DIV)
		var element = new Element('div', {
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
		});
		
		return element;
	},
	binds: {},
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
	parentWidget: function() {
		return this.parentObj;
	},
	render: function() {
		this.element.setStyles({
			width: this.geometry.width,
			height: this.geometry.height,
			top: this.geometry.y,
			left: this.geometry.x
		});
		
		return this;
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
			this.size.width = rect;
			this.size.height = h;
		}
		else {
			this.geometry = rect;
		}
		
		return this;
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
	show: function() {
		
	},
	setSize: function(size, height) {
		if ($type(size) == 'number') {
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
	toElement: function() {
		return this.element;
	},
	__postInit: function() {
		// Method to do things after the parent init has gone through
		// Must be explicitly called
	}
});


Mt.MFrame = new Class({
	Extends: Mt.MWidget,
	Shadow: new Enum('Plain Raised Sunken'),
	Shape: new Enum('NoFrame Box Panel WinPanel HLine VLine StyledPanel'),
	options: {
		size: new Mt.MSize(200,80)
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MFrame';
		this.shadow = this.Shadow.Plain;
		this.shape = this.Shape.Box;
		this.lineWidth = 1;
		
		this.container.inject(this.parentObj);
		this.container.addClass(this.type);
		this.drawFrame();
	},
	drawFrame: function() {
		this.container.setStyles({
			width: this.geometry.width,
			height: this.geometry.height,
			top: this.geometry.y,
			left: this.geometry.x,
			'border-width': this.lineWidth
		});
		if (this.shadow > 0) {
			this.container.addClass('MFrameShadow');
		}
		else {
			this.container.removeClass('MFrameShadow');
		}
		if (this.shape == this.Shape.StyledPanel) {
			this.container.addClass('MFrameRounded');
		}
		else {
			this.container.removeClass('MFrameRounded');
		}
		
		return this;
	},
	frameRect: function() {
		return this.geometry;
	},
	frameShadow: function() {
		return this.shadow;
	},
	frameShape: function() {
		return this.shape;
	},
	lineWidth: function() {
		return this.lineWidth;
	},
	setFrameRect: function(rect) {
		if (rect.width && rect.height && rect.x && rect.y) {
			return this.set('geometry', rect);
			return this;
		}
		
		throw("Not a valid MRect object");
	},
	setFrameShadow: function(shadow) {
		if ($type(shape) == 'number') {
			return this.set('shadow', shadow);
		}
		
		throw("Integer required");
	},
	setFrameShape: function(shape) {
		if ($type(shape) == 'number') {
			return this.set('shape', shape);
		}
		
		throw("Integer required");
	},
	setLineWidth: function(width) {
		if ($type(width) == 'number') {
			return this.set('width', width);
		}
		
		throw("Integer required");
	},
	set: function(arg, val) {
		this[arg] = val;
		
		return this;
	}
});

Mt.MLineEdit = new Class({
	Extends: Mt.MWidget,
	options: {
		align: 'left',
		size: new Mt.MSize(0, 22)
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MLineEdit';
		
		var self = this;
		this.lineEdit = new Element('input', {'type': 'text', 'class': 'MLineEdit'}).inject(this.element);
		this.lineEdit.addEvent('mouseover', function() {
			self.lineEdit.addClass('MLineEditHover')
		});
		
		this.container.inject(this.parentObj);
	},
	clear: function() {
		this.lineEdit.value = '';
	},
	setText: function(val) {
		this.lineEdit.value = val.toString();
	},
	set: function(arg, value) {
		switch (arg) {
			case 'text':
			case 'value':
				this.lineEdit.value = value.toString();
				break;
		}
	},
	get: function(arg) {
		switch (arg) {
			case 'text':
			case 'value':
				return this.lineEdit.value;
				break;
		}
	}
});


Mt.MAbstractScrollArea = new Class({
	Extends: Mt.MFrame,
	options: {
		
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MAbstractScrollArea';
		
		this.hscrolling = Mt.ScrollBarPolicy.ScrollBarAsNeeded;
		this.vscrolling = Mt.ScrollBarPolicy.ScrollBarAsNeeded;
		this.viewport = null;
	},
	horizontalScrollBarPolicy: function() {
		return this.hscrolling;
	},
	verticalScrollBarPolicy: function() {
		return this.vscrolling;
	},
	setHorizontalScrollBarPolicy: function(policy) {
		if ($type(policy) == 'number') {
			switch(policy) {
				case Mt.ScrollBarPolicy.ScrollBarAsNeeded:
					this.element.setStyle('overflow-x', 'auto');
					break;
				case Mt.ScrollBarPolicy.ScrollBarAlwaysOff:
					this.element.setStyle('overflow-x', 'hidden');
					break;
				case Mt.ScrollBarPolicy.ScrollBarAlwaysOn:
					this.element.setStyle('overflow-x', 'scroll');
					break;
			}
			return this.set('hscrolling', policy)
		}
		throw "Integer required";
	},
	setVerticalScrollBarPolicy: function(policy) {
		if ($type(policy) == 'number') {
			switch(policy) {
				case Mt.ScrollBarPolicy.ScrollBarAsNeeded:
					this.element.setStyle('overflow-y', 'auto');
					break;
				case Mt.ScrollBarPolicy.ScrollBarAlwaysOff:
					this.element.setStyle('overflow-y', 'hidden');
					break;
				case Mt.ScrollBarPolicy.ScrollBarAlwaysOn:
					this.element.setStyle('overflow-y', 'scroll');
					break;
			}
			return this.set('vscrolling', policy)
		}
		throw "Integer required";
	},
	setViewport: function(widget) {
		if (widget.MWidget) {
			widget.setParent(this.viewport);
		}
	}
});


Mt.MAbstractItemView = new Class({
	Extends: Mt.MAbstractScrollArea,
	ScrollMode: new Enum('ScrollPerItem ScrollPerPixel'),
	SelectionBehavior: new Enum('SelectItems SelectRows SelectColumns'),
	SelectionMode: new Enum('NoSelection SingleSelection MultiSelection ExtendedSelection ContiguousSelection'),
	options: {
		
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MCheckbox';
		
		this.selection = [];
		this.selectionMode = this.SelectionMode.SingleSelection;
		this.hScrollMode = this.ScrollMode.ScrollPerItem;
		this.vScrollMode = this.ScrollMode.ScrollPerItem;
		
		this.container.inject(this.parentObj);
	},
	clearSelection: function() {
		this.selection = [];
	},
	horizontalScrollMode: function() {
		return this.hScrollMode;
	},
	verticalScrollMode: function() {
		return this.vScrollMode;
	},
	setSelectionMode: function(mode) {
		this.selectionMode = mode;
	}
});


Mt.MListView = new Class({
	Extends: Mt.MAbstractItemView,
	options: {
		
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MListView';
		
		this.container.inject(this.parentObj);
	}
});


Mt.MListWidget = new Class({
	Extends: Mt.MListView,
	options: {
		size: new Mt.MSize(200, 80),		
		multiple: false
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MListWidget';
		
		this.items = [];
		this.selection = [];
		this.element.addClass('MListWidget');
		
		this.container.inject(this.parentObj);
		this.container.addClass(this.type);
		
		this.container.addEvent('mousedown', function(e) {
			e.stop();
			
		})
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
	clearSelection: function() {
		this.items.each(function(item) {item.unselect()});
	},
	insertItem: function(index, item) {
		var self = this;
		if ($type(item) == 'string') {
			var item = new Mt.MListWidgetItem(this, {label: item});
		}
		item.parentObj = $(this);
		item.addEvent('click', function(e) {
			e.stop();
			if (e.control) {
				self.unselect(this, e);
			}
			else {
				self.select(this, e);
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
		return this.items.indexOf(item);
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
		//this.items.erase(item);
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
	select: function(item, e) {
		switch (this.selectionMode) {
			case this.SelectionMode.NoSelection:
				//pass
				break;
			case this.SelectionMode.SingleSelection:
				this.clearSelection();
				item.select();
				break;
			case this.SelectionMode.MultiSelection:
				item.select();
				break;
			case this.SelectionMode.ExtendedSelection:
				break;
			case this.SelectionMode.ContiguousSelection:
			
				this.clearSelection();
				item.select();
				if (e.shift) {
					var index = this.indexFromItem(item);
					var i = (index < 2) ? 0 : index - 1;
					
					while(this.items[i].isSelected == false) {
						this.items[i].select();
						i--;
						if (i < 0) {
							break;
						}
					}
					
				}
				break;
		}
		
		return this;
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


Mt.MAction = new Class({
	Extends: Mt.MObject,
	options: {
		label: '',
		icon: null
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MAction';
		
		this.checkable = false;
		this.checked = false;
		this.enabled = true;
		this.separator = false;
		this.visible = true;
		
		this.container.inject(this.parentObj);
	},
	isCheckable: function() { return this.checkable; },
	isChecked: function() { return this.checked; },
	isEnabled: function() { return this.enabled; },
	isSeparator: function() { return this.separator; },
	
	isVisible: function() { return this.visible; },
	setCheckable: function(bool) {
		this.cheackable = bool;
	},
	setchecked: function(bool) {
		this.checked = bool;
	},
	setEnabled: function(bool) {
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
		
		return this;
	},
	setIcon: function(icon) {
		
	},
	setSeparator: function(bool) {
		
	},
	setText: function(text) {
		
	},
	setVisible: function(bool) {
		if (bool) {
			this.element.show();
		}
		else {
			this.element.hide();
		}
	},
	toggle: function() {
		this.checked = (this.checked) ? false : true;
	}
});


Mt.MToolbar = new Class({
	Extends: Mt.MWidget,
	options: {
		onResize: function(){}
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MToolbar';
		
		this.container.inject(this.parentObj);
	},
	addAction: function() {
		
	},
	addSeparator: function() {
		
	},
	addWidget: function(widget) {
		
	},
	insertSeparator: function(index) {
		
	},
	insertWidget: function(index, widget) {
		
	}
});


Mt.MGroupBox = new Class({
	Extends: Mt.MWidget,
	options: {
		label: 'GroupBox',
		size: new Mt.MSize('auto', 'auto')
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MGroupBox';
		
		// Member variables
		this.element.destroy();
		this.element = new Element('fieldset').inject(this.container);
		this.label = new Element('legend', {'text': this.options.label}).inject(this.element);
		
		// Final injection into DOM
		this.container.inject(this.parentObj);
	},
	setTitle: function(title) {
		this.label.set('text', title);
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
		
		// Member variables
		
		// Final injection into DOM
		this.container.inject(this.parentObj);
	}
});

// TODO

// Disabled state
Mt.MSpinBox;
Mt.MComboBox;
//Mt.MPanel;
Mt.MRollout;
Mt.MTab;
//Mt.MToolBar;
Mt.MenuBar;
Mt.Menu;
//Mt.MAction;

