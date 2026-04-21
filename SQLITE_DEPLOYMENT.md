# SQLite Deployment Guide for Northflank

## Why SQLite for Production?

SQLite is perfect for your DevArena deployment:
- **Zero external dependencies** - no database servers needed
- **File-based storage** - easy to backup and manage
- **Fast performance** - embedded database
- **No network latency** - runs in same container
- **Free forever** - no database costs

## Deployment Steps

### 1. Northflank Service Configuration

#### Create Docker Service
1. Go to [Northflank](https://northflank.com)
2. Create new project
3. Add Service > Docker Service
4. Connect GitHub repository

#### Build Settings
- **Build Context**: `backend`
- **Dockerfile**: `Dockerfile`
- **Port**: `5000`

#### Environment Variables
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your_strong_jwt_secret_here
DB_PATH=/app/data/devarena.sqlite
```

#### Storage Configuration
- **Add Persistent Volume**: `/app/data`
- **Size**: 1GB (free tier)
- **Purpose**: SQLite database file storage

### 2. Database Seeding

The SQLite database will be created automatically when:
1. Service starts for first time
2. Database file doesn't exist at `/app/data/devarena.sqlite`
3. Seed script runs automatically

### 3. Automatic Database Creation

Your `index_sqlite.js` includes automatic seeding:
```javascript
// Creates database if doesn't exist
// Seeds with 8 sample problems
// Ready for user registration
```

## Benefits of SQLite on Northflank

### Performance
- **No network overhead** - database in same container
- **Fast queries** - embedded SQLite engine
- **Low memory usage** - lightweight

### Reliability
- **ACID compliant** - transaction support
- **No connection limits** - single file access
- **Atomic writes** - data integrity

### Cost
- **Free forever** - no database hosting costs
- **No maintenance** - no server management
- **Scalable** - handles thousands of users

## Monitoring

### Check Database Status
```bash
# In Northflank service logs
Database initialized successfully
Seeded 8 sample problems
Server running on port 5000
```

### Backup Strategy
- **Automatic**: Northflank persistent storage
- **Manual**: Download `devarena.sqlite` file
- **Export**: Use SQLite tools to dump data

## Migration Path

If you want to switch to MongoDB Atlas later:
1. Export data from SQLite
2. Update environment variables
3. Redeploy service
4. Import data to MongoDB

## Troubleshooting

### Common Issues
1. **Permission denied**: Check volume mount path
2. **Database locked**: Restart service
3. **Out of space**: Increase volume size

### Debug Commands
```bash
# Check if database exists
ls -la /app/data/devarena.sqlite

# Check database size
du -h /app/data/devarena.sqlite

# Query database
sqlite3 /app/data/devarena.sqlite "SELECT COUNT(*) FROM problems;"
```

## Production Ready

Your SQLite deployment is production-ready with:
- **24/7 uptime** on Northflank
- **Data persistence** with volumes
- **Automatic backups** with Northflank
- **Zero maintenance** overhead

Ready for thousands of users!
