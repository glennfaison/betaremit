const config = {}

config.testing = {
  env: 'testing',
  port: 3210,
  jwtSecret: 'This is a secret!',
  mongoUrl: 'mongodb://localhost/test'
}

config.development = {
  env: 'development',
  port: 3000,
  jwtSecret: 'This is a secret!',
  mongoUrl: 'mongodb://localhost/betaremit'
}

config.production = {
  env: 'production',
  port: 5000,
  jwtSecret: 'This is a secret!',
  mongoUrl: 'mongodb://localhost/betaremit'
}

const mode = process.env.NODE_ENV || 'development'

module.exports = config[mode]
