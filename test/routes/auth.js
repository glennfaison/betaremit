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

describe('ping test', () => {
  it('should return a status code of 200', done => {
    chai.request(server).get('/ping').end((_err, res) => {
      expect(res).to.have.status(HttpStatus.OK)
      done()
    })
  })
})

describe('API auth endpoint', () => {
  describe('POST /register', () => {
    it('should yield a response with a \'data.id\' field of type \x1b[33mString\x1b[0m', done => {
      User.deleteMany({}, () => {
        chai.request(server).post('/api/v1/auth/register').send({ user }).end((_err, res) => {
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.have.property('id')
          expect(res.body.data.id).to.be.a('string')
          done()
        })
      })
    })

    it('should yield a status code of 201', done => {
      User.deleteMany({}, () => {
        chai.request(server).post('/api/v1/auth/register').send({ user }).end((_err, res) => {
          expect(res).to.have.status(HttpStatus.CREATED)
          done()
        })
      })
    })

    it('attempting to create a user with an existing username should yield a status code of 400', done => {
      User.deleteMany({}, () => User.create(user, () => {
        chai.request(server).post('/api/v1/auth/register').send({ user }).end((_err, res) => {
          expect(res).to.have.status(HttpStatus.BAD_REQUEST)
          done()
        })
      }))
    })

    it('attempting to create a user with an existing email should yield a status code of 400', done => {
      User.deleteMany({}, () => User.create(user, () => {
        chai.request(server).post('/api/v1/auth/register').send({ user }).end((_err, res) => {
          expect(res).to.have.status(HttpStatus.BAD_REQUEST)
          done()
        })
      }))
    })
  })

  describe('PUT /login', () => {
    it('should yield a status code of 200', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        _user.save({}, () => {
          chai.request(server).put('/api/v1/auth/login').send({ user }).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.OK)
            done()
          })
        })
      })
    })

    it('should yield a response with a \'data.token\' field of type \x1b[33mString\x1b[0m', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        _user.save({}, () => {
          chai.request(server).put('/api/v1/auth/login').send({ user }).end((_err, res) => {
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.property('token')
            expect(res.body.data.token).to.be.a('string')
            done()
          })
        })
      })
    })

    it('yields a status code of 400 if login is attempted with invalid credentials', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        _user.save({}, () => {
          chai.request(server).put('/api/v1/auth/login').send({ user: { ...user, password: 'invalid' } }).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.BAD_REQUEST)
            done()
          })
        })
      })
    })
  })
})
