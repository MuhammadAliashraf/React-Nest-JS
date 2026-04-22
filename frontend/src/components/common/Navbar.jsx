import { Search, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { isAdmin } from '../../utils/permissions';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <header className="sticky top-0 w-full z-40 transition-colors duration-300 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <nav className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-[1600px] mx-auto relative bg-transparent">
          
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/" className="text-xl md:text-2xl font-black uppercase tracking-widest text-black font-heading shrink-0">
              {settings.appName || 'APP TEMPLATE'}
            </Link>
            
            {/* Main Links */}
            <div className="hidden md:flex items-center gap-8 uppercase text-[11px] font-bold tracking-widest">
              <Link to="/" className="hover:text-gray-500 transition text-black">Home</Link>
              {isAuthenticated && (
                <Link to="/account" className="hover:text-gray-500 transition text-black">Dashboard</Link>
              )}
              {isAuthenticated && isAdmin() && (
                <Link to="/admin/users" className="hover:text-gray-500 transition text-black">Administration</Link>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-5 text-black">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="hover:text-gray-500 transition flex items-center gap-2">
                  <User size={20} strokeWidth={1.5}/>
                  <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest truncate max-w-[100px]">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white border border-gray-100 shadow-2xl rounded-xl py-4 min-w-[180px] overflow-hidden">
                    <Link to="/account" className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all">
                      Profile Settings
                    </Link>
                    {isAdmin() && (
                      <Link to="/admin/users" className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all">
                        Admin Portal
                      </Link>
                    )}
                    <button onClick={logout} className="w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
