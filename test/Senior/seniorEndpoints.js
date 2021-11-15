const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const Senior = require('../../src/models/senior')

// TODO test more edge cases

describe('/Get/api/seniors/id', () => {
  it('it should fetch a senior when the user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'Agostino' }, (err, senior) => {
        chai
          .request(server)
          .get(`/api/seniors/${senior.senior_id}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Put/api/seniors/id', () => {
  it('it should update a senior when the user is authenticated and in relationship with the senior', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'Agostino' }, (err, senior) => {
        senior.given_name = 'Alvise'
        chai
          .request(server)
          .put(`/api/seniors/${senior.senior_id}`)
          .set('Authorization', user.token)
          .send(senior)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Delete/api/seniors/id', () => {
  it('it should delete a senior when the user is authenticated and in relationship with the senior', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'Alvise' }, (err, senior) => {
        chai
          .request(server)
          .delete(`/api/seniors/${senior.senior_id}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})
