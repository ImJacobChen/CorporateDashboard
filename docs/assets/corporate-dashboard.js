"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('corporate-dashboard/app', ['exports', 'ember', 'corporate-dashboard/resolver', 'ember-load-initializers', 'corporate-dashboard/config/environment'], function (exports, _ember, _corporateDashboardResolver, _emberLoadInitializers, _corporateDashboardConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _corporateDashboardConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _corporateDashboardConfigEnvironment['default'].podModulePrefix,
    Resolver: _corporateDashboardResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _corporateDashboardConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('corporate-dashboard/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'corporate-dashboard/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _corporateDashboardConfigEnvironment) {

  var name = _corporateDashboardConfigEnvironment['default'].APP.name;
  var version = _corporateDashboardConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('corporate-dashboard/components/chartist-chart', ['exports', 'ember'], function (exports, _ember) {
  var computed = _ember['default'].computed;
  var observer = _ember['default'].observer;
  var Component = _ember['default'].Component;
  var capitalize = _ember['default'].String.capitalize;
  exports['default'] = Component.extend({
    chart: null,

    // This is the structure that chartist is expecting, it can be overidden in
    // your components which extend this one.
    defaultDataStructure: {
      labels: [],
      series: []
    },

    classNameBindings: ['ratio'],
    classNames: ['ct-chart'],

    // The ratio of the chart as it scales up/down in size.
    //
    // Available ratios:
    //
    // name              ratio
    // ct-square         1
    // ct-minor-second   15:16
    // ct-major-second   8:9
    // ct-minor-third    5:6
    // ct-major-third    4:5
    // ct-perfect-fourth 3:4
    // ct-perfect-fifth  2:3
    // ct-minor-sixth    5:8
    // ct-golden-section 1:1.618
    // ct-major-sixth    3:5
    // ct-minor-seventh  9:16
    // ct-major-seventh  8:15
    // ct-octave         1:2
    // ct-major-tenth    2:5
    // ct-major-eleventh 3:8
    // ct-major-twelfth  1:3
    // ct-double-octave  1:4
    ratio: 'ct-square',

    type: 'line',
    chartType: computed('type', function () {
      return capitalize(this.get('type'));
    }),

    data: null,
    options: null,
    responsiveOptions: null,
    updateOnData: true,

    // Don't use this! It's a testing hook
    _createdEventHook: function _createdEventHook() {},

    // Before trying to do anything else, let's check to see if any necessary
    // attributes are missing or if anything else is fishy about attributes
    // provided to the component in the template.
    //
    // We're doing this to help ease people into this project. Instead of just
    // getting some "uncaught exception" we're hoping these error messages will
    // point them in the right direction.
    init: function init() {
      var data = this.get('data');
      var type = this.get('type');

      if (typeof data === 'string') {
        console.info('Chartist-chart: The value of the "data" attribute on should be an object, it\'s a string.');

        var defaultDataStructure = this.get('defaultDataStructure');

        this.set('data', defaultDataStructure);
      }

      if (!type || !Chartist[this.get('chartType')]) {
        console.info('Chartist-chart: Invalid or missing "type" attribute, defaulting to "line".');
        this.set('type', 'line');
      }

      this._super.apply(this, arguments);
    },

    // This is where the business happens. This will only run if checkForReqs
    // doesn't find any problems.
    didInsertElement: function didInsertElement() {
      var data = this.get('data') || this.get('defaultDataStructure');

      var chart = new (Chartist[this.get('chartType')])(this.get('element'), data, this.get('options'), this.get('responsiveOptions'));

      chart.on('created', this._createdEventHook);

      this.set('chart', chart);

      this._super.apply(this, arguments);
    },

    onData: observer('data', function () {
      if (this.get('updateOnData')) {
        var opts = this.get('options') || {};

        this.get('chart').update(this.get('data'), opts);
      }
    })
  });
});
/* global Chartist */
define('corporate-dashboard/components/filterable-issues-list', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({

		filterBy: 'all',
		sortBy: 'default',

		filters: {
			all: function all() {
				return true;
			},
			open: function open(issue) {
				return issue.openclosed === "open";
			},
			closed: function closed(issue) {
				return issue.openclosed === "closed";
			}
		},
		sorters: {
			'default': function _default() {},
			recent: function recent(a, b) {
				return a.submitted - b.submitted;
			},
			oldest: function oldest(a, b) {
				return b.submitted - a.submitted;
			}
		},

		filteredList: (function () {
			var filterFunction = this.filters[this.get('filterBy')];
			var sortFunction = this.sorters[this.get('sortBy')];
			return this.get('list').filter(filterFunction).sort(sortFunction);
		}).property('list', 'filterBy', 'sortBy'),

		actions: {
			filter: function filter(value) {
				this.set('filterBy', value);
			},
			sort: function sort(value) {
				this.set('sortBy', value);
			}
		}
	});
});
define('corporate-dashboard/controllers/data', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({});
});
define('corporate-dashboard/custom-objects/pollster', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Object.extend({
		interval: (function () {
			return 5000; // Time between polls (ms)
		}).property().readOnly(),

		// Schedules the function 'f' to be executed every 'interval' time.
		schedule: function schedule(f) {
			return _ember['default'].run.later(this, function () {
				f.apply(this);
				this.set('timer', this.schedule(f));
			}, this.get('interval'));
		},

		// Stops the pollster
		stop: function stop() {
			console.log('Stopping polling');
			_ember['default'].run.cancel(this.get('timer'));
		},

		// Starts the pollster, i.e. executes the 'onPoll' function every interval.
		start: function start() {
			console.log('Starting polling');
			this.set('timer', this.schedule(this.get('onPoll')));
		},

		onPoll: function onPoll() {
			// Issue JSON request and add data to the store
		}
	});
});
define('corporate-dashboard/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('corporate-dashboard/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define("corporate-dashboard/helpers/to-readable-date", ["exports", "ember"], function (exports, _ember) {
	exports.toReadableDate = toReadableDate;

	function toReadableDate(dateString) {
		var date = new Date(dateString[0]);
		return date.toDateString() + " " + date.getHours() + ":" + date.getSeconds();
	}

	exports["default"] = _ember["default"].Helper.helper(toReadableDate);
});
define('corporate-dashboard/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'corporate-dashboard/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _corporateDashboardConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_corporateDashboardConfigEnvironment['default'].APP.name, _corporateDashboardConfigEnvironment['default'].APP.version)
  };
});
define('corporate-dashboard/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('corporate-dashboard/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('corporate-dashboard/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('corporate-dashboard/initializers/export-application-global', ['exports', 'ember', 'corporate-dashboard/config/environment'], function (exports, _ember, _corporateDashboardConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_corporateDashboardConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _corporateDashboardConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_corporateDashboardConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('corporate-dashboard/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('corporate-dashboard/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('corporate-dashboard/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("corporate-dashboard/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('corporate-dashboard/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('corporate-dashboard/router', ['exports', 'ember', 'corporate-dashboard/config/environment'], function (exports, _ember, _corporateDashboardConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _corporateDashboardConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('geospatial');
    this.route('key-metrics');
    this.route('data');
  });

  exports['default'] = Router;
});
define('corporate-dashboard/routes/data', ['exports', 'ember', 'corporate-dashboard/custom-objects/pollster'], function (exports, _ember, _corporateDashboardCustomObjectsPollster) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return _ember['default'].$.getJSON("data/issues.json");
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);
      var self = this;
      if (_ember['default'].isNone(this.get('pollster'))) {
        this.set('pollster', _corporateDashboardCustomObjectsPollster['default'].create({
          onPoll: function onPoll() {
            _ember['default'].$.getJSON("data/issues.json").then(function (response) {
              self.set('controller.model', response);
            });
          }
        }));
      }
      this.get('pollster').start();
    },

    // This is called upon exiting the Route
    deactivate: function deactivate() {
      this.get('pollster').stop();
    }
  });
});
define('corporate-dashboard/routes/geospatial', ['exports', 'ember', 'corporate-dashboard/custom-objects/pollster'], function (exports, _ember, _corporateDashboardCustomObjectsPollster) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return _ember['default'].$.get('/data/geospatial.csv').then(function (response) {

        var data = Papa.parse(response).data;

        var chartData = {};
        chartData.labels = data[0];
        chartData.series = [data[1], data[2], data[3]];
        return chartData;
      });
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);
      var self = this;
      if (_ember['default'].isNone(this.get('pollster'))) {
        this.set('pollster', _corporateDashboardCustomObjectsPollster['default'].create({
          onPoll: function onPoll() {
            _ember['default'].$.get('/data/geospatial.csv').then(function (response) {

              var data = Papa.parse(response).data;

              var chartData = {};
              chartData.labels = data[0];
              chartData.series = [data[1], data[2], data[3]];

              self.set('controller.model', chartData);
            });
          }
        }));
      }
      this.get('pollster').start();
    },

    // This is called upon exiting the Route
    deactivate: function deactivate() {
      this.get('pollster').stop();
    }
  });
});
define('corporate-dashboard/routes/index', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Route.extend({
		model: function model() {
			return _ember['default'].RSVP.hash({
				users: {
					data: {
						labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
						series: [[287, 385, 490, 562, 594, 626, 698, 895, 952], [67, 152, 193, 240, 387, 435, 535, 642, 744], [23, 113, 67, 108, 190, 239, 307, 410, 410]]
					},
					options: {
						lineSmooth: false,
						low: 0,
						high: 1000,
						showArea: true,
						height: "245px",
						axisX: {
							showGrid: false
						},
						lineSmooth: Chartist.Interpolation.simple({
							divisor: 3
						}),
						showLine: true,
						showPoint: false
					},
					responsive: [['screen and (max-width: 640px)', {
						axisX: {
							labelInterpolationFnc: function labelInterpolationFnc(value) {
								return value[0];
							}
						}
					}]]
				},
				sales: {
					data: {
						labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
						series: [[542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895], [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]]
					},
					options: {
						seriesBarDistance: 10,
						axisX: {
							showGrid: false
						},
						height: "245px"
					},
					responsive: [['screen and (max-width: 640px)', {
						seriesBarDistance: 5,
						axisX: {
							labelInterpolationFnc: function labelInterpolationFnc(value) {
								return value[0];
							}
						}
					}]]
				},
				email: {
					data: {
						labels: ['62%', '32%', '6%'],
						series: [62, 32, 6]
					},
					options: {
						donut: true
					}
				}
			});
		}
	});
});
define('corporate-dashboard/routes/key-metrics', ['exports', 'ember', 'corporate-dashboard/custom-objects/pollster'], function (exports, _ember, _corporateDashboardCustomObjectsPollster) {
	exports['default'] = _ember['default'].Route.extend({
		model: function model() {
			return _ember['default'].$.getJSON('data/key-metrics.json').then(function (data) {
				return {
					payingCustomersData: {
						labels: Object.keys(data.payingCustomersData),
						series: [Object.values(data.payingCustomersData)]
					},
					reportedIssuesData: {
						labels: Object.keys(data.reportedIssuesData),
						series: [Object.values(data.reportedIssuesData)]
					}
				};
			});
		},

		setupController: function setupController(controller, model) {
			this._super(controller, model);
			var self = this;
			if (_ember['default'].isNone(this.get('pollster'))) {
				this.set('pollster', _corporateDashboardCustomObjectsPollster['default'].create({
					onPoll: function onPoll() {
						_ember['default'].$.get('data/key-metrics.json').then(function (response) {

							var data = {
								payingCustomersData: {
									labels: Object.keys(response.payingCustomersData),
									series: [Object.values(response.payingCustomersData)]
								},
								reportedIssuesData: {
									labels: Object.keys(response.reportedIssuesData),
									series: [Object.values(response.reportedIssuesData)]
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
		deactivate: function deactivate() {
			this.get('pollster').stop();
		}
	});
});
define('corporate-dashboard/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("corporate-dashboard/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 20
            },
            "end": {
              "line": 21,
              "column": 20
            }
          },
          "moduleName": "corporate-dashboard/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "ti-panel");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Dashboard");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 20
            },
            "end": {
              "line": 27,
              "column": 20
            }
          },
          "moduleName": "corporate-dashboard/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "ti-world");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Geospatial");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 30,
              "column": 20
            },
            "end": {
              "line": 33,
              "column": 20
            }
          },
          "moduleName": "corporate-dashboard/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "ti-search");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Key Metrics");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 36,
              "column": 20
            },
            "end": {
              "line": 39,
              "column": 20
            }
          },
          "moduleName": "corporate-dashboard/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "ti-stats-up");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Data");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 118,
            "column": 6
          }
        },
        "moduleName": "corporate-dashboard/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "wrapper");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sidebar");
        dom.setAttribute(el2, "data-background-color", "white");
        dom.setAttribute(el2, "data-active-color", "danger");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("\n		Tip 1: you can change the color of the sidebar's background using: data-background-color=\"white | black\"\n		Tip 2: you can change the color of the active button using the data-active-color=\"primary | info | success | warning | danger\"\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "sidebar-wrapper");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "logo");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5, "href", "#");
        dom.setAttribute(el5, "class", "simple-text");
        var el6 = dom.createTextNode("\n                    Sparco Inc\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4, "class", "nav");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "main-panel");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("nav");
        dom.setAttribute(el3, "class", "navbar navbar-default");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "container-fluid");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "navbar-header");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("button");
        dom.setAttribute(el6, "type", "button");
        dom.setAttribute(el6, "class", "navbar-toggle");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "sr-only");
        var el8 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "icon-bar bar1");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "icon-bar bar2");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "icon-bar bar3");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "class", "navbar-brand");
        dom.setAttribute(el6, "href", "#");
        var el7 = dom.createTextNode("Dashboard");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "collapse navbar-collapse");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6, "class", "nav navbar-nav navbar-right");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("a");
        dom.setAttribute(el8, "href", "#");
        dom.setAttribute(el8, "class", "dropdown-toggle");
        dom.setAttribute(el8, "data-toggle", "dropdown");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-panel");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n								");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Stats");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("ul");
        dom.setAttribute(el8, "class", "dropdown-menu");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("li");
        var el10 = dom.createElement("a");
        dom.setAttribute(el10, "href", "#");
        var el11 = dom.createTextNode("Total Users +15%");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("li");
        var el10 = dom.createElement("a");
        dom.setAttribute(el10, "href", "#");
        var el11 = dom.createTextNode("Email Opens 47%");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                 ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("li");
        var el10 = dom.createElement("a");
        dom.setAttribute(el10, "href", "#");
        var el11 = dom.createTextNode("Total Weekly Sales: £3200");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7, "class", "dropdown");
        var el8 = dom.createTextNode("\n                              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("a");
        dom.setAttribute(el8, "href", "#");
        dom.setAttribute(el8, "class", "dropdown-toggle");
        dom.setAttribute(el8, "data-toggle", "dropdown");
        var el9 = dom.createTextNode("\n                                    ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-bell");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                    ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        dom.setAttribute(el9, "class", "notification");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n									");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Notifications");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n									");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("b");
        dom.setAttribute(el9, "class", "caret");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("ul");
        dom.setAttribute(el8, "class", "dropdown-menu");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("li");
        var el10 = dom.createElement("a");
        dom.setAttribute(el10, "href", "#");
        var el11 = dom.createTextNode("No new notifications!");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("a");
        dom.setAttribute(el8, "href", "#");
        var el9 = dom.createTextNode("\n								");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-settings");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n								");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Settings");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "content");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("footer");
        dom.setAttribute(el3, "class", "footer");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "container-fluid");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("nav");
        dom.setAttribute(el5, "class", "pull-left");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        var el7 = dom.createTextNode("\n\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("a");
        dom.setAttribute(el8, "href", "#");
        var el9 = dom.createTextNode("\n                                Coporate Dashboard\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "copyright pull-right");
        var el6 = dom.createTextNode("\n                    © Made with ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6, "class", "fa fa-heart heart");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 3, 3]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [5]), 1, 1);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [7]), 1, 1);
        morphs[4] = dom.createMorphAt(dom.childAt(element0, [3, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "link-to", ["application"], [], 0, null, ["loc", [null, [18, 20], [21, 32]]]], ["block", "link-to", ["geospatial"], [], 1, null, ["loc", [null, [24, 20], [27, 32]]]], ["block", "link-to", ["key-metrics"], [], 2, null, ["loc", [null, [30, 20], [33, 32]]]], ["block", "link-to", ["data"], [], 3, null, ["loc", [null, [36, 20], [39, 32]]]], ["content", "outlet", ["loc", [null, [95, 12], [95, 22]]]]],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  })());
});
define("corporate-dashboard/templates/components/chartist-chart", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "corporate-dashboard/templates/components/chartist-chart.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("corporate-dashboard/templates/components/filterable-issues-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 31,
              "column": 9
            },
            "end": {
              "line": 41,
              "column": 12
            }
          },
          "moduleName": "corporate-dashboard/templates/components/filterable-issues-list.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        		");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n                	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(7);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [7]), 0, 0);
          morphs[4] = dom.createMorphAt(dom.childAt(element0, [9]), 0, 0);
          morphs[5] = dom.createMorphAt(dom.childAt(element0, [11]), 0, 0);
          morphs[6] = dom.createMorphAt(dom.childAt(element0, [13]), 0, 0);
          return morphs;
        },
        statements: [["content", "issue.submitted", ["loc", [null, [33, 21], [33, 40]]]], ["content", "issue.name", ["loc", [null, [34, 21], [34, 35]]]], ["content", "issue.email", ["loc", [null, [35, 21], [35, 36]]]], ["content", "issue.description", ["loc", [null, [36, 21], [36, 42]]]], ["content", "issue.openclosed", ["loc", [null, [37, 21], [37, 41]]]], ["content", "issue.closed", ["loc", [null, [38, 24], [38, 40]]]], ["content", "issue.employeeName", ["loc", [null, [39, 21], [39, 43]]]]],
        locals: ["issue"],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 41,
              "column": 12
            },
            "end": {
              "line": 50,
              "column": 9
            }
          },
          "moduleName": "corporate-dashboard/templates/components/filterable-issues-list.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("No problems here right now");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 55,
            "column": 0
          }
        },
        "moduleName": "corporate-dashboard/templates/components/filterable-issues-list.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "content");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h6");
        var el3 = dom.createTextNode("Filter");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "selectCountry");
        var el4 = dom.createTextNode("Filter");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("select");
        dom.setAttribute(el3, "id", "selectCountry");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("option");
        dom.setAttribute(el4, "value", "all");
        var el5 = dom.createTextNode("All");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("option");
        dom.setAttribute(el4, "value", "open");
        var el5 = dom.createTextNode("Open");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("option");
        dom.setAttribute(el4, "value", "closed");
        var el5 = dom.createTextNode("Closed");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "sortBy");
        var el4 = dom.createTextNode("Sort");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("select");
        dom.setAttribute(el3, "id", "sortBy");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("option");
        dom.setAttribute(el4, "value", "default");
        var el5 = dom.createTextNode("Default");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("option");
        dom.setAttribute(el4, "value", "newest");
        var el5 = dom.createTextNode("Newest First");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("option");
        dom.setAttribute(el4, "value", "oldest");
        var el5 = dom.createTextNode("Oldest First");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "content table-responsive table-full-width");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("table");
        dom.setAttribute(el2, "class", "table table-striped");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("thead");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Submitted");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Email");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Description");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Open/Closed?");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Closed On");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Employee Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tbody");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0, 3]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element1, [7]);
        var morphs = new Array(4);
        morphs[0] = dom.createAttrMorph(element2, 'onchange');
        morphs[1] = dom.createAttrMorph(element3, 'onchange');
        morphs[2] = dom.createMorphAt(dom.childAt(fragment, [2, 1, 3]), 1, 1);
        morphs[3] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        return morphs;
      },
      statements: [["attribute", "onchange", ["subexpr", "action", ["filter"], ["value", "target.value"], ["loc", [null, [5, 25], [5, 65]]]]], ["attribute", "onchange", ["subexpr", "action", ["sort"], ["value", "target.value"], ["loc", [null, [12, 25], [12, 63]]]]], ["block", "each", [["get", "filteredList", ["loc", [null, [31, 17], [31, 29]]]]], [], 0, 1, ["loc", [null, [31, 9], [50, 18]]]], ["content", "yield", ["loc", [null, [54, 0], [54, 9]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("corporate-dashboard/templates/data", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.2",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 16
            },
            "end": {
              "line": 10,
              "column": 16
            }
          },
          "moduleName": "corporate-dashboard/templates/data.hbs"
        },
        isEmpty: true,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 16,
            "column": 0
          }
        },
        "moduleName": "corporate-dashboard/templates/data.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container-fluid");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-12");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "header");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6, "class", "title");
        var el7 = dom.createTextNode("Current Issues");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6, "class", "category");
        var el7 = dom.createTextNode("Current Open Issues");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1, 1, 1]), 3, 3);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["block", "filterable-issues-list", [], ["list", ["subexpr", "@mut", [["get", "model", ["loc", [null, [9, 47], [9, 52]]]]], [], []]], 0, null, ["loc", [null, [9, 16], [10, 43]]]], ["content", "outlet", ["loc", [null, [15, 0], [15, 10]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("corporate-dashboard/templates/geospatial", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "corporate-dashboard/templates/geospatial.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container-fluid");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-12");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "header");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6, "class", "title");
        var el7 = dom.createTextNode("Employees Per Location");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6, "class", "category");
        var el7 = dom.createTextNode("Location");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "chart-legend");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-info");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Management\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-danger");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Engineers\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-warning");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" HR\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-reload");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Updated 3 minutes ago\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1, 1, 1, 3]), 1, 1);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["inline", "chartist-chart", [], ["type", "bar", "data", ["subexpr", "@mut", [["get", "model", ["loc", [null, [10, 53], [10, 58]]]]], [], []]], ["loc", [null, [10, 20], [10, 60]]]], ["content", "outlet", ["loc", [null, [27, 0], [27, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("corporate-dashboard/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 175,
            "column": 0
          }
        },
        "moduleName": "corporate-dashboard/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container-fluid");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-lg-3 col-sm-6");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-5");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "icon-big icon-warning text-center");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-server");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-7");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "numbers");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Capacity");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                105GB\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-reload");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Updated now\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-lg-3 col-sm-6");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-5");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "icon-big icon-success text-center");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-wallet");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-7");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "numbers");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Revenue");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                $1,345\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-calendar");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Last day\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-lg-3 col-sm-6");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-5");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "icon-big icon-danger text-center");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-pulse");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-7");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "numbers");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Errors");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                23\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-timer");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" In the last hour\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-lg-3 col-sm-6");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-5");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "icon-big icon-info text-center");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-twitter-alt");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-7");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "numbers");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Followers");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                +45\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-reload");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Updated now\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    \n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-12");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "header");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6, "class", "title");
        var el7 = dom.createTextNode("Users Behavior");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6, "class", "category");
        var el7 = dom.createTextNode("24 Hours performance");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "chart-legend");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-info");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Open\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-danger");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Click\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-warning");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Click Second Time\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-reload");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Updated 3 minutes ago\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "header");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6, "class", "title");
        var el7 = dom.createTextNode("Email Statistics");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6, "class", "category");
        var el7 = dom.createTextNode("Last Campaign Performance");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "chart-legend");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-info");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Open\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-danger");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Bounce\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-warning");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Unsubscribe\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-timer");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Campaign sent 2 days ago\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "header");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6, "class", "title");
        var el7 = dom.createTextNode("2015 Sales");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6, "class", "category");
        var el7 = dom.createTextNode("All products including Taxes");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "chart-legend");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-info");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Tesla Model S\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "fa fa-circle text-warning");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" BMW 5 Series\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-check");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Data information certified\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  \n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 3]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 3]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 3]), 1, 1);
        morphs[3] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["inline", "chartist-chart", [], ["responsiveOptions", ["subexpr", "@mut", [["get", "model.users.responsive", ["loc", [null, [113, 55], [113, 77]]]]], [], []], "data", ["subexpr", "@mut", [["get", "model.users.data", ["loc", [null, [113, 83], [113, 99]]]]], [], []], "options", ["subexpr", "@mut", [["get", "model.users.options", ["loc", [null, [113, 108], [113, 127]]]]], [], []]], ["loc", [null, [113, 20], [113, 129]]]], ["inline", "chartist-chart", [], ["type", "pie", "data", ["subexpr", "@mut", [["get", "model.email.data", ["loc", [null, [134, 53], [134, 69]]]]], [], []], "options", ["subexpr", "@mut", [["get", "model.email.options", ["loc", [null, [134, 78], [134, 97]]]]], [], []]], ["loc", [null, [134, 20], [134, 99]]]], ["inline", "chartist-chart", [], ["responsiveOptions", ["subexpr", "@mut", [["get", "model.sales.responsive", ["loc", [null, [156, 55], [156, 77]]]]], [], []], "data", ["subexpr", "@mut", [["get", "model.sales.data", ["loc", [null, [156, 83], [156, 99]]]]], [], []], "options", ["subexpr", "@mut", [["get", "model.sales.options", ["loc", [null, [156, 108], [156, 127]]]]], [], []]], ["loc", [null, [156, 20], [156, 129]]]], ["content", "outlet", ["loc", [null, [174, 0], [174, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("corporate-dashboard/templates/key-metrics", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 115,
            "column": 0
          }
        },
        "moduleName": "corporate-dashboard/templates/key-metrics.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container-fluid");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-lg-4 col-sm-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-5");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "icon-big icon-danger text-center");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-pulse");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-7");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "numbers");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Open Issues");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                23\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-timer");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" In the last hour\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-lg-4 col-sm-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-5");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "icon-big icon-warning text-center");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-server");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-7");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "numbers");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Capacity");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                105GB\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-reload");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Updated now\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-lg-4 col-sm-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-5");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "icon-big icon-success text-center");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("i");
        dom.setAttribute(el9, "class", "ti-wallet");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "col-xs-7");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "numbers");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Revenue");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                                $1,345\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-calendar");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Last day\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-12");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "header");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6, "class", "title");
        var el7 = dom.createTextNode("Customers");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6, "class", "category");
        var el7 = dom.createTextNode("2016");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-reload");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Updated 3 minutes ago\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "card");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "header");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6, "class", "title");
        var el7 = dom.createTextNode("Issues");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6, "class", "category");
        var el7 = dom.createTextNode("2016");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "content");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "stats");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("i");
        dom.setAttribute(el8, "class", "ti-reload");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" Updated 3 minutes ago\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 3]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 3]), 1, 1);
        morphs[2] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["inline", "chartist-chart", [], ["type", "line", "data", ["subexpr", "@mut", [["get", "model.payingCustomersData", ["loc", [null, [88, 54], [88, 79]]]]], [], []]], ["loc", [null, [88, 20], [88, 81]]]], ["inline", "chartist-chart", [], ["type", "bar", "data", ["subexpr", "@mut", [["get", "model.reportedIssuesData", ["loc", [null, [102, 53], [102, 77]]]]], [], []]], ["loc", [null, [102, 20], [102, 79]]]], ["content", "outlet", ["loc", [null, [114, 0], [114, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('corporate-dashboard/config/environment', ['ember'], function(Ember) {
  var prefix = 'corporate-dashboard';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("corporate-dashboard/app")["default"].create({"name":"corporate-dashboard","version":"0.0.0+f97803aa"});
}

/* jshint ignore:end */
//# sourceMappingURL=corporate-dashboard.map
