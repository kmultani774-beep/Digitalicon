
import React, { useState, useEffect } from 'react';
import { Search, Filter, Rocket, ShieldCheck, Zap, ArrowRight, BookOpen, Code, Image as ImageIcon, GraduationCap, Star, Palette } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '../types';
import { mockService } from '../services/mockService';

interface HomeProps {
  onProductClick: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  const loadProducts = async () => {
    const data = await mockService.getProducts();
    setProducts(data);
    setFilteredProducts(data);
    setIsLoading(false);
  };

  const categories = [
    { name: 'All', icon: <Rocket size={20} /> },
    { name: Category.SOFTWARE, icon: <Code size={20} /> },
    { name: Category.TEMPLATES, icon: <ImageIcon size={20} /> },
    { name: Category.EBOOKS, icon: <BookOpen size={20} /> },
    { name: Category.COURSES, icon: <GraduationCap size={20} /> },
    { name: Category.LOGOS, icon: <Palette size={20} /> },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-600 text-white rounded-b-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold mb-8 animate-bounce">
            <span className="mr-2">🔥</span> 50% Off on all Templates this week!
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Elevate Your <span className="text-indigo-200">Digital Workflow</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover premium ebooks, industry-grade software, website templates, and masterclass courses curated by professionals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#products" className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl">
              Browse Products
            </a>
            <button className="bg-indigo-500/30 text-white border border-white/20 backdrop-blur-md px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              Sell with Us
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[-5%] w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Instant Delivery</h4>
              <p className="text-sm text-gray-500">Get your links immediately after purchase.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Secure Payments</h4>
              <p className="text-sm text-gray-500">Verified WhatsApp confirmation for every order.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600">
              <Star size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Premium Quality</h4>
              <p className="text-sm text-gray-500">Top-tier digital products from verified creators.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-6 md:space-y-0">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Collections</h2>
            <p className="text-gray-500 mt-2">Explore our best-selling digital products</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 transition-all"
              />
            </div>
            <div className="flex bg-gray-100 p-1 rounded-2xl overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                    selectedCategory === cat.name 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={onProductClick} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <div className="bg-white p-6 rounded-full inline-block mb-4 shadow-sm">
              <Search size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl mr-2">D</div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">DigiMart<span className="text-indigo-600">Pro</span></span>
            </div>
            <p className="text-gray-500 leading-relaxed mb-6">
              The world's leading marketplace for high-quality digital assets. Empowering creators and businesses since 2024.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Platform</h5>
            <ul className="space-y-4 text-gray-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Browse Products</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Affiliate Program</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Support</h5>
            <ul className="space-y-4 text-gray-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">WhatsApp Help</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Legal</h5>
            <ul className="space-y-4 text-gray-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2024 DigiMart Pro. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-600">Twitter</a>
            <a href="#" className="hover:text-indigo-600">Facebook</a>
            <a href="#" className="hover:text-indigo-600">Instagram</a>
            <a href="#" className="hover:text-indigo-600">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
