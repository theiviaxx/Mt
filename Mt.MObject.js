Mt.MObject = new Class({
	initialize: function(parent) {
		this.parentObj = $(parent) || null;
		this.children = [];
		this.name = '';
		this.__type();
		
		if (parent) {
			if (parent.MWidget == true) {
				parent.children.push(this);
			}
		}
		this.container = new Element('div');
		this.element = new Element('div');
	},
	__type: function() {
		this.type = 'MObject';
		return this.type;
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