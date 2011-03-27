Mt.MObject = new Class({
	Implements: Events,
	initialize: function(parent) {
		this.parentObj = $(parent) || null;
		this.__children = [];
		this.__name = '';
		this.__type();
		
		if (parent) {
			if (parent.MWidget == true) {
				parent.__children.push(this);
			}
		}
		this.container = new Element('div');
	},
	__type: function() {
		this.type = 'MObject';
		return this.type;
	},
	children: function() {
		return this.__children;
	},
	connect: function(obj, signal, slot) {
		obj.addEvent(signal, slot.bind(this));
	},
	dumpObjectInfo: function() {
		
	},
	dumpObjectTree: function() {
		
	},
	emit: function(signal) {
		this.fireEvent(signal);
	},
	findChild: function(type, name) {
		this.children().each(function(item) {
			if (item.type == type && item.name == name) {
				return item;
			}
		})
		
		return false;
	},
	findChildren: function(type, name) {
		var found = [];
		this.children().each(function(item) {
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
	isWidgetType: function(){
		return this.inherits('MWidget');
	},
	objectName: function() {
		return this.__name;
	},
	setObjectName: function(name) {
		this.__name = name;
	},
	setParent: function(parent) {
		this.parentObj = parent;
	}
});