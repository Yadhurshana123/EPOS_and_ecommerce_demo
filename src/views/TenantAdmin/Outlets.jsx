import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Store, MapPin, Plus, Edit3, 
  Trash2, Search, Phone, Mail, X, Check 
} from 'lucide-react';

export default function Outlets() {
  const { user } = useAuth();
  const { tenants, updateTenant } = useSaaS();
  const tenant = tenants.find(t => t.id === user.tenantId);
  const [outlets, setOutlets] = useState(tenant?.outlets || []);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '' });

  const openModal = (outlet = null) => {
    if (outlet) {
      setEditingOutlet(outlet);
      setFormData({ name: outlet.name, location: outlet.location });
    } else {
      setEditingOutlet(null);
      setFormData({ name: '', location: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let nextOutlets;
    if (editingOutlet) {
      nextOutlets = outlets.map(o => o.id === editingOutlet.id ? { ...o, ...formData } : o);
    } else {
      nextOutlets = [...outlets, { id: `o${Date.now()}`, ...formData }];
    }
    setOutlets(nextOutlets);
    updateTenant(user.tenantId, { outlets: nextOutlets });
    setIsModalOpen(false);
  };

  const deleteOutlet = (id) => {
    const nextOutlets = outlets.filter(o => o.id !== id);
    setOutlets(nextOutlets);
    updateTenant(user.tenantId, { outlets: nextOutlets });
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Location Management</h1>
          <p className="text-slate-500 font-medium">Manage your physical and digital store locations.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" /> Add Outlet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {outlets.map((outlet) => (
           <div key={outlet.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Store className="w-6 h-6" />
                 </div>
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(outlet)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteOutlet(outlet.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{outlet.name}</h3>
              <div className="space-y-3 mt-4">
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4" /> {outlet.location}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="w-4 h-4" /> +1 (555) 000-0000
                 </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
                 <button className="text-xs font-bold text-indigo-600">Site Settings &rarr;</button>
              </div>
           </div>
         ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                {editingOutlet ? 'Edit Outlet' : 'New Outlet'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors"
               >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Outlet Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="E.g., Downtown Branch"
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</label>
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="E.g., New York, NY"
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  <Check className="w-5 h-5" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
