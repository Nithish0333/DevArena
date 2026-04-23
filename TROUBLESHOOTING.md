# DevArena Deployment Troubleshooting

## Netlify Issues

### Build Fails
- Check Base Directory: Should be `frontend`
- Check Build Command: Should be `npm run build`
- Check Publish Directory: Should be `build`
- Check Environment Variables: `REACT_APP_API_URL`

### API Connection Issues
- CORS errors: Check `REACT_APP_API_URL`
- 404 errors: Check backend URL
- Network errors: Check both services

## Render Issues

### Service Won't Start
- Check package.json: `"start": "node index_fixed.js"`
- Check port: Should be 5000
- Check environment: `NODE_ENV=production`
- Check database path: `./devarena.db`

### Database Issues
- SQLite permissions: Check file access
- Database path: Should be `./devarena.db`
- Migration errors: Check Sequelize setup

## Quick Commands

### Test Backend Health
```bash
curl https://devarena-backend.onrender.com/api/health
```

### Check Netlify Build
```bash
# In frontend directory
npm run build
```

### Test Local Backend
```bash
cd backend
npm start
```

## Common Solutions

1. **Restart Services**: Stop and start both services
2. **Clear Cache**: Clear Netlify cache
3. **Check Logs**: Both Netlify and Render logs
4. **Verify URLs**: Ensure correct URLs in config
5. **Update Environment**: Re-add variables if needed
