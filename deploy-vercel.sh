#!/bin/bash

echo "🚀 Build Barguna Initiative - Quick Vercel Deploy"
echo "=================================================="
echo ""

# Check if git is clean
if [[ -n $(git status -s) ]]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add .
    git commit -m "feat: rebrand from Co-operative to Initiative - ready for deploy"
else
    echo "✅ Git is clean"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Click 'Import Project'"
echo "3. Select your GitHub repository"
echo "4. Add environment variables from .env.local"
echo "5. Click 'Deploy'"
echo ""
echo "🌐 Your site will be live in 2-3 minutes!"
echo ""

