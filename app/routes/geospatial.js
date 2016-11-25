import Ember from 'ember';
import Pollster from './../custom-objects/pollster';

export default Ember.Route.extend({
  model: function () {
  	return Ember.$.get('/data/geospatial.csv').then(function(response) {

      var data = Papa.parse(response).data;
      
      var chartData = {};
      chartData.labels = data[0];
      chartData.series = [ data[1], data[2], data[3] ];
      return chartData;

    });
  },
  
  setupController: function(controller, model) {
  	this._super(controller, model);
    var self = this;
  	if (Ember.isNone(this.get('pollster'))) {
  		this.set('pollster', Pollster.create({
  			onPoll: function() {
          Ember.$.get('/data/geospatial.csv').then(function(response) {

            let data = Papa.parse(response).data;
            
            let chartData = {};
            chartData.labels = data[0];
            chartData.series = [ data[1], data[2], data[3] ];

            self.set('controller.model', chartData);

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
