
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Home as HomeIcon, Search as SearchIcon, ShoppingBag, User as UserIcon,
  ChevronLeft, MessageCircle, Download, Star, CheckCircle2, 
  Clock, Lock, Copy, Code, FileText, Plus, Edit3, Trash2, 
  LogOut, Save, X, LayoutGrid, DollarSign, ShieldAlert
} from 'lucide-react';

// --- CONFIG ---
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
  category: Category;
  fileUrl: string;
  sourceCode: SourceFile[];
}

interface Order {
  id: string;
  productName: string;
  productId: string;
  orderNumber: string;
  amount: number;
  status: OrderStatus;
  customerPhone: string;
}

// --- STORAGE SERVICE ---
const mockService = {
  init: () => {
    if (!localStorage.getItem('dm_products')) {
      localStorage.setItem('dm_products', JSON.stringify([
        {
          id: 'p1', title: 'WhatsApp Automation Bot', description: 'Complete bot for auto-replying.',
          images: ['https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=400'], 
          price: 25, category: Category.SOFTWARE,
          fileUrl: '#', sourceCode: [{ filename: 'main.py', content: 'print("Bot started...")' }]
        },
        {
          id: 'p2', title: 'Premium Logo Pack', description: '100+ Vector logos for business.',
          images: ['https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=400'], 
          price: 15, category: Category.TEMPLATES,
          fileUrl: '#', sourceCode: []
        }
      ]));
    }
    if (!localStorage.getItem('dm_orders')) localStorage.setItem('dm_orders', JSON.stringify([]));
  },
  getProducts: () => JSON.parse(localStorage.getItem('dm_products') || '[]'),
  saveProducts: (p: any) => localStorage.setItem('dm_products', JSON.stringify(p)),
  getOrders: () => JSON.parse(localStorage.getItem('dm_orders') || '[]'),
  saveOrders: (o: any) => localStorage.setItem('dm_orders', JSON.stringify(o))
};

// --- APP VIEWS ---

const AppHeader = ({ title, showBack, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => (
  <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      {showBack && (
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{title}</h1>
    </div>
    <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-black text-sm">DM</div>
  </div>
);

const BottomNav = ({ active, onChange }: { active: string, onChange: (v: any) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t safe-area-bottom flex items-center justify-around py-3 px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
    <button onClick={() => onChange('home')} className={`flex flex-col items-center flex-1 ${active === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}>
      <HomeIcon size={22} strokeWidth={active === 'home' ? 2.5 : 2} />
      <span className="text-[10px] mt-1 font-bold">Home</span>
    </button>
    <button onClick={() => onChange('search')} className={`flex flex-col items-center flex-1 ${active === 'search' ? 'text-indigo-600' : 'text-slate-400'}`}>
      <SearchIcon size={22} strokeWidth={active === 'search' ? 2.5 : 2} />
      <span className="text-[10px] mt-1 font-bold">Explore</span>
    </button>
    <button onClick={() => onChange('dashboard')} className={`flex flex-col items-center flex-1 ${active === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
      <ShoppingBag size={22} strokeWidth={active === 'dashboard' ? 2.5 : 2} />
      <span className="text-[10px] mt-1 font-bold">Library</span>
    </button>
    <button onClick={() => onChange('profile')} className={`flex flex-col items-center flex-1 ${active === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}>
      <UserIcon size={22} strokeWidth={active === 'profile' ? 2.5 : 2} />
      <span className="text-[10px] mt-1 font-bold">Admin</span>
    </button>
  </div>
);

const HomeView = ({ onProductClick }: { onProductClick: (id: string) => void }) => {
  const products = mockService.getProducts();
  return (
    <div className="page-enter p-5 space-y-6 pb-24">
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Premium Assets</p>
          <h2 className="text-2xl font-black mb-3 leading-tight">Build Smarter with <br/>Ready-to-use Code</h2>
          <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg">New Arrivals</button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-800">Hot Products</h3>
        <button className="text-indigo-600 text-xs font-bold">View All</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((p: any) => (
          <div key={p.id} onClick={() => onProductClick(p.id)} className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 active:scale-95 transition-transform cursor-pointer">
            <div className="aspect-square bg-slate-50 rounded-2xl mb-3 overflow-hidden">
              <img src={p.images[0]} className="w-full h-full object-cover" alt={p.title} />
            </div>
            <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{p.title}</h4>
            <div className="flex items-center justify-between mt-2">
              <p className="text-indigo-600 font-black text-base">${p.price}</p>
              <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600">
                <Plus size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchView = ({ onProductClick }: { onProductClick: (id: string) => void }) => {
  const [q, setQ] = useState('');
  const products = mockService.getProducts().filter((p: any) => p.title.toLowerCase().includes(q.toLowerCase()));
  
  return (
    <div className="page-enter p-5 space-y-6 pb-24">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          autoFocus 
          value={q} 
          onChange={e => setQ(e.target.value)}
          placeholder="Search codes, templates, ebooks..." 
          className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 focus:outline-none shadow-sm transition-all"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Results ({products.length})</h4>
        {products.map((p: any) => (
          <div key={p.id} onClick={() => onProductClick(p.id)} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center space-x-4 active:bg-slate-50">
            <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
              <img src={p.images[0]} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow">
              <h5 className="font-bold text-slate-800">{p.title}</h5>
              <p className="text-xs text-indigo-600 font-black">${p.price}</p>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-center py-20 text-slate-400 font-bold">Nothing found for "{q}"</p>}
      </div>
    </div>
  );
};

const LibraryView = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [fileIdx, setFileIdx] = useState(0);

  const search = () => {
    const orders = mockService.getOrders();
    const found = orders.find((o: Order) => o.orderNumber === orderId.toUpperCase());
    if (found) {
      setOrder(found);
      const prod = mockService.getProducts().find((p: Product) => p.id === found.productId);
      setProduct(prod || null);
    } else alert('No order found with this ID.');
  };

  return (
    <div className="page-enter p-5 space-y-6 pb-24">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-lg font-black">Personal Library</h3>
        <p className="text-xs text-slate-400 font-bold">Enter Order ID from WhatsApp to access your purchased files.</p>
        <div className="flex space-x-2">
          <input 
            value={orderId} 
            onChange={e => setOrderId(e.target.value)} 
            placeholder="DIGI-XXXX" 
            className="flex-grow px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 font-mono font-bold uppercase focus:outline-none" 
          />
          <button onClick={search} className="bg-slate-900 text-white px-5 rounded-xl"><SearchIcon size={20}/></button>
        </div>
      </div>

      {order && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-fade">
          <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
            <div>
              <h4 className="font-black text-slate-800">{order.productName}</h4>
              <p className="text-[10px] text-indigo-600 font-mono font-bold tracking-tighter">{order.orderNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${order.status === OrderStatus.PAID ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
              {order.status}
            </span>
          </div>
          
          {order.status === OrderStatus.PAID && product ? (
            <div className="p-5 space-y-6">
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Code Viewer</p>
                 <div className="flex overflow-x-auto space-x-2 pb-2 custom-scrollbar">
                    {product.sourceCode.map((f, i) => (
                      <button key={i} onClick={() => setFileIdx(i)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${fileIdx === i ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {f.filename}
                      </button>
                    ))}
                 </div>
                 {product.sourceCode[fileIdx] && (
                   <div className="bg-slate-900 p-4 rounded-2xl overflow-x-auto">
                     <div className="flex justify-between mb-3">
                        <span className="text-indigo-400 text-[10px] font-mono">{product.sourceCode[fileIdx].filename}</span>
                        <button onClick={() => { navigator.clipboard.writeText(product.sourceCode[fileIdx].content); alert('Copied!'); }} className="text-white text-[9px] bg-white/10 px-2 py-1 rounded-lg">COPY</button>
                     </div>
                     <pre className="text-emerald-400 font-mono text-xs"><code>{product.sourceCode[fileIdx].content}</code></pre>
                   </div>
                 )}
               </div>
               <a href={product.fileUrl} target="_blank" className="block w-full bg-indigo-600 text-white text-center py-4 rounded-2xl font-black shadow-lg">
                 <Download className="inline mr-2" size={18} /> FULL ZIP DOWNLOAD
               </a>
            </div>
          ) : (
            <div className="p-12 text-center space-y-4">
              <Clock className="mx-auto text-amber-500" size={40} />
              <p className="text-sm font-bold text-slate-500">Awaiting Admin Approval...</p>
              <button onClick={search} className="text-indigo-600 text-xs font-black uppercase">Refresh Status</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProductDetailView = ({ id, onBack, onNavigate }: { id: string, onBack: () => void, onNavigate: (v: any) => void }) => {
  const product = mockService.getProducts().find((p: any) => p.id === id);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const buy = () => {
    if (!phone) return alert('WhatsApp number required!');
    setLoading(true);
    const orderNum = 'DIGI-' + Math.floor(1000 + Math.random() * 9000);
    const order: Order = {
      id: 'o' + Date.now(), productName: product.title, productId: product.id,
      orderNumber: orderNum, amount: product.price, status: OrderStatus.PENDING,
      customerPhone: phone
    };
    const orders = mockService.getOrders();
    mockService.saveOrders([...orders, order]);
    
    const msg = `🚀 NEW ORDER\nItem: ${product.title}\nOrder ID: ${orderNum}\nPhone: ${phone}\n\nI have sent the payment. Please verify and unlock.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
    onNavigate('dashboard');
  };

  if (!product) return null;

  return (
    <div className="page-enter bg-white min-h-screen pb-24 relative">
      <div className="h-80 bg-slate-100 relative overflow-hidden">
        <img src={product.images[0]} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-6 left-6 bg-white/50 backdrop-blur-md p-2 rounded-2xl text-slate-900 shadow-xl">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="p-6 -mt-10 bg-white rounded-t-[3rem] relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{product.category}</span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">{product.title}</h2>
          </div>
          <div className="text-2xl font-black text-indigo-600">${product.price}</div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</h4>
          <p className="text-slate-500 font-bold leading-relaxed">{product.description}</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 shadow-inner">
          <label className="text-[10px] font-black text-slate-400 uppercase">Enter WhatsApp to Buy</label>
          <input 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="03XX-XXXXXXX" 
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 font-black text-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none outline-none" 
          />
          <button 
            onClick={buy}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 active:scale-95 transition-transform"
          >
            {loading ? 'Connecting...' : 'Buy Now & Unlock'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN PANEL ---

const AdminPanelView = ({ onLogout }: { onLogout: () => void }) => {
  const [products, setProducts] = useState<Product[]>(mockService.getProducts());
  const [orders, setOrders] = useState<Order[]>(mockService.getOrders());
  const [isModal, setIsModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ title: '', description: '', price: 0, category: Category.SOFTWARE, imageUrl: '', fileUrl: '', sourceCode: [] });

  const save = () => {
    const next = editId 
      ? products.map(p => p.id === editId ? { ...p, ...formData, images: [formData.imageUrl] } : p)
      : [...products, { ...formData, id: 'p' + Date.now(), images: [formData.imageUrl] }];
    setProducts(next as any);
    mockService.saveProducts(next);
    setIsModal(false);
  };

  const verify = (o: Order) => {
    const next = orders.map(x => x.id === o.id ? { ...x, status: OrderStatus.PAID } : x);
    setOrders(next);
    mockService.saveOrders(next);
    window.open(`https://wa.me/${o.customerPhone}?text=Verified! Your Order ID: ${o.orderNumber}. Access: ${window.location.origin}/#dashboard?id=${o.orderNumber}`);
  };

  return (
    <div className="page-enter p-5 space-y-8 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">Admin Dashboard</h2>
        <button onClick={onLogout} className="text-red-500 font-black text-xs uppercase">Logout</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase">Revenue</p>
          <p className="text-2xl font-black text-indigo-600">${orders.filter(o => o.status === OrderStatus.PAID).reduce((a, b) => a + b.amount, 0)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase">New Orders</p>
          <p className="text-2xl font-black text-amber-500">{orders.filter(o => o.status === OrderStatus.PENDING).length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-black uppercase">Verify Sales</h4>
        </div>
        <div className="space-y-3">
          {orders.filter(o => o.status === OrderStatus.PENDING).map(o => (
            <div key={o.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-xs font-black">{o.productName}</p>
                <p className="text-[10px] text-slate-400 font-mono font-bold">{o.orderNumber}</p>
              </div>
              <button onClick={() => verify(o)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">Verify</button>
            </div>
          ))}
          {orders.filter(o => o.status === OrderStatus.PENDING).length === 0 && <p className="text-center text-slate-400 text-xs font-bold py-4">No pending verifications.</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-black uppercase">Inventory</h4>
          <button onClick={() => { setEditId(null); setFormData({ title: '', description: '', price: 0, category: Category.SOFTWARE, imageUrl: '', fileUrl: '', sourceCode: [] }); setIsModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black">+ NEW</button>
        </div>
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <p className="text-xs font-black">{p.title}</p>
              <div className="flex space-x-2">
                 <button onClick={() => { setEditId(p.id); setFormData({...p, imageUrl: p.images[0]}); setIsModal(true); }} className="text-slate-400"><Edit3 size={16}/></button>
                 <button onClick={() => { const n = products.filter(x => x.id !== p.id); setProducts(n); mockService.saveProducts(n); }} className="text-red-300"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-end">
          <div className="bg-white w-full rounded-t-[3rem] p-8 space-y-6 max-h-[85vh] overflow-y-auto pb-12">
            <h3 className="text-xl font-black">Manage Asset</h3>
            <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold h-24" />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="p-4 bg-slate-50 rounded-2xl border font-bold" />
              <input placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="p-4 bg-slate-50 rounded-2xl border font-bold" />
            </div>
            <input placeholder="Download URL (ZIP)" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" />
            
            <button onClick={() => setFormData({...formData, sourceCode: [...formData.sourceCode, { filename: 'file.js', content: '' }]})} className="text-indigo-600 font-black text-xs">+ ADD CODE FILE</button>
            {formData.sourceCode.map((f:any, i:number) => (
              <div key={i} className="space-y-2 border-l-4 border-indigo-600 pl-4">
                <input placeholder="Filename" value={f.filename} onChange={e => { const n = [...formData.sourceCode]; n[i].filename = e.target.value; setFormData({...formData, sourceCode: n}); }} className="w-full p-2 bg-slate-100 rounded-xl text-xs font-mono" />
                <textarea placeholder="Paste code here" value={f.content} onChange={e => { const n = [...formData.sourceCode]; n[i].content = e.target.value; setFormData({...formData, sourceCode: n}); }} className="w-full p-2 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono h-24" />
              </div>
            ))}

            <div className="flex space-x-3">
              <button onClick={save} className="flex-grow bg-indigo-600 text-white py-4 rounded-2xl font-black">Save Product</button>
              <button onClick={() => setIsModal(false)} className="px-6 bg-slate-100 rounded-2xl font-black">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ENTRY ---

const App = () => {
  const [view, setView] = useState<'home' | 'search' | 'dashboard' | 'profile' | 'details' | 'login'>('home');
  const [selectedId, setSelectedId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');

  useEffect(() => { mockService.init(); }, []);

  const handleLogin = () => {
    if (pass === 'admin786') { setIsAdmin(true); setView('profile'); }
    else alert('Invalid admin credentials.');
  };

  const renderContent = () => {
    switch (view) {
      case 'home': return <HomeView onProductClick={id => { setSelectedId(id); setView('details'); }} />;
      case 'search': return <SearchView onProductClick={id => { setSelectedId(id); setView('details'); }} />;
      case 'dashboard': return <LibraryView />;
      case 'details': return <ProductDetailView id={selectedId} onBack={() => setView('home')} onNavigate={setView} />;
      case 'profile': return isAdmin ? <AdminPanelView onLogout={() => setIsAdmin(false)} /> : (
        <div className="page-enter p-10 flex flex-col items-center justify-center space-y-8 min-h-[80vh]">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900">Admin Portal</h2>
            <p className="text-slate-400 font-bold text-sm">Authorized sites administrators only.</p>
          </div>
          <div className="w-full space-y-4">
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Secret Key" className="w-full p-5 bg-white border border-slate-200 rounded-[2rem] font-black text-center text-xl outline-none focus:ring-2 focus:ring-indigo-600" />
            <button onClick={handleLogin} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-transform">Unlock Control Panel</button>
          </div>
        </div>
      );
      default: return <HomeView onProductClick={() => {}} />;
    }
  };

  const getTitle = () => {
    if (view === 'home') return 'Explore Assets';
    if (view === 'search') return 'Search';
    if (view === 'dashboard') return 'My Library';
    if (view === 'profile') return 'Admin Dashboard';
    return 'Asset Details';
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-slate-50">
      {view !== 'details' && <AppHeader title={getTitle()} />}
      <main className="min-h-screen">
        {renderContent()}
      </main>
      {view !== 'details' && <BottomNav active={view} onChange={setView} />}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
