import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Laptop, Cpu, HardDrive, Info, Search, Filter, X, ShoppingCart, MessageCircle, ChevronRight, Star, Shield, AlertCircle, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LaptopType {
  id: string;
  name: string;
  price: number;
  specifications: string;
  condition: string;
  imageUrl: string;
}

export default function Laptops() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState<LaptopType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopType | null>(null);
  const [search, setSearch] = useState('');
  const [filterCondition, setFilterCondition] = useState('All');
  const [priceRange, setPriceRange] = useState(100000);
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const fetchLaptops = async () => {
    try {
      const res = await fetch('/api/laptops');
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setLaptops(data);
        setErrorStatus(null);
      } else {
        setErrorStatus(data.error || 'Failed to sync inventory');
      }
    } catch (err) {
      console.error('Failed to fetch laptops:', err);
      setErrorStatus('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this laptop?')) return;
    
    try {
      const res = await fetch(`/api/laptops/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDeleteStatus('Item removed successfully');
        setTimeout(() => setDeleteStatus(null), 3000);
        fetchLaptops();
      } else {
        const err = await res.json();
        alert(`Delete failed: ${err.error || 'Server error'}`);
      }
    } catch (err) {
      alert('Network error during deletion');
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/admin?edit=${id}`); // Navigate to admin dash with edit ID
  };

  const filteredLaptops = laptops.filter(laptop => {
    const matchesSearch = laptop.name.toLowerCase().includes(search.toLowerCase());
    const matchesCondition = filterCondition === 'All' || laptop.condition === filterCondition;
    const matchesPrice = laptop.price <= priceRange;
    return matchesSearch && matchesCondition && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="font-black text-brand-primary uppercase tracking-widest text-xs animate-pulse">Loading Tech...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Admin Toast */}
          <AnimatePresence>
            {deleteStatus && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, x: '-50%' }}
                className="fixed top-24 left-1/2 z-[200] bg-brand-dark text-white px-8 py-4 rounded-3xl shadow-2xl font-black text-sm tracking-widest uppercase border border-white/20"
              >
                {deleteStatus}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Section */}
        <div className="relative rounded-[40px] overflow-hidden mb-16 h-[300px] md:h-[400px] shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1517433447739-89a3ca4ba74f?auto=format&fit=crop&q=80&w=2000" 
            alt="Premium Inventory" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/40 to-transparent flex flex-col justify-center px-8 md:px-16 text-white">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-accent font-black uppercase tracking-[0.3em] text-xs">Premium Catalog</span>
              <h1 className="text-4xl md:text-7xl font-black mt-4 mb-6 leading-none tracking-tighter">Pre-owned Laptops</h1>
              <p className="max-w-xl text-lg text-slate-200 font-medium">Verified, certified, and ready for your next big project. Discover Nagpur's best deals in tech.</p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-10">
            <div className="glass-card p-8 rounded-[32px] sticky top-32">
              <div className="flex items-center gap-3 mb-8">
                <Filter className="w-5 h-5 text-brand-primary" />
                <h3 className="text-xl font-bold">Filters</h3>
              </div>

              {/* Search */}
              <div className="mb-8">
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-grey block mb-3 pl-1">Search Model</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey" />
                  <input 
                    type="text" 
                    placeholder="e.g. Dell Latitude..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="mb-8">
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-grey block mb-3 pl-1">Condition</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Mint', 'Excellent', 'Good'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilterCondition(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        filterCondition === c 
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                          : 'bg-slate-100 text-brand-grey hover:bg-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-3 px-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-grey">Max Price</label>
                  <span className="text-sm font-black text-brand-primary">₹{priceRange.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="150000" 
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {errorStatus ? (
              <div className="text-center py-32 glass-card rounded-[40px] border-red-100 bg-red-50/30">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">Inventory Sync Failed</h3>
                <p className="text-red-700/70 font-medium">{errorStatus}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-8 button-premium bg-brand-dark text-white px-8 py-3"
                >
                  Retry Connection
                </button>
              </div>
            ) : filteredLaptops.length === 0 ? (
              <div className="text-center py-32 glass-card rounded-[40px] border-dashed border-2 border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Laptop className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">No Match Found</h3>
                <p className="text-brand-grey">Try adjusting your filters or search keywords.</p>
                <button 
                  onClick={() => {setSearch(''); setFilterCondition('All'); setPriceRange(150000);}}
                  className="mt-8 text-brand-primary font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredLaptops.map((laptop, index) => (
                  <motion.div
                    key={laptop.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    onClick={() => setSelectedLaptop(laptop)}
                    className="group bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 transition-all duration-500 cursor-pointer"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 italic">
                      <img
                        src={laptop.imageUrl}
                        alt={laptop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 right-6 flex gap-2">
                        {isAdmin && (
                          <>
                            <button 
                              onClick={(e) => handleEdit(e, laptop.id)}
                              className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-brand-primary shadow-xl hover:bg-white hover:scale-110 transition-all border border-brand-primary/10"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={(e) => handleDelete(e, laptop.id)}
                              className="bg-rose-500/90 backdrop-blur-md p-3 rounded-2xl text-white shadow-xl hover:bg-rose-600 hover:scale-110 transition-all border border-rose-400/20"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <div className="glass-dark px-4 py-2 rounded-2xl text-[10px] font-black uppercase text-white shadow-xl">
                          {laptop.condition}
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6">
                        <div className="bg-brand-accent px-4 py-2 rounded-2xl text-sm font-black text-brand-dark shadow-xl">
                          ₹{laptop.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                       <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-brand-accent text-brand-accent' : 'text-slate-300'}`} />
                          ))}
                       </div>
                      <h3 className="text-2xl font-black text-brand-dark mb-3 line-clamp-1">{laptop.name}</h3>
                      <p className="text-sm text-brand-grey mb-8 line-clamp-2 leading-relaxed">
                        {laptop.specifications}
                      </p>

                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <Cpu className="w-3.5 h-3.5 text-brand-primary" />
                          <span className="text-[10px] font-bold text-brand-dark uppercase tracking-tighter">Quad-Core</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <HardDrive className="w-3.5 h-3.5 text-brand-primary" />
                          <span className="text-[10px] font-bold text-brand-dark uppercase tracking-tighter">SSD Storage</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedLaptop(laptop)}
                        className="w-full group/btn button-premium flex items-center justify-center gap-3 py-5"
                      >
                        <Info className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-widest">Details & Contact</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedLaptop && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLaptop(null)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative w-full max-w-5xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedLaptop(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 backdrop-blur-xl text-white md:text-brand-dark md:bg-slate-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-1/2 h-80 md:h-auto relative">
                <img 
                  src={selectedLaptop.imageUrl} 
                  alt={selectedLaptop.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-8 left-8">
                  <div className="bg-brand-accent px-6 py-3 rounded-2xl text-xl font-black text-brand-dark shadow-2xl border-4 border-white">
                    ₹{selectedLaptop.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-10 md:p-14 overflow-y-auto">
                <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px]">Laptop Details</span>
                <h2 className="text-3xl md:text-5xl font-black text-brand-dark mt-4 mb-8 leading-tight">
                  {selectedLaptop.name}
                </h2>

                <div className="space-y-10">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-grey mb-4">Specifications</h4>
                    <p className="text-lg text-brand-dark leading-relaxed font-medium">
                      {selectedLaptop.specifications}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-brand-grey mb-2">Condition</h4>
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">
                        <Shield className="w-4 h-4" />
                        {selectedLaptop.condition}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-brand-grey mb-2">Stock ID</h4>
                      <div className="text-sm font-black text-brand-dark">TE-{selectedLaptop.id.substring(0, 8).toUpperCase()}</div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <div className="flex flex-col gap-4">
                    <a 
                      href={`https://wa.me/919421947545?text=I'm interested in ${selectedLaptop.name} (Stock ID: TE-${selectedLaptop.id.substring(0, 8).toUpperCase()})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-accent flex items-center justify-center gap-3 py-5 text-lg"
                    >
                      <MessageCircle className="w-6 h-6" />
                      Enquire on WhatsApp
                    </a>
                    <button className="button-premium flex items-center justify-center gap-3 py-5 text-lg">
                      <ShoppingCart className="w-6 h-6" />
                      Add to Cart (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
