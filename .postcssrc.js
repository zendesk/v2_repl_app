module.exports = {
  plugins: {
    'postcss-preset-env': {
      features: {
        'color-mod-function': true,
        'custom-properties': { preserve: false }
      }
    },
    'postcss-import': {},
    'precss': {},
    'postcss-inline-svg': {
      'path': 'node_modules/@zendeskgarden/svg-icons/src'
    }
  }
}
