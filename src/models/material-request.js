const mongoose = require('mongoose')

const materialRequestSchema = new mongoose.Schema({
  material_request_id: {
    type: String,
    unique: true,
    required: true
  },
  material_name: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  color: {
    type: String
  },
  description: {
    type: String
  },
  satisfied_by: {
    type: String
  },
  group_id: {
    type: String,
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true } })

materialRequestSchema.index({ group_id: 1, createdAt: -1 })

mongoose.pluralize(null)
const model = mongoose.model('MaterialRequest', materialRequestSchema)

module.exports = model
