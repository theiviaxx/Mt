Mt.MGroupBox = new Class({
	Extends: Mt.MWidget,
	options: {
		size: new Mt.MSize('auto','auto')
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
	},
	__type: function() {
		this.type = 'MGroupBox';
		return this.type;
	},
	__build: function() {
		var element = new Element('fieldset', {
			'class': this.type
		});
		this.label = new Element('legend', {text:'GroupBox'}).inject(element);
		
		return element;
	},
	setText: function(text) {
		this.label.set('text', text);
	}
});