import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Lock,
  QrCode,
  IndianRupee,
  Clock,
  Store,
  Menu,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { reportsApi } from '../api/client';

const viewTitleMap = {
  pos: 'Sales / POS Billing Engine',
  dashboard: 'Dashboard Overview',
  products: 'Item Master & Product Catalog',
  inventory: 'Inventory Valuation Ledger',
  purchases: 'Wholesale Purchase Intake',
  suppliers: 'Supplier Ledger Matrix',
  customers: 'Customer Directory & Credit',
  expenses: 'Store Operational Expenses',
  reports: 'Financial Reports & GST Audit',
  barcodes: 'Barcode Label Sheet Manager',
  categories: 'Category & Brand Management',
  users: 'Staff Users & Role Permissions',
  audit: 'System Audit Trail Logs',
  settings: 'Store Configuration & Profiles',
};

export default function TopNavbar({ currentView, onOpenScanner, onToggleMobileNav }) {
  const { theme, toggleTheme } = useTheme();
  const { lockWorkstation, currentUser } = useAuth();
  const [todaySales, setTodaySales] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await reportsApi.getDashboard();
        setTodaySales(data.today_sales || 0);
      } catch (e) {
        // quiet fail on background stat
      }
    };
    fetchSales();
    const interval = setInterval(fetchSales, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-navbar">
      <div className="top-left-group">
        {/* Mobile Hamburger Menu Button */}
        <button
          className="mobile-hamburger-btn"
          onClick={onToggleMobileNav}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="page-title-heading">{viewTitleMap[currentView] || 'Tamil Dress POS'}</h1>
        <select className="branch-selector" defaultValue="salem">
          <option value="salem">🏪 Salem Main Branch</option>
          <option value="chennai">🏪 Chennai Branch</option>
          <option value="coimbatore">🏪 Coimbatore Branch</option>
        </select>
      </div>

      <div className="top-right-tools">
        <div className="quick-stat-chip nav-hide-sm">
          <IndianRupee size={15} style={{ color: 'var(--success)' }} />
          <span>
            Today: <strong>₹ {todaySales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </span>
        </div>

        <button className="nav-btn" onClick={onOpenScanner} title="Pair Scanner Gun / Camera">
          <QrCode size={15} />
          <span className="nav-btn-text">Pair Scanner</span>
        </button>

        <button className="nav-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          <span className="nav-btn-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        <button className="nav-btn danger" onClick={lockWorkstation} title="Lock Terminal">
          <Lock size={15} />
          <span className="nav-btn-text">Lock</span>
        </button>

        <div className="quick-stat-chip nav-hide-md">
          <Clock size={15} />
          <span>{time}</span>
        </div>
      </div>
    </header>
  );
}
