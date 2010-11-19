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
		icon: Mt.MBlankIcon
	},
	initialize: function(){
		var options = {};
		switch(typeOf(arguments[0])) {
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
		
		this.events = {
			'mouseenter': this.hoverEvent.bind(this),
			'click': this.triggerEvent.bind(this)
		}
	},
	__type: function() {
		this.type = 'MAction';
		return this.type;
	},
	activate: function(actionEvent, e) {
		if (actionEvent == Mt.MAction.ActionEvent.Trigger) {
			this.triggerEvent(e);
		}
		if (actionEvent == Mt.MAction.ActionEvent.Hover) {
			this.hoverEvent(e);
		}
	},
	hoverEvent: function(e) {
		this.fireEvent('onHovered', [e]);
	},
	triggerEvent: function(e) {
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
		switch (typeOf(icon)) {
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
			widget.setIcon(null);
			
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
Mt.MAction.ActionEvent = new Enum('Trigger Hover');
