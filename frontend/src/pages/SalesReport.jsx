import { useState, useEffect } from 'react';
import { salesAPI, productAPI } from '../api';
import { Calendar, Filter, Download, FileDown, Trash2 } from 'lucide-react';
import { downloadInvoice } from '../utils/pdfGenerator';

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [filteredSales, setFilteredSales] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterSales();
  }, [sales, startDate, endDate, selectedProduct, invoiceNumber]);

  const fetchSales = async () => {
    try {
      const { data } = await salesAPI.getAll({});
      setSales(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll({});
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterSales = () => {
    let filtered = [...sales];

    if (startDate) {
      filtered = filtered.filter(sale => new Date(sale.saleDate) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(sale => new Date(sale.saleDate) <= new Date(endDate));
    }

    if (selectedProduct) {
      filtered = filtered.filter(sale => 
        sale.items.some(item => item.name.toLowerCase().includes(selectedProduct.toLowerCase()))
      );
    }

    if (invoiceNumber) {
      filtered = filtered.filter(sale => 
        sale.invoiceNumber.toLowerCase().includes(invoiceNumber.toLowerCase())
      );
    }

    setFilteredSales(filtered);
  };

  const downloadCSV = () => {
    const headers = ['Invoice', 'Date', 'Time', 'Customer Name', 'Customer Phone', 'Items', 'Subtotal', 'GST', 'Discount', 'Total', 'Profit'];
    const rows = filteredSales.map(sale => [
      sale.invoiceNumber,
      new Date(sale.saleDate).toLocaleDateString('en-IN'),
      new Date(sale.saleDate).toLocaleTimeString('en-IN'),
      sale.customerName,
      sale.customerPhone,
      sale.items.map(item => `${item.name} x${item.quantity}`).join('; '),
      sale.subtotal.toFixed(2),
      sale.gstAmount.toFixed(2),
      sale.discount.toFixed(2),
      sale.total.toFixed(2),
      sale.profit.toFixed(2)
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sales_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteSale = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale? This action cannot be undone.')) {
      try {
        await salesAPI.delete(id);
        fetchSales();
        alert('Sale deleted successfully');
      } catch (err) {
        alert('Error deleting sale');
      }
    }
  };

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-maroon">Sales Report</h1>
        <button onClick={downloadCSV} className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center">
          <FileDown size={20} />
          <span>Download CSV</span>
        </button>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Invoice Number</label>
            <input type="text" placeholder="Search invoice..." value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Filter by Item</label>
            <input type="text" placeholder="Search item name..." value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="input-field" />
          </div>
        </div>
        <button onClick={() => { setStartDate(''); setEndDate(''); setSelectedProduct(''); setInvoiceNumber(''); }} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-green-600 to-green-800 text-white">
          <p className="text-green-100 text-sm">Total Sales</p>
          <p className="text-3xl font-bold">₹{totalSales.toFixed(2)}</p>
          <p className="text-sm">{filteredSales.length} transactions</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-600 to-purple-800 text-white">
          <p className="text-purple-100 text-sm">Items Sold</p>
          <p className="text-3xl font-bold">{filteredSales.reduce((sum, sale) => sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0)}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Sales Transactions</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 font-medium">Show:</label>
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={filteredSales.length}>All</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-maroon text-white">
              <tr>
                <th className="p-3 text-left">Invoice</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.map((sale) => (
                <tr key={sale._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{sale.invoiceNumber}</td>
                  <td className="p-3">{new Date(sale.saleDate).toLocaleDateString('en-IN')} {new Date(sale.saleDate).toLocaleTimeString('en-IN')}</td>
                  <td className="p-3">
                    <div>{sale.customerName}</div>
                    <div className="text-sm text-gray-600">{sale.customerPhone}</div>
                  </td>
                  <td className="p-3">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 text-right font-semibold text-green-600">₹{sale.total.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => downloadInvoice(sale)} className="bg-maroon text-white px-3 py-1 rounded hover:bg-red-900">
                        <Download size={16} className="inline" />
                      </button>
                      <button onClick={() => handleDeleteSale(sale._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                        <Trash2 size={16} className="inline" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {currentSales.map((sale) => (
            <div key={sale._id} className="border border-gray-300 rounded-lg p-3 bg-white shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-bold text-maroon text-sm">{sale.invoiceNumber}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(sale.saleDate).toLocaleDateString('en-IN')} • {new Date(sale.saleDate).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => downloadInvoice(sale)} className="bg-maroon text-white p-1.5 rounded hover:bg-red-900">
                    <Download size={14} />
                  </button>
                  <button onClick={() => handleDeleteSale(sale._id)} className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="mb-2 pb-2 border-b border-gray-200">
                <p className="font-semibold text-sm text-gray-800">{sale.customerName}</p>
                <p className="text-xs text-gray-600">{sale.customerPhone}</p>
              </div>
              
              <div className="mb-2 bg-cream p-2 rounded text-xs">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-0.5">
                    <span className="text-gray-800">{item.name}</span>
                    <span className="text-gray-600 font-medium">×{item.quantity} @ ₹{item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-semibold text-gray-800">₹{sale.subtotal.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-gray-500">GST ({sale.gstRate}%)</p>
                  <p className="font-semibold text-gray-800">₹{sale.gstAmount.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-gray-500">Discount</p>
                  <p className="font-semibold text-gray-800">₹{sale.discount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-bold text-green-600 text-lg">₹{sale.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-8 text-gray-500">No sales found</div>
        )}

        {filteredSales.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredSales.length)}</span> of <span className="font-semibold text-gray-900">{filteredSales.length}</span> entries
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage === i + 1 
                        ? 'bg-maroon text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}>
                      {i + 1}
                    </button>
                  )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                </div>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
