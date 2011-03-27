

Mt.MAbstractSpinBox = new Class({
	Extends: Mt.MWidget,
	options: {
		onChange: function(){},
		onContextMenu: function(){},
		onFocus: function(){},
		onBlur: function(){},
		onComplete: function(){}
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		var self = this;
		this.buttonSymbols = Mt.MAbstractSpinBox.UpDownArrows;
		this.correctionMode = Mt.MAbstractSpinBox.CorrectToPreviousValue;
		this.lineEdit = new Mt.MLineEdit(this, {
			onMouseWheel: function(e) {
				if (e.wheel > 0) {
					self.stepUp();
				}
				else {
					self.stepDown();
				}
			}
		});
		this.text = 0;
	},
	__type: function() {
		this.type = 'MAbstractSpinBox';
		return this.type;
	},
	clear: function() {
		this.lineEdit.clear();
	},
	fixup: function(string) {
		
	},
	hasAcceptableInput: function() {
		
	},
	hasFrame: function() {
		
	},
	isReadOnly: function() {
		return this.lineEdit.readOnly;
	},
	selectAll: function() {
		this.lineEdit.selectAll();
	},
	setButtonSymbols: function(buttonSymbol) {
		this.buttonSymbol = buttonSymbol;
		
	},
	setCorrectionMode: function(correctionMode) {
		this.correctionMode = correctionMode;
		
	},
	setFrame: function() {
		
	},
	setLineEdit: function(widget) {
		this.lineEdit.destroy();
		this.lineEdit = widget;
	},
	setReadOnly: function(bool) {
		this.lineEdit.setReadOnly(bool);
	},
	stepBy: function(i) {
		this.text += i;
	},
	stepDown: function() {
		this.text -= 1;
	},
	stepUp: function() {
		this.text += 1;
	},
	validate: function() {
		
	}
});
Mt.MAbstractSpinBox.ButtonSymbols = new Enum('UpDownArrows PlusMinus NoButtons');
Mt.MAbstractSpinBox.CorrectionMode = new Enum('CorrectToPreviousValue CorrectToNearestValue');


Mt.MSpinBox = new Class({
	Extends: Mt.MAbstractSpinBox,
	options: {
		size: new Mt.MSize(60, 16)
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		this.maximum = 10;
		this.minimum = 0;
		this.prefix = '';
		this.range = [this.minimum, this.maximum];
		this.singleStep = 1;
		this.suffix = '';
		this.value = 0;
		
		this.lineEdit.element.setStyles({
			width: this.size().width(),
			height: this.size().height()
		});
		
		this.element.className = '';
		
		this.spinnerContainer = new Element('div', {'class': 'MSpinBox'}).inject(this.container);
		this.spinUp = new Element('div', {
			events: {
				'click': function(e){
					e.stop();
					this.stepUp();
				}.bind(this)
			}
		}).inject(this.spinnerContainer);
		this.spinDown = new Element('div', {
			events: {
				'click': function(e){
					e.stop();
					this.stepDown();
				}.bind(this)
			}
		}).inject(this.spinnerContainer);
		
		this.setValue(this.value);
	},
	__type: function() {
		this.type = 'MSpinBox';
		return this.type;
	},
	cleanText: function() {
		
	},
	setMaximum: function(i) {
		this.maximum = i;
	},
	setMinimum: function(i) {
		this.minimum = i;
	},
	setPrefix: function(string) {
		this.prefix = string;
		this.setValue();
	},
	setRange: function(r) {
		this.minimum = r[0];
		this.maximum = r[1];
	},
	setSingleStep: function(i) {
		this.singleStep = i;
	},
	setSuffix: function(string) {
		this.suffix = string;
		this.setValue();
	},
	setValue: function(i) {
		i = (i == undefined) ? this.value : i;
		i = (i > this.maximum) ? this.maximum : i;
		i = (i < this.minimum) ? this.minimum : i;
		this.value = i;
		this.lineEdit.setText(this.prefix + this.value + this.suffix);
	},
	stepDown: function() {
		this.setValue(this.value - 1);
	},
	stepUp: function() {
		this.setValue(this.value + 1);
	}
});
