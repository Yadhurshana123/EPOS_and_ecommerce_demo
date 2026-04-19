import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Edit2, Trash2, Tag, Box, DollarSign, Filter, Sparkles, X } from 'lucide-react';
import AIOnboarding from '../../components/AIOnboarding';

export default function Products() {
  const { user } = useAuth();
  const { products, deleteProduct, updateProduct } = useSaaS();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingAI, setIsAddingAI] = useState(false);
  
  const tenantProducts = products.filter(p => p.tenantId === user.tenantId);
  const filteredProducts = tenantProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 font-medium">Manage your products, pricing, and categories.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAddingAI(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {isAddingAI ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 relative">
          <button onClick={() => setIsAddingAI(false)} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
          <AIOnboarding onComplete={() => setIsAddingAI(false)} />
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products by name or SKU..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700 placeholder-slate-400"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Product</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Category</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Price</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Stock</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.length > 0 ? filteredProducts.map(product => {
                  const totalStock = Object.values(product.stock || {}).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden bg-white">
                            <img src={product.image || 'https://via.placeholder.com/48'} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{product.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.sku || `SKU-${product.id}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                          <Tag className="w-3 h-3" /> {product.category || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-black text-slate-900">${parseFloat(product.price).toFixed(2)}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${totalStock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          <Box className="w-3 h-3" /> {totalStock} in stock
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">No products found. Start by adding one with AI!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
