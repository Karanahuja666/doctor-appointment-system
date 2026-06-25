const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ patient: 1, doctor: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (doctorId) {
  const result = await this.aggregate([
    { $match: { doctor: doctorId, isApproved: true } },
    { $group: { _id: '$doctor', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const Doctor = require('./Doctor');
  if (result.length > 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      rating: Math.round(result[0].avgRating * 10) / 10,
      totalReviews: result[0].count,
    });
  } else {
    await Doctor.findByIdAndUpdate(doctorId, { rating: 0, totalReviews: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.doctor);
});

module.exports = mongoose.model('Review', reviewSchema);
