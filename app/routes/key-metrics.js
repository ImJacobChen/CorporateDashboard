import Ember from 'ember';

export default Ember.Route.extend({
	model: function () {
		return Ember.$.getJSON('data/key-metrics.json').then(function(data) {
			return {
		      payingCustomersData: {
		        labels: Object.keys(data.payingCustomersData),
		        series: [
		          Object.values(data.payingCustomersData),
		        ]
		      },
		      reportedIssuesData: {
		        labels: Object.keys(data.reportedIssuesData),
		        series: [
		          Object.values(data.reportedIssuesData),
		        ]
		      }
		    };
		});
	}
});
