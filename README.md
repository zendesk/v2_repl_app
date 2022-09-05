# v2 REPL App
![Production version](https://samson.zende.sk/projects/v2_repl_app/stages/production.svg?token=84457be797bb7a1e00d1f57575d5112a)


## Description
An interactive programming environment for ZAF v2 developers.

## Dependencies
[Zendesk apps tools](https://github.com/zendesk/zendesk_apps_tools)

NodeJS >= 8.1.0

## Owners
This repo is maintained by @zendesk/vegemite. You can contact us using that Github handle on issues or pull requests. If you are not able to use that team handle you can mention recent contributors from [here](https://github.com/zendesk/v2_repl_app/graphs/contributors).
We are often active during daytime hours on the East coast of Australia (UTC+10).

We have a Slack channel called `apps` accessible to all Zendesk employees. The broader developer community is encouraged to get in
touch with us by using the `zendesk-platform` Slack workspace, or by contacting us via https://support.zendesk.com. You can get access
to the Slack channel by sending a request to developersupport@zendesk.com

The complete app can be downloaded from the [Zendesk Marketplace](https://www.zendesk.com/apps/support/v2-repl/).

### Running Locally

v2 REPL App is built using [Zendesk Apps Tool (ZAT)](https://github.com/zendesk/zendesk_apps_tools). To make changes to the source code:

1) Clone the current repository and change directory
  ```sh
    git clone git@github.com:zendesk/v2_repl_app.git
    cd v2_repl_app
  ```

2) For development, run in the terminal
  ```sh
    npm run build
    npm run watch
    zat server -p dist
  ```

### Webpack

Webpack is the builder that will transform the `src` directory into an `dist/` app suitable for browsers. The config can be quite confusing so we opted to keep it as simple as possible. The most confusing part is probably the css part. It uses a `sass-loader` to convert .scss into css, then `css-loader` to convert that into javascript, and last `ExtractTextPlugin` to convert that javascript back into css and stick it into a `styles.css` file.

For development run either a single run `npm run build` or keep watching the files with `npm run watch`. For production `npm run build` will run the end result through babel, because IE11 doesn't understand ES6 code, and webpack's `-p` options will minify the code.

## Testing
This app is designed for testing the results of various Zendesk App Framework APIs. From within the app, you can run test commands
like `zafClient.get('ticket.subject')`. You can also enable logging by running `window.logging = true`.

## Packaging

```sh
cd "$ZENDESK_CODE_DIR/v2_repl_app"

# Since ZAT may not work with latest Ruby, you probably want to make
# sure you are using the specified version first
ln -s "$ZENDESK_CODE_DIR/zendesk_apps_tools/.ruby-version"

# Install ZAT
gem install zendesk_apps_tools

# Update translations
cd src/
zat translate to_json

# Build
cd ..
npm install --no-save
npm run build

# Packaging
cd dist
zip -r -FS /path/to/v2_repl.zip *
```

## Contribute
Pull requests and Github issues are welcome. They'll be merged with two :+1:s from the maintainers.
Please CC @zendesk/vegemite on your PR.

## Bugs
Bugs can be reported as Github issues or as tickets in https://support.zendesk.com

## Useful Links
API documentation can be found at https://developer.zendesk.com/apps/docs/zendesk-apps/resources
