import { Shield, PenTool as Tool, Monitor, CheckCircle2, ArrowRight, Zap, Trophy, Heart, X, MessageCircle, MapPin, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

export default function Services() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    service: 'CCTV Camera Installation',
    description: '',
    address: ''
  });

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save lead to database first
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestForm)
      });
    } catch (err) {
      console.error('Failed to log lead effectively, but continuing to WhatsApp');
    }

    const message = `Hello True Enterprises! 👋\n\nI would like to request *${requestForm.service}*.\n\n*Name:* ${requestForm.name}\n*Requirement:* ${requestForm.description}\n*Location:* ${requestForm.address}\n\nPlease let me know the technician availability. Thanks!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919421947545?text=${encodedMessage}`;
    
    // Create a temporary anchor to force reliable redirect in iframes
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsRequestModalOpen(false);
  };

  const services = [
    {
      title: 'CCTV Camera Installation',
      description: 'We provide end-to-end surveillance solutions for security that never sleeps. From simple home kits to complex industrial IP camera systems, we ensure every corner is covered.',
      features: [
        'IP & Analog Camera setups',
        'Remote mobile monitoring',
        'Night vision & Motion detection',
        'DVR/NVR Troubleshooting',
        'Yearly Maintenance Contracts'
      ],
      icon: Shield,
      image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=1200',
      accent: 'text-brand-primary',
      bg: 'bg-brand-primary'
    },
    {
      title: 'PC & Laptop Repair',
      description: 'Fast, reliable, and professional repair services for all brands. Our certified technicians handle everything from broken screens to complex motherboard issues.',
      features: [
        'Chip-level motherboard repair',
        'Broken screen replacement',
        'Data recovery services',
        'Software installation & formatting',
        'Hardware upgrades (RAM/SSD)'
      ],
      icon: Tool,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      accent: 'text-brand-accent',
      bg: 'bg-brand-accent'
    }
  ];

  return (
    <div className="pt-32 pb-20 overflow-x-hidden">
      {/* On-Site Service Banner / Carousel */}
      <div className="bg-brand-primary py-4 overflow-hidden whitespace-nowrap relative select-none">
        <div className="inline-block animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-white text-xs font-black uppercase tracking-[0.2em] mx-8 flex items-center gap-2 inline-flex">
              <Truck className="w-4 h-4" /> ON-SITE SERVICE ONLY • NO NEED TO MOVE ANYWHERE • WE COME TO YOU •
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-xs">Expert Solutions</span>
          <h1 className="text-5xl md:text-7xl font-black text-brand-dark mt-4 mb-6 leading-[0.9] tracking-tighter">Our Core Expertise</h1>
          <p className="text-brand-grey max-w-2xl mx-auto text-lg font-medium">
            True Enterprises combines 15+ years of operational excellence with cutting-edge technology to deliver reliability you can trust.
          </p>
        </motion.div>
      </section>

      {/* Services List */}
      <div className="space-y-32 md:space-y-48">
        {services.map((service, index) => (
          <motion.section 
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-7xl mx-auto px-6 md:px-12"
          >
            <div className={`flex flex-col gap-12 lg:gap-24 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
              <div className="flex-1 space-y-10">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-[30px] font-black ${service.bg}/10 ${service.accent}`}>
                  <service.icon className="w-10 h-10" />
                </div>
                
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 leading-tight italic">
                    {service.title}
                  </h2>
                  <p className="text-brand-grey text-lg md:text-xl leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-xl shadow-slate-100/50 border border-slate-50 border-white">
                      <div className={`w-8 h-8 rounded-full ${service.bg}/20 flex items-center justify-center shrink-0`}>
                        <CheckCircle2 className={`w-4 h-4 ${service.accent}`} />
                      </div>
                      <span className="text-slate-700 font-bold text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                   <button 
                    onClick={() => {
                      setRequestForm({ ...requestForm, service: service.title });
                      setIsRequestModalOpen(true);
                    }}
                    className="button-premium px-10 py-5 text-lg flex items-center justify-center md:justify-start gap-4 w-full md:w-auto"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full relative">
                <motion.div 
                  initial={{ scale: 0.8, rotate: index % 2 === 0 ? 5 : -5 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 1 }}
                  className="aspect-[4/3] rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[20px] border-white relative z-10"
                >
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                
                {/* 3D Accent Boxes */}
                <div className={`absolute ${index % 2 === 0 ? '-top-10 -right-10' : '-bottom-10 -left-10'} w-48 h-48 ${service.bg} opacity-10 rounded-[40px] -z-10`} />
                <div className={`absolute ${index % 2 === 0 ? '-bottom-20 -left-10' : '-top-20 -right-10'} w-64 h-64 ${service.bg} opacity-5 rounded-full -z-10 blur-3xl`} />
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* Why Choose Us */}
      <section className="mt-32 py-24 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary opacity-20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent opacity-10 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20">
            <span className="text-brand-accent font-black uppercase tracking-[0.3em] text-xs">Why True Enterprises?</span>
            <h2 className="text-4xl md:text-6xl font-black mt-4">Built on Reliability</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Same-day troubleshooting and quick turnaround repair cycles for your productivity." },
              { icon: Trophy, title: "Award Winning", desc: "Recognized as the most reliable tech service provider in the Nagpur district region." },
              { icon: Heart, title: "Client First", desc: "Dedicated support team ensuring 100% satisfaction and comprehensive after-sales care." }
            ].map((item, i) => (
              <div key={i} className="glass-dark p-10 rounded-[40px] border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:bg-brand-accent transition-all">
                  <item.icon className="w-8 h-8 group-hover:text-brand-dark transition-all" />
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-white/60 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-brand-accent rounded-[60px] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-brand-accent/20">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-brand-dark leading-[0.9] tracking-tighter mb-6">
              Ready to Upgrade <br />Your Tech?
            </h2>
            <p className="text-brand-dark/70 text-lg font-bold">Join 500+ happy businesses in Nagpur securing their futures today.</p>
          </div>
          <Link to="/laptops" className="button-premium bg-brand-dark text-white px-12 py-6 text-xl shadow-2xl shadow-brand-dark/30 flex items-center gap-4">
            Browse Laptops <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-primary p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black">Request Visit</h2>
                  <p className="text-white/70 font-bold uppercase tracking-widest text-[10px] mt-1">Direct Connection to Technician</p>
                </div>
                <button onClick={() => setIsRequestModalOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="p-8 md:p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Your Name</label>
                      <input 
                        type="text" required
                        value={requestForm.name}
                        onChange={e => setRequestForm({...requestForm, name: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold focus:border-brand-primary transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Service Required</label>
                      <select 
                        value={requestForm.service}
                        onChange={e => setRequestForm({...requestForm, service: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold"
                      >
                        <option>CCTV Camera Installation</option>
                        <option>PC & Laptop Repair</option>
                        <option>Both (CCTV + Repair)</option>
                        <option>Annual Maintenance (AMC)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Area / Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-brand-grey" />
                        <input 
                          type="text" required
                          value={requestForm.address}
                          onChange={e => setRequestForm({...requestForm, address: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold focus:border-brand-primary transition-all"
                          placeholder="e.g. Sitabuldi, Nagpur"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Issue / Details</label>
                      <textarea 
                        required
                        value={requestForm.description}
                        onChange={e => setRequestForm({...requestForm, description: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 h-28 font-medium focus:border-brand-primary transition-all"
                        placeholder="Explain your requirement here..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-brand-accent/10 p-6 rounded-3xl flex gap-4 border border-brand-accent/20">
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center shrink-0 shadow-lg">
                    <Truck className="w-6 h-6 text-brand-dark" />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-dark text-sm uppercase tracking-tighter">On-Site Guarantee</h4>
                    <p className="text-xs text-brand-dark/70 font-medium leading-relaxed">Our technicians will visit your home or office. No need to carry heavy CCTV systems or laptops to any service center.</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full button-premium py-5 text-lg flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20"
                >
                  <MessageCircle className="w-6 h-6" />
                  Send to WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
