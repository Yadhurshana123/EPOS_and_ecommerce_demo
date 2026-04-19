import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Box, Mail, Lock, ShieldCheck, 
  ArrowRight, CheckCircle2, AlertCircle, KeyRound
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('cashier@store.com');
  const [password, setPassword] = useState('password');
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuthNavigation = (role) => {
    if (role === ROLES.SUPER_ADMIN) navigate('/sa/dashboard');
    else if (role === ROLES.TENANT_ADMIN) navigate('/ta/dashboard');
    else if (role === ROLES.MANAGER) navigate('/m/inventory');
    else if (role === ROLES.CASHIER) navigate('/c/pos');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simulate New Tenant forced password change
    if (!isChangingPassword && (password.startsWith('NEX-') || password === 'temp123')) {
      setIsChangingPassword(true);
      return;
    }

    if (isChangingPassword) {
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setIsChangingPassword(false);
        setLoading(false);
        // Fallback to mocking login
        const result = login(email, 'password'); // use valid mock password
        if (result.success) {
          const user = JSON.parse(localStorage.getItem('nexus_user'));
          handleAuthNavigation(user.role);
        }
      }, 1000);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Assuming 'admin@nexus.com' with 'password' works
      // Check if email looks like a dynamically created tenant admin
      let isDynamic = false;
      if (!['admin@nexus.com', 'tenant@store.com', 'manager@store.com', 'cashier@store.com'].includes(email)) {
        isDynamic = true; 
        // We will force login into Tenant Admin for any unknown email if they passed the password check
      }

      const result = isDynamic ? { success: true } : login(email, password);
      
      if (result.success && isDynamic) {
        // mock dynamic TA login
        const dynamicUser = { id: 'ta99', name: 'Nexus Fashion Owner', email, role: ROLES.TENANT_ADMIN, tenantId: 't1' };
        localStorage.setItem('nexus_user', JSON.stringify(dynamicUser));
        handleAuthNavigation(ROLES.TENANT_ADMIN);
      } else if (result.success) {
        const user = JSON.parse(localStorage.getItem('nexus_user'));
        handleAuthNavigation(user.role);
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (roleEmail, temp = false) => {
    setEmail(roleEmail);
    if (temp) {
      setPassword('NEX-RND123'); // trigger change password
    } else {
      setPassword('password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
           <div className="inline-flex w-16 h-16 bg-white rounded-2xl shadow-xl shadow-indigo-100 items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <Box className="w-8 h-8 text-indigo-600" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
           </div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Nexus EPOS</h1>
           <p className="text-slate-500 font-medium tracking-wide">Secure Access Portal</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
          
          {isChangingPassword ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="mb-6 flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                   <KeyRound className="w-6 h-6 text-amber-500" />
                 </div>
                 <h2 className="text-xl font-black text-slate-900">Security Requirement</h2>
                 <p className="text-xs text-slate-500 mt-1 font-medium">As a first-time user, you must set a permanent password to proceed.</p>
               </div>
               <form className="space-y-6" onSubmit={handleSubmit}>
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 ml-1">New Permanent Password</label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <input 
                       type="password" 
                       value={newPassword}
                       onChange={(e) => setNewPassword(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-500 outline-none transition-all font-bold text-slate-800"
                       placeholder="••••••••"
                       required
                     />
                   </div>
                 </div>

                 {error && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-sm font-medium">
                     <AlertCircle className="w-4 h-4" /> {error}
                   </motion.div>
                 )}

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-slate-900 hover:bg-amber-500 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 shadow-xl shadow-amber-200 transition-all disabled:opacity-70 mt-2"
                 >
                   {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                     <>Save Password & Enter <ArrowRight className="w-5 h-5" /></>
                   )}
                 </button>
               </form>
            </motion.div>
          ) : (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <form className="space-y-6" onSubmit={handleSubmit}>
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 ml-1">Email / Username</label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                       placeholder="name@company.com"
                       required
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                       placeholder="••••••••"
                       required
                     />
                   </div>
                 </div>

                 {error && (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-sm font-medium">
                     <AlertCircle className="w-4 h-4" /> {error}
                   </motion.div>
                 )}

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-indigo-200 transition-all disabled:opacity-70 mt-2"
                 >
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <>Authenticate <ArrowRight className="w-5 h-5" /></>
                   )}
                 </button>
               </form>
               <div className="mt-8 pt-8 border-t border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest text-center mb-4">Quick Demo Access</p>
                  <div className="grid grid-cols-2 gap-3">
                     {[
                       { r: 'Super Admin', e: 'admin@nexus.com' },
                       { r: 'Tenant Admin', e: 'tenant@store.com' },
                       { r: 'Manager', e: 'manager@store.com' },
                       { r: 'Cashier', e: 'cashier@store.com' },
                     ].map((role) => (
                       <button 
                         key={role.r}
                         type="button"
                         onClick={() => handleQuickLogin(role.e, role.temp)}
                         className="p-3 text-left bg-slate-50 hover:bg-white hover:ring-2 hover:ring-indigo-500/20 rounded-xl transition-all border border-slate-100"
                       >
                         <p className="text-[10px] font-bold text-indigo-600 mb-0.5">{role.r}</p>
                         <p className="text-[11px] text-slate-500 truncate">{role.e}</p>
                       </button>
                     ))}
                  </div>
               </div>
             </motion.div>
          )}

        </div>

        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
          Nexus EPOS Simulation &copy; 2026. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
