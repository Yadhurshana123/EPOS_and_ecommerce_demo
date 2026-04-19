import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Package, Search, Filter, Plus, 
  ArrowUpRight, ArrowDownRight, MoreVertical,
  History, AlertCircle, Box, Edit3
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Inventory() {
  const { user } = useAuth();
  const { products, updateStock } = useSaaS();
  const tenantProducts = products.filter(p => p.tenantId === user.tenantId);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = tenantProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory & Stock</h1>
          <p className="text-slate-500 font-medium">Real-time tracking across all locations.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
             Scan SKU
          </button>
          <button className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all">
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <AlertCircle className="w-5 h-5" />
               </div>
               <p className="font-black text-slate-800">Low Stock Items</p>
            </div>
            <p className="text-3xl font-black text-slate-900">12</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Requires immediate attention</p>
         </div>
         <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl text-white">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Package className="w-5 h-5" />
               </div>
               <p className="font-black">Total Valuation</p>
            </div>
            <p className="text-3xl font-black">$842,200</p>
            <p className="text-xs text-indigo-100 mt-1 font-medium">+4.2% from last month</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <History className="w-5 h-5" />
               </div>
               <p className="font-black text-slate-800">Recent Movements</p>
            </div>
            <p className="text-3xl font-black text-slate-900">450+</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Items moved today</p>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter inventory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:bg-slate-100"><Filter className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <th className="px-8 py-5">Product Details</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Downtown Stock</th>
                    <th className="px-8 py-5">Westside Stock</th>
                    <th className="px-8 py-5">Total</th>
                    <th className="px-8 py-5">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {filtered.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
                                <img src={p.image} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <p className="font-black text-slate-900">{p.name}</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400">SKU: {p.id.toUpperCase()}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-600">{p.category}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <span className="font-bold text-slate-800">{p.stock.o1 || 0}</span>
                             <div className="flex gap-1">
                                <button onClick={() => updateStock(p.id, 'o1', 1)} className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">+</button>
                                <button onClick={() => updateStock(p.id, 'o1', -1)} className="w-6 h-6 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">-</button>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="font-bold text-slate-800">{p.stock.o2 || 0}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="font-black text-slate-900">{(p.stock.o1 || 0) + (p.stock.o2 || 0) + (p.stock.o3 || 0)}</span>
                       </td>
                       <td className="px-8 py-6">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-all"><Edit3 className="w-4 h-4 text-slate-400" /></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
