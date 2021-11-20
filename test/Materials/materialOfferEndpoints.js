const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const MaterialOffer = require('../../src/models/material-offer')

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

describe('/Get/api/materials/offers/id', () => {
  it('it should fail fetching a material offer when the user is authenticated but not a group member', done => {
    User.findOne({ email: 'test5@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation' }, (err, offer) => {
        chai
          .request(server)
          .get(`/api/materials/offers/${offer.material_offer_id}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(401)
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
        offer.description = 'Test desc'
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

describe('/Put/api/materials/offers/id', () => {
  it('it should not update a material offer when the user is authenticated and not the creator of the offer', done => {
    User.findOne({ email: 'test3@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        offer.material_name = 'PlayStation 3'
        chai
          .request(server)
          .put(`/api/materials/offers/${offer.material_offer_id}`)
          .set('Authorization', user.token)
          .send(offer)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})

describe('/Post/api/materials/offers/id/book', () => {
  it('it should not create a new material booking when the user is authenticated and member of the group but not the creator of the offer', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        const booking = {
          start: '2019-03-20T22:00:00.000Z',
          end: '2019-03-20T23:00:00.000Z'
        }
        chai
          .request(server)
          .post(`/api/materials/offers/${offer.material_offer_id}/book`)
          .set('Authorization', user.token)
          .send(booking)
          .end((err, res) => {
            res.should.have.status(404)
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
          start: '2019-03-20T22:00:00.000Z',
          end: '2019-03-20T23:00:00.000Z'
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
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        const bookingState = {
          borrowed: true
        }
        chai
          .request(server)
          .post(`/api/materials/offers/${offer.material_offer_id}/booked`)
          .set('Authorization', user.token)
          .send(bookingState)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Post/api/materials/offers/id/booked', () => {
  it('it should not set the material offer as booked when the user is authenticated and not the creator of the offer', done => {
    User.findOne({ email: 'test3@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        const bookingState = {
          borrowed: true
        }
        chai
          .request(server)
          .post(`/api/materials/offers/${offer.material_offer_id}/booked`)
          .set('Authorization', user.token)
          .send(bookingState)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})

describe('/Get/api/materials/offers/id/bookings', () => {
  it('it should fetch a material offer bookings when user is authenticated and owner of material offer', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        chai
          .request(server)
          .get(`/api/materials/offers/${offer.material_offer_id}/bookings`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array').with.lengthOf(1)
            done()
          })
      })
    })
  })
})

describe('/Get/api/materials/offers/id/bookings', () => {
  it('it should fail fetching a material offer bookings when user is authenticated and not the owner of material offer', done => {
    User.findOne({ email: 'test3@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        chai
          .request(server)
          .get(`/api/materials/offers/${offer.material_offer_id}/bookings`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})

describe('/Delete/api/materials/offers/id', () => {
  it('it should not delete a material offer when the user is authenticated and not the creator of the offer', done => {
    User.findOne({ email: 'test5@email.com' }, (error, user) => {
      MaterialOffer.findOne({ material_name: 'PlayStation 2' }, (err, offer) => {
        chai
          .request(server)
          .delete(`/api/materials/offers/${offer.material_offer_id}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
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
