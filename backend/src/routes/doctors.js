const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllDoctors, getDoctor, updateDoctorProfile, updateAvailability,
  getDoctorStats, approveDoctor, adminGetAllDoctors,
} = require('../controllers/doctorController');

router.get('/', getAllDoctors);
router.get('/admin/all', protect, authorize('admin'), adminGetAllDoctors);
router.get('/stats', protect, authorize('doctor'), getDoctorStats);
router.get('/:id', getDoctor);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);
router.put('/:id/approve', protect, authorize('admin'), approveDoctor);

module.exports = router;
