

Mt.MAction = new Class({
	Extends: Mt.MObject,
	Implements: [Options, Events],
	ActionEvent: new Enum('Trigger Hover'),
	options: {
		onChange: function(){},
		onHover: function(){},
		onToggled: function(){},
		onTriggered: function(){},
		text: '',
		icon: null
	},
	initialize: function(){
		var options = {};
		switch($type(arguments[0])) {
			case 'string':
				if (arguments[0].test('(jpg|png|gif)')) {
					options.icon = new Element('img', {src:arguments[0]});
				}
				else {
					options.text = arguments[0];
				}
				break;
			case 'element':
				options.icon = arguments[0];
				options.text = arguments[1];
				break;
		}
		this.parent(null, options)
		this.setOptions(options);
		this.type = 'MAction';
		
		this.observer = new Mt.MObserver();
		
		// Member variables
		this.actionGroup = [];
		this.associatedWidgets = [];
		this.checkable = false;
		this.checked = false;
		this.data = {};
		this.enabled = true;
		this.font = 'Verdana';
		this.iconSrc = this.options.icon;
		this.iconText = '';
		this.separator = false;
		this.shortcut = null;
		this.text = this.options.text;
		this.visible = true;
	},
	activate: function(e) {
		this.fireEvent('onChange', [e]);
		this.fireEvent('onTriggered', [e]);
	},
	setActionGroup: function(list) {
		this.actionGroup = list;
	},
	setCheckable: function(bool) {
		this.checkable = bool;
		this.associatedWidgets.each(function(widget) {
			widget.setCheckable(this.checkable);
		}, this);
	},
	setChecked: function(bool) {
		this.checked = bool;
		this.associatedWidgets.each(function(widget) {
			widget.setChecked(this.checked);
		}, this);
	},
	setData: function(obj) {
		this.data = obj;
	},
	setEnabled: function(bool) {
		this.enabled = bool;
		this.associatedWidgets.each(function(widget) {
			widget.setEnabled(this.enabled);
		}, this);
	},
	setFont: function(font) {
		this.font = font;
	},
	setIcon: function(icon) {
		switch ($type(icon)) {
			case 'string':
				this.iconSrc = icon;
				this.icon = new Element('img', {src: icon});
				break;
			case 'element':
				this.iconSrc = icon.src;
				this.icon = icon;
				break;
		}
		
		this.associatedWidgets.each(function(widget) {
			widget.setIcon(this.icon);
		}, this);
	},
	setIconText: function(string) {
		this.iconText = text
	},
	setMenu: function() {
		
	},
	setSeparator: function(bool) {
		this.separator = bool;
		this.associatedWidgets.each(function(widget) {
			widget.setText('');
		}, this);
	},
	setShortcut: function(string) {
		this.shortcut = string;
	},
	setText: function(string) {
		string = string || this.text;
		this.text = string;
		this.associatedWidgets.each(function(widget) {
			widget.setText(this.text);
		}, this);
	},
	setVisible: function(bool) {
		this.visible = bool;
		this.associatedWidgets.each(function(widget) {
			widget.setVisible(this.visible);
		}, this);
	},
	toggle: function() {
		this.setChecked((this.checked) ? false : true);
	}
});


Mt.MToolBar = new Class({
	Extends: Mt.MWidget,
	options: {
		size: new Mt.MSize(300,24)
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MToolBar';
		
		// Member variables
		this.iconSize = new Mt.MSize(16,16);
		this.floatable = false;
		this.floating = false;
		this.movable = false;
		this.orientation = Mt.Orientation.Horizontal;
		this.toolButtonStyle = Mt.ToolButtonStyle.ToolButtonTextBesideIcon;
		
		this.element.addClass(this.type);
		this.element.addEvent('click', this.__actionTriggered.bindWithEvent(this));
		this.geometry.width = this.parentObj.geometry.width + 4;
		this.render();
		this.container.setStyle('width', this.parentObj.geometry.width + 4);
		this.container.setStyle('left', this.geometry.x - 2);
		
		// Final injection into DOM
		this.container.inject(this.parentObj);
	},
	addAction: function() {
		var action = new Mt.MAction();
		var widget = new Mt.MButton(this);
		widget.addEvent('change', this.__actionTriggered.bindWithEvent(this))
		widget.addAction(action);
		switch($type(arguments[0])) {
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
		switch($type(arguments[0])) {
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
	insertSeparator: function(action) {
		var actionObject = new Mt.MAction();
		actionObject.setSeparator(true);
		return this.insertWidget(action, actionObject);
	},
	insertWidget: function(action, widget) {
		if (action == null) {
			this.children.push(widget);
			widget.container.inject(this.element);
		}
		else {
			var index = this.children.indexOf(action);
			widget.container.inject(this.children[index], 'before');
			this.children.splice(index, 0, widget);
		}
		widget.setFlat(true);
		
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
		
	},
	__actionTriggered: function(e) {
		var action = this.actionAt(e.page.x, e.page.y);
		this.fireEvent('onActionTriggered', [action]);
	}
});