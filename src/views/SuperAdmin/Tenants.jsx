import React, { useState } from 'react';
import { Layers, Plus, Search, Building2, Edit3, Trash2, X, Check, Filter, Power, Mail, User, Shield, CreditCard, Box, Eye, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaaS } from '../../context/SaaSContext';
import TenantOnboarding from '../../components/SuperAdmin/TenantOnboarding';

export default function Tenants() {
  const { tenants, addTenant, updateTenant, deleteTenant } = useSaaS();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [viewingTenant, setViewingTenant] = useState(null);

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setIsOnboardingOpen(true);
  };

  const handleCreate = () => {
    setEditingTenant(null);
    setIsOnboardingOpen(true);
  };

  const toggleTenantStatus = (tenant) => {
    const currentStatus = tenant.subscription?.status || 'Active';
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    updateTenant(tenant.id, {
      subscription: { ...tenant.subscription, status: nextStatus }
    });
  };

  const handleSendEmail = (email, pwd) => {
    alert(`Mock: Email dispatched to ${email} with temporary password: ${pwd}`);
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (t.subscription?.status || 'Active') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-full relative">
      <AnimatePresence mode="wait">
        {isOnboardingOpen ? (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            <TenantOnboarding 
              onClose={() => setIsOnboardingOpen(false)} 
              onComplete={() => setIsOnboardingOpen(false)} 
              editTenant={editingTenant}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenant Management</h1>
                <p className="text-slate-500 font-medium">Control platform access, billing plans, and global shops.</p>
              </div>
              <button 
                onClick={handleCreate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
              >
                <Plus className="w-5 h-5" /> Create Tenant
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Search tenants..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 outline-none font-medium" 
                     />
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100/50">
                     {['All', 'Active', 'Suspended'].map(filter => (
                       <button
                         key={filter}
                         onClick={() => setStatusFilter(filter)}
                         className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === filter ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                         {filter}
                       </button>
                     ))}
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-400">
                           <th className="px-8 py-5">Shop Name</th>
                           <th className="px-8 py-5">Owner Details</th>
                           <th className="px-8 py-5">Plan</th>
                           <th className="px-8 py-5">Status</th>
                           <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {filteredTenants.map(t => {
                          const status = t.subscription?.status || 'Active';
                          const isActive = status === 'Active';
                          const ownerName = t.ownerName || 'Admin User';
                          const ownerEmail = t.ownerEmail || `hello@${t.name.replace(/\s+/g,'').toLowerCase()}.com`;
                          
                          return (
                            <tr key={t.id} className={`group hover:bg-slate-50/30 transition-colors ${!isActive ? 'opacity-70' : ''}`}>
                               <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center ${!isActive && 'grayscale'}`}>
                                         {t.logo ? <img src={t.logo} className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-slate-400" />}
                                      </div>
                                      <span className={`font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{t.name}</span>
                                   </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex flex-col gap-1">
                                     <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                        <User className="w-3.5 h-3.5 text-slate-400" /> {ownerName}
                                     </div>
                                     <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {ownerEmail}
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md tracking-wider">
                                    {t.subscription?.plan || 'Pro'}
                                  </span>
                               </td>
                               <td className="px-8 py-6">
                                   <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                     {status}
                                   </span>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => setViewingTenant(t)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Eye className="w-4 h-4" />
                                     </button>
                                     <button 
                                       onClick={() => toggleTenantStatus(t)} 
                                       title={isActive ? "Suspend Tenant" : "Activate Tenant"}
                                       className={`p-2 rounded-lg transition-colors ${isActive ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-50' : 'text-amber-500 bg-amber-50 hover:bg-amber-100'}`}
                                     >
                                        <Power className="w-4 h-4" />
                                     </button>
                                     <button onClick={() => handleEdit(t)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                     </button>
                                     <button onClick={() => deleteTenant(t.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                          );
                        })}
                     </tbody>
                  </table>
                  {filteredTenants.length === 0 && (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                      <Search className="w-8 h-8 mx-auto opacity-20" />
                      <p className="font-bold tracking-tight">No tenants found</p>
                      <p className="text-sm">Try adjusting your filters or creating a new tenant.</p>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {viewingTenant && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                     {viewingTenant.logo ? <img src={viewingTenant.logo} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-slate-400" />}
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-slate-900">{viewingTenant.name}</h2>
                     <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                       Tenant ID: <span className="font-mono text-slate-600">{viewingTenant.id}</span>
                     </p>
                   </div>
                </div>
                <button onClick={() => setViewingTenant(null)} className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                       <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Owner Profile</h3>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><User className="w-5 h-5" /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-500">Full Name</p>
                                <p className="font-black text-slate-800">{viewingTenant.ownerName || 'Not Set'}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-500">Contact Email / Username</p>
                                <p className="font-black text-slate-800">{viewingTenant.ownerEmail || 'Not Set'}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5" /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-500">System Mode</p>
                                <p className="font-black text-slate-800 capitalize">{viewingTenant.roleMode || 'Multi'}-Role Setup</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                       <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Subscription Data</h3>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-500">Active Plan</p>
                                <p className="font-black text-slate-800">{viewingTenant.subscription?.plan || 'Free'} Tier</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Box className="w-5 h-5" /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-500">Resources Loaded</p>
                                <p className="font-black text-slate-800">{viewingTenant.outlets?.length || 0} Outlets / Max {viewingTenant.subscription?.limits?.outlets || 1}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Power className="w-5 h-5" /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-500">Current Status</p>
                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md mt-1 inline-block ${viewingTenant.subscription?.status === 'Active' ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                                  {viewingTenant.subscription?.status || 'Active'}
                                </span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Operating Outlets</h3>
                    {viewingTenant.outlets && viewingTenant.outlets.length > 0 ? (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {viewingTenant.outlets.map(o => (
                             <div key={o.id} className="p-4 border border-slate-200 rounded-2xl flex items-center justify-between">
                                <div>
                                   <p className="font-bold text-slate-800">{o.name}</p>
                                   <p className="text-xs text-slate-500">{o.location}</p>
                                </div>
                                <span className="bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-1 rounded-md">{o.id}</span>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center">
                          <p className="text-slate-400 font-bold">No outlets registered for this tenant yet.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
         </div>
      )}
    </div>
  );
}
