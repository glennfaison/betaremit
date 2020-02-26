const { describe, it } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../..')

chai.use(chaiHttp)
const expect = chai.expect

describe('API users endpoint', () => {
  describe('GET /users', () => {
    it('should yield a response with a \'data\' field of type Array')

    it('should yield a status code of 200 if sender is authorized')

    it('should yield a status code of 403 if sender is not authorized')
  })

  describe('GET /users/:id', () => {
    it('should yield a response with a \'data.id\' field equal to :id')

    it('should yield a status code of 200 if :id exists')

    it('should yield a status code of 404 when :id does not exist')

    it('should yield a status code of 403 if sender is not authorized')
  })
})
