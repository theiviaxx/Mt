Mt.MAbstractSlider = new Class({
	Extends: Mt.MWidget,
	options: {
		min: 0,
		max: 100,
		orientation: Mt.Orientation.Horizontal,
		singleStep: 1,
		pageStep: 1,
		onRangeChanged: function(){},
		onSliderMoved: function(){},
		onSliderPressed: function(){},
		onSliderReleased: function(){},
		onValueChanged: function(){},
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		this.isSliderDown = false;
		this.maximum = this.options.max;
		this.minimum = this.options.min;
		this.orientation = this.options.orientation;
		this.value = this.minimum;
		this.singleStepSize = 1;
		this.pageStepSize = 10;
	},
	__type: function() {
		this.type = 'MAbstractSclider';
		return this.type;
	},
	pageStep: function() {
		
	},
	setMaximum: function(val) {
		this.maximum = val.toInt();
	},
	setMinimum: function(val) {
		this.minimum = val.toInt();
	},
	setOrientation: function(val) {
		
	},
	setPageStep: function(val) {
		this.pageStepSize = val.toInt();
	},
	setRange: function(val) {
		this.slider.range = val;
	},
	setSingleStep: function(val) {
		this.singleStepSize = val.toInt();
	},
	setValue: function(val) {
		
	},
	singleStep: function() {
		
		
	}
});


Mt.MSlider = new Class({
	Extends: Mt.MAbstractSlider,
	options: {
		size: new Mt.MSize(300,18),
		steps: false
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		
		this.slider = new Slider(this.area, this.grip, {
			mode: (this.orientation == Mt.Orientation.Horizontal) ? 'horizontal' : 'vertical',
			range: [this.minimum, this.maximum],
			onChange: function(val) {
				this.value = val;
				this.fireEvent('onValueChanged', [val])
			}.bind(this)
		});
	},
	__type: function() {
		this.type = 'MSlider';
		return this.type;
	},
	__build: function() {
		var element = new Element('div', {
			events: this.events,
			'class': this.type
		});
		
		if (this.options.steps) {
			this.stepLeft = new Element('div', {
				'class': 'MSliderStepLeft',
				events: {
					'click': function(e) {
						e.stop();
						this.singleStep(false);
					}.bind(this)
				}
			}).inject(element);
		}
		
		this.area = new Element('div', {'class': 'MSliderArea'}).inject(element);
		this.area.setStyles({
			width: (this.options.steps) ? this.options.size.width() - 32 : this.options.size.width(),
			top: 4,
			margin: "0px 4px"
		});
		this.grip = new Element('div', {'class': 'MSliderGrip'}).inject(this.area);
		
		if (this.options.steps) {
			this.stepRight = new Element('div', {
				'class': 'MSliderStepRight',
				events: {
					'click': function(e) {
						e.stop();
						this.singleStep(true);
					}.bind(this)
				}
			}).inject(element);
		}
		
		return element;
	},
	pageStep: function(dir) {
		if (dir == undefined || dir == true) {
			this.setValue(this.value + this.pageStepSize);
		}
		else {
			this.setValue(this.value - this.pageStepSize);
		}
		
		return this;
	},
	setValue: function(val) {
		val = val || this.value;
		this.value = val.toInt();
		this.slider.set(this.value);
		
		return this;
	},
	singleStep: function(dir) {
		if (dir == undefined || dir == true) {
			this.setValue(this.value + this.singleStepSize);
		}
		else {
			this.setValue(this.value - this.singleStepSize);
		}
		
		return this;
	}
});