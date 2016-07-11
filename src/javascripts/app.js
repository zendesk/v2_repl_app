import BaseApp from './base_app';
import helpers from './helpers';

var UP_ARROW_KEY   = 38,
    DOWN_ARROW_KEY = 40;

var isThennable = function(value) {
  return _.isObject(value) &&
    _.isFunction(value.then);
};

var format = function(value) {
  if (_.isObject(value) || _.isArray(value)) {
    return JSON.stringify(value, undefined, 2);
  }
  if (_.isUndefined(value)) {
    return 'undefined';
  }
  return value;
};

class Command {

  constructor(cmd) {
    this.cmd = cmd;
    this._startTime = performance.now();
  }

  get elapsedTime() {
    return performance.now() - this._startTime;
  }

}

class CommandHistory {
  static addCommand(cmd) {
    this.history.push(new Command(cmd));
    this.currentCommandIndex = this.history.length;
  }

  static commandAt(index = 0) {
    return this.history[index];
  }

  static previousCommand() {
    if (this.currentCommandIndex >= 0) {
      return this.history[--this.currentCommandIndex];
    }
  }

  static nextCommand() {
    if (this.currentCommandIndex < this.history.length) {
      return this.history[++this.currentCommandIndex];
    }
  }
}

CommandHistory.history = [];
CommandHistory.currentCommandIndex = 0;

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

  function appendToHistory(input, value, type) {
    var $historyContainer = this.$('.history-container');

    $historyContainer.append(
      this.$('<pre class="history input">').text(input)
    ).append(
      this.$('<pre class="history output">').text(`> ${value}`).addClass(type)
    );

    $historyContainer.scrollTop($historyContainer.get(0).scrollHeight);
  }

  return function(input, value, type) {
    let currentCount = ++counter;

    CommandHistory.addCommand(input);

    if (isThennable(value)) {
      let elapsedTime, cmd;
      value.then((data) => {
        let formatted = format(data);
        cmd = CommandHistory.commandAt(currentCount - 1);
        appendToHistory.call(this, `${currentCount}: async response (${cmd.elapsedTime}ms)`, formatted);
        logEval(input, formatted);
      }).catch((err) => {
        cmd = CommandHistory.commandAt(currentCount - 1);
        appendToHistory.call(this, `${currentCount}: async error (${cmd.elapsedTime}ms)`, formatError(err), 'error');
      });
      input = `async request - ${input}`;
    }

    appendToHistory.apply(this, [`${currentCount}: ${input}`, format(value), type]);
  };
}());

var formatError = function(err) {
  return `${err.name}: ${err.message}\n${err.stack}`;
}

var logError = function(input, err) {
  log.call(this, input, formatError(err), 'error');
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
            value = eval(input);

        if (!input) { return; }

        log.call(this, input, value);
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
        let command = CommandHistory.previousCommand();
        if (command) {
          e.preventDefault();
          this.$('.script').val(command.cmd);
        }
      } else if (e.which === DOWN_ARROW_KEY) {
        let command = CommandHistory.nextCommand();
        this.$('.script').val(command && command.cmd || '');
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
