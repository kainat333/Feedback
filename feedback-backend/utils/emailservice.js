// utils/emailService.js
const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp, name = "User") => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code - Verify Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Verify Your Email</h2>
          </div>
          
          <p style="color: #666; font-size: 16px;">Hello ${name},</p>
          
          <p style="color: #666; font-size: 16px;">Use the following OTP to complete your registration:</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; text-align: center; font-size: 32px; letter-spacing: 8px; margin: 25px 0; border-radius: 8px; font-weight: bold;">
            ${otp}
          </div>
          
          <p style="color: #666; font-size: 14px;">This OTP will expire in <strong>5 minutes</strong>.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendOTPEmail };
