import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { Globe, Bell, Zap, ArrowRight, CheckCircle2, Megaphone, AlertTriangle, Gift, ShieldAlert } from 'lucide-react';

export default function Settings() {
  const { tenants, updateTenant, plans } = useSaaS();

  // Bulk actions state
  const [bulkFeature, setBulkFeature] = useState('ecommerce');
  const [bulkFeatureAction, setBulkFeatureAction] = useState(true);

  const [targetPlanGroup, setTargetPlanGroup] = useState('Starter');
  const [newPlanUpgrade, setNewPlanUpgrade] = useState('Pro');

  const [notificationType, setNotificationType] = useState('announcement');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');
  
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleBulkFeature = () => {
    tenants.forEach(t => {
      updateTenant(t.id, {
        features: {
          ...(t.features || {}),
          [bulkFeature]: bulkFeatureAction
        }
      });
    });
    showToast(`Success: Set "${bulkFeature}" to ${bulkFeatureAction ? 'ON' : 'OFF'} for all ${tenants.length} tenants.`);
  };

  const handleBulkUpgrade = () => {
    let count = 0;
    const upgradePlanDetails = plans.find(p => p.name === newPlanUpgrade);
    if (!upgradePlanDetails) return;

    tenants.forEach(t => {
      const currentPlan = t.subscription?.plan || 'Free';
      if (currentPlan === targetPlanGroup) {
        updateTenant(t.id, {
          subscription: {
            ...t.subscription,
            plan: newPlanUpgrade,
            limits: upgradePlanDetails.limits
          },
          features: { ...(t.features || {}), ...upgradePlanDetails.features }
        });
        count++;
      }
    });
    showToast(`Success: Upgraded ${count} tenants from ${targetPlanGroup} to ${newPlanUpgrade}.`);
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notificationTitle || !notificationMsg) return;
    
    // In a production app, we would write this to a backend stream or sockets
    console.log(`[BROADCAST] [${notificationType.toUpperCase()}] ${notificationTitle}: ${notificationMsg}`);
    
    showToast(`Broadcast Sent: Delivering ${notificationType} to all active terminals and admins.`);
    setNotificationTitle('');
    setNotificationMsg('');
  };

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Operations</h1>
        <p className="text-slate-500 font-medium">Mass execute capabilities and broadcast global messaging.</p>
      </div>

      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <p className="font-bold text-sm tracking-wide">{toast}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GLOBAL CONTROL PANEL */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-indigo-50/30">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Global Control Panel</h3>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Mass Action Executor</p>
                 </div>
              </div>

              <div className="p-8 space-y-8">
                 {/* Bulk Feature Switch */}
                 <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                       <ShieldAlert className="w-4 h-4 text-amber-500" /> Force Bulk Feature Access
                    </h4>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4">
                       <select 
                         value={bulkFeature}
                         onChange={(e) => setBulkFeature(e.target.value)}
                         className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none font-medium text-slate-700"
                       >
                         <option value="ecommerce">Ecommerce</option>
                         <option value="pos">POS Terminal</option>
                         <option value="inventory">Inventory System</option>
                         <option value="reports">Advanced Reports</option>
                         <option value="aiOnboarding">AI Onboarding</option>
                       </select>
                       
                       <div className="flex gap-2">
                         <button 
                           onClick={() => setBulkFeatureAction(true)} 
                           className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${bulkFeatureAction ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                         >ON</button>
                         <button 
                           onClick={() => setBulkFeatureAction(false)} 
                           className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${!bulkFeatureAction ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'}`}
                         >OFF</button>
                       </div>

                       <button onClick={handleBulkFeature} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                         Apply All
                       </button>
                    </div>
                 </div>

                 {/* Bulk Plan Upgrade */}
                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                       <ArrowRight className="w-4 h-4 text-emerald-500" /> Bulk Plan Migration
                    </h4>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-4">
                       <div className="flex items-center gap-4">
                         <div className="flex-1">
                           <label className="text-[10px] uppercase font-bold text-slate-400 pl-1">Target Audience</label>
                           <select 
                             value={targetPlanGroup}
                             onChange={(e) => setTargetPlanGroup(e.target.value)}
                             className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none font-bold text-slate-700"
                           >
                             <option value="Starter">Starter Plan Users</option>
                             <option value="Basic">Basic Plan Users</option>
                             <option value="Pro">Pro Plan Users</option>
                             <option value="Free">Free / Trial Users</option>
                           </select>
                         </div>
                         <ArrowRight className="w-5 h-5 text-slate-300 mt-5 shrink-0" />
                         <div className="flex-1">
                           <label className="text-[10px] uppercase font-bold text-slate-400 pl-1">Upgrade To</label>
                           <select 
                             value={newPlanUpgrade}
                             onChange={(e) => setNewPlanUpgrade(e.target.value)}
                             className="w-full mt-1 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 outline-none font-black text-indigo-700"
                           >
                             {plans.map(p => (
                               <option key={p.id} value={p.name}>{p.name}</option>
                             ))}
                           </select>
                         </div>
                       </div>
                       
                       <button onClick={handleBulkUpgrade} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                         <Zap className="w-4 h-4" /> Run Mass Upgrade
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* NOTIFICATION SYSTEM */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-emerald-50/30">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Broadcast Network</h3>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Global Notification Delivery</p>
                 </div>
              </div>

              <form onSubmit={handleSendNotification} className="p-8 space-y-6">
                 
                 <div className="grid grid-cols-3 gap-3">
                   <div 
                     onClick={() => setNotificationType('announcement')}
                     className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all ${notificationType === 'announcement' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                   >
                     <Megaphone className={`w-5 h-5 ${notificationType === 'announcement' ? 'text-indigo-600' : 'text-slate-400'}`} />
                     <span className={`text-[10px] font-black uppercase ${notificationType === 'announcement' ? 'text-indigo-900' : 'text-slate-500'}`}>Announcement</span>
                   </div>
                   
                   <div 
                     onClick={() => setNotificationType('maintenance')}
                     className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all ${notificationType === 'maintenance' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                   >
                     <AlertTriangle className={`w-5 h-5 ${notificationType === 'maintenance' ? 'text-amber-500' : 'text-slate-400'}`} />
                     <span className={`text-[10px] font-black uppercase ${notificationType === 'maintenance' ? 'text-amber-900' : 'text-slate-500'}`}>Maintenance</span>
                   </div>
                   
                   <div 
                     onClick={() => setNotificationType('offer')}
                     className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all ${notificationType === 'offer' ? 'border-pink-500 bg-pink-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                   >
                     <Gift className={`w-5 h-5 ${notificationType === 'offer' ? 'text-pink-500' : 'text-slate-400'}`} />
                     <span className={`text-[10px] font-black uppercase ${notificationType === 'offer' ? 'text-pink-900' : 'text-slate-500'}`}>Offer / Promo</span>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Headline</label>
                     <input 
                       type="text" 
                       required
                       value={notificationTitle}
                       onChange={(e) => setNotificationTitle(e.target.value)}
                       placeholder="E.g., Scheduled Maintenance Downtime"
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-800"
                     />
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Broadcast Message</label>
                     <textarea 
                       required
                       rows="4"
                       value={notificationMsg}
                       onChange={(e) => setNotificationMsg(e.target.value)}
                       placeholder="Detail the update, urgency, or offer specifics..."
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700 resize-none"
                     ></textarea>
                   </div>
                 </div>
                 
                 <div className="pt-2">
                   <button type="submit" className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                     <Bell className="w-4 h-4" /> Finalize & Dispatch Broadcast
                   </button>
                 </div>
              </form>
           </div>
        </div>

      </div>
    </div>
  );
}
