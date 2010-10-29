


Mt.MAbstractSpinBox = new Class({
	Extends: Mt.MWidget,
	ButtonSymbols: new Enum('UpDownArrows PlusMinus NoButtons'),
	CorrectionMode: new Enum('CorrectToPreviousValue CorrectToNearestValue'),
	
	options: {
		
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MAbstractSpinBox';
		
		// Member variables
		this.alignment = Mt.MAlignment.Horizontal;
		this.buttonSymbols = Mt.MAbstractSpinBox.UpDownArrows;
		
		
		// Final injection into DOM
		this.container.inject(this.parentObj);
	},
	
});

/*
 * this.element = new Element('input', {
			size: 4
		}).inject(this.container);
		this.spinnerContainer = new Element('div').inject(this.container);
		this.spinUp = new Element('div', {
			events: {
				'click': function(e){
				
				}
			}
		}).inject(this.spinnerContainer);
 */