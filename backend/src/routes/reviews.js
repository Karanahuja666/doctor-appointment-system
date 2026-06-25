const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createReview, getDoctorReviews } = require('../controllers/reviewController');

router.post('/', protect, authorize('patient'), createReview);
router.get('/doctor/:doctorId', getDoctorReviews);

module.exports = router;
