const Patient = require('../models/Patient');

exports.getPatientProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate('user', 'name email phone avatar gender dateOfBirth address');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

exports.updatePatientProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOneAndUpdate({ user: req.user.id }, req.body, { new: true, runValidators: true, upsert: true });
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

exports.getMedicalHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.params.patientId || req.user.id })
      .populate({ path: 'medicalHistory.prescribedBy', populate: { path: 'user', select: 'name' } });
    res.status(200).json({ success: true, data: patient?.medicalHistory || [] });
  } catch (error) {
    next(error);
  }
};

exports.addMedicalRecord = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.params.patientId });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    patient.medicalHistory.push(req.body);
    await patient.save();
    res.status(201).json({ success: true, data: patient.medicalHistory });
  } catch (error) {
    next(error);
  }
};
