# Backend Deployment Checklist

## Pre-Deployment
- [x] Code pushed to GitHub
- [x] Dockerfile configured
- [x] Health check endpoint added
- [x] Environment variables documented
- [x] SQLite database configured

## Northflank Deployment
- [ ] Create Docker service
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Configure persistent volume
- [ ] Deploy service

## Environment Variables to Set
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=https://teal-speculoos-8e4b82.netlify.app
DATABASE_PATH=/app/data/devarena.db
```

## Post-Deployment
- [ ] Test health endpoint: GET /api/health
- [ ] Update Netlify environment variables
- [ ] Test user registration
- [ ] Test code execution
- [ ] Verify all API endpoints

## URLs After Deployment
- Frontend: https://teal-speculoos-8e4b82.netlify.app
- Backend: https://your-northflank-url.northflank.com
- Health Check: https://your-northflank-url.northflank.com/api/health
