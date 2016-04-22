import BaseApp from './base_app';
import helpers from './helpers';

var UP_ARROW_KEY   = 38,
    DOWN_ARROW_KEY = 40;

var format = function(value) {
  if (_.isObject(value) || _.isArray(value)) {
    return JSON.stringify(value, undefined, 2);
  }
  if (_.isUndefined(value)) {
    return 'undefined';
  }
  return value;
};

var CommandHistory = (function() {
  var history = [],
      currentCommandIndex = 0;

  return {
    addCommand: function(cmd) {
      history.push(cmd);
      currentCommandIndex = history.length;
    },

    previousCommand: function() {
      if (currentCommandIndex >= 0) {
        return history[--currentCommandIndex];
      }
    },

    nextCommand: function() {
      if (currentCommandIndex < history.length) {
        return history[++currentCommandIndex];
      }
    }
  };
}());

var log = (function() {
  var counter = 0;

  function logEval(input, value) {
    if (console && console.info) {
      if (console.group) { console.group('REPL App'); }
      console.info("Eval: ", input);
      console.info("Result: ", value);
      if (console.groupEnd) { console.groupEnd(); }
    }
  }

  return function(input, value, type) {
    var $historyContainer = this.$('.history-container');

    logEval(input, value);
    CommandHistory.addCommand(input);

    $historyContainer.append(
      this.$('<pre class="history input">').text(++counter + ': ' + input)
    ).append(
      this.$('<pre class="history output">').text('> ' + value).addClass(type)
    );

    $historyContainer.scrollTop($historyContainer.get(0).scrollHeight);
  };
}());

var logError = function(input, error) {
  log.call(this, input, error.name + ': ' + error.message + '\n' + error.stack, 'error');
};

var FunctionToJson;
var stubFunction = function() {
  FunctionToJson = Function.prototype.toJSON;
  Function.prototype.toJSON = function() {
    return 'function' + (this.name ? ': ' + this.name : '');
  };
};

var unstubFunction = function() {
  Function.prototype.toJSON = FunctionToJson;
};

var logEvent = (function() {
  var info;
  return function(location, evt) {
    if (!console || !console.info) { return; }
    var args = Array.prototype.slice.call(arguments, 2);
    var message = helpers.fmt("REPL app (%@) received: '%@'", location, evt);
    info = info || Function.prototype.bind.call(console.info, console); // so we can use apply in IE 9 (http://stackoverflow.com/a/5539378)
    info.apply(console, [message].concat(args));
  };
}());

var fakeLog = function(value) {
  var $historyContainer = this.$('.history-container'),
      formatedValue = format.call(this, value),
      $output = this.$('<pre class="history output">').text(formatedValue);

  _.defer(function() {
    $historyContainer.append($output);
    $historyContainer.scrollTop($historyContainer.get(0).scrollHeight);
  });
};

var App = {
  defaultState: 'testing',

  events: {
    'submit form': function(event) {
      event.preventDefault();

      var oldConsole = window.console;
      var $script = this.$('.script');

      stubFunction();
      var console = {
        log: fakeLog.bind(this)
      }

      try {

        var input = $script.val().trim(),
            value = eval(input),
            formatedValue = format.call(this, value);

        if (!input) { return; }

        log.call(this, input, formatedValue);
      } catch(e) {
        oldConsole.error(e);
        logError.call(this, input, e);
      }

      console = oldConsole;
      unstubFunction();

      $script.val('').select();
    },

    'keydown .script': function(e) {
      if (e.which === UP_ARROW_KEY) {
        var cmd = CommandHistory.previousCommand();
        if (cmd) {
          e.preventDefault();
          this.$('.script').val(cmd);
        }
      } else if (e.which === DOWN_ARROW_KEY) {
        this.$('.script').val(CommandHistory.nextCommand() || '');
      }
    }
  }
};

[
  'app.created',
  'app.activated',
  'app.deactivated',
  'pane.activated',
  'pane.deactivated',
  'app.willDestroy',
  '*.changed',
  'app.route.changed',
  'ticket.submit.start',
  'ticket.submit.done',
  'ticket.submit.fail',
  'ticket.submit.always',
  'ticket.viewers.changed',
  'ticket.updated',
  'ticket.save',
  'ticket.saved'
].forEach(function(key) {
  App.events[key] = function() {
    logEvent(this.currentLocation(), key, arguments);
  };
});

export default BaseApp.extend(App);
