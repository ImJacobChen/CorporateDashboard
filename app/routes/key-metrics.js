import Ember from 'ember';
import Pollster from './../custom-objects/pollster';

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
	},

	setupController: function(controller, model) {
		this._super(controller, model);
	    var self = this;
	  	if (Ember.isNone(this.get('pollster'))) {
	  		this.set('pollster', Pollster.create({
	  			onPoll: function() {
		          Ember.$.get('data/key-metrics.json').then(function(response) {

		            var data = {
				      payingCustomersData: {
				        labels: Object.keys(response.payingCustomersData),
				        series: [
				          Object.values(response.payingCustomersData),
				        ]
				      },
				      reportedIssuesData: {
				        labels: Object.keys(response.reportedIssuesData),
				        series: [
				          Object.values(response.reportedIssuesData),
				        ]
				      }
				    };

		            self.set('controller.model', data);

		          });
	  			}
	  		}));
	  	} 
	  	this.get('pollster').start();
	  },

	  // This is called upon exiting the Route
	  deactivate: function() {
	  	this.get('pollster').stop();
	  },
});
