const _crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { jwtSecret } = require('../../config')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: false
  },
  otherNames: {
    type: String,
    trim: true,
    required: false
  },
  email: {
    type: String,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    unique: [true, 'is already taken'],
    trim: true,
    required: [true, 'can\'t be blank'],
    index: true
  },
  username: {
    type: String,
    match: [/\w+/, 'must contain only alphanumeric characters'],
    lowercase: true,
    unique: [true, 'is already taken'],
    trim: true,
    required: [true, 'can\'t be blank'],
    index: true
  },
  bio: String,
  image: String,
  hash: String,
  salt: String
}, { timestamps: true })

UserSchema.methods.setPassword = function (password) {
  this.salt = _crypto.randomBytes(16).toString('hex')
  this.hash = _crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.passwordIsValid = function (password) {
  var hash = _crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}

UserSchema.methods.generateJWT = function () {
  var today = new Date()
  var exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    firstName: this.firstName,
    otherNames: this.otherNames,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000)
  }, jwtSecret)
}

UserSchema.methods.toAuthJSON = function () {
  return {
    firstName: this.firstName,
    otherNames: this.otherNames,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  }
}

UserSchema.methods.toJSON = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    otherNames: this.otherNames,
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image
  }
}

const User = mongoose.model('User', UserSchema, 'users')

module.exports = User
