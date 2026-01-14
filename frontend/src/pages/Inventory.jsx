import { useState, useEffect } from 'react';
import { productAPI } from '../api';
import { Plus, Edit, Trash2, Search, AlertTriangle, Settings } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '', category: 'Saree', size: '', color: '', costPrice: '', sellingPrice: '', stock: '', productCode: ''
  });
  const [categories, setCategories] = useState(['Saree', 'Kurti', 'Lehenga', 'Dupatta', 'Salwar', 'Other']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  useEffect(() => {
    const saved = localStorage.getItem('categories');
    if (saved) setCategories(JSON.parse(saved));
    
    const handleStorageChange = () => {
      const saved = localStorage.getItem('categories');
      if (saved) setCategories(JSON.parse(saved));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll({ search, category });
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct._id, formData);
      } else {
        await productAPI.create(formData);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', category: categories[0] || 'Saree', size: '', color: '', costPrice: '', sellingPrice: '', stock: '', productCode: '' });
      fetchProducts();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await productAPI.delete(id);
      fetchProducts();
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem('categories', JSON.stringify(updated));
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (cat) => {
    if (window.confirm(`Delete category "${cat}"?`)) {
      const updated = categories.filter(c => c !== cat);
      setCategories(updated);
      localStorage.setItem('categories', JSON.stringify(updated));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-maroon">Inventory Management</h1>
        <button onClick={() => { setShowModal(true); setEditingProduct(null); setFormData({ name: '', category: categories[0] || 'Saree', size: '', color: '', costPrice: '', sellingPrice: '', stock: '', productCode: '' }); }} className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center">
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-full sm:w-48">
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={() => setShowCategoryModal(true)} className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2">
              <Settings size={18} />
              <span className="hidden sm:inline">Manage</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 font-medium">Show:</label>
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon">
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={products.length}>All</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentProducts.map(product => (
          <div key={product._id} className="card hover:shadow-lg transition-shadow">
            <h3 className="text-base font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
            <div className="space-y-1.5 text-xs mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold text-gray-800">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size/Color:</span>
                <span className="font-semibold text-gray-800">{product.size} | {product.color}</span>
              </div>
              <div className="flex justify-between border-t pt-1.5">
                <span className="text-gray-600">Cost/Sell:</span>
                <span className="font-semibold text-gray-800">₹{product.costPrice} / ₹{product.sellingPrice}</span>
              </div>
              <div className={`flex justify-between items-center border-t pt-1.5 ${product.lowStockAlert ? 'text-red-600' : 'text-green-600'}`}>
                <span className="font-semibold">Stock:</span>
                <span className="font-bold flex items-center gap-1">
                  {product.stock}
                  {product.lowStockAlert && <AlertTriangle size={14} />}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(product)} className="flex-1 bg-blue-600 text-white px-2 py-1.5 rounded text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1">
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button onClick={() => handleDelete(product._id)} className="flex-1 bg-red-600 text-white px-2 py-1.5 rounded text-xs hover:bg-red-700 transition flex items-center justify-center gap-1">
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, products.length)}</span> of <span className="font-semibold text-gray-900">{products.length}</span> products
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-maroon mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" required />
              <input type="text" placeholder="Product Code" value={formData.productCode} onChange={(e) => setFormData({...formData, productCode: e.target.value})} className="input-field" required />
              <select key={categories.join(',')} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input-field" required>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Size" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="input-field" required />
                <input type="text" placeholder="Color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Cost Price" value={formData.costPrice} onChange={(e) => setFormData({...formData, costPrice: e.target.value})} className="input-field" required />
                <input type="number" placeholder="Selling Price" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} className="input-field" required />
              </div>
              <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="input-field" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 btn-primary">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-maroon mb-4">Manage Categories</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="input-field flex-1" />
                <button onClick={handleAddCategory} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map(cat => (
                  <div key={cat} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{cat}</span>
                    <button onClick={() => handleDeleteCategory(cat)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowCategoryModal(false)} className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
