# Deployment Guide - Aleen Clothing

## Backend Deployment (Render.com)

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: https://github.com/Mustagiz/Aleen.git
4. Configure:
   - Name: aleen-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free

5. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = any random secret key (e.g., aleen_jwt_secret_2024)
   - `CLOUDINARY_CLOUD_NAME` = your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` = your Cloudinary API key
   - `CLOUDINARY_API_SECRET` = your Cloudinary API secret
   - `PORT` = 5001

6. Click "Create Web Service"
7. Copy the deployed URL (e.g., https://aleen-backend.onrender.com)

## Frontend Deployment (Vercel)

1. Go to https://vercel.com and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository: https://github.com/Mustagiz/Aleen.git
4. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist

5. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL + /api (e.g., https://aleen-backend.onrender.com/api)

6. Click "Deploy"
7. Your app will be live at the Vercel URL

## MongoDB Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string
6. Use it as MONGODB_URI in Render

## Cloudinary Setup

1. Go to https://cloudinary.com
2. Sign up for free account
3. Get credentials from dashboard
4. Use them in Render environment variables

## After Deployment

1. Visit your Vercel frontend URL
2. Login with: admin@aleen.com / admin123
3. Update shop settings with your details

## Quick Deploy URLs

- Backend: https://render.com/deploy
- Frontend: https://vercel.com/new
- MongoDB: https://www.mongodb.com/cloud/atlas/register
- Cloudinary: https://cloudinary.com/users/register/free
