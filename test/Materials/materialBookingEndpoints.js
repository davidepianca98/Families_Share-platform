/* eslint-disable handle-callback-err */
const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const MaterialOffer = require('../../src/models/material-offer')
const MaterialBooking = require('../../src/models/material-booking')

describe('/Get/api/materials/bookings/id', () => {
  it('it should fetch a material booking when the user is authenticated and group member', done => {
    User.findOne({ email: 'test3@email.com' }, (err0, user) => {
      MaterialOffer.findOne({ material_name: 'offro libro' }, (err1, offer) => {
        MaterialBooking.findOne({ material_offer_id: offer.material_offer_id }, (err2, booking) => {
          chai
            .request(server)
            .get(`/api/materials/bookings/${booking.material_booking_id}`)
            .set('Authorization', user.token)
            .end((err, res) => {
              res.should.have.status(200)
              done()
            })
        })
      })
    })
  })
})

describe('/Get/api/materials/bookings/id', () => {
  it('it should NOT fetch a material booking when the user is NOT group member', done => {
    User.findOne({ email: 'test5@email.com' }, (err0, user) => {
      MaterialOffer.findOne({ material_name: 'offro libro' }, (err1, offer) => {
        MaterialBooking.findOne({ material_offer_id: offer.material_offer_id }, (err2, booking) => {
          chai
            .request(server)
            .get(`/api/materials/bookings/${booking.material_booking_id}`)
            .set('Authorization', user.token)
            .end((err, res) => {
              res.should.have.status(401)
              done()
            })
        })
      })
    })
  })
})

describe('/Delete/api/materials/bookings/id', () => {
  it('it should NOT delete a material booking when the user is NOT the creator of the booking', done => {
    User.findOne({ email: 'test5@email.com' }, (err0, user) => {
      MaterialOffer.findOne({ material_name: 'offro libro' }, (err1, offer) => {
        MaterialBooking.findOne({ material_offer_id: offer.material_offer_id }, (err2, booking) => {
          chai
            .request(server)
            .delete(`/api/materials/bookings/${booking.material_booking_id}`)
            .set('Authorization', user.token)
            .end((err, res) => {
              res.should.have.status(401)
              done()
            })
        })
      })
    })
  })
})

describe('/Delete/api/materials/bookings/id', () => {
  it('it should delete a material booking when the user is authenticated and the creator of the booking', done => {
    User.findOne({ email: 'test3@email.com' }, (err0, user) => {
      MaterialOffer.findOne({ material_name: 'offro libro' }, (err1, offer) => {
        MaterialBooking.findOne({ material_offer_id: offer.material_offer_id }, (err2, booking) => {
          chai
            .request(server)
            .delete(`/api/materials/bookings/${booking.material_booking_id}`)
            .set('Authorization', user.token)
            .end((err, res) => {
              res.should.have.status(200)
              done()
            })
        })
      })
    })
  })
})
