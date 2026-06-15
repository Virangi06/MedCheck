const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html = null, attachments = []) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"MedCheck" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      ...(html && { html }),
      attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);

  } catch (error) {
    console.log('❌ Email Error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;