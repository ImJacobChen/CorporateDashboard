import Ember from 'ember';

export function toReadableDate(dateString) {
	var date = new Date(dateString[0]);
	return date.toDateString() + " " + date.getHours() + ":" + date.getSeconds();
}

export default Ember.Helper.helper(toReadableDate);
