module.exports = {
  plugins: {
    'postcss-preset-env': {
      features: {
        'custom-properties': { preserve: false }
      }
    },
    'postcss-import': {},
    'postcss-inline-svg': {
      'paths': ['node_modules/@zendeskgarden/svg-icons/src']
    }
  }
}
