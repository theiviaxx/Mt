Mt.MFrame = new Class({
	Extends: Mt.MWidget,
	options: {
		size: new Mt.MSize(200,80)
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		
		// Member variables
		this.lineWidth = 1;
		
		this.container.addClass('MFrame');
	},
	__type: function() {
		this.type = 'MFrame';
		return this.type;
	},
	__build: function() {
		var element = new Element('div', {
			'class': this.type,
			styles: {
				'border-width': this.lineWidth
			}
		});
		
		return element;
	},
	frameRect: function() {
		return this.geometry;
	},
	frameShadow: function() {
		return this.shadow;
	},
	frameShape: function() {
		return this.shape;
	},
	lineWidth: function() {
		return this.lineWidth;
	},
	setFrameRect: function(rect) {
		if (rect.width && rect.height && rect.x && rect.y) {
			return this.set('geometry', rect);
			return this;
		}
		
		throw("Not a valid MRect object");
	},
	setFrameShadow: function(shadow) {
		if (shadow == Mt.MFrame.Shadow.Plain) {
			this.element.addClass('MFrameShadow');
		}
		else {
			this.element.removeClass('MFrameShadow');
		}
	},
	setFrameShape: function(shape) {
		if (this.shape == Mt.MFrame.Shape.StyledPanel) {
			this.element.addClass('MFrameRounded');
		}
		else {
			this.element.removeClass('MFrameRounded');
		}
	},
	setLineWidth: function(width) {
		if (typeOf(width) == 'number') {
			return this.set('width', width);
		}
		
		throw("Integer required");
	}
});
Mt.MFrame.Shadow = new Enum('Plain Raised Sunken');
Mt.MFrame.Shape = new Enum('NoFrame Box Panel WinPanel HLine VLine StyledPanel');
