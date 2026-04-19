import React from 'react';
import { 
  Users, UserCheck, Clock, Award, 
  MoreVertical, Search, Filter, Mail,
  Phone, Calendar, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffSupervision() {
  const staff = [
    { id: 1, name: 'Sarah Connor', role: 'Head Cashier', status: 'Online', shift: '08:00 - 16:00', performance: 98, sales: '$4,200', image: 'SC' },
    { id: 2, name: 'John Doe', role: 'Cashier', status: 'Online', shift: '09:00 - 17:00', performance: 92, sales: '$3,800', image: 'JD' },
    { id: 3, name: 'Ellen Ripley', role: 'Cashier', status: 'On Break', shift: '06:00 - 14:00', performance: 85, sales: '$2,900', image: 'ER' },
    { id: 4, name: 'Ben Parker', role: 'Trainee', status: 'Offline', shift: '14:00 - 22:00', performance: 0, sales: '$0', image: 'BP' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff supervision</h1>
          <p className="text-slate-500 font-medium">Monitor performance and manage employee shifts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Staff', value: '12', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'On Duty', value: '8', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Late Today', value: '1', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
           { label: 'Top Performer', value: 'Sarah C.', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className={`p-3 w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} mb-4 flex items-center justify-center`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <h2 className="font-black text-slate-900 text-lg">Employee Directory</h2>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black">4 TOTAL</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input type="text" placeholder="Search staff..." className="bg-slate-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold w-64 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                 <Filter className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <th className="px-8 py-5">Staff Member</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Shift</th>
                    <th className="px-8 py-5">Performance</th>
                    <th className="px-8 py-5">Today's Sales</th>
                    <th className="px-8 py-5">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {staff.map((s) => (
                    <tr key={s.id} className="group hover:bg-slate-50/30 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 shadow-inner">
                                {s.image}
                             </div>
                             <div>
                                <p className="font-black text-slate-900">{s.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{s.role}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${
                               s.status === 'Online' ? 'bg-emerald-500' : 
                               s.status === 'On Break' ? 'bg-amber-500' : 'bg-slate-300'
                             }`} />
                             <span className="text-xs font-bold text-slate-600">{s.status}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-xs font-bold text-slate-500">
                          {s.shift}
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[100px]">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${s.performance}%` }}
                                  className={`h-full rounded-full ${
                                    s.performance > 90 ? 'bg-indigo-500' : 
                                    s.performance > 80 ? 'bg-blue-500' : 'bg-slate-400'
                                  }`}
                                />
                             </div>
                             <span className="text-[10px] font-black text-slate-900">{s.performance}%</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-1 text-emerald-600 font-black">
                             <TrendingUp className="w-3 h-3" />
                             <span>{s.sales}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex gap-2">
                             <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                                <Mail className="w-4 h-4" />
                             </button>
                             <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100">
                                <Phone className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
