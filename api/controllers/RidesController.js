/**
 * RidesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  patchRide: async (req, res) => {
    try {
      let newRider = ''
      if (req.body.hasOwnProperty('requestJumpin')) {
        newRider = req.body.requestJumpin
      }
      const findRide = await Rides.findOne({ id: req.params.ride_id })
      if (!findRide.jumpin_requests.includes(newRider)) {
        findRide.jumpin_requests.push(newRider)
        const updatedRide = await Rides.updateOne(
          {
            id: req.params.ride_id,
          },
          {
            jumpin_requests: findRide.jumpin_requests,
          }
        )
        return res.ok(updatedRide)
      } else {
        return res.badRequest('user already requested to jumpIn')
      }
    } catch (error) {
      return res.status(404).send(error)
    }
  },
  getUserDistance: async (req, res) => {
    try {
      const db = Rides.getDatastore().manager
      const findRides = await db
        .collection('rides')
        .aggregate([
          {
            $match: {
              rider_usernames: req.params.username,
              driver_rating: { $gt: 0 },
              rider_rating: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: '$rider_usernames',
              totalDistance: { $sum: '$distance' },
            },
          },
        ])
        .toArray()
      res.ok(findRides[0])
    } catch (error) {
      return res.badRequest(error)
    }
  },
  getUserCarbon: async (req, res) => {
    try {
      const db = Rides.getDatastore().manager
      const findRides = await db
        .collection('rides')
        .aggregate([
          {
            $match: {
              rider_usernames: req.params.username,
              driver_rating: { $gt: 0 },
              rider_rating: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: '$rider_usernames',
              totalCarbon: { $sum: '$carbon_emissions' },
            },
          },
        ])
        .toArray()
      res.ok(findRides[0])
    } catch (error) {
      return res.badRequest(error)
    }
  },
  getUserSpend: async (req, res) => {
    try {
      const db = Rides.getDatastore().manager
      const findRides = await db
        .collection('rides')
        .aggregate([
          {
            $match: {
              rider_usernames: req.params.username,
              driver_rating: { $gt: 0 },
              rider_rating: { $gt: 0 },
            },
          },
          {
            $group: { _id: '$rider_usernames', totalSpend: { $sum: '$price' } },
          },
        ])
        .toArray()
      res.ok(findRides[0])
    } catch (error) {
      return res.badRequest(error)
    }
  },
  postMessage: async (req, res) => {
    try {
      const message = {
        from: req.body.from,
        text: req.body.text,
        timeStamp: new Date(Date.now()).toISOString(),
      }
      const findRide = await Rides.findOne({ id: req.params.ride_id })
      const updatedChat = []
      const newChats = findRide.chats.map((chat) => {
        if (chat.rider === req.body.rider) {
          chat.messages.push(message)
          updatedChat.push(chat)
        }
        return chat
      })
      if (updatedChat.length === 0) {
        newChats.push({
          rider: req.body.from,
          driver: req.body.driver,
          messages: [message],
        })
      }
      const updatedRide = await Rides.updateOne(
        {
          id: req.params.ride_id,
        },
        {
          chats: newChats,
        }
      )
      const chats = updatedRide.chats.filter(
        (chat) => chat.rider === req.body.rider
      )
      return res.ok(chats)
    } catch (error) {
      return res.badRequest(error)
    }
  },
  getMessages: async (req, res) => {
    try {
      const findRide = await Rides.findOne({ id: req.params.ride_id })
      const chats = findRide.chats.filter(
        (chat) => chat.rider === req.params.username
      )
      return res.ok(chats)
    } catch (error) {
      return res.badRequest(error)
    }
  },
  getDriverMessages: async (req, res) => {
    try {
      const findRide = await Rides.findOne({ id: req.params.ride_id })
      const chats = findRide.chats.filter(
        (chat) => chat.driver === req.params.username
      )
      return res.ok(chats)
    } catch (error) {
      return res.badRequest(error)
    }
  },
}
