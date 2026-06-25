const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'MediBook' },
    tagline: { type: String, default: 'Your Health, Our Priority' },
    logo: String,
    email: String,
    phone: String,
    address: String,
    workingHours: { type: String, default: 'Mon-Sat: 8AM - 8PM' },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    appointmentSettings: {
      slotDuration: { type: Number, default: 30 },
      maxAdvanceBookingDays: { type: Number, default: 30 },
      cancellationHours: { type: Number, default: 24 },
      autoConfirm: { type: Boolean, default: false },
    },
    paymentSettings: {
      currency: { type: String, default: 'USD' },
      enableStripe: { type: Boolean, default: true },
      enableRazorpay: { type: Boolean, default: false },
      enablePaypal: { type: Boolean, default: false },
      enableCash: { type: Boolean, default: true },
    },
    emailTemplates: {
      appointmentConfirmation: String,
      appointmentReminder: String,
      passwordReset: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
