#!/bin/bash

# DevArena Netlify Deployment Script
# This script helps deploy the frontend to Netlify

echo "=== DevArena Netlify Deployment Script ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}SUCCESS: $1${NC}"
}

print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "DEPLOYMENT.md" ]; then
    print_error "Please run this script from the DevArena root directory"
    exit 1
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    print_error "Netlify CLI not found. Installing..."
    npm i -g netlify-cli
    if [ $? -ne 0 ]; then
        print_error "Failed to install Netlify CLI"
        exit 1
    fi
fi

# Frontend Deployment
echo "=== Frontend Deployment (Netlify) ==="
cd frontend

# Check if .env.netlify exists
if [ ! -f ".env.netlify" ]; then
    print_warning ".env.netlify not found. Creating from template..."
    cat > .env.netlify << EOF
# Netlify Environment Variables
REACT_APP_API_URL=https://your-northflank-backend-url.northflank.com/api
NODE_ENV=production
GENERATE_SOURCEMAP=false
EOF
    print_warning "Please update .env.netlify with your actual API URL before deployment"
fi

# Check if netlify.toml exists
if [ ! -f "netlify.toml" ]; then
    print_error "netlify.toml not found"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building React application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

# Check if build directory exists
if [ ! -d "build" ]; then
    print_error "Build directory not found"
    exit 1
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=build

if [ $? -eq 0 ]; then
    print_success "Frontend deployed successfully to Netlify!"
else
    print_error "Netlify deployment failed"
    exit 1
fi

cd ..

# Backend Deployment Instructions
echo ""
echo "=== Backend Deployment (Northflank) ==="
echo "Backend is ready for Northflank deployment!"
echo "Please:"
echo "1. Push your code to Git repository"
echo "2. Go to Northflank dashboard"
echo "3. Create new Docker service"
echo "4. Connect your Git repository"
echo "5. Set environment variables from backend/.env.example"

# Post-deployment checklist
echo ""
echo "=== Post-Deployment Checklist ==="
echo "1. Update Netlify environment variables with your Northflank backend URL"
echo "2. Test backend health endpoint: https://your-backend.northflank.com/api/health"
echo "3. Test user registration and login on Netlify"
echo "4. Test all pages and functionality"
echo "5. Verify API connectivity between Netlify frontend and Northflank backend"

print_success "Netlify deployment setup complete!"
echo "See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🌍 Your Netlify site will be available at: https://your-site-name.netlify.app"
