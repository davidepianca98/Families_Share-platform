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
    MaterialOffer.findOne({ material_offer_id: booking.material_offer_id }, (err1, offer) => {
      Member.findOne({ user_id: req.user_id, group_id: offer.group_id }).then((member) => {
        if (!member) {
          return res.status(401).send('Unauthorized')
        }
        res.json(booking)
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
    MaterialOffer.findOne({ material_offer_id: booking.material_offer_id }, (err1, offer) => {
      Member.findOne({ user_id: req.user_id, group_id: offer.group_id }).then((member) => {
        if (!member) {
          return res.status(401).send('Unauthorized')
        }
        MaterialBooking.deleteOne(
          { material_booking_id: id }
        ).then(result => {
          res.json(true)
        })
      })
    })
  }).catch(next)
})

module.exports = router
