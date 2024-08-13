/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure ssl integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/documentation/reference/configuration/sails-config
 */

module.exports.ssl = {
    key: require('fs').readFileSync((require('path').resolve(__dirname,'./ssl/key.pem'))),
    cert: require('fs').readFileSync((require('path').resolve(__dirname,'./ssl/cert.pem'))),
}
