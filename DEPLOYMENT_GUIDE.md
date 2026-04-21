# Complete Deployment Guide: Vercel + Northflank + MongoDB Atlas

## Overview
- **Frontend**: Vercel (Free)
- **Backend**: Northflank (Free - 24/7)
- **Database**: MongoDB Atlas (Free M0 Sandbox)

## Step 1: MongoDB Atlas Setup

### 1.1 Create Account & Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create **M0 Sandbox** cluster (FREE)
4. Name: `devarena-cluster`

### 1.2 Configure Access
1. **Network Access**: Add IP `0.0.0.0/0` (allow all)
2. **Database User**: Create `devarena-admin` with strong password
3. **Get Connection String**: 
   - Click "Connect" > "Connect your application"
   - Copy Node.js connection string

### 1.3 Test Connection
```bash
cd backend
# Update .env.production with your MongoDB URI
npm run seed
```

## Step 2: Backend Deployment (Northflank)

### 2.1 Create Northflank Account
1. Go to [Northflank](https://northflank.com)
2. Sign up for free account
3. Create new project

### 2.2 Create Docker Service
1. Click "Add Service" > "Docker Service"
2. **GitHub Integration**: Connect your repository
3. **Build Settings**:
   - Build Context: `backend`
   - Dockerfile: `Dockerfile`
   - Port: `5000`

### 2.3 Environment Variables
Add these environment variables:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your_strong_jwt_secret_here
MONGODB_URI=mongodb+srv://devarena-admin:YOUR_PASSWORD@devarena-cluster.xxxxx.mongodb.net/devarena?retryWrites=true&w=majority
```

### 2.4 Deploy
1. Click "Create and Deploy"
2. Wait for build to complete
3. Copy your service URL: `https://your-service-name.your-account-name.northflank.app`

## Step 3: Frontend Deployment (Vercel)

### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### 3.2 Configure Frontend
1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-service-name.your-account-name.northflank.app/api
   ```

### 3.3 Deploy
1. Click "Deploy"
2. Wait for deployment
3. Your app will be live at `https://your-project-name.vercel.app`

## Step 4: Final Testing

### 4.1 Test Backend
```bash
curl https://your-service-name.northflank.app/api/problems
```

### 4.2 Test Frontend
1. Open your Vercel URL
2. Try signing up/logging in
3. Test code submission features

## File Structure After Setup
```
DevArena/
|-- frontend/
|   |-- vercel.json          # Vercel config
|   |-- .env                 # API URL
|   |-- build/               # Built files
|-- backend/
|   |-- Dockerfile           # Docker config
|   |-- .dockerignore        # Docker ignore
|   |-- .env.production      # Production env vars
|-- MONGODB_SETUP.md         # MongoDB setup guide
|-- DEPLOYMENT_GUIDE.md     # This guide
```

## Free Tier Limits
- **Vercel**: Unlimited static hosting
- **Northflank**: 2 services, 24/7 uptime, 750 hours/month
- **MongoDB Atlas**: 512MB storage, shared RAM

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows frontend domain
2. **MongoDB Connection**: Check IP whitelist and credentials
3. **Build Failures**: Verify package.json and dependencies
4. **Environment Variables**: Double-check all variables are set

### Debug Commands
```bash
# Test MongoDB connection
node -e "require('./index.js')"

# Check backend logs on Northflank
# Go to Northflank > Service > Logs

# Check frontend deployment on Vercel
# Go to Vercel > Project > Logs
```

## Next Steps
1. Set up custom domains
2. Configure SSL certificates (automatic on both platforms)
3. Set up monitoring and alerts
4. Add CI/CD pipelines
5. Scale up as needed
