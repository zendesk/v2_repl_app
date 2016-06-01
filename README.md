# iFrame REPL App

## Description
An interactive programming environment for ZAF SDK v2 developers.

## Owners
This repo is maintained by @zendesk/vegemite. You can contact us using that Github handle on issues or pull requests in this repo.
We are often active during daytime hours on the east coast of Australia (UTC+10).

We have a Slack channel called `vegemite` accessible to all Zendesk employees. The broader developer community is encouraged to get in
touch with us by using the `zendesk-appdevelopers` Slack account, or by contacting us via https://support.zendesk.com. You can get access
to the Slack channel by signing up for [App Framework V2 beta](goo.gl/forms/rnHRGIUj4a).

## Getting Started

### Installing the app into a Zendesk account

This app can be installed from the apps marketplace by searching for 'iframe REPL'.

You can also upload it as a private app by running `zat create --path=./dist` (using the [zendesk_apps_tools](https://rubygems.org/gems/zendesk_apps_tools))

### Developing a change to the app

#### Initial setup

If you need to test a change to this app, you'll need to setup the dependencies by running:

```
gem install zendesk_apps_tools
npm install
npm install -g webpack # optionally install webpack so it can be run from the command-line
npm install -g foreman # optionally install foreman to run both servers at once
```

#### Running the app

All these commands are run from the root directory of the repo, not the `dist/` directory.
To run the app, if you installed the optional dependencies you can run `nf start`.
If you don't have `foreman`, run `zat server --path=./dist` and `webpack --watch`.
If you didn't install `webpack` globally, you can run it by `node_modules/.bin/webpack --watch`.

## Testing
This app is designed for testing the results of various Zendesk App Framework APIs. From within the app, you can run test commands
like `zafClient.get('ticket.subject')`.

## Contribute
Pull requests and Github issues are welcome. They'll be merged with two :+1:s from the maintainers.
Please cc @zendesk/vegemite on your PR.

## Bugs
Bugs can be reported as Github issues or as tickets in support.zendesk.com.

## Useful Links
API documentation will one day be found at https://developer.zendesk.com/apps/docs/agent/introduction

## Dependencies
[Zendesk apps tools](https://github.com/zendesk/zendesk_apps_tools)


## Project Structure
The app is compiled by webpack. The artifact that can be uploaded to Zendesk (or served with ZAT) is in the `dist/` folder.
