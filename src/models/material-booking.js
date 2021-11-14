const mongoose = require('mongoose')

const materialBookingSchema = new mongoose.Schema({
  material_booking_id: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  start: {
    type: Boolean,
    required: true,
    default: false
  },
  end: {
    type: Boolean,
    required: true,
    default: false
  },
  group_id: {
    type: String,
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true } })

materialBookingSchema.index({ group_id: 1, createdAt: -1 })

mongoose.pluralize(null)
const model = mongoose.model('MaterialBooking', materialBookingSchema)

module.exports = model
