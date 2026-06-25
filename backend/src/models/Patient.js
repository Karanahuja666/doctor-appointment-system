const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  condition: String,
  diagnosis: String,
  treatment: String,
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  date: { type: Date, default: Date.now },
  notes: String,
  attachments: [String],
});

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
    height: Number,
    weight: Number,
    allergies: [String],
    chronicConditions: [String],
    currentMedications: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
    medicalHistory: [medicalRecordSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
