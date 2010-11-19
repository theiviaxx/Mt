var Enum = new Class({
	initialize: function(vals, order) {
		var i = 0;
		order = order || '';
		order = order.split(' ');
		vals.split(' ').each(function(item) {
			if (order[item]) {
				this[item] = order[item];
			}
			else {
				this[item] = i;
				i += 1;
			}
		}, this);
	}
})


var Mt = {};

// Find image regex
// string.test('(jpg|png|gif)')

Mt.MBlankIcon = 'http://' + location.host + '/static/javascript/Mt/i/blank.png';

// Global Enums
Mt.AspectRatioMode = new Enum('IgnoreAspectRatio KeepAspectRatio KeepAspectRatioByExpanding');
Mt.ScrollBarPolicy = new Enum('ScrollBarAsNeeded ScrollBarAlwaysOff ScrollBarAlwaysOn');
Mt.Orientation = new Enum('Horizontal Vertical');
Mt.MAlignment = new Enum('AlignLeft AlignRight AlignHCenter AlignJustify AlignTop AlignBottom AlignVCenter', order='1 2 4 8 32 64 128');
Mt.ToolButtonStyle = new Enum('ToolButtonIconOnly ToolButtonTextOnly ToolButtonTextBesideIcon ToolButtonTextUnderIcon ToolButtonFollowStyle');

// Window messages
Mt.WindowURL_404 = "The URL requested was not found";
Mt.WindowURL_500 = "The URL requested caused a server error";


// Core objects and functions
Mt.MSize = new Class({
	Implements: Options,
	initialize: function(width, height) {
		this.width = width || 0;
		this.height = height || 0;
		this.type = 'MSize';
	},
	isEmpty: function() {
		return (this.width <= 0 || this.height <= 0) ? true : false;
	},
	isNull: function() {
		return (this.width <= 0 && this.height <= 0) ? true : false;
	},
	scale: function(width, height, ratioMode) {
		if ($type(width) == 'number') {
			width = width;
			height = height;
			ratioMode = ratioMode || Mt.AspectRatioMode.IgnoreAspectRatio
		}
		else {
			width = width.width;
			height = width.height;
			ratioMode = height;
		}
		var newSize = new Mt.MSize();
		var ratio = width / height;
		switch (ratioMode) {
			case Mt.AspectRatioMode.IgnoreAspectRatio:
				newSize.width = width;
				newSize.height = height;
				break;
			case Mt.AspectRatioMode.KeepAspectRatio:
				if (ratio > 1.0) {
					// wide
					newSize.width = width;
					newSize.height = height * ratio;
				}
				else {
					// tall
					newSize.width = width * ratio;
					newSize.height = height;
				}
				break;
			case Mt.AspectRatioMode.KeepAspectRatioByExpanding:
				if (ratio > 1.0) {
					// wide
					newSize.width = width * ratio;
					newSize.height = height;
				}
				else {
					// tall
					newSize.width = width;
					newSize.height = height * ratio;
				}
				break;
		}
		
		return newSize;
	},
	transpose: function() {
		var w = this.width;
		var h = this.height;
		this.width = h;
		this.height = w;
		
		return this;
	}
});

Mt.MRect = new Class({
	initialize: function(args) {
		this.type = 'MRect';
		if (arguments.length == 2) {
			switch(arguments[1].type) {
				case 'MPoint':
					this.x = arguments[0].x;
					this.y = arguments[0].y;
					this.width = arguments[1].x - this.x;
					this.height = arguments[1].y - this.y;
					break;
				case 'MSize':
					this.x = arguments[0].x;
					this.y = arguments[0].y;
					this.width = arguments[1].width;
					this.height = arguments[1].height;
					break;
			}
		}
		if (arguments.length == 4) {
			this.x = arguments[0];
			this.y = arguments[1];
			this.width = aargumentsrgs[2];
			this.height = arguments[3];
		}
	}
});

Mt.MPoint = new Class({
	initialize: function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		this.type = 'MPoint';
	}
});


Mt.MObserver = new Class({
	Implements: [Events, Options],
	options: {},
	initialize: function() {
		this.fns = [];
	},
	subscribe: function(fn) {
		this.fns.push(fn);
	},
	unsubscribe: function(fn) {
		this.fns = this.fns.filter(function(el) {
			if (el !== fn) {
				return el;
			}
		})
	},
	fire: function(o, thisObj) {
		var self = thisObj || window;
		this.fns.each(function(item) {
			item.call(self, o);
		})
	}
});


Mt.MSizePolicy = new Class({
	initialize: function() {
		
	}
});
Mt.MSizePolicy.PolicyFlag = new Enum('GrowFlag ExpandFlag ShrinkFlag IgnoreFlag', '1 2 4 8');
Mt.MSizePolicy.Policy = new Enum('Fixed Minimum Maximum Preferred Expanding MinimumExpanding Ignored', '0 1 4 5 7 3 13');




// Template for new classes
/*
Mt.MTemplate = new Class({
	Extends: Mt.MWidget,
	options: {
		
	},
	initialize: function(parent, options){
		this.parent(parent, options)
		this.setOptions(options);
		this.type = 'MTemplate';
		
		// Member variables
		
		// Final injection into DOM
		this.container.inject(this.parentObj);
	}
});

// TODO
Mt.MComboBox;
Mt.MRollout;
Mt.MTab;
Mt.MenuBar;
Mt.Menu;
Mt.MStatusBar;
*/

