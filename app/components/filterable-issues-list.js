import Ember from 'ember';

export default Ember.Component.extend({
	
	filterBy: 'all',
	sortBy: 'priority',

	filters: {
		all: function() {
			return true;
		},
		uk: function(issue) {
			return issue.location === 'UK';
		},
		usa: function(issue) {
			return issue.location === 'USA';
		},
		niger: function(issue) {
			return issue.location === 'Niger';
		},
	},
	sorters: {
		default: function() {},
		priorityAsc: function(a, b) {return a.priority - b.priority;},
		priorityDesc: function(a, b) {return b.priority - a.priority;}
	},

	filteredList: function() {
		var filterFunction = this.filters[this.get('filterBy')];
		var sortFunction = this.sorters[this.get('sortBy')];
		return this.get('list').filter(filterFunction).sort(sortFunction);
	}.property('list', 'filterBy', 'sortBy'),

	actions: {
		filterCountry: function(value) {
			this.set('filterBy', value);
		},
		sortBy: function(value) {
			this.set('sortBy', value);
		}
	}
});
