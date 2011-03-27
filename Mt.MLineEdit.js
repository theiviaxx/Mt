Mt.MLineEdit = new Class({
	Extends: Mt.MWidget,
	options: {
		size: new Mt.MSize('auto', 22),
		onMouseWheel: function(){}
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		this._alignment = Mt.Alignment.LeftToRight;
		this._echoMode = Mt.MLineEdit.EchoMode.Normal;
		this._readOnly = false;
		this._modified = false;
	},
	__type: function() {
		this.type = 'MLineEdit';
		return this.type;
	},
	__build: function() {
		var self = this;
		var el = new Element('input', {
			'type': 'text',
			'class': this.type,
			'events': {
				'mousewheel': function(e) {
					self.fireEvent('onMouseWheel', [e])
				}
			}
		});
		
		return el;
	},
	alignment: function() {
		return this._alignment;
	},
	clear: function() {
		this.setText('');
	},
	cursorBackward: function() {
		
	},
	cursorForward: function() {
		
	},
	cursorPosition: function() {
		
	},
	cursorPositionAt: function() {
		
	},
	cursorWordBackward: function() {
		
	},
	cursorWordBackward: function() {
		
	},
	deselect: function() {
		
	},
	echoMode: function() {
		return this._echoMode;
	},
	hasFrame: function() {
		return this.container.hasClass('MFrame');
	},
	hasSelectedText: function() {
		
	},
	inputMask: function() {
		
	},
	isModified: function() {
		return this._modified;
	},
	isReadOnly: function() {
		return this._readonly;
	},
	maxLength: function() {
		return this.element.get('maxLength');
	},
	placeholderText: function() {
		this.element.get('placeholder');
	},
	selectAll: function() {
		this.element.select();
	},
	selectedText: function() {
		
	},
	setAlignment: function(alignment) {
		this._alignment = alignment;
	},
	setCursorPosition: function() {
		
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
	setFrame: function(bool) {
		if (bool) {
			this.container.addClass("MFrame");
		}
		else {
			this.container.removeClass("MFrame");
		}
	},
	setInputMask: function() {
		
	},
	setMaxLength: function(len) {
		this.element.maxLength = len;
	},
	setModified: function(bool) {
		this.modified = !!bool;
	},
	setPlaceholderText: function(string) {
		this.element.set('placeholder', string);
	},
	setReadOnly: function(bool) {
		this.element.set('readOnly', !!bool);
	},
	setSelection: function() {
		
	},
	setText: function(val) {
		this.element.value = val.toString();
	},
	text: function() {
		return this.element.value;
	}
});
Mt.MLineEdit.EchoMode = new Enum('Normal NoEcho Password PasswordEchoOnEdit');