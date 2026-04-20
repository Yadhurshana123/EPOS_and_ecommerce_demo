import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  TENANT_ADMIN: 'Tenant Admin',
  MANAGER: 'Manager',
  CASHIER: 'Cashier',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    let mockUser = null;
    
    if (email === 'admin@nexus.com') {
      mockUser = { id: 'sa1', name: 'Super Admin', email, role: ROLES.SUPER_ADMIN };
    } else if (email === 'tenant@store.com') {
      mockUser = { id: 'ta1', name: 'Shop Owner', email, role: ROLES.TENANT_ADMIN, tenantId: 't1' };
    } else if (email === 'manager@store.com') {
      mockUser = { id: 'm1', name: 'Downtown Branch Manager', email, role: ROLES.MANAGER, tenantId: 't1', outletId: 'o1' };
    } else if (email === 'cashier@store.com') {
      mockUser = { id: 'c1', name: 'John Cashier', email, role: ROLES.CASHIER, tenantId: 't1', outletId: 'o1' };
    }

    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('nexus_user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  // Directly set a user object — used for dynamic/tenant logins that aren't in the mock list
  const loginAs = (userObj) => {
    setUser(userObj);
    localStorage.setItem('nexus_user', JSON.stringify(userObj));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAs, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
