const mongoose = require('mongoose')

const seniorAvailabilitySchema = new mongoose.Schema(
  {
    weekDay: {
      type: Number,
      required: true
    },
    startTimeHour: {
      type: Number,
      required: true
    },
    startTimeMinute: {
      type: Number,
      required: true
    },
    endTimeHour: {
      type: Number,
      required: true
    },
    endTimeMinute: {
      type: Number,
      required: true
    }
  }
)

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
    gender: {
      type: String,
      required: true
    },
    birthdate: {
      type: Date,
      required: true
    },
    image_id: {
      type: String,
      required: true
    },
    background: {
      type: String,
      required: true
    },
    other_info: String,
    user_id: {
      type: String,
      required: true
    },
    availabilities: {
      type: [seniorAvailabilitySchema]
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

seniorSchema.virtual('image', {
  ref: 'Image',
  localField: 'image_id',
  foreignField: 'image_id',
  justOne: true
})

mongoose.pluralize(null)
const model = mongoose.model('Senior', seniorSchema)

module.exports = model
