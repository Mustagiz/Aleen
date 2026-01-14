import { useState, useEffect } from 'react';
import { productAPI, salesAPI } from '../api';
import { Trash2, Download, MessageCircle } from 'lucide-react';
import { downloadInvoice, shareOnWhatsApp } from '../utils/pdfGenerator';
import UPIQRCode from '../components/UPIQRCode';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+91');
  const [gstRate, setGstRate] = useState(5);
  const [includeGst, setIncludeGst] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [lastSale, setLastSale] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await productAPI.getAll({});
    setProducts(data.filter(p => p.stock > 0));
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product._id);
    if (existing) {
      setCart(cart.map(item => item.productId === product._id ? {...item, quantity: item.quantity + 1} : item));
    } else {
      setCart([...cart, { productId: product._id, name: product.name, price: product.sellingPrice, costPrice: product.costPrice, quantity: 1, maxStock: product.stock }]);
    }
    setSelectedProduct('');
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    if (productId) {
      const product = products.find(p => p._id === productId);
      if (product) addToCart(product);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item => item.productId === productId ? {...item, quantity: Math.min(quantity, item.maxStock)} : item));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gstAmount = includeGst ? (subtotal * gstRate) / 100 : 0;
  const total = subtotal + gstAmount - discount;

  const handleCheckout = async () => {
    if (!customerName || !customerPhone || cart.length === 0) {
      alert('Please fill all fields and add items to cart');
      return;
    }

    try {
      const { data } = await salesAPI.create({
        customerName,
        customerPhone,
        items: cart,
        subtotal,
        gstRate,
        gstAmount,
        discount,
        total
      });
      
      setLastSale(data);
      setCart([]);
      setCustomerName('');
      setCustomerPhone('+91');
      setDiscount(0);
      fetchProducts();
      alert('Sale completed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing sale');
    }
  };

  const generateUPILink = () => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=Aleen Clothing&am=${total.toFixed(2)}&cu=INR&tn=Invoice ${lastSale?.invoiceNumber || ''}`;
    window.location.href = upiUrl;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-maroon mb-6">Point of Sale</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Products</h2>
            <select value={selectedProduct} onChange={handleProductSelect} className="input-field">
              <option value="">Select a product to add...</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - {product.category} - ₹{product.sellingPrice} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          
          <div className="space-y-4 mb-4">
            <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input-field" />
            <input type="tel" placeholder="Customer Phone (with country code)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input-field" />
          </div>

          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {cart.map(item => (
              <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">₹{item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="bg-gray-300 px-2 py-1 rounded">-</button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="bg-gray-300 px-2 py-1 rounded">+</button>
                  <button onClick={() => updateQuantity(item.productId, 0)} className="text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={includeGst} onChange={(e) => setIncludeGst(e.target.checked)} className="w-4 h-4" />
                <span>Include GST</span>
              </label>
              {includeGst && (
                <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="border rounded px-2 py-1">
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                </select>
              )}
            </div>
            
            {includeGst && (
              <div className="flex justify-between">
                <span>GST Amount:</span>
                <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span>Discount:</span>
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="border rounded px-2 py-1 w-24 text-right" />
            </div>
            
            <div className="flex justify-between text-lg font-bold text-maroon border-t pt-2">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full btn-primary mt-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
            Complete Sale
          </button>

          {cart.length > 0 && total > 0 && (
            <div className="mt-4 card bg-gray-50">
              <h3 className="text-sm font-semibold mb-2 text-center">UPI Payment QR Code</h3>
              <UPIQRCode amount={total} invoiceNumber={`TEMP${Date.now()}`} />
            </div>
          )}

          {lastSale && (
            <div className="mt-4 space-y-2">
              <button onClick={() => downloadInvoice(lastSale)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Download size={20} />
                <span>Download Invoice</span>
              </button>
              <button onClick={() => shareOnWhatsApp(lastSale)} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                <MessageCircle size={20} />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
