const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  value: {
    type: Number
  }
})

module.exports = mongoose.model('resource', schema)
