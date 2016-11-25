import Ember from 'ember';
import Pollster from './../custom-objects/pollster';

export default Ember.Route.extend({
	model() {
	    return Ember.$.getJSON("data/issues.json");
	},

	setupController: function(controller, model) {
  	this._super(controller, model);
    var self = this;
  	if (Ember.isNone(this.get('pollster'))) {
  		this.set('pollster', Pollster.create({
  			onPoll: function() {
  				Ember.$.getJSON("data/issues.json").then(function(response){
  					self.set('controller.model', response);
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
