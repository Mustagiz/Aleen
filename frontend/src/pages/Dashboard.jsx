import { useState, useEffect } from 'react';
import { reportsAPI } from '../api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { TrendingUp, DollarSign, Package, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [reportData, setReportData] = useState(null);
  const [dateFilter, setDateFilter] = useState('today');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchReports();
  }, [dateFilter, customDates]);

  const getDateRange = () => {
    const now = new Date();
    let startDate, endDate = now;

    switch(dateFilter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customDates.start && customDates.end) {
          startDate = new Date(customDates.start);
          endDate = new Date(customDates.end);
        }
        break;
    }

    return { startDate: startDate?.toISOString(), endDate: endDate.toISOString() };
  };

  const fetchReports = async () => {
    try {
      const { startDate, endDate } = getDateRange();
      if (!startDate) return;
      const { data } = await reportsAPI.getDashboard({ startDate, endDate });
      setReportData(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!reportData) return <div className="p-6">Loading...</div>;

  const categoryData = {
    labels: Object.keys(reportData.categoryStats),
    datasets: [{
      data: Object.values(reportData.categoryStats),
      backgroundColor: ['#8B0000', '#D4AF37', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    }]
  };

  const salesTrendData = {
    labels: reportData.salesData.slice(-10).map(s => new Date(s.saleDate).toLocaleDateString('en-IN')),
    datasets: [{
      label: 'Sales',
      data: reportData.salesData.slice(-10).map(s => s.total),
      borderColor: '#8B0000',
      backgroundColor: 'rgba(139, 0, 0, 0.1)',
      tension: 0.4
    }]
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Sales',
      data: Array(12).fill(0).map((_, i) => {
        return reportData.salesData
          .filter(s => new Date(s.saleDate).getMonth() === i)
          .reduce((sum, s) => sum + s.total, 0);
      }),
      backgroundColor: '#D4AF37',
    }]
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-maroon">Dashboard</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={() => setDateFilter('today')} className={`px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none ${dateFilter === 'today' ? 'bg-maroon text-white' : 'bg-gray-200'}`}>Today</button>
          <button onClick={() => setDateFilter('month')} className={`px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none ${dateFilter === 'month' ? 'bg-maroon text-white' : 'bg-gray-200'}`}>Month</button>
          <button onClick={() => setDateFilter('year')} className={`px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none ${dateFilter === 'year' ? 'bg-maroon text-white' : 'bg-gray-200'}`}>Year</button>
          <button onClick={() => setDateFilter('custom')} className={`px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none ${dateFilter === 'custom' ? 'bg-maroon text-white' : 'bg-gray-200'}`}>Custom</button>
        </div>
      </div>

      {dateFilter === 'custom' && (
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input type="date" value={customDates.start} onChange={(e) => setCustomDates({...customDates, start: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">End Date</label>
              <input type="date" value={customDates.end} onChange={(e) => setCustomDates({...customDates, end: e.target.value})} className="input-field" />
            </div>
          </div>
          <button onClick={fetchReports} className="mt-4 btn-primary">
            Apply Filter
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-maroon to-red-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cream text-sm">Total Sales</p>
              <p className="text-3xl font-bold">₹{reportData.totalSales.toFixed(2)}</p>
            </div>
            <DollarSign size={40} className="text-gold" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-600 to-green-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Profit</p>
              <p className="text-3xl font-bold">₹{reportData.totalProfit.toFixed(2)}</p>
            </div>
            <TrendingUp size={40} className="text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Items Sold</p>
              <p className="text-3xl font-bold">{reportData.itemsSold}</p>
            </div>
            <Package size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-600 to-orange-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold">{reportData.lowStockItems.length}</p>
            </div>
            <AlertTriangle size={40} className="text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
          <Line data={salesTrendData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <Pie data={categoryData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Breakdown</h2>
        <Bar data={monthlyData} options={{ responsive: true, maintainAspectRatio: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <div className="space-y-2">
            {reportData.topProducts.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="font-semibold">{product.name}</span>
                <span className="text-maroon font-bold">{product.quantity} sold</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <AlertTriangle className="text-orange-600" />
            <span>Low Stock Alert</span>
          </h2>
          <div className="space-y-2">
            {reportData.lowStockItems.map((product) => (
              <div key={product._id} className="flex justify-between items-center bg-red-50 p-3 rounded border border-red-200">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <span className="text-red-600 font-bold">{product.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
