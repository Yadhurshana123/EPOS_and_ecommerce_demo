import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSaaS } from '../../context/SaaSContext';
import { 
  BarChart3, Box, Users, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Printer,
  Smartphone, AlertCircle, Clock, CheckCircle2,
  TrendingUp, Package, Store, Activity, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtext, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity rounded-full`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest">{title}</h3>
    <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
  </div>
);

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { tenants, products, sales, terminals } = useSaaS();

  // Mock data for Till sessions
  const tillSessions = [
    { id: 1, cashier: 'Sarah Connor', status: 'Active', opening: '$200', current: '$1,450', mismatch: '$0', startTime: '08:00 AM' },
    { id: 2, cashier: 'John Doe', status: 'Shift End Pending', opening: '$200', current: '$2,120', mismatch: '+$10', startTime: '09:00 AM' },
    { id: 3, cashier: 'Ellen Ripley', status: 'Closed', opening: '$200', current: '$3,400', mismatch: '$0', startTime: '06:00 AM' },
  ];

  const lowStock = products.filter(p => (p.stock.o1 + p.stock.o2 + p.stock.o3) < 10);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manager Hub</h1>
          <p className="text-slate-500 font-medium">Monitoring {tenants.find(t => t.id === user.tenantId)?.name || 'Nexus'} Outlet Operations</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100">Live View</button>
          <button className="px-5 py-2.5 text-slate-500 hover:text-indigo-600 text-sm font-black">Analytics</button>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Sales" 
          value="$12,840" 
          subtext="Goal: $15,000 (85%)" 
          icon={TrendingUp} 
          trend={12.4} 
          color="from-indigo-600 to-blue-500"
        />
        <StatCard 
          title="Cash in Hand" 
          value="$3,570" 
          subtext="Net across 4 tills" 
          icon={ShoppingBag} 
          trend={-2.1} 
          color="from-emerald-600 to-teal-500"
        />
        <StatCard 
          title="Low Stock" 
          value={lowStock.length} 
          subtext="Action required soon" 
          icon={AlertCircle} 
          color="from-orange-500 to-amber-500"
        />
        <StatCard 
          title="Active Staff" 
          value="8 / 12" 
          subtext="4 on break" 
          icon={Users} 
          color="from-rose-500 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Till Management Section - MAIN WORK */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Till Management</h2>
                <p className="text-sm text-slate-500 font-medium tracking-tight">Real-time shift & cash movement</p>
              </div>
              <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <th className="px-8 py-5 text-left">Cashier / Session</th>
                    <th className="px-8 py-5 text-left">Status</th>
                    <th className="px-8 py-5 text-right">Cash Balance</th>
                    <th className="px-8 py-5 text-right">Mismatch</th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tillSessions.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                            {row.cashier.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{row.cashier}</p>
                            <p className="text-[10px] font-bold text-slate-400">Started at {row.startTime}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                           row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                           row.status === 'Closed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                         }`}>
                           {row.status}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <p className="font-black text-slate-900">{row.current}</p>
                         <p className="text-[10px] font-bold text-slate-400">Opening: {row.opening}</p>
                      </td>
                      <td className="px-8 py-6 text-right font-black">
                        <span className={row.mismatch === '$0' ? 'text-slate-400' : 'text-red-600'}>{row.mismatch}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2">
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100">Details</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
               <button className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">View All Sessions</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Inventory Alerts */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-900">Inventory Control</h3>
                  <Package className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="space-y-4">
                   {lowStock.slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                          <p className="text-[10px] font-bold text-orange-600 uppercase">Only {p.stock.o1 + p.stock.o2 + p.stock.o3} left</p>
                        </div>
                        <button className="bg-white px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-600 border border-slate-200">Refill</button>
                      </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-3 text-indigo-600 font-black text-xs uppercase tracking-widest">Manage All Inventory</button>
             </div>

             {/* Outlet Operations */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-900">Outlet Status</h3>
                  <Store className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">Downtown Branch</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">Operational - 4 POS Active</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">Westside Mall</p>
                        <p className="text-[10px] text-amber-600 font-bold uppercase">Closing in 2 hours</p>
                      </div>
                   </div>
                </div>
                <button className="w-full mt-6 py-3 text-indigo-600 font-black text-xs uppercase tracking-widest">Global Overview</button>
             </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
           {/* Staff Supervision */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black">Staff Performance</h3>
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Sarah Connor', sales: '$4,200', score: 98 },
                  { name: 'John Doe', sales: '$3,800', score: 92 },
                  { name: 'Ellen Ripley', sales: '$2,900', score: 85 }
                ].map((staff) => (
                  <div key={staff.name}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span>{staff.name}</span>
                       <span className="text-indigo-400">{staff.sales}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${staff.score}%` }}
                        className="h-full bg-indigo-500 rounded-full"
                       />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Details</button>
           </div>

           {/* System Control */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-900 mb-6">Hardware Status</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                       <Printer className="w-4 h-4 text-slate-400" />
                       <span className="font-bold text-slate-700">Receipt Printer</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                       <Smartphone className="w-4 h-4 text-slate-400" />
                       <span className="font-bold text-slate-700">Payment Terminals</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                       <Activity className="w-4 h-4 text-slate-400" />
                       <span className="font-bold text-slate-700">Network Speed</span>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">94ms</span>
                 </div>
              </div>
           </div>

           {/* Quick Reports */}
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] shadow-xl text-white">
              <h3 className="font-black mb-6">Daily Summary</h3>
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-xs font-bold">
                    <span className="opacity-70">Gross Sales</span>
                    <span>$12,840</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold">
                    <span className="opacity-70">Total Returns</span>
                    <span className="text-rose-300">-$120</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold pt-4 border-t border-white/10">
                    <span>Net Total</span>
                    <span className="text-xl">$12,720</span>
                 </div>
              </div>
              <button className="w-full py-3 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Download PDF</button>
           </div>
        </div>
      </div>
    </div>
  );
}
