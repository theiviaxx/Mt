var Enum = new Class({
	initialize: function(vals, order) {
		var i = 0;
		order = order || '';
		order = order.split(' ');
		vals.split(' ').each(function(item, index) {
			if (order[index]) {
				this[item] = Number(order[index], 16);
			}
			else {
				this[item] = i;
				i += 1;
			}
		}, this);
	},
	getName: function(idx) {
		var keys = Object.keys(this);
		var values = Object.values(this);
		for (var i=0;i<values.length;i++) {
			if (values[i] == idx) {
				return keys[i];
			}
		}
	}
});


var Mt = {};
Mt.GUID = [];
Mt.getGUID = function() {
	var i = 0;
	while(Mt.GUID.contains(i)) {
		i++;
	}
	Mt.GUID.push(i);
	
	return i;
}

Mt.StyleParser = {
	toList: function(string) {
		var obj = string.split(' ');
		var val = [];
		obj.each(function(item) {
			val.push(item.toInt());
		});
		
		return val;
	}
}

Mt.utils = {
	clamp: function(min, max, val) {
		if (val > max) {
			return max;
		}
		if (val < min) {
			return min;
		}
		return val;
	}
}

// Find image regex
// string.test('(jpg|png|gif)')

Mt.MBlankIcon = 'http://' + location.host + '/Mt/i/blank.png';

// Global Enums
Mt.AspectRatioMode = new Enum('IgnoreAspectRatio KeepAspectRatio KeepAspectRatioByExpanding');
Mt.ScrollBarPolicy = new Enum('ScrollBarAsNeeded ScrollBarAlwaysOff ScrollBarAlwaysOn');
Mt.Orientation = new Enum('Horizontal Vertical');
Mt.Alignment = new Enum('AlignLeft AlignRight AlignHCenter AlignJustify AlignTop AlignBottom AlignVCenter', order='1 2 4 8 32 64 128');
Mt.ToolButtonStyle = new Enum('ToolButtonIconOnly ToolButtonTextOnly ToolButtonTextBesideIcon ToolButtonTextUnderIcon ToolButtonFollowStyle');
Mt.WindowModality = new Enum('NonModal WindowModal ApplicationModal');

// Window messages
Mt.WindowURL_404 = "The URL requested was not found";
Mt.WindowURL_500 = "The URL requested caused a server error";


// Core objects and functions
Mt.MSize = new Class({
	Implements: Options,
	initialize: function(width, height) {
		this.__width = width || 0;
		this.__height = height || 0;
		this.type = 'MSize';
	},
	height: function() {
		return this.__height;
	},
	isEmpty: function() {
		return (this.width() <= 0 || this.height() <= 0) ? true : false;
	},
	isNull: function() {
		return (this.width() <= 0 && this.height() <= 0) ? true : false;
	},
	scale: function(width, height, ratioMode) {
		if ($type(width) == 'number') {
			width = width;
			height = height;
			ratioMode = ratioMode || Mt.AspectRatioMode.IgnoreAspectRatio
		}
		else {
			width = width.width();
			height = width.height();
			ratioMode = height;
		}
		var newSize = new Mt.MSize();
		var ratio = width() / height();
		switch (ratioMode) {
			case Mt.AspectRatioMode.IgnoreAspectRatio:
				newSize.setWidth(width);
				newSize.setHeight(height);
				break;
			case Mt.AspectRatioMode.KeepAspectRatio:
				if (ratio > 1.0) {
					// wide
					newSize.setWidth(width);
					newSize.setHeight(height * ratio);
				}
				else {
					// tall
					newSize.setWidth(width * ratio);
					newSize.setHeight(height);
				}
				break;
			case Mt.AspectRatioMode.KeepAspectRatioByExpanding:
				if (ratio > 1.0) {
					// wide
					newSize.setWidth(width * ratio);
					newSize.setHeight(height);
				}
				else {
					// tall
					newSize.setWidth(width);
					newSize.setHeight(height * ratio);
				}
				break;
		}
		
		return newSize;
	},
	setWidth: function(w) {
		this.__width = w.toInt();
	},
	setHeight: function(h) {
		this.__height = h.toInt();
	},
	transpose: function() {
		var w = this.width();
		var h = this.height();
		this.setWidth(h);
		this.setHeight(w);
		
		return this;
	},
	width: function() {
		return this.__width;
	}
});

Mt.MRect = new Class({
	initialize: function() {
		this.type = 'MRect';
		
		// private members
		this.__x = 0;
		this.__y = 0;
		this.__width = 0;
		this.__height = 0;
		
		switch (arguments.length) {
			case 0:
				// pass
				break;
			case 1:
				// MRect
				break;
			case 2:
				this.setTop(arguments[0].y());
				this.setLeft(arguments[0].x());
				if (arguments[1].type == 'MPoint') {
					// MPoint: TL, BR
					this.setBottom(arguments[1].y());
					this.setRight(arguments[1].y());
				}
				else {
					// MPoint: TL, MSize
					this.setSize(arguments[1]);
				}
				break;
			case 4:
				// left, top, width, height
				this.setRect(arguments[0],arguments[1],arguments[2],arguments[3]);
				break;
		}
	},
	adjust: function() {
		
	},
	adjusted: function() {
		
	},
	bottom: function() {
		return this.y() + this.hieght();
	},
	bottomLeft: function() {
		return new Mt.MPoint(this.left(), this.bottom());
	},
	bottomRight: function() {
		return new Mt.MPoint(this.right(), this.bottom());
	},
	center: function() {
		return new Mt.MPoint(this.left() + (this.width() / 2), this.top() + (this.height() / 2));
	},
	contains: function() {
		
	},
	getCoords: function() {
		return [this.x(), this.y(), this.right(), this.bottom()];
	},
	getRect: function() {
		return [this.x(), this.y(), this.width(), this.height()];
	},
	height: function() {
		return this.__height;
	},
	intersect: function() {
		
	},
	intersected: function() {
		
	},
	intersects: function() {
		
	},
	isEmpty: function() {
		return (this.left > this.right() || this.top > this.bottom()) ? true : false;
	},
	isNull: function() {
		return (this.left() == this.right && this.top() == this.bottom()) ? true : false;
	},
	isValid: function() {
		return (this.left < this.right() && this.top < this.bottom()) ? true : false;
	},
	left: function() {
		return this.x();
	},
	moveBottom: function(i) {
		this.setY(i - this.height());
		
		return this;
	},
	moveBottomLeft: function(p) {
		this.moveBottom(p.y());
		this.moveLeft(p.x());
		
		return this;
	},
	moveBottomRight: function(p) {
		this.moveBottom(p.y());
		this.moveRight(p.x());
		
		return this;
	},
	moveCenter: function(p) {
		var c = this.center();
		this.setX(p.x() - c.x() + this.x());
		this.setY(p.y() - c.y() + this.y());
		
		return this;
	},
	moveLeft: function(i) {
		this.setX(i);
		
		return this;
	},
	moveRight: function(i) {
		this.setX(i - this.width());
		
		return this;
	},
	moveTo: function(p) {
		this.moveTop(p.y());
		this.moveLeft(p.x());
		
		return this;
	},
	moveTop: function(i) {
		this.setY(i);
		
		return this;
	},
	moveTopLeft: function(p) {
		this.moveTop(p.y());
		this.moveLeft(p.x());
		
		return this;
	},
	moveTopRight: function(p) {
		this.moveTop(p.y());
		this.moveRight(p.x());
		
		return this;
	},
	normalized: function() {
		
	},
	right: function() {
		return this.x() + this.width();
	},
	setBottom: function(i) {
		this.__height = this.y() + i;
		
		return this;
	},
	setBottomLeft: function(p) {
		this.setBottom(p.y());
		this.setLeft(p.x());
		
		return this;
	},
	setBottomRight: function(p) {
		this.setBottom(p.y());
		this.setRight(p.x());
		
		return this;
	},
	setCoords: function(x1, y1, x2, y2) {
		this.setTopLeft(new Mt.MPoint(x1, y1));
		this.setBottomRight(new Mt.MPoint(x2, y2));
		
		return this;
	},
	setHeight: function(i) {
		this.__height = i;
		
		return this;
	},
	setLeft: function(i) {
		this.setX(i);
		
		return this;
	},
	setRect: function(x, y, w, h) {
		this.setX(x);
		this.setY(y);
		this.setWidth(w);
		this.setHeight(h);
		
		return this;
	},
	setRight: function(i) {
		this.__width = this.x() + i;
		
		return this;
	},
	setSize: function() {
		var size = (arguments.length > 1) ? new Mt.MSize(arguments[0], arguments[1]) : arguments[0];
		this.setWidth(size.width());
		this.setHeight(size.height());
		
		return this;
	},
	setTop: function(i) {
		this.setY(i);
	},
	setTopLeft: function(p) {
		this.setTop(p.y());
		this.setLeft(p.x());
		
		return this;
	},
	setTopRight: function(p) {
		this.setTop(p.y());
		this.setRight(p.x());
		
		return this;
	},
	setWidth: function(i) {
		this.__width = i;
		
		return this;
	},
	setX: function(i) {
		this.__x = i;
		
		return this;
	},
	setY: function(i) {
		this.__y = i;
		
		return this;
	},
	size: function() {
		return new Mt.MSize(this.width(), this.height());
	},
	top: function() {
		return this.y();
	},
	topLeft: function() {
		return new Mt.MPoint(this.x(), this.y());
	},
	topRight: function() {
		return new Mt.MPoint(this.x() + this.width(), this.y());
	},
	translate: function() {
		
	},
	translated: function() {
		
	},
	unite: function() {
		
	},
	united: function() {
		
	},
	width: function() {
		return this.__width;
	},
	x: function() {
		return this.__x;
	},
	y: function() {
		return this.__y;
	}
});

Mt.MPoint = new Class({
	initialize: function(x, y) {
		this.__x = x || 0;
		this.__y = y || 0;
		this.type = 'MPoint';
	},
	x: function() {
		return this.__x;
	},
	y: function() {
		return this.__y;
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

Mt.MMargins = new Class({
	
	initialize: function() {
		this.__bottom = 0;
		this.__left = 0;
		this.__right = 0;
		this.__top = 0;
		
		switch (arguments.length) {
			case 1:
				this.setTop(arguments[0].top());
				this.setLeft(arguments[0].left());
				this.setRight(arguments[0].right());
				this.setBottom(arguments[0].bottom());
				break;
			case 4:
				this.setTop(arguments[1]);
				this.setLeft(arguments[0]);
				this.setRight(arguments[2]);
				this.setBottom(arguments[3]);
				break;
		}
	},
	bottom: function() {
		return this.__bottom;
	},
	isNull: function() {
		return (this.bottom() + this.left() + this.right() + this.top() == 0) ? true : false;
	},
	left: function() {
		return this.__left;
	},
	right: function() {
		return this.__right;
	},
	setBottom: function(val) {
		this.__bottom = val.toInt();
	},
	setLeft: function(val) {
		this.__left = val.toInt();
	},
	setRight: function(val) {
		this.__right = val.toInt();
	},
	setTop: function(val) {
		this.__top = val.toInt();
	},
	top: function() {
		return this.__top;
	},
})


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
		
		// Member variables
		
	},
	binds: function() {
		// Optional. Set custom events here
		this.events = {
			'click': this.changeEvent.bind(this)
		}
	},
	__build: function() {
		// Optional.  If the element needs to be special
		var element = new Element('div');
		
		return element;
	},
	__type: function() {
		this.type = 'MTemplate';
		return this.type;
	}
});
*/

