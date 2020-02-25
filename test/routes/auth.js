const { describe, it } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src/server')
const faker = require('faker')
const HttpStatus = require('http-status-codes')

chai.use(chaiHttp)
const expect = chai.expect

const user = {
  firstName: faker.name.firstName,
  otherNames: faker.name.lastName,
  username: faker.internet.userName(this.firstName, this.otherNames),
  email: faker.internet.email(this.firstName, this.otherNames),
  bio: `${faker.name.jobTitle()} at ${faker.name.jobArea()}.`
}

describe('API auth endpoint', () => {
  describe('POST /register', () => {
    it('should yield a response with a \'data.id\' field of type \x1b[33mString\x1b[0m', done => {
      chai.request(server).put('/api/v1/auth/register').send({ user }).end((_err, res) => {
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.have.property('id')
        expect(res.body.data.id).to.be.a('string')
        done()
      })
    })

    it('should yield a status code of 200', done => {
      const user2 = {
        firstName: faker.name.firstName,
        otherNames: faker.name.lastName,
        username: faker.internet.userName(this.firstName, this.otherNames),
        email: faker.internet.email(this.firstName, this.otherNames),
        bio: `${faker.name.jobTitle()} at ${faker.name.jobArea()}.`
      }
      chai.request(server).put('/api/v1/auth/login').send({ user: user2 }).end((_err, res) => {
        expect(res).to.have.statusCode(HttpStatus.OK)
        done()
      })
    })

    it('attempting to create a user with an existing username should yield a status code of 400', done => {
      const user3 = {
        firstName: faker.name.firstName,
        otherNames: faker.name.lastName,
        username: user.username,
        email: faker.internet.email(this.firstName, this.otherNames),
        bio: `${faker.name.jobTitle()} at ${faker.name.jobArea()}.`
      }
      chai.request(server).put('/api/v1/auth/login').send({ user: user3 }).end((_err, res) => {
        expect(res).to.have.statusCode(HttpStatus.OK)
        done()
      })
    })

    it('attempting to create a user with an existing email should yield a status code of 400', done => {
      const user4 = {
        firstName: faker.name.firstName,
        otherNames: faker.name.lastName,
        username: faker.internet.userName(this.firstName, this.otherNames),
        email: user.email,
        bio: `${faker.name.jobTitle()} at ${faker.name.jobArea()}.`
      }
      chai.request(server).put('/api/v1/auth/login').send({ user: user4 }).end((_err, res) => {
        expect(res).to.have.statusCode(HttpStatus.OK)
        done()
      })
    })
  })

  describe('PUT /login', () => {
    it('should yield a response with a \'data.id\' field of type \x1b[33mString\x1b[0m', done => {
      chai.request(server).put('/api/v1/auth/login').send({ user }).end((_err, res) => {
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.have.property('id')
        expect(res.body.data.id).to.be.a('string')
        done()
      })
    })

    it('should yield a response with a \'data.token\' field of type \x1b[33mString\x1b[0m', done => {
      chai.request(server).put('/api/v1/auth/login').send({ user }).end((_err, res) => {
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.have.property('token')
        expect(res.body.data.id).to.be.a('string')
        done()
      })
    })

    it('should yield a status code of 200', done => {
      chai.request(server).put('/api/v1/auth/login').send({ user }).end((_err, res) => {
        expect(res).to.have.statusCode(HttpStatus.OK)
        done()
      })
    })
  })
})
