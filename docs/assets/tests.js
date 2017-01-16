define('corporate-dashboard/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/components/filterable-issues-list.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/filterable-issues-list.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/filterable-issues-list.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/controllers/data.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | controllers/data.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/data.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/custom-objects/pollster.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | custom-objects/pollster.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'custom-objects/pollster.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('corporate-dashboard/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'corporate-dashboard/tests/helpers/start-app', 'corporate-dashboard/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _corporateDashboardTestsHelpersStartApp, _corporateDashboardTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _corporateDashboardTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _corporateDashboardTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('corporate-dashboard/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/helpers/resolver', ['exports', 'corporate-dashboard/resolver', 'corporate-dashboard/config/environment'], function (exports, _corporateDashboardResolver, _corporateDashboardConfigEnvironment) {

  var resolver = _corporateDashboardResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _corporateDashboardConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _corporateDashboardConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('corporate-dashboard/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/helpers/start-app', ['exports', 'ember', 'corporate-dashboard/app', 'corporate-dashboard/config/environment'], function (exports, _ember, _corporateDashboardApp, _corporateDashboardConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _corporateDashboardConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _corporateDashboardApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('corporate-dashboard/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/helpers/to-readable-date.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/to-readable-date.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/to-readable-date.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/integration/components/filterable-issues-list-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('filterable-issues-list', 'Integration | Component | filterable issues list', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.6.2',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 26
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'filterable-issues-list', ['loc', [null, [1, 0], [1, 26]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.6.2',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
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
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.6.2',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'filterable-issues-list', [], [], 0, null, ['loc', [null, [2, 4], [4, 31]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('corporate-dashboard/tests/integration/components/filterable-issues-list-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/filterable-issues-list-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/filterable-issues-list-test.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/routes/data.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/data.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/data.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/routes/geospatial.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/geospatial.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/geospatial.js should pass jshint.\nroutes/geospatial.js: line 8, col 18, \'Papa\' is not defined.\nroutes/geospatial.js: line 26, col 24, \'Papa\' is not defined.\n\n2 errors');
  });
});
define('corporate-dashboard/tests/routes/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/index.js should pass jshint.\nroutes/index.js: line 24, col 33, Duplicate key \'lineSmooth\'.\nroutes/index.js: line 24, col 35, \'Chartist\' is not defined.\n\n2 errors');
  });
});
define('corporate-dashboard/tests/routes/key-metrics.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/key-metrics.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/key-metrics.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/test-helper', ['exports', 'corporate-dashboard/tests/helpers/resolver', 'ember-qunit'], function (exports, _corporateDashboardTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_corporateDashboardTestsHelpersResolver['default']);
});
define('corporate-dashboard/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/unit/controllers/data-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:data', 'Unit | Controller | data', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('corporate-dashboard/tests/unit/controllers/data-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/data-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/data-test.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/unit/helpers/to-readable-date-test', ['exports', 'corporate-dashboard/helpers/to-readable-date', 'qunit'], function (exports, _corporateDashboardHelpersToReadableDate, _qunit) {

  (0, _qunit.module)('Unit | Helper | to readable date');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _corporateDashboardHelpersToReadableDate.toReadableDate)([42]);
    assert.ok(result);
  });
});
define('corporate-dashboard/tests/unit/helpers/to-readable-date-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/helpers/to-readable-date-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/to-readable-date-test.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/unit/routes/data-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:data', 'Unit | Route | data', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('corporate-dashboard/tests/unit/routes/data-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/data-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/data-test.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/unit/routes/geospatial-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:geospatial', 'Unit | Route | geospatial', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('corporate-dashboard/tests/unit/routes/geospatial-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/geospatial-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/geospatial-test.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/unit/routes/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('corporate-dashboard/tests/unit/routes/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass jshint.');
  });
});
define('corporate-dashboard/tests/unit/routes/key-metrics-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:key-metrics', 'Unit | Route | key metrics', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('corporate-dashboard/tests/unit/routes/key-metrics-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/key-metrics-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/key-metrics-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('corporate-dashboard/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map
