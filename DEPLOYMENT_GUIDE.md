# 🚀 Build Barguna Initiative - Deployment Guide

> **Latest Update**: This guide covers deployment of **3 major new features**:
> - 📊 Live Business Projects + Share Purchase System
> - 💰 Monthly Dividends with Virtual Wallet
> - 🎯 Daily Social Media Tasks + Points System

---

## ✅ Pre-Deployment Checklist

### 1. Run Local Build Test
**Critical**: Always test the build locally before deploying to production.

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Build for production
npm run build

# If build succeeds, you're good to deploy!
```

> ⚠️ **Important**: The build must succeed with zero errors. If it fails locally, it will fail on Vercel.

### 2. Verify All Environment Variables Are Set
Ensure these are configured in your production environment:

```bash
# ===== REQUIRED: Database =====
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# ===== REQUIRED: Authentication =====
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="https://buildbarguna.org"

# ===== REQUIRED: Email (Resend) =====
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@buildbarguna.org"

# ===== REQUIRED: File Storage (Vercel Blob) =====
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"

# ===== OPTIONAL: Analytics =====
NEXT_PUBLIC_GOOGLE_ANALYTICS="G-XXXXXXXXXX"
```

> 📌 **Checklist**:
> - [ ] All required env vars are set in Vercel Dashboard
> - [ ] `NEXTAUTH_URL` matches your production domain
> - [ ] `DATABASE_URL` points to production PostgreSQL
> - [ ] `RESEND_API_KEY` is valid and not expired
> - [ ] `BLOB_READ_WRITE_TOKEN` has read+write permissions

### 3. Database Migration (⚠️ CRITICAL - NEW!)
This deployment includes a major database migration with **7 new tables** and **4 new enums**.

Run migrations on production database:
```bash
# Apply all pending migrations
npx prisma migrate deploy

# Regenerate Prisma Client
npx prisma generate
```

> 🚨 **IMPORTANT**: 
> - Without running `prisma migrate deploy`, the new features **WILL NOT WORK**
> - The migration creates: Project, ShareOrder, Wallet, WalletTransaction, Dividend, DailyTask, TaskCompletion tables
> - This is a **one-time setup** after deployment

### 4. Seed Production Data (Optional)
```bash
npm run prisma:seed
```

> ℹ️ Only run this if you want to populate seed data. For production, you may want to manually create initial projects and tasks.

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: add share market, wallet, and daily tasks features"
git push origin main
```

#### Step 2: Add Environment Variables to Vercel Dashboard
1. Go to https://vercel.com → Your Project → Settings → Environment Variables
2. Add/update all required variables:
   - `DATABASE_URL` — Production PostgreSQL connection
   - `AUTH_SECRET` — NextAuth secret key
   - `NEXTAUTH_URL` — Your production domain (https://buildbarguna.org)
   - `RESEND_API_KEY` — Resend email API key
   - `EMAIL_FROM` — noreply@buildbarguna.org
   - `BLOB_READ_WRITE_TOKEN` — Vercel Blob token

> 💡 **Tip**: Set variables for "Production" environment only

#### Step 3: Deploy on Vercel
1. Go to https://vercel.com
2. Click "Import Project" or select existing project
3. Select your GitHub repository
4. Vercel will auto-detect:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click "Deploy"

#### Step 4: Vercel Auto-Deployment
Once you push to GitHub, Vercel automatically:
- ✅ Builds your app
- ✅ Runs `npm run build`
- ✅ Deploys to production

Your site will be live at: `https://your-project.vercel.app`

#### Step 5: Run Database Migration (⚠️ CRITICAL!)
After Vercel deployment succeeds, **you must run the database migration**:

**Option A: Using Vercel CLI**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Run migration on production database
vercel env pull  # Pull env vars
npx prisma migrate deploy
```

**Option B: Using Your Database Dashboard (Recommended)**
1. Login to your database provider (Neon, Supabase, etc.)
2. Run this SQL (from `prisma/migrations/20260227000000_add_share_market_wallet_tasks/migration.sql`):
   ```sql
   -- Enums
   CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'CLOSED', 'PAUSED');
   CREATE TYPE "PaymentMethod" AS ENUM ('BKASH', 'NAGAD', 'ONLINE_GATEWAY');
   CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
   CREATE TYPE "TransactionType" AS ENUM ('DIVIDEND', 'TASK_REWARD', 'WITHDRAWAL', 'SHARE_PURCHASE');
   
   -- Tables (see migration.sql for full schema)
   CREATE TABLE "Project" (...);
   CREATE TABLE "ShareOrder" (...);
   CREATE TABLE "Wallet" (...);
   CREATE TABLE "WalletTransaction" (...);
   CREATE TABLE "Dividend" (...);
   CREATE TABLE "DailyTask" (...);
   CREATE TABLE "TaskCompletion" (...);
   ```

**Option C: Using SSH to Your Server**
```bash
# SSH into your server
ssh your-server

# Navigate to your app
cd /var/www/build-barguna

# Apply migration
npx prisma migrate deploy
npx prisma generate
```

> 🚨 **CRITICAL**: Without this step, the new features will not work!

#### Step 6: Add Custom Domain (Optional)
- Go to Vercel Settings → Domains
- Add: `buildbarguna.org` and `www.buildbarguna.org`
- Update DNS records as instructed by Vercel

---

### Option 2: Manual Server Deployment (VPS/DigitalOcean)

#### Prerequisites
- Ubuntu 22.04 server
- Domain pointed to server IP
- Node.js 18+ installed
- PostgreSQL database

#### Step 1: Install Dependencies
```bash
# On your server
sudo apt update
sudo apt install -y nodejs npm postgresql nginx certbot python3-certbot-nginx
```

#### Step 2: Clone & Setup
```bash
cd /var/www
git clone https://github.com/your-username/build-barguna.git
cd build-barguna
npm install
```

#### Step 3: Setup Environment
```bash
cp .env.example .env
nano .env
# Add your production environment variables
```

#### Step 4: Build
```bash
npm run build
```

#### Step 5: Setup PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start npm --name "build-barguna" -- start
pm2 save
pm2 startup
```

#### Step 6: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/buildbarguna.org
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name buildbarguna.org www.buildbarguna.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/buildbarguna.org /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 7: Setup SSL (Let's Encrypt)
```bash
sudo certbot --nginx -d buildbarguna.org -d www.buildbarguna.org
```

---

### Option 3: Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - AUTH_SECRET=${AUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: buildbarguna
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Step 3: Deploy
```bash
docker-compose up -d
```

---

## 🔍 Post-Deployment Verification

### 1. Test Basic Routes (All Routes Should Load)
Visit these URLs and verify they load without errors:
- ✅ https://buildbarguna.org/en
- ✅ https://buildbarguna.org/bn
- ✅ https://buildbarguna.org/en/join-member
- ✅ https://buildbarguna.org/bn/join-member
- ✅ https://buildbarguna.org/en/admin

### 2. Test New Share Market Feature 📊
**As Admin:**
1. Go to `/en/admin/projects`
2. Click "Add New Project"
3. Create a test project with:
   - Title (EN/BN): "Test Project"
   - Total Capital: 100,000
   - Total Shares: 1,000
   - Price Per Share: 100
4. Verify project appears in list
5. Verify project status shows as "ACTIVE"

**As Member:**
1. Go to `/en/projects`
2. Verify test project appears
3. Click on project
4. Click "Purchase Shares"
5. Enter quantity: 10
6. Select payment method: BKASH
7. Submit order
8. Verify order shows in `/en/admin/share-orders` as "PENDING"

**Approve Share Order:**
1. Go to `/en/admin/share-orders`
2. Find the pending order
3. Click "Approve"
4. ✅ Order status changes to "APPROVED"
5. ✅ Check member's wallet balance increased

### 3. Test Virtual Wallet + Dividends 💰
**Check Wallet:**
1. Login as member
2. Go to `/en/wallet`
3. Verify wallet displays:
   - Balance (after approved share orders)
   - Points (from completed tasks)
   - Transaction history

**Create Test Dividend:**
1. Go to `/en/admin/dividends`
2. Click "Create Dividend"
3. Select project: "Test Project"
4. Enter: Month (2), Year (2025), Percentage (5%)
5. Submit
6. ✅ Dividend created with status "not distributed"
7. Click "Distribute"
8. ✅ Check `/en/wallet` — balance should increase

### 4. Test Daily Tasks + Points System 🎯
**Create Test Task:**
1. Go to `/en/admin/tasks`
2. Click "Create Task"
3. Fill in:
   - Title (EN/BN): "Follow us on Twitter"
   - Platform: "Twitter"
   - URL: "https://twitter.com/buildbarguna"
   - Points Reward: 10
4. Click "Create"
5. ✅ Task appears in list with status "Active"

**Complete Task as Member:**
1. Go to `/en/daily-tasks`
2. Verify test task appears
3. Click "Complete Task"
4. System opens task URL (Twitter) in new tab
5. Go back and click "Confirm Completion"
6. ✅ Task marked as completed
7. Go to `/en/wallet`
8. ✅ Points balance increased by 10

### 5. Check Email Notifications 📧
Create a test share order and approve it:
- ✅ Member should receive email: "Your share order has been approved"
- ✅ Check spam folder if not in inbox
- ✅ Verify email contains: Order ID, shares purchased, amount

### 6. Check Database Migration Applied ✅
```bash
# Connect to your production database and run:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Project', 'ShareOrder', 'Wallet', 'DailyTask', 'TaskCompletion', 'Dividend', 'WalletTransaction');

# Should return 7 rows (all tables created)
```

### 7. Check Translations
- English pages display correctly
- Bengali pages display correctly
- Project titles show in both languages
- Task titles show in both languages

### 8. Monitor Logs
```bash
# Vercel: Check dashboard → Deployments → Function Logs
# PM2: pm2 logs build-barguna
# Docker: docker-compose logs -f app
```

> ⚠️ **If any verification step fails**, check troubleshooting section below

---

## 🔄 Update Workflow (After Deployment)

### For Future Updates to Build Barguna

**Typical Update Flow:**

```bash
# 1. Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin main

# 2. Vercel auto-deploys on push to main branch
#    - Automatically runs: npm run build
#    - Deployment takes ~2-5 minutes

# 3. If database schema changed:
npx prisma migrate dev --name descriptive_name

# 4. For manual servers:
ssh your-server
cd /var/www/build-barguna
git pull
npm install
npx prisma migrate deploy  # Only if schema changed
npx prisma generate
npm run build
pm2 restart build-barguna
```

### Database Schema Changes

If you modify `prisma/schema.prisma`:

```bash
# 1. Locally, create a migration
npx prisma migrate dev --name add_feature_name

# 2. Test locally
npm run dev

# 3. Push to GitHub (includes migration file)
git add prisma/
git commit -m "feat(db): add new fields"
git push origin main

# 4. On production, apply migration
npx prisma migrate deploy
npx prisma generate

# 5. Restart app
pm2 restart build-barguna  # or redeploy on Vercel
```

> ⚠️ **Important**: Always test migrations locally before pushing to production!

### Rolling Back a Deployment

If something breaks after deployment:

**On Vercel:**
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Redeploy"

**On Manual Server:**
```bash
# Check git history
git log --oneline -n 10

# Revert to previous commit
git revert HEAD
git push

# Or hard reset (only if safe)
git reset --hard <commit-hash>
git push --force
```

---

## 🆘 Troubleshooting

### ❌ Build Fails Locally
**Error**: `npm run build` fails

```bash
# 1. Check Node version
node -v  # Should be 18+

# 2. Clear cache
rm -rf .next node_modules package-lock.json
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Try building again
npm run build
```

> If still fails, check `AGENTS.md` for Next.js 16 guidelines or run `npm run lint` to find TypeScript errors

### ❌ Database Migration Not Applied
**Symptom**: New features (Projects, Wallet, Tasks) don't appear or show errors

```bash
# 1. Check which migrations are pending
npx prisma migrate status

# 2. Apply missing migrations
npx prisma migrate deploy

# 3. Regenerate Prisma Client
npx prisma generate

# 4. Restart your app
```

> 🚨 **This is the #1 cause of deployment failures for this release!**

### ❌ "Table does not exist" Errors
**Error**: `PrismaClientKnownRequestError: The table 'public.Project' does not exist`

**Solution**:
1. Run `npx prisma migrate deploy` (see above)
2. Verify migration applied via database dashboard:
   ```sql
   SELECT * FROM public.Project;  -- Should not error
   ```

### ❌ New Tables Not Showing in Admin
**Symptom**: `/admin/projects`, `/admin/tasks`, `/admin/share-orders` pages don't exist

**Check**:
1. Migration was applied ✅ (`npx prisma migrate deploy`)
2. App was redeployed after migration
3. Browser cache cleared (Ctrl+Shift+Delete)

### ❌ Share Orders Not Updating Wallet Balance
**Symptom**: When approving a share order, wallet balance doesn't increase

**Check**:
1. `WalletTransaction` table exists in database
2. `Wallet` table has correct `userId` reference
3. Server action `approveShareOrder` is calling wallet update logic
4. Check Vercel function logs for errors

**Debug**:
```bash
# Check wallet was created for user
SELECT * FROM "Wallet" WHERE "userId" = 'user-id-here';

# Check transaction was recorded
SELECT * FROM "WalletTransaction" WHERE "walletId" = 'wallet-id-here';
```

### ❌ Daily Tasks Not Showing Points
**Symptom**: Completed tasks don't increase wallet points

**Check**:
1. `TaskCompletion` table exists and has entries
2. `DailyTask` table has `pointReward` column
3. Wallet points logic in server action is correct

**Debug**:
```sql
-- Check task completion was recorded
SELECT * FROM "TaskCompletion" WHERE "userId" = 'user-id-here';

-- Check wallet points
SELECT "points" FROM "Wallet" WHERE "userId" = 'user-id-here';
```

### ❌ Email Notifications Not Sending
**Symptom**: Share order approved but user doesn't receive email

**Check**:
1. `RESEND_API_KEY` is set in Vercel Environment Variables
2. API key is valid (check Resend dashboard)
3. `EMAIL_FROM` is set to verified sender
4. Check Vercel Function Logs for email service errors

**Verify**:
```bash
# Test with Vercel CLI
vercel env pull
# Then manually test email sending in your email action file
```

### ❌ Prisma Client Generation Failed
**Error**: `Error: Cannot find module '@prisma/client'`

```bash
# 1. Clean install
rm -rf node_modules .next
npm install

# 2. Generate client
npx prisma generate

# 3. Build again
npm run build
```

### ❌ Environment Variables Not Loading in Production
**Symptom**: Features work locally but fail on Vercel

**Check**:
1. Variables are set in Vercel Dashboard → Settings → Environment Variables
2. Variables are set for "Production" environment
3. Spelling matches exactly (case-sensitive):
   - `DATABASE_URL` ✅
   - `Auth_Secret` ❌ (wrong)
4. Redeploy after adding variables:
   ```bash
   git commit --allow-empty -m "chore: redeploy to load env vars"
   git push
   ```

### ❌ 404 Pages for New Routes
**Symptom**: `/en/projects`, `/en/wallet`, `/en/daily-tasks` return 404

**Check**:
1. Pages exist in `src/app/[locale]/projects/`, `src/app/[locale]/wallet/`, etc.
2. Migration applied (tables exist)
3. Clear browser cache and hard refresh
4. Check Vercel deployment logs for build errors

### ❌ Database Connection Pooling Timeout
**Error**: `Error: socket timeout` or `Connection timeout`

**Solution**: Add connection pooling to `DATABASE_URL`:
```bash
# Old
postgresql://user:pass@host:5432/db

# New
postgresql://user:pass@host:5432/db?connection_limit=5
```

Then restart your app.

### ❌ Bilingual Content Not Displaying
**Symptom**: Project/Task titles show only English or are blank in Bengali

**Check**:
1. Both `titleEn` and `titleBn` fields are filled when creating projects/tasks
2. `getLocale()` is correctly called in components
3. Database schema has both fields (check migration)

---

## 📞 Still Having Issues?

### Diagnostic Checklist
- [ ] `npm run build` succeeds locally?
- [ ] `npx prisma migrate deploy` was run?
- [ ] All 7 new tables exist in database? (Run SQL query in step 6 of verification)
- [ ] All environment variables set in Vercel?
- [ ] App redeployed after migration?
- [ ] Browser cache cleared?

### Get Help
1. Check Vercel Deployments → Function Logs
2. Check database logs (Neon/Supabase dashboard)
3. Review `AGENTS.md` for Next.js 16 patterns
4. Run locally with `npm run dev` to test features

### Helpful Commands
```bash
# Check build locally
npm run build

# Test database connection
npx prisma db push

# View database tables
npx prisma studio

# Check migrations status
npx prisma migrate status

# View Vercel logs
vercel logs [project-name]
```

---

---

## 📋 New Features Summary

### What Was Added in This Deployment

| Feature | Tables Created | Key Routes | Admin Routes |
|---------|---|---|---|
| **Share Market** | Project, ShareOrder | `/projects`, `/projects/[id]` | `/admin/projects`, `/admin/share-orders` |
| **Virtual Wallet** | Wallet, WalletTransaction | `/wallet` | `/admin/wallet-transactions` |
| **Dividends** | Dividend | (via wallet) | `/admin/dividends` |
| **Daily Tasks** | DailyTask, TaskCompletion | `/daily-tasks` | `/admin/tasks` |

### Database Changes

**7 New Tables:**
1. `Project` — Business projects available for investment
2. `ShareOrder` — Member share purchase requests
3. `Wallet` — Member wallet with balance & points
4. `WalletTransaction` — Transaction history
5. `Dividend` — Monthly dividend distributions
6. `DailyTask` — Social media tasks for points
7. `TaskCompletion` — Task completion tracking

**4 New Enums:**
- `ProjectStatus` (ACTIVE, CLOSED, PAUSED)
- `PaymentMethod` (BKASH, NAGAD, ONLINE_GATEWAY)
- `OrderStatus` (PENDING, APPROVED, REJECTED)
- `TransactionType` (DIVIDEND, TASK_REWARD, WITHDRAWAL, SHARE_PURCHASE)

---

## ✅ Quick Reference Checklist

### Before Pushing to GitHub
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Tested all new features locally
- [ ] Both EN and BN translations updated
- [ ] Database migrations created with `npx prisma migrate dev`

### Before Deploying to Production
- [ ] All environment variables set in Vercel
- [ ] Code pushed to GitHub main branch
- [ ] Vercel build completes successfully
- [ ] `npx prisma migrate deploy` ready to run

### After Deployment
- [ ] Database migration applied (`npx prisma migrate deploy`)
- [ ] All 7 new tables exist in database
- [ ] Test each new feature (see verification section)
- [ ] Email notifications working
- [ ] Monitor logs for errors (first 24 hours)

---

## 📞 Need Help?

### Common Resources
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs
- **Project Guidelines**: See `AGENTS.md`

### Debugging Steps
1. ✅ Check local build: `npm run build`
2. ✅ Check Vercel logs: Dashboard → Deployments
3. ✅ Check database: Connect via Neon/Supabase dashboard
4. ✅ Check Prisma status: `npx prisma migrate status`
5. ✅ Check environment: Verify all vars in Vercel settings

### Get Help
- **Build errors?** → Check `npm run lint` output + `AGENTS.md`
- **Database errors?** → Run `npx prisma migrate status` + verify env vars
- **Feature not working?** → Verify migration applied + check admin logs
- **Email not sending?** → Check `RESEND_API_KEY` in Vercel

---

## 🎉 Ready to Deploy?

### Summary of Steps
1. ✅ Test locally: `npm run build`
2. ✅ Push to GitHub: `git push origin main`
3. ✅ Vercel auto-deploys (watch logs)
4. ✅ Apply migration: `npx prisma migrate deploy`
5. ✅ Verify features: Run post-deployment checks
6. ✅ Monitor: Check logs for errors (24 hours)

**Congratulations! Your deployment is complete! 🚀**

---

**For detailed information, see the appropriate section above or contact your technical lead.**

**Last Updated**: February 27, 2025  
**Deployment Type**: Next.js 16 + Prisma 6 + PostgreSQL  
**Related Files**: `AGENTS.md`, `prisma/schema.prisma`, `.env.example`

