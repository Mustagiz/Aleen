import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, BarChart3, FileText, Settings, LogOut } from 'lucide-react';

export default function MobileNav() {
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
    { path: '/sales-report', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {links.map(({ path, icon: Icon, label }) => (
          <Link key={path} to={path} className={`flex flex-col items-center justify-center flex-1 h-full ${location.pathname === path ? 'text-maroon' : 'text-gray-600'}`}>
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
        <button onClick={handleLogout} className="flex flex-col items-center justify-center flex-1 h-full text-gray-600">
          <LogOut size={20} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </div>
  );
}
