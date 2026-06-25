const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    method: {
      type: String,
      enum: ['stripe', 'razorpay', 'paypal', 'cash'],
      required: true,
    },
    transactionId: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    invoiceNumber: { type: String, unique: true },
    invoiceUrl: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

paymentSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
