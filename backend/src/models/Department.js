const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, maxlength: 500 },
    icon: String,
    image: String,
    isActive: { type: Boolean, default: true },
    headDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
