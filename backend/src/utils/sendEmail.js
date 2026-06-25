const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

const sendAppointmentConfirmation = async (patient, doctor, appointment) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">MediBook</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Appointment Confirmation</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
        <p>Dear <strong>${patient.name}</strong>,</p>
        <p>Your appointment has been confirmed!</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> ${appointment.timeSlot.start} - ${appointment.timeSlot.end}</p>
          <p><strong>Type:</strong> ${appointment.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you need to reschedule or cancel, please do so at least 24 hours before your appointment.</p>
      </div>
    </div>
  `;
  await sendEmail({ to: patient.email, subject: 'Appointment Confirmed - MediBook', html });
};

const sendAppointmentReminder = async (patient, doctor, appointment) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">MediBook</h1>
        <p style="color: rgba(255,255,255,0.9);">Appointment Reminder</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
        <p>Dear <strong>${patient.name}</strong>,</p>
        <p>This is a reminder for your upcoming appointment tomorrow.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.timeSlot.start} - ${appointment.timeSlot.end}</p>
        </div>
      </div>
    </div>
  `;
  await sendEmail({ to: patient.email, subject: 'Appointment Reminder - MediBook', html });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">MediBook</h1>
        <p style="color: rgba(255,255,255,0.9);">Password Reset</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #0ea5e9; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">This link expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    </div>
  `;
  await sendEmail({ to: user.email, subject: 'Password Reset - MediBook', html });
};

module.exports = { sendEmail, sendAppointmentConfirmation, sendAppointmentReminder, sendPasswordResetEmail };
