import App from './app';
import ZAFClient from 'zendesk_app_framework_sdk';

var client = ZAFClient.init();

window.zafClient = client;

client.on('app.registered', function(data) {
  var height = '100%',
      location = data.context.location;

  new App(client, data);

  if (location === 'top_bar' || /_sidebar$/.test(location)) {
    height = '500px';
  }

  client.invoke('resize', { height: height });
});
