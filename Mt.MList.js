Mt.MAbstractScrollArea = new Class({
	Extends: Mt.MFrame,
	options: {
		
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		this.hscrolling = Mt.ScrollBarPolicy.ScrollBarAsNeeded;
		this.vscrolling = Mt.ScrollBarPolicy.ScrollBarAsNeeded;
		this.viewport = null;
	},
	__type: function() {
		this.type = 'MAbstractScrollArea';
		return this.type;
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
		
		this.selection = [];
		this.selectionMode = this.SelectionMode.SingleSelection;
		this.hScrollMode = this.ScrollMode.ScrollPerItem;
		this.vScrollMode = this.ScrollMode.ScrollPerItem;
	},
	__type: function() {
		this.type = 'MAbstractItemView';
		return this.type;
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
	},
	__type: function() {
		this.type = 'MListView';
		return this.type;
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
		
		this.items = [];
		this.selection = [];
		
		this.container.addClass(this.type);
		
		this.container.addEvent('mousedown', function(e) {
			e.stop();
			
		})
	},
	__type: function() {
		this.type = 'MListWidget';
		return this.type;
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
		if (typeOf(item) == 'string') {
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
		this.__type();
		
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
	__type: function() {
		this.type = 'MListWidgetItem';
		return this.type;
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
