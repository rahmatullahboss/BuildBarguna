# 🔐 Admin Authentication Setup Tutorial

This guide will help you set up secure admin authentication for Build Barguna website using bcrypt password hashing.

## 📋 Prerequisites

- Node.js and npm installed
- Database setup (PostgreSQL/MySQL/SQLite)
- Prisma configured

## 🚀 Step-by-Step Setup

### Step 1: Install Required Dependencies

```bash
# Install bcrypt for password hashing
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### Step 2: Update Database Schema

Make sure your `prisma/schema.prisma` has a User model with password field:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?  // This field is required for authentication
  name      String?
  role      String?  // 'admin' for admin users
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Step 3: Run Database Migration

```bash
# Generate and apply migration
npx prisma generate
npx prisma db push
```

### Step 4: Create Admin User

Run the admin creation script:

```bash
node add-admin.js
```

**Expected Output:**
```
Creating admin user...
Email: admin
Password: admin123
Hashed Password: $2b$12$N9qo8uLOickgx2ZMRZoMye...

✅ Admin user created/updated successfully!
Login credentials:
- User ID: admin
- Password: admin123

🔐 Password is securely hashed in database
```

### Step 5: Test Admin Login

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Admin Login:**
   ```
   http://localhost:3000/auth/signin
   ```

3. **Login with Credentials:**
   - **User ID:** `admin`
   - **Password:** `admin123`

4. **Success:** You should be redirected to `/admin`

## 🔧 Customization

### Change Admin Credentials

Edit `add-admin.js` before running:

```javascript
// Configuration
const adminEmail = 'your_admin_id';        // Change this
const adminPassword = 'your_secure_password'; // Change this
const adminName = 'Your Name';             // Change this
```

Then run:
```bash
node add-admin.js
```

### Add Multiple Admins

Create additional admin users by modifying the script:

```javascript
// Add multiple admins
const admins = [
  { email: 'admin1', password: 'password1', name: 'Admin One' },
  { email: 'admin2', password: 'password2', name: 'Admin Two' }
];

for (const adminData of admins) {
  const hashedPassword = await bcrypt.hash(adminData.password, 12);
  await prisma.user.upsert({
    where: { email: adminData.email },
    update: { password: hashedPassword, name: adminData.name, role: 'admin' },
    create: { email: adminData.email, password: hashedPassword, name: adminData.name, role: 'admin' }
  });
}
```

## 🔒 Security Features

### What bcrypt Does:

1. **Password Hashing:** Converts `admin123` → `$2b$12$N9qo8uLOickgx2ZMRZoMye...`
2. **Salt Addition:** Prevents rainbow table attacks
3. **Cost Factor:** 12 rounds (recommended for 2024)
4. **One-way Encryption:** Cannot be reversed

### Database Security:

**❌ Before (Insecure):**
```
password: "admin123"
```

**✅ After (Secure):**
```
password: "$2b$12$N9qo8uLOickgx2ZMRZoMye..."
```

## 🛠️ Troubleshooting

### Error: Module not found 'bcryptjs'

**Solution:**
```bash
npm install bcryptjs @types/bcryptjs
```

### Error: Database connection failed

**Check:**
1. Database is running
2. Environment variables in `.env`
3. Prisma schema is correct

**Fix:**
```bash
npx prisma db push
npx prisma generate
```

### Error: Admin user not found

**Solution:**
```bash
# Re-run admin creation
node add-admin.js
```

### Login fails with correct credentials

**Check:**
1. User exists in database: `npx prisma studio`
2. Password is hashed properly
3. Role is set to 'admin'

## 📱 Login Process Flow

```
1. User enters ID + Password
2. System finds user by email/ID
3. bcrypt compares entered password with hashed password
4. If match: Create session + redirect to /admin
5. If no match: Show "Invalid credentials" error
```

## 🗄️ Database Structure

After setup, your User table will look like:

| id | email | password | name | role |
|----|--------|----------|------|------|
| cuid123 | admin | $2b$12$N9qo... | Admin User | admin |

## 🌍 Environment Variables

Add to your `.env` file:

```env
# Database
DATABASE_URL="your_database_connection_string"

# NextAuth
NEXTAUTH_SECRET="your_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"
```

## 🎯 Next Steps

1. **Change Default Password:** Immediately change `admin123` to something secure
2. **Add More Admins:** Create additional admin accounts as needed
3. **Test Login:** Verify everything works before deployment
4. **Backup Database:** Save your admin credentials securely

## 🆘 Need Help?

**Common Issues:**
- Check console for error messages
- Verify database connection
- Ensure all dependencies are installed
- Run `npx prisma studio` to check database

**Contact:**
- Check logs in browser developer tools
- Verify environment variables
- Test database connection with Prisma Studio

---

✅ **Setup Complete!** Your admin authentication system is now secure and ready for production use.