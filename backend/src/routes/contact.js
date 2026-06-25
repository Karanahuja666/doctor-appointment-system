const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { submitContact } = require('../controllers/contactController');

router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('subject').trim().notEmpty(),
  body('message').trim().notEmpty().isLength({ max: 2000 }),
], validate, submitContact);

module.exports = router;
