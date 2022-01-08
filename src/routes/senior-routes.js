const express = require('express')
const multer = require('multer')
const fr = require('find-remove')
const path = require('path')
const sharp = require('sharp')
const Image = require('../models/image')
const router = new express.Router()

const Senior = require('../models/senior')
const uh = require('../helper-functions/user-helpers')
const Group = require('../models/group')
const Member = require('../models/member')

const seniorProfileStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../../images/profiles'))
  },
  filename (req, file, cb) {
    fr(path.join(__dirname, '../../images/profiles'), {
      prefix: req.params.seniorId
    })
    cb(
      null,
      `${req.params.seniorId}-${Date.now()}.${file.mimetype.slice(
        file.mimetype.indexOf('/') + 1,
        file.mimetype.length
      )}`
    )
  }
})
const seniorProfileUpload = multer({
  storage: seniorProfileStorage,
  limits: { fieldSize: 52428800 }
})

// S-21b
router.get('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  Senior.findOne({ senior_id: id })
    .populate('image')
    .lean()
    .exec()
    .then((senior) => {
      if (!senior) {
        return res.status(404).send("Senior doesn't exist")
      }

      res.json(senior)
    })
    .catch(next)
})

// S-22c
router.put(
  '/:id',
  seniorProfileUpload.single('photo'),
  async (req, res, next) => {
    if (!req.user_id) {
      return res.status(401).send('Unauthorized')
    }
    const { file } = req
    const id = req.params.id
    const senior = req.body
    const filter = { senior_id: id, user_id: req.user_id }
    if (senior) {
      if (senior.user_id !== req.user_id) {
        return res.status(401).send('Unauthorized')
      }
    }

    const update = {
      given_name: senior.given_name,
      family_name: senior.family_name,
      gender: senior.gender,
      availabilities: senior.availabilities
        ? JSON.parse(senior.availabilities)
        : [],
      birthdate: senior.birthdate,
      background: senior.background,
      other_info: senior.other_info
    }
    Senior.findOneAndUpdate(filter, update)
      .then(async (senior) => {
        if (!senior) {
          return res.status(404).send("Senior doesn't exist")
        }
        try {
          if (file) {
            const fileName = file.filename.split('.')
            const imagePatch = {
              path: `/images/profiles/${file.filename}`,
              thumbnail_path: `/images/profiles/${fileName[0]}_t.${fileName[1]}`
            }
            await sharp(
              path.join(__dirname, `../../images/profiles/${file.filename}`)
            )
              .resize({
                height: 200,
                fit: sharp.fit.cover
              })
              .toFile(
                path.join(
                  __dirname,
                  `../../images/profiles/${fileName[0]}_t.${fileName[1]}`
                )
              )
            await Image.updateOne(
              { owner_type: 'senior', owner_id: senior.senior_id },
              imagePatch
            )
          }
        } catch (error) {
          next(error)
        }
        res.json(senior)
      })
      .catch(next)
  }
)

// S-23b
router.delete('/:id', async (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id

  Senior.deleteOne({ senior_id: id, user_id: req.user_id })
    .then(async (result) => {
      if (!result.deletedCount) {
        return res.status(404).send("Senior doesn't exist")
      }
      const memberships = await Member.find({ user_id: req.user_id })
      const groupIds = memberships.map((membership) => membership.group_id)
      const userGroups = await Group.find({ group_id: { $in: groupIds } })
      await Promise.all(
        userGroups.map((group) => {
          uh.unsubcribeSeniorFromGroupEvents(group.calendar_id, id)
        })
      )
      res.json(true)
    })
    .catch(next)
})

module.exports = router
