/* eslint-disable handle-callback-err */
const express = require('express')
const router = new express.Router()

const MaterialOffer = require('../models/material-offer')
const MaterialBooking = require('../models/material-booking')
const Member = require('../models/member')

// S-07a
router.get('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialBooking.findOne({ material_booking_id: id }).then(booking => {
    if (!booking) {
      return res.status(404).send("Booking doesn't exist")
    }
    MaterialOffer.findOne({ offer_id: booking.offer_id }, (err1, offer) => {
      Member.findOne({ user_id: req.user_id, group_id: booking.group_id }).then(() => {
        res.json(booking)
      }).catch((error) => {
        return res.status(404).send("Booking doesn't exist")
      })
    })
  }).catch(next)
})

// S-11b
router.delete('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialBooking.findOne({ material_booking_id: id }).then(booking => {
    if (!booking) {
      return res.status(404).send("Booking doesn't exist")
    }
    MaterialOffer.findOne({ offer_id: booking.offer_id }, (err1, offer) => {
      Member.findOne({ user_id: req.user_id, group_id: booking.group_id }).then(() => {
        MaterialBooking.deleteOne(
          { material_booking_id: id }
        ).then(result => {
          if (!result.deletedCount) {
            return res.status(404).send("Booking doesn't exist")
          }
          res.json(true)
        }).catch(next)
      }).catch((error) => {
        return res.status(404).send("Booking doesn't exist")
      })
    })
  }).catch(next)
})

module.exports = router
