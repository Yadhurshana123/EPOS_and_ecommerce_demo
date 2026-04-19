import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSaaS } from '../../context/SaaSContext';
import { 
  ShoppingBag, Search, Menu, User, 
  ArrowRight, Heart, Star, ShieldCheck,
  Truck, RefreshCw, Smartphone, MessageCircle,
  Share2, Camera, Box, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Storefront() {
  const { tenantId } = useParams();
  const { tenants, products } = useSaaS();
  const tenant = tenants.find(t => t.id === tenantId);
  const tenantProducts = products.filter(p => p.tenantId === tenantId);
  
  const [cartCount, setCartCount] = useState(0);

  if (!tenant || !tenant.features.ecommerce) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Smartphone className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Store Offline</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">This storefront is currently disabled or does not exist. Please contact the administrator.</p>
        <Link to="/login" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold">Go to Dashboard</Link>
      </div>
    );
  }

  const primaryColor = tenant.theme.primary;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to={`/shop/${tenantId}`} className="flex items-center gap-2">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                 <ShoppingBag className="w-6 h-6" />
               </div>
               <span className="font-extrabold text-2xl tracking-tight">{tenant.name}</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-500">
               <a href="#" className="hover:text-slate-900 transition-colors">Men</a>
               <a href="#" className="hover:text-slate-900 transition-colors">Women</a>
               <a href="#" className="hover:text-slate-900 transition-colors">Accessories</a>
               <a href="#" className="hover:text-slate-900 transition-colors">New Releases</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="bg-slate-50 border-none rounded-full py-2.5 pl-11 pr-6 text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64"
                />
             </div>
             <button className="relative p-2" onClick={() => setCartCount(c => c + 1)}>
                <ShoppingBag className="w-6 h-6 text-slate-700" />
                {cartCount > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center font-black border-2 border-white" style={{ backgroundColor: primaryColor }}>{cartCount}</span>}
             </button>
             <button className="lg:hidden p-2"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Season 2026 Collection
            </div>
            <h1 className="text-6xl sm:text-7xl font-black tracking-tight leading-[0.9]">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, #9333ea)` }}>Performance.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Discover the latest in high-performance gear designed for those who demand more from every move.
            </p>
            <div className="flex flex-wrap gap-4">
               <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:translate-y-[-4px] transition-all shadow-xl shadow-slate-200" style={{ backgroundColor: primaryColor }}>
                 Shop Collection <ArrowRight className="w-6 h-6" />
               </button>
               <button className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">
                 Our Story
               </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-50 flex items-center gap-6 md:scale-110">
               <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                 <Box className="w-8 h-8" />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fast Shipping</p>
                 <p className="font-black text-slate-900">Delivered in 24h</p>
               </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Trust Badges */}
      <section className="bg-slate-50 py-12 border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest"><Truck className="w-6 h-6" /> Free Worldwide Shipping</div>
            <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest"><ShieldCheck className="w-6 h-6" /> Secure Cloud Payments</div>
            <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest"><RefreshCw className="w-6 h-6" /> 30-Day Easy Returns</div>
         </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-16">
           <h2 className="text-3xl font-black">Trending Now</h2>
           <button className="text-sm font-black flex items-center gap-2 hover:gap-3 transition-all">Explore All <ChevronRight className="w-5 h-5" /></button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {tenantProducts.map((p) => (
            <motion.div 
              key={p.id}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden mb-6 relative">
                 <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <button 
                   onClick={(e) => { e.preventDefault(); setCartCount(c => c+1); }}
                   className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all scale-90 hover:scale-100"
                 >
                   <Plus className="w-6 h-6" />
                 </button>
                 <div className="absolute top-6 left-6 h-8 px-4 bg-white/90 backdrop-blur-md rounded-full flex items-center text-[10px] font-black uppercase tracking-widest shadow-sm">
                   New Arrival
                 </div>
              </div>
              <div className="space-y-1">
                 <p className="text-[11px] font-black uppercase text-indigo-500 tracking-wider" style={{ color: primaryColor }}>{p.category}</p>
                 <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors" style={{ groupHover: { color: primaryColor } }}>{p.name}</h3>
                 <p className="text-lg font-black text-slate-500">${p.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-24 pb-12">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="space-y-6 col-span-1 md:col-span-1">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                   <ShoppingBag className="w-5 h-5" />
                 </div>
                 <span className="font-extrabold text-xl tracking-tight">{tenant.name}</span>
               </div>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                 Redefining the standard of retail through innovation and premium design since 2026.
               </p>
               <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"><MessageCircle className="w-4 h-4" /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"><Share2 className="w-4 h-4" /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"><Camera className="w-4 h-4" /></a>
               </div>
            </div>
            <div>
               <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-slate-500">Products</h4>
               <ul className="space-y-4 text-sm font-medium text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Men's Gear</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Women's Collection</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Limited Editions</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-slate-500">Support</h4>
               <ul className="space-y-4 text-sm font-medium text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">24/7 Concierge</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-slate-500">Newsletter</h4>
               <p className="text-slate-400 text-sm font-medium mb-6">Join our elite circle for early drops and exclusive access.</p>
               <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-slate-700 outline-none flex-1" />
                  <button className="bg-white text-slate-900 px-4 rounded-xl font-bold">Join</button>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">&copy; 2026 {tenant.name} Powered by Nexus EPOS</p>
            <div className="flex gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               <a href="#">Privacy</a>
               <a href="#">Terms</a>
               <a href="#">Cookies</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
