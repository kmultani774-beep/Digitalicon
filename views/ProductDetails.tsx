
import React, { useState } from 'react';
import { Star, ShieldCheck, ArrowLeft, Heart, PlayCircle, MessageCircle, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';
import { Product, User } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { mockService } from '../services/mockService';

interface ProductDetailsProps {
  product: Product;
  user: User | null;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, user, onBack, onNavigate }) => {
  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>(product.videoUrl ? 'video' : 'image');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [phone, setPhone] = useState('');
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);

  const handleInitiateBuy = () => {
    if (!user) {
      alert("Please login or create an account to purchase.");
      onNavigate('login');
      return;
    }
    setShowPhonePrompt(true);
  };

  const handleBuyNow = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid WhatsApp number for verification.");
      return;
    }

    setIsBuying(true);
    try {
      const order = await mockService.createOrder(
        user!.id,
        product.id,
        product.title,
        product.discountPrice || product.price,
        phone
      );

      // Automated WhatsApp Message to Admin
      const message = `🚀 *DIGIMART PURCHASE REQUEST*\n\n` +
                      `📦 *Item:* ${product.title}\n` +
                      `💰 *Price:* $${product.discountPrice || product.price}\n` +
                      `🆔 *Order ID:* ${order.orderNumber}\n` +
                      `📱 *Customer:* ${phone}\n\n` +
                      `_Hello! I have just placed this order. Please provide payment details to unlock my files._`;

      const cleanedAdminNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanedAdminNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      onNavigate('dashboard');
    } catch (error) {
      alert('System busy. Please try again.');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-indigo-600 font-black mb-10 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> BACK TO STORE
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Media Preview (Unrestricted) */}
        <div className="space-y-6">
          <div className="aspect-square sm:aspect-[4/3] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-900 flex items-center justify-center relative">
            {activeMedia === 'video' && product.videoUrl ? (
              <video src={product.videoUrl} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <img src={product.images[activeImageIdx]} className="w-full h-full object-cover" alt={product.title} />
            )}
            <div className="absolute top-8 left-8 bg-indigo-600/90 backdrop-blur-md px-5 py-2 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest border border-indigo-400">
              HD PREVIEW
            </div>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide px-2">
            {product.videoUrl && (
              <button onClick={() => setActiveMedia('video')} className={`flex-shrink-0 w-28 h-28 rounded-3xl overflow-hidden border-4 transition-all relative ${activeMedia === 'video' ? 'border-indigo-600 scale-110 shadow-xl' : 'border-transparent opacity-50'}`}>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><PlayCircle className="text-white" size={40} /></div>
                <video src={product.videoUrl} className="w-full h-full object-cover" />
              </button>
            )}
            {product.images.map((img, idx) => (
              <button key={idx} onClick={() => { setActiveMedia('image'); setActiveImageIdx(idx); }} className={`flex-shrink-0 w-28 h-28 rounded-3xl overflow-hidden border-4 transition-all ${activeMedia === 'image' && activeImageIdx === idx ? 'border-indigo-600 scale-110 shadow-xl' : 'border-transparent opacity-50'}`}>
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col py-4">
          <div className="flex items-center space-x-3 mb-6">
            <span className="px-5 py-2 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">{product.category}</span>
            <div className="flex items-center text-amber-500 font-black text-sm ml-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
              <Star className="w-4 h-4 fill-current mr-2" />{product.rating} (5/5)
            </div>
          </div>

          <h1 className="text-5xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">{product.title}</h1>
          
          <div className="flex items-baseline space-x-6 mb-10">
            {product.discountPrice ? (
              <>
                <span className="text-6xl font-black text-indigo-600 tracking-tighter">${product.discountPrice}</span>
                <span className="text-3xl text-slate-300 line-through font-black opacity-50">${product.price}</span>
              </>
            ) : (
              <span className="text-6xl font-black text-indigo-600 tracking-tighter">${product.price}</span>
            )}
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-10 rounded-[3rem] mb-12 border border-white shadow-xl">
            <h4 className="font-black text-slate-900 mb-5 flex items-center text-lg">
              <ShieldCheck className="w-6 h-6 mr-3 text-indigo-600" /> PRODUCT OVERVIEW
            </h4>
            <p className="text-slate-500 leading-relaxed font-bold text-lg">
              {product.description || "Get lifetime access to this high-quality digital asset. Includes source files and documentation."}
            </p>
          </div>

          {/* Locked Assets Placeholder */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-12 flex items-center space-x-6 border-4 border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="bg-indigo-600 p-5 rounded-3xl text-white shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform">
              <Lock size={32} />
            </div>
            <div>
              <p className="text-white font-black text-xl mb-1">Files Locked</p>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Verify payment on WhatsApp to unlock code</p>
            </div>
          </div>

          {/* Action Interface */}
          <div className="mt-auto">
            {!showPhonePrompt ? (
              <div className="flex space-x-4">
                <button 
                  onClick={handleInitiateBuy}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-7 rounded-[2rem] font-black text-2xl shadow-3xl shadow-indigo-500/20 transition-all flex items-center justify-center transform active:scale-95"
                >
                  <MessageCircle className="mr-4" /> BUY NOW & UNLOCK
                </button>
                <button className="p-7 bg-white border border-gray-100 rounded-[2rem] text-slate-300 hover:text-pink-500 transition-all shadow-sm"><Heart size={32} /></button>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500 bg-white p-10 rounded-[3.5rem] border-2 border-indigo-100 shadow-3xl relative overflow-hidden">
                <div className="relative z-10">
                  <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Your Active WhatsApp Number</label>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="e.g. 03264236393" 
                      className="flex-grow px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-600 focus:ring-0 font-black text-xl transition-all" 
                    />
                    <button 
                      onClick={handleBuyNow} 
                      disabled={isBuying}
                      className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center min-w-[180px]"
                    >
                      {isBuying ? "CONNECTING..." : "CONFIRM ORDER"} <ExternalLink size={24} className="ml-3" />
                    </button>
                  </div>
                  <div className="mt-6 flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={14} className="mr-2 text-emerald-500" /> Automatic Redirect to WhatsApp Admin
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
