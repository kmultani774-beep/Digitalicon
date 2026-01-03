
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Package, ShoppingBag, Plus, Edit3, Trash2, 
  DollarSign, Clock, LogOut, ShieldAlert, X, Save, FileText, Code as CodeIcon
} from 'lucide-react';
import { Product, Order, OrderStatus, Category, SourceFile } from '../types';
import { mockService } from '../services/mockService';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.SOFTWARE,
    price: 0,
    discountPrice: 0,
    fileUrl: '',
    imageUrl: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Draft',
    sourceCode: [] as SourceFile[]
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    const [p, o] = await Promise.all([
      mockService.getProducts(),
      mockService.getOrders()
    ]);
    setProducts(p);
    setOrders(o);
    setIsLoading(false);
  };

  const handleVerifyOrder = async (order: Order, approve: boolean) => {
    const status = approve ? OrderStatus.PAID : OrderStatus.CANCELLED;
    await mockService.updateOrderStatus(order.id, status);
    
    if (approve) {
      const msg = `✅ *Payment Verified*\nOrder ID: ${order.orderNumber}\n\nYour digital files are now UNLOCKED! Access them here: ${window.location.origin}/#dashboard?id=${order.orderNumber}`;
      window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    }
    await loadAllData();
  };

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice || 0,
      fileUrl: p.fileUrl,
      imageUrl: p.images[0] || '',
      status: p.status,
      sourceCode: p.sourceCode || []
    });
    setIsModalOpen(true);
  };

  const addSourceFile = () => {
    setFormData({
      ...formData,
      sourceCode: [...formData.sourceCode, { filename: 'index.html', language: 'html', content: '' }]
    });
  };

  const removeSourceFile = (index: number) => {
    const newCode = [...formData.sourceCode];
    newCode.splice(index, 1);
    setFormData({ ...formData, sourceCode: newCode });
  };

  const updateSourceFile = (index: number, field: keyof SourceFile, value: string) => {
    const newCode = [...formData.sourceCode];
    newCode[index] = { ...newCode[index], [field]: value };
    setFormData({ ...formData, sourceCode: newCode });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      images: [formData.imageUrl || 'https://picsum.photos/seed/prod/800/600'],
      tags: [],
      sourceCode: formData.sourceCode
    };

    if (editingProductId) {
      await mockService.updateProduct(editingProductId, payload);
    } else {
      await mockService.addProduct(payload);
    }
    
    setIsModalOpen(false);
    setEditingProductId(null);
    setFormData({
      title: '', description: '', category: Category.SOFTWARE, price: 0,
      discountPrice: 0, fileUrl: '', imageUrl: '', status: 'Active', sourceCode: []
    });
    await loadAllData();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-72 bg-slate-900 text-white flex flex-col">
        <div className="p-10 border-b border-slate-800">
          <span className="text-xl font-black">DigiMart Admin</span>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-indigo-600' : 'text-slate-500 hover:bg-slate-800'}`}>
            <LayoutGrid size={20} /><span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'products' ? 'bg-indigo-600' : 'text-slate-500 hover:bg-slate-800'}`}>
            <Package size={20} /><span>Inventory</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-indigo-600' : 'text-slate-500 hover:bg-slate-800'}`}>
            <ShoppingBag size={20} /><span>Sales</span>
          </button>
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center space-x-4 px-6 py-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl">
            <LogOut size={20} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-12">
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                <DollarSign className="text-indigo-600 mb-4" />
                <p className="text-slate-400 text-xs font-black uppercase">Revenue</p>
                <p className="text-3xl font-black">${orders.filter(o => o.status === OrderStatus.PAID).reduce((a, b) => a + b.amount, 0).toFixed(0)}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                <ShieldAlert className="text-amber-500 mb-4" />
                <p className="text-slate-400 text-xs font-black uppercase">Pending Orders</p>
                <p className="text-3xl font-black">{orders.filter(o => o.status === OrderStatus.PENDING).length}</p>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border shadow-xl overflow-hidden">
              <div className="p-8 bg-slate-900 text-white font-black">Verify New Payments</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="px-8 py-6">Order ID</th>
                      <th className="px-8 py-6">Customer Phone</th>
                      <th className="px-8 py-6">Product</th>
                      <th className="px-8 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.filter(o => o.status === OrderStatus.PENDING).map(o => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="px-8 py-6 font-mono font-bold text-indigo-600">{o.orderNumber}</td>
                        <td className="px-8 py-6 font-bold">{o.customerPhone}</td>
                        <td className="px-8 py-6 font-bold">{o.productName}</td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button onClick={() => handleVerifyOrder(o, true)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black">Approve</button>
                          <button onClick={() => handleVerifyOrder(o, false)} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-black">Reject</button>
                        </td>
                      </tr>
                    ))}
                    {orders.filter(o => o.status === OrderStatus.PENDING).length === 0 && (
                      <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-bold italic">No pending orders.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-slate-900">Digital Inventory</h2>
              <button onClick={() => { setEditingProductId(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center hover:bg-indigo-700"><Plus className="mr-2" /> Add New Asset</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-[2.5rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="h-48 bg-slate-100"><img src={p.images[0]} className="w-full h-full object-cover" /></div>
                  <div className="p-8">
                    <h4 className="font-black text-lg mb-2">{p.title}</h4>
                    <p className="text-indigo-600 font-black mb-4">${p.price}</p>
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEditProduct(p)} className="p-3 text-slate-400 hover:text-indigo-600"><Edit3 size={18} /></button>
                      <button onClick={async () => { if(confirm('Delete this asset?')) { await mockService.deleteProduct(p.id); loadAllData(); } }} className="p-3 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900">{editingProductId ? 'Edit Asset' : 'New Digital Asset'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border focus:ring-2 focus:ring-indigo-600" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border">
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border h-32 focus:ring-2 focus:ring-indigo-600" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price ($)</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Image URL</label>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border" placeholder="https://..." required />
                  </div>
                </div>

                {/* PROPER SOURCE CODE SECTION */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border-2 border-indigo-500/30">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-black text-white text-lg flex items-center"><CodeIcon className="mr-3 text-indigo-400" /> Embedded Source Code</h4>
                    <button type="button" onClick={addSourceFile} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-black flex items-center hover:bg-indigo-500"><Plus size={14} className="mr-1" /> Add File</button>
                  </div>
                  
                  <div className="space-y-6">
                    {formData.sourceCode.map((file, idx) => (
                      <div key={idx} className="bg-slate-800 p-6 rounded-2xl shadow-inner border border-slate-700 space-y-4">
                        <div className="flex space-x-4">
                          <input 
                            type="text" 
                            placeholder="e.g. index.html" 
                            value={file.filename} 
                            onChange={e => updateSourceFile(idx, 'filename', e.target.value)} 
                            className="flex-grow px-4 py-2 bg-slate-900 text-indigo-300 rounded-lg text-sm font-mono border border-slate-700 focus:outline-none"
                          />
                          <button type="button" onClick={() => removeSourceFile(idx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                        </div>
                        <textarea 
                          placeholder="Paste the code content here..." 
                          value={file.content} 
                          onChange={e => updateSourceFile(idx, 'content', e.target.value)} 
                          className="w-full px-4 py-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg h-40 border border-slate-700 focus:outline-none custom-scrollbar"
                        />
                      </div>
                    ))}
                    {formData.sourceCode.length === 0 && <p className="text-center text-slate-500 text-sm font-bold py-6 italic">No source files added. Files appear after payment approval.</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Package Download URL (ZIP)</label>
                  <input type="text" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border focus:ring-2 focus:ring-indigo-600" placeholder="Google Drive / Mega link" required />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-grow bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center"><Save className="mr-3" /> Save Asset & Files</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
