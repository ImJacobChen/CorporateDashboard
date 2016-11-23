import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			users: {
				data: {
					labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
		          	series: [
		             	[287, 385, 490, 562, 594, 626, 698, 895, 952],
		            	[67, 152, 193, 240, 387, 435, 535, 642, 744],
		            	[23, 113, 67, 108, 190, 239, 307, 410, 410]
		          	]
				},
	          	options: {
	          		lineSmooth: false,
		          	low: 0,
		          	high: 1000,
		          	showArea: true,
		          	height: "245px",
		          	axisX: {
		          	  showGrid: false,
		          	},
		          	lineSmooth: Chartist.Interpolation.simple({
		          	  divisor: 3
		          	}),
		          	showLine: true,
		          	showPoint: false,
	          	},
	          	responsive: [
	          		['screen and (max-width: 640px)', {
	           			axisX: {
	             	 		labelInterpolationFnc: function (value) {
	                			return value[0];
	              			}
	            		}
	          		}]
        		]
			},
			sales: {
				data: {
					labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	          		series: [
	            		[542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
	            		[230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]
	          		]
				},
          		options: {
		            seriesBarDistance: 10,
		            axisX: {
		                showGrid: false
		            },
		            height: "245px"
		        },
		        responsive: [
		          	['screen and (max-width: 640px)', {
		            	seriesBarDistance: 5,
		            	axisX: {
		              		labelInterpolationFnc: function (value) {
		                		return value[0];
		              		}
		            	}
		          	}]
		        ],
			},
			email: {
				data: {
					labels: ['62%','32%','6%'],
          			series: [62, 32, 6]
				},
	            options: {
	            	donut: true,   
	            }
			}
		});
	}
});
