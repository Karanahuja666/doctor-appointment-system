const Review = require('../models/Review');
const Doctor = require('../models/Doctor');

exports.createReview = async (req, res, next) => {
  try {
    const { doctorId, rating, comment, appointmentId } = req.body;

    const existing = await Review.findOne({ patient: req.user.id, doctor: doctorId });
    if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this doctor' });

    const review = await Review.create({
      patient: req.user.id,
      doctor: doctorId,
      appointment: appointmentId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId, isApproved: true })
      .populate('patient', 'name avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
