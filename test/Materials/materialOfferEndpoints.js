const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const MaterialOffer = require('../../src/models/material-offer')

// TODO test more edge cases

describe('/Get/api/materials/offers/id', () => {
  it('it should fetch a material offer when the user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation' }, (err, offer) => {
        chai
          .request(server)
          .get(`/api/materials/offers/${offer.material_offer_id}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Put/api/materials/offers/id', () => {
  it('it should update a material offer when the user is authenticated and the creator of the offer', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation' }, (err, offer) => {
        offer.material_name = 'PlayStation 2'
        chai
          .request(server)
          .put(`/api/materials/offers/${offer.material_offer_id}`)
          .set('Authorization', user.token)
          .send(offer)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Post/api/materials/offers/id/book', () => {
  it('it should create a new material booking when the user is authenticated and member of the group', done => {
    User.findOne({ email: 'test3@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        const booking = {
          user: user.user_id,
          start: {
            dateTime: '2019-03-20T22:00:00.000Z',
            date: null
          },
          end: {
            dateTime: '2019-03-20T23:00:00.000Z',
            date: null
          }
        }
        chai
          .request(server)
          .post(`/api/materials/offers/${offer.material_offer_id}/book`)
          .set('Authorization', user.token)
          .send(booking)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Post/api/materials/offers/id/booked', () => {
  it('it should set the material offer as booked when the user is authenticated and the creator of the offer', done => {
    User.findOne({ email: 'test3@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        chai
          .request(server)
          .post(`/api/materials/offers/${offer.material_offer_id}/book`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Delete/api/materials/offers/id', () => {
  it('it should delete a material offer when the user is authenticated and the creator of the offer', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        chai
          .request(server)
          .delete(`/api/materials/offers/${offer.material_offer_id}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})
