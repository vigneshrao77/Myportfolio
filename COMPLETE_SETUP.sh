#!/bin/bash

echo "🚀 Developer Portfolio - Complete Setup"
echo "========================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎨 Next steps:"
    echo "  1. Customize src/data/portfolioData.js with your information"
    echo "  2. Add your resume.pdf to the public/ folder"
    echo "  3. Run 'npm run dev' to start development server"
    echo "  4. Run 'npm run build' to build for production"
    echo ""
    echo "🌐 Deployment options:"
    echo "  - Vercel: Push to GitHub and import at vercel.com"
    echo "  - Netlify: Build command 'npm run build', publish 'dist'"
    echo ""
    echo "📚 Documentation: See README.md and INSTALL_GUIDE.md"
else
    echo "❌ Installation failed. Please check your internet connection."
fi
