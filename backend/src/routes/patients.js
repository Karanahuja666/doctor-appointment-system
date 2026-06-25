const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getPatientProfile, updatePatientProfile, getMedicalHistory, addMedicalRecord } = require('../controllers/patientController');

router.get('/profile', protect, authorize('patient'), getPatientProfile);
router.put('/profile', protect, authorize('patient'), updatePatientProfile);
router.get('/medical-history', protect, authorize('patient'), getMedicalHistory);
router.get('/:patientId/medical-history', protect, authorize('doctor', 'admin'), getMedicalHistory);
router.post('/:patientId/medical-record', protect, authorize('doctor'), addMedicalRecord);

module.exports = router;
