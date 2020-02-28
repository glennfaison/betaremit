const config = {}

config.testing = {
  env: 'testing',
  port: 3210,
  jwtSecret: 'This is a secret!',
  mongoUrl: 'mongodb://localhost/test'
}

config.development = {
  env: 'development',
  port: 4000,
  jwtSecret: 'This is a secret!',
  mongoUrl: 'mongodb://localhost/betaremit'
}

let productionEnv = require('dotenv').config()
// If the .env file was not read, stop the app
if (productionEnv.error) {
  process.exit(-1)
}

productionEnv = productionEnv.parsed
config.production = {
  env: 'production',
  ...productionEnv
}

const mode = process.env.NODE_ENV || 'development'

module.exports = config[mode]
