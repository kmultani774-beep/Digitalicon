
import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product.id)}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full transform hover:-translate-y-2"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 shadow-lg border border-white/20 uppercase tracking-widest">
          {product.category}
        </div>
        {product.discountPrice && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest">
            Special Offer
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
          {product.title}
        </h3>
        <p className="mt-3 text-gray-400 text-sm line-clamp-2 flex-grow font-medium leading-relaxed">
          {product.description || "Premium digital asset with source code and support."}
        </p>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black text-gray-900">${product.discountPrice}</span>
                <span className="text-sm text-gray-300 line-through font-bold">${product.price}</span>
              </div>
            ) : (
              <span className="text-2xl font-black text-gray-900">${product.price}</span>
            )}
          </div>
          <div className="flex items-center text-amber-500 font-black text-sm">
            <Star className="w-4 h-4 fill-current mr-1" />
            {product.rating > 0 ? product.rating : '5.0'}
          </div>
        </div>

        <button className="mt-8 w-full bg-gray-50 text-gray-900 font-black py-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-200 transition-all flex items-center justify-center transform active:scale-95">
          Buy Now <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
