const crypto = require('crypto');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { sendPasswordResetEmail } = require('../utils/sendEmail');

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, gender, dateOfBirth } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role: role === 'doctor' ? 'doctor' : 'patient', phone, gender, dateOfBirth });

    if (user.role === 'patient') {
      await Patient.create({ user: user._id });
    } else if (user.role === 'doctor') {
      const { specialization, qualification, experience, fees } = req.body;
      await Doctor.create({ user: user._id, specialization, qualification, experience, fees });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;
    if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: user._id }).populate('department');
    } else if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user._id });
    }
    res.status(200).json({ success: true, data: { user, profile } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, gender, dateOfBirth, address, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, gender, dateOfBirth, address, avatar },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user with that email' });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    try {
      await sendPasswordResetEmail(user, resetUrl);
      res.status(200).json({ success: true, message: 'Password reset email sent' });
    } catch {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user.notifications.sort((a, b) => b.createdAt - a.createdAt) });
  } catch (error) {
    next(error);
  }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user.id, 'notifications._id': req.params.id },
      { $set: { 'notifications.$.read': true } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
