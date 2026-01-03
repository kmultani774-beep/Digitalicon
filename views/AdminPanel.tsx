
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, Package, Users, ShoppingBag, Plus, XCircle, Edit3, Trash2, 
  DollarSign, Tag, Link, FileText, Clock, LogOut, Camera, Video, 
  Code, Save, Trash, MessageSquare, ExternalLink, Image as ImageIcon, AlignLeft, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { Product, Order, User, OrderStatus, Category, UserRole, SourceFile } from '../types';
import { mockService } from '../services/mockService';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
    demoLink: '',
    tags: '',
    imageUrl: '',
    videoUrl: '',
    sourceCode: [] as SourceFile[],
    status: 'Active' as 'Active' | 'Inactive' | 'Draft'
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [p, o, u] = await Promise.all([
        mockService.getProducts(),
        mockService.getOrders(),
        mockService.getAllUsers()
      ]);
      setProducts(p);
      setOrders(o);
      setUsers(u);
    } catch (error) {
      console.error("Platform load error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOrder = async (order: Order, approve: boolean) => {
    if (!approve) {
      if (!confirm("Reject this order?")) return;
      await mockService.updateOrderStatus(order.id, OrderStatus.CANCELLED);
      await loadAllData();
      return;
    }

    // 1. Update status on website (Instant Unlock)
    await mockService.updateOrderStatus(order.id, OrderStatus.PAID);
    
    // 2. Prepare WhatsApp Reply Link
    const replyMessage = `✅ *PAYMENT CONFIRMED!*\n\n` +
                         `Hello! Your payment for order *${order.orderNumber}* has been received.\n\n` +
                         `🔓 *FILES UNLOCKED:* You can now view your source code and download links in your dashboard.\n\n` +
                         `🌐 *Login here:* ${window.location.origin}\n\n` +
                         `🚀 Enjoy your product and thank you for choosing DigiMart Pro!`;
    
    const whatsappLink = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(replyMessage)}`;
    
    // 3. Open WhatsApp to notify user
    window.open(whatsappLink, '_blank');
    
    alert(`Order ${order.orderNumber} Unlocked! WhatsApp reply opened.`);
    await loadAllData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      images: [formData.imageUrl || 'https://via.placeholder.com/800x600?text=Digital+Product']
    };

    try {
      if (editingProductId) {
        await mockService.updateProduct(editingProductId, payload);
      } else {
        await mockService.addProduct(payload);
      }
      setIsModalOpen(false);
      await loadAllData();
    } catch (error) {
      alert('Error saving asset');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Admin Sidebar */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-10 border-b border-slate-800 flex items-center space-x-4">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl font-black text-2xl shadow-xl">D</div>
          <div><span className="text-xl font-black block tracking-tight">DIGIMART</span><span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">ADMIN HUB</span></div>
        </div>
        <nav className="flex-grow p-8 space-y-4">
          {[
            { id: 'overview', label: 'Dashboard', icon: <LayoutGrid size={22} /> },
            { id: 'products', label: 'Inventory', icon: <Package size={22} /> },
            { id: 'orders', label: 'Sale Orders', icon: <ShoppingBag size={22} /> }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center space-x-5 px-6 py-5 rounded-[1.5rem] font-black transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-slate-800"><button onClick={onLogout} className="w-full flex items-center space-x-5 px-6 py-5 text-red-400 font-black hover:bg-red-500/10 rounded-2xl transition-all"><LogOut size={22} /><span>SIGN OUT</span></button></div>
      </aside>

      <main className="flex-grow overflow-y-auto bg-white p-16">
        {activeTab === 'overview' && (
          <div className="space-y-16">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Marketplace Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex items-center space-x-8">
                <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl"><DollarSign size={32} /></div>
                <div><p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Earnings</p><p className="text-4xl font-black text-slate-900">${orders.reduce((a, o) => o.status === OrderStatus.PAID ? a + o.amount : a, 0).toFixed(0)}</p></div>
              </div>
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex items-center space-x-8">
                <div className="bg-emerald-500 p-6 rounded-3xl text-white shadow-xl"><ShoppingBag size={32} /></div>
                <div><p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Paid Orders</p><p className="text-4xl font-black text-slate-900">{orders.filter(o => o.status === OrderStatus.PAID).length}</p></div>
              </div>
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex items-center space-x-8">
                <div className="bg-amber-500 p-6 rounded-3xl text-white shadow-xl"><Clock size={32} /></div>
                <div><p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Awaiting</p><p className="text-4xl font-black text-slate-900">{orders.filter(o => o.status === OrderStatus.PENDING).length}</p></div>
              </div>
            </div>

            {/* Pending Verifications */}
            <div className="bg-white border-4 border-slate-50 rounded-[4rem] overflow-hidden shadow-2xl">
              <div className="p-10 border-b bg-slate-900 flex justify-between items-center text-white">
                <h3 className="font-black text-2xl flex items-center"><ShieldAlert className="mr-4 text-indigo-400" /> Pending WhatsApp Payments</h3>
                <span className="bg-indigo-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Verify & Unlock</span>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black border-b uppercase tracking-widest">
                    <th className="px-10 py-8">Order Detail</th>
                    <th className="px-10 py-8">Customer Phone</th>
                    <th className="px-10 py-8">Status</th>
                    <th className="px-10 py-8 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.filter(o => o.status === OrderStatus.PENDING).map(o => (
                    <tr key={o.id} className="hover:bg-indigo-50/30 transition-all">
                      <td className="px-10 py-8">
                        <div className="font-black text-slate-900 text-lg">{o.productName}</div>
                        <div className="text-xs text-indigo-500 font-black font-mono tracking-tighter mt-1">{o.orderNumber}</div>
                      </td>
                      <td className="px-10 py-8 font-black text-slate-600">{o.customerPhone}</td>
                      <td className="px-10 py-8"><span className="bg-amber-100 text-amber-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Pending Proof</span></td>
                      <td className="px-10 py-8 text-right space-x-4">
                        <button 
                          onClick={() => handleVerifyOrder(o, true)} 
                          className="bg-emerald-500 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
                        >
                          Approve & Reply
                        </button>
                        <button 
                          onClick={() => handleVerifyOrder(o, false)} 
                          className="text-red-400 hover:text-red-600 text-xs font-black p-4"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.filter(o => o.status === OrderStatus.PENDING).length === 0 && (
                    <tr><td colSpan={4} className="px-10 py-20 text-center font-black text-slate-300">All orders are up to date! 🎉</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {activeTab === 'products' && (
          <div className="space-y-12">
            <header className="flex justify-between items-center">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Inventory</h1>
              <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black flex items-center shadow-2xl transition-all hover:bg-indigo-700"><Plus className="mr-3" /> Add Asset</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl group">
                  <div className="relative h-56 overflow-hidden"><img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                  <div className="p-10">
                    <h4 className="font-black text-xl text-slate-900 mb-4">{p.title}</h4>
                    <div className="flex justify-between items-center"><span className="text-2xl font-black text-indigo-600">${p.price}</span><div className="flex space-x-2"><button className="p-3 text-slate-400 hover:text-indigo-600"><Edit3 size={20} /></button><button className="p-3 text-slate-400 hover:text-red-500"><Trash2 size={20} /></button></div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
