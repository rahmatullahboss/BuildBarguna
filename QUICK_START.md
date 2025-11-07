# ⚡ Quick Start Guide - Admin Setup

## 🚀 1-Minute Setup

### Option 1: Automated Setup (Recommended)

**For Linux/Mac:**
```bash
./setup-admin.sh
```

**For Windows:**
```powershell
.\setup-admin.ps1
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install bcryptjs @types/bcryptjs

# 2. Setup database
npx prisma generate
npx prisma db push

# 3. Create admin user
node add-admin.js

# 4. Start development server
npm run dev
```

## 🔑 Default Login

- **URL:** http://localhost:3000/auth/signin
- **User ID:** `admin`
- **Password:** `admin123`

## ⚠️ Security

**CHANGE DEFAULT PASSWORD IMMEDIATELY!**

Edit `add-admin.js`:
```javascript
const adminPassword = 'your_secure_password'; // Change this!
```

Then run: `node add-admin.js`

## 📚 Full Documentation

See `ADMIN_SETUP_TUTORIAL.md` for complete instructions.

---

✅ **Ready in 1 minute!**