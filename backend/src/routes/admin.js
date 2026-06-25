const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats, getAllUsers, updateUserStatus, deleteUser,
  createDepartment, getDepartments, updateDepartment, deleteDepartment,
  getAllReviews, updateReviewStatus, deleteReview,
  getContactMessages, replyToContact,
  getSettings, updateSettings,
} = require('../controllers/adminController');

const adminOnly = [protect, authorize('admin')];

router.get('/dashboard', ...adminOnly, getDashboardStats);
router.get('/users', ...adminOnly, getAllUsers);
router.put('/users/:id/status', ...adminOnly, updateUserStatus);
router.delete('/users/:id', ...adminOnly, deleteUser);
router.post('/departments', ...adminOnly, createDepartment);
router.get('/departments', getDepartments);
router.put('/departments/:id', ...adminOnly, updateDepartment);
router.delete('/departments/:id', ...adminOnly, deleteDepartment);
router.get('/reviews', ...adminOnly, getAllReviews);
router.put('/reviews/:id', ...adminOnly, updateReviewStatus);
router.delete('/reviews/:id', ...adminOnly, deleteReview);
router.get('/contacts', ...adminOnly, getContactMessages);
router.put('/contacts/:id/reply', ...adminOnly, replyToContact);
router.get('/settings', ...adminOnly, getSettings);
router.put('/settings', ...adminOnly, updateSettings);

module.exports = router;
