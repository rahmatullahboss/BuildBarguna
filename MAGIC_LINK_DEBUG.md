# Magic Link Debug Guide

## 🔍 Common Issues and Solutions

### 1. Environment Variables Check

Make sure you have these in your `.env.local` file:

```env
# Required for NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Email Configuration (example with Gmail)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@buildbarguna.coop"
```

### 2. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

### 3. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Use this app password (not your regular password) in `EMAIL_SERVER_PASSWORD`

### 4. Database User Setup

Make sure you have a user in your database with ADMIN role:

```sql
INSERT INTO "User" (id, email, name, role, "emailVerified") 
VALUES (
  'admin-1', 
  'admin@buildbarguna.coop', 
  'Admin User', 
  'ADMIN', 
  NOW()
);
```

### 5. Check Magic Link URL

When you receive the email, the magic link should look like:
```
http://localhost:3000/api/auth/callback/email?token=xxx&email=xxx
```

### 6. Common Fixes

#### Issue: "Link redirects back to sign-in"
**Solutions:**
- Check NEXTAUTH_URL matches your current URL
- Verify NEXTAUTH_SECRET is set
- Ensure database connection is working
- Check if user exists in database

#### Issue: "Email not sending"
**Solutions:**
- Verify email credentials
- Check Gmail app password (not regular password)
- Test SMTP settings
- Check firewall/antivirus blocking SMTP

#### Issue: "Invalid token"
**Solutions:**
- Magic links expire after 24 hours
- Each link can only be used once
- Generate a new link
- Check system clock is correct

### 7. Debug Steps

1. **Check Environment Variables:**
```bash
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET
echo $EMAIL_SERVER_HOST
```

2. **Check Database Connection:**
```bash
npx prisma studio
```

3. **Check Email in Database:**
Look for your email in the `User` table with correct `role` and `emailVerified` fields.

4. **Test Magic Link Manually:**
- Copy the link from your email
- Check if it starts with correct domain
- Try opening in incognito/private window

### 8. Development vs Production

**Development (localhost:3000):**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```env
NEXTAUTH_URL="https://yourdomain.com"
```

### 9. Debugging Commands

```bash
# Start with debug mode
NEXTAUTH_DEBUG=true npm run dev

# Check Prisma connection
npx prisma db push

# Generate new Prisma client
npx prisma generate

# Reset database (CAUTION: This deletes data)
npx prisma migrate reset
```

### 10. Error Messages and Solutions

| Error | Solution |
|-------|----------|
| "Configuration error" | Check environment variables |
| "Email not verified" | Set `emailVerified` in database |
| "Access denied" | Check user role in database |
| "Invalid token" | Request new magic link |
| "SMTP error" | Verify email server settings |

### 11. Test Email Template

The magic link email should contain:
- Clear subject line
- Magic link button/URL
- Sender should match EMAIL_FROM
- Link should go to `/api/auth/callback/email`

### 12. Quick Fix Checklist

- [ ] Environment variables are set correctly
- [ ] NEXTAUTH_SECRET is generated and set
- [ ] Gmail app password is used (not regular password)
- [ ] User exists in database with ADMIN role
- [ ] Database connection is working
- [ ] Magic link URL starts with correct domain
- [ ] Email is not in spam folder
- [ ] Browser cookies are enabled
- [ ] Using correct port (3000 for development)