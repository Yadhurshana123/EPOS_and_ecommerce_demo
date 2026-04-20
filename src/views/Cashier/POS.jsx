import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search, ShoppingCart, Plus, Minus, Trash2,
  CreditCard, Banknote, CheckCircle2, Receipt,
  User, Clock, Lock, Power, X, ChevronRight,
  ArrowRight, Sparkles, Box, Package, LogOut,
  ScanLine, RotateCcw, PieChart, SplitSquareHorizontal,
  History, UserPlus, Tag, Percent, Calculator,
  Smartphone, Monitor, Printer, Scan, Coins,
  Save, LayoutGrid, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function POSTerminal() {
  const { user, logout } = useAuth();
  const { products, sales, recordSale, tenants } = useSaaS();
  const navigate = useNavigate();

  // --- State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isTillOpen, setIsTillOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('pos'); // pos, success
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [heldBills, setHeldBills] = useState([]);
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScanning, setIsScanning] = useState(false);

  // --- Refs ---
  const searchInputRef = useRef(null);

  // --- Clock Effect ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        if (cart.length > 0) handleCheckout();
      }
      if (e.key === 'F4') {
        e.preventDefault();
        handleHoldBill();
      }
      if (e.key === 'F9') {
        e.preventDefault();
        setShowRecallModal(true);
      }
      if (e.key === '/') {
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, heldBills]);

  // --- Data Selectors ---
  const currentTenant = useMemo(() =>
    tenants?.find(t => t.id === user?.tenantId),
    [tenants, user?.tenantId]
  );

  const tenantProducts = useMemo(() =>
    products.filter(p => p.tenantId === user?.tenantId),
    [products, user?.tenantId]
  );

  const categories = useMemo(() =>
    ['All', ...new Set(tenantProducts.map(p => p.category))],
    [tenantProducts]
  );

  const filteredProducts = tenantProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // --- Calculations ---
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% Tax
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  // --- Actions ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscount(0);
  };

  const handleHoldBill = () => {
    if (cart.length === 0) return;
    const billId = `H${Math.floor(100 + Math.random() * 900)}`;
    const newHold = {
      id: billId,
      items: [...cart],
      total,
      customer: selectedCustomer,
      time: new Date(),
      itemCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    };
    setHeldBills([newHold, ...heldBills]);
    clearCart();
  };

  const recallBill = (bill) => {
    setCart(bill.items);
    setSelectedCustomer(bill.customer);
    setHeldBills(heldBills.filter(b => b.id !== bill.id));
    setShowRecallModal(false);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const saleData = {
      tenantId: user.tenantId,
      outletId: user.outletId,
      cashierId: user.id,
      customer: selectedCustomer,
      items: cart,
      total,
      paymentMethod,
      timestamp: new Date().toISOString()
    };
    recordSale(saleData);
    setCheckoutStep('success');
  };

  const resetPOS = () => {
    clearCart();
    setCheckoutStep('pos');
  };

  // --- UI Components ---
  if (!isTillOpen) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-slate-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center space-y-8">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
            <Lock className="w-12 h-12 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Open Till</h1>
            <p className="text-slate-500 font-medium">Please verify your details and open the till to start your shift.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-left space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Outlet</span>
              <span className="text-sm font-black text-slate-900">Downtown Branch</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Cashier</span>
              <span className="text-sm font-black text-slate-900">{user.name}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-500">Starting Float</span>
              <span className="text-sm font-black text-slate-900">$200.00</span>
            </div>

            <button
              onClick={() => setIsTillOpen(true)}
              className="w-full bg-emerald-600 text-white rounded-2xl py-4 font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
            >
              Confirm & Open Shift <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-slate-900 tracking-tight leading-none uppercase text-sm">{currentTenant?.name || 'Retail POS'}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Downtown Outlet • Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-3 text-right">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Current Cashier</p>
              <p className="text-sm font-black text-slate-900 leading-none capitalize">{user?.name}</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <User className="w-5 h-5 text-slate-600" />
            </div>
          </div>

          <div className="flex items-center gap-6 border-l border-slate-200 pl-8">
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">System Time</p>
              <p className="text-sm font-black text-slate-900 leading-none">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-slate-400"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex min-h-0 overflow-hidden">

        {/* LEFT PANEL: Product Selection (Expanded) */}
        <section className="flex-[8] flex flex-col min-w-0 bg-[#F8FAFC] border-r border-slate-200">
          <div className="p-6 pb-2 space-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search or scan product... (/)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-14 pr-14 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isScanning ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
              >
                <ScanLine className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 pb-8">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-xl border border-slate-200 p-3 cursor-pointer group hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col h-full"
                >
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-3 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-sm font-black text-slate-800 line-clamp-2 leading-snug">{product.name}</h3>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* RIGHT PANEL: Cart & Summary Combined */}
        <section className="flex-[3] min-w-[380px] bg-white border-l border-slate-200 flex flex-col">
          {/* Customer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed transition-all ${selectedCustomer ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
                {selectedCustomer ? <User className="w-5 h-5 text-indigo-600" /> : <UserPlus className="w-5 h-5 text-slate-400" />}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Customer</p>
                <p className="text-sm font-black text-slate-900">{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
                <ShoppingCart className="w-12 h-12 mb-4" />
                <h3 className="font-black text-sm uppercase tracking-widest">Cart is empty</h3>
              </div>
            ) : (
              <div className="space-y-1">
                {cart.map(item => (
                  <motion.div
                    layout
                    key={item.id}
                    className="p-4 flex gap-4 group hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-xs font-black text-indigo-500 mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm h-fit self-center">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="w-16 text-right self-center">
                      <p className="text-sm font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all self-center opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout & Summary (Fixed at bottom) */}
          <div className="p-4 bg-slate-800 text-white rounded-t-xl shadow-2xl space-y-4">
            <div className="space-y-2 px-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                <span>Discount ({discount}%)</span>
                <span className="font-black">-${discountAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[0, 5, 10, 15].map(d => (
                <button
                  key={d}
                  onClick={() => setDiscount(d)}
                  className={`py-1.5 rounded-lg text-[9px] font-black transition-all border ${discount === d ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                >
                  {d === 0 ? 'FIXED' : `${d}%`}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-0.5">Total Payable</p>
                <p className="text-3xl font-black tracking-tighter leading-none">${total.toFixed(2)}</p>
              </div>
              <div className="flex gap-3 flex-1 ml-4">
                <button
                  onClick={() => setPaymentMethod('Cash')}
                  className={`flex-1 min-w-[100px] flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all duration-300 ${paymentMethod === 'Cash' ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]' : 'bg-slate-700/40 border-white/5 text-slate-400 hover:bg-slate-700/60 hover:text-slate-300'}`}
                >
                  <Coins className={`w-7 h-7 ${paymentMethod === 'Cash' ? 'text-white' : 'text-slate-500'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${paymentMethod === 'Cash' ? 'text-white' : 'text-slate-500'}`}>Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('Card')}
                  className={`flex-1 min-w-[100px] flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all duration-300 ${paymentMethod === 'Card' ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]' : 'bg-slate-700/40 border-white/5 text-slate-400 hover:bg-slate-700/60 hover:text-slate-300'}`}
                >
                  <CreditCard className={`w-7 h-7 ${paymentMethod === 'Card' ? 'text-white' : 'text-slate-500'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${paymentMethod === 'Card' ? 'text-white' : 'text-slate-500'}`}>Card</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg py-3.5 font-black text-lg flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-30 active:scale-[0.98]"
            >
              COMPLETE ORDER <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Action Bar (Footer) */}
      <footer className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-8 z-30">
        <div className="flex gap-4">
          <button onClick={handleHoldBill} disabled={cart.length === 0} className="text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 disabled:opacity-30">Hold (F4)</button>
          <button onClick={() => setShowRecallModal(true)} className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 relative">Recall {heldBills.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 rounded-full text-[10px]">{heldBills.length}</span>}</button>
        </div>
        <div className="flex gap-4">
          <button onClick={clearCart} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Clear</button>
        </div>
      </footer>

      {/* Recall Modal */}
      <AnimatePresence>
        {showRecallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowRecallModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] w-full max-w-xl max-h-[70vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-black">Held Bills</h2>
                <button onClick={() => setShowRecallModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {heldBills.map(bill => (
                  <div key={bill.id} onClick={() => recallBill(bill)} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:border-indigo-500 transition-all">
                    <div className="flex justify-between mb-2">
                      <span className="font-black text-indigo-600">{bill.id}</span>
                      <span className="text-[10px] font-bold text-slate-400">{new Date(bill.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-4">${bill.total.toFixed(2)}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bill.itemCount} Items</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Screen */}
      <AnimatePresence>
        {checkoutStep === 'success' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] w-full max-w-md p-10 text-center shadow-2xl">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-8">Order Successful</h2>
              <div className="p-6 bg-slate-50 rounded-2xl text-left border border-slate-100 mb-8">
                <div className="flex justify-between font-black text-xl">
                  <span>Total Paid</span>
                  <span className="text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={resetPOS} className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black text-lg hover:bg-black transition-all">New Order</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
