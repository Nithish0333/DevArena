#!/bin/bash

# DevArena Deployment Script
# This script helps deploy the project to Vercel (frontend) and Northflank (backend)

echo "=== DevArena Deployment Script ==="
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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Please install it with: npm i -g vercel"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_warning "Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Frontend Deployment
echo "=== Frontend Deployment (Vercel) ==="
cd frontend

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    print_warning "Please update .env.local with your actual API URL before deployment"
fi

# Deploy to Vercel
echo "Deploying frontend to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Frontend deployed successfully!"
else
    print_error "Frontend deployment failed"
    exit 1
fi

cd ..

# Backend Deployment
echo ""
echo "=== Backend Deployment (Northflank) ==="
cd backend

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please update .env with your actual environment variables"
fi

# Check Dockerfile
if [ ! -f "Dockerfile" ]; then
    print_error "Dockerfile not found"
    exit 1
fi

echo "Backend is ready for Northflank deployment!"
echo "Please:"
echo "1. Push your code to Git repository"
echo "2. Go to Northflank dashboard"
echo "3. Create new Docker service"
echo "4. Connect your Git repository"
echo "5. Set environment variables from .env"
echo "6. Deploy the service"

cd ..

# Post-deployment checks
echo ""
echo "=== Post-Deployment Checklist ==="
echo "1. Update frontend .env.local with your Northflank backend URL"
echo "2. Test the health endpoint: https://your-backend.northflank.com/api/health"
echo "3. Test user registration and login"
echo "4. Test the code editor functionality"
echo "5. Verify all pages are working correctly"

print_success "Deployment setup complete!"
echo "See DEPLOYMENT.md for detailed instructions"
