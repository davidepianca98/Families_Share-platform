const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const Group = require('../../src/models/group')
const MaterialOffer = require('../../src/models/material-offer')

describe('/Post/api/groups/id/materialOffers', () => {
  it('it should post a new material offer when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        const materialOffer = {
          material_name: 'PlayStation'
        }
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', user.token)
          .send(materialOffer)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Get/api/groups/id/materialOffers', () => {
  it('it should fetch a groups material offers when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/materialOffers`)
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
