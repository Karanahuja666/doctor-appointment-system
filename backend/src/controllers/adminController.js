const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const Department = require('../models/Department');
const Settings = require('../models/Settings');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalDoctors, totalPatients, totalAppointments, totalRevenue, pendingAppointments, todayAppointments, recentAppointments, monthlyRevenue] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({
        date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)), $lt: new Date(new Date().setHours(23, 59, 59, 999)) },
      }),
      Appointment.find().populate('patient', 'name').populate({ path: 'doctor', populate: { path: 'user', select: 'name' } }).sort({ createdAt: -1 }).limit(10),
      Payment.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
        { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingAppointments,
        todayAppointments,
        recentAppointments,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await User.countDocuments(query);
    res.status(200).json({ success: true, data: users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'doctor') await Doctor.findOneAndDelete({ user: user._id });
    if (user.role === 'patient') await Patient.findOneAndDelete({ user: user._id });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// Departments
exports.createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate({ path: 'headDoctor', populate: { path: 'user', select: 'name' } }).sort({ name: 1 });
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
};

// Reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('patient', 'name avatar')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.updateReviewStatus = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await Review.findByIdAndDelete(req.params.id);
      await Review.calcAverageRating(review.doctor);
    }
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

// Contact Messages
exports.getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.replyToContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'replied', reply: req.body.reply, repliedAt: Date.now(), repliedBy: req.user.id },
      { new: true }
    );
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// Settings
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create(req.body);
    else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
