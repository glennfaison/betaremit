const { describe, it } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const expect = chai.expect

describe('API users endpoint', () => {
  it('Should have \'Hey\' as a string', done => {
    expect('Hey').to.be.a('string', '\'Hey\' is a string')
    done()
  })

  describe('GET /users', () => {})

  describe('GET /users/:id', () => {})
})
