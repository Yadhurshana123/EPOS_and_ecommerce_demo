import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSaaS } from '../context/SaaSContext';
import { 
  BarChart3, Box, Users, Settings, LogOut, 
  ShoppingBag, Store, User, Layers, Menu, X, Monitor, Globe,
  ShieldCheck, LayoutDashboard, Database, Smartphone, Package
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { tenants } = useSaaS();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return <>{children}</>;

  const tenant = tenants.find(t => t.id === user.tenantId);

  const navItems = {
    'Super Admin': [
      { name: 'Overview', path: '/sa/dashboard', icon: LayoutDashboard },
      { name: 'Tenants', path: '/sa/tenants', icon: Layers },
      { name: 'Subscriptions', path: '/sa/billing', icon: ShieldCheck },
      { name: 'Platform Settings', path: '/sa/settings', icon: Settings },
    ],
    'Tenant Admin': [
      { name: 'Dashboard', path: '/ta/dashboard', icon: LayoutDashboard },
      { name: 'Outlets', path: '/ta/outlets', icon: Store },
      { name: 'Staff', path: '/ta/staff', icon: Users },
      { name: 'Products', path: '/ta/products', icon: Box },
      { name: 'POS Monitor', path: '/ta/pos-monitor', icon: Monitor },
      { name: 'Ecommerce', path: '/ta/ecommerce', icon: Globe },
      { name: 'Reports', path: '/ta/reports', icon: BarChart3 },
      { name: 'Settings', path: '/ta/settings', icon: Settings },
    ],
    'Manager': [
      { name: 'Overview', path: '/m/dashboard', icon: LayoutDashboard },
      { name: 'Till Mgmt', path: '/m/tills', icon: Monitor },
      { name: 'Staff', path: '/m/staff', icon: Users },
      { name: 'Reports', path: '/m/reports', icon: BarChart3 },
      { name: 'Operations', path: '/m/hardware', icon: Store },
    ],
    'Cashier': [
      { name: 'POS Terminal', path: '/c/pos', icon: Smartphone },
      { name: 'My Shifts', path: '/c/shifts', icon: User },
    ]
  };

  const currentNav = navItems[user.role] || [];

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      {user.role !== 'Cashier' && (
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Nexus EPOS</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{user.role}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {currentNav.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                location.pathname === item.path 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-3">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
               {user.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
               <p className="text-[10px] text-slate-500 truncate">{tenant?.name || 'Platform'}</p>
             </div>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-full min-h-0">
        {/* Top Header - Mobile & Search */}
        {user.role !== 'Cashier' && (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 lg:hidden">
          <div className="flex items-center gap-2 lg:hidden">
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
               <Menu className="w-6 h-6" />
             </button>
             <span className="font-bold text-slate-800">Nexus</span>
          </div>
        </header>
        )}


        <div className={user.role === 'Cashier' ? "h-full overflow-hidden" : "p-6 md:p-8 overflow-y-auto h-full"}>
           {children}
        </div>
      </main>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && user.role !== 'Cashier' && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Box className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-slate-900">Nexus EPOS</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4">
                {currentNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 ${
                      location.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
