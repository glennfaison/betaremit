const { describe, it } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../..')

chai.use(chaiHttp)
// const expect = chai.expect

describe('API products endpoint', () => {
  describe('POST /products', () => {
    it('should yield a response with a \'data.id\' field of type \x1b[33mString\x1b[0m')

    it('should yield a status code of 200')

    it('should yield a status code of 403 if sender is not authorized')
  })

  describe('GET /products', () => {
    it('should yield a response with a \'data\' field of type Array')

    it('should yield a status code of 200 if sender is authorized')

    it('should yield a status code of 403 if sender is not authorized')
  })

  describe('GET /products/:id', () => {
    it('should yield a response with a \'data.id\' field equal to :id')

    it('should yield a status code of 200 if :id exists')

    it('should yield a status code of 404 when :id does not exist')

    it('should yield a status code of 403 if sender is not authorized')
  })

  describe('PUT /products/:id', () => {
    it('should yield a response with a \'data\' field equal to :id')

    it('should yield a status code of 200 if :id exists')

    it('should yield a status code of 304 when :id does not exist')

    it('should yield a status code of 403 if sender is not authorized')
  })

  describe('DELETE /products/:id', () => {
    it('should yield a response with a \'data.deletedCount\' path of 1 if :id exists')

    it('should yield a response with a \'data.deletedCount\' path of 0 if :id does not exist')

    it('should yield a status code of 200 if :id exists')

    it('should yield a status code of 403 if sender is not authorized')
  })
})
