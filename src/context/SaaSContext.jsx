import React, { createContext, useContext, useState, useEffect } from 'react';

const SaaSContext = createContext();

const INITIAL_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: { monthly: 49, yearly: 470 },
    limits: { outlets: 1, staff: 5 },
    features: ['1 Outlet', '5 Staff Members', 'Standard POS', 'Email Support'],
    color: 'slate',
    hardware: [
      { name: 'Nexus Mobile POS Terminal', desc: 'Handheld Android-based POS', icon: 'Smartphone' },
      { name: 'Integrated Thermal Printer', desc: '58mm receipt printing', icon: 'Printer' }
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 149, yearly: 1430 },
    limits: { outlets: 5, staff: 20 },
    features: ['Up to 5 Outlets', '20 Staff Members', 'AI Onboarding', 'Analytics Pro', 'Ecommerce Integration'],
    color: 'indigo',
    recommended: true,
    hardware: [
      { name: 'Nexus Desktop 15" Terminal', desc: 'Sleek touch-screen interface', icon: 'Monitor' },
      { name: 'Thermal Receipt Printer', desc: 'High-speed 80mm printing', icon: 'Printer' },
      { name: 'Wireless Barcode Scanner', desc: '1D/2D laser scanning', icon: 'Scan' },
      { name: 'Steel Cash Drawer', desc: 'Heavy-duty 5-compartment', icon: 'Coins' }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 499, yearly: 4790 },
    limits: { outlets: 999, staff: 999 },
    features: ['Unlimited Outlets', 'Unlimited Staff', 'Custom Module Dev', 'Dedicated Manager', 'API Access'],
    color: 'emerald',
    hardware: [
      { name: '2x Nexus Ultra Terminals', desc: 'Dual-screen POS stations', icon: 'Monitor' },
      { name: 'Kitchen Display System', desc: '10" Tablet with wall mount', icon: 'Tablet' },
      { name: 'Label & Receipt Printers', desc: 'Combo printing solution', icon: 'Printer' },
      { name: 'Customer Display', desc: '7" Pole-mounted screen', icon: 'Tv' },
      { name: 'Enterprise Network Hub', desc: 'Dedicated offline-sync router', icon: 'Network' }
    ]
  }
];

const INITIAL_TENANTS = [
  {
    id: 't1',
    name: 'Nexus Fashion',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
    theme: { primary: '#4f46e5', secondary: '#9333ea' },
    features: {
      pos: true,
      inventory: true,
      ecommerce: true,
      reports: true,
      aiOnboarding: true,
    },
    subscription: { plan: 'Enterprise', status: 'Active', limits: { outlets: 10, staff: 50 } },
    outlets: [
      { id: 'o1', name: 'Downtown Branch', location: 'New York' },
      { id: 'o2', name: 'Westside Mall', location: 'New York' },
    ],
  },
  {
    id: 't2',
    name: 'Tech Gadgets',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100',
    theme: { primary: '#0ea5e9', secondary: '#3b82f6' },
    features: {
      pos: true,
      inventory: true,
      ecommerce: false,
      reports: true,
      aiOnboarding: true,
    },
    subscription: { plan: 'Pro', status: 'Active', limits: { outlets: 3, staff: 10 } },
    outlets: [
      { id: 'o3', name: 'Tech Hub SV', location: 'Silicon Valley' },
    ],
  }
];

const INITIAL_PRODUCTS = [
  { id: 'p1', tenantId: 't1', name: 'Nike Air Max', category: 'Footwear', price: 150, stock: { o1: 10, o2: 5 }, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { id: 'p2', tenantId: 't1', name: 'Nike Pro Hoodie', category: 'Apparel', price: 65, stock: { o1: 20, o2: 15 }, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400' },
  { id: 'p3', tenantId: 't2', name: 'MacBook Pro 16', category: 'Laptops', price: 2499, stock: { o3: 2 }, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
];

export function SaaSProvider({ children }) {
  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem('nexus_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nexus_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('nexus_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('nexus_plans_v3');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  useEffect(() => {
    localStorage.setItem('nexus_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('nexus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexus_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('nexus_plans_v3', JSON.stringify(plans));
  }, [plans]);

  // Actions
  const addTenant = (tenant) => setTenants([...tenants, { ...tenant, id: `t${Date.now()}` }]);
  const updateTenant = (id, updates) => setTenants(tenants.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTenant = (id) => setTenants(tenants.filter(t => t.id !== id));

  const addProduct = (product) => setProducts(prev => [...prev, { ...product, id: `p${Date.now()}_${Math.random().toString(36).substr(2, 5)}` }]);
  const updateProduct = (id, updates) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const updateStock = (productId, outletId, delta) => {
    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === productId) {
        const currentStock = p.stock[outletId] || 0;
        return { ...p, stock: { ...p.stock, [outletId]: Math.max(0, currentStock + delta) } };
      }
      return p;
    }));
  };

  const recordSale = (sale) => setSales([...sales, { ...sale, id: `s${Date.now()}`, date: new Date().toISOString() }]);

  const addPlan = (plan) => setPlans([...plans, { ...plan, id: `pl_${Date.now()}` }]);
  const updatePlan = (id, updates) => setPlans(plans.map(p => p.id === id ? { ...p, ...updates } : p));
  const deletePlan = (id) => setPlans(plans.filter(p => p.id !== id));

  return (
    <SaaSContext.Provider value={{ 
      tenants, addTenant, updateTenant, deleteTenant,
      products, addProduct, updateProduct, deleteProduct, updateStock, getTenantProducts: (tid) => products.filter(p => p.tenantId === tid),
      sales, recordSale, getTenantSales: (tid) => sales.filter(s => s.tenantId === tid),
      plans, addPlan, updatePlan, deletePlan
    }}>
      {children}
    </SaaSContext.Provider>
  );
}

export const useSaaS = () => useContext(SaaSContext);
