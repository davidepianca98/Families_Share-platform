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
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  offer_id: {
    type: String,
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true } })

materialBookingSchema.index({ offer_id: 1, createdAt: -1 })

mongoose.pluralize(null)
const model = mongoose.model('MaterialBooking', materialBookingSchema)

module.exports = model
