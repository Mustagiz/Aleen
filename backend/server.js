import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User, Product, Sale } from './models.js';
import { authMiddleware } from './middleware.js';
import { upload, uploadToCloudinary } from './cloudinary.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/auth/reset-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product Routes
app.get('/api/products', authMiddleware, async (req, res) => {
  try {
    const { search, category, lowStock } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (lowStock === 'true') query.lowStockAlert = true;
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const productData = req.body;
    if (req.file) {
      productData.imageUrl = await uploadToCloudinary(req.file.buffer);
    }
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const productData = req.body;
    if (req.file) {
      productData.imageUrl = await uploadToCloudinary(req.file.buffer);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sales Routes
app.post('/api/sales', authMiddleware, async (req, res) => {
  try {
    const { customerName, customerPhone, items, subtotal, gstRate, gstAmount, discount, total } = req.body;
    
    let profit = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
      profit += (item.price - product.costPrice) * item.quantity;
    }
    
    const invoiceNumber = `INV${Date.now()}`;
    const sale = new Sale({ invoiceNumber, customerName, customerPhone, items, subtotal, gstRate, gstAmount, discount, total, profit });
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/sales', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    if (startDate && endDate) {
      query.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const sales = await Sale.find(query).sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/sales/:id', authMiddleware, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/sales/:id', authMiddleware, async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reports Routes
app.get('/api/reports/dashboard', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateQuery = {};
    if (startDate && endDate) {
      dateQuery.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sales = await Sale.find(dateQuery);
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const itemsSold = sales.reduce((sum, sale) => sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0);

    const categoryStats = {};
    const productStats = {};
    
    for (const sale of sales) {
      for (const item of sale.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          categoryStats[product.category] = (categoryStats[product.category] || 0) + item.quantity;
          productStats[item.name] = (productStats[item.name] || 0) + item.quantity;
        }
      }
    }

    const topProducts = Object.entries(productStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    const lowStockItems = await Product.find({ lowStockAlert: true }).limit(10);

    res.json({
      totalSales,
      totalProfit,
      itemsSold,
      categoryStats,
      topProducts,
      lowStockItems,
      salesData: sales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
