
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingBag, Package, LayoutGrid, Plus, Edit3, Trash2, DollarSign, 
  Clock, LogOut, ShieldAlert, X, Save, FileText, Code, Search, 
  ArrowLeft, MessageCircle, Download, Star, Rocket, Zap, CheckCircle2, Copy, Menu
} from 'lucide-react';

// --- CONSTANTS & TYPES ---
const WHATSAPP_NUMBER = '923264236393';

enum Category {
  SOFTWARE = 'Software',
  TEMPLATES = 'Templates',
  EBOOKS = 'Ebooks',
  COURSES = 'Courses'
}

enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID'
}

interface SourceFile {
  filename: string;
  content: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  discountPrice?: number;
  category: Category;
  fileUrl: string;
  sourceCode: SourceFile[];
  rating: number;
  status: 'Active' | 'Inactive';
}

interface Order {
  id: string;
  productName: string;
  productId: string;
  orderNumber: string;
  amount: number;
  status: OrderStatus;
  customerPhone: string;
  createdAt: string;
}

// --- MOCK SERVICE (LocalStorage) ---
const mockService = {
  init: () => {
    if (!localStorage.getItem('dm_products')) {
      const initial = [
        {
          id: 'p1', title: 'Ultimate React Dashboard', description: 'Premium admin template with dark mode.',
          images: ['https://picsum.photos/seed/d1/800/600'], price: 49, category: Category.TEMPLATES,
          fileUrl: '#', sourceCode: [{ filename: 'App.js', content: 'console.log("Hello World");' }],
          rating: 4.8, status: 'Active'
        }
      ];
      localStorage.setItem('dm_products', JSON.stringify(initial));
    }
    if (!localStorage.getItem('dm_orders')) localStorage.setItem('dm_orders', JSON.stringify([]));
  },
  getProducts: () => JSON.parse(localStorage.getItem('dm_products') || '[]'),
  saveProducts: (p: Product[]) => localStorage.setItem('dm_products', JSON.stringify(p)),
  getOrders: () => JSON.parse(localStorage.getItem('dm_orders') || '[]'),
  saveOrders: (o: Order[]) => localStorage.setItem('dm_orders', JSON.stringify(o))
};

// --- COMPONENTS ---

const Navbar = ({ onNavigate, isAdmin }: { onNavigate: (v: any) => void, isAdmin: boolean }) => (
  <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
        <div className="bg-indigo-600 text-white p-2 rounded-lg font-black text-xl mr-2">D</div>
        <span className="text-2xl font-black text-gray-900">DigiMart<span className="text-indigo-600">Pro</span></span>
      </div>
      <div className="flex items-center space-x-6">
        <button onClick={() => onNavigate('dashboard')} className="text-gray-600 font-bold hover:text-indigo-600 flex items-center">
          <ShoppingBag className="mr-2" size={18} /> My Library
        </button>
        {isAdmin ? (
          <button onClick={() => onNavigate('admin')} className="bg-slate-900 text-white px-5 py-2 rounded-xl font-black text-sm">Admin</button>
        ) : (
          <button onClick={() => onNavigate('login')} className="text-slate-400 font-bold hover:text-indigo-600">Admin Login</button>
        )}
      </div>
    </div>
  </nav>
);

const UserDashboard = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [viewingFileIdx, setViewingFileIdx] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const id = params.get('id');
    if (id) { setOrderId(id); handleSearch(id); }
  }, []);

  const handleSearch = (id?: string) => {
    const searchId = id || orderId;
    const orders = mockService.getOrders();
    const found = orders.find((o: Order) => o.orderNumber === searchId);
    if (found) {
      setOrder(found);
      const prod = mockService.getProducts().find((p: Product) => p.id === found.productId);
      setProduct(prod || null);
    } else if (!id) alert('Order not found!');
  };

  return (
    <div className="max-w-5xl mx-auto p-8 animate-fade">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">Access Your Assets</h2>
        <div className="flex max-w-md mx-auto bg-white p-2 rounded-2xl shadow-xl border">
          <input value={orderId} onChange={e => setOrderId(e.target.value.toUpperCase())} placeholder="ORDER ID (e.g. DIGI-1234)" className="flex-grow px-4 font-bold outline-none" />
          <button onClick={() => handleSearch()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black"><Search size={20} /></button>
        </div>
      </div>

      {order ? (
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border">
          <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black">{order.productName}</h3>
              <p className="text-indigo-600 font-mono font-bold">{order.orderNumber}</p>
            </div>
            <div className={`px-4 py-1 rounded-full text-xs font-black ${order.status === OrderStatus.PAID ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
              {order.status === OrderStatus.PAID ? 'VERIFIED' : 'PENDING'}
            </div>
          </div>
          {order.status === OrderStatus.PAID && product ? (
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Files</p>
                  {product.sourceCode.map((f, i) => (
                    <button key={i} onClick={() => setViewingFileIdx(i)} className={`w-full text-left p-4 rounded-xl font-bold text-sm ${viewingFileIdx === i ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>
                      {f.filename}
                    </button>
                  ))}
                </div>
                <div className="md:col-span-3">
                  {product.sourceCode[viewingFileIdx] ? (
                    <div className="bg-slate-900 rounded-2xl overflow-hidden">
                      <div className="bg-slate-800 p-3 flex justify-between items-center px-6">
                        <span className="text-indigo-300 font-mono text-xs">{product.sourceCode[viewingFileIdx].filename}</span>
                        <button onClick={() => { navigator.clipboard.writeText(product.sourceCode[viewingFileIdx].content); alert('Copied!'); }} className="text-white bg-slate-700 px-3 py-1 rounded text-xs">Copy</button>
                      </div>
                      <pre className="p-6 text-emerald-400 font-mono text-xs overflow-x-auto"><code>{product.sourceCode[viewingFileIdx].content}</code></pre>
                    </div>
                  ) : <div className="p-12 text-center text-slate-400">No source files.</div>}
                </div>
              </div>
              <a href={product.fileUrl} target="_blank" className="block w-full bg-indigo-600 text-white text-center py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-indigo-700">
                <Download className="inline mr-2" /> Download Full Package (ZIP)
              </a>
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
              <Clock size={48} className="mx-auto text-amber-500" />
              <p className="text-xl font-bold">Waiting for payment verification...</p>
              <p className="text-slate-400">Please send your payment screenshot to WhatsApp.</p>
              <button onClick={() => handleSearch()} className="text-indigo-600 font-black underline">Refresh Status</button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [products, setProducts] = useState<Product[]>(mockService.getProducts());
  const [orders, setOrders] = useState<Order[]>(mockService.getOrders());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ title: '', description: '', price: 0, category: Category.SOFTWARE, imageUrl: '', fileUrl: '', sourceCode: [] });

  const save = () => {
    const newProducts = editingId 
      ? products.map(p => p.id === editingId ? { ...p, ...formData } : p)
      : [...products, { ...formData, id: 'p' + Date.now(), rating: 5, status: 'Active', images: [formData.imageUrl] }];
    setProducts(newProducts as any);
    mockService.saveProducts(newProducts as any);
    setIsModalOpen(false);
    setEditingId(null);
  };

  const approve = (id: string) => {
    const newOrders = orders.map(o => o.id === id ? { ...o, status: OrderStatus.PAID } : o);
    setOrders(newOrders);
    mockService.saveOrders(newOrders);
    const o = newOrders.find(o => o.id === id);
    window.open(`https://wa.me/${o?.customerPhone}?text=Order Verified! Link: ${window.location.origin}/#dashboard?id=${o?.orderNumber}`);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-xl font-black mb-12">Admin Panel</h2>
        <nav className="flex-grow space-y-4">
          <button className="w-full text-left font-bold flex items-center p-3 rounded-lg bg-indigo-600"><LayoutGrid className="mr-3" /> Inventory</button>
          <button onClick={onLogout} className="w-full text-left font-bold flex items-center p-3 rounded-lg text-red-400"><LogOut className="mr-3" /> Logout</button>
        </nav>
      </aside>
      <main className="flex-grow p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black">Manage Store</h2>
          <button onClick={() => { setEditingId(null); setFormData({ title: '', description: '', price: 0, category: Category.SOFTWARE, imageUrl: '', fileUrl: '', sourceCode: [] }); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">+ Add Product</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border flex justify-between items-center">
              <div><h4 className="font-black">{p.title}</h4><p className="text-indigo-600 font-bold">${p.price}</p></div>
              <div className="flex space-x-2">
                <button onClick={() => { setEditingId(p.id); setFormData({ ...p, imageUrl: p.images[0] }); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={18} /></button>
                <button onClick={() => { const n = products.filter(x => x.id !== p.id); setProducts(n); mockService.saveProducts(n); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-black mb-6">Pending Orders</h3>
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400"><th className="p-6">Order ID</th><th className="p-6">Product</th><th className="p-6">Phone</th><th className="p-6 text-right">Action</th></tr>
            </thead>
            <tbody>
              {orders.filter(o => o.status === OrderStatus.PENDING).map(o => (
                <tr key={o.id} className="border-t">
                  <td className="p-6 font-mono font-bold">{o.orderNumber}</td>
                  <td className="p-6 font-bold">{o.productName}</td>
                  <td className="p-6 font-bold">{o.customerPhone}</td>
                  <td className="p-6 text-right"><button onClick={() => approve(o.id)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black">Verify Payment</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-black mb-8">{editingId ? 'Edit Product' : 'New Product'}</h3>
              <div className="space-y-6">
                <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border font-bold" />
                <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border font-bold h-24" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 rounded-xl border font-bold" />
                  <input placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border font-bold" />
                </div>
                <input placeholder="Download URL (ZIP)" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border font-bold" />
                
                <div className="bg-slate-900 p-6 rounded-2xl">
                  <h4 className="text-white font-black text-sm mb-4 flex justify-between items-center">
                    Source Files 
                    <button type="button" onClick={() => setFormData({...formData, sourceCode: [...formData.sourceCode, { filename: 'index.html', content: '' }]})} className="bg-indigo-600 text-[10px] px-3 py-1 rounded-lg">+ Add</button>
                  </h4>
                  {formData.sourceCode.map((f: any, i: number) => (
                    <div key={i} className="mb-4 space-y-2">
                      <div className="flex space-x-2">
                        <input value={f.filename} onChange={e => { const n = [...formData.sourceCode]; n[i].filename = e.target.value; setFormData({...formData, sourceCode: n}); }} className="flex-grow bg-slate-800 text-white p-2 rounded text-xs font-mono" />
                        <button onClick={() => { const n = formData.sourceCode.filter((_:any, j:any) => i !== j); setFormData({...formData, sourceCode: n}); }} className="text-red-400">X</button>
                      </div>
                      <textarea value={f.content} onChange={e => { const n = [...formData.sourceCode]; n[i].content = e.target.value; setFormData({...formData, sourceCode: n}); }} className="w-full bg-slate-800 text-emerald-400 p-2 rounded text-[10px] font-mono h-24" />
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button onClick={save} className="flex-grow bg-indigo-600 text-white py-5 rounded-2xl font-black">Save Product</button>
                  <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 px-8 py-5 rounded-2xl font-black">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Home = ({ onProductClick }: { onProductClick: (id: string) => void }) => {
  const products = mockService.getProducts();
  return (
    <div className="max-w-7xl mx-auto p-12 space-y-20 animate-fade">
      <header className="text-center py-20 bg-indigo-900 rounded-[4rem] text-white shadow-3xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-6xl font-black mb-6">Premium Digital Assets</h1>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">Get high-quality source code, templates, and ebooks instantly.</p>
          <a href="#store" className="bg-white text-indigo-900 px-12 py-5 rounded-full font-black text-lg shadow-2xl">Start Browsing</a>
        </div>
      </header>

      <section id="store">
        <h2 className="text-3xl font-black mb-12">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p: Product) => (
            <div key={p.id} onClick={() => onProductClick(p.id)} className="bg-white p-6 rounded-[2.5rem] border hover:shadow-2xl transition-all cursor-pointer group">
              <div className="aspect-square bg-slate-100 rounded-[2rem] mb-6 overflow-hidden">
                <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-black mb-2">{p.title}</h3>
              <p className="text-indigo-600 font-black text-2xl">${p.price}</p>
              <button className="w-full bg-slate-900 text-white mt-6 py-4 rounded-2xl font-black">Buy Now</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductDetails = ({ id, onNavigate }: { id: string, onNavigate: (v: any) => void }) => {
  const product = mockService.getProducts().find((p: Product) => p.id === id);
  const [phone, setPhone] = useState('');

  const buy = () => {
    if (!phone) return alert('Enter phone!');
    const orderNum = 'DIGI-' + Math.floor(1000 + Math.random() * 9000);
    const order: Order = {
      id: 'o' + Date.now(), productName: product.title, productId: product.id,
      orderNumber: orderNum, amount: product.price, status: OrderStatus.PENDING,
      customerPhone: phone, createdAt: new Date().toISOString()
    };
    const orders = mockService.getOrders();
    mockService.saveOrders([...orders, order]);
    const msg = `🚀 Purchase Request: ${product.title}\nPrice: $${product.price}\nOrder ID: ${orderNum}\nPhone: ${phone}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
    onNavigate('dashboard');
  };

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade">
      <div className="aspect-square bg-white border-8 border-white shadow-2xl rounded-[4rem] overflow-hidden">
        <img src={product.images[0]} className="w-full h-full object-cover" />
      </div>
      <div className="py-8">
        <h1 className="text-5xl font-black mb-6">{product.title}</h1>
        <p className="text-slate-500 text-xl font-bold mb-10 leading-relaxed">{product.description}</p>
        <div className="text-5xl font-black text-indigo-600 mb-12">${product.price}</div>
        
        <div className="bg-white p-10 rounded-[3rem] border-2 border-indigo-50 shadow-xl space-y-6">
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your WhatsApp Number" className="w-full p-6 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-indigo-600 outline-none" />
          <button onClick={buy} className="w-full bg-indigo-600 text-white py-7 rounded-2xl font-black text-2xl shadow-xl shadow-indigo-100">Unlock Now & Get Code</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [view, setView] = useState<'home' | 'admin' | 'dashboard' | 'details' | 'login'>('home');
  const [selectedId, setSelectedId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');

  useEffect(() => { mockService.init(); }, []);

  const login = () => {
    if (pass === 'admin786') { setIsAdmin(true); setView('admin'); }
    else alert('Wrong pass!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar isAdmin={isAdmin} onNavigate={setView} />
      {view === 'home' && <Home onProductClick={id => { setSelectedId(id); setView('details'); }} />}
      {view === 'details' && <ProductDetails id={selectedId} onNavigate={setView} />}
      {view === 'dashboard' && <UserDashboard />}
      {view === 'admin' && isAdmin && <AdminPanel onLogout={() => { setIsAdmin(false); setView('home'); }} />}
      {view === 'login' && (
        <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[3rem] shadow-2xl border text-center">
          <h2 className="text-3xl font-black mb-8">Admin Portal</h2>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" className="w-full p-4 bg-slate-50 rounded-xl border mb-6 font-bold" />
          <button onClick={login} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg">Login</button>
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
