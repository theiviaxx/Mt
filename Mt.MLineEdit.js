Mt.MLineEdit = new Class({
	Extends: Mt.MWidget,
	options: {
		size: new Mt.MSize(0, 22),
		onMouseWheel: function(){}
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MLineEdit';
		
		// Member variables
		this.inputMask = Mt.MLineEdit.EchoMode.Normal;
		this.maxLength = 32;
		this.readOnly = false;
		this.modified = false;
		this.placeholderText = '';
		this.text = '';
		this.validator = null;
		
		// Final injection into DOM
		this.container.inject(this.parentObj);
	},
	__type: function() {
		this.type = 'MLineEdit';
		return this.type;
	},
	__build: function() {
		var self = this;
		var el = new Element('input', {
			'type': 'text',
			'class': 'MLineEdit',
			'events': {
				'mousewheel': function(e) {
					self.fireEvent('onMouseWheel', [e])
				}
			}
		});
		
		return el;
	},
	clear: function() {
		this.setText('');
	},
	selectAll: function() {
		this.element.select();
	},
	setEchoMode: function(mode) {
		this.echoMode = mode;
		if (this.echoMode == Mt.MLineEdit.EchoMode.Password || this.echoMode == Mt.MLineEdit.EchoMode.PasswordEchoOnEdit) {
			this.element.setProperty('type', 'password');
		}
		else {
			this.element.setProperty('type', 'text');
		}
	},
	setMaxLength: function(len) {
		this.element.maxLength = this.maxLength = len;
	},
	setText: function(val) {
		this.element.value = this.text = val.toString();
	}
});
Mt.MLineEdit.EchoMode = new Enum('Normal NoEcho Password PasswordEchoOnEdit');