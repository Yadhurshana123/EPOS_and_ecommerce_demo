import React, { useState } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Calendar, 
  Download, FileText, ChevronDown, Filter,
  ArrowUpRight, ArrowDownRight, Package, ShoppingBag
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, inventory: 2400 },
  { name: 'Tue', sales: 3000, inventory: 1398 },
  { name: 'Wed', sales: 2000, inventory: 9800 },
  { name: 'Thu', sales: 2780, inventory: 3908 },
  { name: 'Fri', sales: 1890, inventory: 4800 },
  { name: 'Sat', sales: 2390, inventory: 3800 },
  { name: 'Sun', sales: 3490, inventory: 4300 },
];

export default function ManagerReports() {
  const [timeRange, setTimeRange] = useState('Daily');

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Reports</h1>
          <p className="text-slate-500 font-medium">Deep dive into sales, inventory and cash flow.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
             {['Daily', 'Weekly', 'Monthly'].map((range) => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    timeRange === range ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
             ))}
          </div>
          <button className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all">
             <Download className="w-5 h-5" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Revenue', value: '$42,500', trend: 12.5, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Total Orders', value: '1,240', trend: 8.2, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Inventory Value', value: '$840k', trend: -2.1, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
           { label: 'Avg Order', value: '$34.20', trend: 4.5, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                 </div>
                 <div className={`flex items-center gap-0.5 text-[10px] font-black ${stat.trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stat.trend)}%
                 </div>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-black text-slate-900 text-lg">Sales Growth</h3>
               <button className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  Last 7 Days <ChevronDown className="w-4 h-4" />
               </button>
            </div>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-black text-slate-900 text-lg">Inventory Movement</h3>
               <button className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  By Category <ChevronDown className="w-4 h-4" />
               </button>
            </div>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                     <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="inventory" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-sm">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <h3 className="font-black text-slate-900 text-lg">Recent Reports</h3>
               <button className="text-xs font-bold text-indigo-600 hover:underline">View Archive</button>
            </div>
            <div className="divide-y divide-slate-50">
               {[
                 { name: 'End of Day Summary', date: 'April 19, 2026', size: '2.4 MB', type: 'PDF' },
                 { name: 'Inventory Reconciliation', date: 'April 18, 2026', size: '1.2 MB', type: 'XLS' },
                 { name: 'Weekly Staff Performance', date: 'April 15, 2026', size: '3.8 MB', type: 'PDF' },
                 { name: 'Monthly Tax Report', date: 'March 2026', size: '5.1 MB', type: 'PDF' },
               ].map((report, i) => (
                 <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <FileText className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-black text-slate-900">{report.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{report.date} • {report.size}</p>
                       </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                       Download
                    </button>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white">
            <h3 className="font-black mb-8">Sales Highlights</h3>
            <div className="space-y-6">
               {[
                 { label: 'Best Selling Category', value: 'Apparel', percent: 45 },
                 { label: 'Top Outlet', value: 'Downtown Branch', percent: 62 },
                 { label: 'Peak Hour', value: '02:00 PM - 04:00 PM', percent: 28 },
                 { label: 'Customer Retention', value: '42%', percent: 42 },
               ].map((item, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-3">
                       <span className="opacity-60">{item.label}</span>
                       <span className="text-indigo-400">{item.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10">
               <p className="text-xs font-bold opacity-60 mb-2 uppercase tracking-widest">Model Insight</p>
               <p className="text-sm font-medium leading-relaxed">
                  "Sales are up <span className="text-emerald-400">12%</span> compared to last Sunday. High traffic detected at Downtown. Consider adding more staff for evening shifts."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
