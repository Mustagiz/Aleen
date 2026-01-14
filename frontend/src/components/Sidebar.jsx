import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, BarChart3, FileText, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const links = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/sales', icon: ShoppingCart, label: 'Sales' },
    { path: '/sales-report', icon: FileText, label: 'Sales Report' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="bg-maroon text-white w-64 min-h-screen p-6 flex flex-col fixed left-0 top-0 bottom-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gold">Aleen Clothing</h1>
        <p className="text-cream text-sm">Admin Panel</p>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {links.map(({ path, icon: Icon, label }) => (
          <Link key={path} to={path} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${location.pathname === path ? 'bg-gold text-maroon' : 'hover:bg-red-900'}`}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      
      <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900 transition mt-4">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}
