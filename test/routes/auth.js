const { describe, it } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
// const expect = chai.expect

describe('API auth endpoint', () => {
  describe('POST /register', () => {
    it('should yield a response with a \'data.id\' field of type \x1b[33mString\x1b[0m')

    it('should yield a status code of 200')

    it('attempting to create a user with an existing username should yield a status code of 400')

    it('attempting to create a user with an existing email should yield a status code of 400')
  })

  describe('PUT /login', () => {
    it('should yield a response with a \'data.id\' field of type \x1b[33mString\x1b[0m')

    it('should yield a response with a \'data.token\' field of type \x1b[33mString\x1b[0m')

    it('should yield a status code of 200')
  })
})
