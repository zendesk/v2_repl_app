import $ from 'jquery'

function noop () {}

function resolveHandler (app, name) {
  var handler = app.events[name]
  if (!handler) { return noop }
  return _.isFunction(handler) ? handler.bind(app) : app[handler].bind(app)
}

function bindEvents (app) {
  _.each(app.events, function (fn, key) {
    var splittedKey = key.split(' ')
    var event = splittedKey[0]
    var element = splittedKey[1]
    var isDomEvent = !!element
    var func = resolveHandler(app, key)

    if (isDomEvent) {
      $(document).on(event, element, func)
    } else {
      app.zafClient.on(event, func)
    }
  })
}

function BaseApp (zafClient, data) {
  this._location = data.context.location
  this.zafClient = zafClient
  bindEvents(this)
  const evt = { firstLoad: true }
  if (this.defaultState) {
    this.switchTo(this.defaultState, { location: this._location })
  }
  resolveHandler(this, 'app.created')()
  resolveHandler(this, 'app.activated')(evt, evt)
}

BaseApp.prototype = {
  // These are public APIs of the framework that we are shimming to make it
  // easier to migrate existing apps
  events: {},
  requests: {},

  currentLocation: function () {
    return this._location
  },

  ajax: function (name) {
    var req = this.requests[name]
    var doneCallback = resolveHandler(this, name + '.done')
    var failCallback = resolveHandler(this, name + '.fail')
    var alwaysCallback = resolveHandler(this, name + '.always')
    var options = _.isFunction(req) ? req.apply(this, Array.prototype.slice.call(arguments, 1)) : req

    return this.zafClient.request(options)
      .then(doneCallback, failCallback)
      .then(alwaysCallback, alwaysCallback)
  },

  renderTemplate: function (name, data) {
    var template = require(`../templates/${name}.hdbs`)
    return template(data)
  },

  switchTo: function (name, data) {
    this.$('[data-main]').html(this.renderTemplate(name, data))
  },

  $: function () {
    var args = Array.prototype.slice.call(arguments, 0)
    if (!args.length) return $('body')
    return $.apply($, arguments)
  }
}

BaseApp.extend = function (appPrototype) {
  var App = function (client, data) {
    BaseApp.call(this, client, data)
  }

  App.prototype = _.extend({}, BaseApp.prototype, appPrototype)

  return App
}

export default BaseApp
