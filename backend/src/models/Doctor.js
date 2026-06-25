const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  isAvailable: { type: Boolean, default: true },
  slots: [timeSlotSchema],
});

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, required: [true, 'Specialization is required'] },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    qualification: { type: String, required: true },
    experience: { type: Number, required: [true, 'Experience is required'], min: 0 },
    fees: { type: Number, required: [true, 'Consultation fee is required'], min: 0 },
    bio: { type: String, maxlength: 1000 },
    languages: [String],
    availability: [availabilitySchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    consultationType: {
      type: [String],
      enum: ['in-person', 'video', 'both'],
      default: ['in-person'],
    },
    clinicAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    zoomMeetingLink: String,
    googleMeetLink: String,
  },
  { timestamps: true }
);

doctorSchema.index({ specialization: 'text', 'user.name': 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);
