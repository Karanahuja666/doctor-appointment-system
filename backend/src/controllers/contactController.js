const Contact = require('../models/Contact');

exports.submitContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
  } catch (error) {
    next(error);
  }
};
