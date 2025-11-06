# Build Barguna Co-operative Admin System Setup Guide

This guide will walk you through setting up the complete admin system and login functionality for your co-operative website.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Database Configuration](#database-configuration)
4. [Email Service Setup](#email-service-setup)
5. [Creating Admin Users](#creating-admin-users)
6. [Testing the System](#testing-the-system)
7. [Deployment Considerations](#deployment-considerations)
8. [Troubleshooting](#troubleshooting)
9. [Security Best Practices](#security-best-practices)

## 🔧 Prerequisites

Before setting up the admin system, ensure you have:

- ✅ Next.js 16+ application running
- ✅ PostgreSQL database set up
- ✅ Prisma configured and migrations run
- ✅ SMTP email service (Gmail, SendGrid, etc.)
- ✅ Environment variables file (`.env.local`)

## 🌍 Environment Variables Setup

Create or update your `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/buildbarguna"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Email Service (Example with Gmail)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@buildbarguna.coop"

# For production, also add:
# NEXTAUTH_URL="https://yourdomain.com"
```

### 🔑 Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

## 🗄️ Database Configuration

### 1. Run Prisma Migrations

```bash
npx prisma migrate dev --name init
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Verify Database Schema

Check that these tables exist in your database:
- `User` (with `role` field: ADMIN, EDITOR, MEMBER)
- `Account` (NextAuth accounts)
- `Session` (NextAuth sessions)
- `VerificationToken` (NextAuth email verification)

## 📧 Email Service Setup

### Option 1: Gmail Setup (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use App Password** in `EMAIL_SERVER_PASSWORD`

### Option 2: SendGrid Setup (Recommended for production)

1. **Create SendGrid Account**: https://sendgrid.com/
2. **Get API Key**: Settings → API Keys → Create API Key
3. **Configure Environment Variables**:

```env
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

### Option 3: Other SMTP Providers

| Provider | Host | Port |
|----------|------|------|
| Outlook/Hotmail | smtp-mail.outlook.com | 587 |
| Yahoo | smtp.mail.yahoo.com | 587 |
| Mailgun | smtp.mailgun.org | 587 |

## 👥 Creating Admin Users

### Method 1: Using Prisma Studio (Easiest)

1. **Open Prisma Studio**:
```bash
npx prisma studio
```

2. **Navigate to User table**
3. **Add new record**:
   - `email`: your-admin@email.com
   - `name`: Your Name
   - `role`: ADMIN
   - `emailVerified`: current timestamp

### Method 2: Using Database Query

```sql
INSERT INTO "User" (id, email, name, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin-user-id',
  'admin@buildbarguna.coop',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);
```

### Method 3: Using Prisma Seed Script

Create `prisma/seed-admin.ts`:

```typescript
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@buildbarguna.coop' },
    update: {},
    create: {
      email: 'admin@buildbarguna.coop',
      name: 'System Administrator',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  // Create editor user
  await prisma.user.upsert({
    where: { email: 'editor@buildbarguna.coop' },
    update: {},
    create: {
      email: 'editor@buildbarguna.coop',
      name: 'Content Editor',
      role: UserRole.EDITOR,
      emailVerified: new Date(),
    },
  });

  console.log('Admin users created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run the seed:
```bash
npx tsx prisma/seed-admin.ts
```

## 🧪 Testing the System

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Authentication Flow

1. **Navigate to Admin**: http://localhost:3000/admin
2. **Should redirect to**: http://localhost:3000/auth/signin
3. **Enter admin email** and click "Send Magic Link"
4. **Check email inbox** for magic link
5. **Click magic link** → Should redirect to admin dashboard

### 3. Verify Admin Access

- ✅ Admin dashboard loads with statistics
- ✅ Sidebar navigation works
- ✅ User can navigate between admin sections
- ✅ Sign out functionality works
- ✅ Non-admin users are redirected

### 4. Test Magic Link Email

Example email content should look like:
```
Subject: Sign in to Build Barguna Co-operative

Click here to sign in to your account:
[MAGIC LINK BUTTON]

If you didn't request this email, you can safely ignore it.
```

## 🚀 Deployment Considerations

### Vercel Deployment

1. **Add Environment Variables** in Vercel dashboard:
   - All the variables from your `.env.local`
   - Update `NEXTAUTH_URL` to your production URL

2. **Database Setup**:
   - Use hosted PostgreSQL (Vercel Postgres, Supabase, etc.)
   - Update `DATABASE_URL` accordingly

3. **Email Service**:
   - Use production email service (SendGrid recommended)
   - Configure proper `EMAIL_FROM` domain

### Other Platforms

- **Netlify**: Similar environment variable setup
- **Railway**: Built-in PostgreSQL available
- **DigitalOcean**: App Platform with managed databases

## 🔍 Troubleshooting

### Common Issues

#### 1. Magic Link Not Working
```
Error: NEXT_AUTH_URL environment variable is not set
```
**Solution**: Set `NEXTAUTH_URL` in environment variables

#### 2. Email Not Sending
```
Error: Invalid login: 535 Authentication failed
```
**Solutions**:
- Check email credentials
- Enable "Less secure app access" for Gmail
- Use App Password instead of regular password
- Verify SMTP settings

#### 3. Database Connection Issues
```
Error: Can't reach database server
```
**Solutions**:
- Verify `DATABASE_URL` format
- Check database server is running
- Ensure firewall allows connections
- Run `npx prisma db push` to sync schema

#### 4. Admin Access Denied
```
User redirected to homepage instead of admin
```
**Solutions**:
- Verify user role is `ADMIN` or `EDITOR`
- Check `emailVerified` is set in database
- Clear browser cookies and try again

### Debug Mode

Enable debug logging by adding to `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

Check browser console and server logs for detailed error messages.

## 🛡️ Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files to version control
- ✅ Use different secrets for production and development
- ✅ Rotate secrets regularly
- ✅ Use strong, random passwords

### 2. Email Security
- ✅ Use App Passwords instead of account passwords
- ✅ Enable 2FA on email accounts
- ✅ Use dedicated email service for production
- ✅ Monitor email sending quotas

### 3. Database Security
- ✅ Use connection pooling
- ✅ Enable SSL/TLS for database connections
- ✅ Regular database backups
- ✅ Limit database user permissions

### 4. Admin Access
- ✅ Regularly audit admin users
- ✅ Remove inactive admin accounts
- ✅ Use principle of least privilege
- ✅ Monitor admin activity logs

## 📞 Support and Maintenance

### Regular Tasks

1. **Monthly**: Review admin user list
2. **Quarterly**: Rotate secrets and passwords
3. **As needed**: Update email templates
4. **Monitor**: Email delivery rates and errors

### Getting Help

- **Technical Issues**: Check Next.js and NextAuth documentation
- **Email Problems**: Contact your email service provider
- **Database Issues**: Check Prisma documentation
- **General Support**: Create detailed issue reports with logs

## 🎯 Success Checklist

Before going live, ensure:

- [ ] Environment variables are set correctly
- [ ] Database is migrated and accessible
- [ ] Email service is working and tested
- [ ] At least one admin user exists
- [ ] Magic link authentication flow works
- [ ] Admin dashboard loads and displays data
- [ ] User roles are properly enforced
- [ ] Sign out functionality works
- [ ] Production environment variables are configured
- [ ] Backup and monitoring systems are in place

---

## 🆘 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma migrate dev
npx prisma generate

# 3. Create admin user (using Prisma Studio)
npx prisma studio

# 4. Start development server
npm run dev

# 5. Test admin access
# Navigate to: http://localhost:3000/admin
```

---

**🎉 Congratulations!** Your admin system is now ready for production use. The system provides secure, role-based access to manage your co-operative's digital operations efficiently.

For additional features or customizations, refer to the component files in `/src/components/admin/` and `/src/app/[locale]/admin/`.