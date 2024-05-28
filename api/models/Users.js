/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt')

module.exports = {
  attributes: {
    id: { type: 'string', columnName: '_id' },
    username: { type: 'string', required: true },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
    phoneNumber: { type: 'string', required: true },
    bio: { type: 'string', required: false },
    identity_verification_status: { type: 'boolean', required: false },
    driver_verification_status: { type: 'boolean', required: false },
    licence_expiry_date: { type: 'string', required: false },
    car: { type: 'json', required: false },
    reports: { type: 'json', required: false },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },

  beforeCreate: function (valuesToSet, proceed) {
    console.log('in model')
    const saltRounds = 10
    bcrypt.hash(valuesToSet.password, saltRounds).then((hash) => {
      valuesToSet.password = hash
      return proceed()
    })
  },

  customToJSON: function () {
    return _.omit(this, ['password'])
  },
}
