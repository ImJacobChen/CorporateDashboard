import Ember from 'ember';

export default Ember.Object.extend({
	interval: function() {
		return 5000; // Time between polls (ms)
	}.property().readOnly(),

	// Schedules the function 'f' to be executed every 'interval' time.
	schedule: function(f) {
		return Ember.run.later(this, function() {
			f.apply(this);
			this.set('timer', this.schedule(f));
		}, this.get('interval'));
	},

	// Stops the pollster
	stop: function() {
		console.log('Stopping polling');
		Ember.run.cancel(this.get('timer'));
	},

	// Starts the pollster, i.e. executes the 'onPoll' function every interval.
	start: function() {
		console.log('Starting polling')
		this.set('timer', this.schedule(this.get('onPoll')));
	},

	onPoll: function() {
		// Issue JSON request and add data to the store
	}
});