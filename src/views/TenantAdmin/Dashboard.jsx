import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, Package, Store, Users, 
  TrendingUp, ArrowUpRight, Sparkles,
  BarChart3, Layers, AlertTriangle, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock per-outlet sales data generator (seeded by outlet id so it's stable)
function mockOutletSales(outletId) {
  const seed = outletId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const sales = ((seed * 137) % 2800) + 600;
  const orders = Math.round(sales / 58);
  return { sales, orders };
}

export default function TenantDashboard() {
  const { user } = useAuth();
  // ✅ Strictly filtered to this tenant only — never access other tenants' data
  const { tenants, products } = useSaaS();
  const tenant = tenants.find(t => t.id === user.tenantId);

  // All data scoped exclusively to user.tenantId
  const tenantProducts = products.filter(p => p.tenantId === user.tenantId);
  const tenantOutlets = tenant?.outlets || [];

  // Compute per-outlet mock performance — based only on this tenant's outlets
  const outletPerformance = tenantOutlets.map(outlet => {
    const { sales, orders } = mockOutletSales(outlet.id);
    return { ...outlet, sales, orders };
  });

  const maxSales = outletPerformance.length > 0
    ? Math.max(...outletPerformance.map(o => o.sales))
    : 1;

  // Best outlet (highest sales among THIS tenant's outlets only)
  const bestOutlet = outletPerformance.length > 0
    ? outletPerformance.reduce((a, b) => (a.sales > b.sales ? a : b))
    : null;

  // Total sales = sum of all this tenant's outlets
  const totalSales = outletPerformance.reduce((acc, o) => acc + o.sales, 0);
  const totalOrders = outletPerformance.reduce((acc, o) => acc + o.orders, 0);

  // Low stock = products of this tenant where any outlet stock < 5
  const lowStockProducts = tenantProducts.filter(p => {
    const totalStock = Object.values(p.stock || {}).reduce((a, b) => a + b, 0);
    return totalStock < 10;
  });

  const stats = [
    { 
      label: "Today's Sales", 
      value: `$${totalSales.toLocaleString()}`, 
      change: '+12%', 
      icon: TrendingUp, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: 'Total Orders', 
      value: totalOrders, 
      change: '+18%', 
      icon: ShoppingBag, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Active Products', 
      value: tenantProducts.length, 
      change: `+${Math.max(0, tenantProducts.length - 2)}`, 
      icon: Package, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'My Outlets', 
      value: tenantOutlets.length, 
      change: `${tenantOutlets.length > 1 ? '+1' : '0'}`, 
      icon: Store, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="text-slate-500 font-medium">
            Managing <span className="text-indigo-600 font-bold">{tenant?.name}</span>'s operations.
          </p>
        </div>
        {/* Tenant isolation badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-emerald-700">Data scoped to {tenant?.name}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Outlet Performance — THIS tenant's outlets only */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                Outlet Performance Comparison
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                {tenantOutlets.length} {tenantOutlets.length === 1 ? 'Outlet' : 'Outlets'}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {outletPerformance.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Store className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No outlets configured yet.</p>
                  <p className="text-sm mt-1">Add outlets from the Locations tab.</p>
                </div>
              ) : (
                outletPerformance.map((outlet, i) => {
                  const isBest = bestOutlet?.id === outlet.id && outletPerformance.length > 1;
                  return (
                    <motion.div
                      key={outlet.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.08 }}
                    >
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800">{outlet.name}</p>
                            {isBest && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                Top Outlet
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">
                            {outlet.location} · {outlet.orders} Orders Today
                          </p>
                        </div>
                        <p className="font-black text-slate-900">${outlet.sales.toLocaleString()}</p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <motion.div
                          className={`h-2.5 rounded-full ${isBest ? 'bg-amber-400' : 'bg-indigo-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(outlet.sales / maxSales) * 100}%` }}
                          transition={{ duration: 0.7, delay: 0.4 + i * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Top Products — scoped to this tenant */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" />
                Top Products
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {tenantProducts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium">
                  No products yet. Use AI Add Product to get started!
                </div>
              ) : (
                tenantProducts.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg text-xs font-black">
                        #{i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{p.name}</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{p.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        {Object.values(p.stock || {}).reduce((a, b) => a + b, 0)} in stock
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stock Alerts — only this tenant's products */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6"
          >
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Stock Alerts
            </h3>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm font-medium text-slate-500">All stock levels look healthy!</p>
                </div>
              ) : (
                lowStockProducts.slice(0, 4).map((p) => {
                  const totalStock = Object.values(p.stock || {}).reduce((a, b) => a + b, 0);
                  const pct = Math.min(100, (totalStock / 20) * 100);
                  // Find which of THIS tenant's outlet has the lowest stock
                  const outletEntry = Object.entries(p.stock || {})
                    .filter(([oid]) => tenantOutlets.find(o => o.id === oid))
                    .sort(([, a], [, b]) => a - b)[0];
                  const lowestOutlet = outletEntry
                    ? tenantOutlets.find(o => o.id === outletEntry[0])?.name
                    : null;

                  return (
                    <div key={p.id} className="p-4 rounded-2xl border border-amber-50 bg-amber-50/20">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-black text-slate-800 truncate pr-4">{p.name}</p>
                        <span className="text-xs font-black text-amber-600 whitespace-nowrap">
                          {totalStock} left
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      {lowestOutlet && (
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Low at {lowestOutlet}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* AI Insight — references only THIS tenant's best outlet */}
          {bestOutlet && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-indigo-600 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-lg font-black mb-2 relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                AI Insight
              </h3>
              <p className="text-sm text-indigo-100 mb-4 opacity-90 relative z-10">
                {outletPerformance.length > 1
                  ? `Your "${bestOutlet.name}" outlet leads with $${bestOutlet.sales.toLocaleString()} today — ${Math.round((bestOutlet.sales / (totalSales - bestOutlet.sales || 1)) * 100 - 100)}% ahead of your other outlets.`
                  : `"${bestOutlet.name}" is running smoothly with ${bestOutlet.orders} orders today. Consider expanding to a second outlet!`
                }
              </p>
              <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-2xl text-sm relative z-10 shadow-lg hover:shadow-indigo-400/20 transition-all">
                Optimize Strategy
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
