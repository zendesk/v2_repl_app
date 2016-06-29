import App from './app';
import ZAFClient from 'zendesk_app_framework_sdk';

var client = ZAFClient.init();

window.zafClient = client;

client.on('app.registered', function(data) {
  var height = '100%';

  new App(client, data);

  if (/_sidebar$/.test(data.context.location)) {
    height = '500px';
  }

  client.invoke('resize', { height: height });
});
