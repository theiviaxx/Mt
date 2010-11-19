Mt.MGroupBox = new Class({
	Extends: Mt.MWidget,
	options: {
		label: 'GroupBox',
		size: new Mt.MSize('auto', 'auto')
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MGroupBox';
		
		// Member variables
		this.element.destroy();
		this.element = new Element('fieldset').inject(this.container);
		this.label = new Element('legend', {'text': this.options.label}).inject(this.element);
		
		// Final injection into DOM
		this.container.inject(this.parentObj);
	},
	setTitle: function(title) {
		this.label.set('text', title);
	}
});