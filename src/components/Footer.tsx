import { Link } from 'react-router-dom';
import { Shield, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark pt-24 pb-12 text-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary opacity-5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-brand-primary rounded-xl rotate-6 shadow-lg shadow-brand-primary/20" />
                <div className="absolute inset-0 bg-brand-accent rounded-xl -rotate-6 flex items-center justify-center border-2 border-brand-primary/10">
                  <Shield className="w-6 h-6 text-brand-primary" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white leading-none tracking-tighter">TRUE</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">Enterprises</span>
              </div>
            </Link>
            <p className="text-white/60 font-medium leading-relaxed">
              Nagpur's most trusted partner for premium surveillance and computing solutions. Built on a foundation of performance and trust since 2011.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-black mb-8 italic">Navigator</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Inventory', path: '/laptops' },
                { name: 'Repairs', path: '/services' },
                { name: 'Contact', path: '/' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-white/50 hover:text-brand-accent transition-colors font-bold text-sm uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-brand-accent transition-all group-hover:w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-xl font-black mb-8 italic">Assistance</h3>
            <ul className="space-y-4">
              {[
                { name: 'AMC Inquiry', msg: 'Hello! I am interested in an Annual Maintenance Contract (AMC) for my tech systems. Can you share the plans?' },
                { name: 'Bulk Orders', msg: 'Hi! I am looking to place a bulk order for laptops/surveillance gear. Do you offer special business pricing?' },
                { name: 'Device Status', msg: 'Hello! I would like to check the repair status of my device submitted at True Enterprises.' },
                { name: 'Support Ticket', msg: 'I need technical support for one of the products/services purchased from True Enterprises.' },
                { name: 'Privacy Policy', msg: 'Hi! I would like to know more about your data handling and privacy policy.' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={`https://wa.me/919421947545?text=${encodeURIComponent(link.msg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="glass-dark p-8 rounded-[40px] border border-white/5 relative group/reach">
            <h3 className="text-xl font-black mb-8 italic text-brand-accent">Direct Reach</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-brand-accent shrink-0" />
                <p className="text-sm font-medium text-white/70">Sadar, Nagpur, Maharashtra - 440001</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-brand-accent shrink-0" />
                <p className="text-sm font-medium text-white/70 tracking-tighter cursor-pointer hover:text-brand-accent transition-colors">+91 9421947545</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-brand-accent shrink-0" />
                <p className="text-sm font-medium text-white/70">trueenterprises@gmail.com</p>
              </div>
              
              <a 
                href={`https://wa.me/919421947545?text=${encodeURIComponent("Hello True Enterprises! I am contacting you directly from your footer reach section. Can you help?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-3 bg-[#25D366] text-white py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#25D366]/20"
              >
                <div className="w-5 h-5 fill-white">
                  <svg viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                </div>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
            &copy; {new Date().getFullYear()} True Enterprises. Engineered for performance.
          </div>
          
          <motion.button 
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-primary/20 hover:bg-brand-accent hover:text-brand-dark transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/30">
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
