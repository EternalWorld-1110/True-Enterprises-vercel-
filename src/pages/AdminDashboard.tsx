import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit3, Save, X, Laptop as LaptopIcon, Tag, LayoutDashboard, ShoppingBag, Bell, Settings, LogOut, Search, ChevronRight, Image as ImageIcon, CheckCircle2, AlertCircle, Upload, Users2, FileText, Newspaper, UserPlus, Eye, EyeOff, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface LaptopType {
  id: string;
  name: string;
  price: number;
  specifications: string;
  condition: string;
  imageUrl: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

interface Lead {
  id: string;
  name: string;
  service: string;
  description: string;
  address: string;
  status: string;
  createdAt: string;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const location = useLocation();
  const [laptops, setLaptops] = useState<LaptopType[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'laptops' | 'offers' | 'overview' | 'leads' | 'admins' | 'news'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'laptop' | 'news' | 'offer' } | null>(null);

  // Form states
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '', category: 'Hardware', summary: '', imageUrl: '', videoUrl: ''
  });
  const [isAddingLaptop, setIsAddingLaptop] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState<LaptopType | null>(null);
  const [laptopForm, setLaptopForm] = useState({
    name: '', price: 0, specifications: '', condition: 'Mint', imageUrl: ''
  });

  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState({
    title: '', description: '', active: true
  });

  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({
    username: '', password: '', email: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  },[]);

  // Effect to handle deep linking to edit modal
  useEffect(() => {
    if (laptops.length > 0) {
      const params = new URLSearchParams(location.search);
      const editId = params.get('edit');
      if (editId) {
        const laptopToEdit = laptops.find(l => l.id === editId);
        if (laptopToEdit) {
          openEditLaptop(laptopToEdit);
          // Clear query param without full navigation if possible, but for simplicity we'll just open
        }
      }
    }
  }, [laptops, location.search]);

  const fetchData = async () => {
    try {
      const [lRes, oRes, leadRes, adminRes, newsRes] = await Promise.all([
        fetch('/api/laptops'),
        fetch('/api/offers?all=true'),
        fetch('/api/leads', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/auth/admins', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/news')
      ]);
      
      const lData = await lRes.json();
      const oData = await oRes.json();
      const leadData = await leadRes.json();
      const adminData = await adminRes.json();
      const newsData = await newsRes.json();

      setLaptops(Array.isArray(lData) ? lData : []);
      setOffers(Array.isArray(oData) ? oData : []);
      setLeads(Array.isArray(leadData) ? leadData : []);
      setAdmins(Array.isArray(adminData) ? adminData : []);
      setNews(Array.isArray(newsData) ? newsData : []);
    } catch (err) {
      console.error('Data fetch failed');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleLaptopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    // Generate placeholder if URL is empty
    let laptopData = { ...laptopForm };
    if (!laptopData.imageUrl) {
      const keywords = laptopData.name.split(' ')[0] || 'laptop';
      laptopData.imageUrl = `https://picsum.photos/seed/${keywords}-${Date.now()}/800/600`;
    }

    try {
      const url = editingLaptop ? `/api/laptops/${editingLaptop.id}` : '/api/laptops';
      const method = editingLaptop ? 'PUT' : 'POST';
      
      console.log(`[Admin] Submitting laptop to ${url} via ${method}`);
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(laptopData)
      });
      
      if (res.ok) {
        setIsAddingLaptop(false);
        setEditingLaptop(null);
        setLaptopForm({ name: '', price: 0, specifications: '', condition: 'Mint', imageUrl: '' });
        await fetchData();
        showSuccess(editingLaptop ? 'Laptop updated successfully!' : 'Laptop added successfully!');
      } else {
        let errorMsg = 'Check server logs';
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorData.details || errorMsg;
        } catch (jsonErr) {
          errorMsg = res.statusText || errorMsg;
        }
        console.error('Submit failed:', errorMsg);
        showError(`Submission Error: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error('Failed to submit laptop:', err);
      showError(`Network or Server Error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditLaptop = (laptop: LaptopType) => {
    setEditingLaptop(laptop);
    setLaptopForm({
      name: laptop.name,
      price: laptop.price,
      specifications: laptop.specifications,
      condition: laptop.condition,
      imageUrl: laptop.imageUrl
    });
    setIsAddingLaptop(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLaptopForm({ ...laptopForm, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLaptop = async (id: string) => {
    setDeleteConfirm({ id, type: 'laptop' });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { id, type } = deleteConfirm;
    
    try {
      const endpoint = type === 'laptop' ? `/api/laptops/${id}` : type === 'news' ? `/api/news/${id}` : `/api/offers/${id}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`);
      } else {
        showError(`Failed to delete ${type}`);
      }
    } catch (err) {
      console.error('Delete failed');
      showError('Network error during deletion');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingOffer ? `/api/offers/${editingOffer.id}` : '/api/offers';
      const method = editingOffer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(offerForm)
      });
      if (res.ok) {
        setIsAddingOffer(false);
        setEditingOffer(null);
        setOfferForm({ title: '', description: '', active: true });
        fetchData();
        showSuccess(editingOffer ? 'Offer updated!' : 'Offer launched!');
      }
    } catch (err) {
      console.error('Failed to submit offer');
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = editingNews ? `/api/news/${editingNews.id}` : '/api/news';
      const method = editingNews ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newsForm)
      });
      if (res.ok) {
        setIsAddingNews(false);
        setEditingNews(null);
        setNewsForm({ title: '', category: 'Hardware', summary: '', imageUrl: '', videoUrl: '' });
        fetchData();
        showSuccess(editingNews ? 'News article updated' : 'News article published to Tech Hub');
      }
    } catch (err) {
      showError('Failed to publish news');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditNews = (item: any) => {
    setEditingNews(item);
    setNewsForm({
      title: item.title,
      category: item.category,
      summary: item.summary,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl || ''
    });
    setIsAddingNews(true);
  };

  const openEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setOfferForm({
      title: offer.title,
      description: offer.description,
      active: offer.active
    });
    setIsAddingOffer(true);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(adminForm)
      });
      if (res.ok) {
        setIsAddingAdmin(false);
        setAdminForm({ username: '', password: '', email: '' });
        fetchData();
        showSuccess('New administrator added');
      } else {
        const error = await res.json();
        showError(error.error || 'Failed to add admin');
      }
    } catch (err) {
      showError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
        showSuccess('Lead status updated');
      }
    } catch (err) {
      showError('Failed to update lead');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-dark hidden lg:flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-brand-primary p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-tight">Admin</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Control Panel</span>
            </div>
          </div>

          <nav className="space-y-4">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'leads', label: 'Client Enquiries', icon: FileText },
              { id: 'laptops', label: 'Stock Management', icon: ShoppingBag },
              { id: 'offers', label: 'Promo Banners', icon: Bell },
              { id: 'news', label: 'Tech Hub', icon: Newspaper },
              { id: 'admins', label: 'Admin Team', icon: Users2 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between group px-5 py-4 rounded-2xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5 space-y-4">
          <button className="w-full flex items-center gap-4 text-slate-400 hover:text-white transition-all px-5 py-3">
            <Settings className="w-5 h-5" />
            <span className="font-bold text-sm">Settings</span>
          </button>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-4 text-rose-400 hover:text-rose-300 transition-all px-5 py-3"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pb-20 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources..."
                className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 ml-6">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-brand-dark">Administrator</div>
                <div className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">Verified Session</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center font-black text-white shadow-lg">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {/* Success & Error Toast Animation */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
                className="fixed top-24 left-1/2 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
              >
                <CheckCircle2 className="w-5 h-5" />
                {successMessage}
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
                className="fixed top-24 left-1/2 z-[200] bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
              >
                <AlertCircle className="w-5 h-5" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* News Table/Cards */}
          <AnimatePresence>
            {deleteConfirm && (
              <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-white rounded-[40px] p-8 text-center">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Trash2 className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-black text-brand-dark mb-2 uppercase">Confirm Removal?</h3>
                  <p className="text-brand-grey text-sm font-medium mb-8 italic">This action cannot be undone and will permanently erase this record from the database.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 font-black text-brand-grey uppercase tracking-widest text-xs">Back</button>
                    <button onClick={confirmDelete} className="flex-1 bg-rose-500 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-500/20">Delete Forever</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {activeTab === 'laptops' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-brand-dark">Stock Management</h1>
                  <p className="text-brand-grey font-medium mt-2">Update your available machine stock, pricing, and health conditions.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingLaptop(null);
                    setLaptopForm({ name: '', price: 0, specifications: '', condition: 'Mint', imageUrl: '' });
                    setIsAddingLaptop(true);
                  }}
                  className="button-premium group flex items-center gap-3 px-8 py-4 transition-all"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Register Laptop</span>
                </button>
              </div>

              {/* Add Laptop Modal */}
              <AnimatePresence>
                {isAddingLaptop && (
                  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsAddingLaptop(false)}
                      className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh]"
                    >
                      <div className="bg-brand-primary p-8 md:p-10 flex items-center justify-between text-white">
                        <div>
                          <h2 className="text-3xl font-black">{editingLaptop ? 'Edit Asset' : 'Add New Asset'}</h2>
                          <p className="text-white/70 font-medium">Internal Inventory Management</p>
                        </div>
                        <button 
                          onClick={() => {
                            setIsAddingLaptop(false);
                            setEditingLaptop(null);
                          }}
                          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <form onSubmit={handleLaptopSubmit} className="p-8 md:p-12 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                             <div>
                                <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Identity</label>
                                <input 
                                  type="text" required value={laptopForm.name}
                                  onChange={e => setLaptopForm({...laptopForm, name: e.target.value})}
                                  placeholder="e.g. Alienware M15 R6"
                                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-bold"
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Price (₹)</label>
                                  <input 
                                    type="number" required value={laptopForm.price}
                                    onChange={e => setLaptopForm({...laptopForm, price: Number(e.target.value)})}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-black text-brand-primary"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Condition</label>
                                  <select 
                                    value={laptopForm.condition}
                                    onChange={e => setLaptopForm({...laptopForm, condition: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold"
                                  >
                                    <option>Mint</option>
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Needs Repair</option>
                                  </select>
                                </div>
                             </div>
                             <div>
                                <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Technical Specs</label>
                                <textarea 
                                  required value={laptopForm.specifications}
                                  onChange={e => setLaptopForm({...laptopForm, specifications: e.target.value})}
                                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 h-32 focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium"
                                  placeholder="16GB RAM, RTX 3060, 1TB NVMe..."
                                />
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div className="flex items-end gap-3">
                                <div className="flex-1">
                                   <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Media Source</label>
                                   <input 
                                     type="text" value={laptopForm.imageUrl}
                                     onChange={e => setLaptopForm({...laptopForm, imageUrl: e.target.value})}
                                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm"
                                     placeholder="Paste image URL here..."
                                   />
                                </div>
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    id="laptop-image-upload" 
                                    onChange={handleFileUpload}
                                  />
                                  <label 
                                    htmlFor="laptop-image-upload"
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-dark px-6 py-4 rounded-2xl font-bold text-xs cursor-pointer transition-all border-2 border-slate-200"
                                  >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload</span>
                                  </label>
                                </div>
                             </div>
                             <div className="relative group rounded-3xl overflow-hidden bg-slate-100 aspect-video flex items-center justify-center border-4 border-dashed border-slate-200">
                                {laptopForm.imageUrl ? (
                                  <img 
                                    src={laptopForm.imageUrl} 
                                    className="w-full h-full object-cover" 
                                    alt="Preview" 
                                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/error/800/600')}
                                  />
                                ) : (
                                  <div className="text-center text-slate-400">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">Visual Preview</span>
                                  </div>
                                )}
                             </div>
                             <div className="bg-brand-accent/10 p-5 rounded-2xl flex gap-4">
                                <AlertCircle className="w-6 h-6 text-brand-accent shrink-0" />
                                <p className="text-xs text-brand-dark/70 font-medium">Use high-resolution images. Transparent backgrounds are preferred for premium aesthetics.</p>
                             </div>
                          </div>
                        </div>

                        <div className="flex gap-4 justify-end">
                          <button type="button" onClick={() => {
                            setIsAddingLaptop(false);
                            setEditingLaptop(null);
                          }} className="px-10 py-5 text-sm font-black uppercase tracking-widest text-brand-grey hover:text-brand-dark transition-colors">Discard</button>
                          <button 
                            type="submit" 
                            disabled={isLoading}
                            className="button-premium px-12 py-5 shadow-2xl shadow-brand-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? 'Processing...' : (editingLaptop ? 'Update Details' : 'Secure & Finalize')}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Table List */}
              <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey">Machine Identity</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey">Valuation</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey">Health Status</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {laptops.map(laptop => (
                        <tr key={laptop.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 italic relative">
                                <img src={laptop.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-brand-dark">{laptop.name}</span>
                                <span className="text-[10px] text-brand-grey font-bold tracking-tighter">ID: TE-{String(laptop.id).substring(0, 8)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <span className="text-sm font-black text-brand-primary">₹{laptop.price.toLocaleString()}</span>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${laptop.condition === 'Mint' ? 'bg-emerald-500' : 'bg-brand-accent'}`} />
                               <span className="text-[10px] font-black uppercase tracking-tighter text-brand-dark">{laptop.condition}</span>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openEditLaptop(laptop)}
                                className="p-3 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteLaptop(laptop.id)} 
                                className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {laptops.length === 0 && (
                  <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-dashed border-slate-100">
                      <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Assets Records Found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'offers' && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-10"
            >
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-brand-dark">Active Promotions</h1>
                  <p className="text-brand-grey font-medium mt-2">Manage dynamic offer banners visible across the site.</p>
                </div>
                <button 
                   onClick={() => {
                    setEditingOffer(null);
                    setOfferForm({ title: '', description: '', active: true });
                    setIsAddingOffer(true);
                   }}
                   className="button-accent group flex items-center gap-3 px-8 py-4 transition-all"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Launch Offer</span>
                </button>
              </div>

               {isAddingOffer && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAddingOffer(false)}
                    className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 15 }}
                    className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh] p-10"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <h2 className="text-3xl font-black">{editingOffer ? 'Modify Campaign' : 'Design Offer'}</h2>
                      <button onClick={() => {
                        setIsAddingOffer(false);
                        setEditingOffer(null);
                      }} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <form onSubmit={handleOfferSubmit} className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Banner Headline</label>
                        <input 
                          type="text" required value={offerForm.title}
                          onChange={e => setOfferForm({...offerForm, title: e.target.value})}
                          placeholder="e.g. Festival Mega Sale"
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Brief Detail</label>
                          <textarea 
                            required value={offerForm.description}
                            onChange={e => setOfferForm({...offerForm, description: e.target.value})}
                            placeholder="Get up to 30% off..."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 h-32 font-medium"
                          />
                        </div>
                        <div className="space-y-6">
                           <div>
                              <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Live Visibility</label>
                              <div className="flex p-2 bg-slate-100 rounded-2xl">
                                 <button 
                                  type="button"
                                  onClick={() => setOfferForm({...offerForm, active: true})}
                                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${offerForm.active ? 'bg-white shadow-xl text-brand-primary' : 'text-brand-grey'}`}
                                 >
                                   PUBLISH
                                 </button>
                                 <button 
                                  type="button"
                                  onClick={() => setOfferForm({...offerForm, active: false})}
                                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${!offerForm.active ? 'bg-white shadow-xl text-brand-primary' : 'text-brand-grey'}`}
                                 >
                                   DRAFT
                                 </button>
                              </div>
                           </div>
                           <div className="bg-slate-50 p-6 rounded-3xl text-center flex flex-col items-center">
                              <Bell className="w-8 h-8 text-brand-accent mb-4" />
                              <p className="text-[10px] font-bold text-brand-grey leading-relaxed">This will appear in the scrolling marquee at the footer.</p>
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                        <button type="submit" className="button-accent flex-1 py-5 text-lg font-black uppercase tracking-widest">
                          {editingOffer ? 'Update Campaign' : 'Activate Promotion'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {offers.map(offer => (
                    <motion.div 
                      key={offer.id} 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 blur-[80px] opacity-20 ${offer.active ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                      
                      <div className="flex items-center justify-between mb-8">
                        <Tag className="w-8 h-8 text-brand-primary" />
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${offer.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {offer.active ? 'LIVE' : 'PAUSED'}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-black text-brand-dark mb-4">{offer.title}</h3>
                      <p className="text-brand-grey font-medium mb-10 leading-relaxed">{offer.description}</p>
                      
                      <button 
                        onClick={() => openEditOffer(offer)}
                        className="w-full bg-slate-50 border-2 border-slate-100 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-grey hover:bg-slate-100 transition-colors"
                      >
                        Edit Campaign
                      </button>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
               <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-4xl font-black text-brand-dark uppercase italic tracking-tighter">Business Leads</h1>
                    <p className="text-brand-grey font-medium mt-2">Conversion report generated through Website WhatsApp integration.</p>
                  </div>
                  <div className="bg-brand-primary/10 px-6 py-3 rounded-2xl text-brand-primary font-black text-xs uppercase tracking-widest border border-brand-primary/20">
                     Total Leads: {leads.length}
                  </div>
               </div>

               <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left order-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey">Customer</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey">Requested Service</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey">Location</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey">Status</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-brand-grey text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 italic">
                        {leads.map(lead => (
                          <tr key={lead.id} className="group hover:bg-slate-50">
                            <td className="px-10 py-6">
                               <div className="flex flex-col">
                                  <span className="font-black text-brand-dark">{lead.name}</span>
                                  <span className="text-[10px] font-medium text-brand-grey line-clamp-1 max-w-[200px]">{lead.description}</span>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <span className="px-3 py-1 bg-brand-primary/5 text-brand-primary rounded-lg text-[10px] font-black uppercase">{lead.service}</span>
                            </td>
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                  <MapPin className="w-3 h-3" /> {lead.address}
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <select 
                                 value={lead.status}
                                 onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                 className="bg-transparent font-black uppercase text-[10px] focus:outline-none cursor-pointer text-brand-dark"
                               >
                                  <option value="new">New Inquiry</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="closed">Completed</option>
                                  <option value="lost">Cancelled</option>
                               </select>
                            </td>
                            <td className="px-10 py-6 text-right font-mono text-xs text-brand-grey">
                               {new Date(lead.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'admins' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
               <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-4xl font-black text-brand-dark">Privilege Control</h1>
                    <p className="text-brand-grey font-medium mt-2">Authorized staff members with access to this dashboard.</p>
                  </div>
                  <button onClick={() => setIsAddingAdmin(true)} className="button-premium flex items-center gap-3">
                     <UserPlus className="w-5 h-5" /> Add Admin
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {admins.map(admin => (
                    <div key={admin.id} className="bg-white p-8 rounded-[30px] shadow-xl border border-slate-100 flex flex-col items-center text-center">
                       <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                          <ShieldCheck className="w-8 h-8 text-brand-primary" />
                       </div>
                       <h3 className="font-black text-brand-dark text-lg">{admin.username}</h3>
                       <p className="text-sm font-bold text-brand-grey mb-6">{admin.email}</p>
                       <div className="px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest">
                          {admin.role}
                       </div>
                    </div>
                  ))}
               </div>

               <AnimatePresence>
                 {isAddingAdmin && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingAdmin(false)} className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" />
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
                         <h2 className="text-3xl font-black mb-8 px-2 border-l-4 border-brand-accent">Add New Admin</h2>
                         <form onSubmit={handleAdminSubmit} className="space-y-6">
                            <div>
                               <label className="text-[10px] font-black uppercase text-brand-grey mb-2 block tracking-widest">Username</label>
                               <input type="text" required value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold" />
                            </div>
                            <div>
                               <label className="text-[10px] font-black uppercase text-brand-grey mb-2 block tracking-widest">Email Address</label>
                               <input type="email" required value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold" />
                            </div>
                            <div className="relative">
                               <label className="text-[10px] font-black uppercase text-brand-grey mb-2 block tracking-widest">Set Password</label>
                               <input type={showPassword ? 'text' : 'password'} required value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold" />
                               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-4 text-brand-grey">
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                               </button>
                            </div>
                            <button type="submit" disabled={isLoading} className="button-premium w-full py-5 rounded-2xl">
                               {isLoading ? 'Creating...' : 'Register Administrator'}
                            </button>
                         </form>
                      </motion.div>
                    </div>
                 )}
               </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
               <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-4xl font-black text-brand-dark italic">Tech Hub Editor</h1>
                    <p className="text-brand-grey font-medium mt-2">Manage the articles and videos displayed on the home page.</p>
                  </div>
                  <button onClick={() => setIsAddingNews(true)} className="button-premium flex items-center gap-3">
                     <Plus className="w-5 h-5" /> Add News
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {news.map((item, i) => (
                    <div key={i} className="bg-white rounded-[30px] overflow-hidden shadow-xl border border-slate-100 flex flex-col">
                       <div className="h-48 relative">
                          <img src={item.imageUrl} className="w-full h-full object-cover" />
                          <div className="absolute top-4 left-4 px-3 py-1 bg-brand-accent text-brand-dark text-[10px] font-black uppercase rounded-full">
                             {item.category}
                          </div>
                       </div>
                       <div className="p-8 flex-1">
                          <h3 className="font-black text-brand-dark leading-tight mb-3">{item.title}</h3>
                          <p className="text-xs text-brand-grey line-clamp-2 mb-6">{item.summary}</p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                             <span className="text-[10px] font-bold text-brand-grey">{new Date(item.publishedAt).toLocaleDateString()}</span>
                             <div className="flex gap-2">
                                <button onClick={() => openEditNews(item)} className="p-2 text-brand-grey hover:text-brand-primary transition-colors"><Edit3 className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteConfirm({ id: item.id, type: 'news' })} className="p-2 text-brand-grey hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <AnimatePresence>
                  {isAddingNews && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingNews(false)} className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" />
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-3xl font-black mb-8 px-2 border-l-4 border-brand-accent uppercase italic">{editingNews ? 'Update Article' : 'Publish News'}</h2>
                        <form onSubmit={handleNewsSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                  <label className="text-[10px] font-black uppercase text-brand-grey mb-2 block tracking-widest">Headline</label>
                                  <input type="text" required value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold" />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black uppercase text-brand-grey mb-2 block tracking-widest">Category</label>
                                  <select value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold">
                                     <option>Hardware</option>
                                     <option>Security</option>
                                     <option>Performance</option>
                                     <option>Network</option>
                                     <option>Software</option>
                                  </select>
                               </div>
                            </div>
                            <div>
                               <label className="text-[10px] font-black uppercase text-brand-grey mb-2 block tracking-widest">Summary</label>
                               <textarea required value={newsForm.summary} onChange={e => setNewsForm({...newsForm, summary: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-4 font-medium h-24" />
                            </div>
                            <div>
                               <label className="text-[10px] font-black uppercase text-brand-grey mb-2 block tracking-widest">Image URL (from net)</label>
                               <input type="text" required value={newsForm.imageUrl} onChange={e => setNewsForm({...newsForm, imageUrl: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold text-xs" placeholder="https://images.unsplash.com/..." />
                            </div>
                            <div>
                               <label className="text-[10px] font-black uppercase text-brand-grey mb-2 block tracking-widest">Video URL (mp4)</label>
                               <input type="text" value={newsForm.videoUrl} onChange={e => setNewsForm({...newsForm, videoUrl: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold text-xs" placeholder="https://..." />
                            </div>
                            <button type="submit" disabled={isLoading} className="button-premium w-full py-5 rounded-2xl text-xl mt-4">
                               {isLoading ? 'Publishing...' : 'Blast to Tech Hub'}
                            </button>
                         </form>
                      </motion.div>
                    </div>
                  )}
               </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Sales', value: '₹1.2M', sub: '+12% this month', icon: ShoppingBag, color: 'brand-primary' },
                    { label: 'Active Leads', value: leads.filter(l => l.status === 'new').length, sub: 'Needs attention', icon: FileText, color: 'brand-accent' },
                    { label: 'Inventory', value: laptops.length, sub: 'Machine across Nagpur', icon: LaptopIcon, color: 'brand-dark' },
                    { label: 'Admin Access', value: admins.length, sub: 'Authorized users', icon: ShieldCheck, color: 'brand-primary' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[30px] shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1">
                       <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 flex items-center justify-center mb-4`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                       </div>
                       <div className="text-3xl font-black text-brand-dark mb-1">{stat.value}</div>
                       <div className="text-[10px] font-black uppercase text-brand-grey tracking-widest">{stat.label}</div>
                       <div className="text-[10px] font-bold text-emerald-600 mt-2">{stat.sub}</div>
                    </div>
                  ))}
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
                     <h3 className="text-2xl font-black mb-8">Recent Lead Inquiries</h3>
                     <div className="space-y-6">
                        {leads.slice(0, 5).map(lead => (
                          <div key={lead.id} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-black text-brand-primary text-xs italic">
                                   {lead.name.substring(0, 1)}
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-sm font-black text-brand-dark">{lead.name}</span>
                                   <span className="text-[10px] font-bold text-brand-grey">{lead.service}</span>
                                </div>
                             </div>
                             <button onClick={() => setActiveTab('leads')} className="text-[10px] font-black uppercase tracking-widest text-brand-primary">View</button>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-brand-dark p-10 rounded-[40px] shadow-xl text-white relative overflow-hidden">
                     <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full" />
                     <h3 className="text-2xl font-black mb-8 relative z-10">Quick Actions</h3>
                     <div className="grid grid-cols-2 gap-4 relative z-10">
                        <button onClick={() => setActiveTab('laptops')} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center text-center">
                           <LaptopIcon className="w-8 h-8 text-brand-accent mb-3" />
                           <span className="text-xs font-black uppercase">Add laptop</span>
                        </button>
                        <button onClick={() => setActiveTab('leads')} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center text-center">
                           <FileText className="w-8 h-8 text-brand-primary mb-3" />
                           <span className="text-xs font-black uppercase">Check Leads</span>
                        </button>
                        <button onClick={() => setIsAddingOffer(true)} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center text-center">
                           <Tag className="w-8 h-8 text-emerald-400 mb-3" />
                           <span className="text-xs font-black uppercase">New Promo</span>
                        </button>
                        <button onClick={() => setActiveTab('admins')} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center text-center">
                           <Users2 className="w-8 h-8 text-indigo-400 mb-3" />
                           <span className="text-xs font-black uppercase">Staff Management</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
