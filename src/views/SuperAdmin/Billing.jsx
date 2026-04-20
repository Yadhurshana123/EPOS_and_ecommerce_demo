import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Download, Edit3, X, Check, Plus, Server, Users, Globe, Trash2, Smartphone, Monitor, Printer, Scan, Coins, Tablet, Network, Tv, Box, PackagePlus } from 'lucide-react';
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
    name: '', 
    price: { monthly: 0, yearly: 0 }, 
    limits: { outlets: 1, staff: 5 }, 
    features: [],
    hardware: [],
    color: 'indigo',
    recommended: false
  });

  const [newFeature, setNewFeature] = useState('');
  const [newHardware, setNewHardware] = useState({ name: '', desc: '', icon: 'Box' });

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
      }
    });
    setIsTenantModalOpen(false);
  };

  const openPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanFormData({ ...plan, hardware: plan.hardware || [] });
    } else {
      setEditingPlan(null);
      setPlanFormData({
        name: '', 
        price: { monthly: 0, yearly: 0 }, 
        limits: { outlets: 1, staff: 5 }, 
        features: [],
        hardware: [],
        color: 'indigo',
        recommended: false
      });
    }
    setNewHardware({ name: '', desc: '', icon: 'Box' });
    setIsPlanModalOpen(true);
  };

  const addHardwareItem = () => {
    if (newHardware.name.trim()) {
      setPlanFormData(prev => ({ ...prev, hardware: [...(prev.hardware || []), { ...newHardware }] }));
      setNewHardware({ name: '', desc: '', icon: 'Box' });
    }
  };

  const removeHardwareItem = (idx) => {
    setPlanFormData(prev => ({ ...prev, hardware: prev.hardware.filter((_, i) => i !== idx) }));
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

  const addFeature = () => {
    if (newFeature.trim()) {
      setPlanFormData({...planFormData, features: [...planFormData.features, newFeature.trim()]});
      setNewFeature('');
    }
  };

  const removeFeature = (idx) => {
    setPlanFormData({...planFormData, features: planFormData.features.filter((_, i) => i !== idx)});
  };

  const totalMRR = tenants.reduce((acc, t) => {
    if (t.subscription?.status !== 'Active') return acc;
    const planDetails = plans.find(p => p.name === t.subscription?.plan) || plans[0];
    return acc + (planDetails?.price?.monthly || 0);
  }, 0);

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscriptions & Billing</h1>
          <p className="text-slate-500 font-medium">Manage SaaS plans, pricing, and infrastructure tiers.</p>
        </div>
      </div>

      {/* Plans Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-black text-slate-900">Platform Tiers</h2>
           <button onClick={() => openPlanModal()} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
             <Plus className="w-5 h-5" /> Create New Plan
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all ${plan.recommended ? 'border-indigo-600 ring-4 ring-indigo-500/5' : 'border-slate-100 shadow-sm'} hover:shadow-lg transition-shadow group relative flex flex-col`}>
               <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openPlanModal(plan)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => deletePlan(plan.id)} className="p-2.5 bg-slate-50 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
               </div>
               
               {plan.recommended && (
                 <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full absolute -top-3 left-1/2 -translate-x-1/2">Recommended</span>
               )}

               <h3 className={`text-xl font-black uppercase tracking-widest ${plan.recommended ? 'text-indigo-600' : 'text-slate-900'}`}>{plan.name}</h3>
               <div className="mt-4 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">${plan.price.monthly}</span>
                    <span className="text-sm font-bold text-slate-400">/mo</span>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">${plan.price.yearly} / billed annually</p>
               </div>

               <div className="space-y-3 mb-6 flex-1">
                 <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <Server className="w-4 h-4 text-indigo-500" /> {plan.limits.outlets >= 999 ? 'Unlimited Outlets' : `${plan.limits.outlets} Locations`}
                 </div>
                 <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <Users className="w-4 h-4 text-emerald-500" /> {plan.limits.staff >= 999 ? 'Unlimited Staff' : `${plan.limits.staff} Team Members`}
                 </div>
                 <div className="pt-3 border-t border-slate-50 space-y-2">
                   {plan.features.slice(0, 4).map((f, i) => (
                     <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                       <Check className="w-3.5 h-3.5 text-emerald-500" /> {f}
                     </div>
                   ))}
                   {plan.features.length > 4 && <p className="text-[10px] text-slate-400 font-bold px-5">+ {plan.features.length - 4} more features</p>}
                 </div>
               </div>

               {/* Hardware Bundle */}
               {plan.hardware && plan.hardware.length > 0 && (() => {
                 const HWICONS = { Smartphone, Monitor, Printer, Scan, Coins, Tablet, Network, Tv, Box };
                 return (
                   <div className={`mt-auto pt-5 border-t border-slate-100`}>
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                       <Box className="w-3 h-3" /> Included Hardware
                     </p>
                     <div className="space-y-2">
                       {plan.hardware.map((hw, i) => {
                         const HWIcon = HWICONS[hw.icon] || Box;
                         return (
                           <div key={i} className="flex items-center gap-2.5 group/hw">
                             <div className={`w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 group-hover/hw:bg-indigo-600 group-hover/hw:text-white transition-all duration-300`}>
                               <HWIcon className="w-3 h-3" />
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-slate-700 leading-tight">{hw.name}</p>
                               <p className="text-[9px] font-bold text-slate-400 leading-tight">{hw.desc}</p>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 );
               })()}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-1 bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[250px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
            <ShieldCheck className="w-12 h-12 mb-6 text-indigo-200 relative z-10" />
            <div>
              <p className="font-bold text-indigo-200 mb-1 relative z-10">Monthly Recurring Revenue</p>
              <h2 className="text-5xl font-black relative z-10 tracking-tight">${totalMRR.toLocaleString()}</h2>
              <p className="text-xs font-bold text-emerald-400 mt-4 relative z-10 flex items-center gap-2">
                <Check className="w-4 h-4" /> Calculated from active tenants
              </p>
            </div>
         </div>
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Subscriptions</h3>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tenants.length} Managed Portals</span>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                 <tbody className="divide-y divide-slate-50">
                    {tenants.map((t) => {
                      const tenantPlan = plans.find(p => p.name === t.subscription?.plan) || plans[0];
                      return (
                      <tr key={t.id} className="hover:bg-slate-50/50 group transition-colors">
                         <td className="px-8 py-6">
                            <p className="font-bold text-slate-800 text-base">{t.name}</p>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t.subscription?.plan || 'Free'} Tier</p>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900">${tenantPlan?.price?.monthly || 0}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Per Month</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                            <button onClick={() => openTenantModal(t)} title="Assign Plan" className="p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm">
                              <Edit3 className="w-4.5 h-4.5" />
                            </button>
                            <button title="Download Invoice" className="p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm">
                              <Download className="w-4.5 h-4.5" />
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingPlan ? 'Refine SaaS Plan' : 'Establish New Tier'}</h2>
                <p className="text-sm font-medium text-slate-500">Configure pricing and resource allocations.</p>
              </div>
              <button onClick={() => setIsPlanModalOpen(false)} className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 transition-all"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handlePlanSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Plan Name</label>
                  <input type="text" required value={planFormData.name} onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-black text-slate-800" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400">Theme Color</label>
                   <select value={planFormData.color} onChange={(e) => setPlanFormData({...planFormData, color: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none font-bold text-slate-800 capitalize">
                      {['indigo', 'slate', 'emerald', 'amber', 'rose', 'blue'].map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Monthly Price ($)</label>
                  <input type="number" required value={planFormData.price.monthly} onChange={(e) => setPlanFormData({...planFormData, price: {...planFormData.price, monthly: Number(e.target.value)}})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Annual Price ($)</label>
                  <input type="number" required value={planFormData.price.yearly} onChange={(e) => setPlanFormData({...planFormData, price: {...planFormData.price, yearly: Number(e.target.value)}})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none font-bold text-slate-800" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">Infrastructure Limits</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Storefronts / Outlets</label>
                    <input type="number" value={planFormData.limits.outlets} onChange={(e) => setPlanFormData({...planFormData, limits: {...planFormData.limits, outlets: Number(e.target.value)}})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Staff Accounts</label>
                    <input type="number" value={planFormData.limits.staff} onChange={(e) => setPlanFormData({...planFormData, limits: {...planFormData.limits, staff: Number(e.target.value)}})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">Features Included</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. AI Inventory Monitoring" 
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium" 
                  />
                  <button type="button" onClick={addFeature} className="bg-slate-900 text-white px-6 rounded-2xl font-bold hover:bg-black transition-all">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {planFormData.features.map((f, i) => (
                    <div key={i} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                      {f} <button type="button" onClick={() => removeFeature(i)}><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2 flex items-center gap-2">
                  <Box className="w-3.5 h-3.5" /> Hardware Bundle
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  <input
                    type="text"
                    placeholder="Device name"
                    value={newHardware.name}
                    onChange={(e) => setNewHardware({ ...newHardware, name: e.target.value })}
                    className="col-span-2 bg-slate-50 border-none rounded-2xl px-4 py-3 font-medium text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Short description"
                    value={newHardware.desc}
                    onChange={(e) => setNewHardware({ ...newHardware, desc: e.target.value })}
                    className="col-span-2 bg-slate-50 border-none rounded-2xl px-4 py-3 font-medium text-sm"
                  />
                  <button type="button" onClick={addHardwareItem} className="bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {(planFormData.hardware || []).map((hw, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl">
                      <div>
                        <p className="text-xs font-black text-slate-800">{hw.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{hw.desc}</p>
                      </div>
                      <button type="button" onClick={() => removeHardwareItem(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!planFormData.hardware || planFormData.hardware.length === 0) && (
                    <p className="text-[10px] font-bold text-slate-300 text-center py-2">No hardware items added yet</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <input 
                     type="checkbox" 
                     id="recommended" 
                     className="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600" 
                     checked={planFormData.recommended}
                     onChange={(e) => setPlanFormData({...planFormData, recommended: e.target.checked})}
                   />
                   <label htmlFor="recommended" className="font-bold text-slate-700 text-sm">Tag as Recommended Plan</label>
                 </div>
                 <button type="submit" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95">
                    {editingPlan ? 'Sync Plan Settings' : 'Create Tier'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant Plan Assignment Modal */}
      {isTenantModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Assign Platform Tier</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{editingTenant?.name}</p>
              </div>
              <button onClick={() => setIsTenantModalOpen(false)} className="w-8 h-8 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleTenantSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plan Selection</label>
                  <div className="grid gap-3">
                    {plans.map(p => (
                      <div key={p.id} onClick={() => setTenantFormData({...tenantFormData, plan: p.name})} className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${tenantFormData.plan === p.name ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}>
                        <div>
                           <p className={`font-black text-sm uppercase tracking-tight ${tenantFormData.plan === p.name ? 'text-indigo-900' : 'text-slate-700'}`}>{p.name}</p>
                           <p className="text-[10px] font-bold text-slate-400">${p.price.monthly}/mo · {p.limits.outlets} Outlets</p>
                        </div>
                        {tenantFormData.plan === p.name && <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200"><Check className="w-4 h-4 text-white" /></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all uppercase text-xs tracking-widest">Finalize Migration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
