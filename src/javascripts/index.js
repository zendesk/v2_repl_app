import App from './app'
import ZAFClient from 'zendesk_app_framework_sdk'

function setBase (base) {
  document.documentElement.setAttribute('data-theme', base)
}

// get colorScheme even before ZAF is initialized
const queryParams = new URLSearchParams(location.search)
const colorScheme = queryParams.get('colorScheme')
setBase(colorScheme)

var client = ZAFClient.init()

window.zafClient = client

client.on('app.registered', function (data) {
  var location = data.context.location

  new App(client, data)

  if (location === 'top_bar' || /_card$/.test(location) || /_sidebar$/.test(location)) {
    client.invoke('resize', { height: '500px' })
  }
})

client.on('colorScheme.changed', (colorScheme) => setBase(colorScheme))
