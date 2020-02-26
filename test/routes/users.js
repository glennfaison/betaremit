const { describe, it } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const HttpStatus = require('http-status-codes')
const { User } = require('../../src/models')

const server = require('../..')

chai.use(chaiHttp)
const expect = chai.expect

const user = {
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  otherNames: faker.name.lastName(),
  username: faker.internet.userName(this.firstName, this.otherNames),
  email: faker.internet.email(this.firstName, this.otherNames),
  bio: `${faker.name.jobTitle()} at ${faker.name.jobArea()}.`
}

describe('API users endpoint', () => {
  describe('GET /users', () => {
    it('should yield a response with a \'data\' field of type Array', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          chai.request(server).get('/api/v1/users').set('authorization', `Bearer ${token}`).end((_err, res) => {
            expect(res.body.data).to.be.a('array')
            done()
          })
        })
      })
    })

    it('should yield a status code of 200 if sender is authorized', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          chai.request(server).get('/api/v1/users').set('authorization', `Bearer ${token}`).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.OK)
            done()
          })
        })
      })
    })

    it('should yield a status code of 401 if sender is not authorized', done => {
      chai.request(server).get('/api/v1/users').set('authorization', 'Bearer invalid').end((_err, res) => {
        expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
        done()
      })
    })
  })

  describe('GET /users/:id', () => {
    it('should yield a response with a \'data._id\' field equal to :id', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, (_err, result) => {
          chai.request(server).get(`/api/v1/users/${result._id}`).set('authorization', `Bearer ${token}`).end((_err, res) => {
            expect(res.body.data.id).to.equal(result._id.toString())
            done()
          })
        })
      })
    })

    it('should yield a status code of 200 if :id exists', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, (_err, result) => {
          chai.request(server).get(`/api/v1/users/${result._id}`).set('authorization', `Bearer ${token}`).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.OK)
            done()
          })
        })
      })
    })

    it('should yield a status code of 404 when :id does not exist', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          chai.request(server).get('/api/v1/users/__invalid_id').set('authorization', `Bearer ${token}`).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.NOT_FOUND)
            done()
          })
        })
      })
    })

    it('should yield a status code of 401 if sender is not authorized', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        _user.save({}, (_err, result) => {
          chai.request(server).get(`/api/v1/users/${result.id}`).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
            done()
          })
        })
      })
    })
  })
})
