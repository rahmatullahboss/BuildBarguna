#!/bin/bash

# 🔐 Build Barguna Admin Setup Script
# This script automates the admin authentication setup process

echo "🚀 Build Barguna Admin Authentication Setup"
echo "==========================================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo

# Install bcrypt dependencies
echo "📦 Installing bcrypt dependencies..."
npm install bcryptjs @types/bcryptjs

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push

if [ $? -eq 0 ]; then
    echo "✅ Database schema updated successfully"
else
    echo "❌ Failed to update database schema"
    echo "   Please check your database connection and .env file"
    exit 1
fi

echo

# Create admin user
echo "👤 Creating admin user..."
node add-admin.js

if [ $? -eq 0 ]; then
    echo "✅ Admin user created successfully"
else
    echo "❌ Failed to create admin user"
    exit 1
fi

echo
echo "🎉 Setup Complete!"
echo "=================="
echo
echo "📝 What was set up:"
echo "  ✅ bcrypt dependencies installed"
echo "  ✅ Database schema updated"
echo "  ✅ Admin user created with secure password hashing"
echo
echo "🔑 Default Login Credentials:"
echo "  User ID: admin"
echo "  Password: admin123"
echo
echo "⚠️  IMPORTANT: Change the default password before production!"
echo
echo "🌐 Next Steps:"
echo "  1. Start development server: npm run dev"
echo "  2. Visit: http://localhost:3000/auth/signin"
echo "  3. Login with credentials above"
echo "  4. Change default password in add-admin.js"
echo
echo "📖 For detailed instructions, see: ADMIN_SETUP_TUTORIAL.md"
echo