import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Shirt,
  Boxes,
  Truck,
  Building2,
  Users2,
  Receipt,
  FileBarChart,
  Barcode,
  Tags,
  ShieldCheck,
  History,
  Settings,
  Store,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentView, setView, isMobileOpen, onCloseMobile }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const navSections = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'pos', label: 'POS Billing', icon: ShoppingCart },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products', label: 'Item Master', icon: Shirt },
        { id: 'inventory', label: 'Stock Valuation', icon: Boxes },
        { id: 'purchases', label: 'Purchases Intake', icon: Truck },
        { id: 'suppliers', label: 'Supplier Ledger', icon: Building2 },
        { id: 'customers', label: 'Customers & CRM', icon: Users2 },
        { id: 'expenses', label: 'Store Expenses', icon: Receipt },
      ],
    },
    {
      title: 'REPORTS & TOOLS',
      items: [
        { id: 'reports', label: 'Financial & GST Audit', icon: FileBarChart },
        { id: 'barcodes', label: 'Barcode Manager', icon: Barcode },
      ],
    },
    {
      title: 'SYSTEM ADMIN',
      adminOnly: true,
      items: [
        { id: 'categories', label: 'Categories & Brands', icon: Tags },
        { id: 'users', label: 'Staff Users & Roles', icon: ShieldCheck },
        { id: 'audit', label: 'Audit Trail Logs', icon: History },
        { id: 'settings', label: 'Store Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <Shirt size={22} />
          </div>
          <div className="sidebar-logo-text" style={{ flex: 1 }}>
            <h2>TAMIL DRESS</h2>
            <p>தமிழ் டிரஸ் கலெக்ஷன்</p>
          </div>
          {/* Mobile Close Button */}
          <button
            className="mobile-sidebar-close"
            onClick={onCloseMobile}
            aria-label="Close Navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-nav-scroll">
          {navSections.map((section, idx) => {
            if (section.adminOnly && !isAdmin) return null;
            return (
              <React.Fragment key={idx}>
                <div className="sidebar-section-label">{section.title}</div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`sidebar-menu-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setView(item.id)}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Store size={14} />
            <span>Salem Main Branch</span>
          </div>
          <span style={{ color: '#10b981', fontWeight: 700 }}>● Online</span>
        </div>
      </aside>
    </>
  );
}
