const mongoose = require('mongoose')

const seniorSchema = new mongoose.Schema(
  {
    senior_id: {
      type: String,
      unique: true,
      required: true
    },
    given_name: {
      type: String,
      required: true
    },
    family_name: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    birthdate: {
      type: Date,
      required: true
    },
    special_needs: String,
    other_info: String
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

mongoose.pluralize(null)
const model = mongoose.model('senior', seniorSchema)

module.exports = model
