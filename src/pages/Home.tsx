import React, { useEffect, useState } from 'react';
import { Shield, PenTool as Tool, Monitor, ArrowRight, CheckCircle2, Star, Users, Award, ShieldCheck, MapPin, Mail, Phone, ExternalLink, Truck, Zap, Heart, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Offer {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [requestForm, setRequestForm] = useState({
    name: '',
    service: 'CCTV Systems',
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

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => setOffers(data))
      .catch(err => console.error('Failed to fetch offers:', err));

    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error('Failed to fetch news:', err));
  }, []);

  const heroSlides = [
    {
      title: "Secure Your World",
      subtitle: "Nagpur's Best CCTV Solutions",
      description: "Smart surveillance systems for Indian homes & businesses. Engineered for reliability in Sadar and beyond.",
      image: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=2000",
      cta: "Explore Security",
      link: "/services"
    },
    {
      title: "Expert Tech Revival",
      subtitle: "Professional Computer Repairs",
      description: "Fast motherboard and chip-level repairs by certified Nagpur technicians. We value your tech as much as you do.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000",
      cta: "Get Fixed",
      link: "/services"
    },
    {
      title: "Premium Tech Ownership",
      subtitle: "Certified Pre-Owned Laptops",
      description: "Quality laptops for students and professionals. Tested across 50+ checkpoints for guaranteed performance.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf028fbdb?auto=format&fit=crop&q=80&w=2000",
      cta: "View Stock",
      link: "/laptops"
    }
  ];

  return (
    <div className="pb-20 overflow-x-hidden">
      {/* Dynamic Offer Marquee */}
      {offers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-brand-accent py-2 overflow-hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex shrink-0">
                {offers.map((offer) => (
                  <div key={offer.id} className="flex items-center gap-4 px-8">
                    <Star className="w-4 h-4 fill-brand-dark" />
                    <span className="text-sm font-bold text-brand-dark uppercase tracking-wide">
                      {offer.title}: {offer.description}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section with Swiper */}
      <section className="relative h-[90vh] md:h-screen w-full">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          speed={1000}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          loop={true}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={`relative h-full w-full overflow-hidden ${(slide as any).bgClass || ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/40 to-transparent z-10" />
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className={`absolute inset-0 h-full w-full ${(slide as any).objectFit || 'object-cover'} transition-transform duration-[10000ms] ${activeSlide === index ? 'scale-110' : 'scale-100'}`}
                  referrerPolicy="no-referrer"
                />
                
                <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={activeSlide === index ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                  >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-accent text-brand-dark text-xs font-black uppercase tracking-widest mb-6">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className="block">{word}</span>
                      ))}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-lg font-medium leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-5">
                      <Link to={slide.link} className="button-accent flex items-center gap-3 px-8 py-4 text-lg">
                        {slide.cta} <ArrowRight className="w-5 h-5" />
                      </Link>
                      <button className="glass-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-3">
                        Our Process
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Floating Icons (3D Feel) */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-10 z-30 hidden lg:block"
        >
          <div className="glass-card p-6 rounded-3xl rotate-12 shadow-2xl">
            <Monitor className="w-12 h-12 text-brand-primary" />
          </div>
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-32 z-30 hidden lg:block"
        >
          <div className="glass-card p-6 rounded-3xl -rotate-12 shadow-2xl">
            <Shield className="w-12 h-12 text-brand-accent" />
          </div>
        </motion.div>
      </section>

      {/* On-Site Service Highlighting Marquee */}
      <div className="bg-brand-primary py-6 overflow-hidden whitespace-nowrap relative select-none z-30">
        <div className="flex animate-marquee-fast">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
               <span className="text-white text-xl font-black uppercase tracking-[0.2em] flex items-center gap-4">
                <Truck className="w-8 h-8 text-brand-accent" /> ON-SITE SERVICE ONLY
              </span>
              <span className="text-white/40 text-xl font-black italic">•</span>
              <span className="text-white text-xl font-black uppercase tracking-[0.2em] flex items-center gap-4">
                <Zap className="w-8 h-8 text-brand-accent" /> NO NEED TO MOVE ANYWHERE
              </span>
              <span className="text-white/40 text-xl font-black italic">•</span>
              <span className="text-white text-xl font-black uppercase tracking-[0.2em] flex items-center gap-4">
                <Heart className="w-8 h-8 text-brand-accent" /> WE COME TO YOU
              </span>
               <span className="text-white/40 text-xl font-black italic">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Values / Trust Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: ShieldCheck, label: "Secure Payments", value: "100%", sub: "Safe Transactions" },
              { icon: Award, label: "Certified", value: "Verified", sub: "Quality Guaranteed" },
              { icon: Users, label: "Happy Clients", value: "2500+", sub: "Trusted in Nagpur" },
              { icon: Tool, label: "Expert Repairs", value: "15yrs+", sub: "Professional Team" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 transition-all border border-transparent hover:border-brand-primary/10 hover:shadow-2xl hover:shadow-brand-primary/5"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center mb-6">
                  <stat.icon className="w-8 h-8 text-brand-primary" />
                </div>
                <div className="text-3xl font-black text-brand-dark mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-brand-primary uppercase tracking-tighter mb-2">{stat.label}</div>
                <div className="text-xs text-brand-grey">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with 3D Effect */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16 px-4">
          <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-xs">Premium Solutions</span>
          <h2 className="text-4xl md:text-6xl font-black text-brand-dark mt-4 mb-6">Innovative Services</h2>
          <div className="w-24 h-2 bg-brand-accent mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "CCTV Systems",
              desc: "Professional surveillance for homes, warehouses, and offices. 24/7 remote monitoring setup.",
              icon: Shield,
              image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800",
              accent: "bg-brand-primary"
            },
            {
              title: "Laptop Repair",
              desc: "Chip-level repairs, screen replacements, and software optimization by certified technicians.",
              icon: Tool,
              image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800",
              accent: "bg-brand-dark"
            },
            {
              title: "Pre-owned Laptops",
              desc: "Premium quality laptops tested across 50+ checkpoints. Ready for business and student life.",
              icon: Monitor,
              image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800",
              accent: "bg-brand-accent",
              link: "/laptops",
              btnText: "Latest Stock"
            }
          ].map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -20, rotateX: 5 }}
              className="group relative bg-white rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 perspective-1000"
            >
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all z-10" />
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-6 left-6 z-20">
                  <div className={`${service.accent} p-4 rounded-2xl shadow-xl`}>
                    <service.icon className={`w-6 h-6 ${service.accent === 'bg-brand-accent' ? 'text-brand-dark' : 'text-white'}`} />
                  </div>
                </div>
              </div>
                <div className="p-10">
                  <h3 className="text-3xl font-black text-brand-dark mb-4">{service.title}</h3>
                  <p className="text-brand-grey mb-8 h-20 overflow-hidden line-clamp-3 leading-relaxed">
                    {service.desc}
                  </p>
                  {service.link ? (
                    <Link 
                      to={service.link}
                      className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest text-brand-primary group-hover:gap-4 transition-all"
                    >
                      {service.btnText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button 
                      onClick={() => {
                        setRequestForm({ ...requestForm, service: service.title });
                        setIsRequestModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest text-brand-primary group-hover:gap-4 transition-all"
                    >
                      Request Visit <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Hub News Section */}
      <section className="py-32 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <span className="text-brand-accent font-black uppercase tracking-[0.3em] text-xs">Tech Hub</span>
              <h2 className="text-5xl md:text-7xl font-black mt-4 leading-[0.9] tracking-tighter italic">Latest Hardware <br />& Security News</h2>
            </div>
            <p className="text-white/40 max-w-sm font-medium border-l-2 border-brand-accent pl-6 py-2">
              Stay ahead with deep dives into the latest CCTV innovations and computer hardware breakthroughs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {news.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="group relative flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-[40px] overflow-hidden hover:bg-white/10 transition-all"
              >
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                  <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-brand-dark/20" />
                  {item.videoUrl && (
                    <button 
                      onClick={() => setActiveVideo(item.videoUrl)}
                      className="absolute inset-0 flex items-center justify-center group/play"
                    >
                      <div className="w-16 h-16 rounded-full bg-brand-primary/90 flex items-center justify-center shadow-2xl transition-all group-hover/play:scale-110">
                        <svg className="w-6 h-6 text-white ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </button>
                  )}
                  <div className="absolute top-6 left-6 bg-brand-accent text-brand-dark text-[10px] font-black uppercase px-4 py-1.5 rounded-full">
                    {item.category}
                  </div>
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                   <span className="text-[10px] font-bold text-white/40 mb-3">{new Date(item.publishedAt).toLocaleDateString()}</span>
                   <h3 className="text-2xl font-black mb-4 leading-tight">{item.title}</h3>
                   <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed line-clamp-3">{item.summary}</p>
                   <button className="flex items-center gap-3 text-brand-accent font-black uppercase tracking-widest text-[10px] hover:gap-5 transition-all">
                     Read Full Insights <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-xs">Visit Our Store</span>
            <h2 className="text-4xl md:text-6xl font-black text-brand-dark mt-4 mb-8">Located at the heart of Nagpur</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-7 h-7 text-brand-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Our Location</h4>
                  <p className="text-brand-grey leading-relaxed">True Enterprises, Sadar, Nagpur, Maharashtra - 440001</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                  <Mail className="w-7 h-7 text-brand-accent" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Email Us</h4>
                  <p className="text-brand-grey leading-relaxed">trueenterprises@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Phone className="w-7 h-7 text-brand-dark" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Call Us</h4>
                  <p className="text-brand-grey leading-relaxed">+91 9421947545</p>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <button className="button-premium w-full md:w-auto px-10 py-5 text-lg flex items-center justify-center gap-3">
                Get Directions <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="h-[500px] rounded-[40px] overflow-hidden shadow-2xl relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14884.234320984!2d79.07601614999999!3d21.150!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c03828943675%3A0xea25e6488d5e8af3!2sSadar%2C%20Nagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1713330000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
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
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="bg-brand-primary p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black">Book Technician</h2>
                  <p className="text-white/70 font-bold uppercase tracking-widest text-[10px] mt-1">Direct Visit to your Doorstep</p>
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
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Service Needed</label>
                      <select 
                        value={requestForm.service}
                        onChange={e => setRequestForm({...requestForm, service: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold"
                      >
                        <option>CCTV Systems</option>
                        <option>Laptop Repair</option>
                        <option>Both (CCTV + Laptop)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Area in Nagpur</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-brand-grey" />
                        <input 
                          type="text" required
                          value={requestForm.address}
                          onChange={e => setRequestForm({...requestForm, address: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold focus:border-brand-primary transition-all"
                          placeholder="e.g. Sadar"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-grey tracking-widest block mb-3">Issue Details</label>
                      <textarea 
                        required
                        value={requestForm.description}
                        onChange={e => setRequestForm({...requestForm, description: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 h-28 font-medium focus:border-brand-primary transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-brand-accent/10 p-6 rounded-3xl flex gap-4 border border-brand-accent/20">
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center shrink-0 shadow-lg">
                    <Truck className="w-6 h-6 text-brand-dark" />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-dark text-sm uppercase tracking-tighter">On-Site Only</h4>
                    <p className="text-xs text-brand-dark/70 font-medium leading-relaxed">Save time & effort. Our certified team brings the service center to your location.</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full button-premium py-5 text-lg flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20"
                >
                  <MessageCircle className="w-6 h-6" />
                  Request on WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setActiveVideo(null)}
               className="absolute inset-0 bg-brand-dark/95 backdrop-blur-2xl"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="relative w-full max-w-5xl rounded-[40px] overflow-hidden bg-brand-dark border border-white/10 shadow-3xl"
            >
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="aspect-video w-full">
                <video 
                  src={activeVideo} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-10 bg-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-black">True Enterprises Technical Spotlight</h3>
                  <p className="text-white/40 text-sm font-medium">Providing the best hardware solutions in Central India.</p>
                </div>
                <div className="flex gap-4">
                   <div className="bg-brand-accent p-2 rounded-lg">
                      <Truck className="w-5 h-5 text-brand-dark" />
                   </div>
                   <div className="bg-brand-primary p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-fast {
          animation: marquee 40s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
