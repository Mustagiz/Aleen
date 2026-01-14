# 📋 DEPLOYMENT CHECKLIST

## Pre-Deployment

### 1. Environment Setup
- [ ] MongoDB Atlas account created
- [ ] Cloudinary account created (free tier)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

### 2. Configuration Files
- [ ] Backend `.env` configured with production values
- [ ] Frontend `.env` configured with production API URL
- [ ] `.gitignore` includes `.env` files
- [ ] All sensitive data removed from code

### 3. Security
- [ ] JWT_SECRET changed to strong random string
- [ ] Admin password changed from default
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS configured for production domain

## Backend Deployment (Render)

### Steps:
1. [ ] Go to https://render.com and sign up
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect GitHub repository
4. [ ] Configure:
   - **Name:** aleen-clothing-api
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. [ ] Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aleen-clothing
   JWT_SECRET=your_super_secret_production_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

6. [ ] Click "Create Web Service"
7. [ ] Wait for deployment (5-10 minutes)
8. [ ] Copy the service URL (e.g., https://aleen-clothing-api.onrender.com)
9. [ ] Test API: `https://your-url.onrender.com/api/products` (should return 401)

### Seed Admin User:
```bash
# Connect to Render shell or run locally with production MongoDB URI
node seed.js
```

## Frontend Deployment (Vercel)

### Steps:
1. [ ] Go to https://vercel.com and sign up
2. [ ] Click "New Project"
3. [ ] Import GitHub repository
4. [ ] Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** dist

5. [ ] Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. [ ] Click "Deploy"
7. [ ] Wait for deployment (2-3 minutes)
8. [ ] Copy the deployment URL (e.g., https://aleen-clothing.vercel.app)

## MongoDB Atlas Setup

### Steps:
1. [ ] Go to https://www.mongodb.com/cloud/atlas
2. [ ] Sign up for free account
3. [ ] Create new cluster (Free M0 tier)
4. [ ] Click "Connect" → "Connect your application"
5. [ ] Create database user:
   - Username: aleenuser
   - Password: (generate strong password)
6. [ ] Network Access → Add IP Address:
   - [ ] Add `0.0.0.0/0` (allow from anywhere) OR
   - [ ] Add Render's IP addresses
7. [ ] Copy connection string
8. [ ] Replace `<password>` with your database password
9. [ ] Add to Render environment variables

## Cloudinary Setup

### Steps:
1. [ ] Go to https://cloudinary.com
2. [ ] Sign up for free account
3. [ ] Go to Dashboard
4. [ ] Copy:
   - Cloud Name
   - API Key
   - API Secret
5. [ ] Add to Render environment variables

## Post-Deployment Testing

### Backend Tests:
- [ ] API is accessible: `https://your-backend.onrender.com`
- [ ] Health check works (if implemented)
- [ ] Login endpoint works: POST `/api/auth/login`
- [ ] Protected routes require authentication

### Frontend Tests:
- [ ] Website loads: `https://your-frontend.vercel.app`
- [ ] Login page displays correctly
- [ ] Can login with admin credentials
- [ ] Dashboard loads with data
- [ ] Can add/edit/delete products
- [ ] Can create sales
- [ ] PDF invoice downloads
- [ ] WhatsApp sharing works
- [ ] Charts display correctly
- [ ] Mobile responsive design works

### Integration Tests:
- [ ] Frontend connects to backend API
- [ ] Image uploads work (Cloudinary)
- [ ] Database operations work (MongoDB Atlas)
- [ ] JWT authentication works
- [ ] CORS configured correctly

## Production Optimization

### Backend:
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add request validation (express-validator)
- [ ] Add logging (winston/morgan)
- [ ] Add error tracking (Sentry)
- [ ] Enable compression
- [ ] Add API documentation (Swagger)

### Frontend:
- [ ] Optimize images
- [ ] Enable lazy loading
- [ ] Add service worker (PWA)
- [ ] Add error boundaries
- [ ] Add analytics (Google Analytics)
- [ ] Add loading states

### Database:
- [ ] Create indexes for frequently queried fields
- [ ] Set up automated backups
- [ ] Monitor performance

## Monitoring & Maintenance

### Daily:
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Check database storage usage

### Weekly:
- [ ] Review sales reports
- [ ] Check low stock alerts
- [ ] Update dependencies (security patches)

### Monthly:
- [ ] Database backup verification
- [ ] Performance optimization review
- [ ] User feedback review

## Rollback Plan

If deployment fails:
1. [ ] Check Render/Vercel logs for errors
2. [ ] Verify environment variables
3. [ ] Test API endpoints manually
4. [ ] Rollback to previous deployment (Vercel/Render UI)
5. [ ] Fix issues locally and redeploy

## Custom Domain (Optional)

### Vercel:
1. [ ] Go to Project Settings → Domains
2. [ ] Add your domain (e.g., aleenclothing.com)
3. [ ] Update DNS records as instructed
4. [ ] Wait for SSL certificate (automatic)

### Render:
1. [ ] Go to Service Settings → Custom Domain
2. [ ] Add your API subdomain (e.g., api.aleenclothing.com)
3. [ ] Update DNS records
4. [ ] Update frontend VITE_API_URL

## Support & Documentation

- [ ] Update README with production URLs
- [ ] Document API endpoints
- [ ] Create user manual
- [ ] Set up support email/contact

## Cost Estimation (Free Tier Limits)

**Render (Backend):**
- Free tier: 750 hours/month
- Sleeps after 15 min inactivity
- Cold start: 30-60 seconds

**Vercel (Frontend):**
- Free tier: 100 GB bandwidth/month
- Unlimited deployments

**MongoDB Atlas:**
- Free tier: 512 MB storage
- Shared cluster

**Cloudinary:**
- Free tier: 25 GB storage
- 25 GB bandwidth/month

---

## ✅ Deployment Complete!

Your production URLs:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-api.onrender.com
- **Admin Login:** admin@aleen.com / admin123

**Remember to change the default admin password!**
