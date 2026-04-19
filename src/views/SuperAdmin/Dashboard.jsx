import React from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { 
  Building2, Store, DollarSign, 
  Activity, ShoppingBag, Globe, ShieldAlert,
  AlertTriangle, Smartphone, CreditCard, TrendingUp
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { tenants, sales } = useSaaS();

  const totalTenants = tenants.length;
  const shopsCount = tenants.reduce((acc, t) => acc + (t.outlets?.length || 0), 0);
  const activeTenants = tenants.filter(t => t.subscription?.status === 'Active').length;
  const inactiveTenants = totalTenants - activeTenants;
  
  const totalRevenue = tenants.reduce((acc, t) => {
    if (t.subscription?.status !== 'Active') return acc;
    return acc + (t.subscription?.plan === 'Enterprise' ? 1299 : t.subscription?.plan === 'Pro' ? 299 : 50);
  }, 0);

  const totalGMV = sales.reduce((acc, s) => acc + (s.total || 0), 0) + 125890; // mock default base value

  const posUsage = tenants.filter(t => t.features?.pos).length;
  const ecomUsage = tenants.filter(t => t.features?.ecommerce).length;
  const inventoryUsage = tenants.filter(t => t.features?.inventory).length;

  const usageStats = [
    { name: 'POS Terminals', value: posUsage, max: totalTenants, color: 'bg-indigo-500', icon: Smartphone },
    { name: 'Ecommerce', value: ecomUsage, max: totalTenants, color: 'bg-emerald-500', icon: Globe },
    { name: 'Inventory', value: inventoryUsage, max: totalTenants, color: 'bg-blue-500', icon: ShoppingBag },
  ];

  const alerts = [
    ...tenants.filter(t => t.subscription?.status !== 'Active').map(t => ({
      id: `alert-sub-${t.id}`,
      type: 'expired',
      title: `${t.subscription?.status} Plan`,
      desc: `${t.name} has a non-active subscription.`,
      icon: ShieldAlert,
      color: 'text-red-600',
      bg: 'bg-red-50'
    })),
    ...tenants.filter(t => !t.outlets || t.outlets.length === 0).map(t => ({
      id: `alert-out-${t.id}`,
      type: 'inactive',
      title: 'No Outlets Found',
      desc: `${t.name} has not created any store locations.`,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }))
  ];

  const stats = [
    { label: 'Total Tenants', value: totalTenants, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Platform Sales (GMV)', value: `$${totalGMV.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active / Inactive', value: `${activeTenants} / ${inactiveTenants}`, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'SaaS Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  // Mocking active tenant logic
  const activeTenantsList = [...tenants].sort((a, b) => b.outlets?.length - a.outlets?.length).slice(0, 3);

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium">Monitor global tenant usage, revenue, and platform health.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* System Usage Chart */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6">Module Adoption Rate</h2>
          <div className="space-y-8 mt-8">
            {usageStats.map((item) => {
              const percentage = totalTenants > 0 ? Math.round((item.value / item.max) * 100) : 0;
              return (
                <div key={item.name} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center`}>
                        <item.icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="font-bold text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-900 text-lg">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mt-2 tracking-widest">
                    {item.value} out of {item.max} tenants using this
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Alerts */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900">System Alerts</h2>
            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-black rounded-full">{alerts.length} Needs Action</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex gap-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 shrink-0 ${alert.bg} rounded-xl flex items-center justify-center`}>
                    <alert.icon className={`w-5 h-5 ${alert.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${alert.color}`}>{alert.title}</h3>
                    <p className="text-sm font-medium text-slate-600 mt-1">{alert.desc}</p>
                    <button className="text-[10px] font-black uppercase tracking-wider text-indigo-600 mt-3 hover:text-indigo-700">
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                 <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                 <p className="font-bold">All systems healthy.</p>
                 <p className="text-sm">No critical alerts to display.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Top Active Tenants (Mocked based on outlets/usage) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Most Active Tenants</h2>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View Leaderboard</button>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-50">
              {activeTenantsList.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-5 flex items-center gap-4">
                    <div className="font-black text-slate-300 text-lg w-4">#{idx + 1}</div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                       {t.logo ? <img src={t.logo} className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-slate-400" />}
                    </div>
                    <span className="font-bold text-slate-800">{t.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-700">${(Math.floor(Math.random() * 50) + 10)},{(Math.floor(Math.random() * 899) + 100)} GMV</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{t.outlets?.length || 0} Outlets Syncing</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md tracking-wider">
                      {t.subscription?.plan || 'Pro'} Tier
                    </span>
                  </td>
                </tr>
              ))}
              {activeTenantsList.length === 0 && (
                <tr>
                   <td colSpan="4" className="text-center p-8 text-slate-400 text-sm font-medium">No active tenants mapped yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
