import React, { useState } from 'react';
import { Settings as SettingsIcon, Receipt, Globe, DollarSign, Percent, Save, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [settings, setSettings] = useState({
    currency: 'USD',
    taxRate: '10',
    receiptHeader: 'Thank you for your purchase!',
    receiptFooter: 'Visit us again soon.',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium">Configure basic parameters and manage access control.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <Globe className="w-5 h-5 text-indigo-500" /> General Configuration
               </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2">Currency</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select 
                      value={settings.currency}
                      onChange={e => setSettings({...settings, currency: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 appearance-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2">Default Tax Rate (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      value={settings.taxRate}
                      onChange={e => setSettings({...settings, taxRate: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Formatting */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <Receipt className="w-5 h-5 text-indigo-500" /> Receipt Formatting
               </h3>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Receipt Header Message</label>
                <textarea 
                  value={settings.receiptHeader}
                  onChange={e => setSettings({...settings, receiptHeader: e.target.value})}
                  rows="2"
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Receipt Footer Message</label>
                <textarea 
                  value={settings.receiptFooter}
                  onChange={e => setSettings({...settings, receiptFooter: e.target.value})}
                  rows="2"
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all"
            >
              {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Access Control Information Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-16 bg-indigo-500/20 blur-3xl rounded-full -mr-8 -mt-8"></div>
             <Shield className="w-8 h-8 text-indigo-400 mb-6 relative z-10" />
             <h3 className="text-xl font-black mb-2 relative z-10">Access Control</h3>
             <p className="text-slate-400 text-sm mb-6 relative z-10 leading-relaxed">
               Role permissions are strictly enforced system-wide.
             </p>
             <div className="space-y-4 relative z-10">
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[10px] font-black uppercase text-indigo-300 mb-1">Tenant Admin</p>
                 <p className="text-sm font-bold">Full access to dashboard, products, staff, outlets, settings, and reports.</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[10px] font-black uppercase text-emerald-300 mb-1">Manager</p>
                 <p className="text-sm font-bold">Restricted to Inventory Control and specific assigned sections.</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[10px] font-black uppercase text-amber-300 mb-1">Cashier</p>
                 <p className="text-sm font-bold">Restricted to POS Terminal and Shift operations only.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
