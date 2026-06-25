const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true, maxlength: 2000 },
    status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
    reply: String,
    repliedAt: Date,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
