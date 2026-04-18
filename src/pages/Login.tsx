import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle, ArrowRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        navigate('/admin');
      } else {
        setError(data.error || 'Identity verification failed');
      }
    } catch (err) {
      setError('System communication error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-32 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary opacity-10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent opacity-10 blur-[150px] rounded-full" />
      </div>

      <Link 
        to="/" 
        className="fixed top-8 left-8 flex items-center gap-2 text-brand-dark/50 hover:text-brand-primary transition-colors font-black uppercase tracking-widest text-xs z-50"
      >
        <Home className="w-4 h-4" />
        <span>Return Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-12 md:p-16 rounded-[60px] relative">
          <div className="flex flex-col items-center mb-12">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="bg-brand-dark p-5 rounded-[30px] mb-8 shadow-2xl shadow-brand-dark/20"
            >
              <Shield className="w-10 h-10 text-brand-accent" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 italic tracking-tighter">Secure Access</h1>
            <p className="text-brand-grey font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Administrative Terminal
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 flex items-center gap-4 p-5 text-sm font-bold text-red-600 bg-red-50 rounded-[24px] border border-red-100"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40 ml-4">Access ID</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/20 group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[30px] focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-bold text-brand-dark placeholder:text-slate-300"
                  placeholder="Official Username"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40 ml-4">Clearance Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/20 group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[30px] focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-bold text-brand-dark placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-premium py-6 text-xl shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-4 mt-8 group"
            >
              <span className="font-black italic uppercase tracking-widest">
                {loading ? 'Authenticating...' : 'Authorize Login'}
              </span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 text-center">
             <div className="inline-block p-4 rounded-3xl bg-slate-50 border border-slate-100 italic text-xs text-brand-grey font-bold">
               Standard Credentials: <span className="font-mono text-brand-dark">admin / password123</span>
             </div>
          </div>
        </div>
        
        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30">
          Unauthorized access is strictly monitored & recorded.
        </p>
      </motion.div>
    </div>
  );
}
