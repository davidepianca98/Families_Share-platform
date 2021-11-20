/* eslint-disable handle-callback-err */
const express = require('express')
const router = new express.Router()
const nh = require('../helper-functions/notification-helpers')

const MaterialRequest = require('../models/material-request')
const Member = require('../models/member')

router.get('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialRequest.findOne({ material_request_id: id }).then(request => {
    if (!request) {
      return res.status(404).send("Request doesn't exist")
    }

    Member.findOne({ user_id: req.user_id, group_id: request.group_id }).then(() => {
      res.json(request)
    }).catch((error) => {
      return res.status(404).send("Request doesn't exist")
    })
  }).catch(next)
})

router.put('/:id', async (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  const materialRequest = req.body

  MaterialRequest.findOne({ material_request_id: id }).then(request => {
    if (request) {
      if (req.user_id !== request.created_by) {
        return res.status(401).send('Unauthorized')
      }
    }
  })

  MaterialRequest.findOneAndUpdate(
    { material_request_id: id, created_by: req.user_id },
    { material_name: materialRequest.material_name })
    .then(request => {
      if (!request) {
        return res.status(404).send("Request doesn't exist")
      }
      res.json(request)
    }).catch(next)
})

router.delete('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialRequest.findOne({ material_request_id: id }).then(request => {
    if (request) {
      if (req.user_id !== request.created_by) {
        return res.status(401).send('Unauthorized')
      }
    }
  })

  MaterialRequest.deleteOne(
    { material_request_id: id, created_by: req.user_id }
  ).then(result => {
    if (!result.deletedCount) {
      return res.status(404).send("Request doesn't exist")
    }
    res.json(true)
  }).catch(next)
})

router.post('/:id/satisfy', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Unauthorized')
  }
  const id = req.params.id
  MaterialRequest.findOneAndUpdate(
    { material_request_id: id, created_by: { '$ne': req.user_id } },
    { satisfied_by: req.user_id }
  ).then(async request => {
    if (!request) {
      return res.status(404).send("Request doesn't exist")
    }
    await nh.materialRequestSatisfiedNotification(request.created_by, req.user_id, request)
    res.json(true)
  }).catch(next)
})

module.exports = router
