# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Verify email

## 2. Create Cluster
1. Click "Build a Cluster"
2. Choose **M0 Sandbox** (FREE)
3. Select cloud provider and region (closest to your users)
4. Cluster name: `devarena-cluster`
5. Click "Create Cluster"

## 3. Configure Network Access
1. Go to **Network Access** in left menu
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## 4. Create Database User
1. Go to **Database Access** in left menu
2. Click "Add New Database User"
3. Username: `devarena-admin`
4. Password: Generate strong password (save it!)
5. Database User Privileges: Read and write to any database
6. Click "Add User"

## 5. Get Connection String
1. Go to **Clusters** > Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select **Node.js** and version 4.0 or later
4. Copy the connection string

## 6. Update Environment Variables
Replace the connection string in `.env.production`:

```
MONGODB_URI=mongodb+srv://devarena-admin:YOUR_PASSWORD@devarena-cluster.xxxxx.mongodb.net/devarena?retryWrites=true&w=majority
```

## 7. Test Connection
```bash
cd backend
npm run seed
```

## Free Tier Limits
- **512 MB storage**
- **Shared RAM**
- **One M0 cluster per project**
- **Perfect for development/small projects**
