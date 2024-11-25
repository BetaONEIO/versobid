const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Send notification email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'hello@versobid.com',
      subject: 'New VersoBid Waitlist Signup',
      text: `New signup for VersoBid waitlist: ${email}`,
      html: `
        <h2>New Waitlist Signup</h2>
        <p>Email: ${email}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to VersoBid Waitlist',
      html: `
        <h2>Welcome to VersoBid!</h2>
        <p>Thank you for joining our waitlist. We'll keep you updated on our launch and exciting developments.</p>
        <p>Best regards,<br>The VersoBid Team</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Signup successful' }),
    };
  } catch (error) {
    console.error('Notification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process signup' }),
    };
  }
};

module.exports = { handler };