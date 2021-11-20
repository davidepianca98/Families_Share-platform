const express = require('express')
const router = new express.Router()
const objectid = require('objectid')
const nh = require('../helper-functions/notification-helpers')

const MaterialOffer = require('../models/material-offer')
const MaterialBooking = require('../models/material-booking')
const Member = require('../models/member')

// S-03b
router.get('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialOffer.findOne({ material_offer_id: id }).then(offer => {
    if (!offer) {
      return res.status(404).send("Offer doesn't exist")
    }

    Member.findOne({ user_id: req.user_id, group_id: offer.group_id }).then((member) => {
      if (!member) {
        return res.status(401).send('Unauthorized')
      }
      res.json(offer)
    })
  }).catch(next)
})

// S-04c
router.put('/:id', async (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  const offer = req.body
  MaterialOffer.findOneAndUpdate({ material_offer_id: id, created_by: req.user_id }, offer)
    .then(offer => {
      if (!offer) {
        return res.status(404).send("Offer doesn't exist")
      }
      res.json(offer)
    }).catch(next)
})

// S-05b
router.delete('/:id', async (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  let offer = await MaterialOffer.findOne({ material_offer_id: id, created_by: req.user_id })
  let result = await MaterialOffer.deleteOne({ material_offer_id: id, created_by: req.user_id })
  if (!result.deletedCount) {
    return res.status(404).send("Offer doesn't exist")
  }

  let futureBookings = await MaterialBooking.find({  material_offer_id: id, start: { '$gte': Date.now() } })
  await nh.materialOfferDeletedNotification(offer, futureBookings)

  MaterialBooking.deleteMany({ material_offer_id: id }).then(() => {
    res.json(true)
  }).catch(next)
})

// S-08b
router.post('/:id/book', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  const filter = { material_offer_id: id, created_by: { '$ne': req.user_id } }
  const bookingReq = req.body

  MaterialOffer.findOne(filter).then((offer) => {
    if (!offer) {
      return res.status(404).send("Offer doesn't exist")
    }
    const booking = {
      material_booking_id: objectid(),
      start: bookingReq.start,
      end: bookingReq.end,
      user: req.user_id,
      material_offer_id: offer.material_offer_id
    }

    MaterialBooking.create(booking)
      .then(booking => {
        if (!booking) {
          return res.status(404).send("Booking doesn't exist")
        }
        res.json(booking)
      }).catch(next)
  }).catch(next)
})

// S-10b
router.post('/:id/booked', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  const bookingState = req.body

  MaterialOffer.findOne({ material_offer_id: id, created_by: { '$eq': req.user_id } })
    .then(offer => {
      if (!offer) {
        return res.status(404).send('Offer not found')
      }
      const filter = { material_offer_id: id }
      const update = { borrowed: bookingState.borrowed }

      MaterialOffer.updateOne(filter, update).then((offer) => {
        res.json(offer.borrowed)
      }).catch(next)
    }).catch(next)
})

// S-07a
router.get('/:id/bookings', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }

  const material_offer_id = req.params.id
  MaterialOffer.findOne({ material_offer_id: material_offer_id, created_by: { '$eq': req.user_id } })
    .then(offer => {
      if (!offer) {
        return res.status(404).send('Offer not found')
      }
      MaterialBooking.find({ material_offer_id: material_offer_id })
        .lean()
        .exec()
        .then(bookings => {
          if (bookings.length === 0) {
            return res.status(404).send('No bookings were found')
          }
          return res.json(bookings)
        })
        .catch(next)
    }).catch(next)
})

module.exports = router
