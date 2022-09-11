const mongoose = require('mongoose')

const PinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
    },
    title: {
      type: String,
      required: true,
      min: 3,
    },
    desc: {
      type: String,
      required: true,
      min: 10,
    },
    rating: {
      type: String,
      required: true,
      min: 0,
      max: 5,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('pin', PinSchema)
