# 🔐 Build Barguna Admin Setup Script (PowerShell)
# This script automates the admin authentication setup process

Write-Host "🚀 Build Barguna Admin Authentication Setup" -ForegroundColor Green
Write-Host "==========================================="
Write-Host

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host

# Install bcrypt dependencies
Write-Host "📦 Installing bcrypt dependencies..." -ForegroundColor Yellow
try {
    npm install bcryptjs "@types/bcryptjs"
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host

# Generate Prisma client
Write-Host "🗄️ Generating Prisma client..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Prisma client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

Write-Host

# Push database schema
Write-Host "📊 Pushing database schema..." -ForegroundColor Yellow
try {
    npx prisma db push
    Write-Host "✅ Database schema updated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to update database schema" -ForegroundColor Red
    Write-Host "   Please check your database connection and .env file" -ForegroundColor Yellow
    exit 1
}

Write-Host

# Create admin user
Write-Host "👤 Creating admin user..." -ForegroundColor Yellow
try {
    node add-admin.js
    Write-Host "✅ Admin user created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create admin user" -ForegroundColor Red
    exit 1
}

Write-Host
Write-Host "🎉 Setup Complete!" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host "=================="
Write-Host
Write-Host "📝 What was set up:" -ForegroundColor Cyan
Write-Host "  ✅ bcrypt dependencies installed"
Write-Host "  ✅ Database schema updated"
Write-Host "  ✅ Admin user created with secure password hashing"
Write-Host
Write-Host "🔑 Default Login Credentials:" -ForegroundColor Yellow
Write-Host "  User ID: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host
Write-Host "⚠️  IMPORTANT: Change the default password before production!" -ForegroundColor Red
Write-Host
Write-Host "🌐 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Start development server: npm run dev"
Write-Host "  2. Visit: http://localhost:3000/auth/signin"
Write-Host "  3. Login with credentials above"
Write-Host "  4. Change default password in add-admin.js"
Write-Host
Write-Host "📖 For detailed instructions, see: ADMIN_SETUP_TUTORIAL.md" -ForegroundColor Magenta
Write-Host