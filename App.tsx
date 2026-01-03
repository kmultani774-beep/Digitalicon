
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './views/Home';
import ProductDetails from './views/ProductDetails';
import UserDashboard from './views/UserDashboard';
import AdminPanel from './views/AdminPanel';
import { User, Product, AuthState, UserRole } from './types';
import { mockService } from './services/mockService';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'product-details' | 'dashboard' | 'admin' | 'login'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [products, setProducts] = useState<Product[]>([]);

  // Admin Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    mockService.init();
    const user = mockService.getCurrentUser();
    if (user && user.role === UserRole.ADMIN) {
      setAuth({ user, isAuthenticated: true, isLoading: false });
    } else {
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await mockService.getProducts();
    setProducts(data);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await mockService.login(email, password);
    if (user && user.role === UserRole.ADMIN) {
      setAuth({ user, isAuthenticated: true, isLoading: false });
      setView('admin');
      setEmail('');
      setPassword('');
    } else {
      alert('Access Denied. Incorrect admin credentials.');
    }
  };

  const handleLogout = () => {
    mockService.logout();
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
    setView('home');
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home onProductClick={(id) => { setSelectedProductId(id); setView('product-details'); }} />;
      case 'product-details':
        const product = products.find(p => p.id === selectedProductId);
        return product ? (
          <ProductDetails 
            product={product} 
            user={auth.user} 
            onBack={() => setView('home')} 
            onNavigate={(path) => { setView(path as any); loadProducts(); }}
          />
        ) : <div className="text-center py-20 font-bold">Product not found.</div>;
      case 'dashboard':
        return <UserDashboard />;
      case 'admin':
        return auth.user?.role === UserRole.ADMIN ? <AdminPanel onLogout={handleLogout} /> : <div className="p-20 text-center font-black">Unauthorized.</div>;
      case 'login':
        return (
          <div className="max-w-md mx-auto my-20 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-50 animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-gray-900 mb-2 text-center">Admin Portal</h2>
            <p className="text-center text-slate-400 font-bold mb-10 text-sm">Secure access for site administrators</p>
            
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all font-bold"
                  placeholder="admin@digimart.pro"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all font-bold"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all">
                Enter Admin Panel
              </button>
            </form>
          </div>
        );
      default:
        return <Home onProductClick={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {view !== 'admin' && <Navbar user={auth.user} onLogout={handleLogout} onNavigate={setView} />}
      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
