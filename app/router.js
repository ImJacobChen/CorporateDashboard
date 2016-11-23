import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('geospatial');
  this.route('key-metrics');
  this.route('data');
});

export default Router;
