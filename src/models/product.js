const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'can\'t be blank']
  },
  type: {
    type: String,
    trim: true,
    required: [true, 'can\'t be blank']
  },
  price: {
    type: Number,
    default: 0
  },
  warranty_years: {
    type: Number,
    required: true,
    validate: value => value >= 0
  },
  rating: {
    type: Number,
    required: false
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true })

ProductSchema.methods.addRating = function (rating) {
  this.ratingCount++
  if (this.ratingCount === 1) {
    this.rating = rating
    return
  }
  this.rating = ((this.rating * (this.ratingCount - 1)) + rating) / this.ratingCount
}

ProductSchema.methods.toJSON = function () {
  return {
    id: this._id,
    available: this.available,
    warranty_years: this.warranty_years,
    type: this.type,
    name: this.name,
    price: this.price,
    rating: this.rating
  }
}

const Product = mongoose.model('Product', ProductSchema, 'products')

module.exports = Product
