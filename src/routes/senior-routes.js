const express = require('express')
const router = new express.Router()

const Senior = require('../models/senior')
const Member = require('../models/member')

// S-21b Ritorna i dettagli dell’istanza
router.get('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  Senior.findOne({ senior_id: id }).then(senior => { // TODO dovrebbe controllare che l'utente sia giusto
    if (!senior) {
      return res.status(404).send("Senior doesn't exist")
    }

    Member.findOne({ user_id: req.user_id }) // TODO probabilmente sbagliato
      .then(() => {
        res.json(senior)
      }).catch((error) => {
        return res.status(404).send("Senior doesn't exist")
      })
  }).catch(next)
})

// S-22c Aggiorna l’istanza
router.put('/:id', async (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  const senior = req.body
  const filter = { senior_id: id, user_id: req.user_id }
  const update = {
    given_name: senior.given_name,
    gender: senior.gender,
    birthdate: senior.birthdate,
    background: senior.background,
    other_info: senior.other_info
  }
  Senior.findOneAndUpdate(filter, update)
    .then(senior => {
      if (!senior) {
        return res.status(404).send("Senior doesn't exist")
      }
      res.json(senior)
    }).catch(next)
})

// S-23b Elimina l’istanza
router.delete('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  Senior.deleteOne(
    { senior_id: id, user_id: req.user_id })
    .then(result => {
      if (!result.deletedCount) {
        return res.status(404).send("Senior doesn't exist")
      }
      res.json(true)
    }).catch(next)
})

module.exports = router
