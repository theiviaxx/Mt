

Mt.MMenu = new Class({
	Extends: Mt.MWidget,
	options: {
		size: new Mt.MSize(100,100)
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MMenu';
		
		// Member variables
		this.columnCount = 2;
		this.icon = new Element('img', {src:''});
		this.title = '';
		this.items = [];
		
		// Final injection into DOM
		this.element.inject(this.parentObj);
	},
	binds: function() {
		this.events = {
			'hideEvent': this.hideEvent.bind(this),
			'mouseout': this.mouseOutEvent.bind(this),
			'mouseenter': this.mouseEnterEvent.bind(this),
			'mousemove': this.mouseMoveEvent.bind(this)
		}
	},
	__build: function() {
		var element = new Element('div', {
			'class': 'MMenu',
			events: this.events
		});
		element.hide();
		
		return element;
	},
	actionAt: function() {
		var x,y;
		var found = 0;
		switch(typeOf(arguments[0])) {
			case 'object':
				// MPoint
				x = arguments[0].x;
				y = arguments[0].y;
				break;
			case 'number':
				// x,y
				x = arguments[0];
				y = arguments[1];
				break;
		}
		this.children.each(function(widget) {
			var pos = $(widget).getPosition();
			var size = $(widget).getSize();
			if (x > pos.x && x < (size.x + pos.x) && y > pos.y && y < (size.y + pos.y)) {
				found = widget.action;
			}
		})
		
		return found;
	},
	addAction: function() {
		var action = new Mt.MAction();
		switch(typeOf(arguments[0])) {
			case 'string':
				if (arguments[0].test('(jpg|png|gif)')) {
					action.setIcon(new Element('img', {src:arguments[0]}));
				}
				else {
					// Just the label
					action.setText(arguments[0]);
				}
				break;
			case 'element':
				// Icon, should have label in there too
				action.setIcon(arguments[0]);
				action.setText(arguments[1]);
				break;
			case 'object':
				// MAction object
				action = arguments[0];
				break;
		}
		var mi = new Mt.MMenuItem(action);
		this.insertAction(null, mi, action);
		return action;
	},
	addMenu: function() {
		var action = new Mt.MAction();
		
		if (typeOf(arguments[0]) == 'string') {
			var menu = new Mt.MMenu();
			menu.setTitle(arguments[0]);
		}
		else {
			var menu = arguments[0];
		}
		action.setText(menu.title);
		action.addEvent('hovered', function(e) {
			menu.popup();
		})
		
		var mi = new Mt.MMenuItem(action);
		this.insertMenu(null, mi, action);
	},
	addSeparator: function() {
		var action = this.children.getLast();
		this.insertSeparator(action);
	},
	clear: function() {
		
	},
	hideEvent: function(e) {
		var p = this.element.getPosition();
		var w = this.element.getWidth();
		var h = this.element.getHeight();
		var fx, fy;
		if (e.page.x > p.x && e.page.x < w + p.x) { fx = true; }
		if (e.page.y > p.y && e.page.y < h + p.y) { fy = true; }
		if (!fx || !fx) {
			window.removeEvent('mousedown', this.events.hideEvent);
			this.element.hide();
		}
	},
	insertAction: function(action, item, actionToAdd) {
		if (action == null) {
			this.items.push(item);
			this.children.push(actionToAdd);
			$(item).inject(this.element);
		}
		else {
			var index = this.items.indexOf(action);
			$(item).inject($(this.items[index]), 'before');
			this.items.splice(index, 0, item);
			this.items.splice(index, 0, actionToAdd);
		}
		
		return item;
	},
	insertMenu: function(action, item, menu) {
		this.insertAction(action, item, menu)
	},
	insertSeparator: function(action) {
		var index = this.children.indexOf(action);
		var div = new Element('div', {'class': 'MMenuSeparator'});
		div.inject($(this.items[index]), 'before');
		this.items.splice(index, 0, div);
	},
	isEmpty: function() {
		return (this.children.length) ? false : true;
	},
	mouseEnterEvent: function(e) {
		
	},
	mouseMoveEvent: function(e) {
		
	},
	mouseOutEvent: function(e) {
		
	},
	popup: function(point) {
		this.element.setStyles({
			top: point.y,
			left: point.x
		});
		this.element.show();
		window.addEvent('mousedown', this.events.hideEvent);
	},
	setIcon: function() {
		
	},
	setTitle: function(string) {
		this.title = string;
	}
});

Mt.MMenuItem = new Class({
	Extends: Mt.MWidget,
	initialize: function(action) {
		this.action = action;
		this.enabled = true;
		this.checkable = false;
		this.checked = false;
		
		this.element = new Element('div', {
			'class': 'MMenuItem'
		});
		this.icon = new Element('img', {src: action.iconSrc}).inject(this.element);
		this.text = new Element('div', {text: action.text}).inject(this.element);
		
		this.element.addEvent('click', function(e) {
			if (this.enabled) {
				action.activate(Mt.MAction.ActionEvent.Trigger, e);
			}
		}.bind(this));
		this.element.addEvent('mouseover', function(e) {
			if (this.enabled) {
				action.activate(Mt.MAction.ActionEvent.Hover, e);
			}
		}.bind(this))
		action.associatedWidgets.push(this);
	},
	setEnabled: function(bool) {
		bool = (bool == undefined) ? true : bool;
		this.enabled = bool;
		if (bool) {
			this.element.removeClass('MMenuItemDisabled');
		}
		else {
			this.element.addClass('MMenuItemDisabled');
		}
	},
	setCheckable: function(bool) {
		this.checkable = bool;
	},
	setChecked: function(bool) {
		var checkIcon = 'http://' + location.host + '/static/javascript/Mt/i/MMenuCheck.png';
		if (bool) {
			this.icon.addClass('MMenuItemChecked');
			if (this.icon.src == Mt.MBlankIcon) {
				this.icon.src = checkIcon;
			}
		}
		else {
			this.icon.removeClass('MMenuItemChecked');
			if (this.icon.src == checkIcon) {
				this.icon.src = Mt.MBlankIcon;
			}
		}
	},
	setIcon: function(icon) {
		this.icon.src = icon;
	}
})
