const mongoose = require("mongoose")

const travelPlanSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  places: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    default: ""
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("TravelPlan", travelPlanSchema)