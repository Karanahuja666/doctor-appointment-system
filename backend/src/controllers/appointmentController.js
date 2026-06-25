const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { sendAppointmentConfirmation } = require('../utils/sendEmail');

exports.createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, type, reason, symptoms } = req.body;

    const doctor = await Doctor.findById(doctorId).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      'timeSlot.start': timeSlot.start,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      timeSlot,
      type: type || 'in-person',
      reason,
      symptoms,
    });

    const patient = await User.findById(req.user.id);
    await User.findByIdAndUpdate(req.user.id, {
      $push: { notifications: { message: `Appointment booked with Dr. ${doctor.user.name} on ${new Date(date).toLocaleDateString()}`, type: 'success' } },
    });

    try {
      await sendAppointmentConfirmation(patient, doctor.user, appointment);
    } catch { /* email failure is non-critical */ }

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.getMyAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { patient: req.user.id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email avatar' } })
      .populate('payment')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);
    res.status(200).json({ success: true, data: appointments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const { status, date, page = 1, limit = 10 } = req.query;
    const query = { doctor: doctor._id };
    if (status) query.status = status;
    if (date) query.date = { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) };

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar')
      .populate('payment')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);
    res.status(200).json({ success: true, data: appointments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email avatar phone' } })
      .populate('patient', 'name email phone avatar')
      .populate('payment');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, cancelReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.status = status;
    if (status === 'cancelled') {
      appointment.cancelReason = cancelReason;
      appointment.cancelledBy = req.user.role;
    }
    await appointment.save();

    const patient = await User.findById(appointment.patient);
    if (patient) {
      patient.notifications.push({
        message: `Your appointment has been ${status}`,
        type: status === 'confirmed' ? 'success' : status === 'cancelled' ? 'error' : 'info',
      });
      await patient.save();
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const { date, timeSlot } = req.body;
    const oldAppointment = await Appointment.findById(req.params.id);
    if (!oldAppointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    oldAppointment.status = 'rescheduled';
    await oldAppointment.save();

    const newAppointment = await Appointment.create({
      patient: oldAppointment.patient,
      doctor: oldAppointment.doctor,
      date,
      timeSlot,
      type: oldAppointment.type,
      reason: oldAppointment.reason,
      symptoms: oldAppointment.symptoms,
      rescheduledFrom: oldAppointment._id,
    });

    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    next(error);
  }
};

exports.addPrescription = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.prescription = req.body.prescription;
    appointment.consultationNotes = req.body.consultationNotes;
    appointment.status = 'completed';
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.checkSlotAvailability = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayAvailability = doctor.availability.find((a) => a.day === dayOfWeek);
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return res.status(200).json({ success: true, data: { available: false, slots: [] } });
    }

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) },
      status: { $in: ['pending', 'confirmed'] },
    });

    const bookedSlots = new Set(bookedAppointments.map((a) => a.timeSlot.start));
    const availableSlots = dayAvailability.slots
      .filter((slot) => !bookedSlots.has(slot.start))
      .map((slot) => ({ start: slot.start, end: slot.end, available: true }));

    res.status(200).json({ success: true, data: { available: true, slots: availableSlots } });
  } catch (error) {
    next(error);
  }
};

exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
      .populate('payment')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);
    res.status(200).json({ success: true, data: appointments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};
