import React, { useState } from 'react';
import { 
  Monitor, Plus, LogOut, Wallet, 
  ArrowUpRight, ArrowDownRight, UserPlus,
  RefreshCcw, AlertTriangle, CheckCircle2,
  Clock, History, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TillManagement() {
  const [activeTab, setActiveTab] = useState('active'); // active, history, alerts
  const [showOpenShiftModal, setShowOpenShiftModal] = useState(false);

  const activeSessions = [
    { id: 'S102', cashier: 'Sarah Connor', outlet: 'Main Mall', loginTime: '08:00 AM', openingCash: 200, currentCash: 1450, mismatch: 0, status: 'Active' },
    { id: 'S105', cashier: 'John Doe', outlet: 'Main Mall', loginTime: '09:30 AM', openingCash: 200, currentCash: 850, mismatch: 12.50, status: 'Active' },
    { id: 'S108', cashier: 'Ellen Ripley', outlet: 'Westside', loginTime: '10:15 AM', openingCash: 200, currentCash: 420, mismatch: 0, status: 'Active' },
  ];

  const recentMovements = [
    { type: 'Sale', amount: '+ $120.00', time: '10:45 AM', cashier: 'Sarah Connor' },
    { type: 'Cash Out', amount: '- $50.00', time: '10:30 AM', cashier: 'John Doe', note: 'Petty cash for supplies' },
    { type: 'Sale', amount: '+ $85.50', time: '10:15 AM', cashier: 'Ellen Ripley' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Till Management</h1>
          <p className="text-slate-500 font-medium">Monitor real-time cash flow and manage cashier shifts.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
             <History className="w-5 h-5" /> All Logs
           </button>
           <button 
             onClick={() => setShowOpenShiftModal(true)}
             className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
           >
             <Plus className="w-5 h-5" /> Open New Shift
           </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="p-3 bg-white/10 rounded-2xl">
                  <Wallet className="w-6 h-6" />
               </div>
               <span className="text-[10px] bg-emerald-400 text-emerald-950 font-black px-2 py-1 rounded-full uppercase">Good</span>
            </div>
            <div className="mt-8">
               <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Total Cash in Tills</p>
               <h3 className="text-4xl font-black">$2,720.00</h3>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="p-3 bg-slate-50 rounded-2xl text-indigo-600">
                  <Monitor className="w-6 h-6" />
               </div>
               <span className="text-[10px] bg-indigo-50 text-indigo-600 font-black px-2 py-1 rounded-full uppercase">3 Terminals</span>
            </div>
            <div className="mt-8">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Active Sessions</p>
               <h3 className="text-4xl font-black text-slate-900">3</h3>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                  <AlertTriangle className="w-6 h-6" />
               </div>
               <span className="text-[10px] bg-rose-50 text-rose-600 font-black px-2 py-1 rounded-full uppercase tracking-tighter">Check Required</span>
            </div>
            <div className="mt-8">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Pending Discrepancies</p>
               <h3 className="text-4xl font-black text-rose-600">$12.50</h3>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Shifts Table */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-sm">
               <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Active Sessions</h3>
                    <p className="text-slate-400 font-medium">Currently logged in cashiers</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search cashiers..." 
                      className="bg-slate-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none w-full md:w-64"
                    />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                           <th className="px-8 py-5 text-left">Cashier / ID</th>
                           <th className="px-8 py-5 text-left">Time</th>
                           <th className="px-8 py-5 text-right">Cash Movement</th>
                           <th className="px-8 py-5 text-right">Mismatch</th>
                           <th className="px-8 py-5 text-center">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {activeSessions.map((row) => (
                           <tr key={row.id} className="group hover:bg-slate-50/30 transition-colors">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                       {row.cashier[0]}
                                    </div>
                                    <div>
                                       <p className="font-black text-slate-900">{row.cashier}</p>
                                       <p className="text-[10px] font-bold text-slate-400">SESSION #{row.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-slate-300" />
                                    <span className="font-bold text-slate-600">{row.loginTime}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <p className="font-black text-slate-900">${row.currentCash}</p>
                                 <p className="text-[10px] font-bold text-emerald-600">Opening: ${row.openingCash}</p>
                              </td>
                              <td className="px-8 py-6 text-right font-black">
                                 <span className={row.mismatch > 0 ? 'text-rose-600 bg-rose-50 px-2 py-1 rounded-lg' : 'text-slate-400 underline decoration-slate-200'}>
                                    {row.mismatch > 0 ? `+$${row.mismatch}` : '$0.00'}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                 <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:scale-105 transition-transform">
                                    Close Shift
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Movements Sidebar */}
         <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-slate-900">Live Cash Feed</h3>
                  <RefreshCcw className="w-4 h-4 text-indigo-500 animate-spin-slow" />
               </div>
               <div className="space-y-6">
                  {recentMovements.map((move, i) => (
                    <div key={i} className="flex gap-4 relative">
                       {i !== recentMovements.length - 1 && (
                         <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-50" />
                       )}
                       <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center ${
                         move.type === 'Cash Out' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                       }`}>
                          {move.type === 'Cash Out' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <p className="font-black text-slate-900 text-sm">{move.type}</p>
                             <span className={`font-black text-sm ${move.type === 'Cash Out' ? 'text-rose-600' : 'text-emerald-600'}`}>{move.amount}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                            {move.cashier} • {move.time}
                          </p>
                          {move.note && (
                            <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded-lg text-slate-500 italic">
                               "{move.note}"
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors">See Detailed Movement</button>
            </div>
         </div>
      </div>

      {/* MODAL PLACEHOLDER */}
      <AnimatePresence>
        {showOpenShiftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowOpenShiftModal(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
             >
                <div className="p-8 border-b border-slate-50 text-center">
                   <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl font-black text-slate-900">Open New Shift</h2>
                   <p className="text-slate-500 font-medium">Assign a cashier and set opening cash.</p>
                </div>
                <div className="p-8 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Assign Cashier</label>
                      <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none">
                         <option>Select Cashier...</option>
                         <option>Ben Parker</option>
                         <option>May Jane</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Opening Cash ($)</label>
                      <input 
                        type="number" 
                        defaultValue="200"
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                   </div>
                   <div className="pt-4 flex gap-3">
                      <button onClick={() => setShowOpenShiftModal(false)} className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                      <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Assign & Open</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
