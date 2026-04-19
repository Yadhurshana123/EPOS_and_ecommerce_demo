import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Globe, ShoppingBag, Eye, Settings2, 
  ExternalLink, Power, Package, Truck,
  CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EcommerceControl() {
  const { user } = useAuth();
  const { tenants, updateTenant, products } = useSaaS();
  const tenant = tenants.find(t => t.id === user.tenantId);
  
  const [isStoreActive, setIsStoreActive] = useState(tenant?.features?.ecommerce || false);

  const toggleStore = () => {
    const newState = !isStoreActive;
    setIsStoreActive(newState);
    updateTenant(user.tenantId, { 
      features: { ...tenant.features, ecommerce: newState } 
    });
  };

  const tenantProducts = products.filter(p => p.tenantId === user.tenantId);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ecommerce Hub</h1>
          <p className="text-slate-500 font-medium">Control your online storefront and digital sales.</p>
        </div>
        <div className="flex gap-3">
          <a 
            href={`/shop/${user.tenantId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Eye className="w-5 h-5" /> Preview Shop
          </a>
          <button 
            onClick={toggleStore}
            className={`px-8 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg ${
              isStoreActive 
              ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            <Power className="w-5 h-5" />
            {isStoreActive ? 'Disable Store' : 'Enable Store'}
          </button>
        </div>
      </div>

      {!isStoreActive ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-[2.5rem] p-16 text-center">
           <div className="w-20 h-20 bg-white rounded-3xl shadow-xl mx-auto flex items-center justify-center mb-6">
              <Power className="w-10 h-10 text-slate-300" />
           </div>
           <h2 className="text-2xl font-black text-slate-900 mb-2">Your Store is Currently Offline</h2>
           <p className="text-slate-500 max-w-md mx-auto font-medium">Customers cannot view products or place orders. Enable it above to start selling online.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              {/* Online Orders */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                       <Truck className="w-6 h-6 text-indigo-500" /> Pending Online Orders
                    </h3>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full">3 New</span>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {[
                      { id: 'WEB-1024', customer: 'David Chen', items: 2, total: '$145.00', time: '12 mins ago', status: 'Pending' },
                      { id: 'WEB-1023', customer: 'Maria Garcia', items: 1, total: '$89.00', time: '45 mins ago', status: 'Processing' },
                    ].map((order) => (
                      <div key={order.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                         <div className="flex gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                               <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="font-bold text-slate-900">{order.id}</p>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{order.customer} &bull; {order.items} Items</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                               <p className="font-black text-slate-900">{order.total}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase">{order.time}</p>
                            </div>
                            <button className="p-2 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Product Visibility */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50">
                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                       <Package className="w-6 h-6 text-indigo-500" /> Storefront visibility
                    </h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                          <tr>
                             <th className="px-8 py-4">Product</th>
                             <th className="px-8 py-4">Stock Status</th>
                             <th className="px-8 py-4 text-right">Visibility</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {tenantProducts.slice(0, 4).map((p) => (
                            <tr key={p.id}>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                     <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                                     <span className="font-bold text-slate-800 text-sm">{p.name}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <span className="text-xs font-bold text-emerald-600">In Stock</span>
                               </td>
                               <td className="px-8 py-5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                     <span className="text-[10px] font-black uppercase text-slate-400">Public</span>
                                     <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                     </div>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                 <Globe className="w-8 h-8 text-indigo-200 mb-6 relative z-10" />
                 <h3 className="text-xl font-black mb-2 relative z-10">Domain Status</h3>
                 <p className="text-indigo-100 text-sm mb-6 opacity-80 relative z-10 leading-relaxed">
                   Your shop is currently published at your default sub-domain.
                 </p>
                 <div className="p-4 bg-white/10 border border-white/20 rounded-2xl mb-6 relative z-10">
                    <p className="text-[10px] uppercase font-black tracking-widest text-indigo-200 mb-1">Current URL</p>
                    <p className="font-bold text-sm truncate">nexus.com/shop/{user.tenantId}</p>
                 </div>
                 <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:shadow-xl transition-all relative z-10">
                    Connect Custom Domain <ExternalLink className="w-4 h-4" />
                 </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-indigo-500" /> Quick Config
                 </h3>
                 <div className="space-y-4">
                    {[
                      { l: 'Allow Guest Checkout', v: true },
                      { l: 'Apply Digital Tax', v: true },
                      { l: 'Show Out of Stock', v: false },
                    ].map((cfg) => (
                      <div key={cfg.l} className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">{cfg.l}</span>
                         <div className={`w-10 h-5 ${cfg.v ? 'bg-indigo-600' : 'bg-slate-200'} rounded-full relative cursor-pointer transition-colors`}>
                            <div className={`absolute ${cfg.v ? 'right-0.5' : 'left-0.5'} top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all`}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

