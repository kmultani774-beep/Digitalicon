
import React, { useState, useEffect } from 'react';
import { Package, Search, Clock, Code, FileText, Lock, Copy, CheckCircle2, MessageCircle, Download } from 'lucide-react';
import { Order, OrderStatus, Product } from '../types';
import { mockService } from '../services/mockService';
import { WHATSAPP_NUMBER } from '../constants';

const UserDashboard: React.FC = () => {
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [viewingFileIdx, setViewingFileIdx] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const id = params.get('id');
    if (id) {
      setOrderIdSearch(id);
      handleSearch(id);
    }
  }, []);

  const handleSearch = async (idToSearch?: string) => {
    const id = idToSearch || orderIdSearch;
    if (!id) return;

    setIsSearching(true);
    const allOrders = await mockService.getOrders();
    const order = allOrders.find(o => o.orderNumber === id);
    
    if (order) {
      setFoundOrder(order);
      const allProducts = await mockService.getProducts();
      const p = allProducts.find(prod => prod.id === order.productId);
      setProduct(p || null);
      if (p && p.sourceCode && p.sourceCode.length > 0) {
        setViewingFileIdx(0);
      }
    } else {
      setFoundOrder(null);
      setProduct(null);
      if (!idToSearch) alert('Invalid Order ID. Please check your confirmation message.');
    }
    setIsSearching(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Access Your Assets</h1>
        <p className="text-slate-400 font-bold text-lg">Enter the Order ID you received on WhatsApp to unlock your downloads.</p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-50">
          <input 
            type="text" 
            placeholder="DIGI-XXXX-XXXX" 
            value={orderIdSearch}
            onChange={e => setOrderIdSearch(e.target.value)}
            className="flex-grow px-8 py-5 bg-slate-50 rounded-3xl font-black text-xl text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all uppercase"
          />
          <button 
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center shadow-xl shadow-indigo-100 disabled:opacity-50"
          >
            {isSearching ? 'Verifying...' : <><Search className="mr-2" /> Unlock Library</>}
          </button>
        </div>
      </div>

      {foundOrder ? (
        <div className="animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-white rounded-[4rem] border-2 border-slate-50 overflow-hidden shadow-2xl">
            <div className="p-10 sm:p-12 flex flex-col md:flex-row justify-between items-center bg-slate-50 border-b">
              <div className="flex items-center space-x-6">
                <div className={`p-6 rounded-[2rem] ${foundOrder.status === OrderStatus.PAID ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600 animate-pulse'}`}>
                  {foundOrder.status === OrderStatus.PAID ? <CheckCircle2 size={40} /> : <Clock size={40} />}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{foundOrder.productName}</h2>
                  <p className="text-slate-400 font-black font-mono mt-1 tracking-tighter uppercase">ID: {foundOrder.orderNumber}</p>
                </div>
              </div>
              
              <div className="mt-8 md:mt-0 flex flex-col items-end">
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${foundOrder.status === OrderStatus.PAID ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {foundOrder.status === OrderStatus.PAID ? 'ORDER VERIFIED' : 'PAYMENT PENDING'}
                </div>
                {foundOrder.status === OrderStatus.PENDING && (
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=I have sent payment for Order ID: ${foundOrder.orderNumber}. Please verify.`} target="_blank" className="flex items-center text-indigo-600 font-black hover:underline">
                    <MessageCircle className="mr-2" size={18} /> Support Chat
                  </a>
                )}
              </div>
            </div>

            {foundOrder.status === OrderStatus.PAID && product ? (
              <div className="p-10 sm:p-12 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Files Included</h3>
                    {product.sourceCode && product.sourceCode.map((file, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setViewingFileIdx(idx)}
                        className={`w-full text-left p-6 rounded-3xl font-black text-sm flex items-center transition-all ${viewingFileIdx === idx ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <FileText className="mr-3" size={18} /> {file.filename}
                      </button>
                    ))}
                    {(!product.sourceCode || product.sourceCode.length === 0) && (
                      <p className="text-slate-400 text-xs font-bold italic py-4">Full package download only.</p>
                    )}
                  </div>

                  <div className="lg:col-span-3">
                    {viewingFileIdx !== null && product.sourceCode?.[viewingFileIdx] ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="font-black text-slate-900 text-xl flex items-center">
                            <Code className="mr-3 text-indigo-600" /> {product.sourceCode[viewingFileIdx].filename}
                          </h4>
                          <button onClick={() => copyToClipboard(product.sourceCode![viewingFileIdx].content)} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black flex items-center hover:bg-black">
                            <Copy size={14} className="mr-2" /> COPY
                          </button>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner overflow-x-auto custom-scrollbar">
                          <pre className="font-mono text-[13px] leading-relaxed text-emerald-400">
                            <code>{product.sourceCode[viewingFileIdx].content}</code>
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 p-12">
                        <Package size={64} className="text-slate-200 mb-6" />
                        <h4 className="text-2xl font-black text-slate-900 mb-2">Ready to Download</h4>
                        <p className="text-slate-400 font-bold max-w-xs">Access your premium assets below.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100">
                  <a 
                    href={product.fileUrl} 
                    target="_blank" 
                    className="w-full bg-indigo-600 text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center shadow-3xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-[1.01]"
                  >
                    <Download className="mr-4" size={32} /> DOWNLOAD FULL ZIP
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center space-y-8">
                <div className="w-32 h-32 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-amber-500 shadow-xl border border-amber-100">
                  <Lock size={64} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3">Awaiting Payment</h3>
                  <p className="text-slate-400 font-bold text-lg max-w-md mx-auto">Please send the screenshot of your payment on WhatsApp. Our team will verify and unlock your files instantly.</p>
                </div>
                <button onClick={() => handleSearch()} className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">
                   Refresh My Status
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 max-w-2xl mx-auto shadow-sm">
          <Search size={80} className="text-slate-100 mx-auto mb-8" />
          <h3 className="font-black text-slate-900 text-2xl mb-2">Order Search</h3>
          <p className="text-slate-400 font-bold max-w-xs mx-auto">Purchase an item and search with your Order ID to see your library.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
