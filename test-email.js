// Email Configuration Test Script
// Run this to test if your email settings work: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Email Configuration...\n');

// Show current environment variables (hide password)
console.log('📧 Current Email Settings:');
console.log('HOST:', process.env.EMAIL_SERVER_HOST);
console.log('PORT:', process.env.EMAIL_SERVER_PORT);
console.log('USER:', process.env.EMAIL_SERVER_USER);
console.log('FROM:', process.env.EMAIL_FROM);
console.log('PASSWORD:', process.env.EMAIL_SERVER_PASSWORD ? '***SET***' : '❌ NOT SET');
console.log();

// Check if all required variables are set
const requiredVars = ['EMAIL_SERVER_HOST', 'EMAIL_SERVER_PORT', 'EMAIL_SERVER_USER', 'EMAIL_SERVER_PASSWORD', 'EMAIL_FROM'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing environment variables:', missingVars.join(', '));
  console.log('Please check your .env.local file\n');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Test email content
const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: process.env.EMAIL_SERVER_USER, // Send to yourself for testing
  subject: '✅ Build Barguna Email Test - Success!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0EA5A5;">🎉 Email Configuration Working!</h2>
      <p>If you're reading this, your email configuration is set up correctly for Build Barguna Co-operative.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📋 Configuration Details:</h3>
        <ul>
          <li><strong>Host:</strong> ${process.env.EMAIL_SERVER_HOST}</li>
          <li><strong>Port:</strong> ${process.env.EMAIL_SERVER_PORT}</li>
          <li><strong>From:</strong> ${process.env.EMAIL_FROM}</li>
          <li><strong>To:</strong> ${process.env.EMAIL_SERVER_USER}</li>
        </ul>
      </div>
      
      <p>✅ Your magic links should now work properly!</p>
      <p>Next steps:</p>
      <ol>
        <li>Go to <a href="http://localhost:3000/admin">http://localhost:3000/admin</a></li>
        <li>Enter your email address</li>
        <li>Check for magic link email</li>
        <li>Click the link to sign in</li>
      </ol>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 14px;">
        This is a test email from Build Barguna Co-operative admin system.
      </p>
    </div>
  `,
  text: `
✅ Email Configuration Working!

If you're reading this, your email configuration is set up correctly for Build Barguna Co-operative.

Configuration Details:
- Host: ${process.env.EMAIL_SERVER_HOST}
- Port: ${process.env.EMAIL_SERVER_PORT}
- From: ${process.env.EMAIL_FROM}
- To: ${process.env.EMAIL_SERVER_USER}

✅ Your magic links should now work properly!

Next steps:
1. Go to http://localhost:3000/admin
2. Enter your email address
3. Check for magic link email
4. Click the link to sign in
  `
};

// Send test email
console.log('📤 Sending test email...');
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Email sending failed:');
    console.log('Error:', error.message);
    console.log();
    
    // Common error solutions
    if (error.message.includes('535')) {
      console.log('💡 Solution: Use Gmail App Password, not regular password');
      console.log('   1. Go to https://myaccount.google.com/apppasswords');
      console.log('   2. Generate new app password');
      console.log('   3. Update EMAIL_SERVER_PASSWORD in .env.local');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Solution: Check firewall/antivirus settings');
      console.log('   - Allow port 587 for SMTP');
      console.log('   - Temporarily disable antivirus to test');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Solution: Check email credentials');
      console.log('   - Verify EMAIL_SERVER_USER is correct');
      console.log('   - Verify EMAIL_SERVER_PASSWORD is app password');
    }
  } else {
    console.log('✅ Email sent successfully!');
    console.log('📧 Check your inbox:', process.env.EMAIL_SERVER_USER);
    console.log('Message ID:', info.messageId);
    console.log();
    console.log('🎉 Your email configuration is working!');
    console.log('   Now try logging in at: http://localhost:3000/admin');
  }
});