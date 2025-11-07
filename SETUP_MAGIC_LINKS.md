# 🔧 Magic Link Setup Guide - Fix Authentication Issue

## ❌ Current Problem
Magic links redirect back to sign-in page instead of logging you in successfully.

## ✅ Solution Steps

### STEP 1: Set Up Environment Variables

I've created `.env.local` file for you. Now follow these steps:

1. **Generate NEXTAUTH_SECRET** (Copy the output from the command above)
2. **Replace placeholder values** in `.env.local` with real credentials
3. **Set up Gmail App Password** (see instructions below)

### STEP 2: Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Copy the 16-character password
   - Use this in `EMAIL_SERVER_PASSWORD` (NOT your regular Gmail password)

### STEP 3: Update .env.local File

Replace these values in your `.env.local`:

```env
# Replace with your database URL
DATABASE_URL="your-actual-database-url"

# Replace with generated secret (from Step 1)
NEXTAUTH_SECRET="your-generated-secret-here"

# Replace with your Gmail credentials
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-16-character-app-password"
EMAIL_FROM="noreply@buildbarguna.coop"  # Can be any email
```

### STEP 4: Create Admin User in Database

Run these commands:

```bash
# Open Prisma Studio
npx prisma studio

# OR run this SQL in your database:
INSERT INTO "User" (id, email, name, role, "emailVerified", "createdAt", "updatedAt") 
VALUES (
  'admin-user-1',
  'your-email@gmail.com',  -- Use the same email you'll sign in with
  'Admin User',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);
```

### STEP 5: Test the Magic Link

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Try logging in**:
   - Go to http://localhost:3000/admin
   - Enter your email address
   - Check your email for magic link
   - Click the magic link

### STEP 6: Debug if Still Not Working

If magic link still doesn't work, check these:

1. **Check browser console** for errors
2. **Check server logs** for error messages
3. **Verify email content** - link should look like:
   ```
   http://localhost:3000/api/auth/callback/email?token=xxx&email=xxx
   ```

4. **Check database** - make sure user exists with correct email and ADMIN role

## 🔍 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Configuration error" | Check NEXTAUTH_SECRET is set |
| "SMTP Authentication failed" | Use Gmail App Password, not regular password |
| "Access denied" | Make sure user has ADMIN role in database |
| "Invalid token" | Generate new magic link (they expire after 24h) |
| "Redirects to sign-in" | Check NEXTAUTH_URL matches your current URL |

## 🚀 Quick Test Commands

```bash
# Check if environment variables are loaded
node -e "console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)"

# Test database connection
npx prisma db push

# Check if user exists
npx prisma studio
```

## 📧 Expected Email Content

Your magic link email should look like this:

```
Subject: Sign in to Build Barguna Co-operative

Sign in to Build Barguna Co-operative

[Sign in] <- This should be a clickable button/link

If you did not request this email you can safely ignore it.
```

## ✅ Success Indicators

You'll know it's working when:
1. ✅ Email arrives quickly (within 1-2 minutes)
2. ✅ Magic link takes you to admin dashboard
3. ✅ You see "Welcome back, [your-name]" in dashboard
4. ✅ Sidebar shows admin navigation options

## 🆘 If You're Still Stuck

1. **Check the debug guide**: `MAGIC_LINK_DEBUG.md`
2. **Enable debug mode**: Set `NEXTAUTH_DEBUG="true"` in `.env.local`
3. **Check browser network tab** for failed requests
4. **Verify all environment variables** are set correctly

---

**Remember**: Magic links are single-use and expire after 24 hours. If you need to test multiple times, request a new link each time.