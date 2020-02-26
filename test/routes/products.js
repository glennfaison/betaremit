const { describe, it } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const HttpStatus = require('http-status-codes')
const { User, Product } = require('../../src/models')

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
const product = {
  name: faker.commerce.productName(),
  type: faker.commerce.product(),
  price: Number(faker.commerce.price(null, null, 2, '')),
  rating: faker.random.number({ min: 1, max: 5, precision: 2 }),
  warranty_years: faker.random.number({ min: 0, max: 5 }),
  available: faker.random.boolean()
}
const invalidObjectId = '1'.repeat(24)

describe('API products endpoint', () => {
  describe('POST /products', () => {
    it.skip('should yield a response with a \'data.id\' field of type \x1b[33mString\x1b[0m', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          chai.request(server).post('/api/v1/products').set('authorization', `Bearer ${token}`).send({ product }).end((_err, res) => {
            expect(res.body.data.id).to.be.a('string')
            done()
          })
        })
      })
    })

    it.skip('should yield a status code of 201', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          chai.request(server).post('/api/v1/products').set('authorization', `Bearer ${token}`).send({ product }).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.CREATED)
            done()
          })
        })
      })
    })

    it('should yield a status code of 403 if sender is not authorized', done => {
      chai.request(server).post('/api/v1/products').set('authorization', 'Bearer invalid').send({ product }).end((_err, res) => {
        expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
        done()
      })
    })
  })

  describe('GET /products', () => {
    it('should yield a response with a \'data\' field of type Array', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          chai.request(server).get('/api/v1/products').set('authorization', `Bearer ${token}`).send({ product }).end((_err, res) => {
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
          chai.request(server).get('/api/v1/products').set('authorization', `Bearer ${token}`).send({ product }).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.OK)
            done()
          })
        })
      })
    })

    it('should yield a status code of 401 if sender is not authorized', done => {
      chai.request(server).get('/api/v1/products').set('authorization', 'Bearer invalid').send({ product }).end((_err, res) => {
        expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
        done()
      })
    })
  })

  describe('GET /products/:id', () => {
    it('should yield a response with a \'data.id\' field equal to :id', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          Product.create(product, (_err, result) => {
            chai.request(server).get('/api/v1/products/' + result._id).set('authorization', `Bearer ${token}`).send({ product }).end((_err, res) => {
              expect(res.body.data.id).to.equal(result._id.toString())
              done()
            })
          })
        })
      })
    })

    it('should yield a status code of 200 if :id exists', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          Product.create(product, (_err, result) => {
            chai.request(server).get('/api/v1/products/' + result._id).set('authorization', `Bearer ${token}`).send({ product }).end((_err, res) => {
              expect(res).to.have.status(HttpStatus.OK)
              done()
            })
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
          chai.request(server).get('/api/v1/products/__invalid_id').set('authorization', `Bearer ${token}`).send({ product }).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.NOT_FOUND)
            done()
          })
        })
      })
    })

    it('should yield a status code of 401 if sender is not authorized', done => {
      Product.create(product, (_err, result) => {
        chai.request(server).get('/api/v1/products/' + result._id).set('authorization', 'Bearer invalid_token').send({ product }).end((_err, res) => {
          expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
          done()
        })
      })
    })
  })

  describe('PUT /products/:id', () => {
    it('should yield a response with a \'data.id\' field equal to :id', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          Product.create(product, (_err, result) => {
            chai.request(server).put('/api/v1/products/' + result._id).set('authorization', `Bearer ${token}`).send({ product: { ...product, name: 'Modified name' } }).end((_err, res) => {
              expect(res.body.data.id).to.equal(result._id.toString())
              done()
            })
          })
        })
      })
    })

    it('should yield a status code of 200 if :id exists', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          Product.create(product, (_err, result) => {
            chai.request(server).put('/api/v1/products/' + result._id).set('authorization', `Bearer ${token}`).send({ product: { product } }).end((_err, res) => {
              expect(res).to.have.status(HttpStatus.OK)
              done()
            })
          })
        })
      })
    })

    it('should yield a status code of 304 when :id does not exist', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          chai.request(server).put('/api/v1/products/__invalid_id').set('authorization', `Bearer ${token}`).send({ product: { ...product, name: 'Modified name' } }).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.NOT_MODIFIED)
            done()
          })
        })
      })
    })

    it('should yield a status code of 403 if sender is not authorized', done => {
      Product.create(product, (_err, result) => {
        chai.request(server).put('/api/v1/products/' + result._id).set('authorization', 'Bearer invalid_token').send({ product: { ...product, name: 'Modified name' } }).end((_err, res) => {
          expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
          done()
        })
      })
    })
  })

  describe('DELETE /products/:id', () => {
    it('should yield a response with a \'data.deletedCount\' path of 1 if :id exists', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          Product.create(product, (_err, result) => {
            chai.request(server).delete('/api/v1/products/' + result._id).set('authorization', `Bearer ${token}`).send({ product: { ...product, name: 'Modified name' } }).end((_err, res) => {
              expect(res.body.data.deletedCount).to.equal(1)
              done()
            })
          })
        })
      })
    })

    it('should yield a status code of 304 if :id does not exist', done => {
      User.deleteMany({}, () => {
        const _user = new User(user)
        _user.setPassword(user.password)
        const token = _user.generateJWT()
        _user.save({}, () => {
          chai.request(server).delete('/api/v1/products/' + invalidObjectId).set('authorization', `Bearer ${token}`).send({ product: { ...product, name: 'Modified name' } }).end((_err, res) => {
            expect(res).to.have.status(HttpStatus.NOT_MODIFIED)
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
        _user.save({}, () => {
          Product.create(product, (_err, result) => {
            chai.request(server).delete('/api/v1/products/' + result._id).set('authorization', `Bearer ${token}`).send({ product: { ...product, name: 'Modified name' } }).end((_err, res) => {
              expect(res).to.have.status(HttpStatus.OK)
              done()
            })
          })
        })
      })
    })

    it('should yield a status code of 401 if sender is not authorized', done => {
      Product.create(product, (_err, result) => {
        chai.request(server).delete('/api/v1/products/' + result._id).set('authorization', `Bearer ${invalidObjectId}`).send({ product: { ...product, name: 'Modified name' } }).end((_err, res) => {
          expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
          done()
        })
      })
    })
  })
})
