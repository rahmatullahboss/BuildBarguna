# 🚀 Build Barguna Initiative - Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
Ensure these are configured in your production environment:

```bash
# Database
DATABASE_URL="your-production-database-url"

# Authentication
AUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://buildbarguna.org"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@buildbarguna.org"

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Optional
NEXT_PUBLIC_GOOGLE_ANALYTICS="your-ga-id"
```

### 2. Database Migration
Run migrations on production database:
```bash
npx prisma migrate deploy
npx prisma generate
```

### 3. Seed Production Data (Optional)
```bash
npm run prisma:seed
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: rebrand from Co-operative to Initiative"
git push origin main
```

#### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Step 3: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- Add all variables from `.env.local`
- Make sure to update `NEXTAUTH_URL` to your production domain

#### Step 4: Deploy
- Click "Deploy"
- Vercel will automatically build and deploy
- Your site will be live at: `https://your-project.vercel.app`

#### Step 5: Add Custom Domain (Optional)
- Go to Settings → Domains
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

### 1. Test All Routes
Visit these URLs and verify:
- ✅ https://buildbarguna.org/en
- ✅ https://buildbarguna.org/bn
- ✅ https://buildbarguna.org/en/join-member
- ✅ https://buildbarguna.org/bn/join-member
- ✅ https://buildbarguna.org/en/admin

### 2. Check Translations
- English pages show "Initiative" (not "Co-operative")
- Bengali pages show "ইনিশিয়েটিভ" (not "সমবায়")

### 3. Test Forms
- Contact form submission
- Member registration
- Admin login

### 4. Check SEO
```bash
curl -I https://buildbarguna.org
# Should return 200 OK
```

### 5. Monitor Logs
```bash
# Vercel: Check dashboard logs
# PM2: pm2 logs build-barguna
# Docker: docker-compose logs -f
```

---

## 🔄 Update Workflow (After Deployment)

### For Future Updates:
```bash
# 1. Make changes locally
git add .
git commit -m "your message"
git push origin main

# 2. Vercel auto-deploys on push

# 3. For manual servers:
ssh your-server
cd /var/www/build-barguna
git pull
npm install
npm run build
pm2 restart build-barguna
```

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check Node version
node -v  # Should be 18+

# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Error
```bash
# Test connection
npx prisma db pull

# Reset if needed (CAREFUL - deletes data)
npx prisma migrate reset
```

### Environment Variables Not Working
- Make sure variables are set in production environment
- Restart application after adding new variables
- Check for typos in variable names

---

## 📞 Support

If you need help:
1. Check Vercel logs
2. Review build output
3. Check server logs (PM2/Docker)
4. Verify database connection

**Ready to deploy? Follow the Vercel option for easiest deployment! 🚀**

