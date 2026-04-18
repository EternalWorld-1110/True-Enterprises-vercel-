import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Settings, Laptop, LogOut, LogIn, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Inventory', path: '/laptops' },
    { name: 'Contact Us', path: 'whatsapp' },
  ];

  const Logo = () => (
    <div className="flex items-center gap-3 group">
      <motion.div 
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="relative w-10 h-10 md:w-12 md:h-12"
      >
        <div className="absolute inset-0 bg-brand-primary rounded-xl rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-brand-primary/20" />
        <div className="absolute inset-0 bg-brand-accent rounded-xl -rotate-6 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center border-2 border-brand-primary/10">
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-brand-primary" strokeWidth={2.5} />
        </div>
      </motion.div>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-black text-brand-dark leading-none tracking-tighter">TRUE</span>
        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Enterprises</span>
      </div>
    </div>
  );

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 px-4 md:px-8' 
          : 'py-6 px-4 md:px-8'
      }`}
    >
      <div 
        className={`mx-auto max-w-7xl transition-all duration-500 rounded-2xl px-6 md:px-10 flex h-16 md:h-20 items-center justify-between ${
          isScrolled 
            ? 'glass-card backdrop-blur-xl bg-white/90 shadow-2xl shadow-brand-primary/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-2">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Desktop Nav */}
          <div className="flex items-center gap-10">
            <a 
              href={`https://wa.me/919421947545?text=${encodeURIComponent("Hello True Enterprises! I need some assistance with your Support Hotline. Can you help?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-brand-dark hidden lg:flex mr-4 group/hotline hover:bg-slate-50 p-2 rounded-xl transition-all"
            >
              <div className="bg-brand-accent p-2 rounded-lg group-hover/hotline:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-dark"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-black tracking-widest text-brand-grey mb-1">Support Hotline</span>
                <span className="text-sm font-black text-brand-primary">+91 9421947545</span>
              </div>
            </a>
            
            <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.path === 'whatsapp' ? (
                <a
                  key={link.path}
                  href={`https://wa.me/919421947545?text=${encodeURIComponent("Hello True Enterprises! I need some assistance with your services/products. Can you help?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative text-sm font-semibold text-brand-dark hover:text-brand-primary transition-colors group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative text-sm font-semibold text-brand-dark hover:text-brand-primary transition-colors group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            ))}
          </div>
          
          <div className="h-6 w-px bg-slate-200 mx-2" />

          <div className="flex items-center gap-6">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-[#0d47a1] bg-brand-primary/10 px-4 py-2 rounded-xl transition-all"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-brand-dark bg-slate-100 px-3 py-1.5 rounded-lg">
                  <User className="w-3.5 h-3.5 text-brand-primary" />
                  {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="button-premium flex items-center gap-2"
              >
                <span>Login</span>
                <LogIn className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 text-brand-dark hover:bg-brand-primary hover:text-white transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="md:hidden fixed inset-x-4 top-24 z-[101]"
          >
            <div className="glass-card backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/40">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  link.path === 'whatsapp' ? (
                    <a
                      key={link.path}
                      href={`https://wa.me/919421947545?text=${encodeURIComponent("Hello True Enterprises! I need some assistance with your services/products. Can you help?")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xl font-bold text-brand-dark hover:text-brand-primary transition-colors flex items-center justify-between group"
                    >
                      {link.name}
                      <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </a>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xl font-bold text-brand-dark hover:text-brand-primary transition-colors flex items-center justify-between group"
                    >
                      {link.name}
                      <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                  )
                ))}
                
                <div className="h-px bg-slate-200 my-2" />
                
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-bold text-brand-primary flex items-center gap-3"
                  >
                    <Settings className="w-5 h-5" />
                    Admin Dashboard
                  </Link>
                )}
                
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-xl font-bold text-rose-600 flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="button-premium text-center text-lg shadow-xl shadow-brand-primary/20"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
