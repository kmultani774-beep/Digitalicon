
import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { UserRole } from '../types';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl mr-2">D</div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">DigiMart<span className="text-indigo-600">Pro</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onNavigate(user.role === UserRole.ADMIN ? 'admin' : 'dashboard')}
                  className="flex items-center text-gray-600 hover:text-indigo-600 font-medium"
                >
                  <LayoutDashboard className="w-5 h-5 mr-1" />
                  {user.role === UserRole.ADMIN ? 'Admin' : 'Dashboard'}
                </button>
                <button 
                  onClick={onLogout}
                  className="flex items-center text-red-500 hover:text-red-600 font-medium"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-md"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="block text-gray-600 hover:text-indigo-600 font-medium">
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            {user ? (
              <>
                <button onClick={() => { onNavigate(user.role === UserRole.ADMIN ? 'admin' : 'dashboard'); setIsMenuOpen(false); }} className="flex items-center text-gray-600">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  {user.role === UserRole.ADMIN ? 'Admin Dashboard' : 'User Dashboard'}
                </button>
                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="flex items-center text-red-500">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-center font-semibold">
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
