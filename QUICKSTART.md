# 🚀 QUICK START GUIDE - Aleen Clothing

## ⚡ 5-Minute Setup (Local Development)

### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Start MongoDB
```bash
# Option A: Local MongoDB
mongod

# Option B: Use MongoDB Atlas (free)
# Sign up at https://www.mongodb.com/cloud/atlas
# Get connection string and add to backend/.env
```

### Step 3: Configure Cloudinary (Optional for images)
```bash
# Sign up at https://cloudinary.com (free)
# Add credentials to backend/.env:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# OR skip for now - app works without images
```

### Step 4: Create Admin User
```bash
cd backend
node seed.js
```

### Step 5: Start Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 6: Login
- Open: http://localhost:3000
- Email: admin@aleen.com
- Password: admin123

## 🎯 First Steps After Login

1. **Add Products** (Inventory page)
   - Click "Add Product"
   - Fill details: Name, Category, Size, Color, Prices, Stock
   - Upload image (optional)
   - Save

2. **Make a Sale** (Sales page)
   - Click products to add to cart
   - Enter customer name and phone (with country code: +919876543210)
   - Adjust quantities
   - Select GST rate (5% or 12%)
   - Add discount (optional)
   - Click "Complete Sale"

3. **Download/Share Invoice**
   - After sale, click "Download Invoice" for PDF
   - Click "Share on WhatsApp" to send via WhatsApp

4. **View Reports** (Dashboard)
   - See sales metrics, charts, top products
   - Filter by date: Today, This Month, This Year, Custom
   - Monitor low stock items

## 📱 WhatsApp Setup

**Important:** Customer phone must include country code!

✅ Correct: +919876543210
❌ Wrong: 9876543210

## 🌐 Deploy to Production

### Backend (Render - Free)
1. Push code to GitHub
2. Go to https://render.com
3. New Web Service → Connect repo
4. Root: `backend`
5. Build: `npm install`
6. Start: `npm start`
7. Add environment variables
8. Deploy

### Frontend (Vercel - Free)
1. Go to https://vercel.com
2. New Project → Import repo
3. Root: `frontend`
4. Framework: Vite
5. Add env: `VITE_API_URL=https://your-backend.onrender.com/api`
6. Deploy

### Database (MongoDB Atlas - Free)
1. https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create user + whitelist IP (0.0.0.0/0)
4. Get connection string
5. Add to Render env vars

## 🔧 Common Issues

**Port 5000 in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**MongoDB not connecting:**
- Check if MongoDB is running: `mongod`
- Verify MONGODB_URI in .env

**Images not uploading:**
- Add Cloudinary credentials to .env
- Or skip images for now

## 📞 Need Help?

Check README.md for:
- Detailed documentation
- API endpoints
- Troubleshooting
- Customization guide

---

**You're ready to go! 🎉**
