const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const MaterialRequest = require('../../src/models/material-request')

// TODO test more edge cases

describe('/Get/api/materials/requests/id', () => {
  it('it should fetch a material request when the user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialRequest.findOne({ material_name: 'PlayStation' }, (err, request) => {
        chai
          .request(server)
          .get(`/api/materials/requests/${request.material_request_id}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Put/api/materials/requests/id', () => {
  it('it should update a material request when the user is authenticated and the creator of the request', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialRequest.findOne({ material_name: 'PlayStation' }, (err, request) => {
        request.material_name = 'PlayStation 2'
        chai
          .request(server)
          .put(`/api/materials/requests/${request.material_request_id}`)
          .set('Authorization', user.token)
          .send(request)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Post/api/materials/requests/id/satisfy', () => {
  it('it should set the material request as satisfied when the user is authenticated and member of the group', done => {
    User.findOne({ email: 'test3@email.com' }, (error, user) => {
      MaterialRequest.findOne({ material_name: 'PlayStation 2' }, (err, request) => {
        chai
          .request(server)
          .post(`/api/materials/requests/${request.material_request_id}/satisfy`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Delete/api/materials/requests/id', () => {
  it('it should delete a material request when the user is authenticated and the creator of the request', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      MaterialRequest.findOne({ material_name: 'PlayStation 2' }, (err, request) => {
        chai
          .request(server)
          .delete(`/api/materials/requests/${request.material_request_id}`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})
