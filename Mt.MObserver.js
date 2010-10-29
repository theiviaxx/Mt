

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
})
