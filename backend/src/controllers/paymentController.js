const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.createStripePayment = async (req, res, next) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const doctor = await Doctor.findById(appointment.doctor);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(doctor.fees * 100),
      currency: 'usd',
      metadata: { appointmentId: appointment._id.toString(), patientId: req.user.id },
    });

    const payment = await Payment.create({
      appointment: appointment._id,
      patient: req.user.id,
      doctor: doctor._id,
      amount: doctor.fees,
      method: 'stripe',
      transactionId: paymentIntent.id,
      status: 'pending',
    });

    appointment.payment = payment._id;
    await appointment.save();

    res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret, paymentId: payment._id });
  } catch (error) {
    next(error);
  }
};

exports.confirmStripePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    payment.status = 'completed';
    payment.paidAt = Date.now();
    await payment.save();

    await Appointment.findByIdAndUpdate(payment.appointment, { status: 'confirmed' });

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const Razorpay = require('razorpay');
    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const doctor = await Doctor.findById(appointment.doctor);

    const order = await instance.orders.create({
      amount: Math.round(doctor.fees * 100),
      currency: 'INR',
      receipt: `receipt_${appointment._id}`,
    });

    const payment = await Payment.create({
      appointment: appointment._id,
      patient: req.user.id,
      doctor: doctor._id,
      amount: doctor.fees,
      method: 'razorpay',
      transactionId: order.id,
      status: 'pending',
    });

    appointment.payment = payment._id;
    await appointment.save();

    res.status(200).json({ success: true, orderId: order.id, paymentId: payment._id, amount: order.amount, currency: order.currency });
  } catch (error) {
    next(error);
  }
};

exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const payment = await Payment.findOne({ transactionId: razorpay_order_id });
    if (payment) {
      payment.status = 'completed';
      payment.paidAt = Date.now();
      payment.metadata = { razorpay_payment_id, razorpay_signature };
      await payment.save();
      await Appointment.findByIdAndUpdate(payment.appointment, { status: 'confirmed' });
    }

    res.status(200).json({ success: true, message: 'Payment verified' });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  try {
    const query = req.user.role === 'patient' ? { patient: req.user.id } : {};
    const payments = await Payment.find(query)
      .populate('appointment', 'date timeSlot status')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointment')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
      .populate('patient', 'name email phone address');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

exports.refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    if (payment.method === 'stripe') {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      await stripe.refunds.create({ payment_intent: payment.transactionId });
    }

    payment.status = 'refunded';
    payment.refundedAt = Date.now();
    payment.refundAmount = payment.amount;
    await payment.save();

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
