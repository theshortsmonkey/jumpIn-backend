/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "GET /distance/:username": "Rides.getUserDistance",
  "GET /carbon/:username": "Rides.getUserCarbon",
  "GET /spend/:username": "Rides.getUserSpend",

  "GET /users/:username": "Users.getUser",
  "PATCH /users/:username": "Users.patchUser",
  "DELETE /users/:username": "Users.deleteUser",
  "POST /users/:username/login": "Users.login",
  "POST /users/:username/logout": "Users.logout",

  "GET /users/:username/image": "Users.imageDownload",
  "POST /users/:username/image": "Users.imageUpload",
  "DELETE /users/:username/image": "Users.imageDelete",

  "GET /": "Home.endpoints",

  "PATCH /rides/:ride_id": "Rides.patchRide",
  "POST /rides/:ride_id/messages": "Rides.postMessage",
  "GET /rides/:ride_id/messages/:username": "Rides.getMessages",
  "GET /rides/:ride_id/driverMessages/:username" : "Rides.getDriverMessages"
};
