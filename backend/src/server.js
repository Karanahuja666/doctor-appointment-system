const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests, please try again later' });
app.use('/api', limiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'MediBook API is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const autoSeed = async () => {
  const User = require('./models/User');
  const count = await User.countDocuments();
  if (count === 0) {
    console.log('Empty database detected. Auto-seeding demo data...');
    const Doctor = require('./models/Doctor');
    const Patient = require('./models/Patient');
    const Department = require('./models/Department');
    const Settings = require('./models/Settings');

    const rawPassword = 'password123';

    await User.create({ name: 'Admin User', email: 'admin@medibook.com', password: rawPassword, role: 'admin', isVerified: true });

    const departments = await Department.insertMany([
      { name: 'Cardiology', description: 'Heart and cardiovascular system specialists', icon: '❤️' },
      { name: 'Neurology', description: 'Brain and nervous system specialists', icon: '🧠' },
      { name: 'Orthopedics', description: 'Bone, joint, and muscle specialists', icon: '🦴' },
      { name: 'Dermatology', description: 'Skin care and treatment specialists', icon: '🧬' },
      { name: 'Pediatrics', description: 'Child healthcare specialists', icon: '👶' },
      { name: 'Ophthalmology', description: 'Eye care specialists', icon: '👁️' },
      { name: 'Dentistry', description: 'Dental and oral health specialists', icon: '🦷' },
      { name: 'General Medicine', description: 'General health and wellness', icon: '🩺' },
    ]);

    const defaultSlots = [
      { start: '09:00', end: '09:30' }, { start: '09:30', end: '10:00' },
      { start: '10:00', end: '10:30' }, { start: '10:30', end: '11:00' },
      { start: '11:00', end: '11:30' }, { start: '11:30', end: '12:00' },
      { start: '14:00', end: '14:30' }, { start: '14:30', end: '15:00' },
      { start: '15:00', end: '15:30' }, { start: '15:30', end: '16:00' },
      { start: '16:00', end: '16:30' }, { start: '16:30', end: '17:00' },
    ];
    const defaultAvailability = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => ({ day, isAvailable: true, slots: defaultSlots }));

    const doctorsData = [
      { name: 'Dr. Sarah Johnson', email: 'sarah@medibook.com', spec: 'Cardiologist', qual: 'MD, DM Cardiology', exp: 15, fees: 200, dept: 0 },
      { name: 'Dr. Michael Chen', email: 'michael@medibook.com', spec: 'Neurologist', qual: 'MD, DM Neurology', exp: 12, fees: 180, dept: 1 },
      { name: 'Dr. Emily Williams', email: 'emily@medibook.com', spec: 'Orthopedic Surgeon', qual: 'MS Orthopedics', exp: 10, fees: 150, dept: 2 },
      { name: 'Dr. James Wilson', email: 'james@medibook.com', spec: 'Dermatologist', qual: 'MD Dermatology', exp: 8, fees: 120, dept: 3 },
      { name: 'Dr. Lisa Anderson', email: 'lisa@medibook.com', spec: 'Pediatrician', qual: 'MD Pediatrics', exp: 14, fees: 130, dept: 4 },
      { name: 'Dr. Robert Taylor', email: 'robert@medibook.com', spec: 'Ophthalmologist', qual: 'MS Ophthalmology', exp: 11, fees: 160, dept: 5 },
    ];

    for (const d of doctorsData) {
      const user = await User.create({ name: d.name, email: d.email, password: rawPassword, role: 'doctor', isVerified: true, gender: 'male' });
      await Doctor.create({
        user: user._id, specialization: d.spec, department: departments[d.dept]._id,
        qualification: d.qual, experience: d.exp, fees: d.fees,
        bio: `Experienced ${d.spec.toLowerCase()} with ${d.exp} years of clinical practice.`,
        languages: ['English'], availability: defaultAvailability, isApproved: true,
        consultationType: ['in-person', 'video'],
        rating: Math.round((4 + Math.random()) * 10) / 10,
        totalReviews: Math.floor(Math.random() * 50) + 10,
      });
    }

    const patientUser = await User.create({ name: 'John Doe', email: 'patient@medibook.com', password: rawPassword, role: 'patient', isVerified: true });
    await Patient.create({ user: patientUser._id, bloodGroup: 'O+' });
    await Settings.create({});

    console.log('Demo data seeded successfully!');
    console.log('Admin: admin@medibook.com / password123');
    console.log('Doctor: sarah@medibook.com / password123');
    console.log('Patient: patient@medibook.com / password123');
  }
};

const start = async () => {
  await connectDB();
  await autoSeed();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();

module.exports = app;
