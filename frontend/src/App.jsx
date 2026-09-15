import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';

import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import LockScreen from './components/LockScreen';
import ScannerModal from './components/ScannerModal';

import Dashboard from './pages/Dashboard';
import PosBilling from './pages/PosBilling';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Purchases from './pages/Purchases';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import BarcodeLabels from './pages/BarcodeLabels';
import CategoriesBrands from './pages/CategoriesBrands';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import MobileScannerGun from './pages/MobileScannerGun';

function MainApp() {
  const [currentView, setView] = useState('pos');
  const [visitedViews, setVisitedViews] = useState(new Set(['pos']));
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isLocked } = useAuth();

  const handleNavigate = (view) => {
    setVisitedViews((prev) => {
      if (prev.has(view)) return prev;
      const next = new Set(prev);
      next.add(view);
      return next;
    });
    setView(view);
    setIsMobileNavOpen(false); // Auto close sidebar on mobile navigation
  };

  const handleScanResult = (barcode) => {
    // When scanner decodes barcode, switch to POS view and add product
    handleNavigate('pos');
  };

  return (
    <div className="app-container">
      {/* 4-Digit Security Passcode Lock Overlay */}
      {isLocked && <LockScreen />}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setView={handleNavigate}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="main-wrapper">
        <TopNavbar
          currentView={currentView}
          onOpenScanner={() => setIsScannerOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        />

        <main className="module-content">
          <div style={{ display: currentView === 'pos' ? 'block' : 'none', height: '100%' }}>
            {visitedViews.has('pos') && <PosBilling onOpenScanner={() => setIsScannerOpen(true)} />}
          </div>
          <div style={{ display: currentView === 'dashboard' ? 'block' : 'none' }}>
            {visitedViews.has('dashboard') && <Dashboard onNavigateToPos={() => handleNavigate('pos')} />}
          </div>
          <div style={{ display: currentView === 'products' ? 'block' : 'none' }}>
            {visitedViews.has('products') && <Products />}
          </div>
          <div style={{ display: currentView === 'inventory' ? 'block' : 'none' }}>
            {visitedViews.has('inventory') && <Inventory />}
          </div>
          <div style={{ display: currentView === 'purchases' ? 'block' : 'none' }}>
            {visitedViews.has('purchases') && <Purchases />}
          </div>
          <div style={{ display: currentView === 'suppliers' ? 'block' : 'none' }}>
            {visitedViews.has('suppliers') && <Suppliers />}
          </div>
          <div style={{ display: currentView === 'customers' ? 'block' : 'none' }}>
            {visitedViews.has('customers') && <Customers />}
          </div>
          <div style={{ display: currentView === 'expenses' ? 'block' : 'none' }}>
            {visitedViews.has('expenses') && <Expenses />}
          </div>
          <div style={{ display: currentView === 'reports' ? 'block' : 'none' }}>
            {visitedViews.has('reports') && <Reports />}
          </div>
          <div style={{ display: currentView === 'barcodes' ? 'block' : 'none' }}>
            {visitedViews.has('barcodes') && <BarcodeLabels />}
          </div>
          <div style={{ display: currentView === 'categories' ? 'block' : 'none' }}>
            {visitedViews.has('categories') && <CategoriesBrands />}
          </div>
          <div style={{ display: currentView === 'users' ? 'block' : 'none' }}>
            {visitedViews.has('users') && <Users />}
          </div>
          <div style={{ display: currentView === 'audit' ? 'block' : 'none' }}>
            {visitedViews.has('audit') && <AuditLogs />}
          </div>
          <div style={{ display: currentView === 'settings' ? 'block' : 'none' }}>
            {visitedViews.has('settings') && <Settings />}
          </div>
        </main>
      </div>

      {/* Barcode Camera & Remote Gun Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanResult={handleScanResult}
      />
    </div>
  );
}

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isScannerMode = urlParams.has('scanner') || urlParams.has('session');
  const sessionId = urlParams.get('session') || 'MAIN';

  if (isScannerMode) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <MobileScannerGun sessionId={sessionId} />
        </ToastProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
