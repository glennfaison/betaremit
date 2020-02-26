const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const localStrategy = require('./strategies/local')
const HttpStatus = require('http-status-codes')

/**
 * Return a string of repeated characters, long enough to fill one row of the console.
 * @returns {string}
 */
const horizontalLine = (char = '-') => char.repeat(process.stdout.columns)

/**
 * Create and return the server for this API without starting it
 * @returns {Express.Application}
 */
function createServer () {
  const server = express()

  // Configure express for CORS and request parsing
  server.use(cors())
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  // Select passport strategy
  passport.use('local', localStrategy)

  // Declare API routes
  server.use('/api/v1', require('./routes'))

  server.use('/ping', (req, res) => {
    return res.sendStatus(200)
  })

  // Default error handler
  server.use((err, req, res, next) => {
    if (err) {
      if (err.name === 'UnauthorizedError') {
        return res.sendStatus(HttpStatus.UNAUTHORIZED)
      }
      console.log(horizontalLine())
      console.log('\x1b[33m%s\x1b[0m', `An error occured: ${err}`)
      console.dir({
        pathname: req.pathname,
        headers: req.headers,
        query: req.query,
        body: req.body,
        params: req.params
      }, { colors: true })
      console.log(horizontalLine())
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  })

  return server
}

module.exports = createServer
