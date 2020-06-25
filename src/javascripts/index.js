import { default as App, logEvent } from './app';
import ZAFClient from 'zendesk_app_framework_sdk';

var client = ZAFClient.init();

window.zafClient = client;

client.on('app.registered', function (data) {
  var location = data.context.location;

  logEvent(location, 'app.registered', data);

  client.on('app.activated', (data) => logEvent(location, 'app.activated', data));

  // Ticket submission events
  client.on('ticket.submit.start', function () {
    logEvent(location, 'ticket.submit.start');
  });

  client.on('ticket.submit.done', function () {
    logEvent(location, 'ticket.submit.done');
  });

  client.on('ticket.submit.fail', function () {
    logEvent(location, 'ticket.submit.fail');
  });

  client.on('ticket.submit.always', function () {
    logEvent(location, 'ticket.submit.always');
  });

  // Ticket updated events
  client.on('ticket.updated', function (user) {
    logEvent(location, 'ticket.submit.updated', user);
  });

  // Ticket save hook events
  client.on('ticket.save', function () {
    logEvent(location, 'ticket.save');
    return true;
  });

  // Setup Ticket field change events
  client.on('ticketFields.assignee.optionValues.changed', function (value) {
    logEvent(location, 'ticketFields.assignee.optionValues.changed', value);
    return true;
  });

  const app = new App(client, data);

  // Setup Custom field change events: Ticket, User, Organisation
  const fetchTicketCustomFields = app.ajax('ticketFields');
  const fetchUserCustomFields = app.ajax('userFields');
  const fetchOrganizationCustomFields = app.ajax('organizationFields');

  return Promise.all([
    fetchTicketCustomFields,
    fetchUserCustomFields,
    fetchOrganizationCustomFields,
  ]).then((data) => {
      const ticketFields = data[0];
      const userFields = data[1];
      const organizationFields = data[2];
    
      ticketFields && ticketFields.ticket_fields.forEach((item) => {
        client.on(`ticket.custom_field_${item.id}.changed`, function (value) {
          logEvent(location, `ticket.custom_field_${item.id}.changed`, value);
        });
      });

      userFields && userFields.user_fields.forEach((item) => {
        client.on(`user.custom_field_${item.id}.changed`, function (value) {
          logEvent(location, `ticket.custom_field_${item.id}.changed`, value);
        });
      });

      organizationFields && organizationFields.organization_fields.forEach((item) => {
        client.on(`organization.custom_field_${item.id}.changed`, function (value) {
          logEvent(location, `ticket.custom_field_${item.id}.changed`, value);
        });
      });
    }
  );
});
