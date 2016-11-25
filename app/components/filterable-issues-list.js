import Ember from 'ember';

export default Ember.Component.extend({
	
	filterBy: 'all',
	sortBy: 'default',

	filters: {
		all: function() {
			return true;
		},
		open: function(issue) {
			return issue.openclosed === "open";
		},
		closed: function(issue) {
			return issue.openclosed === "closed";
		}
	},
	sorters: {
		default: function() {},
		recent: function(a, b) {return a.submitted - b.submitted;},
		oldest: function(a, b) {return b.submitted - a.submitted;}
	},

	filteredList: function() {
		var filterFunction = this.filters[this.get('filterBy')];
		var sortFunction = this.sorters[this.get('sortBy')];
		return this.get('list').filter(filterFunction).sort(sortFunction);
	}.property('list', 'filterBy', 'sortBy'),

	actions: {
		filter: function(value) {
			this.set('filterBy', value);
		},
		sort: function(value) {
			this.set('sortBy', value);
		},
	}
});
