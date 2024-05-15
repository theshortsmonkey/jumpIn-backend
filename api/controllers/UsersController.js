/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { mongo } = require('mongoose')
const { createWriteStream, createReadStream, unlink } = require('fs')
const axios = require('axios')
const bcrypt = require('bcrypt')

module.exports = {
  deleteUser: async (req, res) => {
    try {
      const findUser = await Users.findOne({ username: req.params.username })
      if (findUser) {
        await Users.destroy({ username: req.params.username })
        return res.ok()
      } else {
        res.status(404)
        return res.json({
          message: 'Username not found',
        })
      }
    } catch (error) {
      return res.badRequest(error)
    }
  },
  patchUser: async (req, res) => {
    try {
      const updatedUser = await Users.update({ username: req.params.username })
        .set(req.body)
        .fetch()
      return res.ok(updatedUser)
    } catch (error) {
      return res.badRequest(error)
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      if (req.session.userId) {
        const findUser = await Users.findOne({ id: req.session.userId })
        return res.json(findUser)
      } else {
        res.status(404)
        return res.json({
          message: 'UserId not found',
        })
      }
    } catch (error) {
      return res.badRequest(error)
    }
  },
  getUserByUsername: async (req, res) => {
    try {
      const findUser = await Users.findOne({ username: req.params.username })
      if (findUser) return res.json(findUser)
      else res.status(404)
      return res.json({
        message: 'Username not found',
      })
    } catch (error) {
      return res.badRequest(error)
    }
  },
  imageDownload: async (req, res) => {
    try {
      const db = Users.getDatastore().manager
      const findImage = await db
        .collection('images.files')
        .findOne({ metadata: { username: req.params.username } })
      const path = require('path').resolve()

      if (!findImage) {
        const filePath = path + '/utils/blank-profile-picture.png'
        createReadStream(filePath).pipe(res)
      } else {
        const bucket = new mongo.GridFSBucket(db, { bucketName: 'images' })
        bucket.openDownloadStream(findImage._id).pipe(res)
      }
    } catch (error) {
      return res.badRequest(error)
    }
  },
  imageUpload: async (req, res) => {
    try {
      const db = Users.getDatastore().manager
      const findImage = await db
        .collection('images.files')
        .findOne({ metadata: { username: req.params.username } })

      const bucket = new mongo.GridFSBucket(db, { bucketName: 'images' })
      if (findImage) bucket.delete(findImage._id)
      const streamWrite = bucket.openUploadStream('profile_pic.jpg', {
        metadata: { username: req.params.username },
      })
      if (req.body.filePath.startsWith('http')) {
        axios({
          method: 'GET',
          url: req.body.filePath,
          responseType: 'stream',
        }).then((res) => {
          res.data.pipe(streamWrite)
        })
      } else {
        createReadStream(req.body.filePath).pipe(streamWrite)
      }
      res.status(201)
      return res.json({
        message: 'image uploaded successfully!',
      })
      // });
    } catch (error) {
      return res.badRequest(error)
    }
  },
  imageDelete: async (req, res) => {
    try {
      const db = Users.getDatastore().manager
      const findImage = await db
        .collection('images.files')
        .findOne({ metadata: { username: req.params.username } })

      const bucket = new mongo.GridFSBucket(db, { bucketName: 'images' })
      bucket.delete(findImage._id)
      return res.status(204).send()
    } catch (error) {
      return res.badRequest(error)
    }
  },

  login: async (req, res) => {
    try {
      const findUser = await Users.findOne({ username: req.params.username })
      if (findUser) {
        bcrypt
          .compare(req.body.password, findUser.password)
          .then((compareResult) => {
            if (compareResult) {
              req.session.userId = findUser.id
              return res.json(findUser)
            } else {
              res.status(401)
              return res.json({
                message: 'Unauthorised',
              })
            }
          })
      } else {
        res.status(404)
        return res.json({
          message: 'Username not found',
        })
      }
    } catch (error) {
      return res.badRequest(error)
    }
  },

  logout: async (req, res) => {
    try {
      if (req.session.userId) {
        delete req.session.userId
        return res.json({
          message: `${req.params.username} session cleared`,
        })
      } else {
        return res.json({
          message: `No active login for this session`,
        })
      }
    } catch (error) {
      return res.badRequest(error)
    }
  },
}
