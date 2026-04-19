import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { SaaSProvider } from './context/SaaSContext';
import Layout from './components/Layout';
import Login from './views/Login';
import SuperAdminDashboard from './views/SuperAdmin/Dashboard';
import SuperAdminTenants from './views/SuperAdmin/Tenants';
import SuperAdminBilling from './views/SuperAdmin/Billing';
import SuperAdminSettings from './views/SuperAdmin/Settings';
import TenantDashboard from './views/TenantAdmin/Dashboard';
import Reports from './views/TenantAdmin/Reports';
import Outlets from './views/TenantAdmin/Outlets';
import Staff from './views/TenantAdmin/Staff';
import Products from './views/TenantAdmin/Products';
import Settings from './views/TenantAdmin/Settings';
import POSMonitoring from './views/TenantAdmin/POSMonitoring';
import EcommerceControl from './views/TenantAdmin/EcommerceControl';
import Inventory from './views/Manager/Inventory';
import ManagerDashboard from './views/Manager/Dashboard';
import TillManagement from './views/Manager/TillManagement';
import StaffSupervision from './views/Manager/Staff';
import ManagerReports from './views/Manager/Reports';
import ManagerOperations from './views/Manager/Operations';
import POSTerminal from './views/Cashier/POS';
import Storefront from './views/Ecommerce/Storefront';
import AIOnboarding from './components/AIOnboarding';

// Private Route logic
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  
  return children;
};

function Workspace() {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  // Dashboard Router logic
  return (
    <Layout>
      <Routes>
        <Route path="/sa/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminDashboard /></ProtectedRoute>} />
        <Route path="/sa/tenants" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminTenants /></ProtectedRoute>} />
        <Route path="/sa/billing" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminBilling /></ProtectedRoute>} />
        <Route path="/sa/settings" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminSettings /></ProtectedRoute>} />
        
        <Route path="/ta/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.TENANT_ADMIN]}><TenantDashboard /></ProtectedRoute>} />
        <Route path="/ta/reports" element={<ProtectedRoute allowedRoles={[ROLES.TENANT_ADMIN]}><Reports /></ProtectedRoute>} />
        <Route path="/ta/outlets" element={<ProtectedRoute allowedRoles={[ROLES.TENANT_ADMIN]}><Outlets /></ProtectedRoute>} />
        <Route path="/ta/staff" element={<ProtectedRoute allowedRoles={[ROLES.TENANT_ADMIN]}><Staff /></ProtectedRoute>} />
        <Route path="/ta/products" element={<ProtectedRoute allowedRoles={[ROLES.TENANT_ADMIN]}><Products /></ProtectedRoute>} />
        <Route path="/ta/pos-monitor" element={<ProtectedRoute allowedRoles={[ROLES.TENANT_ADMIN]}><POSMonitoring /></ProtectedRoute>} />
        <Route path="/ta/ecommerce" element={<ProtectedRoute allowedRoles={[ROLES.TENANT_ADMIN]}><EcommerceControl /></ProtectedRoute>} />
        <Route path="/ta/settings" element={<ProtectedRoute allowedRoles={[ROLES.TENANT_ADMIN]}><Settings /></ProtectedRoute>} />
        
        <Route path="/m/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.TENANT_ADMIN]}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/m/tills" element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.TENANT_ADMIN]}><TillManagement /></ProtectedRoute>} />
        <Route path="/m/inventory" element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.TENANT_ADMIN]}><Inventory /></ProtectedRoute>} />
        <Route path="/m/staff" element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.TENANT_ADMIN]}><StaffSupervision /></ProtectedRoute>} />
        <Route path="/m/reports" element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.TENANT_ADMIN]}><ManagerReports /></ProtectedRoute>} />
        <Route path="/m/hardware" element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.TENANT_ADMIN]}><ManagerOperations /></ProtectedRoute>} />
        
        <Route path="/c/pos" element={<ProtectedRoute allowedRoles={[ROLES.CASHIER]}><POSTerminal /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to={
          user.role === ROLES.SUPER_ADMIN ? '/sa/dashboard' : 
          user.role === ROLES.TENANT_ADMIN ? '/ta/dashboard' : 
          user.role === ROLES.MANAGER ? '/m/dashboard' : '/c/pos'
        } replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SaaSProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/shop/:tenantId" element={<Storefront />} />
            <Route path="*" element={<Workspace />} />
          </Routes>
        </SaaSProvider>
      </AuthProvider>
    </Router>
  );
}
