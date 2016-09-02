/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(10);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _app = __webpack_require__(2);
	
	var _app2 = _interopRequireDefault(_app);
	
	var _zendesk_app_framework_sdk = __webpack_require__(9);
	
	var _zendesk_app_framework_sdk2 = _interopRequireDefault(_zendesk_app_framework_sdk);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var client = _zendesk_app_framework_sdk2.default.init();
	
	window.zafClient = client;
	
	client.on('app.registered', function (data) {
	  var height = '100%';
	
	  new _app2.default(client, data);
	
	  if (/_sidebar$/.test(data.context.location)) {
	    height = '500px';
	  }
	
	  client.invoke('resize', { height: height });
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _base_app = __webpack_require__(3);
	
	var _base_app2 = _interopRequireDefault(_base_app);
	
	var _helpers = __webpack_require__(8);
	
	var _helpers2 = _interopRequireDefault(_helpers);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UP_ARROW_KEY = 38,
	    DOWN_ARROW_KEY = 40;
	
	var isThennable = function isThennable(value) {
	  return _.isObject(value) && _.isFunction(value.then);
	};
	
	var format = function format(value) {
	  if (_.isObject(value) || _.isArray(value)) {
	    return JSON.stringify(value, undefined, 2);
	  }
	  if (_.isUndefined(value)) {
	    return 'undefined';
	  }
	  return value;
	};
	
	var Command = function () {
	  function Command(cmd) {
	    _classCallCheck(this, Command);
	
	    this.cmd = cmd;
	    this._startTime = performance.now();
	  }
	
	  _createClass(Command, [{
	    key: 'elapsedTime',
	    get: function get() {
	      return performance.now() - this._startTime;
	    }
	  }]);
	
	  return Command;
	}();
	
	var CommandHistory = function () {
	  function CommandHistory() {
	    _classCallCheck(this, CommandHistory);
	  }
	
	  _createClass(CommandHistory, null, [{
	    key: 'addCommand',
	    value: function addCommand(cmd) {
	      this.history.push(new Command(cmd));
	      this.currentCommandIndex = this.history.length;
	    }
	  }, {
	    key: 'commandAt',
	    value: function commandAt() {
	      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	
	      return this.history[index];
	    }
	  }, {
	    key: 'previousCommand',
	    value: function previousCommand() {
	      if (this.currentCommandIndex >= 0) {
	        return this.history[--this.currentCommandIndex];
	      }
	    }
	  }, {
	    key: 'nextCommand',
	    value: function nextCommand() {
	      if (this.currentCommandIndex < this.history.length) {
	        return this.history[++this.currentCommandIndex];
	      }
	    }
	  }]);
	
	  return CommandHistory;
	}();
	
	CommandHistory.history = [];
	CommandHistory.currentCommandIndex = 0;
	
	var log = function () {
	  var counter = 0;
	
	  function logEval(input, value) {
	    if (console && console.info) {
	      if (console.group) {
	        console.group('SDK REPL App');
	      }
	      console.info("Eval: ", input);
	      console.info("Result: ", value);
	      if (console.groupEnd) {
	        console.groupEnd();
	      }
	    }
	  }
	
	  function appendToHistory(input, value, type) {
	    var $historyContainer = this.$('.history-container');
	
	    $historyContainer.append(this.$('<pre class="history input">').text(input)).append(this.$('<pre class="history output">').text('> ' + value).addClass(type));
	
	    $historyContainer.scrollTop($historyContainer.get(0).scrollHeight);
	  }
	
	  return function (input, value, type) {
	    var _this = this;
	
	    var currentCount = ++counter;
	
	    CommandHistory.addCommand(input);
	
	    if (isThennable(value)) {
	      (function () {
	        var elapsedTime = void 0,
	            cmd = void 0;
	        value.then(function (data) {
	          var formatted = format(data);
	          cmd = CommandHistory.commandAt(currentCount - 1);
	          appendToHistory.call(_this, currentCount + ': async response (' + cmd.elapsedTime + 'ms)', formatted);
	          logEval(input, formatted);
	        }).catch(function (err) {
	          cmd = CommandHistory.commandAt(currentCount - 1);
	          appendToHistory.call(_this, currentCount + ': async error (' + cmd.elapsedTime + 'ms)', formatError(err), 'error');
	        });
	        input = 'async request - ' + input;
	      })();
	    }
	
	    appendToHistory.apply(this, [currentCount + ': ' + input, format(value), type]);
	  };
	}();
	
	var formatError = function formatError(err) {
	  return err.name + ': ' + err.message + '\n' + err.stack;
	};
	
	var logError = function logError(input, err) {
	  log.call(this, input, formatError(err), 'error');
	};
	
	var FunctionToJson;
	var stubFunction = function stubFunction() {
	  FunctionToJson = Function.prototype.toJSON;
	  Function.prototype.toJSON = function () {
	    return 'function' + (this.name ? ': ' + this.name : '');
	  };
	};
	
	var unstubFunction = function unstubFunction() {
	  Function.prototype.toJSON = FunctionToJson;
	};
	
	var logEvent = function () {
	  var info;
	  return function (location, evt) {
	    if (!console || !console.info) {
	      return;
	    }
	    var args = Array.prototype.slice.call(arguments, 2);
	    var message = _helpers2.default.fmt("SDK REPL app (%@) received: '%@'", location, evt);
	    info = info || Function.prototype.bind.call(console.info, console); // so we can use apply in IE 9 (http://stackoverflow.com/a/5539378)
	    info.apply(console, [message].concat(args));
	  };
	}();
	
	var fakeLog = function fakeLog(value) {
	  var $historyContainer = this.$('.history-container'),
	      formatedValue = format.call(this, value),
	      $output = this.$('<pre class="history output">').text(formatedValue);
	
	  _.defer(function () {
	    $historyContainer.append($output);
	    $historyContainer.scrollTop($historyContainer.get(0).scrollHeight);
	  });
	};
	
	var App = {
	  defaultState: 'testing',
	
	  events: {
	    'submit form': function submitForm(event) {
	      event.preventDefault();
	
	      var oldConsole = window.console;
	      var $script = this.$('.script');
	
	      stubFunction();
	      var console = {
	        log: fakeLog.bind(this)
	      };
	
	      try {
	
	        var input = $script.val().trim(),
	            value = eval(input);
	
	        if (!input) {
	          return;
	        }
	
	        log.call(this, input, value);
	      } catch (e) {
	        oldConsole.error(e);
	        logError.call(this, input, e);
	      }
	
	      console = oldConsole;
	      unstubFunction();
	
	      $script.val('').select();
	    },
	
	    'keydown .script': function keydownScript(e) {
	      if (e.which === UP_ARROW_KEY) {
	        var command = CommandHistory.previousCommand();
	        if (command) {
	          e.preventDefault();
	          this.$('.script').val(command.cmd);
	        }
	      } else if (e.which === DOWN_ARROW_KEY) {
	        var _command = CommandHistory.nextCommand();
	        this.$('.script').val(_command && _command.cmd || '');
	      }
	    }
	  }
	};
	
	['app.created', 'app.activated', 'app.deactivated', 'pane.activated', 'pane.deactivated', 'app.willDestroy', '*.changed', 'app.route.changed', 'ticket.submit.start', 'ticket.submit.done', 'ticket.submit.fail', 'ticket.submit.always', 'ticket.viewers.changed', 'ticket.updated', 'ticket.save', 'ticket.saved', 'notification.repl', 'message.repl', 'window.resize', 'window.scroll', 'channel.chat.started', 'channel.chat.ended', 'channel.message.received', 'channel.message.sent'].forEach(function (key) {
	  App.events[key] = function () {
	    logEvent(this.currentLocation(), key, arguments);
	  };
	});
	
	exports.default = _base_app2.default.extend(App);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(4);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function noop() {}
	
	function resolveHandler(app, name) {
	  var handler = app.events[name];
	  if (!handler) {
	    return noop;
	  }
	  return _.isFunction(handler) ? handler.bind(app) : app[handler].bind(app);
	}
	
	function bindEvents(app) {
	  _.each(app.events, function (fn, key) {
	    var splittedKey = key.split(' '),
	        event = splittedKey[0],
	        element = splittedKey[1],
	        isDomEvent = !!element,
	        func = resolveHandler(app, key);
	
	    if (isDomEvent) {
	      (0, _jquery2.default)(document).on(event, element, func);
	    } else {
	      app.zafClient.on(event, func);
	    }
	  }.bind(app));
	}
	
	function BaseApp(zafClient, data) {
	  this._location = data.context.location;
	  this.zafClient = zafClient;
	  bindEvents(this);
	  var evt = { firstLoad: true };
	  if (this.defaultState) {
	    this.switchTo(this.defaultState, { location: this._location });
	  }
	  resolveHandler(this, 'app.created')();
	  resolveHandler(this, 'app.activated')(evt, evt);
	}
	
	BaseApp.prototype = {
	  // These are public APIs of the framework that we are shimming to make it
	  // easier to migrate existing apps
	  events: {},
	  requests: {},
	
	  currentLocation: function currentLocation() {
	    return this._location;
	  },
	
	  ajax: function ajax(name) {
	    var req = this.requests[name],
	        doneCallback = resolveHandler(this, name + '.done'),
	        failCallback = resolveHandler(this, name + '.fail'),
	        alwaysCallback = resolveHandler(this, name + '.always'),
	        options = _.isFunction(req) ? req.apply(this, Array.prototype.slice.call(arguments, 1)) : req;
	
	    return this.zafClient.request(options).then(doneCallback, failCallback).then(alwaysCallback, alwaysCallback);
	  },
	
	  renderTemplate: function renderTemplate(name, data) {
	    var template = __webpack_require__(5)("./" + name + '.hdbs');
	    return template(data);
	  },
	
	  switchTo: function switchTo(name, data) {
	    this.$('[data-main]').html(this.renderTemplate(name, data));
	  },
	
	  $: function $() {
	    var args = Array.prototype.slice.call(arguments, 0);
	    if (!args.length) return (0, _jquery2.default)('body');
	    return _jquery2.default.apply(_jquery2.default, arguments);
	  }
	};
	
	BaseApp.extend = function (appPrototype) {
	  var App = function App(client, data) {
	    BaseApp.call(this, client, data);
	  };
	
	  App.prototype = _.extend({}, BaseApp.prototype, appPrototype);
	
	  return App;
	};
	
	exports.default = BaseApp;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./testing.hdbs": 6
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 5;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(7);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var helper;
	
	  return "<form class=\""
	    + container.escapeExpression(((helper = (helper = helpers.location || (depth0 != null ? depth0.location : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"location","hash":{},"data":data}) : helper)))
	    + "\">\n  <div class=\"history-container\"></div>\n  <input type=\"text\" class=\"script\"></textarea>\n</form>\n";
	},"useData":true});

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = Handlebars;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var helpers = {
	  fmt: function fmt(str, formats) {
	    var cachedFormats = formats;
	
	    if (!_.isArray(cachedFormats) || arguments.length > 2) {
	      cachedFormats = new Array(arguments.length - 1);
	
	      for (var i = 1, l = arguments.length; i < l; i++) {
	        cachedFormats[i - 1] = arguments[i];
	      }
	    }
	
	    // first, replace any ORDERED replacements.
	    var idx = 0; // the current index for non-numerical replacements
	    return str.replace(/%@([0-9]+)?/g, function (s, argIndex) {
	      argIndex = argIndex ? parseInt(argIndex, 10) - 1 : idx++;
	      s = cachedFormats[argIndex];
	      if (s === null) return '(null)';
	      if (s === undefined) return '';
	      if (_.isFunction(s.toString)) return s.toString();
	      return s;
	    });
	  }
	};
	
	exports.default = helpers;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = ZAFClient;

/***/ },
/* 10 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map