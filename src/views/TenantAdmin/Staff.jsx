import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, UserPlus, Shield, 
  Store, MoreVertical, Search,
  CheckCircle, X, Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Staff() {
  const { user } = useAuth();
  const { tenants } = useSaaS();

  // ✅ Scoped to this tenant only — never read other tenants' outlets
  const tenant = tenants.find(t => t.id === user.tenantId);
  const tenantOutlets = tenant?.outlets || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Cashier', outletId: tenantOutlets[0]?.id || '' });

  // Mock staff — outlet names resolved from THIS tenant's outlets only
  const [staff, setStaff] = useState(() => {
    return [
      { id: 1, name: 'John Cashier', email: 'cashier@store.com', role: 'Cashier', outletId: tenantOutlets[0]?.id || '' },
      { id: 2, name: 'Alice Manager', email: 'manager@store.com', role: 'Manager', outletId: tenantOutlets[1]?.id || tenantOutlets[0]?.id || '' },
      { id: 3, name: 'Bob Smith', email: 'bob@store.com', role: 'Cashier', outletId: tenantOutlets[0]?.id || '' },
    ];
  });

  const getOutletName = (outletId) => {
    if (!outletId) return 'Unassigned';
    const found = tenantOutlets.find(o => o.id === outletId);
    return found ? found.name : 'Unassigned';
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = (e) => {
    e.preventDefault();
    setStaff([...staff, { id: Date.now(), ...formData }]);
    setFormData({ name: '', email: '', role: 'Cashier', outletId: tenantOutlets[0]?.id || '' });
    setIsModalOpen(false);
  };

  const removeStaff = (id) => setStaff(staff.filter(s => s.id !== id));

  const roleColors = {
    'Manager': 'bg-indigo-50 text-indigo-700',
    'Cashier': 'bg-purple-50 text-purple-700',
    'Supervisor': 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-slate-500 font-medium">
            Manage <span className="font-bold text-indigo-600">{tenant?.name}</span> staff and outlet assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Isolation badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">{tenantOutlets.length} Outlet{tenantOutlets.length !== 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <UserPlus className="w-5 h-5" /> Hire Staff
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-sm"
      >
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 outline-none font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <p className="text-xs font-bold text-slate-400">{filteredStaff.length} members</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-400">
                <th className="px-8 py-5">Employee</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Assigned Outlet</th>
                <th className="px-8 py-5">Access Status</th>
                <th className="px-8 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium">
                    No staff members found.
                  </td>
                </tr>
              ) : filteredStaff.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${roleColors[s.role] || 'bg-slate-50 text-slate-600'}`}>
                      <Shield className="w-3 h-3" /> {s.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Store className="w-4 h-4 text-slate-300" />
                      {/* ✅ Resolves outlet name from this tenant's outlets only */}
                      {getOutletName(s.outletId)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => removeStaff(s.id)}
                      className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Add Staff Member</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-8 space-y-5">
              {[
                { label: 'Full Name', field: 'name', type: 'text', placeholder: 'e.g. Jane Smith' },
                { label: 'Email Address', field: 'email', type: 'email', placeholder: 'jane@email.com' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</label>
                  <input
                    type={type}
                    required
                    value={formData[field]}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700"
                >
                  <option>Cashier</option>
                  <option>Manager</option>
                  <option>Supervisor</option>
                </select>
              </div>

              {/* ✅ Outlet dropdown only shows THIS tenant's outlets */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Assign to Outlet</label>
                {tenantOutlets.length === 0 ? (
                  <p className="text-sm text-amber-600 font-medium bg-amber-50 p-3 rounded-2xl">
                    No outlets configured yet. Add outlets first.
                  </p>
                ) : (
                  <select
                    value={formData.outletId}
                    onChange={e => setFormData({ ...formData, outletId: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700"
                  >
                    {tenantOutlets.map(o => (
                      <option key={o.id} value={o.id}>{o.name} — {o.location}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tenantOutlets.length === 0}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  <Check className="w-5 h-5" /> Add Member
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
