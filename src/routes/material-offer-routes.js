const express = require('express')
const router = new express.Router()
const objectid = require('objectid')

const MaterialOffer = require('../models/material-offer')
const MaterialBooking = require('../models/material-booking')
const Member = require('../models/member')

// S-03b Ritorna i dettagli dell’istanza
router.get('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialOffer.findOne({ material_offer_id: id }).then(offer => {
    if (!offer) {
      return res.status(404).send("Offer doesn't exist")
    }

    Member.findOne({ user_id: req.user_id, group_id: offer.group_id }).then(() => {
      res.json(offer)
    }).catch((error) => {
      return res.status(404).send("Offer doesn't exist")
    })
  }).catch(next)
})

// S-04c Aggiorna l’istanza
router.put('/:id', async (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  const offer = req.body
  MaterialOffer.findOneAndUpdate(
    { material_offer_id: id, created_by: req.user_id },
    { material_name: offer.material_name })
    .then(offer => {
      if (!offer) {
        return res.status(404).send("Offer doesn't exist")
      }
      res.json(offer)
    }).catch(next)
})

// S-05b Elimina l’istanza
router.delete('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialOffer.deleteOne( // TODO delete bookings also
    { material_offer_id: id, created_by: req.user_id })
    .then(result => {
      if (!result.deletedCount) {
        return res.status(404).send("Offer doesn't exist")
      }
      res.json(true)
    }).catch(next)
})

// S-08b Associa utente e date di prenotazione
router.post('/:id/book', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  const filter = { material_offer_id: id, created_by: { '$ne': req.user_id } }

  MaterialOffer.findOne(filter).then((offer) => {
    const booking = {
      material_booking_id: objectid(),
      start: req.start,
      end: req.end,
      user: req.user_id,
      offer_id: offer.material_offer_id
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

// S-10b Cambia lo stato da “in prestito” a “disponibile” e viceversa
router.post('/:id/booked', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialOffer.findOne({ material_offer_id: id, created_by: { '$eq': req.user_id } })
    .then(offer => {
      if (!offer) {
        return res.status(404).send('Offer not found')
      }
      const filter = { material_offer_id: id }
      const update = { borrowed: !offer.borrowed }

      MaterialOffer.updateOne(filter, update)
      res.json(true)
    }).catch(next)
})

// S-07a Ritorna le prenotazioni del materiale
router.get('/:id/bookings', (req, res, next) => {
  const offer_id = req.query.id
  MaterialBooking.find({ offer_id: { $in: offer_id } })
    .lean()
    .exec()
    .then(bookings => {
      if (bookings.length === 0) {
        return res.status(404).send('No bookings were found')
      }
      return res.json(bookings)
    })
    .catch(next)
})

module.exports = router
