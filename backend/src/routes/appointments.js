const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createAppointment, getMyAppointments, getDoctorAppointments,
  getAppointment, updateAppointmentStatus, rescheduleAppointment,
  addPrescription, checkSlotAvailability, getAllAppointments,
} = require('../controllers/appointmentController');

router.get('/slots', protect, checkSlotAvailability);
router.get('/my', protect, authorize('patient'), getMyAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/all', protect, authorize('admin'), getAllAppointments);
router.post('/', protect, authorize('patient'), createAppointment);
router.get('/:id', protect, getAppointment);
router.put('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);
router.put('/:id/reschedule', protect, rescheduleAppointment);
router.put('/:id/prescription', protect, authorize('doctor'), addPrescription);

module.exports = router;
