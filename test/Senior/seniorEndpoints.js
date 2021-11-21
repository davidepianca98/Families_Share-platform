/* eslint-disable handle-callback-err */
const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const Senior = require('../../src/models/senior')

describe('/Put/api/seniors/id', () => {
  it('it should update a senior when the user is authenticated and in relationship with the senior', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'Test' }, (err, senior) => {
        senior.given_name = 'My Grandpa'
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

describe('/Put/api/seniors/id', () => {
  it('it should not update a senior when the user is authenticated and not in relationship with the senior', done => {
    User.findOne({ email: 'test3@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'My Grandpa' }, (err, senior) => {
        senior.given_name = 'Granny'
        chai
          .request(server)
          .put(`/api/seniors/${senior.senior_id}`)
          .set('Authorization', user.token)
          .send(senior)
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})

describe('/Get/api/seniors/id', () => {
  it('it should NOT fetch a senior when the user is NOT authenticated or NOT a group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'My Grandpa' }, (err, senior) => {
        chai
          .request(server)
          .get(`/api/seniors/${senior.senior_id}`)
          .set('Authorization', 'NOT Authorized')
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})

describe('/Get/api/seniors/id', () => {
  it('it should NOT fetch a senior when a bad id is issued', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'My Grandpa' }, (err, senior) => {
        chai
          .request(server)
          .get(`/api/seniors/${senior.senior_id + 'xxx'}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})

describe('/Get/api/seniors/id', () => {
  it('it should fetch a senior when the user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'My Grandpa' }, (err, senior) => {
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

describe('/Delete/api/seniors/id', () => {
  it('it should NOT delete a senior when the senior_id is bad', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'My Grandpa' }, (err, senior) => {
        chai
          .request(server)
          .delete(`/api/seniors/${senior.senior_id + 'xxx'}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})

describe('/Delete/api/seniors/id', () => {
  it('it NOT should delete a senior when the user is NOT authenticated or NOT in relationship with the senior', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'My Grandpa' }, (err, senior) => {
        chai
          .request(server)
          .delete(`/api/seniors/${senior.senior_id}`)
          .set('Authorization', 'unauthorized')
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})

describe('/Delete/api/seniors/id', () => {
  it('it should delete a senior when the user is authenticated and in relationship with the senior', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Senior.findOne({ given_name: 'My Grandpa' }, (err, senior) => {
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
