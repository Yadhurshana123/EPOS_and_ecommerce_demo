import React, { useState, useEffect, useMemo } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Activity, ShoppingCart, Users, TrendingUp, 
  MapPin, Clock, Search, ArrowUpRight,
  Monitor, Play, Pause, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Seeded mock transaction generator — stable per outlet + index
function generateMockTransactions(outlets) {
  const cashiers = ['John D.', 'Sarah M.', 'Mike R.', 'Priya K.'];
  const statuses = ['Completed', 'Completed', 'Completed', 'Processing'];
  const times = ['Just now', '2 mins ago', '5 mins ago', '12 mins ago', '18 mins ago', '24 mins ago'];

  const transactions = [];
  let counter = 8821;

  outlets.forEach((outlet, oi) => {
    const ordersForOutlet = 2 + (oi % 2); // 2–3 per outlet
    for (let i = 0; i < ordersForOutlet; i++) {
      const seed = (outlet.id.charCodeAt(0) + i * 37) % 1000;
      const amount = ((seed * 131) % 19000 + 1000) / 100;
      transactions.push({
        id: `ORD-${counter--}`,
        cashier: cashiers[(oi + i) % cashiers.length],
        outletId: outlet.id,
        outletName: outlet.name,
        amount: `$${amount.toFixed(2)}`,
        status: statuses[(oi + i) % statuses.length],
        time: times[(oi + i) % times.length],
      });
    }
  });

  return transactions.sort((a, b) => {
    const order = ['Just now', '2 mins ago', '5 mins ago', '12 mins ago', '18 mins ago', '24 mins ago'];
    return order.indexOf(a.time) - order.indexOf(b.time);
  });
}

function seedOutletRegisters(outletId) {
  const seed = outletId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const active = (seed % 4) + 1;
  const total = active + (seed % 3) + 1;
  return { active, total };
}

export default function POSMonitoring() {
  const { user } = useAuth();
  const { sales, tenants } = useSaaS();

  // ✅ Scoped strictly to this tenant only
  const tenant = tenants.find(t => t.id === user.tenantId);
  const tenantOutlets = tenant?.outlets || [];

  const [isLive, setIsLive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('all');

  // ✅ Sales filtered to this tenant only
  const tenantSales = sales.filter(s => s.tenantId === user.tenantId);

  // Generate mock transactions using ONLY this tenant's outlets
  const allTransactions = useMemo(
    () => generateMockTransactions(tenantOutlets),
    [tenantOutlets]
  );

  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch =
      searchTerm === '' ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.cashier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.outletName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutlet = selectedOutlet === 'all' || tx.outletId === selectedOutlet;
    return matchesSearch && matchesOutlet;
  });

  // Aggregate register counts across this tenant's outlets
  const totalActive = tenantOutlets.reduce((acc, o) => acc + seedOutletRegisters(o.id).active, 0);
  const totalRegisters = tenantOutlets.reduce((acc, o) => acc + seedOutletRegisters(o.id).total, 0);

  const stats = [
    { label: 'Avg Sale Value', value: '$84.50', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Registers', value: `${totalActive}/${totalRegisters}`, icon: Monitor, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Recorded Orders', value: tenantSales.length + allTransactions.length, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Peak Hour', value: '14:00 - 15:00', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            POS Monitor
            {isLive && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse border border-red-100">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" /> Live
              </span>
            )}
          </h1>
          <p className="text-slate-500 font-medium">
            Real-time oversight of <span className="font-bold text-indigo-600">{tenant?.name}</span>'s registers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Isolation badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">{tenantOutlets.length} Outlet{tenantOutlets.length !== 1 ? 's' : ''} monitored</span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${isLive ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-900 text-white'}`}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLive ? 'Pause Stream' : 'Go Live'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-0.5">{stat.label}</p>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Per-outlet register status bar */}
      {tenantOutlets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {tenantOutlets.map(outlet => {
            const { active, total } = seedOutletRegisters(outlet.id);
            return (
              <div key={outlet.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate text-sm">{outlet.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{outlet.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-slate-900">{active}/{total}</p>
                  <p className="text-[10px] font-bold text-emerald-600">registers active</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Live Transaction Feed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            <div className="flex items-center gap-3">
              {/* Outlet filter — only this tenant's outlets */}
              <select
                value={selectedOutlet}
                onChange={e => setSelectedOutlet(e.target.value)}
                className="bg-slate-50 border-none rounded-xl text-xs font-bold py-2 px-3 outline-none"
              >
                <option value="all">All Outlets</option>
                {tenantOutlets.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Order ID or Cashier..."
                  className="bg-slate-50 border-none rounded-xl py-2 pl-9 pr-4 text-xs font-medium outline-none w-52"
                />
              </div>
            </div>
          </div>

          {tenantOutlets.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Monitor className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No outlets configured for monitoring.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Cashier</th>
                    <th className="px-6 py-4">Outlet</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredTransactions.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${order.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-800">{order.id}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{order.time}</p>
                        </td>
                        <td className="px-6 py-5 font-medium text-slate-600">{order.cashier}</td>
                        <td className="px-6 py-5">
                          <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-300" /> {order.outletName}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-slate-900">{order.amount}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium">
                        No transactions match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Cashiers */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-24 bg-indigo-500/10 rounded-full blur-3xl -mr-12 -mt-12" />
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
              <Users className="w-5 h-5 text-indigo-400" /> Top Cashiers
            </h3>
            <div className="space-y-4 relative z-10">
              {[
                { name: 'John Cashier', sales: '$2,140', count: 24, shift: 'Active', color: 'bg-emerald-500' },
                { name: 'Sarah Miller', sales: '$1,890', count: 18, shift: 'Active', color: 'bg-emerald-500' },
                { name: 'Mike Ross', sales: '$1,200', count: 12, shift: 'Break', color: 'bg-amber-500' },
              ].map((c) => (
                <div key={c.name} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{c.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.color}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{c.shift}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">{c.sales}</p>
                    <p className="text-[10px] text-white/40 font-bold">{c.count} orders</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all relative z-10">
              View Detailed Analytics
            </button>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> System Health
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Sync Frequency', value: '2.4s' },
                { label: 'Cloud Connection', value: 'Stable', valueClass: 'text-emerald-600', dot: true },
                { label: 'Hardware Latency', value: '12ms' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">{item.label}</span>
                  <span className={`flex items-center gap-1.5 font-black ${item.valueClass || 'text-slate-900'}`}>
                    {item.dot && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
