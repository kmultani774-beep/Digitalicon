
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

  const handleBuyNow = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter your WhatsApp number.");
      return;
    }

    setIsBuying(true);
    try {
      const order = await mockService.createOrder(
        'guest-user',
        product.id,
        product.title,
        product.discountPrice || product.price,
        phone
      );

      const message = `🚀 *DIGIMART PURCHASE REQUEST*\n\n` +
                      `📦 *Item:* ${product.title}\n` +
                      `💰 *Price:* $${product.discountPrice || product.price}\n` +
                      `🆔 *Order ID:* ${order.orderNumber}\n` +
                      `📱 *Customer:* ${phone}\n\n` +
                      `_Hello! I want to purchase this. Please provide payment details._`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      onNavigate('dashboard');
    } catch (error) {
      alert('Error creating order.');
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
        <div className="space-y-6">
          <div className="aspect-square rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-900">
            <img src={product.images[activeImageIdx]} className="w-full h-full object-cover" alt={product.title} />
          </div>
        </div>

        <div className="flex flex-col py-4">
          <div className="flex items-center space-x-3 mb-6">
            <span className="px-5 py-2 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">{product.category}</span>
            <div className="flex items-center text-amber-500 font-black text-sm ml-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
              <Star className="w-4 h-4 fill-current mr-2" />{product.rating}
            </div>
          </div>

          <h1 className="text-5xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">{product.title}</h1>
          
          <div className="flex items-baseline space-x-6 mb-10">
            <span className="text-6xl font-black text-indigo-600 tracking-tighter">${product.discountPrice || product.price}</span>
            {product.discountPrice && <span className="text-3xl text-slate-300 line-through font-black opacity-50">${product.price}</span>}
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-10 rounded-[3rem] mb-12 border border-white shadow-xl">
            <h4 className="font-black text-slate-900 mb-5 flex items-center text-lg"><ShieldCheck className="w-6 h-6 mr-3 text-indigo-600" /> DESCRIPTION</h4>
            <p className="text-slate-500 leading-relaxed font-bold text-lg">{product.description}</p>
          </div>

          {!showPhonePrompt ? (
            <button 
              onClick={() => setShowPhonePrompt(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-7 rounded-[2rem] font-black text-2xl shadow-3xl shadow-indigo-100 transition-all flex items-center justify-center transform active:scale-95"
            >
              <MessageCircle className="mr-4" /> BUY NOW & GET FILES
            </button>
          ) : (
            <div className="space-y-6 bg-white p-10 rounded-[3.5rem] border-2 border-indigo-100 shadow-3xl animate-in slide-in-from-bottom-5">
              <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Enter Your WhatsApp Number</label>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="e.g. 03264236393" 
                  className="flex-grow px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-600 font-black text-xl transition-all" 
                />
                <button 
                  onClick={handleBuyNow} 
                  disabled={isBuying}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isBuying ? "CONNECTING..." : "CONFIRM ORDER"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
