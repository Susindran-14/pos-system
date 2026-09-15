import React, { useState, useEffect, useRef } from 'react';
import {
  Barcode,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Pause,
  Play,
  CreditCard,
  Banknote,
  QrCode,
  UserPlus,
  Percent,
  Check,
  X,
  Printer,
  Sparkles,
  Shirt,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { productsApi, customersApi, salesApi, settingsApi } from '../api/client';
import ReceiptModal from '../components/ReceiptModal';
import { QRCodeSVG } from 'qrcode.react';

export default function PosBilling({ onOpenScanner }) {
  const {
    cart,
    selectedCustomer,
    setSelectedCustomer,
    billDiscount,
    setBillDiscount,
    discountType,
    setDiscountType,
    heldBills,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    holdCurrentBill,
    recallHeldBill,
    totals,
  } = useCart();

  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [customers, setCustomers] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [cashTendered, setCashTendered] = useState('');
  const [completedSale, setCompletedSale] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isCustomerDisplayOpen, setIsCustomerDisplayOpen] = useState(false);
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const [mobileTab, setMobileTab] = useState('catalog'); // 'catalog' | 'cart'

  const barcodeInputRef = useRef(null);

  // Soundbox Voice Announcement Trigger (Paytm / PhonePe Soundbox)
  const playVoiceConfirmation = () => {
    if ('speechSynthesis' in window) {
      const text = `Payment of Rupees ${totals.grandTotal} received on Paytm UPI.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
      showToast(`🔊 Soundbox Alert: "₹${totals.grandTotal} received on Paytm UPI"`, 'info');
    } else {
      showToast(`Soundbox ping sent for ₹${totals.grandTotal}`, 'info');
    }
  };

  useEffect(() => {
    loadData();
    if (barcodeInputRef.current) barcodeInputRef.current.focus();
  }, []);

  const loadData = async () => {
    try {
      const [prods, cats, custs, sets] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories(),
        customersApi.getAll(),
        settingsApi.getSettings(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setCustomers(custs || []);
      setStoreSettings(sets || {});
    } catch (err) {
      showToast('Error loading store catalog: ' + err.message, 'error');
    }
  };

  // Barcode / SKU scan submit
  const handleBarcodeSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!barcodeInput.trim()) return;

    try {
      const prod = await productsApi.getByBarcode(barcodeInput.trim());
      if (prod) {
        addToCart(prod);
        showToast(`Added "${prod.name}" to cart!`);
        setBarcodeInput('');
      }
    } catch (err) {
      // If not exact match, search local list
      const matched = products.find(
        (p) =>
          p.barcode === barcodeInput.trim() ||
          p.sku.toLowerCase() === barcodeInput.trim().toLowerCase()
      );
      if (matched) {
        addToCart(matched);
        showToast(`Added "${matched.name}" to cart!`);
        setBarcodeInput('');
      } else {
        showToast(`Product not found for barcode: ${barcodeInput}`, 'error');
      }
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const s = searchQuery.toLowerCase();
    const matchesSearch =
      !s ||
      p.name.toLowerCase().includes(s) ||
      p.sku.toLowerCase().includes(s) ||
      p.barcode.includes(s);
    return matchesCat && matchesSearch;
  });

  // Handle Quick Customer Registration
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustMobile || !newCustName) return;
    try {
      const cust = await customersApi.create({
        mobile: newCustMobile,
        name: newCustName,
      });
      setCustomers((prev) => [...prev, cust]);
      setSelectedCustomer(cust);
      setIsCustomerModalOpen(false);
      setNewCustMobile('');
      setNewCustName('');
      showToast(`Customer ${cust.name} registered!`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Open Checkout
  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is empty. Add products to bill.', 'warning');
      return;
    }
    setPaymentMode('Cash');
    setCashTendered(totals.grandTotal.toString());
    setIsPayModalOpen(true);
  };

  // Settle & Complete Sale
  const handleCompletePayment = async () => {
    const tendered = Number(cashTendered) || totals.grandTotal;
    const change = Math.max(0, tendered - totals.grandTotal);

    const salePayload = {
      customer_id: selectedCustomer?.id || null,
      customer_name: selectedCustomer?.name || 'Walk-in Customer',
      customer_mobile: selectedCustomer?.mobile || '',
      items: totals.computedItems,
      subtotal: totals.subtotal,
      item_discount: totals.itemDiscountTotal,
      bill_discount: totals.billDiscount,
      taxable_amount: totals.taxableAmount,
      cgst: totals.cgst,
      sgst: totals.sgst,
      igst: totals.igst,
      round_off: totals.roundOff,
      grand_total: totals.grandTotal,
      payment_mode: paymentMode,
      amount_paid: tendered,
      change_returned: change,
      notes: 'Standard POS Checkout',
    };

    try {
      const sale = await salesApi.create(salePayload);
      showToast(`Invoice #${sale.invoice_no} generated successfully!`);
      setCompletedSale(sale);
      setIsPayModalOpen(false);
      clearCart();
      // Reload product stock in background
      productsApi.getAll().then(setProducts);
    } catch (err) {
      showToast('Payment processing failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="pos-container">
      {/* Mobile Top View Switcher */}
      <div className="pos-mobile-view-tabs">
        <button
          className={`pos-mobile-tab-btn ${mobileTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setMobileTab('catalog')}
        >
          <Shirt size={15} />
          <span>Catalog ({filteredProducts.length})</span>
        </button>
        <button
          className={`pos-mobile-tab-btn ${mobileTab === 'cart' ? 'active' : ''}`}
          onClick={() => setMobileTab('cart')}
        >
          <ShoppingCart size={15} />
          <span>Cart ({totals.totalQty}) - ₹{totals.grandTotal}</span>
        </button>
      </div>

      {/* LEFT: PRODUCTS CATALOG & SEARCH */}
      <div className={`pos-left-catalog ${mobileTab === 'catalog' ? 'mobile-active' : 'mobile-hidden'}`}>
        <div className="pos-search-bar">
          <form onSubmit={handleBarcodeSubmit} style={{ flex: 1, display: 'flex', gap: 10 }}>
            <div className="pos-input-wrapper">
              <Barcode size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                ref={barcodeInputRef}
                type="text"
                placeholder="Scan Barcode or Type SKU + Enter..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
              />
            </div>
          </form>

          <div className="pos-input-wrapper pos-search-name-input" style={{ width: '220px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search apparel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="nav-btn" onClick={onOpenScanner} title="Pair Scanner Gun">
            <QrCode size={16} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-tabs-scroll">
          <button
            className={`cat-tab-btn ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`cat-tab-btn ${activeCategory === c.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="product-grid-scroll">
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No products found. Add products in Item Master to begin!
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="product-card-pos"
                onClick={() => {
                  addToCart(p);
                  showToast(`Added ${p.name}`);
                }}
              >
                <div>
                  <div className="card-category">{p.category}</div>
                  <div className="card-title">{p.name}</div>
                  <div className="card-variants">
                    {p.size && <span>Size: {p.size} </span>}
                    {p.color && <span>• {p.color}</span>}
                  </div>
                </div>

                <div className="card-footer">
                  <div className="card-price">₹{p.selling_price}</div>
                  <div className={`card-stock ${p.stock <= p.reorder_level ? 'low' : ''}`}>
                    {p.stock} in stock
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Mobile Cart Bar */}
        {totals.totalQty > 0 && (
          <div className="pos-floating-cart-bar" onClick={() => setMobileTab('cart')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart size={18} />
              <span><strong>{totals.totalQty} items</strong> in cart</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '15px', fontWeight: 800 }}>₹{totals.grandTotal}</span>
              <span className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>View Bill →</span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: POS CART & BILLING ENGINE */}
      <div className={`pos-right-cart ${mobileTab === 'cart' ? 'mobile-active' : 'mobile-hidden'}`}>
        {/* Cart Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Current Bill</h3>
            <span className="badge info">{totals.totalQty} Items</span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {heldBills.length > 0 && (
              <button
                className="nav-btn"
                onClick={() => recallHeldBill(0)}
                title="Recall held bill"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                <Play size={12} /> Recall ({heldBills.length})
              </button>
            )}
            <button
              className="nav-btn"
              onClick={holdCurrentBill}
              title="Hold current bill"
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              <Pause size={12} /> Hold
            </button>
            <button
              className="nav-btn danger"
              onClick={clearCart}
              title="Clear cart"
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Customer Select Bar */}
        <div className="cart-customer-bar">
          <select
            className="form-control"
            style={{ flex: 1, height: '34px', fontSize: '12px' }}
            value={selectedCustomer?.id || ''}
            onChange={(e) => {
              const cust = customers.find((c) => c.id === Number(e.target.value));
              setSelectedCustomer(cust || null);
            }}
          >
            <option value="">👤 Walk-in Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                👤 {c.name} ({c.mobile}) - Points: {c.loyalty_points || 0}
              </option>
            ))}
          </select>
          <button
            className="nav-btn"
            onClick={() => setIsCustomerModalOpen(true)}
            title="Register new customer"
            style={{ height: '34px' }}
          >
            <UserPlus size={15} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <ShoppingCart size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Cart is empty</p>
              <p style={{ fontSize: '11.5px', marginTop: 4 }}>Scan barcode or tap garment to add</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.sku} className="cart-item-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {item.size && `Size: ${item.size}`} {item.color && `| ${item.color}`} @ ₹{item.rate}
                  </div>
                </div>

                <div className="cart-qty-ctrl">
                  <button className="cart-qty-btn" onClick={() => updateQty(item.sku, item.qty - 1)}>
                    <Minus size={12} />
                  </button>
                  <span className="cart-qty-val">{item.qty}</span>
                  <button className="cart-qty-btn" onClick={() => updateQty(item.sku, item.qty + 1)}>
                    <Plus size={12} />
                  </button>
                </div>

                <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', textAlign: 'right', minWidth: '60px' }}>
                  ₹{(item.rate * item.qty).toFixed(2)}
                </div>

                <button
                  onClick={() => removeItem(item.sku)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Totals & Discounts Section */}
        <div className="cart-totals-section">
          <div className="cart-totals-row">
            <span>Subtotal</span>
            <span>₹ {totals.subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bill Discount:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="number"
                min="0"
                value={billDiscount || ''}
                placeholder="0"
                onChange={(e) => setBillDiscount(Number(e.target.value))}
                style={{ width: '70px', height: '26px', padding: '0 6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px', textAlign: 'right' }}
              />
              <button
                type="button"
                onClick={() => setDiscountType(discountType === 'flat' ? 'percent' : 'flat')}
                style={{ height: '26px', padding: '0 6px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg-card)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                {discountType === 'flat' ? '₹' : '%'}
              </button>
            </div>
          </div>

          <div className="cart-totals-row" style={{ fontSize: '11px' }}>
            <span>Taxable: ₹{totals.taxableAmount.toFixed(2)}</span>
            <span>CGST+SGST: ₹{(totals.cgst + totals.sgst).toFixed(2)}</span>
          </div>

          {totals.roundOff !== 0 && (
            <div className="cart-totals-row" style={{ fontSize: '11px' }}>
              <span>Round Off</span>
              <span>₹ {totals.roundOff.toFixed(2)}</span>
            </div>
          )}

          <div className="cart-totals-row grand">
            <span>NET PAYABLE</span>
            <span>₹ {totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="cart-action-buttons">
          <button className="btn-secondary" onClick={holdCurrentBill}>
            <Pause size={16} />
            <span>Hold</span>
          </button>
          <button className="btn-primary" onClick={handleOpenCheckout}>
            <Banknote size={18} />
            <span>Pay ₹{totals.grandTotal} (F4)</span>
          </button>
        </div>
      </div>

      {/* PAYMENT SETTLEMENT MODAL */}
      {isPayModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Settle Payment • ₹ {totals.grandTotal}</h3>
              <button onClick={() => setIsPayModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Payment Mode Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                {['Cash', 'UPI', 'Card', 'Credit'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    style={{
                      padding: '12px 6px',
                      borderRadius: '8px',
                      border: paymentMode === mode ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: paymentMode === mode ? 'var(--accent-light)' : 'var(--bg-card)',
                      color: paymentMode === mode ? 'var(--accent)' : 'var(--text-main)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '13px',
                      textAlign: 'center',
                    }}
                  >
                    {mode === 'Cash' && '💵 Cash'}
                    {mode === 'UPI' && '📱 UPI QR'}
                    {mode === 'Card' && '💳 Card'}
                    {mode === 'Credit' && '📑 Due Credit'}
                  </button>
                ))}
              </div>

              {/* Mode Specific Inputs */}
              {paymentMode === 'Cash' && (
                <div>
                  <div className="form-group">
                    <label>Cash Tendered (₹):</label>
                    <input
                      type="number"
                      autoFocus
                      className="form-control"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      style={{ fontSize: '20px', fontWeight: 800, height: '44px' }}
                    />
                  </div>
                  {Number(cashTendered) > totals.grandTotal && (
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '15px' }}>
                      Change to Return: ₹ {(Number(cashTendered) - totals.grandTotal).toFixed(2)}
                    </div>
                  )}
                </div>
              )}

              {paymentMode === 'UPI' && (
                <div>
                  {/* QR & Device Dispatch Hub */}
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'center', background: 'var(--bg-card-subtle)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ textAlign: 'center', background: '#ffffff', padding: 8, borderRadius: 8, border: '1px solid var(--border)', display: 'inline-block' }}>
                      <QRCodeSVG
                        value={`upi://pay?pa=${storeSettings?.upiId || 'tamildress@upi'}&pn=${encodeURIComponent(storeSettings?.storeName || 'TamilDress')}&am=${totals.grandTotal}&cu=INR`}
                        size={124}
                      />
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#4b5563', marginTop: 4 }}>UPI DYNAMIC QR</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                        <span>Soundbox & UPI Device Sync: Active</span>
                      </div>

                      <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                        ₹ {totals.grandTotal.toFixed(2)}
                      </div>

                      {/* Device Action Buttons */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {/* Open Customer-Facing Mobile Display */}
                        <button
                          type="button"
                          className="nav-btn"
                          onClick={() => setIsCustomerDisplayOpen(true)}
                          style={{ fontSize: '11.5px', padding: '5px 10px', background: '#4f46e5', color: '#ffffff', border: 'none' }}
                        >
                          📱 Customer Screen
                        </button>

                        {/* Soundbox Voice Trigger */}
                        <button
                          type="button"
                          className="nav-btn"
                          onClick={playVoiceConfirmation}
                          style={{ fontSize: '11.5px', padding: '5px 10px' }}
                          title="Trigger Paytm/PhonePe SmartSpeaker Voice Announcement"
                        >
                          🔊 Soundbox Ping
                        </button>

                        {/* Send WhatsApp Link if customer mobile exists */}
                        {selectedCustomer?.mobile && (
                          <a
                            href={`https://wa.me/91${selectedCustomer.mobile}?text=${encodeURIComponent(
                              `Hello ${selectedCustomer.name}, your bill at ${storeSettings?.storeName || 'Tamil Dress Collection'} is ₹${totals.grandTotal}. Pay via UPI: upi://pay?pa=${storeSettings?.upiId || 'tamildress@upi'}&pn=TamilDress&am=${totals.grandTotal}&cu=INR`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="nav-btn"
                            style={{ fontSize: '11.5px', padding: '5px 10px', color: '#16a34a', textDecoration: 'none' }}
                          >
                            💬 WhatsApp Link
                          </a>
                        )}

                        {/* Open Direct UPI Intent */}
                        <a
                          href={`upi://pay?pa=${storeSettings?.upiId || 'tamildress@upi'}&pn=${encodeURIComponent(storeSettings?.storeName || 'TamilDress')}&am=${totals.grandTotal}&cu=INR`}
                          className="nav-btn"
                          style={{ fontSize: '11.5px', padding: '5px 10px', textDecoration: 'none' }}
                        >
                          ⚡ GPay / PhonePe App
                        </a>
                      </div>
                    </div>
                  </div>

                  <p style={{ marginTop: 10, fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Customer can scan QR, or complete payment via Paytm Soundbox / PhonePe SmartSpeaker.
                  </p>
                </div>
              )}

              {paymentMode === 'Credit' && (
                <div style={{ padding: '12px', borderRadius: '8px', background: '#fffbeb', color: '#92400e', fontSize: '12px' }}>
                  ⚠️ This invoice amount of ₹{totals.grandTotal} will be added to customer's outstanding ledger due balance.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCompletePayment}>
                <Check size={16} />
                <span>Confirm & Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK CUSTOMER MODAL */}
      {isCustomerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '380px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Quick Customer Registration</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mobile Number (Required):</label>
                  <input
                    type="tel"
                    required
                    autoFocus
                    className="form-control"
                    placeholder="9876543210"
                    value={newCustMobile}
                    onChange={(e) => setNewCustMobile(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Customer Full Name:</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Senthil Kumar"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsCustomerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED CUSTOMER-FACING MOBILE QR DISPLAY MODAL */}
      {isCustomerDisplayOpen && (
        <div className="modal-overlay" style={{ zIndex: 100000 }}>
          <div className="modal-dialog" style={{ maxWidth: '440px', textAlign: 'center', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="badge success">Customer-Facing Screen</span>
              <button onClick={() => setIsCustomerDisplayOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
              {storeSettings?.storeName || 'TAMIL DRESS COLLECTION'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 16 }}>
              {storeSettings?.storeNameTamil || 'தமிழ் டிரஸ் கலெக்ஷன்'}
            </p>

            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, display: 'inline-block', border: '2px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <QRCodeSVG
                value={`upi://pay?pa=${storeSettings?.upiId || 'tamildress@upi'}&pn=${encodeURIComponent(storeSettings?.storeName || 'TamilDress')}&am=${totals.grandTotal}&cu=INR`}
                size={210}
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Amount to Pay:</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                ₹ {totals.grandTotal.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Scan using Google Pay, PhonePe, Paytm, or BHIM UPI app
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setIsCustomerDisplayOpen(false)} style={{ flex: 1 }}>
                Close Display
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  playVoiceConfirmation();
                  setIsCustomerDisplayOpen(false);
                }}
                style={{ flex: 1.5 }}
              >
                🔊 Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE RECEIPT MODAL */}
      {completedSale && (
        <ReceiptModal
          sale={completedSale}
          storeSettings={storeSettings}
          onClose={() => setCompletedSale(null)}
        />
      )}
    </div>
  );
}
