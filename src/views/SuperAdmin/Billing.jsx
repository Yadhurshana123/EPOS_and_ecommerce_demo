import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Download, Edit3, X, Check, Plus, Server, Users, Globe, Trash2 } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function Billing() {
  const { tenants, updateTenant, plans, addPlan, updatePlan, deletePlan } = useSaaS();
  
  // Tenant Subscription Modal
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [tenantFormData, setTenantFormData] = useState({ plan: 'Pro', status: 'Active' });

  // Plan CRUD Modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '', price: 0, 
    limits: { outlets: 1, staff: 5 }, 
    features: { ecommerce: false, pos: true, inventory: true }
  });

  const openTenantModal = (tenant) => {
    setEditingTenant(tenant);
    setTenantFormData({
      plan: tenant.subscription?.plan || 'Pro',
      status: tenant.subscription?.status || 'Active'
    });
    setIsTenantModalOpen(true);
  };

  const handleTenantSubmit = (e) => {
    e.preventDefault();
    const selectedPlan = plans.find(p => p.name === tenantFormData.plan) || plans[1];
    
    updateTenant(editingTenant.id, {
      subscription: {
        plan: tenantFormData.plan,
        status: tenantFormData.status,
        limits: selectedPlan.limits
      },
      features: { ...editingTenant.features, ...selectedPlan.features } // Inherit plan features
    });
    setIsTenantModalOpen(false);
  };

  const openPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanFormData({ ...plan });
    } else {
      setEditingPlan(null);
      setPlanFormData({
        name: '', price: 0, 
        limits: { outlets: 1, staff: 5 }, 
        features: { ecommerce: false, pos: true, inventory: true }
      });
    }
    setIsPlanModalOpen(true);
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    if (editingPlan) {
      updatePlan(editingPlan.id, planFormData);
    } else {
      addPlan(planFormData);
    }
    setIsPlanModalOpen(false);
  };

  const totalMRR = tenants.reduce((acc, t) => {
    if (t.subscription?.status !== 'Active') return acc;
    const planDetails = plans.find(p => p.name === t.subscription?.plan) || plans[0];
    return acc + (planDetails?.price || 0);
  }, 0);

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscriptions & Billing</h1>
          <p className="text-slate-500 font-medium">Manage SaaS plans, pricing, features, and tenant billings.</p>
        </div>
      </div>

      {/* Plans Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-black text-slate-900">Subscription Plans</h2>
           <button onClick={() => openPlanModal()} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
             <Plus className="w-4 h-4" /> Create Plan
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openPlanModal(plan)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => deletePlan(plan.id)} className="p-2 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
               </div>
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">{plan.name}</h3>
               <div className="mt-4 mb-6">
                 <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                 <span className="text-sm font-bold text-slate-400">/mo</span>
               </div>
               <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Server className="w-4 h-4 text-indigo-500" /> Up to {plan.limits.outlets} {plan.limits.outlets === 999 ? '(Unlimited)' : 'Outlets'}
                 </div>
                 <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Users className="w-4 h-4 text-emerald-500" /> Up to {plan.limits.staff} {plan.limits.staff === 999 ? '(Unlimited)' : 'Staff Members'}
                 </div>
                 <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Globe className={`w-4 h-4 ${plan.features.ecommerce ? 'text-blue-500' : 'text-slate-300'}`} /> {plan.features.ecommerce ? 'Ecommerce Included' : 'No Ecommerce'}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-1 bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
            <ShieldCheck className="w-10 h-10 mb-6 text-indigo-200 relative z-10" />
            <p className="font-bold text-indigo-200 mb-1 relative z-10">Monthly Recurring Revenue</p>
            <h2 className="text-4xl font-black relative z-10">${totalMRR.toLocaleString()}.00</h2>
            <p className="text-xs font-bold text-emerald-400 mt-4 relative z-10">+12.4% from last month</p>
         </div>
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
               <h3 className="font-black text-slate-900">Tenant Subscriptions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <tbody className="divide-y divide-slate-50">
                    {tenants.map((t, i) => {
                      const tenantPlan = plans.find(p => p.name === t.subscription?.plan) || plans[0];
                      return (
                      <tr key={t.id} className="hover:bg-slate-50/50 group">
                         <td className="px-8 py-5">
                            <p className="font-bold text-slate-800">{t.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.subscription?.plan || 'Free'} Plan</p>
                         </td>
                         <td className="px-8 py-5 font-black text-slate-900">
                            ${tenantPlan?.price || 0}.00/mo
                         </td>
                         <td className="px-8 py-5">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${t.subscription?.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {t.subscription?.status || 'Active'}
                            </span>
                         </td>
                         <td className="px-8 py-5 text-right flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openTenantModal(t)} title="Assign Plan" className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors shadow-sm">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button title="Download Invoice" className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors shadow-sm">
                              <Download className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    )})}
                 </tbody>
              </table>
            </div>
         </div>
      </div>

      {/* Plan CRUD Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">{editingPlan ? 'Edit SaaS Plan' : 'Create SaaS Plan'}</h2>
              <button onClick={() => setIsPlanModalOpen(false)} className="w-8 h-8 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handlePlanSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Plan Name</label>
                  <input type="text" required value={planFormData.name} onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Price ($)</label>
                  <input type="number" required value={planFormData.price} onChange={(e) => setPlanFormData({...planFormData, price: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Resource Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Outlets (999 for Unlim)</label>
                    <input type="number" min="1" value={planFormData.limits.outlets} onChange={(e) => setPlanFormData({...planFormData, limits: {...planFormData.limits, outlets: Number(e.target.value)}})} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Staff</label>
                    <input type="number" min="1" value={planFormData.limits.staff} onChange={(e) => setPlanFormData({...planFormData, limits: {...planFormData.limits, staff: Number(e.target.value)}})} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none font-bold" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                   <p className="font-bold text-slate-800 text-sm">Ecommerce Support</p>
                   <p className="text-xs text-slate-500">Enable online store features</p>
                </div>
                <button type="button" onClick={() => setPlanFormData({...planFormData, features: {...planFormData.features, ecommerce: !planFormData.features.ecommerce}})} className={`w-12 h-6 rounded-full transition-colors relative ${planFormData.features.ecommerce ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${planFormData.features.ecommerce ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all">Save Plan Configuration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant Plan Assignment Modal */}
      {isTenantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Assign Plan</h2>
                <p className="text-sm text-slate-500 font-medium">{editingTenant?.name}</p>
              </div>
              <button onClick={() => setIsTenantModalOpen(false)} className="w-8 h-8 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleTenantSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Plan Tier</label>
                  <div className="grid gap-2">
                    {plans.map(p => (
                      <div key={p.id} onClick={() => setTenantFormData({...tenantFormData, plan: p.name})} className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${tenantFormData.plan === p.name ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}>
                        <div>
                           <p className={`font-bold ${tenantFormData.plan === p.name ? 'text-indigo-900' : 'text-slate-700'}`}>{p.name}</p>
                           <p className="text-xs text-slate-500">${p.price}/mo</p>
                        </div>
                        {tenantFormData.plan === p.name && <Check className="w-5 h-5 text-indigo-600" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Billing Status</label>
                  <select value={tenantFormData.status} onChange={(e) => setTenantFormData({...tenantFormData, status: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700">
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all">Update Tenant Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
