import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, User, Mail, Phone, ShoppingBag, Globe, Clock, Landmark, 
  ChevronRight, ChevronLeft, CreditCard, Check, Shield, Box, Sparkles,
  Layout, Palette, Type, Image as ImageIcon, Smartphone, Monitor,
  MapPin, Plus, Trash2, Lock, Eye, ArrowRight, Rocket, RefreshCw,
  LayoutDashboard, ShoppingCart, BarChart3, Store, Search, ExternalLink,
  Printer, Scan, Coins, Tablet, Network, Tv
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

const STEPS = [
  { id: 1, title: 'Business Details', icon: Building2 },
  { id: 2, title: 'Subscription', icon: CreditCard },
  { id: 3, title: 'Modules', icon: Box },
  { id: 4, title: 'Team & Roles', icon: User },
  { id: 5, title: 'Branding', icon: Palette },
  { id: 6, title: 'Secure Access', icon: Lock },
  { id: 7, title: 'Review', icon: Eye },
  { id: 8, title: 'Create', icon: Rocket },
  { id: 9, title: 'Success', icon: Check },
];



const MODULES = [
  { id: 'pos', name: 'POS System', icon: ShoppingCart, description: 'Direct sales & till management', minPlan: 'basic' },
  { id: 'inventory', name: 'Inventory', icon: Box, description: 'Stock tracking & PO management', minPlan: 'basic' },
  { id: 'reports', name: 'Advanced Reports', icon: BarChart3, description: 'Visual data analytics', minPlan: 'pro' },
  { id: 'multiOutlet', name: 'Multi-Outlet', icon: Store, description: 'Manage multiple physical shops', minPlan: 'pro' },
  { id: 'aiOnboarding', name: 'AI Onboarding', icon: Sparkles, description: 'Automated catalog creation', minPlan: 'pro' },
  { id: 'analytics', name: 'Predictive Analytics', icon: BarChart3, description: 'AI sales forecasting', minPlan: 'enterprise' },
];

const ECOM_THEMES = [
  { id: 'modern', name: 'Modern Store', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400', description: 'Clean lines and bold imagery' },
  { id: 'minimal', name: 'Minimal Store', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', description: 'Focus on product simplicity' },
  { id: 'fashion', name: 'Fashion Store', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', description: 'Elegant catalog layout' },
  { id: 'electronics', name: 'Electronics Store', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', description: 'Grid-based technical layout' },
];

export default function TenantOnboarding({ onClose, onComplete, editTenant }) {
  const { addTenant, updateTenant, plans } = useSaaS();
  const [currentStep, setCurrentStep] = useState(1);
  const [isYearly, setIsYearly] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  
  const [formData, setFormData] = useState(() => {
    if (editTenant) {
      return {
        business: {
          name: editTenant.name || '',
          ownerName: editTenant.ownerName || '',
          email: editTenant.ownerEmail || '',
          phone: editTenant.phone || '',
          type: editTenant.type || 'Shoe Store',
          country: editTenant.country || 'United States',
          currency: editTenant.currency || 'USD',
          timezone: editTenant.timezone || 'UTC',
          taxType: editTenant.taxType || 'VAT'
        },
        subscription: {
          planId: plans.find(p => p.name === editTenant.subscription?.plan)?.id || 'pro',
          billingCycle: editTenant.subscription?.billingCycle?.toLowerCase() || 'monthly'
        },
        modules: editTenant.features || {
          pos: true,
          inventory: true,
          reports: true,
          multiOutlet: true,
          aiOnboarding: true,
          analytics: false
        },
        branding: {
          theme: editTenant.theme?.mode || 'light',
          primaryColor: editTenant.theme?.primary || '#4f46e5',
          typography: editTenant.branding?.typography || 'Inter',
          logo: editTenant.logo || '',
          ecomEnabled: editTenant.features?.ecommerce || false,
          ecomTheme: editTenant.branding?.ecomTheme || 'modern',
          domain: editTenant.branding?.domain || '',
          language: editTenant.branding?.language || 'English',
          websiteLayout: editTenant.branding?.websiteLayout || {
            homepage: 'hero-grid',
            productPage: 'split-view',
            categoryLayout: 'sidebar-grid'
          }
        },
        outlets: editTenant.outlets || [
          { id: Date.now(), name: 'Main Street Outlet', location: 'Downtown' }
        ],
        team: editTenant.team || {
          enabled: false,
          roles: {
            manager: { enabled: true, permissions: { pos: true, inventory: true, reports: true, till: true, settings: false, billing: false } },
            cashier: { enabled: true, permissions: { pos: true, inventory: false, reports: false, till: true, settings: false, billing: false } }
          },
          users: []
        },
        admin: {
          username: editTenant.adminCredentials?.username || '',
          password: editTenant.adminCredentials?.tempPassword || '',
          generated: !!editTenant.adminCredentials?.username
        }
      };
    }
    return {
      business: {
        name: '',
        ownerName: '',
        email: '',
        phone: '',
        type: 'Shoe Store',
        country: 'United States',
        currency: 'USD',
        timezone: 'UTC',
        taxType: 'VAT'
      },
      subscription: {
        planId: 'pro',
        billingCycle: 'monthly'
      },
      modules: {
        pos: true,
        inventory: true,
        reports: true,
        multiOutlet: true,
        aiOnboarding: true,
        analytics: false
      },
      branding: {
        theme: 'light',
        primaryColor: '#4f46e5',
        typography: 'Inter',
        logo: '',
        ecomEnabled: true,
        ecomTheme: 'modern',
        domain: '',
        language: 'English',
        websiteLayout: {
          homepage: 'hero-grid',
          productPage: 'split-view',
          categoryLayout: 'sidebar-grid'
        }
      },
      outlets: [
        { id: Date.now(), name: 'Main Street Outlet', location: 'Downtown' }
      ],
      team: {
        enabled: false,
        roles: {
          manager: { enabled: true, permissions: { pos: true, inventory: true, reports: true, till: true, settings: false, billing: false } },
          cashier: { enabled: true, permissions: { pos: true, inventory: false, reports: false, till: true, settings: false, billing: false } }
        },
        users: []
      },
      admin: {
        username: '',
        password: '',
        generated: false
      }
    };
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    editTenant ? 'Reconfiguring cloud environment...' : 'Setting up database isolation...',
    editTenant ? 'Syncing storage assets...' : 'Configuring secure cloud storage...',
    editTenant ? 'Updating module permissions...' : 'Initializing module permissions...',
    editTenant ? 'Updating branding profile...' : 'Tailoring branding assets...',
    editTenant ? 'Reloading dashboard...' : 'Preparing your dashboard...',
    editTenant ? 'Finalizing modifications...' : 'Finalizing tenant environment...'
  ];

  // Auto-generate credentials when reaching step 6 (Secure Access) if they don't exist
  useEffect(() => {
    if (currentStep === 6 && !formData.admin.generated) {
      const generatedUsername = formData.business.email.split('@')[0] + '_admin';
      const generatedPassword = 'NX-' + Math.random().toString(36).slice(-8).toUpperCase();
      setFormData(prev => ({
        ...prev,
        admin: {
          username: generatedUsername,
          password: generatedPassword,
          generated: true
        }
      }));
    }
  }, [currentStep, formData.business.email, formData.admin.generated]);

  const handleNext = () => {
    if (currentStep < 9) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const finalizeCreation = async () => {
    setLoading(true);
    for (let i = 0; i < loadingMessages.length; i++) {
      setLoadingStep(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    const tenantData = {
      name: formData.business.name,
      logo: formData.branding.logo,
      ownerName: formData.business.ownerName,
      ownerEmail: formData.business.email,
      phone: formData.business.phone,
      type: formData.business.type,
      country: formData.business.country,
      currency: formData.business.currency,
      timezone: formData.business.timezone,
      taxType: formData.business.taxType,
      theme: { primary: formData.branding.primaryColor, mode: formData.branding.theme },
      branding: {
        typography: formData.branding.typography,
        ecomTheme: formData.branding.ecomTheme,
        domain: formData.branding.domain,
        language: formData.branding.language,
        websiteLayout: formData.branding.websiteLayout
      },
      features: formData.modules,
      subscription: { 
        plan: plans.find(p => p.id === formData.subscription.planId)?.name || 'Pro',
        status: editTenant?.subscription?.status || 'Active',
        billingCycle: isYearly ? 'Yearly' : 'Monthly'
      },
      outlets: formData.outlets,
      team: formData.team,
      adminCredentials: { username: formData.admin.username, tempPassword: formData.admin.password },
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    if (editTenant) {
      updateTenant(editTenant.id, tenantData);
    } else {
      addTenant({ ...tenantData, createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
    }

    setLoading(false);
    setCurrentStep(9);
  };

  const renderProgress = () => (
    <div className="w-full flex items-center justify-between mb-12 px-2">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-500 text-white' : 
                  isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 
                  'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`absolute -bottom-7 text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`}>
                {step.title}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-slate-100 relative">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  className="absolute inset-0 bg-emerald-500"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" /> Business Name
          </label>
          <input 
            type="text" 
            placeholder="e.g. Nexus Retail"
            value={formData.business.name}
            onChange={(e) => setFormData({...formData, business: {...formData.business, name: e.target.value}})}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" /> Owner Name
          </label>
          <input 
            type="text" 
            placeholder="John Doe"
            value={formData.business.ownerName}
            onChange={(e) => setFormData({...formData, business: {...formData.business, ownerName: e.target.value}})}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" /> Business Email
          </label>
          <input 
            type="email" 
            placeholder="hello@nexus.com"
            value={formData.business.email}
            onChange={(e) => setFormData({...formData, business: {...formData.business, email: e.target.value}})}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" /> Phone Number
          </label>
          <input 
            type="tel" 
            placeholder="+1 (555) 000-0000"
            value={formData.business.phone}
            onChange={(e) => setFormData({...formData, business: {...formData.business, phone: e.target.value}})}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-slate-400" /> Business Type
          </label>
          <select 
            value={formData.business.type}
            onChange={(e) => setFormData({...formData, business: {...formData.business, type: e.target.value}})}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
          >
            <option>Shoe Store</option>
            <option>Grocery</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Restaurant</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" /> Country
          </label>
          <select 
            value={formData.business.country}
            onChange={(e) => setFormData({...formData, business: {...formData.business, country: e.target.value}})}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
          >
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Canada</option>
            <option>Australia</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4 col-span-1 md:col-span-2">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Currency</label>
            <select 
              value={formData.business.currency}
              onChange={(e) => setFormData({...formData, business: {...formData.business, currency: e.target.value}})}
              className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-xs"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Timezone</label>
            <select 
              value={formData.business.timezone}
              onChange={(e) => setFormData({...formData, business: {...formData.business, timezone: e.target.value}})}
              className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-xs"
            >
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Tax Type</label>
            <select 
              value={formData.business.taxType}
              onChange={(e) => setFormData({...formData, business: {...formData.business, taxType: e.target.value}})}
              className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-xs"
            >
              <option>VAT</option>
              <option>GST</option>
              <option>Sales Tax</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-inner">
          <button 
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${!isYearly ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isYearly ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Yearly <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md text-[10px]">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div 
            key={plan.id}
            onClick={() => setFormData({...formData, subscription: { ...formData.subscription, planId: plan.id }})}
            className={`relative cursor-pointer group p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col h-full ${
              formData.subscription.planId === plan.id 
                ? `border-${plan.color}-600 bg-${plan.color}-50 ring-4 ring-${plan.color}-500/10` 
                : 'border-slate-100 bg-white hover:border-slate-300'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Recommended
              </div>
            )}
            <div className="mb-6">
              <h3 className={`text-xl font-black mb-1 ${formData.subscription.planId === plan.id ? `text-${plan.color}-900` : 'text-slate-900'}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">${isYearly ? plan.price.yearly : plan.price.monthly}</span>
                <span className="text-sm font-bold text-slate-500">/{isYearly ? 'yr' : 'mo'}</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-2 flex-1">
              {Array.isArray(plan.features) && plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${formData.subscription.planId === plan.id ? `bg-${plan.color}-200 text-${plan.color}-700` : 'bg-slate-100 text-slate-400'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
            
            {plan.hardware && Array.isArray(plan.hardware) && (
              <div className={`mb-6 p-5 rounded-3xl bg-white/60 border border-${plan.color}-100/50 shadow-sm backdrop-blur-sm`}>
                <p className={`text-[10px] font-black uppercase tracking-widest text-${plan.color}-600 mb-4 flex items-center gap-2`}>
                  <Box className="w-3.5 h-3.5" /> Hardware Bundle
                </p>
                <div className="space-y-3">
                  {plan.hardware.map((hw, i) => {
                    const HWIcon = { 
                      Smartphone, Monitor, Printer, Scan, 
                      Coins, Tablet, Network, Tv 
                    }[hw.icon] || Box;
                    
                    return (
                      <div key={i} className="flex items-start gap-3 group/hw">
                        <div className={`mt-0.5 w-7 h-7 rounded-lg bg-${plan.color}-100/50 flex items-center justify-center shrink-0 text-${plan.color}-600 group-hover/hw:bg-${plan.color}-600 group-hover/hw:text-white transition-all duration-300`}>
                          <HWIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-800 leading-tight">
                            {hw.name}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500/80 leading-tight">
                            {hw.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={`w-full py-4 rounded-2xl flex items-center justify-center font-bold transition-all ${
              formData.subscription.planId === plan.id 
                ? `bg-${plan.color}-600 text-white shadow-lg shadow-${plan.color}-200` 
                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
            }`}>
              {formData.subscription.planId === plan.id ? 'Selected' : 'Select Plan'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedPlan = plans.find(p => p.id === formData.subscription.planId) || plans[1]; // fallback to Pro
    
    const isLocked = (module) => {
      const planHierarchy = { 'basic': 0, 'pro': 1, 'enterprise': 2 };
      const planId = selectedPlan.id;
      return planHierarchy[module.minPlan] > planHierarchy[planId];
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(module => {
            const Icon = module.icon;
            const locked = isLocked(module);
            const enabled = formData.modules[module.id];

            return (
              <div 
                key={module.id}
                onClick={() => {
                  if (!locked) {
                    setFormData({...formData, modules: {...formData.modules, [module.id]: !enabled}});
                  }
                }}
                className={`relative p-6 rounded-3xl border-2 transition-all duration-300 ${
                  locked ? 'bg-slate-50/50 border-slate-100 opacity-60 cursor-not-allowed' :
                  enabled ? 'bg-indigo-50 border-indigo-600 ring-4 ring-indigo-500/5 cursor-pointer' :
                  'bg-white border-slate-100 hover:border-slate-200 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${enabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {locked ? (
                    <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <Lock className="w-3 h-3" /> Upgrade
                    </span>
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      enabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 bg-white'
                    }`}>
                      {enabled && <Check className="w-4 h-4" />}
                    </div>
                  )}
                </div>
                <h4 className={`text-base font-black mb-1 ${enabled ? 'text-indigo-900' : 'text-slate-900'}`}>{module.name}</h4>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">{module.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const handleRoleToggle = (role) => {
      setFormData(prev => ({
        ...prev,
        team: {
          ...prev.team,
          roles: {
            ...prev.team.roles,
            [role]: { ...prev.team.roles[role], enabled: !prev.team.roles[role].enabled }
          }
        }
      }));
    };

    const handlePermissionToggle = (role, permission) => {
      // Logic for locked permissions
      const isLocked = (r, p) => {
        if (r === 'cashier' && (p === 'settings' || p === 'billing' || p === 'reports')) return true;
        return false;
      };
      
      if (isLocked(role, permission)) return;

      setFormData(prev => ({
        ...prev,
        team: {
          ...prev.team,
          roles: {
            ...prev.team.roles,
            [role]: { 
              ...prev.team.roles[role], 
              permissions: { ...prev.team.roles[role].permissions, [permission]: !prev.team.roles[role].permissions[permission] } 
            }
          }
        }
      }));
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
          <div>
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <User className="w-8 h-8" /> Scalable Team Access
            </h3>
            <p className="text-indigo-100 font-medium mt-1">Configure who gets access to what in your storefront.</p>
          </div>
          <button 
            onClick={() => setFormData({...formData, team: {...formData.team, enabled: !formData.team.enabled}})}
            className={`w-16 h-8 rounded-full transition-all flex items-center px-1 ${formData.team.enabled ? 'bg-white' : 'bg-indigo-400'}`}
          >
             <div className={`w-6 h-6 rounded-full transition-all ${formData.team.enabled ? 'translate-x-8 bg-indigo-600' : 'translate-x-0 bg-white'}`} />
          </button>
        </div>

        {!formData.team.enabled ? (
           <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Admin-Only Mode</h4>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">Only the root administrator account will have access to all modules and settings.</p>
              </div>
              <button 
                onClick={() => setFormData({...formData, team: {...formData.team, enabled: true}})}
                className="text-indigo-600 font-black uppercase text-xs tracking-widest hover:text-indigo-700 underline"
              >
                Enable Multi-User Workspace
              </button>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="space-y-4">
                  {['manager', 'cashier'].map(role => (
                    <div key={role} className={`group bg-white rounded-[2rem] border-2 transition-all p-8 ${formData.team.roles[role].enabled ? 'border-indigo-600 shadow-xl shadow-indigo-50' : 'border-slate-100'}`}>
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${formData.team.roles[role].enabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {role === 'manager' ? <LayoutDashboard className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-lg font-black text-slate-900 capitalize">{role} Account</h4>
                                  {role === 'manager' && <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Recommended</span>}
                                </div>
                                <p className="text-sm font-medium text-slate-500">{role === 'manager' ? 'Full operational control over store' : 'Focused on sales & customer transactions'}</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => handleRoleToggle(role)}
                            className={`w-12 h-6 rounded-full transition-all flex items-center px-0.5 ${formData.team.roles[role].enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                          >
                             <div className={`w-5 h-5 rounded-full transition-all bg-white ${formData.team.roles[role].enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>

                       {formData.team.roles[role].enabled && (
                         <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {['pos', 'inventory', 'reports', 'till', 'settings', 'billing'].map(pref => {
                                 const isLocked = (r, p) => (r === 'cashier' && (p === 'settings' || p === 'billing' || p === 'reports'));
                                 const locked = isLocked(role, pref);
                                 const enabled = formData.team.roles[role].permissions[pref];
                                 
                                 return (
                                   <button
                                     key={pref}
                                     onClick={() => handlePermissionToggle(role, pref)}
                                     disabled={locked}
                                     className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                       locked ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' :
                                       enabled ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' :
                                       'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                                     }`}
                                   >
                                      <span className="text-[10px] font-black uppercase tracking-widest capitalize">{pref}</span>
                                      {locked ? <Lock className="w-3 h-3 text-slate-300" /> : <Check className={`w-3 h-3 ${enabled ? 'text-indigo-600' : 'text-slate-200'}`} />}
                                   </button>
                                 )
                              })}
                           </div>

                           <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                              <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Register Primary {role}</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 ml-1">Full Name</label>
                                    <input 
                                      type="text" 
                                      placeholder={`E.g., Alex the ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                                      value={formData.team.users.find(u => u.role === role)?.name || ''}
                                      onChange={(e) => {
                                        const otherUsers = formData.team.users.filter(u => u.role !== role);
                                        setFormData({...formData, team: {...formData.team, users: [...otherUsers, { role, name: e.target.value, email: formData.team.users.find(u => u.role === role)?.email || '' }]}});
                                      }}
                                      className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold text-xs outline-none focus:border-indigo-500 transition-all" 
                                    />
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 ml-1">Business Email</label>
                                    <input 
                                      type="email" 
                                      placeholder="team@nexus.com"
                                      value={formData.team.users.find(u => u.role === role)?.email || ''}
                                      onChange={(e) => {
                                        const otherUsers = formData.team.users.filter(u => u.role !== role);
                                        setFormData({...formData, team: {...formData.team, users: [...otherUsers, { role, name: formData.team.users.find(u => u.role === role)?.name || '', email: e.target.value }]}});
                                      }}
                                      className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold text-xs outline-none focus:border-indigo-500 transition-all" 
                                    />
                                 </div>
                              </div>
                              <p className="text-[9px] font-bold text-slate-400">* Temporary credentials will be sent to this email automatically.</p>
                           </div>
                         </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
               <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-6 border-b border-white/5 pb-2">Access Preview</h4>
                  <div className="space-y-6">
                     {['manager', 'cashier'].filter(r => formData.team.roles[r].enabled).map(r => (
                       <div key={r} className="space-y-2">
                          <p className="text-xs font-black capitalize text-indigo-400">{r} Preview</p>
                          <div className="flex flex-wrap gap-1.5">
                             {Object.entries(formData.team.roles[r].permissions)
                               .filter(([_, allowed]) => allowed)
                               .map(([p]) => (
                                 <span key={p} className="bg-white/10 text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-tighter capitalize">{p}</span>
                               ))}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100">
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-4">Pro Tip 💡</h4>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                    You can finalize user specific account details (name, email, unique login) in the next step or directly after setup in the management pane.
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full min-h-[600px]">
      {/* Left: Settings Panel */}
      <div className="lg:col-span-5 space-y-8 overflow-y-auto pr-4 max-h-[70vh]">
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Basic Store Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Store Name</label>
              <input 
                type="text" 
                value={formData.business.name}
                onChange={(e) => setFormData({...formData, business: {...formData.business, name: e.target.value}})}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Domain (Optional)</label>
              <input 
                type="text" 
                placeholder="store.nexus.com"
                value={formData.branding.domain}
                onChange={(e) => setFormData({...formData, branding: {...formData.branding, domain: e.target.value}})}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Currency Display</label>
              <select 
                value={formData.business.currency}
                onChange={(e) => setFormData({...formData, business: {...formData.business, currency: e.target.value}})}
                className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-sm"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Language</label>
              <select 
                value={formData.branding.language}
                onChange={(e) => setFormData({...formData, branding: {...formData.branding, language: e.target.value}})}
                className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-sm"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Core UI Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {['light', 'dark', 'custom'].map(t => (
              <button 
                key={t}
                onClick={() => setFormData({...formData, branding: {...formData.branding, theme: t}})}
                className={`py-3 rounded-2xl border-2 font-bold capitalize transition-all ${
                  formData.branding.theme === t ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Brand Identity</h3>
          <div className="flex items-center gap-6">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-slate-500">Primary Color</label>
              <div className="flex gap-3">
                <input 
                  type="color" 
                  value={formData.branding.primaryColor}
                  onChange={(e) => setFormData({...formData, branding: {...formData.branding, primaryColor: e.target.value}})}
                  className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 overflow-hidden"
                />
                <input 
                  type="text" 
                  value={formData.branding.primaryColor}
                  onChange={(e) => setFormData({...formData, branding: {...formData.branding, primaryColor: e.target.value}})}
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 font-mono font-bold text-sm"
                />
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-slate-500">Typography</label>
              <select 
                value={formData.branding.typography}
                onChange={(e) => setFormData({...formData, branding: {...formData.branding, typography: e.target.value}})}
                className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-sm"
              >
                <option>Inter</option>
                <option>Outfit</option>
                <option>Roboto</option>
                <option>DM Sans</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500">Logo Upload (URL)</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="https://your-brand.com/logo.png"
              value={formData.branding.logo}
              onChange={(e) => setFormData({...formData, branding: {...formData.branding, logo: e.target.value}})}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm">
              <ImageIcon className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-700">Enable Ecommerce Theme</span>
          </div>
          <button 
            onClick={() => setFormData({...formData, branding: {...formData.branding, ecomEnabled: !formData.branding.ecomEnabled}})}
            className={`w-12 h-6 rounded-full transition-all relative ${formData.branding.ecomEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.branding.ecomEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        {formData.branding.ecomEnabled && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Select Template</h3>
            <div className="grid grid-cols-2 gap-4">
              {ECOM_THEMES.map(theme => (
                <div 
                  key={theme.id}
                  onClick={() => setFormData({...formData, branding: {...formData.branding, ecomTheme: theme.id}})}
                  className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    formData.branding.ecomTheme === theme.id ? 'border-indigo-600 ring-4 ring-indigo-500/5' : 'border-slate-100'
                  }`}
                >
                  <img src={theme.image} className="w-full h-24 object-cover" />
                  <div className="p-3 bg-white">
                    <p className={`text-xs font-black ${formData.branding.ecomTheme === theme.id ? 'text-indigo-600' : 'text-slate-800'}`}>{theme.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{theme.description}</p>
                  </div>
                  {formData.branding.ecomTheme === theme.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Layout Configurations</h3>
               {[
                 { label: 'Homepage Style', key: 'homepage', options: ['hero-grid', 'minimal-list', 'full-banner'] },
                 { label: 'Product Page', key: 'productPage', options: ['split-view', 'stacked', 'compact'] },
                 { label: 'Category View', key: 'categoryLayout', options: ['sidebar-grid', 'top-filters', 'express-list'] }
               ].map(cfg => (
                 <div key={cfg.key} className="space-y-1.5 text-xs">
                   <label className="font-bold text-slate-500 ml-1">{cfg.label}</label>
                   <select 
                     value={formData.branding.websiteLayout[cfg.key]}
                     onChange={(e) => setFormData({...formData, branding: {...formData.branding, websiteLayout: {...formData.branding.websiteLayout, [cfg.key]: e.target.value}}})}
                     className="w-full bg-slate-100 border-none rounded-xl p-3 font-bold capitalize"
                   >
                     {cfg.options.map(opt => <option key={opt} value={opt}>{opt.replace('-', ' ')}</option>)}
                   </select>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Live Preview Panel */}
      <div className="lg:col-span-7 bg-slate-900 rounded-[2.5rem] p-8 flex flex-col shadow-2xl relative overflow-hidden group/preview">
        {/* Abstract shapes in bg */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time Preview</span>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl">
             <button 
               onClick={() => setPreviewDevice('desktop')}
               className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <Monitor className="w-4 h-4" />
             </button>
             <button 
               onClick={() => setPreviewDevice('mobile')}
               className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <Smartphone className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className={`flex-1 flex items-center justify-center transition-all duration-500 ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : 'w-full'}`}>
          <div className={`w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 relative ${previewDevice === 'mobile' ? 'aspect-[9/19.5]' : 'aspect-video'}`}>
             {/* Preview Website Content */}
             <div className="absolute inset-0 flex flex-col">
                <nav className="h-12 border-b flex items-center justify-between px-4" style={{ backgroundColor: formData.branding.theme === 'dark' ? '#0f172a' : 'white' }}>
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded bg-slate-200 overflow-hidden flex items-center justify-center">
                       {formData.branding.logo ? <img src={formData.branding.logo} className="w-full h-full object-cover" /> : <div className="w-3 h-3 rounded-full" style={{ backgroundColor: formData.branding.primaryColor }} />}
                     </div>
                     <span className={`text-xs font-black ${formData.branding.theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formData.business.name || 'Store Name'}</span>
                   </div>
                   <div className="flex gap-2">
                     <div className="w-4 h-2 rounded bg-slate-200" />
                     <div className="w-4 h-2 rounded bg-slate-200" />
                   </div>
                </nav>
                <div className={`flex-1 p-4 ${formData.branding.theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
                   {formData.branding.ecomEnabled ? (
                     <div className="space-y-4">
                        <div className="h-32 rounded-xl bg-slate-200 overflow-hidden relative">
                           <img src={ECOM_THEMES.find(t => t.id === formData.branding.ecomTheme)?.image} className="w-full h-full object-cover opacity-50 grayscale" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                              <h5 className="text-lg font-black leading-tight" style={{ color: formData.branding.primaryColor }}>Premium Collection</h5>
                              <button className="mt-2 px-4 py-1.5 rounded-full text-[8px] font-black text-white" style={{ backgroundColor: formData.branding.primaryColor }}>Shop Now</button>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           {[1,2].map(i => (
                             <div key={i} className="bg-white rounded-xl p-2 shadow-sm">
                                <div className="h-20 bg-slate-100 rounded-lg mb-2" />
                                <div className="h-2 w-3/4 bg-slate-200 rounded mb-1" />
                                <div className="h-2 w-1/2 bg-slate-100 rounded" />
                             </div>
                           ))}
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h5 className="text-base font-black">Dashboard Preview</h5>
                           <BarChart3 className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                           {[1,2,3].map(i => (
                             <div key={i} className="h-16 rounded-xl border-2 border-slate-100 flex flex-col items-center justify-center gap-1">
                                <div className="h-1 w-8 bg-slate-100 rounded" />
                                <div className="h-3 w-10 bg-slate-200 rounded" style={{ backgroundColor: i === 1 ? formData.branding.primaryColor + '20' : undefined }} />
                             </div>
                           ))}
                        </div>
                        <div className="h-40 bg-slate-100 rounded-2xl flex flex-col p-4 gap-2">
                           <div className="flex justify-between">
                             <div className="h-3 w-20 bg-slate-200 rounded" />
                             <div className="h-3 w-8 bg-slate-200 rounded" />
                           </div>
                           <div className="flex-1 flex items-end gap-1 px-2">
                             {[4,8,12,6,10,14,7].map((h, i) => (
                               <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h * 5}%`, backgroundColor: i === 5 ? formData.branding.primaryColor : '#cbd5e1' }} />
                             ))}
                           </div>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: formData.branding.primaryColor }} /> {formData.branding.primaryColor}
           </div>
           <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
              <Type className="w-3 h-3" /> {formData.branding.typography}
           </div>
           <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
              <Globe className="w-3 h-3" /> {formData.branding.ecomEnabled ? 'Ecommerce Live' : 'POS Dashboard'}
           </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 ring-8 ring-indigo-50">
          <Shield className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">System Admin Access</h3>
        <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          The following credentials will grant the owner full access to the Nexus platform. These are one-time secure credentials.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100 space-y-8">
           <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <User className="w-3 h-3" /> Master Username
              </label>
              <div className="relative">
                 <input 
                   disabled
                   type="text" 
                   value={formData.admin.username}
                   className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 font-black transition-all text-slate-700"
                 />
                 <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3" /> One-Time Password
              </label>
              <div className="relative group">
                 <input 
                   disabled
                   type="text" 
                   value={formData.admin.password}
                   className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4 font-mono font-black tracking-widest text-lg text-emerald-800"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-white px-2 py-1 rounded shadow-sm">Secure</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-3xl flex items-center gap-6 text-white overflow-hidden relative shadow-xl shadow-indigo-100">
           <Mail className="w-12 h-12 opacity-20 absolute -right-4 -bottom-4 rotate-12" />
           <div className="p-4 bg-white/10 rounded-2xl">
             <Sparkles className="w-8 h-8" />
           </div>
           <div>
             <p className="font-black text-lg">Automated Dispatch</p>
             <p className="text-sm font-medium text-indigo-100">An invitation email will be sent to <span className="underline font-bold">{formData.business.email}</span> once you confirm creation.</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-slate-900">Final Verification</h3>
        <p className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl">Review all configuration parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Info Section */}
        <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 overflow-hidden relative group">
           <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Business Info
              </h4>
              <button onClick={() => setCurrentStep(1)} className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all">EDIT</button>
           </div>
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    {formData.branding.logo ? <img src={formData.branding.logo} className="w-full h-full object-cover rounded-xl" /> : <Building2 className="w-6 h-6 text-slate-400" />}
                 </div>
                 <div>
                    <p className="text-lg font-black text-slate-900 leading-tight">{formData.business.name}</p>
                    <p className="text-xs font-bold text-slate-500">Global ID: {formData.business.name.toUpperCase().replace(/\s/g, '_')}_CORP</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-slate-50">
                 <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1">Owner</label>
                    <p className="text-sm font-bold text-slate-700">{formData.business.ownerName}</p>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1">Email</label>
                    <p className="text-sm font-bold text-slate-700">{formData.business.email}</p>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1">Region</label>
                    <p className="text-sm font-bold text-slate-700">{formData.business.country} ({formData.business.currency})</p>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1">Total Assets</label>
                    <p className="text-sm font-bold text-slate-700">{formData.outlets.length} Physical Locations</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Plan & Modules Section */}
        <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 overflow-hidden">
           <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4" /> Subscription & Core
              </h4>
              <button onClick={() => setCurrentStep(2)} className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all">EDIT</button>
           </div>
           <div className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-2xl flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-2 py-0.5 rounded bg-white inline-block mb-1">Active Tier</p>
                    <p className="text-xl font-black text-indigo-900">{plans.find(p => p.id === formData.subscription.planId)?.name} Enterprise</p>
                 </div>
                 <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">${isYearly ? plans.find(p => p.id === formData.subscription.planId)?.price.yearly : plans.find(p => p.id === formData.subscription.planId)?.price.monthly}</p>
                    <p className="text-[10px] font-bold text-indigo-600">{isYearly ? 'YEARLY' : 'MONTHLY'} BILLING</p>
                 </div>
              </div>
              <div className="space-y-3">
                 <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Enabled Capabilities</p>
                 <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.modules).filter(([, enabled]) => enabled).map(([key]) => (
                      <span key={key} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Branding Preview Mini */}
        <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 overflow-hidden">
           <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4" /> Visual Identity
              </h4>
              <button onClick={() => setCurrentStep(4)} className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all">EDIT</button>
           </div>
           <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-900 flex flex-col items-center justify-center relative p-3 border-4 border-slate-800">
                 <div className="w-full h-2 bg-slate-800 rounded mb-1" />
                 <div className="w-full flex-1 rounded bg-white flex flex-col p-1 gap-1">
                    <div className="w-full h-1 bg-slate-100 rounded" />
                    <div className="w-1/2 h-4 rounded" style={{ backgroundColor: formData.branding.primaryColor }} />
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-100" style={{ backgroundColor: formData.branding.primaryColor }} />
                    <span className="text-sm font-black text-slate-700">Primary Color</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Type className="w-6 h-6 p-1.5 bg-slate-100 text-slate-400 rounded-lg" />
                    <span className="text-sm font-black text-slate-700">{formData.branding.typography}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    {formData.branding.theme === 'light' ? <Monitor className="w-6 h-6 p-1.5 bg-slate-100 text-slate-400 rounded-lg" /> : <Monitor className="w-6 h-6 p-1.5 bg-slate-900 text-white rounded-lg" />}
                    <span className="text-sm font-black text-slate-700 capitalize">{formData.branding.theme} Engine</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Access Summary */}
        <div className="bg-slate-900 rounded-[2rem] p-6 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lock className="w-16 h-16 text-white" />
           </div>
           <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-2">
             <Lock className="w-4 h-4" /> Secure Admin Link
           </h4>
           <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Master Username</p>
                 <p className="text-white font-black">{formData.admin.username}</p>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Secure Passkey</p>
                 <p className="text-emerald-400 font-mono font-black tracking-widest">••••••••</p>
              </div>
              <p className="text-[10px] font-bold text-slate-500 italic text-center">*Password hidden for security. It will be sent via encrypted email.</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="h-full min-h-[500px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
      {!loading ? (
        <div className="text-center space-y-8 max-w-md">
           <div className="relative inline-block">
              <div className="w-32 h-32 bg-indigo-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200 rotate-12 transition-transform hover:rotate-0 duration-500">
                 <Rocket className="w-16 h-16 text-white" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2x -z-10"
              />
           </div>
           <div className="space-y-4">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">Ready to launch?</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Confirming will initialize the dedicated infrastructure for <span className="text-indigo-600 font-black">{formData.business.name}</span>. This process takes a few moments.
              </p>
           </div>
           <button 
             onClick={finalizeCreation}
             className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] text-xl font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
           >
             Initialize Production Setup <ChevronRight className="w-6 h-6" />
           </button>
        </div>
      ) : (
        <div className="text-center space-y-12 w-full max-w-xl">
           <div className="relative">
              <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                 <motion.div 
                   animate={{ 
                     x: [-200, 400],
                     width: ['20%', '40%', '20%']
                   }}
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   className="h-full bg-indigo-600 rounded-full"
                 />
              </div>
              <div className="mt-8 grid grid-cols-6 gap-2">
                 {loadingMessages.map((_, i) => (
                   <div 
                     key={i} 
                     className={`h-1.5 rounded-full transition-all duration-500 ${i <= loadingStep ? 'bg-indigo-600' : 'bg-slate-100'}`}
                   />
                 ))}
              </div>
           </div>
           <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl font-black text-slate-800 tracking-tight"
                >
                  {loadingMessages[loadingStep]}
                </motion.p>
              </AnimatePresence>
              <div className="flex items-center justify-center gap-3">
                 <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Provisioning Environment</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 text-left">
              <div className={`p-4 rounded-2xl border-2 transition-all ${loadingStep > 1 ? 'border-emerald-100 bg-emerald-50 opacity-100' : 'border-slate-100 bg-slate-50 opacity-40'}`}>
                 <Check className={`w-5 h-5 mb-2 ${loadingStep > 1 ? 'text-emerald-600' : 'text-slate-300'}`} />
                 <p className="text-xs font-bold text-slate-700">Database Instances Created</p>
              </div>
              <div className={`p-4 rounded-2xl border-2 transition-all ${loadingStep > 3 ? 'border-emerald-100 bg-emerald-50 opacity-100' : 'border-slate-100 bg-slate-50 opacity-40'}`}>
                 <Check className={`w-5 h-5 mb-2 ${loadingStep > 3 ? 'text-emerald-600' : 'text-slate-300'}`} />
                 <p className="text-xs font-bold text-slate-700">Storage Buckets Optimized</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );

  const renderStep9 = () => (
    <div className="h-full min-h-[600px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000">
       <div className="relative mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_80px_-10px_rgba(16,185,129,0.5)]"
          >
             <Check className="w-16 h-16 text-white" strokeWidth={4} />
          </motion.div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border border-dashed border-emerald-500/30 rounded-full"
          />
          <div className="absolute -top-4 -right-4 text-4xl">🚀</div>
       </div>

       <div className="text-center space-y-4 mb-16 px-4">
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Your business is ready!</h3>
          <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Infrastructure for <span className="text-emerald-600 font-black">{formData.business.name}</span> is live. The platform is waiting for its first interaction.
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-4">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 space-y-6">
             <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
               <Sparkles className="w-4 h-4" /> Recommended Next Steps
             </h4>
             <div className="space-y-4">
                {[
                  { label: 'Add first physical products', icon: ShoppingBag, color: 'indigo' },
                  { label: 'Register staff member accounts', icon: User, color: 'emerald' },
                  { label: 'Activate subscription billing', icon: CreditCard, color: 'amber' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                     <div className={`w-10 h-10 rounded-xl bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                     </div>
                     <p className="text-sm font-bold text-slate-700">{item.label}</p>
                     <ChevronRight className="w-4 h-4 ml-auto text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                ))}
             </div>
          </div>
          
          <div className="flex flex-col gap-4">
             <button 
               onClick={onComplete}
               className="flex-1 bg-slate-900 text-white rounded-[2rem] p-6 text-lg font-black shadow-2xl hover:bg-black transition-all flex flex-col items-center justify-center gap-2"
             >
                <LayoutDashboard className="w-8 h-8 opacity-50" />
                Navigate to Dashboard
             </button>
             <button 
               onClick={onComplete}
               className="flex-1 bg-indigo-600 text-white rounded-[2rem] p-6 text-lg font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex flex-col items-center justify-center gap-2"
             >
                <Sparkles className="w-8 h-8 opacity-50" />
                Start AI Onboarding
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[700px]">
      {/* Header */}
      <div className="h-20 px-8 flex items-center justify-between border-b border-slate-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Business Creation Journey</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {currentStep} of 9 · {STEPS.find(s => s.id === currentStep)?.title}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto py-8">
          {currentStep < 9 && renderProgress()}
          
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
                {currentStep === 6 && renderStep6()}
                {currentStep === 7 && renderStep7()}
                {currentStep === 8 && renderStep8()}
                {currentStep === 9 && renderStep9()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      {currentStep < 8 && (
        <div className="h-24 px-8 border-t border-slate-50 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md">
          <button 
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 font-black text-sm uppercase tracking-widest transition-all ${
              currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end mr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Phase</p>
                <p className="font-bold text-slate-700">{STEPS.find(s => s.id === currentStep + 1)?.title || 'Finalize'}</p>
             </div>
             <button 
               type="button"
               onClick={handleNext}
               className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
             >
               Continue <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
