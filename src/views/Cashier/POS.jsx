import React, { useState, useMemo } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search, ShoppingCart, Plus, Minus, Trash2,
  CreditCard, Banknote, CheckCircle2, Receipt,
  User, Clock, Lock, Power, X, ChevronRight,
  ArrowRight, Sparkles, Box, Package, LogOut,
  ScanLine, RotateCcw, PieChart, SplitSquareHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function POSTerminal() {
  const { user, logout } = useAuth();
  const { products, sales, recordSale } = useSaaS();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState('pos'); // pos, payment, success
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isTillOpen, setIsTillOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isReturnMode, setIsReturnMode] = useState(false);
  const [showShiftSummary, setShowShiftSummary] = useState(false);

  const tenantProducts = useMemo(() =>
    products.filter(p => p.tenantId === user.tenantId && p.stock[user.outletId] > 0),
    [products, user.tenantId, user.outletId]
  );

  const filteredProducts = tenantProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.1;
  const total = isReturnMode ? -(discountedSubtotal + tax) : (discountedSubtotal + tax);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => setCart(cart.filter(item => item.id !== id));

  const handleCheckout = () => {
    const sale = {
      tenantId: user.tenantId,
      outletId: user.outletId,
      cashierId: user.id,
      items: cart,
      total: isReturnMode ? Math.abs(total) * -1 : total,
      paymentMethod,
      date: new Date().toISOString(),
      isReturn: isReturnMode
    };
    recordSale(sale);
    setCheckoutStep('success');
  };

  const resetPOS = () => {
    setCart([]);
    setCheckoutStep('pos');
    setSearchTerm('');
    setDiscount(0);
    setIsReturnMode(false);
  };

  if (!isTillOpen) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
            <Lock className="w-12 h-12 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Open Till</h1>
            <p className="text-slate-500 font-medium">Please verify your details and open the till to start your shift.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-left space-y-4">
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
        </div>
      </div>
    );
  }

  const shiftSales = sales.filter(s => s.cashierId === user.id && new Date(s.date || Date.now()).toDateString() === new Date().toDateString());
  const shiftTotal = shiftSales.reduce((acc, s) => acc + s.total, 0);
  const shiftCashCount = shiftSales.filter(s => s.paymentMethod === 'Cash').reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="h-full flex flex-col gap-6 p-6 md:p-8 bg-slate-100/50 overflow-hidden">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 shadow-sm">
            NJ
          </div>
          <div>
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              Downtown Branch Register #1
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">{user.name} &bull; Shift: 8h 20m remaining</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowShiftSummary(true)} title="Shift Analytics" className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            <PieChart className="w-5 h-5" />
          </button>
          <button onClick={() => { logout(); navigate('/login'); }} title="Sign Out" className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
          <button onClick={() => setIsTillOpen(false)} title="Close Till" className="bg-red-50 p-3 rounded-2xl border border-red-100 text-red-600 hover:bg-red-100 transition-all">
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Product Explorer */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, SKU or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-none rounded-3xl py-6 pl-16 pr-16 text-lg font-medium shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-indigo-500/10 outline-none placeholder-slate-400"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 transition-all">
                <ScanLine className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setIsReturnMode(!isReturnMode)}
              className={`p-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 ${isReturnMode ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-white text-slate-500 shadow-slate-200/50 hover:text-amber-600'}`}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
              {filteredProducts.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4 }}
                  onClick={() => addToCart(p)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group"
                >
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-black text-slate-800 shadow-sm">
                      ${p.price}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase font-bold text-indigo-500 mb-1">{p.category}</p>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{p.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-2">STOCK: {p.stock[user.outletId]} Units</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Panel */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden relative h-full min-h-0">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-indigo-600" />
              <h3 className="font-black text-slate-900 text-xl">{isReturnMode ? 'Return Ticket' : 'Order Ticket'}</h3>
            </div>
            <div className="flex gap-2">
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <span className="bg-indigo-600 text-white font-black px-3 py-1 flex items-center justify-center rounded-xl text-xs">{cart.length}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <Package className="w-10 h-10" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Cart is Empty</p>
                  <p className="text-sm text-slate-500">Scan or select products to begin.</p>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">${item.price} &times; {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm transition-all">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-slate-800 w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-8 bg-slate-900 text-white rounded-t-[2rem] space-y-6 shadow-2xl">
            <div className="space-y-3">
              <div className="flex justify-between text-sm opacity-60">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm opacity-60">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-2 border-t border-white/10">
                <span>{isReturnMode ? 'Refund Total' : 'Total'}</span>
                <span>${Math.abs(total).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {[0, 5, 10, 15].map(d => (
                <button
                  key={d}
                  onClick={() => setDiscount(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${discount === d ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                >
                  {d === 0 ? 'No Disc' : `${d}%`}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('Cash')}
                className={`py-3 rounded-2xl flex flex-col items-center gap-1 transition-all border-2 ${paymentMethod === 'Cash' ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <Banknote className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Cash</span>
              </button>
              <button
                onClick={() => setPaymentMethod('Card')}
                className={`py-3 rounded-2xl flex flex-col items-center gap-1 transition-all border-2 ${paymentMethod === 'Card' ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('Split')}
                className={`py-3 rounded-2xl flex flex-col items-center gap-1 transition-all border-2 ${paymentMethod === 'Split' ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <SplitSquareHorizontal className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Split</span>
              </button>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full text-white rounded-3xl py-6 font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 group ${isReturnMode ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-500 hover:bg-emerald-400'}`}
            >
              {isReturnMode ? 'Process Refund' : `Charge $${total.toFixed(2)}`}
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Success Modal */}
      <AnimatePresence>
        {checkoutStep === 'success' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-lg p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-20 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

              <div className="text-center space-y-8 relative z-10">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xl shadow-emerald-100">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">{isReturnMode ? 'Refund Processed' : 'Order Confirmed'}</h2>
                  <p className="text-slate-500 font-medium">Payment {isReturnMode ? 'refunded' : 'received'} via {paymentMethod}</p>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6">
                  <div className="flex justify-between items-center text-slate-600 font-medium pb-4 border-b border-slate-200 border-dashed">
                    <span className="flex items-center gap-2"><Receipt className="w-4 h-4" /> Receipt #{Math.floor(Math.random() * 8999) + 1000}</span>
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-500 pb-4 border-b border-slate-200 border-dashed">
                    Cashier: <span className="text-slate-800">{user.name}</span>
                  </div>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-slate-800 font-bold">{item.quantity} &times; {item.name}</span>
                        <span className="text-slate-600 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-500 text-sm">
                        <span>Discount ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center font-black text-2xl text-slate-900">
                    <span>Total</span>
                    <span>${Math.abs(total).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-slate-100 text-slate-700 font-bold py-5 rounded-3xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <Receipt className="w-5 h-5" /> Print Receipt
                  </button>
                  <button
                    onClick={resetPOS}
                    className="flex-1 bg-slate-900 text-white font-bold py-5 rounded-3xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100"
                  >
                    New Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shift Analytics Modal */}
      <AnimatePresence>
        {showShiftSummary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowShiftSummary(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-sm p-8 relative overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">Shift Analytics</h2>
                <button onClick={() => setShowShiftSummary(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-2xl p-6">
                  <p className="text-indigo-600 font-bold mb-1">Total Sales Today</p>
                  <p className="text-4xl font-black text-indigo-900">${shiftTotal.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-slate-500 font-bold text-xs mb-1 uppercase">Total Bills</p>
                    <p className="text-2xl font-black text-slate-900">{shiftSales.length}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <p className="text-emerald-600 font-bold text-xs mb-1 uppercase">Cash Collected</p>
                    <p className="text-xl font-black text-emerald-900">${shiftCashCount.toFixed(2)}</p>
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
