const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

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

  // Default error handler
  server.use((err, req) => {
    if (err) {
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
    }
  })

  return server
}

module.exports = createServer
