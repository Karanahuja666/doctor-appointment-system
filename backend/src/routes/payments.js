const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createStripePayment, confirmStripePayment, createRazorpayOrder,
  verifyRazorpayPayment, getPaymentHistory, getInvoice, refundPayment,
} = require('../controllers/paymentController');

router.post('/stripe', protect, authorize('patient'), createStripePayment);
router.put('/stripe/:paymentId/confirm', protect, confirmStripePayment);
router.post('/razorpay', protect, authorize('patient'), createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/invoice/:id', protect, getInvoice);
router.put('/:id/refund', protect, authorize('admin'), refundPayment);

module.exports = router;
