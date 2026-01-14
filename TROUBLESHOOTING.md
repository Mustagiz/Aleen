# 🔧 TROUBLESHOOTING GUIDE

## Common Issues & Solutions

---

## 🚫 Installation Issues

### Issue: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Python/node-gyp errors during install
**Solution (Windows):**
```bash
npm install --global windows-build-tools
```

**Solution (Mac):**
```bash
xcode-select --install
```

---

## 🗄️ MongoDB Issues

### Issue: MongoDB connection refused
**Symptoms:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**

1. **Check if MongoDB is running:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

2. **Verify connection string in .env:**
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/aleen-clothing

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aleen-clothing
```

3. **Check MongoDB port:**
```bash
# Windows
netstat -ano | findstr :27017

# Mac/Linux
lsof -i :27017
```

### Issue: MongoDB Atlas connection timeout
**Solutions:**
1. Whitelist your IP address in Atlas Network Access
2. Add `0.0.0.0/0` to allow all IPs (development only)
3. Check username/password in connection string
4. Ensure database name is correct

---

## 🔐 Authentication Issues

### Issue: "Invalid token" or "No token provided"
**Solutions:**
1. Check if token is stored in localStorage:
```javascript
// Browser console
localStorage.getItem('token')
```

2. Clear localStorage and login again:
```javascript
localStorage.clear()
```

3. Verify JWT_SECRET matches in backend .env

### Issue: Login fails with correct credentials
**Solutions:**
1. Check if admin user exists:
```bash
cd backend
node seed.js
```

2. Verify backend is running on correct port
3. Check browser console for CORS errors

---

## 🌐 CORS Issues

### Issue: CORS policy blocking requests
**Symptoms:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**

1. **Verify backend CORS configuration (server.js):**
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
```

2. **Check frontend API URL (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

3. **For production, update CORS origin:**
```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

---

## 📷 Image Upload Issues

### Issue: Cloudinary upload fails
**Solutions:**

1. **Verify Cloudinary credentials in .env:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. **Check file size (free tier limit: 10MB)**

3. **Test Cloudinary connection:**
```javascript
// Add to server.js temporarily
cloudinary.api.ping().then(result => console.log(result));
```

4. **Skip images temporarily:**
- Products work without images
- Leave image field empty

### Issue: Image not displaying
**Solutions:**
1. Check if imageUrl is saved in database
2. Verify Cloudinary URL is accessible
3. Check browser console for 404 errors
4. Ensure HTTPS URLs in production

---

## 🚀 Port Issues

### Issue: Port 5000 already in use
**Symptoms:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Or change port in backend/.env:**
```env
PORT=5001
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Vite will automatically suggest another port
# Or specify in vite.config.js:
server: {
  port: 3001
}
```

---

## 📄 PDF Generation Issues

### Issue: PDF not downloading
**Solutions:**
1. Check browser console for errors
2. Verify jsPDF is installed:
```bash
npm list jspdf jspdf-autotable
```

3. Check popup blocker settings
4. Try different browser

### Issue: PDF formatting broken
**Solutions:**
1. Check sale data structure
2. Verify all required fields exist
3. Test with simple data first

---

## 📱 WhatsApp Issues

### Issue: WhatsApp link not opening
**Solutions:**
1. **Verify phone number format:**
   - ✅ Correct: +919876543210
   - ❌ Wrong: 9876543210

2. **Check if WhatsApp is installed**

3. **Test URL manually:**
```
https://wa.me/919876543210?text=Test%20message
```

4. **For desktop, ensure WhatsApp Web is logged in**

### Issue: Message not pre-filled
**Solution:**
- Check URL encoding in shareOnWhatsApp function
- Verify message format

---

## 📊 Chart Issues

### Issue: Charts not displaying
**Solutions:**
1. **Verify Chart.js installation:**
```bash
npm list chart.js react-chartjs-2
```

2. **Check data format:**
```javascript
// Data must have labels and datasets
const data = {
  labels: ['Jan', 'Feb'],
  datasets: [{
    data: [100, 200]
  }]
};
```

3. **Import Chart.js components:**
```javascript
import { Chart as ChartJS, ... } from 'chart.js';
ChartJS.register(...);
```

---

## 🎨 Styling Issues

### Issue: Tailwind classes not working
**Solutions:**
1. **Verify Tailwind is configured:**
```bash
# Check if these files exist
tailwind.config.js
postcss.config.js
```

2. **Check index.css imports:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. **Restart dev server:**
```bash
npm run dev
```

### Issue: Custom colors not working
**Solution:**
Check tailwind.config.js:
```javascript
theme: {
  extend: {
    colors: {
      maroon: '#8B0000',
      gold: '#D4AF37',
      cream: '#FFFDD0',
    },
  },
}
```

---

## 🔄 State Management Issues

### Issue: Data not updating after CRUD operation
**Solutions:**
1. Check if fetchProducts/fetchReports is called after operation
2. Verify API response
3. Check React state updates
4. Use React DevTools to inspect state

### Issue: Cart not updating
**Solutions:**
1. Check cart state in Sales component
2. Verify product IDs match
3. Check quantity validation logic

---

## 🚀 Deployment Issues

### Issue: Vercel build fails
**Solutions:**
1. **Check build logs for errors**
2. **Verify package.json scripts:**
```json
"scripts": {
  "build": "vite build"
}
```

3. **Check environment variables are set**
4. **Ensure all dependencies are in package.json**

### Issue: Render deployment fails
**Solutions:**
1. **Check build logs**
2. **Verify start command:**
```json
"scripts": {
  "start": "node server.js"
}
```

3. **Ensure all environment variables are set**
4. **Check Node version compatibility**

### Issue: Frontend can't connect to backend
**Solutions:**
1. **Verify VITE_API_URL in Vercel:**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

2. **Check backend CORS allows frontend domain**
3. **Verify backend is running (check Render logs)**
4. **Test API endpoint directly:**
```bash
curl https://your-backend.onrender.com/api/products
```

---

## 💾 Database Issues

### Issue: Data not persisting
**Solutions:**
1. Check MongoDB connection
2. Verify save() is called
3. Check for validation errors
4. Use try-catch to log errors

### Issue: Duplicate key error
**Symptoms:** `E11000 duplicate key error`

**Solutions:**
1. Check unique fields (email, invoiceNumber)
2. Drop collection and recreate:
```javascript
// MongoDB shell
db.users.drop()
```

3. Re-run seed script

---

## 🐛 General Debugging

### Check Backend Logs
```bash
cd backend
npm run dev
# Watch console for errors
```

### Check Frontend Console
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Test API Endpoints
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aleen.com","password":"admin123"}'

# Test products (with token)
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Clear Everything and Start Fresh
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear browser data
# DevTools > Application > Clear storage
```

---

## 📞 Still Having Issues?

### Checklist:
- [ ] Node.js version 18+ installed
- [ ] MongoDB running
- [ ] All dependencies installed
- [ ] .env files configured
- [ ] Ports 3000 and 5000 available
- [ ] No firewall blocking connections
- [ ] Browser cache cleared

### Debug Steps:
1. Check all error messages carefully
2. Search error message online
3. Check GitHub issues for similar problems
4. Review code for typos
5. Test with minimal data first
6. Use console.log for debugging

### Useful Commands:
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongod --version

# List running processes
# Windows: tasklist
# Mac/Linux: ps aux

# Check network connections
# Windows: netstat -ano
# Mac/Linux: netstat -tuln
```

---

## 🎯 Prevention Tips

1. **Always check .env files** - Most issues come from misconfiguration
2. **Read error messages** - They usually tell you what's wrong
3. **Test incrementally** - Don't change too many things at once
4. **Keep dependencies updated** - But test after updates
5. **Use version control** - Git helps you revert changes
6. **Document changes** - Note what you modified
7. **Backup database** - Before major changes

---

## 📚 Additional Resources

- **MongoDB Docs:** https://docs.mongodb.com
- **Express Docs:** https://expressjs.com
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Tailwind Docs:** https://tailwindcss.com
- **Chart.js Docs:** https://www.chartjs.org
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

**Remember: Most issues are configuration-related. Double-check your .env files!**
