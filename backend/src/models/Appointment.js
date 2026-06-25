const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: [true, 'Appointment date is required'] },
    timeSlot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled', 'no-show'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['in-person', 'video'],
      default: 'in-person',
    },
    reason: { type: String, required: [true, 'Reason for appointment is required'] },
    symptoms: [String],
    notes: String,
    prescription: {
      medicines: [
        {
          name: String,
          dosage: String,
          frequency: String,
          duration: String,
          instructions: String,
        },
      ],
      advice: String,
      followUpDate: Date,
    },
    consultationNotes: String,
    reports: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    meetingLink: String,
    cancelReason: String,
    cancelledBy: { type: String, enum: ['patient', 'doctor', 'admin', ''] },
    rescheduledFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  },
  { timestamps: true }
);

appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
