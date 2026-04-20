import React, { useState } from 'react';
import {
  Plus, Search, Building2, Edit3, Trash2, X, Check, Power,
  Mail, User, Shield, CreditCard, Box, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaaS } from '../../context/SaaSContext';
import TenantOnboarding from '../../components/SuperAdmin/TenantOnboarding';

// ─────────────────────────────────────────────────────────
// Main Tenants view
// ─────────────────────────────────────────────────────────
export default function Tenants() {
  const { tenants, addTenant, updateTenant, deleteTenant } = useSaaS();
  const [searchTerm, setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [editingTenant, setEditingTenant]       = useState(null);
  const [viewingTenant, setViewingTenant]       = useState(null);

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setIsOnboardingOpen(true);
  };

  const handleCreate = () => {
    setEditingTenant(null);
    setIsOnboardingOpen(true);
  };

  const toggleTenantStatus = (tenant) => {
    const next = (tenant.subscription?.status || 'Active') === 'Active' ? 'Suspended' : 'Active';
    updateTenant(tenant.id, { subscription: { ...tenant.subscription, status: next } });
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
            {/* Page header */}
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

            {/* Table card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              {/* Filters */}
              <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tenants..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 outline-none font-medium"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100/50">
                  {['All', 'Active', 'Suspended'].map(f => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
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
                      const status   = t.subscription?.status || 'Active';
                      const isActive = status === 'Active';
                      const ownerName  = t.ownerName  || 'Admin User';
                      const ownerEmail = t.ownerEmail || `hello@${t.name.replace(/\s+/g,'').toLowerCase()}.com`;

                      return (
                        <tr
                          key={t.id}
                          onClick={() => setViewingTenant(t)}
                          className={`group hover:bg-indigo-50/30 transition-colors cursor-pointer ${!isActive ? 'opacity-70' : ''}`}
                        >
                          {/* Shop */}
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center ${!isActive && 'grayscale'}`}>
                                {t.logo ? <img src={t.logo} className="w-full h-full object-cover" alt="" /> : <Building2 className="w-5 h-5 text-slate-400" />}
                              </div>
                              <span className={`font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{t.name}</span>
                            </div>
                          </td>
                          {/* Owner */}
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
                          {/* Plan */}
                          <td className="px-8 py-6">
                            <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md tracking-wider">
                              {t.subscription?.plan || 'Pro'}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {status}
                            </span>
                          </td>
                          {/* Actions — stop propagation so row click doesn't conflict */}
                          <td className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setViewingTenant(t)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" title="View details">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleTenantStatus(t)}
                                title={isActive ? 'Suspend Tenant' : 'Activate Tenant'}
                                className={`p-2 rounded-lg transition-colors ${isActive ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-50' : 'text-amber-500 bg-amber-50 hover:bg-amber-100'}`}
                              >
                                <Power className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleEdit(t)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" title="Edit">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteTenant(t.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors" title="Delete">
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

      {/* ─── Tenant Detail Drawer ─── */}
      <AnimatePresence>
        {viewingTenant && (
          <TenantDetailDrawer
            tenant={viewingTenant}
            onClose={() => setViewingTenant(null)}
            onEdit={() => { setViewingTenant(null); handleEdit(viewingTenant); }}
            onToggleStatus={() => toggleTenantStatus(viewingTenant)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tenant Detail Drawer
// Shows ALL data collected during the 9-step onboarding flow
// ─────────────────────────────────────────────────────────
function TenantDetailDrawer({ tenant, onClose, onEdit, onToggleStatus }) {
  const [activeTab, setActiveTab] = useState('business');

  const status   = tenant.subscription?.status || 'Active';
  const isActive = status === 'Active';

  const TABS = [
    { id: 'business',     label: 'Business',     icon: '🏢' },
    { id: 'subscription', label: 'Subscription',  icon: '💳' },
    { id: 'modules',      label: 'Modules',       icon: '🧩' },
    { id: 'branding',     label: 'Branding',      icon: '🎨' },
    { id: 'team',         label: 'Team & Roles',  icon: '👥' },
    { id: 'outlets',      label: 'Outlets',       icon: '🏪' },
    { id: 'access',       label: 'Admin Access',  icon: '🔐' },
  ];

  const MODULE_LABELS = {
    pos:          'POS System',
    inventory:    'Inventory',
    reports:      'Advanced Reports',
    multiOutlet:  'Multi-Outlet',
    aiOnboarding: 'AI Onboarding',
    analytics:    'Predictive Analytics',
    ecommerce:    'E-commerce',
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <motion.div
        key="drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 bottom-0 z-[60] w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* ── Drawer Header ── */}
        <div className="shrink-0 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white">
          <div className="p-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Logo / avatar */}
              <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 backdrop-blur overflow-hidden flex items-center justify-center shrink-0">
                {tenant.logo
                  ? <img src={tenant.logo} className="w-full h-full object-cover" alt="" />
                  : <Building2 className="w-7 h-7 text-white/70" />}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-black tracking-tight truncate">{tenant.name}</h2>
                <p className="text-indigo-200 text-sm font-medium mt-0.5 truncate">
                  {tenant.type || 'Business'} · {tenant.country || '—'}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${isActive ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30' : 'bg-red-400/20 text-red-200 border-red-400/30'}`}>
                    {status}
                  </span>
                  <span className="text-[10px] font-black uppercase text-indigo-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                    {tenant.subscription?.plan || 'Pro'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onEdit}
                className="px-3 py-2 text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-white transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl flex items-center justify-center text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs — scrollable on small screens */}
          <div className="px-4 pb-3 flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Drawer Body ── */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-5"
            >

              {/* ──────────── BUSINESS DETAILS ──────────── */}
              {activeTab === 'business' && (
                <>
                  <SectionTitle>Business Information</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard label="Business Name" value={tenant.name} />
                    <InfoCard label="Owner Name"    value={tenant.ownerName} />
                    <InfoCard label="Email"         value={tenant.ownerEmail} span2 />
                    <InfoCard label="Phone"         value={tenant.phone} />
                    <InfoCard label="Business Type" value={tenant.type} />
                    <InfoCard label="Country"       value={tenant.country} />
                    <InfoCard label="Currency"      value={tenant.currency} />
                    <InfoCard label="Timezone"      value={tenant.timezone} />
                    <InfoCard label="Tax Type"      value={tenant.taxType} />
                    <InfoCard label="Created"       value={tenant.createdAt} />
                    <InfoCard label="Last Updated"  value={tenant.updatedAt} />
                    <InfoCard label="Tenant ID"     value={tenant.id} mono />
                  </div>
                </>
              )}

              {/* ──────────── SUBSCRIPTION & BILLING ──────────── */}
              {activeTab === 'subscription' && (
                <>
                  <SectionTitle>Subscription & Billing</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard label="Active Plan"    value={tenant.subscription?.plan}              badge="indigo" />
                    <InfoCard label="Billing Cycle"  value={tenant.subscription?.billingCycle} />
                    <InfoCard label="Status"         value={status}                                 badge={isActive ? 'emerald' : 'red'} />
                    <InfoCard label="Max Outlets"    value={tenant.subscription?.limits?.outlets ?? '—'} />
                    <InfoCard label="Max Users"      value={tenant.subscription?.limits?.users   ?? '—'} />
                  </div>

                  {/* Status toggle */}
                  <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Account Status</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isActive ? 'Tenant has full platform access' : 'Tenant is currently suspended'}
                      </p>
                    </div>
                    <button
                      onClick={onToggleStatus}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </>
              )}

              {/* ──────────── MODULES ──────────── */}
              {activeTab === 'modules' && (
                <>
                  <SectionTitle>Enabled Modules</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(MODULE_LABELS).map(([key, label]) => {
                      const enabled = tenant.features?.[key];
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${
                            enabled ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 opacity-60'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${enabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                            {enabled ? '✓' : '✕'}
                          </div>
                          <span className={`text-sm font-bold ${enabled ? 'text-indigo-900' : 'text-slate-500'}`}>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ──────────── BRANDING ──────────── */}
              {activeTab === 'branding' && (
                <>
                  <SectionTitle>Branding & Theme</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard label="UI Theme"  value={tenant.theme?.mode} />
                    <InfoCard label="Typography" value={tenant.branding?.typography} />
                    <InfoCard label="Language"   value={tenant.branding?.language} />
                    <InfoCard label="Domain"     value={tenant.branding?.domain || 'Not set'} />
                    <InfoCard label="Ecom Theme" value={tenant.branding?.ecomTheme} />
                    <InfoCard
                      label="E-commerce"
                      value={tenant.features?.ecommerce ? 'Enabled' : 'Disabled'}
                      badge={tenant.features?.ecommerce ? 'emerald' : 'slate'}
                    />
                  </div>

                  {/* Primary color swatch */}
                  {tenant.theme?.primary && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl border-2 border-slate-200 shadow-sm shrink-0"
                        style={{ backgroundColor: tenant.theme.primary }}
                      />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Brand Color</p>
                        <p className="font-mono font-bold text-slate-800 mt-1 text-sm">{tenant.theme.primary}</p>
                      </div>
                    </div>
                  )}

                  {/* Logo */}
                  {tenant.logo && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Logo</p>
                      <img src={tenant.logo} alt="Logo" className="h-16 object-contain rounded-xl border border-slate-200 bg-white p-2" />
                    </div>
                  )}

                  {/* Website layout configs */}
                  {tenant.branding?.websiteLayout && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Website Layout Config</p>
                      <div className="space-y-2">
                        {Object.entries(tenant.branding.websiteLayout).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg capitalize">
                              {val?.replace(/-/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ──────────── TEAM & ROLES ──────────── */}
              {activeTab === 'team' && (
                <>
                  <SectionTitle>Team & Roles Configuration</SectionTitle>
                  {!tenant.team?.enabled ? (
                    <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <p className="text-4xl mb-3">🔒</p>
                      <p className="font-bold text-slate-700">Admin-Only Mode</p>
                      <p className="text-sm text-slate-500 mt-1">Only the root administrator has access to all modules.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {['manager', 'cashier'].map(role => {
                        const roleData    = tenant.team?.roles?.[role];
                        const userForRole = tenant.team?.users?.find(u => u.role === role);
                        if (!roleData?.enabled) return null;
                        return (
                          <div key={role} className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg">
                                  {role === 'manager' ? '👔' : '🛒'}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 capitalize">{role} Role</p>
                                  {userForRole && (
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {userForRole.name || '—'} · {userForRole.email || '—'}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Active</span>
                            </div>

                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Permissions</p>
                              <div className="flex flex-wrap gap-1.5">
                                {Object.entries(roleData.permissions || {}).map(([perm, allowed]) => (
                                  <span
                                    key={perm}
                                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider ${
                                      allowed ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400 line-through'
                                    }`}
                                  >
                                    {perm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* ──────────── OUTLETS ──────────── */}
              {activeTab === 'outlets' && (
                <>
                  <SectionTitle>Operating Outlets</SectionTitle>
                  {tenant.outlets && tenant.outlets.length > 0 ? (
                    <div className="space-y-3">
                      {tenant.outlets.map((o, idx) => (
                        <div
                          key={o.id || idx}
                          className="p-4 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">🏪</div>
                            <div>
                              <p className="font-bold text-slate-800">{o.name}</p>
                              <p className="text-xs text-slate-500">{o.location}</p>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{o.id}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <p className="text-4xl mb-3">🏚</p>
                      <p className="font-bold text-slate-500">No outlets registered yet</p>
                    </div>
                  )}
                </>
              )}

              {/* ──────────── ADMIN ACCESS ──────────── */}
              {activeTab === 'access' && (
                <>
                  <SectionTitle>Admin Credentials</SectionTitle>
                  {tenant.adminCredentials ? (
                    <>
                      <div className="p-6 bg-slate-900 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Credentials</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Username</p>
                          <p className="font-mono font-bold text-white text-sm bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
                            {tenant.adminCredentials.username || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Temporary Password</p>
                          <p className="font-mono font-bold text-emerald-400 text-sm bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 tracking-widest">
                            {tenant.adminCredentials.tempPassword || '—'}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <span className="text-xl shrink-0">⚠️</span>
                        <p className="text-xs font-bold text-amber-700">
                          These are one-time credentials. The tenant must change their password on first login.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <p className="text-4xl mb-3">🔑</p>
                      <p className="font-bold text-slate-500">No credentials generated</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <InfoCard label="Tenant ID" value={tenant.id} mono />
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

// ─── Shared small components ───────────────────────────────

function SectionTitle({ children }) {
  return (
    <div className="pb-2 border-b border-slate-100">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{children}</h3>
    </div>
  );
}

const BADGE_COLORS = {
  indigo:  'bg-indigo-100 text-indigo-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  red:     'bg-red-100 text-red-700',
  amber:   'bg-amber-100 text-amber-700',
  slate:   'bg-slate-100 text-slate-600',
};

function InfoCard({ label, value, span2, badge, mono }) {
  return (
    <div className={`p-4 bg-slate-50 border border-slate-100 rounded-2xl ${span2 ? 'col-span-2' : ''}`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      {badge ? (
        <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg tracking-wider ${BADGE_COLORS[badge] || BADGE_COLORS.slate}`}>
          {value || '—'}
        </span>
      ) : (
        <p className={`font-bold text-slate-800 text-sm break-all ${mono ? 'font-mono text-xs' : ''}`}>
          {value || '—'}
        </p>
      )}
    </div>
  );
}
