import App from './app'
import ZAFClient from 'zendesk_app_framework_sdk'

/**
 * 
 *  --------- MOBILEAPI JS
 * 
 */
(function(global) {
    const callbacks = {};
    const events = {};

    // Utility Functions
    // -----------------

    // Utility function to generate UUIDs
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
  }

  // MobileAPIClient Constructor
  function MobileAPIClient() {
      this.init();
  }

  // Utility function to post messages to native
  async function postMessage(type, payload) {
    console.log('--- Post Message: ' + type + ' payload: ' + payload);
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[type]) {
        return await window.webkit.messageHandlers[type].postMessage(payload);
    } else if (typeof Android !== 'undefined' && Android[type]) {
        return new Promise((resolve, reject) => {
          const requestId = generateUUID();
          callbacks[requestId] = resolve;
          postMessage(type, { id: requestId, payload: { payload } });
      });
    } else {
        console.error(`No handler for ${type} found.`);
    }
}

MobileAPIClient.prototype.init = async function() {
  const uuid = generateUUID();
  return await postMessage('init', { uuid }) 
};

MobileAPIClient.prototype.request = async function(options) {
  return await postMessage('request', { options }) 
};

MobileAPIClient.prototype.set = async function(property, value) {
    return await postMessage('set', { property, value }) 
};

MobileAPIClient.prototype.context = async function() {
  return await postMessage('context', {});
};

MobileAPIClient.prototype.get = async function(property) {
  return await postMessage('get', {property});
};

MobileAPIClient.prototype.metadata = async function() {
  return await postMessage('metadata', {});
};

MobileAPIClient.prototype.on = function(event, callback) {
  console.log('Subscribe ON: ' + event);
    if (!events[event]) {
        events[event] = [];
    }
    events[event].push(callback);
};

MobileAPIClient.prototype.off = function(event, callback) {
  console.log('Unsubscribe OFF: ' + event);
    if (!events[event]) return;
    const index = events[event].indexOf(callback);
    if (index > -1) {
        events[event].splice(index, 1);
    }
};

MobileAPIClient.prototype.trigger = function(event, data) {
    console.log('Trigger: ' + event);
    if (events[event]) {
        events[event].forEach(callback => callback(data));
    }
};

MobileAPIClient.prototype.has = function(event, handler) {
    console.log('Has: ' + event);
    return events[event] && events[event].includes(handler);
};

MobileAPIClient.prototype.invoke = async function(event, data) {
    console.log('invoke: ' + event);
    return await postMessage(event, {data});
};

global.onNativeMessage = function(response) {
    console.log('RECEIVED [onNativeMessage] message: ' + JSON.stringify(response));
    const { id, type, data } = response;
    console.log('RECEIVED [onNativeMessage] id: ' + id + ' type: ' + type + ' data:' + JSON.stringify(data));
    if (callbacks[id]) {
        callbacks[id](data);
        delete callbacks[id];
    }

    if (events[type]) {
        events[type].forEach(callback => callback(data));
    }
};

    // Initialization
    // --------------

    global.MobileAPI = {
        init: function() {
            console.log('global.MobileAPI');
            return new MobileAPIClient();
        }
    };
})(window);

/**
 * 
 *  --------- END OF MOBILEAPI JS
 * 
 */

// Function to check if the browser is mobile
const isWebKit = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPhone|iPod|iPad|Android/.test(userAgent) && window.webkit && window.webkit.messageHandlers;
};

// Initialize the appropriate client based on the environment
let client;

if (isWebKit()) {
    console.log('I am a MOBILE!!');
    client = MobileAPI.init();
} else {
    console.log('I am a DESKTOP!!');
    client = ZAFClient.init();
}

window.zafClient = client;

client.on('app.registered', function(data) {
    console.log('APP REGISTERED!! Data: ' + JSON.stringify(data));
    var location = data.context.location;

    new App(client, data);

    // Resize logic
    if (location === 'top_bar' || /_card$/.test(location) || /_sidebar$/.test(location)) {
        client.invoke('resize', { height: '500px' });
    }
});
