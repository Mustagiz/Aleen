import { useState, useEffect } from 'react';
import { Store, Upload, Key } from 'lucide-react';
import axios from 'axios';

export default function Settings() {
  const [settings, setSettings] = useState({
    shopName: 'Aleen Clothing',
    ownerName: '',
    phone: '+91 98765 43210',
    email: '',
    address: 'Baba Jaan Chawk, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '',
    gstNumber: '',
    upiId: 'aleenclothing@paytm',
    logo: '',
    tagline: 'Empowering Indian Women'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('shopSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const handleSave = () => {
    localStorage.setItem('shopSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({...settings, logo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/auth/reset-password`, 
        { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-maroon mb-6">Shop Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Store size={24} className="text-maroon" />
              <span>Business Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Shop Name *</label>
                <input type="text" value={settings.shopName} onChange={(e) => setSettings({...settings, shopName: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Owner Name</label>
                <input type="text" value={settings.ownerName} onChange={(e) => setSettings({...settings, ownerName: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} className="input-field" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Tagline</label>
                <input type="text" value={settings.tagline} onChange={(e) => setSettings({...settings, tagline: e.target.value})} className="input-field" placeholder="e.g., Empowering Indian Women" />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Address Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Address *</label>
                <input type="text" value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} className="input-field" placeholder="Street address" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">City *</label>
                  <input type="text" value={settings.city} onChange={(e) => setSettings({...settings, city: e.target.value})} className="input-field" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">State *</label>
                  <input type="text" value={settings.state} onChange={(e) => setSettings({...settings, state: e.target.value})} className="input-field" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Pincode</label>
                  <input type="text" value={settings.pincode} onChange={(e) => setSettings({...settings, pincode: e.target.value})} className="input-field" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Tax & Payment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">GST Number</label>
                <input type="text" value={settings.gstNumber} onChange={(e) => setSettings({...settings, gstNumber: e.target.value})} className="input-field" placeholder="27XXXXX1234X1ZX" />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">UPI ID</label>
                <input type="text" value={settings.upiId} onChange={(e) => setSettings({...settings, upiId: e.target.value})} className="input-field" placeholder="yourname@paytm" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Shop Logo</h2>
            
            <div className="text-center">
              {settings.logo ? (
                <img src={settings.logo} alt="Shop Logo" className="w-48 h-48 object-contain mx-auto mb-4 border rounded-lg" />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mx-auto mb-4 border rounded-lg">
                  <Store size={64} className="text-gray-400" />
                </div>
              )}
              
              <label className="btn-secondary cursor-pointer inline-flex items-center space-x-2">
                <Upload size={20} />
                <span>Upload Logo</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              <p className="text-sm text-gray-500 mt-2">Recommended: 500x500px, PNG/JPG</p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-maroon to-red-900 text-white">
            <h3 className="font-semibold mb-2">Preview</h3>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-gold">{settings.shopName}</p>
              <p className="text-cream">{settings.tagline}</p>
              <p>{settings.address}</p>
              <p>{settings.city}, {settings.state} {settings.pincode}</p>
              <p>{settings.phone}</p>
              {settings.gstNumber && <p>GST: {settings.gstNumber}</p>}
            </div>
          </div>

          <button onClick={handleSave} className="w-full btn-primary py-3 text-lg">
            Save Settings
          </button>

          <button onClick={() => setShowPasswordModal(true)} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center space-x-2">
            <Key size={20} />
            <span>Reset Password</span>
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-maroon mb-4 flex items-center space-x-2">
              <Key size={24} />
              <span>Reset Password</span>
            </h2>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Current Password</label>
                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">New Password</label>
                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="input-field" required minLength={6} />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Confirm New Password</label>
                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="input-field" required minLength={6} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 btn-primary">Update Password</button>
                <button type="button" onClick={() => { setShowPasswordModal(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
