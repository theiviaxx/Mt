Mt.MToolBar = new Class({
	Extends: Mt.MWidget,
	options: {
		size: new Mt.MSize(300,26)
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		this.iconSize = new Mt.MSize(16,16);
		this.floatable = false;
		this.floating = false;
		this.movable = false;
		this.orientation = Mt.Orientation.Horizontal;
		this.toolButtonStyle = Mt.ToolButtonStyle.ToolButtonTextBesideIcon;
		
		this.container.addClass(this.type);
		
		this.container.setStyle('width', '100%');
	},
	binds: function() {
		this.events = {
			'click': this.clickEvent.bind(this)
		}
	},
	__type: function() {
		this.type = 'MToolBar';
		return this.type;
	},
	__build: function() {
		var element = new Element('div', {
			events: this.events
		});
		
		return element;
	},
	addAction: function() {
		var action = new Mt.MAction();
		var widget = new Mt.MPushButton(this);
		widget.addEvent('trigger', function(e) {
			this.__actionTriggered(e);
		}.bind(this));
		widget.addAction(action);
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
		
		this.addWidget(widget);
		return action;
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
	addSeparator: function() {
		return this.insertSeparator(null);
	},
	addWidget: function(widget) {
		return this.insertWidget(null, widget);
	},
	clear: function() {
		
	},
	clickEvent: function(e) {
		var action = this.actionAt(e.page.x, e.page.y);
		this.fireEvent('onActionTriggered', [action]);
	},
	insertSeparator: function(action) {
		var actionObject = new Mt.MAction();
		actionObject.setSeparator(true);
		return this.insertWidget(action, actionObject);
	},
	insertWidget: function(action, widget) {
		if (action == null) {
			this.children().push(widget);
			widget.container.inject(this.element);
		}
		else {
			var index = this.children().indexOf(action);
			widget.container.inject(this.children[index], 'before');
			this.children.splice(index, 0, widget);
		}
		if (widget['setFlat']) {
			widget.setFlat(true);
		}
		
		return action;
	},
	setFloatable: function(bool) {
		
	},
	setIconSize: function(size) {
		
	},
	setMovable: function(bool) {
		
	},
	setOrientation: function(orientation) {
		
	},
	setToolButtonStyle: function(toolButtonStyle) {
		
	}
});