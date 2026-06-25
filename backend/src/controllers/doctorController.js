const Doctor = require('../models/Doctor');
const User = require('../models/User');

exports.getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, department, search, minFee, maxFee, rating, experience, page = 1, limit = 12 } = req.query;
    const query = { isApproved: true };

    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (department) query.department = department;
    if (minFee || maxFee) {
      query.fees = {};
      if (minFee) query.fees.$gte = parseInt(minFee);
      if (maxFee) query.fees.$lte = parseInt(maxFee);
    }
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (experience) query.experience = { $gte: parseInt(experience) };

    let doctors = Doctor.find(query)
      .populate('user', 'name email avatar phone gender')
      .populate('department', 'name')
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (search) {
      const users = await User.find({ name: new RegExp(search, 'i'), role: 'doctor' }).select('_id');
      const userIds = users.map((u) => u._id);
      query.$or = [{ user: { $in: userIds } }, { specialization: new RegExp(search, 'i') }];
      doctors = Doctor.find(query)
        .populate('user', 'name email avatar phone gender')
        .populate('department', 'name')
        .sort({ rating: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }

    const result = await doctors;
    const total = await Doctor.countDocuments(query);

    res.status(200).json({ success: true, data: result, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email avatar phone gender address')
      .populate('department', 'name description');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

exports.updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const allowedFields = ['specialization', 'qualification', 'experience', 'fees', 'bio', 'languages', 'availability', 'consultationType', 'clinicAddress'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) doctor[field] = req.body[field];
    });

    await doctor.save();
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    doctor.availability = req.body.availability;
    await doctor.save();
    res.status(200).json({ success: true, data: doctor.availability });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorStats = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const Appointment = require('../models/Appointment');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalAppointments, todayAppointments, pendingAppointments, completedAppointments] = await Promise.all([
      Appointment.countDocuments({ doctor: doctor._id }),
      Appointment.countDocuments({ doctor: doctor._id, date: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'pending' }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'completed' }),
    ]);

    res.status(200).json({
      success: true,
      data: { totalAppointments, todayAppointments, pendingAppointments, completedAppointments, rating: doctor.rating, totalReviews: doctor.totalReviews, totalPatients: doctor.totalPatients },
    });
  } catch (error) {
    next(error);
  }
};

// Admin
exports.approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true }).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

exports.adminGetAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email phone isActive')
      .populate('department', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
};
