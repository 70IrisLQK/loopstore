const nodemailer = require("nodemailer");

// Function to send OTP email
async function sendOTPEmail(receiverEmail, otp) {
  // Create a transporter object using SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use 'gmail' or configure your own SMTP
    auth: {
      user: process.env.MAILER_EMAIL, // Your email
      pass: process.env.MAILER_PASSWORD, // Your email password (use App Passwords for Gmail)
    },
  });

  // HTML template for the email
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          text-align: center;
          margin-bottom: 20px;
        }
        .otp {
          font-size: 36px;
          font-weight: bold;
          color: #007BFF;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          font-size: 14px;
          color: #666666;
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">Verify Your Email</div>
        <p>Hello,</p>
        <p>Thank you for signing up. Please use the following OTP to verify your email address:</p>
        <div class="otp">${otp}</div>
        <p>If you didn’t request this, please ignore this email.</p>
        <div class="footer">© 2024 Your Company. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;

  // Define email options
  const mailOptions = {
    from: '"loopstore" <your-email@gmail.com>', // Sender address
    to: receiverEmail, // Receiver email
    subject: otp, // Subject
    html: emailTemplate, // HTML body
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOTPEmail,
};
