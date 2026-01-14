import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(lang === 'en' ? 'Invalid credentials' : 'अमान्य प्रमाण पत्र');
    }
  };

  const text = {
    en: {
      title: 'Aleen Clothing',
      subtitle: 'Empowering Indian Women',
      login: 'Admin Login',
      email: 'Email',
      password: 'Password',
      submit: 'Login',
    },
    hi: {
      title: 'अलीन क्लोथिंग',
      subtitle: 'भारतीय महिलाओं को सशक्त बनाना',
      login: 'व्यवस्थापक लॉगिन',
      email: 'ईमेल',
      password: 'पासवर्ड',
      submit: 'लॉगिन करें',
    }
  };

  const t = text[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon via-red-900 to-maroon flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="bg-gold text-maroon px-4 py-2 rounded-lg font-semibold">
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-maroon mb-2">{t.title}</h1>
          <p className="text-gold text-lg italic">{t.subtitle}</p>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">{t.login}</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">{t.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">{t.password}</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="w-full btn-primary py-3 text-lg font-semibold">
            {t.submit}
          </button>
        </form>
        
        <p className="text-sm text-gray-500 mt-6 text-center">
          Demo: admin@aleen.com / admin123
        </p>
      </div>
    </div>
  );
}
