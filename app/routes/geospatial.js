import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return Ember.$.get('/data/geospatial.csv').then(function(response) {

      var data = Papa.parse(response).data;
      
      var chartData = {};
      chartData.labels = data[0];
      chartData.series = [ data[1], data[2], data[3] ];
      return chartData;

    });
  }
});
