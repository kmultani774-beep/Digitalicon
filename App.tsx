
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './views/Home';
import ProductDetails from './views/ProductDetails';
import UserDashboard from './views/UserDashboard';
import AdminPanel from './views/AdminPanel';
import { User, Product, AuthState, UserRole } from './types';
import { mockService } from './services/mockService';
import { jwtDecode } from 'jwt-decode';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'product-details' | 'dashboard' | 'admin' | 'login' | 'register'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [products, setProducts] = useState<Product[]>([]);

  // Auth form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    mockService.init();
    const user = mockService.getCurrentUser();
    if (user) {
      setAuth({ user, isAuthenticated: true, isLoading: false });
      if (user.role === UserRole.ADMIN && view === 'home') {
        setView('admin');
      }
    } else {
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
    }
    loadProducts();
    initGoogleAuth();
  }, []);

  const initGoogleAuth = () => {
    // Note: In production, you would use a real Client ID.
    // This handles the real Google Identity popup logic.
    // Fixed: Accessing window.google using type assertion to satisfy TypeScript
    const google = (window as any).google;
    if (google) {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Simulated placeholder
        callback: handleGoogleResponse,
        auto_select: false,
      });
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      const decoded: any = jwtDecode(response.credential);
      const user = await mockService.loginWithGoogle({
        name: decoded.name,
        email: decoded.email,
        sub: decoded.sub
      });
      setAuth({ user, isAuthenticated: true, isLoading: false });
      setView('home');
    } catch (error) {
      console.error("Google Auth failed", error);
    }
  };

  const loadProducts = async () => {
    const data = await mockService.getProducts();
    setProducts(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await mockService.login(email, password);
    if (user) {
      setAuth({ user, isAuthenticated: true, isLoading: false });
      setView(user.role === UserRole.ADMIN ? 'admin' : 'home');
      setEmail('');
      setPassword('');
    } else {
      alert('Invalid credentials. Hint: Admin uses password "admin786"');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await mockService.register(name, email);
    setAuth({ user, isAuthenticated: true, isLoading: false });
    setView('home');
    setName('');
    setEmail('');
  };

  const handleLogout = () => {
    mockService.logout();
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
    setView('home');
  };

  // Google Login Button Component
  const GoogleLoginButton = () => {
    const btnRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
      // Fixed: Accessing window.google using type assertion to satisfy TypeScript
      const google = (window as any).google;
      if (google && btnRef.current) {
        google.accounts.id.renderButton(btnRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          shape: "pill",
          text: "continue_with"
        });
      }
    }, []);
    return <div ref={btnRef} className="google-btn-container w-full" />;
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <Home onProductClick={(id) => { setSelectedProductId(id); setView('product-details'); }} />
        );
      case 'product-details':
        const product = products.find(p => p.id === selectedProductId);
        return product ? (
          <ProductDetails 
            product={product} 
            user={auth.user} 
            onBack={() => setView('home')} 
            onNavigate={(path) => setView(path as any)}
          />
        ) : <div className="text-center py-20">Product not found</div>;
      case 'dashboard':
        return auth.user ? <UserDashboard user={auth.user} /> : <div className="p-20 text-center">Please login first</div>;
      case 'admin':
        return auth.user?.role === UserRole.ADMIN ? <AdminPanel onLogout={handleLogout} /> : <div className="p-20 text-center font-bold text-red-500">Unauthorized Access</div>;
      case 'login':
        return (
          <div className="max-w-md mx-auto my-20 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-50 animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-gray-900 mb-4 text-center tracking-tight">Welcome Back</h2>
            <p className="text-center text-slate-400 font-bold mb-8 text-sm">Secure Sign-in to your Library</p>
            
            <div className="mb-8">
              <GoogleLoginButton />
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-xs font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">Or use email</span></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all font-bold"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all font-bold"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                Continue to Dashboard
              </button>
            </form>
            <p className="mt-8 text-center text-gray-500 font-medium">
              New here? <button onClick={() => setView('register')} className="text-indigo-600 font-bold hover:underline">Join DigiMart Pro</button>
            </p>
          </div>
        );
      case 'register':
        return (
          <div className="max-w-md mx-auto my-20 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-50 animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-gray-900 mb-4 text-center tracking-tight">Create Account</h2>
            <p className="text-center text-slate-400 font-bold mb-8 text-sm">Join thousands of digital creators</p>

            <div className="mb-8">
              <GoogleLoginButton />
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-xs font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">Or use email</span></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold"
                  placeholder="john@gmail.com"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                Create Free Account
              </button>
            </form>
            <p className="mt-8 text-center text-gray-500 font-medium">
              Already a member? <button onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">Login here</button>
            </p>
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
