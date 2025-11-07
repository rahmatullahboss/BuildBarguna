# 📧 Email Setup Guide - Fix "Error sending email"

## ❌ Current Issue
Getting "Error sending email. Please try again" when trying to sign in.

## 🔍 This usually means:
1. **Gmail App Password not set up correctly**
2. **Wrong email credentials in .env.local**
3. **SMTP settings incorrect**
4. **Gmail security blocking the connection**

## ✅ Step-by-Step Solution

### STEP 1: Verify Your Gmail Setup

#### A. Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process

#### B. Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" from dropdown
3. Click "Generate"
4. **Copy the 16-character password** (something like: `abcd efgh ijkl mnop`)

### STEP 2: Update .env.local with Correct Values

Replace these in your `.env.local` file:

```env
# Your actual Gmail address
EMAIL_SERVER_USER="your-actual-email@gmail.com"

# The 16-character app password (NOT your regular Gmail password)
EMAIL_SERVER_PASSWORD="abcd efgh ijkl mnop"

# Can be any email address
EMAIL_FROM="noreply@buildbarguna.coop"

# These should stay the same for Gmail
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
```

### STEP 3: Alternative Email Providers

If Gmail doesn't work, try these alternatives:

#### Option A: Outlook/Hotmail
```env
EMAIL_SERVER_HOST="smtp-mail.outlook.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@outlook.com"
EMAIL_SERVER_PASSWORD="your-outlook-password"
EMAIL_FROM="noreply@yourdomain.com"
```

#### Option B: Yahoo Mail
```env
EMAIL_SERVER_HOST="smtp.mail.yahoo.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@yahoo.com"
EMAIL_SERVER_PASSWORD="your-yahoo-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

#### Option C: SendGrid (Most Reliable)
1. Sign up at https://sendgrid.com/
2. Create API key
3. Use these settings:

```env
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

### STEP 4: Test Email Configuration

Create this test file to verify email works:

```javascript
// test-email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

transporter.sendMail({
  from: 'noreply@buildbarguna.coop',
  to: 'your-email@gmail.com',
  subject: 'Test Email',
  text: 'If you receive this, email is working!'
}, (error, info) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
```

Run: `node test-email.js`

### STEP 5: Common Error Fixes

#### Error: "Invalid login: 535 Authentication failed"
**Fix:** Use Gmail App Password, not regular password

#### Error: "Connection timeout"
**Fix:** Check if antivirus/firewall is blocking port 587

#### Error: "Less secure app access"
**Fix:** Use App Password instead of enabling less secure apps

#### Error: "Daily sending quota exceeded"
**Fix:** Gmail has sending limits, try SendGrid for production

### STEP 6: Restart and Test

1. **Save .env.local** with correct credentials
2. **Restart development server:**
   ```bash
   npm run dev
   ```
3. **Test sign in** at http://localhost:3000/admin
4. **Check browser console** for detailed error messages

### STEP 7: Debug Commands

```bash
# Check if environment variables are loaded
node -e "console.log({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  user: process.env.EMAIL_SERVER_USER,
  from: process.env.EMAIL_FROM
})"

# Test SMTP connection
npm install nodemailer
node test-email.js
```

## 🚨 Security Checklist

- ✅ Use App Passwords, not regular passwords
- ✅ Enable 2-Factor Authentication
- ✅ Don't commit .env.local to git
- ✅ Use different credentials for production
- ✅ Monitor email sending quotas

## 📋 Gmail App Password Checklist

- [ ] 2FA enabled on Gmail account
- [ ] App password generated (16 characters)
- [ ] App password added to EMAIL_SERVER_PASSWORD
- [ ] Actual Gmail address in EMAIL_SERVER_USER
- [ ] Development server restarted
- [ ] Test email sent successfully

## ✅ Success Indicators

You'll know it's working when:
1. ✅ No "Error sending email" message
2. ✅ See "Check your email for the magic link!"
3. ✅ Email arrives within 1-2 minutes
4. ✅ Magic link works when clicked

---

**Most Common Fix:** Replace EMAIL_SERVER_PASSWORD with your Gmail App Password (the 16-character code from Google, not your regular Gmail password).