import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Saree', 'Kurti', 'Lehenga', 'Dupatta', 'Salwar', 'Other'] },
  size: { type: String, required: true },
  color: { type: String, required: true },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  imageUrl: { type: String, default: '' },
  lowStockAlert: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  this.lowStockAlert = this.stock < 5;
  next();
});

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
    costPrice: Number
  }],
  subtotal: { type: Number, required: true },
  gstRate: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  profit: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model('Product', productSchema);
export const Sale = mongoose.model('Sale', saleSchema);
