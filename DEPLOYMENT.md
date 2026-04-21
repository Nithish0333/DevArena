# DevArena Deployment Guide

## Overview
This guide will help you deploy DevArena with:
- **Frontend**: Netlify (React SPA)
- **Backend**: Northflank (Node.js + Express + SQLite)
- **Database**: SQLite (file-based)

## Prerequisites
- Git repository with your code
- Netlify account
- Northflank account
- Domain names (optional)

## Frontend Deployment (Netlify)

### 1. Connect to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy from frontend directory
cd frontend
netlify deploy --prod --dir=build
```

### 2. Netlify Configuration
The `netlify.toml` file is already configured with:
- React build configuration
- SPA routing
- Security headers
- Environment variables

### 3. Environment Variables
In Netlify dashboard (Site settings → Build & deploy → Environment), set:
- `REACT_APP_API_URL`: Your Northflank backend URL
- `NODE_ENV`: production

## Backend Deployment (Northflank)

### 1. Create Northflank Service
1. Go to Northflank dashboard
2. Create new service
3. Choose "Docker" service type
4. Connect your Git repository

### 2. Docker Configuration
The `Dockerfile` is configured with:
- Node.js 18 Alpine
- SQLite database support
- Health checks
- Non-root user

### 3. Environment Variables
Set these in Northflank:
- `NODE_ENV`: production
- `PORT`: 5000
- `JWT_SECRET`: Generate a secure random string
- `CORS_ORIGIN`: Your Vercel frontend URL
- `DATABASE_PATH`: /app/data/devarena.db

### 4. Volume Mounting
Create a persistent volume at `/app/data` to store the SQLite database.

### 5. Port Configuration
- Internal port: 5000
- External port: 80 (HTTP) and 443 (HTTPS)

## Database Setup

### SQLite Configuration
The backend uses SQLite with Sequelize ORM. The database will be automatically created at:
- Development: `./devarena.db`
- Production: `/app/data/devarena.db`

### Database Initialization
The backend automatically creates tables on startup if they don't exist.

## Post-Deployment Checklist

### 1. Test API Endpoints
```bash
# Health check
curl https://your-backend.northflank.com/api/health

# Test authentication
curl -X POST https://your-backend.northflank.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

### 2. Test Frontend
- Visit your Vercel URL
- Test login/registration
- Test code editor functionality
- Test all pages

### 3. CORS Configuration
Ensure your backend CORS allows your Vercel domain:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

## Monitoring

### Vercel Monitoring
- Built-in analytics
- Performance metrics
- Error tracking

### Northflank Monitoring
- Resource usage
- Health checks
- Logs

### Database Monitoring
- SQLite file size
- Query performance
- Backup strategy

## Scaling Considerations

### Frontend (Vercel)
- Automatic scaling
- CDN distribution
- Edge functions support

### Backend (Northflank)
- Horizontal scaling
- Load balancing
- Database connection pooling

### Database (SQLite)
- Consider PostgreSQL for high traffic
- Implement backup strategy
- Monitor file size

## Security

### Environment Variables
- Never commit secrets to Git
- Use strong JWT secrets
- Rotate secrets regularly

### HTTPS
- Both Vercel and Northflank provide HTTPS
- No additional configuration needed

### Database Security
- SQLite file permissions
- Regular backups
- Access controls

## Troubleshooting

### Common Issues
1. **CORS errors**: Check CORS origin configuration
2. **Database connection**: Verify file permissions and path
3. **Environment variables**: Ensure all required vars are set
4. **Build failures**: Check logs and dependencies

### Debug Commands
```bash
# Check backend health
curl https://your-backend.northflank.com/api/health

# Check frontend build
vercel logs

# Check backend logs (Northflank dashboard)
# Navigate to service -> Logs
```

## Backup Strategy

### Database Backups
```bash
# Manual backup (if needed)
cp /app/data/devarena.db /app/data/devarena_backup_$(date +%Y%m%d).db
```

### Code Backups
- Git version control
- Regular commits
- Tag releases

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization

### Backend
- Database indexing
- Response caching
- Compression

## Maintenance

### Regular Tasks
- Update dependencies
- Monitor logs
- Check performance
- Security updates

### Updates
- Test in staging first
- Backup before updates
- Rollback plan
