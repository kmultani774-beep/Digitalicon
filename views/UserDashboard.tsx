
import React, { useState, useEffect } from 'react';
import { Package, Download, Clock, ChevronRight, Code, FileText, Lock, Copy, AlertCircle, CheckCircle2, MessageCircle, ExternalLink } from 'lucide-react';
import { Order, OrderStatus, User, Product } from '../types';
import { mockService } from '../services/mockService';
import { WHATSAPP_NUMBER } from '../constants';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingCodeOrderId, setViewingCodeOrderId] = useState<string | null>(null);

  // Sync with "Backend" every 5 seconds to check for payment approval
  useEffect(() => {
    loadData();
    const syncInterval = setInterval(loadData, 5000);
    return () => clearInterval(syncInterval);
  }, [user]);

  const loadData = async () => {
    const [o, p] = await Promise.all([
      mockService.getUserOrders(user.id),
      mockService.getProducts()
    ]);
    setOrders(o);
    setProducts(p);
    setIsLoading(false);
  };

  const getProductForOrder = (productId: string) => products.find(p => p.id === productId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Purchase History</h1>
          <p className="text-slate-400 font-bold mt-2">Manage your digital assets and source files</p>
        </div>
        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-3xl">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{user.name}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-3xl shadow-indigo-600/30">
            <h3 className="text-xl font-black mb-6 flex items-center"><CheckCircle2 className="mr-3" /> Dashboard Stats</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-indigo-100 font-bold">Total Purchases</span>
                <span className="text-2xl font-black">{orders.length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-indigo-100 font-bold">Unlocked Assets</span>
                <span className="text-2xl font-black text-emerald-300">{orders.filter(o => o.status === OrderStatus.PAID).length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-6">
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">How to unlock?</h4>
            <ol className="text-sm text-slate-500 space-y-4 font-bold">
              <li className="flex items-start"><span className="text-indigo-600 mr-2">1.</span> Click on "Send Proof" to open WhatsApp.</li>
              <li className="flex items-start"><span className="text-indigo-600 mr-2">2.</span> Send screenshot of payment to admin.</li>
              <li className="flex items-start"><span className="text-indigo-600 mr-2">3.</span> Once admin approves, files unlock instantly here.</li>
            </ol>
            <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`} target="_blank" className="w-full flex items-center justify-center px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black hover:bg-emerald-100 transition-all">
              <MessageCircle size={18} className="mr-2" /> Live Chat Support
            </a>
          </div>
        </div>

        {/* Main Orders List */}
        <div className="lg:col-span-2 space-y-10">
          <h3 className="text-2xl font-black text-slate-900 flex items-center">
            <Package className="mr-3 text-indigo-600" /> Recent Orders
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map(order => {
                const product = getProductForOrder(order.productId);
                const isPaid = order.status === OrderStatus.PAID;

                return (
                  <div key={order.id} className="bg-white rounded-[3.5rem] border-2 border-slate-50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                    <div className="p-8 sm:p-10 flex flex-col sm:flex-row justify-between sm:items-center">
                      <div className="flex items-center space-x-6">
                        <div className={`p-5 rounded-3xl ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 animate-pulse'}`}>
                          {isPaid ? <CheckCircle2 size={32} /> : <Clock size={32} />}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-xl tracking-tight">{order.productName}</h4>
                          <p className="text-slate-400 text-xs font-black font-mono mt-1 tracking-tighter">ORDER ID: {order.orderNumber}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 sm:mt-0 flex flex-col items-end">
                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 flex items-center ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {isPaid ? <CheckCircle2 size={12} className="mr-2" /> : <Clock size={12} className="mr-2" />}
                          {isPaid ? 'PAYMENT VERIFIED' : 'WAITING FOR APPROVAL'}
                        </div>
                        
                        {isPaid ? (
                          <button 
                            onClick={() => setViewingCodeOrderId(viewingCodeOrderId === order.id ? null : order.id)} 
                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all flex items-center"
                          >
                            {viewingCodeOrderId === order.id ? 'HIDE SOURCE CODE' : 'ACCESS FILES'} <Code className="ml-3" size={18} />
                          </button>
                        ) : (
                          <a 
                            href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=Hello!%20My%20Order%20ID%20is%20${order.orderNumber}.%20I%20have%20sent%20the%20payment.%20Please%20verify.`} 
                            target="_blank" 
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-600 transition-all flex items-center"
                          >
                            SEND PROOF ON WHATSAPP <ExternalLink size={16} className="ml-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content Section: Only visible when status is PAID */}
                    {isPaid ? (
                      viewingCodeOrderId === order.id && product && (
                        <div className="bg-slate-950 p-10 animate-in slide-in-from-top duration-500">
                          <div className="flex items-center justify-between mb-8 text-white">
                            <h5 className="font-black text-xl flex items-center text-indigo-400">
                              <Code className="mr-3" /> Unlocked Project Files
                            </h5>
                          </div>
                          
                          <div className="space-y-10">
                            {product.sourceCode && product.sourceCode.length > 0 ? (
                              product.sourceCode.map((file, fidx) => (
                                <div key={fidx} className="group">
                                  <div className="flex justify-between items-center px-6 py-4 bg-slate-900 rounded-t-3xl border-x border-t border-slate-800">
                                    <span className="text-xs font-black text-indigo-300 flex items-center uppercase tracking-widest">
                                      <FileText size={16} className="mr-3 text-slate-500" /> {file.filename}
                                    </span>
                                    <button onClick={() => copyToClipboard(file.content)} className="text-slate-500 hover:text-white transition-colors p-2 bg-slate-800 rounded-xl">
                                      <Copy size={16} />
                                    </button>
                                  </div>
                                  <div className="p-8 bg-slate-900 rounded-b-3xl border border-slate-800 overflow-x-auto custom-scrollbar">
                                    <pre className="font-mono text-[12px] leading-relaxed text-emerald-400">
                                      <code>{file.content}</code>
                                    </pre>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="bg-slate-900/50 p-12 rounded-[2.5rem] border-2 border-dashed border-slate-800 text-center">
                                <AlertCircle className="mx-auto mb-4 text-slate-600" size={48} />
                                <p className="text-slate-500 font-black">Online access not available. Please use the master download link.</p>
                              </div>
                            )}

                            {product.fileUrl && (
                              <a 
                                href={product.fileUrl} 
                                target="_blank" 
                                className="w-full flex items-center justify-center bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all transform hover:scale-[1.02]"
                              >
                                <Download className="mr-3" /> DOWNLOAD MASTER ARCHIVE (.ZIP)
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="bg-slate-50 p-12 flex flex-col items-center justify-center text-center border-t border-white">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                          <Lock size={48} className="animate-pulse" />
                        </div>
                        <h5 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Security Lock Active</h5>
                        <p className="text-slate-400 text-sm font-bold max-w-sm mx-auto leading-relaxed">
                          Your assets are safely stored. Once the admin verifies your manual payment via WhatsApp, this section will unlock automatically.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
              <Package size={80} className="text-slate-100 mx-auto mb-8" />
              <h3 className="font-black text-slate-900 text-3xl mb-3 tracking-tight">Your library is empty</h3>
              <p className="text-slate-400 font-bold mb-10 max-w-xs mx-auto">Purchase a digital asset to see your source codes and downloads here.</p>
              <button onClick={() => window.location.href = '/'} className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transition-all">EXPLORE STORE</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
