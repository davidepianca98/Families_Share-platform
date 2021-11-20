const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const Group = require('../../src/models/group')

describe('/Post/api/groups/id/materialOffers', () => {
  it('it should post a new material offer when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        const materialOffer = {
          material_name: 'PlayStation',
          description: 'Console',
          color: '#00FF00',
          location: 'Milan'
        }
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/materialOffers`)
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

describe('/Get/api/groups/id/materialOffers', () => {
  it('it should fetch a groups material offers filtered by keywords when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/materialOffers?filter=Play`)
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

describe('/Get/api/groups/id/materialOffers', () => {
  it('it should fail fetching a groups material offers filtered by keywords when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/materialOffers?filter=Xbox`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})

describe('/Post/api/groups/id/materialRequests', () => {
  it('it should post a new material request when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        const materialRequest = {
          material_name: 'PlayStation'
        }
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/materialRequests`)
          .set('Authorization', user.token)
          .send(materialRequest)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})

describe('/Get/api/groups/id/materialRequests', () => {
  it('it should fetch a groups material requests when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/materialRequests`)
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

describe('/Get/api/groups/id/materialRequests', () => {
  it('it should fetch a groups material requests filtered by keywords when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/materialRequests?filter=Play`)
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

describe('/Get/api/groups/id/materialRequests', () => {
  it('it should fail fetching a groups material requests filtered by keywords when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/materialRequests?filter=Xbox`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})
