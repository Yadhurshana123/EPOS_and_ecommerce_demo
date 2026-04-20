import React, { useState } from 'react';
import { Settings as SettingsIcon, Receipt, Globe, DollarSign, Percent, Save, Shield, CheckCircle2, Image, Type, AlignCenter, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const { tenants, updateTenant } = useSaaS();
  const tenant = tenants.find(t => t.id === user.tenantId);

  const [settings, setSettings] = useState({
    currency: 'USD',
    taxRate: '10',
    header: tenant?.receiptSettings?.header || 'Welcome to our store!',
    footer: tenant?.receiptSettings?.footer || 'Thank you for shopping with us.',
    showLogo: tenant?.receiptSettings?.showLogo ?? true,
    showAddress: tenant?.receiptSettings?.showAddress ?? true,
    showPhone: tenant?.receiptSettings?.showPhone ?? true,
    fontFamily: tenant?.receiptSettings?.fontFamily || 'sans-serif',
    fontSize: tenant?.receiptSettings?.fontSize || 'sm',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateTenant(user.tenantId, {
      receiptSettings: {
        header: settings.header,
        footer: settings.footer,
        showLogo: settings.showLogo,
        showAddress: settings.showAddress,
        showPhone: settings.showPhone,
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium">Customize your business parameters and receipt layout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
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

          {/* Receipt Customization */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <Receipt className="w-5 h-5 text-indigo-500" /> Receipt Designer
               </h3>
            </div>
            <div className="p-8 space-y-8">
              {/* Layout Toggles */}
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setSettings({...settings, showLogo: !settings.showLogo})}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${settings.showLogo ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >
                  <Image className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Show Logo</span>
                </button>
                <button 
                  onClick={() => setSettings({...settings, showAddress: !settings.showAddress})}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${settings.showAddress ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >
                  <Layout className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Show Address</span>
                </button>
                <button 
                  onClick={() => setSettings({...settings, showPhone: !settings.showPhone})}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${settings.showPhone ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >
                  <AlignCenter className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Show Info</span>
                </button>
              </div>

              {/* Text Areas */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2">Header Text</label>
                  <textarea 
                    value={settings.header}
                    onChange={e => setSettings({...settings, header: e.target.value})}
                    rows="2"
                    placeholder="Enter welcome message..."
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2">Footer Text</label>
                  <textarea 
                    value={settings.footer}
                    onChange={e => setSettings({...settings, footer: e.target.value})}
                    rows="2"
                    placeholder="Enter thank you message..."
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Typo Config */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2">Font Style</label>
                  <select 
                    value={settings.fontFamily}
                    onChange={e => setSettings({...settings, fontFamily: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="sans-serif">Modern Sans</option>
                    <option value="mono">Classic Thermal (Mono)</option>
                    <option value="serif">Elegant Serif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2">Scale</label>
                  <select 
                    value={settings.fontSize}
                    onChange={e => setSettings({...settings, fontSize: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="xs">Compact</option>
                    <option value="sm">Standard</option>
                    <option value="md">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95"
            >
              {saved ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Save className="w-5 h-5" />}
              {saved ? "Saved to Profile" : "Sync Receipt Settings"}
            </button>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-5">
           <div className="sticky top-8 space-y-6">
             <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl">
               <div className="flex items-center justify-between px-6 py-4 text-white/50 border-b border-white/10 mb-4">
                 <span className="text-[10px] font-black uppercase tracking-widest">Live Preview</span>
                 <div className="flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                   <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                 </div>
               </div>

               <div className="p-4">
                 <div 
                    className={`bg-white rounded-2xl p-8 shadow-inner min-h-[400px] flex flex-col text-slate-900 transition-all duration-300 ${settings.fontFamily === 'mono' ? 'font-mono' : settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'} ${settings.fontSize === 'xs' ? 'text-xs' : settings.fontSize === 'md' ? 'text-base' : 'text-sm'}`}
                    style={{ filter: 'grayscale(1)' }}
                 >
                   {/* Receipt Content */}
                   <div className="text-center space-y-4 mb-8">
                     {settings.showLogo && (
                       <img src={tenant?.logo} className="w-12 h-12 mx-auto rounded-full object-cover grayscale opacity-80" alt="logo" />
                     )}
                     <div>
                       <h4 className="font-black text-lg uppercase tracking-tight">{tenant?.name}</h4>
                       {settings.showAddress && (
                         <p className="opacity-60 text-[10px] uppercase">{tenant?.outlets[0]?.name || 'Flagship Store'}<br/>123 Business Avenue, Tech City</p>
                       )}
                       {settings.showPhone && (
                         <p className="opacity-60 text-[10px] tracking-widest">+1 (555) 000-1234</p>
                       )}
                     </div>
                   </div>

                   <hr className="border-t border-dashed border-slate-300 mb-6" />

                   <div className="space-y-3 mb-8">
                      <p className="text-[10px] font-bold opacity-60 text-center mb-4">{settings.header}</p>
                      <div className="flex justify-between font-bold">
                        <span>1 &times; Sample Product</span>
                        <span>$120.00</span>
                      </div>
                      <div className="flex justify-between opacity-60">
                        <span>Tax (10%)</span>
                        <span>$12.00</span>
                      </div>
                      <div className="flex justify-between font-black text-lg border-t border-slate-200 pt-3 mt-3">
                        <span>TOTAL</span>
                        <span>$132.00</span>
                      </div>
                   </div>

                   <div className="mt-auto text-center space-y-4">
                     <div className="flex justify-center gap-1 opacity-20">
                       {[...Array(20)].map((_, i) => <div key={i} className="w-2 h-1 bg-slate-900 rounded-full"></div>)}
                     </div>
                     <p className="text-[10px] font-bold opacity-60 px-4">{settings.footer}</p>
                     <div className="pt-4">
                        <div className="w-32 h-8 bg-slate-100 mx-auto rounded flex items-center justify-center opacity-40">
                          <div className="w-24 h-0.5 bg-slate-300"></div>
                        </div>
                        <p className="text-[8px] font-black mt-2 opacity-30 uppercase tracking-[0.3em]">#9823-4421-9980</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-indigo-600/5 border border-indigo-100 rounded-3xl p-6">
                <h4 className="text-indigo-600 font-bold flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-indigo-600/70 text-sm leading-relaxed">
                  Use the <b>Mono</b> font for a classic thermal paper look. This ensures compatibility with legacy printers while maintaining a clean aesthetic.
                </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
