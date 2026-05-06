# Vercel Deployment Guide

This guide walks you through deploying your Personal Financial Tracker to Vercel.

## Prerequisites

- A Vercel account (free at https://vercel.com)
- Git installed
- GitHub, GitLab, or Bitbucket account

## Deployment Steps

### 1. Prepare Your Repository

```bash
cd FT
git init
git add .
git commit -m "Initial commit: Personal Financial Tracker"
git branch -M main
```

### 2. Push to Git Repository

#### GitHub:
```bash
git remote add origin https://github.com/yourusername/financial-tracker.git
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your Git repository
3. Select your Git provider and authorize
4. Select the `financial-tracker` repository
5. Click "Import"

### 4. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

**Required:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `SECRET_KEY` - JWT secret (generate: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- `FRONTEND_URL` - Your Vercel deployment URL (e.g., `https://myapp.vercel.app`)
- `VITE_API_URL` - Set to `/api` for same-domain API calls

**Optional:**
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Default: 1440
- `ALGORITHM` - Default: HS256

### 5. Database Setup

For production, use PostgreSQL instead of SQLite:

1. Create a PostgreSQL database on:
   - AWS RDS
   - Heroku Postgres
   - Supabase (recommended)
   - Railway
   - Any other PostgreSQL provider

2. Get your connection string and add it as `DATABASE_URL` in Vercel

### 6. Deploy

After setting environment variables:

1. Click "Deploy"
2. Wait for the deployment to complete (usually 2-3 minutes)
3. Your app will be available at `https://your-project.vercel.app`

## Security Checklist

- [ ] Changed `SECRET_KEY` to a strong random string
- [ ] Set `DATABASE_URL` to a secure PostgreSQL database
- [ ] Updated `FRONTEND_URL` to your Vercel domain
- [ ] Enabled HTTPS (automatic with Vercel)
- [ ] Reviewed CORS origins in `app/core/config.py`
- [ ] Removed sensitive data from `.env.example`
- [ ] Set up proper database backups

## Troubleshooting

### 401 Unauthorized Errors
- Check that `SECRET_KEY` matches between deployments
- Verify JWT token expiration settings

### CORS Errors
- Update `FRONTEND_URL` in environment variables
- Check `CORS_ORIGINS` list in `app/core/config.py`

### Database Connection Errors
- Verify `DATABASE_URL` format
- Check database is running and accessible
- Ensure IP whitelist includes Vercel

## Rollback

To rollback to a previous deployment:
1. Go to Vercel project dashboard
2. Click "Deployments"
3. Find the previous stable deployment
4. Click the menu and select "Promote to Production"

## Monitoring

- Use Vercel Analytics
- Monitor database performance
- Set up error tracking (Sentry)
- Check logs in Vercel dashboard

## Next Steps

1. Set up a custom domain
2. Enable automatic deployments from git
3. Set up monitoring and alerting
4. Configure database backups
5. Set up CI/CD pipeline
