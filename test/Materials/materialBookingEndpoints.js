const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const MaterialBooking = require('../../src/models/material-booking')

// TODO test more edge cases

describe('/Get/api/materials/bookings/id', () => {
  it('it should fetch a material booking when the user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialBooking.findOne({ user: user.user_id }, (err, booking) => {
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

describe('/Delete/api/materials/bookings/id', () => {
  it('it should delete a material booking when the user is authenticated and the creator of the booking', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialBooking.findOne({  user: user.user_id }, (err, booking) => {
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
