import React, { useMemo } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Filter, Download, Store, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock daily sales (static — represents this tenant's weekly trend)
const MOCK_DAILY_SALES = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 6390 },
  { name: 'Sun', sales: 3490 },
];

// Stable mock sales value per outlet (seeded by outlet id)
function mockOutletRevenue(outletId) {
  const idStr = String(outletId);
  const seed = idStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ((seed * 211) % 30000) + 8000;
}

// Stable mock per-category (seeded by category string)
function mockCategoryRevenue(category) {
  const catStr = String(category);
  const seed = catStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ((seed * 179) % 20000) + 3000;
}

export default function Reports() {
  const { user } = useAuth();
  const { tenants, products } = useSaaS();

  // ✅ Always scoped to this tenant only
  const tenant = tenants.find(t => t.id === user.tenantId);
  const tenantOutlets = tenant?.outlets || [];
  const tenantProducts = products.filter(p => p.tenantId === user.tenantId);

  // Build outlet chart data using ONLY this tenant's outlets
  const outletChartData = useMemo(() =>
    tenantOutlets.map(outlet => ({
      name: outlet.name.length > 12 ? outlet.name.slice(0, 12) + '…' : outlet.name,
      fullName: outlet.name,
      sales: mockOutletRevenue(outlet.id),
    })),
    [tenantOutlets]
  );

  // Build category chart data using ONLY this tenant's product categories
  const categoryChartData = useMemo(() => {
    const cats = [...new Set(tenantProducts.map(p => p.category || 'General'))];
    return cats.map(cat => ({
      category: cat,
      sales: mockCategoryRevenue(cat),
    }));
  }, [tenantProducts]);

  const totalRevenue = outletChartData.reduce((acc, o) => acc + o.sales, 0);

  const kpiCards = [
    { label: 'This Week Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Orders Processed', value: '481', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Outlets', value: tenantOutlets.length, icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Reports</h1>
          <p className="text-slate-500 font-medium">
            Detailed analysis of <span className="text-indigo-600 font-bold">{tenant?.name}</span>'s operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Data isolation badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">Scoped to {tenant?.name}</span>
          </div>
          <button className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" /> Filter
          </button>
          <button className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-600 transition-all">
            <Download className="w-5 h-5" /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5"
          >
            <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`w-7 h-7 ${card.color}`} />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-slate-400 tracking-wider mb-0.5">{card.label}</p>
              <p className="text-2xl font-black text-slate-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg">Sales Revenue Trend</h3>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold p-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DAILY_SALES}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Outlet Distribution — ONLY this tenant's outlets */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg">Outlet-wise Revenue</h3>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
              {tenantOutlets.length} outlets
            </span>
          </div>
          {outletChartData.length === 0 ? (
            <div className="h-72 flex flex-col items-center justify-center text-slate-400">
              <Store className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium">No outlets configured yet</p>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outletChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontWeight: 'bold', fontSize: 12 }}
                    width={110}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(val, _, props) => [`$${val.toLocaleString()}`, props.payload.fullName]}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="sales" fill="#6366f1" radius={[0, 12, 12, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Product Category Performance — tenant's own categories */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-lg">Product Category Performance</h3>
          <p className="text-xs text-slate-500 font-bold uppercase">Revenue by Category</p>
        </div>
        {categoryChartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <p className="font-medium">No products added yet.</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="sales" fill="#818cf8" radius={[10, 10, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Cashier Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50">
          <h3 className="font-black text-slate-900 text-lg">Cashier Performance</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Staff assigned to {tenant?.name}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-400">
                <th className="px-8 py-5">Staff Member</th>
                <th className="px-8 py-5">Sales Managed</th>
                <th className="px-8 py-5">Total Volume</th>
                <th className="px-8 py-5">Avg Transaction</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'John Cashier', sales: 124, vol: '$12,400', avg: '$100', status: 'Online' },
                { name: 'Sarah Miller', sales: 98, vol: '$8,200', avg: '$84', status: 'Online' },
                { name: 'Mike Ross', sales: 45, vol: '$4,100', avg: '$91', status: 'Offline' },
              ].map((staff, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {staff.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-medium text-slate-600">{staff.sales}</td>
                  <td className="px-8 py-6 font-black text-slate-900">{staff.vol}</td>
                  <td className="px-8 py-6 font-medium text-slate-600">{staff.avg}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${staff.status === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
