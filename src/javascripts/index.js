import App from './app'
import ZAFClient from 'zendesk_app_framework_sdk'

var client = ZAFClient.init()

window.zafClient = client

client.on('app.registered', function (data) {
  var location = data.context.location

  new App(client, data)

  if (location === 'top_bar' || /_card$/.test(location) || /_sidebar$/.test(location)) {
    client.invoke('resize', { height: '500px' })
  }
})
