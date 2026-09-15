/* ==========================================================================
   TAMIL DRESS COLLECTION - POS & INVENTORY SERVICE LAYER & BUSINESS LOGIC
   ========================================================================== */

// --- REALISTIC SEED DATA ---
const SEED_PRODUCTS = [
  // Shirts
  { sku: "SH001-WHT-S", barcode: "8901001", name: "Classic Cotton Formal Shirt", category: "Shirts", brand: "Louis Philippe", size: "S", color: "White", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 600, sellingPrice: 1499, mrp: 1799, stock: 15, reorderLevel: 5, supplierId: "SUP001" },
  { sku: "SH001-WHT-M", barcode: "8901002", name: "Classic Cotton Formal Shirt", category: "Shirts", brand: "Louis Philippe", size: "M", color: "White", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 600, sellingPrice: 1499, mrp: 1799, stock: 12, reorderLevel: 5, supplierId: "SUP001" },
  { sku: "SH001-BLU-M", barcode: "8901003", name: "Classic Cotton Formal Shirt", category: "Shirts", brand: "Louis Philippe", size: "M", color: "Blue", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 600, sellingPrice: 1499, mrp: 1799, stock: 8, reorderLevel: 5, supplierId: "SUP001" },
  { sku: "SH001-BLU-L", barcode: "8901004", name: "Classic Cotton Formal Shirt", category: "Shirts", brand: "Louis Philippe", size: "L", color: "Blue", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 600, sellingPrice: 1499, mrp: 1799, stock: 14, reorderLevel: 5, supplierId: "SUP001" },

  { sku: "SH002-NVY-M", barcode: "8901005", name: "Premium Linen Shirt", category: "Shirts", brand: "Zodiac", size: "M", color: "Navy", fabric: "Linen", hsn: "6205", gstRate: 5, costPrice: 900, sellingPrice: 1999, mrp: 2499, stock: 6, reorderLevel: 3, supplierId: "SUP001" },
  { sku: "SH002-NVY-L", barcode: "8901006", name: "Premium Linen Shirt", category: "Shirts", brand: "Zodiac", size: "L", color: "Navy", fabric: "Linen", hsn: "6205", gstRate: 5, costPrice: 900, sellingPrice: 1999, mrp: 2499, stock: 4, reorderLevel: 3, supplierId: "SUP001" },
  { sku: "SH002-GRY-L", barcode: "8901007", name: "Premium Linen Shirt", category: "Shirts", brand: "Zodiac", size: "L", color: "Grey", fabric: "Linen", hsn: "6205", gstRate: 5, costPrice: 900, sellingPrice: 1999, mrp: 2499, stock: 12, reorderLevel: 3, supplierId: "SUP001" },

  // Jeans
  { sku: "JN001-BLK-32", barcode: "8901008", name: "Slim Fit Denim Jeans", category: "Jeans", brand: "Levi's", size: "M", color: "Black", fabric: "Denim", hsn: "6203", gstRate: 12, costPrice: 1100, sellingPrice: 2299, mrp: 2999, stock: 8, reorderLevel: 4, supplierId: "SUP002" },
  { sku: "JN001-BLK-34", barcode: "8901009", name: "Slim Fit Denim Jeans", category: "Jeans", brand: "Levi's", size: "L", color: "Black", fabric: "Denim", hsn: "6203", gstRate: 12, costPrice: 1100, sellingPrice: 2299, mrp: 2999, stock: 10, reorderLevel: 4, supplierId: "SUP002" },
  { sku: "JN001-BLU-32", barcode: "8901010", name: "Slim Fit Denim Jeans", category: "Jeans", brand: "Levi's", size: "M", color: "Blue", fabric: "Denim", hsn: "6203", gstRate: 12, costPrice: 1100, sellingPrice: 2299, mrp: 2999, stock: 5, reorderLevel: 4, supplierId: "SUP002" },

  { sku: "JN002-BLU-30", barcode: "8901011", name: "Stretchable Denim Jeans", category: "Jeans", brand: "Pepe Jeans", size: "S", color: "Blue", fabric: "Denim", hsn: "6203", gstRate: 12, costPrice: 1000, sellingPrice: 1899, mrp: 2599, stock: 0, reorderLevel: 4, supplierId: "SUP002" }, // Out of stock test
  { sku: "JN002-BLU-32", barcode: "8901012", name: "Stretchable Denim Jeans", category: "Jeans", brand: "Pepe Jeans", size: "M", color: "Blue", fabric: "Denim", hsn: "6203", gstRate: 12, costPrice: 1000, sellingPrice: 1899, mrp: 2599, stock: 2, reorderLevel: 4, supplierId: "SUP002" }, // Low stock test

  // Chinos / Trousers
  { sku: "TR001-KHK-32", barcode: "8901013", name: "Smart Casual Chino Pants", category: "Trousers", brand: "US Polo Assn", size: "M", color: "Khaki", fabric: "Cotton Blend", hsn: "6203", gstRate: 12, costPrice: 800, sellingPrice: 1699, mrp: 2199, stock: 14, reorderLevel: 5, supplierId: "SUP002" },
  { sku: "TR001-KHK-34", barcode: "8901014", name: "Smart Casual Chino Pants", category: "Trousers", brand: "US Polo Assn", size: "L", color: "Khaki", fabric: "Cotton Blend", hsn: "6203", gstRate: 12, costPrice: 800, sellingPrice: 1699, mrp: 2199, stock: 11, reorderLevel: 5, supplierId: "SUP002" },
  { sku: "TR001-OLV-32", barcode: "8901015", name: "Smart Casual Chino Pants", category: "Trousers", brand: "US Polo Assn", size: "M", color: "Olive", fabric: "Cotton Blend", hsn: "6203", gstRate: 12, costPrice: 800, sellingPrice: 1699, mrp: 2199, stock: 7, reorderLevel: 5, supplierId: "SUP002" },

  { sku: "TR002-BLK-30", barcode: "8901016", name: "Formal Black Trouser", category: "Formal Pants", brand: "Raymond", size: "S", color: "Black", fabric: "Polyester", hsn: "6203", gstRate: 12, costPrice: 700, sellingPrice: 1399, mrp: 1899, stock: 20, reorderLevel: 6, supplierId: "SUP001" },
  { sku: "TR002-BLK-32", barcode: "8901017", name: "Formal Black Trouser", category: "Formal Pants", brand: "Raymond", size: "M", color: "Black", fabric: "Polyester", hsn: "6203", gstRate: 12, costPrice: 700, sellingPrice: 1399, mrp: 1899, stock: 15, reorderLevel: 6, supplierId: "SUP001" },
  { sku: "TR002-BLK-34", barcode: "8901018", name: "Formal Black Trouser", category: "Formal Pants", brand: "Raymond", size: "L", color: "Black", fabric: "Polyester", hsn: "6203", gstRate: 12, costPrice: 700, sellingPrice: 1399, mrp: 1899, stock: 18, reorderLevel: 6, supplierId: "SUP001" },

  // T-Shirts
  { sku: "TS001-BLK-M", barcode: "8901019", name: "Premium Polo T-Shirt", category: "T-Shirts", brand: "Tommy Hilfiger", size: "M", color: "Black", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 400, sellingPrice: 999, mrp: 1199, stock: 25, reorderLevel: 8, supplierId: "SUP002" },
  { sku: "TS001-BLK-L", barcode: "8901020", name: "Premium Polo T-Shirt", category: "T-Shirts", brand: "Tommy Hilfiger", size: "L", color: "Black", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 400, sellingPrice: 999, mrp: 1199, stock: 20, reorderLevel: 8, supplierId: "SUP002" },
  { sku: "TS001-RED-M", barcode: "8901021", name: "Premium Polo T-Shirt", category: "T-Shirts", brand: "Tommy Hilfiger", size: "M", color: "Red", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 400, sellingPrice: 999, mrp: 1199, stock: 15, reorderLevel: 8, supplierId: "SUP002" },

  // Kurtas
  { sku: "KR001-WHT-M", barcode: "8901022", name: "Cotton Kurta", category: "Kurtas", brand: "Manyavar", size: "M", color: "White", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 500, sellingPrice: 1199, mrp: 1499, stock: 12, reorderLevel: 4, supplierId: "SUP001" },
  { sku: "KR001-WHT-L", barcode: "8901023", name: "Cotton Kurta", category: "Kurtas", brand: "Manyavar", size: "L", color: "White", fabric: "Cotton", hsn: "6205", gstRate: 5, costPrice: 500, sellingPrice: 1199, mrp: 1499, stock: 10, reorderLevel: 4, supplierId: "SUP001" },

  // Blazers
  { sku: "BZ001-BLU-XL", barcode: "8901024", name: "Men's Linen Blazer", category: "Blazers", brand: "Raymond", size: "XL", color: "Blue", fabric: "Linen", hsn: "6203", gstRate: 12, costPrice: 2200, sellingPrice: 4499, mrp: 5999, stock: 5, reorderLevel: 2, supplierId: "SUP001" },
  { sku: "BZ001-NVY-L", barcode: "8901025", name: "Men's Linen Blazer", category: "Raymond", size: "L", color: "Navy", fabric: "Linen", hsn: "6203", gstRate: 12, costPrice: 2200, sellingPrice: 4499, mrp: 5999, stock: 4, reorderLevel: 2, supplierId: "SUP001" },

  // Accessories
  { sku: "AC001-BRW-FS", barcode: "8901026", name: "Leather Belt", category: "Belts", brand: "Woodland", size: "Free Size", color: "Brown", fabric: "Leather", hsn: "4203", gstRate: 18, costPrice: 300, sellingPrice: 799, mrp: 999, stock: 30, reorderLevel: 5, supplierId: "SUP001" },
  { sku: "AC002-BLK-FS", barcode: "8901027", name: "Slim Leather Wallet", category: "Wallets", brand: "Wildhorn", size: "Free Size", color: "Black", fabric: "Leather", hsn: "4202", gstRate: 18, costPrice: 250, sellingPrice: 599, mrp: 799, stock: 25, reorderLevel: 5, supplierId: "SUP001" },
  { sku: "AC003-GRY-FS", barcode: "8901028", name: "Cotton Cushion Socks", category: "Socks", brand: "Puma", size: "Free Size", color: "Grey", fabric: "Cotton", hsn: "6115", gstRate: 5, costPrice: 80, sellingPrice: 199, mrp: 249, stock: 50, reorderLevel: 10, supplierId: "SUP002" }
];

const SEED_CUSTOMERS = [
  { mobile: "9876543210", name: "Senthil Kumar", email: "senthil@gmail.com", address: "12, Extension Nagar, Salem", loyaltyPoints: 350, outstandingDue: 0, totalPurchases: 15450, lastPurchaseDate: "2026-08-20" },
  { mobile: "9443218765", name: "Kavitha Murugan", email: "kavitha@yahoo.com", address: "45, Bypass Road, Salem", loyaltyPoints: 520, outstandingDue: 1200, totalPurchases: 22800, lastPurchaseDate: "2026-08-22" },
  { mobile: "9001234567", name: "Rajesh Kannan", email: "rajesh@gmail.com", address: "78, Main Road, Salem", loyaltyPoints: 120, outstandingDue: 0, totalPurchases: 5400, lastPurchaseDate: "2026-08-24" }
];

const SEED_SUPPLIERS = [
  { id: "SUP001", name: "Sri Lakshmi Silks Wholesale", phone: "9840012345", address: "144, Kancheepuram Temple Rd, Kancheepuram", gstin: "33AAACS1234F1Z1", totalPurchases: 450000, paid: 415000, outstandingDue: 35000 },
  { id: "SUP002", name: "Surat Synthetic Mills Ltd", phone: "9825099887", address: "Plot 12, GIDC Apparel Park, Surat, Gujarat", gstin: "24AABCS4321D1Z0", totalPurchases: 280000, paid: 280000, outstandingDue: 0 }
];

const SEED_EXPENSES = [
  { id: "EXP001", date: "2026-08-23", category: "Shop Rent", description: "Monthly Store Rent Payment", paymentMethod: "Bank Transfer", amount: 15000 },
  { id: "EXP002", date: "2026-08-23", category: "Electricity", description: "EB Bill Store Lighting & AC", paymentMethod: "UPI GPay", amount: 3450 },
  { id: "EXP003", date: "2026-08-25", category: "Salary", description: "Salary helper staff", paymentMethod: "Cash", amount: 8000 }
];

const SEED_SALES = [
  {
    invoiceNo: "INV-2026-000001",
    dateTime: "2026-08-25T11:20:00",
    customerMobile: "9876543210",
    customerName: "Senthil Kumar",
    items: [
      { sku: "SH001-WHT-M", name: "Classic Cotton Formal Shirt", size: "M", color: "White", qty: 2, rate: 1499, mrp: 1799, discountType: "flat", discountValue: 0, discountAmount: 0, gstRate: 5, taxableAmount: 2855.24, cgst: 71.38, sgst: 71.38, igst: 0, total: 2998 }
    ],
    subtotal: 2998,
    itemDiscount: 0,
    billDiscount: 100,
    taxableAmount: 2760,
    cgst: 69,
    sgst: 69,
    igst: 0,
    roundOff: 0,
    grandTotal: 2898,
    paymentMode: "Cash",
    amountPaid: 3000,
    changeReturned: 102,
    status: "Completed"
  },
  {
    invoiceNo: "INV-2026-000002",
    dateTime: "2026-08-26T08:15:00",
    customerMobile: "9443218765",
    customerName: "Kavitha Murugan",
    items: [
      { sku: "JN001-BLK-32", name: "Slim Fit Denim Jeans", size: "M", color: "Black", qty: 1, rate: 2299, mrp: 2999, discountType: "flat", discountValue: 0, discountAmount: 0, gstRate: 12, taxableAmount: 2052.68, cgst: 123.16, sgst: 123.16, igst: 0, total: 2299 },
      { sku: "TS001-BLK-M", name: "Premium Polo T-Shirt", size: "M", color: "Black", qty: 1, rate: 999, mrp: 1199, discountType: "flat", discountValue: 0, discountAmount: 0, gstRate: 5, taxableAmount: 951.43, cgst: 23.79, sgst: 23.79, igst: 0, total: 999 }
    ],
    subtotal: 3298,
    itemDiscount: 0,
    billDiscount: 0,
    taxableAmount: 3004.11,
    cgst: 146.95,
    sgst: 146.95,
    igst: 0,
    roundOff: -0.01,
    grandTotal: 3298,
    paymentMode: "UPI",
    amountPaid: 3298,
    changeReturned: 0,
    status: "Completed"
  }
];

const SEED_SETTINGS = {
  storeName: "TAMIL DRESS COLLECTION",
  storeNameTamil: "தமிழ் டிரஸ் கலெக்ஷன்",
  address: "142, Main Road, Near Bus Stand, Salem - 636001",
  gstin: "33ABCDE1234F1Z5",
  phone: "9876543210",
  upiId: "tamildress@upi",
  printerWidth: "80mm",
  roundOffEnabled: true,
  taxCalculationType: "Local" // Local (CGST+SGST) or Interstate (IGST)
};

const SEED_USERS = [
  { username: "admin", role: "ADMIN", pin: "1111", name: "Administrator" }
];

// --- INITIALIZE DATA SERVICE LAYER ---
class DataStore {
  static get(key, defaultValue) {
    const val = localStorage.getItem("tdc_" + key);
    return val ? JSON.parse(val) : defaultValue;
  }

  static set(key, value) {
    localStorage.setItem("tdc_" + key, JSON.stringify(value));
  }

  static init() {
    if (!localStorage.getItem("tdc_products")) this.set("products", SEED_PRODUCTS);
    if (!localStorage.getItem("tdc_customers")) this.set("customers", SEED_CUSTOMERS);
    if (!localStorage.getItem("tdc_suppliers")) this.set("suppliers", SEED_SUPPLIERS);
    if (!localStorage.getItem("tdc_expenses")) this.set("expenses", SEED_EXPENSES);
    if (!localStorage.getItem("tdc_sales")) this.set("sales", SEED_SALES);
    if (!localStorage.getItem("tdc_settings")) this.set("settings", SEED_SETTINGS);
    if (!localStorage.getItem("tdc_returns")) this.set("returns", []);
    if (!localStorage.getItem("tdc_purchases")) this.set("purchases", []);
    if (!localStorage.getItem("tdc_stock_movements")) {
      // Record initial opening stock movements
      const prods = this.get("products", SEED_PRODUCTS);
      const movements = prods.map(p => ({
        id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        sku: p.sku,
        type: "Opening",
        qty: p.stock,
        referenceNo: "SYS-INIT",
        dateTime: new Date().toISOString(),
        notes: "Opening Stock Initialization"
      }));
      this.set("stock_movements", movements);
    }
  }
}

// Global state variables
let state = {
  currentView: "dashboard",
  products: [],
  customers: [],
  suppliers: [],
  expenses: [],
  sales: [],
  returns: [],
  purchases: [],
  stockMovements: [],
  settings: {},
  users: [],
  currentUser: null,
  viewMode: "cashier", // cashier or admin
  selectedProductSkus: [],
  auditLogs: [],

  // Active POS cart details
  cart: [],
  selectedCustomer: null,
  activeCategoryFilter: "All",
  searchQuery: "",
  heldBills: [],
  invoiceNoCounter: 3,

  // Payment settlement modal state
  selectedPaymentMode: "Cash",
  paymentModalTotal: 0
};

// --- INITIAL DATA LOAD ---
function loadStateFromStorage() {
  DataStore.init();
  state.products = DataStore.get("products", []);
  state.customers = DataStore.get("customers", []);
  state.suppliers = DataStore.get("suppliers", []);
  state.expenses = DataStore.get("expenses", []);
  state.sales = DataStore.get("sales", []);
  state.returns = DataStore.get("returns", []);
  state.purchases = DataStore.get("purchases", []);
  state.stockMovements = DataStore.get("stock_movements", []);
  state.settings = DataStore.get("settings", {});
  state.heldBills = DataStore.get("held_bills", []);

  state.users = DataStore.get("users", SEED_USERS).filter(u => u.role === "ADMIN");
  if (state.users.length === 0) {
    state.users = [{ username: "admin", role: "ADMIN", pin: "1111", name: "Administrator" }];
  }
  state.auditLogs = DataStore.get("audit_logs", []);
  state.currentUser = state.users[0]; // Default to admin
  state.viewMode = "admin";
  state.selectedProductSkus = [];

  // Compute next available invoice number
  if (state.sales.length > 0) {
    const nos = state.sales.map(s => {
      const match = s.invoiceNo.match(/INV-\d+-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxVal = Math.max(...nos, 0);
    state.invoiceNoCounter = maxVal + 1;
  } else {
    state.invoiceNoCounter = 1;
  }
}

function saveStateToStorage() {
  DataStore.set("products", state.products);
  DataStore.set("customers", state.customers);
  DataStore.set("suppliers", state.suppliers);
  DataStore.set("expenses", state.expenses);
  DataStore.set("sales", state.sales);
  DataStore.set("returns", state.returns);
  DataStore.set("purchases", state.purchases);
  DataStore.set("stock_movements", state.stockMovements);
  DataStore.set("settings", state.settings);
  DataStore.set("held_bills", state.heldBills);

  DataStore.set("users", state.users);
  DataStore.set("audit_logs", state.auditLogs);
  DataStore.set("current_user", state.currentUser);
  DataStore.set("view_mode", state.viewMode);
}

// --- UTILITY TOAST NOTIFICATIONS ---
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;

  let icon = "fa-circle-check";
  if (type === "error") icon = "fa-circle-xmark";
  if (type === "warning") icon = "fa-triangle-exclamation";
  if (type === "info") icon = "fa-circle-info";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-fade-out");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.className = "toast-container";
  document.body.appendChild(container);
  return container;
}

// --- SWITCH PANELS VIEW ---
function switchModuleView(viewName, buttonEl = null) {
  state.currentView = viewName;

  // Auto-close mobile sidebar drawer if it is open
  try {
    toggleMobileSidebar(false);
  } catch (e) { }

  // Deactivate all sections and menus
  document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".sidebar-menu-btn").forEach(b => b.classList.remove("active"));

  // Activate selected panel
  const panel = document.getElementById(`view-${viewName}`);
  if (panel) panel.classList.add("active");

  // Set navbar title
  const titleMap = {
    dashboard: "Dashboard Overview",
    pos: "Sales / POS Billing Engine",
    products: "Item Master & Variant Matrix",
    inventory: "Inventory Valuation Ledger",
    purchases: "Wholesale Purchase Intake",
    suppliers: "Supplier Ledger Matrix",
    customers: "Customer Directory & Credit",
    expenses: "Operational Store Expenses",
    gst: "GST & HSN Configuration",
    reports: "Analytics & Sales Audit",
    settings: "Settings & System Profiles",
    "admin-dashboard": "Admin Control Dashboard",
    "admin-add-product": "Add/Edit Apparel Products & Variants",
    "admin-barcodes": "Barcode Label sheet Manager",
    "admin-categories": "Category & Brand Configuration",
    "admin-users": "Users & Role Permissions",
    "admin-audit-logs": "Chronological System Audit Trail"
  };

  const titleHeading = document.getElementById("current-view-title");
  if (titleHeading) {
    titleHeading.innerText = titleMap[viewName] || "Tamil Dress POS";
  }

  // Handle active class styling on sidebar buttons
  if (buttonEl) {
    buttonEl.classList.add("active");
  } else {
    // Find sidebar button based on switch target
    const btn = Array.from(document.querySelectorAll(".sidebar-menu-btn")).find(b => {
      const clickAttr = b.getAttribute("onclick") || "";
      return clickAttr.includes(`'${viewName}'`);
    });
    if (btn) btn.classList.add("active");
  }

  // Render respective module data
  if (viewName === "dashboard") {
    switchModuleView("admin-dashboard");
  }
  else if (viewName === "admin-dashboard") renderAdminDashboard();
  else if (viewName === "pos") {
    renderPosCatalog();
    renderPosCart();
    refocusBarcode();
  }
  else if (viewName === "products") {
    renderAdminProductsList();
  }
  else if (viewName === "admin-add-product") {
    // Basic initialization for empty add product view if needed
  }
  else if (viewName === "inventory") renderInventoryStock();
  else if (viewName === "purchases") renderPurchases();
  else if (viewName === "expenses") renderExpenses();
  else if (viewName === "reports") renderReports();
  else if (viewName === "customers") renderCustomers();
  else if (viewName === "suppliers") renderSuppliers();
  else if (viewName === "settings") loadSettingsInUi();
  else if (viewName === "admin-barcodes") renderBarcodeMgmtList();
  else if (viewName === "admin-categories") renderCategoriesAndBrandsMgmt();
  else if (viewName === "admin-users") renderUsersMgmt();
  else if (viewName === "admin-audit-logs") renderAuditLogsList();
}

// --- MODAL UTILITIES ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    if (modalId === "modal-pay") {
      refocusCashInput();
    }
  }
}

// Close dynamic modal overlay
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    refocusBarcode();
  }
}

// Close all active modal overlays
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
  refocusBarcode();
}

// --- REFOCUS INPUT FUNCTIONS ---
function refocusBarcode() {
  if (state.currentView !== "pos") return;
  setTimeout(() => {
    const barcodeInput = document.getElementById("pos-barcode-input");
    if (barcodeInput) {
      barcodeInput.focus();
      barcodeInput.select();
    }
  }, 100);
}

function refocusCashInput() {
  setTimeout(() => {
    const cashInput = document.getElementById("cash-given-val");
    if (cashInput) {
      cashInput.focus();
      cashInput.select();
    }
  }, 150);
}

// ==========================================================================
// MODULE: POS CATALOG VIEW & FILTERING & SEARCHING
// ==========================================================================

function getUniqueCategories() {
  const cats = state.products.map(p => p.category);
  return ["All", ...new Set(cats)];
}

function renderPosCatalog() {
  const container = document.getElementById("pos-apparel-grid");
  const chipsContainer = document.getElementById("pos-cat-chips");
  const searchInput = document.getElementById("pos-barcode-input");

  if (!container || !chipsContainer) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  state.searchQuery = query;

  // 1. Render Category Filter Chips
  const cats = getUniqueCategories();
  chipsContainer.innerHTML = cats.map(cat => {
    const activeClass = state.activeCategoryFilter === cat ? "active" : "";
    return `<button class="cat-btn ${activeClass}" onclick="setCategoryFilter('${cat}')">${cat}</button>`;
  }).join("");

  // 2. Filter products based on search query and category chips
  const filtered = state.products.filter(p => {
    const matchesCategory = state.activeCategoryFilter === "All" || p.category === state.activeCategoryFilter;

    // Check barcode match
    if (p.barcode === query) return matchesCategory;

    // Check text search (SKU, brand, name, variant color/size)
    const matchText = p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.color.toLowerCase().includes(query) ||
      p.size.toLowerCase().includes(query);

    return matchesCategory && matchText;
  });

  // 3. Populate product grid cards
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-face-frown" style="font-size: 32px; margin-bottom: 10px; display: block;"></i>
        No matching clothing items found. Check barcode or query.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const isOutOfStock = p.stock === 0;
    const isLowStock = p.stock > 0 && p.stock <= p.reorderLevel;

    let stockBadge = "";
    if (isOutOfStock) {
      stockBadge = `<span class="badge-tag" style="background:var(--danger-bg); color:var(--danger);">OUT OF STOCK</span>`;
    } else if (isLowStock) {
      stockBadge = `<span class="badge-tag" style="background:var(--warning-bg); color:var(--warning);">LOW STOCK (${p.stock})</span>`;
    } else {
      stockBadge = `<span class="badge-tag" style="background:var(--success-bg); color:var(--success);">Qty: ${p.stock}</span>`;
    }

    return `
      <div class="apparel-item-card ${isOutOfStock ? 'disabled-card' : ''}" onclick="addCartItemBySku('${p.sku}')">
        <div class="apparel-card-top">
          <div class="apparel-icon-box"><i class="fa-solid fa-shirt"></i></div>
          <div style="text-align: right; display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
            <span style="font-size:10px; font-weight:700; color:var(--text-muted);">${p.brand}</span>
            ${stockBadge}
          </div>
        </div>
        <div class="apparel-title">${p.name}</div>
        <div class="variant-tags">
          <span class="badge-tag badge-size">Size: ${p.size}</span>
          <span class="badge-tag badge-color">${p.color}</span>
          <span class="badge-tag badge-fabric">${p.fabric}</span>
        </div>
        <div class="apparel-card-btm">
          <div class="price-tag">₹${p.sellingPrice.toLocaleString('en-IN')}</div>
          <button class="btn-add-item" ${isOutOfStock ? 'disabled' : ''}>
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function setCategoryFilter(category) {
  state.activeCategoryFilter = category;
  renderPosCatalog();
  refocusBarcode();
}

// Handle scanning event when enter is pressed on barcode input
function handleBarcodeEnter(event) {
  if (event.key === "Enter") {
    const input = document.getElementById("pos-barcode-input");
    if (!input) return;

    const value = input.value.trim();
    if (value === "") return;

    // Search by barcode code or exact SKU
    const item = state.products.find(p => p.barcode === value || p.sku.toLowerCase() === value.toLowerCase());

    if (item) {
      addCartItemBySku(item.sku);
      input.value = "";
      renderPosCatalog();
    } else {
      // Look for fuzzy matching. If only one matches, add it.
      const query = value.toLowerCase();
      const fuzzyMatches = state.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );

      if (fuzzyMatches.length === 1) {
        addCartItemBySku(fuzzyMatches[0].sku);
        input.value = "";
        renderPosCatalog();
      } else if (fuzzyMatches.length > 1) {
        showToast(`Multiple products matched "${value}". Please select from list.`, "info");
      } else {
        // Open Product Not Found modal / message
        showBarcodeNotFound(value);
      }
    }
  }
}

// Show helper dialog if barcode scanned doesn't exist
function showBarcodeNotFound(barcode) {
  const template = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-size: 40px; color: var(--danger); margin-bottom:15px;"><i class="fa-solid fa-barcode"></i></div>
      <h3 style="font-size:16px; font-weight:800; margin-bottom:10px;">Barcode Code Not Registered</h3>
      <p style="color:var(--text-muted); margin-bottom:20px; font-size:12px;">Apparel barcode <b>"${barcode}"</b> could not be located in current product master catalog.</p>
      <div style="display:flex; justify-content:center; gap:10px;">
        <button class="btn-action-checkout" style="background:var(--border); color:var(--text-main);" onclick="closeAllModals()">Cancel</button>
        <button class="btn-action-checkout btn-pay" onclick="triggerAddNewProductModal('${barcode}')">Add New Item</button>
      </div>
    </div>
  `;

  // Set content in payment modal overlay for quick messaging
  const modal = document.getElementById("modal-pay");
  const modalHeader = modal.querySelector(".modal-card-header h3");
  const modalBody = modal.querySelector(".modal-card-body");
  const modalFooter = modal.querySelector(".modal-card-footer");

  modalHeader.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> System Exception`;
  modalBody.innerHTML = template;
  modalFooter.style.display = "none"; // Hide standard footer

  // Overwrite close overlay action
  modal.querySelector(".modal-close-btn").setAttribute("onclick", "closeAndRestorePayModal()");
  openModal("modal-pay");
}

function closeAndRestorePayModal() {
  const modal = document.getElementById("modal-pay");
  const modalFooter = modal.querySelector(".modal-card-footer");
  modalFooter.style.display = "flex"; // Restore footer
  closeModal("modal-pay");
}

function triggerAddNewProductModal(barcode) {
  closeAndRestorePayModal();
  const inputBarcode = document.getElementById("new-barcode");
  if (inputBarcode) inputBarcode.value = barcode;
  openModal("modal-add-product");
}

// ==========================================================================
// MODULE: POS CHECKOUT CART MANAGEMENT
// ==========================================================================

function addCartItemBySku(sku) {
  const product = state.products.find(p => p.sku === sku);
  if (!product) return;

  // 1. Stock verification
  if (product.stock === 0) {
    showToast(`"${product.name}" is completely stock-out!`, "error");
    refocusBarcode();
    return;
  }

  // 2. Add to cart / Increase qty
  const cartIndex = state.cart.findIndex(item => item.sku === sku);
  if (cartIndex !== -1) {
    const existing = state.cart[cartIndex];
    if (existing.qty + 1 > product.stock) {
      showToast(`Only ${product.stock} units available in stock.`, "warning");
      refocusBarcode();
      return;
    }
    existing.qty += 1;
    showToast(`Updated qty for ${product.name} (Qty: ${existing.qty})`, "success");
  } else {
    // New item to cart
    state.cart.push({
      sku: product.sku,
      name: product.name,
      size: product.size,
      color: product.color,
      qty: 1,
      rate: product.sellingPrice,
      mrp: product.mrp,
      discountType: "flat",
      discountValue: 0,
      discountAmount: 0,
      gstRate: product.gstRate,
      taxableAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0
    });
    showToast(`Added ${product.name} to invoice`, "success");
  }

  renderPosCart();
  refocusBarcode();
}

function updateCartQty(sku, change) {
  const index = state.cart.findIndex(item => item.sku === sku);
  if (index === -1) return;

  const item = state.cart[index];
  const prod = state.products.find(p => p.sku === sku);

  const newQty = item.qty + change;
  if (newQty <= 0) {
    removeCartItem(sku);
    return;
  }

  if (newQty > prod.stock) {
    showToast(`Insufficient stock. Only ${prod.stock} units available.`, "warning");
    return;
  }

  item.qty = newQty;
  renderPosCart();
  refocusBarcode();
}

function removeCartItem(sku) {
  state.cart = state.cart.filter(item => item.sku !== sku);
  showToast("Item removed from invoice", "info");
  renderPosCart();
  refocusBarcode();
}

function updateItemDiscount(sku, val, type = "flat") {
  const item = state.cart.find(i => i.sku === sku);
  if (!item) return;

  item.discountType = type;
  item.discountValue = Math.max(0, parseFloat(val) || 0);

  // Validate discount limit
  const baseVal = item.qty * item.rate;
  let discAmt = 0;
  if (item.discountType === "percent") {
    discAmt = (baseVal * item.discountValue) / 100;
  } else {
    discAmt = item.discountValue;
  }

  if (discAmt > baseVal) {
    showToast("Discount amount exceeds product taxable subtotal!", "error");
    item.discountValue = 0;
  }

  renderPosCart();
}

// Clear current bill state
function clearCurrentBill(force = false) {
  if (state.cart.length === 0) return;

  if (!force) {
    const conf = confirm("Are you sure you want to clear/discard the current bill?");
    if (!conf) return;
  }

  state.cart = [];
  state.selectedCustomer = null;

  const inputPhone = document.getElementById("pos-cust-phone");
  const inputName = document.getElementById("pos-cust-name");
  const inputBillDisc = document.getElementById("pos-discount-input");

  if (inputPhone) inputPhone.value = "9876543210";
  if (inputName) inputName.value = "Senthil Kumar";
  if (inputBillDisc) inputBillDisc.value = "0";

  lookupCustomerInfo();
  renderPosCart();
  showToast("Bill cleared successfully", "info");
  refocusBarcode();
}

// Suspend current bill to resume later
function holdCurrentBill() {
  if (state.cart.length === 0) {
    showToast("Cannot hold an empty bill cart.", "warning");
    return;
  }

  const custName = document.getElementById("pos-cust-name").value || "Walk-in Customer";
  const custPhone = document.getElementById("pos-cust-phone").value || "N/A";

  const nextInv = "INV-2026-" + String(state.invoiceNoCounter).padStart(6, '0');

  const heldItem = {
    id: "HELD-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    invoiceNo: nextInv,
    dateTime: new Date().toISOString(),
    customerMobile: custPhone,
    customerName: custName,
    cart: [...state.cart],
    billDiscount: parseFloat(document.getElementById("pos-discount-input").value) || 0,
    billDiscountType: document.getElementById("pos-bill-discount-type") ? document.getElementById("pos-bill-discount-type").value : "flat"
  };

  state.heldBills.push(heldItem);
  saveStateToStorage();

  // Reset active screen cart
  state.cart = [];
  document.getElementById("pos-discount-input").value = "0";
  renderPosCart();

  showToast(`Bill suspended successfully! Refer ID: ${heldItem.id}`, "success");
  refocusBarcode();
}

// Resume held bills list
function openHeldBillsModal() {
  const container = document.getElementById("modal-pay");
  const modalHeader = container.querySelector(".modal-card-header h3");
  const modalBody = container.querySelector(".modal-card-body");
  const modalFooter = container.querySelector(".modal-card-footer");

  modalHeader.innerHTML = `<i class="fa-solid fa-pause"></i> Held / Suspended Bills (${state.heldBills.length})`;
  modalFooter.style.display = "none";
  container.querySelector(".modal-close-btn").setAttribute("onclick", "closeAndRestorePayModal()");

  if (state.heldBills.length === 0) {
    modalBody.innerHTML = `
      <div style="text-align:center; padding: 30px; color: var(--text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 32px; display:block; margin-bottom:10px;"></i>
        No currently suspended billing records.
      </div>
    `;
  } else {
    let rows = state.heldBills.map((b, index) => {
      const dt = new Date(b.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card-subtle); border:1px solid var(--border); padding: 10px 14px; border-radius: 8px; margin-bottom:8px;">
          <div>
            <strong>${b.customerName}</strong> (${b.customerMobile})<br>
            <span style="font-size:10px; color:var(--text-muted);">Ref: ${b.invoiceNo} | Held: ${dt} | Pcs: ${b.cart.length}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn-qty" style="background:var(--danger-bg); border-color:var(--danger); color:var(--danger); width:auto; padding:0 8px; height:28px;" onclick="deleteHeldBill('${b.id}')">Delete</button>
            <button class="btn-qty" style="background:var(--primary-light); border-color:var(--primary); color:var(--primary); width:auto; padding:0 12px; height:28px;" onclick="resumeHeldBill('${b.id}')">Resume</button>
          </div>
        </div>
      `;
    }).join("");

    modalBody.innerHTML = `<div style="max-height: 300px; overflow-y:auto;">${rows}</div>`;
  }

  openModal("modal-pay");
}

function deleteHeldBill(id) {
  state.heldBills = state.heldBills.filter(b => b.id !== id);
  saveStateToStorage();
  closeAndRestorePayModal();
  openHeldBillsModal();
  showToast("Suspended bill discarded", "info");
}

function resumeHeldBill(id) {
  const item = state.heldBills.find(b => b.id === id);
  if (!item) return;

  // Restore state
  state.cart = item.cart;
  document.getElementById("pos-cust-phone").value = item.customerMobile;
  document.getElementById("pos-cust-name").value = item.customerName;
  document.getElementById("pos-discount-input").value = item.billDiscount;
  if (document.getElementById("pos-bill-discount-type")) {
    document.getElementById("pos-bill-discount-type").value = item.billDiscountType;
  }

  // Remove from held queue
  state.heldBills = state.heldBills.filter(b => b.id !== id);
  saveStateToStorage();

  closeAndRestorePayModal();
  lookupCustomerInfo();
  renderPosCart();
  showToast("Bill cart restored successfully", "success");
}

// --- CALCULATIONS FOR BILL GRAND TOTALS ---
function calculatePosTotals() {
  let subtotal = 0;
  let totalItemDiscount = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const isInterstate = state.settings.taxCalculationType === "Interstate";

  // Calculate item-level subtotals and taxes
  state.cart.forEach(item => {
    const rawVal = item.qty * item.rate;

    // Calculate item discount
    let discAmt = 0;
    if (item.discountType === "percent") {
      discAmt = (rawVal * item.discountValue) / 100;
    } else {
      discAmt = item.discountValue;
    }

    item.discountAmount = discAmt;
    const taxableVal = rawVal - discAmt;
    item.total = taxableVal;

    // Reverse calculate base price if rate is inclusive of tax
    // Let's assume input rate in Men's clothing POS is already MRP/retail selling rate, inclusive of GST
    const divisor = 1 + (item.gstRate / 100);
    const itemBaseTaxable = taxableVal / divisor;
    const itemTax = taxableVal - itemBaseTaxable;

    if (isInterstate) {
      item.igst = itemTax;
      item.cgst = 0;
      item.sgst = 0;
      totalIgst += itemTax;
    } else {
      item.cgst = itemTax / 2;
      item.sgst = itemTax / 2;
      item.igst = 0;
      totalCgst += item.cgst;
      totalSgst += item.sgst;
    }

    subtotal += rawVal;
    totalItemDiscount += discAmt;
  });

  // Calculate bill discount
  const discInputVal = parseFloat(document.getElementById("pos-discount-input").value) || 0;
  const discInputType = document.getElementById("pos-bill-discount-type") ? document.getElementById("pos-bill-discount-type").value : "flat";

  let billDiscountAmt = 0;
  const taxableSum = subtotal - totalItemDiscount;

  if (discInputType === "percent") {
    billDiscountAmt = (taxableSum * discInputVal) / 100;
  } else {
    billDiscountAmt = discInputVal;
  }

  if (billDiscountAmt > taxableSum) {
    showToast("Bill discount exceeds taxable amount!", "error");
    billDiscountAmt = 0;
    document.getElementById("pos-discount-input").value = "0";
  }

  // Adjust taxes proportionally based on bill discount (tax basis adjustment)
  const discountFactor = taxableSum > 0 ? (taxableSum - billDiscountAmt) / taxableSum : 1;
  const adjustedCgst = totalCgst * discountFactor;
  const adjustedSgst = totalSgst * discountFactor;
  const adjustedIgst = totalIgst * discountFactor;

  const finalTaxable = taxableSum - billDiscountAmt - (adjustedCgst + adjustedSgst + adjustedIgst);
  const netTotal = taxableSum - billDiscountAmt;

  // Rounding calculations
  let grandTotal = netTotal;
  let roundOff = 0;
  if (state.settings.roundOffEnabled) {
    grandTotal = Math.round(netTotal);
    roundOff = grandTotal - netTotal;
  }

  // Update POS summary labels
  document.getElementById("pos-subtotal").innerText = `₹${subtotal.toFixed(2)}`;

  const taxStr = isInterstate ? `IGST: ₹${adjustedIgst.toFixed(2)}` : `CGST: ₹${adjustedCgst.toFixed(2)} | SGST: ₹${adjustedSgst.toFixed(2)}`;
  document.getElementById("pos-tax").innerText = taxStr;

  document.getElementById("pos-led-total").innerText = `₹${grandTotal.toFixed(2)}`;

  // Return values for checkout finalization
  return {
    subtotal,
    itemDiscount: totalItemDiscount,
    billDiscount: billDiscountAmt,
    taxableAmount: finalTaxable,
    cgst: adjustedCgst,
    sgst: adjustedSgst,
    igst: adjustedIgst,
    roundOff,
    grandTotal
  };
}

// Render dynamic table items
function renderPosCart() {
  const tbody = document.getElementById("pos-cart-tbody");
  if (!tbody) return;

  // Update mobile cart badge count
  const badgeEl = document.getElementById("mobile-cart-badge");
  if (badgeEl) {
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalCount > 0) {
      badgeEl.innerText = totalCount;
      badgeEl.style.display = "inline-block";
    } else {
      badgeEl.style.display = "none";
    }
  }

  if (state.cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding: 50px; color: var(--text-muted);">
          <i class="fa-solid fa-cash-register" style="font-size: 26px; margin-bottom: 8px; display:block;"></i>
          Cart is empty. Scan barcodes to add items.
        </td>
      </tr>
    `;
    calculatePosTotals();
    return;
  }

  tbody.innerHTML = state.cart.map((item, index) => {
    return `
      <tr>
        <td>
          <div style="font-weight: 700; color:var(--text-main); font-size: 11px; line-height: 1.3;">${item.name}</div>
          <div style="font-size: 10px; color:var(--text-muted); margin: 2px 0;">Size: ${item.size} | Color: ${item.color}</div>
          
          <!-- Compact Price, Tax Rate & Discount configuration in first column -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px; border-top: 1px dashed var(--border); padding-top: 4px; gap: 8px;">
            <div style="font-size: 10px; color: var(--text-muted);">
              Rate: <b>₹${item.rate}</b> <span style="font-size:9px;">(+${item.gstRate}% GST)</span>
            </div>
            
            <div style="display:flex; align-items:center; gap:2px;">
              <span style="font-size:9px; color:var(--text-muted); font-weight:700;">Disc:</span>
              <input type="number" class="form-control" style="width:38px; height:18px; text-align:right; padding:0 2px; font-size:10px;" value="${item.discountValue}" min="0" oninput="updateItemDiscount('${item.sku}', this.value, '${item.discountType}')">
              <select class="form-control" style="width:30px; height:18px; padding:0; font-size:9px; font-weight:700;" onchange="updateItemDiscount('${item.sku}', this.previousElementSibling.value, this.value)">
                <option value="flat" ${item.discountType === 'flat' ? 'selected' : ''}>₹</option>
                <option value="percent" ${item.discountType === 'percent' ? 'selected' : ''}>%</option>
              </select>
            </div>
          </div>
        </td>
        
        <td style="text-align:center; vertical-align: middle;">
          <div class="qty-controls" style="justify-content:center;">
            <button class="btn-qty" style="width: 18px; height: 18px; font-size: 10px;" onclick="updateCartQty('${item.sku}', -1)">-</button>
            <strong style="width:14px; display:inline-block; text-align:center; font-size: 11px;">${item.qty}</strong>
            <button class="btn-qty" style="width: 18px; height: 18px; font-size: 10px;" onclick="updateCartQty('${item.sku}', 1)">+</button>
          </div>
        </td>
        
        <td style="text-align:right; vertical-align: middle; font-weight:700; color:var(--text-main); font-size: 12px;">
          <div>₹${item.total.toFixed(2)}</div>
          ${item.discountAmount > 0 ? `<div style="font-size: 8px; color: var(--danger); font-weight: normal; margin-top: 1px;">-₹${Math.round(item.discountAmount)}</div>` : ''}
        </td>
        
        <td style="text-align:center; vertical-align: middle;">
          <button style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-size: 13px; padding: 4px;" onclick="removeCartItem('${item.sku}')" title="Remove Item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");

  calculatePosTotals();
}

// ==========================================================================
// MODULE: CUSTOMER RETRIEVAL & LOOKUP
// ==========================================================================

function lookupCustomerInfo() {
  const phoneVal = document.getElementById("pos-cust-phone").value.trim();
  const nameInput = document.getElementById("pos-cust-name");

  if (phoneVal.length < 10) {
    state.selectedCustomer = null;
    return;
  }

  const cust = state.customers.find(c => c.mobile === phoneVal);

  // Render details card overlay dynamically if customer profile is loaded
  const sidebar = document.querySelector(".pos-cart-side");
  let detailsBox = document.getElementById("customer-loyalty-panel");

  if (!detailsBox) {
    detailsBox = document.createElement("div");
    detailsBox.id = "customer-loyalty-panel";
    detailsBox.style.margin = "0 12px 10px 12px";
    // Insert after customer lookup details box
    document.querySelector(".cust-lookup-box").after(detailsBox);
  }

  if (cust) {
    state.selectedCustomer = cust;
    if (nameInput) nameInput.value = cust.name;

    detailsBox.className = "alert-customer-points";
    detailsBox.style.display = "block";
    detailsBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:11px;">
        <span>Loyalty Points: <strong style="color:var(--primary);">${cust.loyaltyPoints} Pts</strong></span>
        <span>Balance Due: <strong style="color:var(--danger);">${cust.outstandingDue > 0 ? '₹' + cust.outstandingDue : 'Nil'}</strong></span>
      </div>
      <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">Purchases: ${cust.totalPurchases > 0 ? '₹' + cust.totalPurchases : 'Nil'} | Last Visit: ${cust.lastPurchaseDate}</div>
    `;
    showToast(`Existing customer loaded: ${cust.name}`, "info");
  } else {
    state.selectedCustomer = null;
    detailsBox.style.display = "none";
  }
}

// ==========================================================================
// MODULE: PAYMENT SETTLEMENT & SALE FINALIZATION
// ==========================================================================

function openPaymentModal() {
  if (state.cart.length === 0) {
    showToast("Invoice cart is empty. Cannot checkout.", "warning");
    return;
  }

  // Double check stock availability
  for (let item of state.cart) {
    const p = state.products.find(prod => prod.sku === item.sku);
    if (item.qty > p.stock) {
      showToast(`Cannot check out. "${p.name}" quantity exceeds stock (${p.stock} remaining).`, "error");
      return;
    }
  }

  const totals = calculatePosTotals();
  state.paymentModalTotal = totals.grandTotal;

  // Set layout
  document.getElementById("pay-modal-net").innerText = `₹${totals.grandTotal.toFixed(2)}`;

  // Default to Cash
  setPaymentMode("Cash");

  // Reset cash values
  document.getElementById("cash-given-val").value = totals.grandTotal;
  calcChangeReturn();

  openModal("modal-pay");
}

function setPaymentMode(mode) {
  state.selectedPaymentMode = mode;

  const cashBox = document.getElementById("cash-calc-box");
  const qrBox = document.getElementById("upi-qr-box");

  // Deactivate QR qrBox & cashBox depending on payment modes
  if (mode === "Cash") {
    cashBox.style.display = "block";
    qrBox.style.display = "none";
    refocusCashInput();
  } else if (mode === "UPI") {
    cashBox.style.display = "none";
    qrBox.style.display = "block";

    // Render dynamic UPI payment QR
    const qrImage = document.getElementById("gpay-qr-image");
    if (qrImage) {
      const upiUrl = `upi://pay?pa=${state.settings.upiId}&pn=${encodeURIComponent(state.settings.storeName)}&am=${state.paymentModalTotal}&cu=INR`;
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiUrl)}`;
    }
  } else {
    // Card or Credit
    cashBox.style.display = "none";
    qrBox.style.display = "none";
  }

  // Style buttons in payment modal
  const btnGroup = document.querySelector("#modal-pay div[style*='grid-template-columns']");
  if (btnGroup) {
    const btns = btnGroup.querySelectorAll("button");
    btns.forEach(b => {
      const txt = b.innerText;
      if ((txt.includes("Cash") && mode === "Cash") ||
        (txt.includes("UPI") && mode === "UPI") ||
        (txt.includes("Card") && mode === "Card") ||
        (txt.includes("Credit") && mode === "Credit")) {
        b.style.border = "2px solid var(--primary)";
        b.style.fontWeight = "800";
      } else {
        b.style.border = "none";
        b.style.fontWeight = "600";
      }
    });
  }
}

// Calculate balance cash return
function calcChangeReturn() {
  const cashGiven = parseFloat(document.getElementById("cash-given-val").value) || 0;
  const changeSpan = document.getElementById("cash-return-val");

  const change = cashGiven - state.paymentModalTotal;

  if (change < 0) {
    changeSpan.style.color = "var(--danger)";
    changeSpan.innerText = `Short: ₹${Math.abs(change).toFixed(2)}`;
  } else {
    changeSpan.style.color = "var(--success)";
    changeSpan.innerText = `₹${change.toFixed(2)}`;
  }
}

// Inject quick cash payment values
function setQuickCashAmount(amt) {
  const cashInput = document.getElementById("cash-given-val");
  if (!cashInput) return;

  if (amt === 'Exact') {
    cashInput.value = state.paymentModalTotal;
  } else {
    cashInput.value = amt;
  }
  calcChangeReturn();
}

// Complete sales, reduce inventory and log transaction
function finishSaleAndPrint() {
  const cashGiven = parseFloat(document.getElementById("cash-given-val").value) || 0;

  // Validation checks
  if (state.selectedPaymentMode === "Cash" && cashGiven < state.paymentModalTotal) {
    showToast("Invalid checkout: Cash received is less than total payable amount.", "error");
    return;
  }

  const custName = document.getElementById("pos-cust-name").value.trim() || "Walk-in Customer";
  const custPhone = document.getElementById("pos-cust-phone").value.trim() || "N/A";

  if (state.selectedPaymentMode === "Credit" && custPhone === "N/A") {
    showToast("Credit transactions require a registered customer mobile.", "error");
    return;
  }

  const totals = calculatePosTotals();
  const nextInvNo = "INV-2026-" + String(state.invoiceNoCounter).padStart(6, '0');

  // 1. Prepare invoice object
  const saleItem = {
    invoiceNo: nextInvNo,
    dateTime: new Date().toISOString().substring(0, 19),
    customerMobile: custPhone,
    customerName: custName,
    items: [...state.cart],
    subtotal: totals.subtotal,
    itemDiscount: totals.itemDiscount,
    billDiscount: totals.billDiscount,
    taxableAmount: totals.taxableAmount,
    cgst: totals.cgst,
    sgst: totals.sgst,
    igst: totals.igst,
    roundOff: totals.roundOff,
    grandTotal: totals.grandTotal,
    paymentMode: state.selectedPaymentMode,
    amountPaid: state.selectedPaymentMode === "Cash" ? cashGiven : totals.grandTotal,
    changeReturned: state.selectedPaymentMode === "Cash" ? Math.max(0, cashGiven - totals.grandTotal) : 0,
    status: "Completed"
  };

  // 2. Reduce stock, record inventory ledger stock movement
  saleItem.items.forEach(item => {
    const prod = state.products.find(p => p.sku === item.sku);
    if (prod) {
      prod.stock -= item.qty;

      // Save movement
      state.stockMovements.push({
        id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        sku: item.sku,
        type: "Sale",
        qty: -item.qty,
        referenceNo: nextInvNo,
        dateTime: new Date().toISOString(),
        notes: `Customer retail sale bill ${nextInvNo}`
      });
    }
  });

  // 3. Update customer loyalty points or balance dues
  if (custPhone !== "N/A") {
    let customer = state.customers.find(c => c.mobile === custPhone);
    if (!customer) {
      // Create new customer profile auto
      customer = {
        mobile: custPhone,
        name: custName,
        email: "",
        address: "Walk-in Store Customer",
        loyaltyPoints: 0,
        outstandingDue: 0,
        totalPurchases: 0,
        lastPurchaseDate: ""
      };
      state.customers.push(customer);
    }

    // Loyalty: 1 Point for every ₹100 spent
    const addedPoints = Math.floor(totals.grandTotal / 100);
    customer.loyaltyPoints += addedPoints;
    customer.totalPurchases += totals.grandTotal;
    customer.lastPurchaseDate = new Date().toISOString().substring(0, 10);

    if (state.selectedPaymentMode === "Credit") {
      customer.outstandingDue += totals.grandTotal;
    }
  }

  // 4. Save to sales ledger
  state.sales.push(saleItem);
  state.invoiceNoCounter++;

  saveStateToStorage();

  // Close Payment settlements
  closeModal("modal-pay");

  // Show invoice layout
  triggerInvoiceReceipt(saleItem);

  // Clear active POS layout
  clearCurrentBill(true);
}

// ==========================================================================
// MODULE: THERMAL RECEIPT & PRINT CONTROLS
// ==========================================================================

function triggerInvoiceReceipt(invoiceObj) {
  // Populate printable thermal DOM
  document.getElementById("r-bill-id").innerText = invoiceObj.invoiceNo;
  document.getElementById("r-bill-date").innerText = new Date(invoiceObj.dateTime).toLocaleDateString() + " " + new Date(invoiceObj.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("r-cust").innerText = `${invoiceObj.customerName} (${invoiceObj.customerMobile})`;

  const tbody = document.getElementById("r-items-tbody");
  tbody.innerHTML = invoiceObj.items.map(i => {
    return `
      <tr>
        <td style="text-align:left;">
          ${i.name}<br>
          <span style="font-size:8px; color:#555;">${i.sku} | Size: ${i.size}</span>
        </td>
        <td style="text-align:center;">${i.qty}</td>
        <td class="num">₹${i.rate}</td>
        <td class="num">₹${i.total.toFixed(2)}</td>
      </tr>
    `;
  }).join("");

  document.getElementById("r-subtotal").innerText = `₹${invoiceObj.subtotal.toFixed(2)}`;

  const isInterstate = state.settings.taxCalculationType === "Interstate";
  const cgstLabel = document.getElementById("r-cgst").parentElement;
  const sgstLabel = document.getElementById("r-sgst").parentElement;

  if (isInterstate) {
    cgstLabel.style.display = "none";
    sgstLabel.innerHTML = `<span>IGST Tax:</span><span id="r-sgst">₹${invoiceObj.igst.toFixed(2)}</span>`;
  } else {
    cgstLabel.style.display = "flex";
    document.getElementById("r-cgst").innerText = `₹${invoiceObj.cgst.toFixed(2)}`;
    sgstLabel.innerHTML = `<span>SGST Tax:</span><span id="r-sgst">₹${invoiceObj.sgst.toFixed(2)}</span>`;
  }

  // Discount details
  const discRow = document.getElementById("r-subtotal").parentElement;
  let discDisplay = document.getElementById("r-receipt-discount-row");
  if (!discDisplay) {
    discDisplay = document.createElement("div");
    discDisplay.id = "r-receipt-discount-row";
    discDisplay.style.display = "flex";
    discDisplay.style.justifyContent = "space-between";
    discRow.after(discDisplay);
  }
  const totDisc = invoiceObj.itemDiscount + invoiceObj.billDiscount;
  if (totDisc > 0) {
    discDisplay.style.display = "flex";
    discDisplay.innerHTML = `<span>Discount Applied:</span><span>-₹${totDisc.toFixed(2)}</span>`;
  } else {
    discDisplay.style.display = "none";
  }

  document.getElementById("r-grand-total").innerText = `₹${invoiceObj.grandTotal.toFixed(2)}`;
  document.getElementById("r-pay-mode").innerText = invoiceObj.paymentMode.toUpperCase();

  // Open printing screen dialog
  openModal("modal-receipt");
}

// Generate pre-loaded WhatsApp message
function sendWhatsAppInvoice() {
  const phone = document.getElementById("wa-phone-input").value.replace(/[^0-9+]/g, '');
  const text = document.getElementById("wa-message-preview").value.trim();

  if (phone.length < 10) {
    showToast("Please enter a valid mobile number with country code.", "warning");
    return;
  }

  // Open WhatsApp Link
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
  closeModal("modal-whatsapp");
}

function openWhatsAppModal() {
  const custName = document.getElementById("pos-cust-name").value || "Customer";
  const custPhone = document.getElementById("pos-cust-phone").value || "";

  const totals = calculatePosTotals();
  const nextInv = "INV-2026-" + String(state.invoiceNoCounter).padStart(6, '0');

  let itemsStr = state.cart.map(i => `${i.name} (${i.size}) x${i.qty}`).join(", ");
  if (itemsStr.length > 50) itemsStr = itemsStr.substring(0, 47) + "...";

  const message = `🧾 *${state.settings.storeName}*
Dear ${custName}, thank you for shopping at our Salem branch!

*Invoice:* ${nextInv}
*Bill Total:* ₹${totals.grandTotal.toFixed(2)}
*Items Detail:* ${itemsStr}

Thank you! Visit Again! 🛍️`;

  const inputPhone = document.getElementById("wa-phone-input");
  const inputMsg = document.getElementById("wa-message-preview");

  if (inputPhone) {
    // Add default India prefix if not present
    inputPhone.value = custPhone.startsWith("+91") ? custPhone : "+91" + custPhone;
  }
  if (inputMsg) inputMsg.value = message;

  openModal("modal-whatsapp");
}

// ==========================================================================
// MODULE: SALES HISTORY, RETURNING & REFUNDING
// ==========================================================================

function renderReports() {
  const tbody = document.getElementById("reports-sales-tbody");
  if (!tbody) return;

  if (state.sales.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No sales invoices completed yet.</td></tr>`;
    return;
  }

  // Reverse mapping to show newest transactions first
  const reversedSales = [...state.sales].reverse();

  tbody.innerHTML = reversedSales.map(s => {
    const dt = new Date(s.dateTime).toLocaleDateString() + " " + new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const itemsCount = s.items.reduce((sum, item) => sum + item.qty, 0);
    const returnBtn = s.status === 'Completed' ?
      `<button class="btn-qty" style="background:#fef2f2; color:var(--danger); border-color:var(--danger); width:auto; padding:0 8px; height:24px;" onclick="openRefundWizard('${s.invoiceNo}')"><i class="fa-solid fa-rotate-left"></i> Return</button>` :
      `<span style="color:var(--text-muted); font-size:10px; font-weight:700;">Returned</span>`;

    return `
      <tr>
        <td><b>${s.invoiceNo}</b></td>
        <td>${dt}</td>
        <td>${s.customerName}<br><span style="font-size:9px; color:var(--text-muted);">${s.customerMobile}</span></td>
        <td><span class="badge-tag badge-size">${s.paymentMode}</span></td>
        <td style="color:var(--success); font-weight:700;">₹${(s.cgst + s.sgst + s.igst).toFixed(2)}</td>
        <td style="text-align:right; font-weight:800;">₹${s.grandTotal.toFixed(2)}</td>
        <td style="text-align:center; display:flex; gap:4px; justify-content:center;">
          <button class="btn-qty" style="background:var(--primary-light); color:var(--primary); border-color:var(--primary); width:auto; padding:0 8px; height:24px;" onclick="viewHistoryInvoice('${s.invoiceNo}')">View</button>
          ${returnBtn}
        </td>
      </tr>
    `;
  }).join("");
}

function viewHistoryInvoice(invoiceNo) {
  const sale = state.sales.find(s => s.invoiceNo === invoiceNo);
  if (!sale) return;
  triggerInvoiceReceipt(sale);
}

// Refund / Item return modal controller
function openRefundWizard(invoiceNo) {
  const sale = state.sales.find(s => s.invoiceNo === invoiceNo);
  if (!sale) return;

  const modal = document.getElementById("modal-pay");
  const modalHeader = modal.querySelector(".modal-card-header h3");
  const modalBody = modal.querySelector(".modal-card-body");
  const modalFooter = modal.querySelector(".modal-card-footer");

  modalHeader.innerHTML = `<i class="fa-solid fa-rotate-left"></i> Process Return: ${invoiceNo}`;
  modalFooter.style.display = "none";
  modal.querySelector(".modal-close-btn").setAttribute("onclick", "closeAndRestorePayModal()");

  // Build row selectors for items
  let itemRows = sale.items.map((item, index) => {
    // Check if item has already been returned
    const matchingReturns = state.returns.filter(r => r.originalInvoiceNo === invoiceNo);
    let qtyAlreadyReturned = 0;
    matchingReturns.forEach(r => {
      const matchItem = r.items.find(ri => ri.sku === item.sku);
      if (matchItem) qtyAlreadyReturned += matchItem.qty;
    });

    const returnableQty = item.qty - qtyAlreadyReturned;
    if (returnableQty <= 0) {
      return `
        <tr style="opacity: 0.5;">
          <td><strong>${item.name}</strong><br><span style="font-size:10px;">${item.sku}</span></td>
          <td style="text-align:center;">${item.qty} pcs</td>
          <td style="text-align:center; color:var(--danger); font-weight:700;">Returned</td>
          <td colspan="2"></td>
        </tr>
      `;
    }

    return `
      <tr>
        <td><strong>${item.name}</strong><br><span style="font-size:10px;">${item.sku}</span></td>
        <td style="text-align:center;">${item.qty} pcs (Available: ${returnableQty})</td>
        <td style="text-align:center;">
          <input type="number" id="refund-qty-${index}" class="form-control" style="width:60px; height:26px; text-align:center;" value="0" min="0" max="${returnableQty}" oninput="validateRefundQty(this, ${returnableQty})">
        </td>
        <td style="text-align:right;">₹${item.rate}</td>
        <td style="text-align:right; font-weight:700;" id="refund-row-tot-${index}">₹0.00</td>
      </tr>
    `;
  }).join("");

  modalBody.innerHTML = `
    <div style="margin-bottom:12px; font-size:11px;">Original Date: <b>${sale.dateTime}</b> | Customer: <b>${sale.customerName}</b></div>
    <table class="table-custom" id="refund-items-table">
      <thead>
        <tr>
          <th>Clothing Details</th>
          <th style="text-align:center;">Qty Bought</th>
          <th style="text-align:center; width:80px;">Return Qty</th>
          <th style="text-align:right;">Rate</th>
          <th style="text-align:right;">Refund Sum</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>
    <div style="margin-top:14px; background:var(--danger-bg); border:1px solid var(--danger); padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
      <strong>Total Refund Value:</strong>
      <span id="refund-total-val" style="font-size:18px; font-weight:800; color:var(--danger);">₹0.00</span>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px;">
      <button class="btn-action-checkout" style="background:var(--border); color:var(--text-main);" onclick="closeAndRestorePayModal()">Cancel</button>
      <button class="btn-action-checkout btn-pay" style="background:var(--danger);" onclick="completeRefund('${invoiceNo}')">Confirm Refund</button>
    </div>
  `;

  openModal("modal-pay");
}

function validateRefundQty(inputEl, max) {
  let val = parseInt(inputEl.value) || 0;
  if (val > max) {
    showToast(`Cannot return more than available quantity (${max}).`, "warning");
    inputEl.value = max;
    val = max;
  }
  if (val < 0) {
    inputEl.value = 0;
    val = 0;
  }

  // Update row subtotal
  const tr = inputEl.closest("tr");
  const rateCell = tr.cells[3].innerText.replace('₹', '');
  const rate = parseFloat(rateCell) || 0;
  const totCell = tr.querySelector("td[id^='refund-row-tot']");

  const total = val * rate;
  totCell.innerText = `₹${total.toFixed(2)}`;

  // Recalculate total refund
  let grandTotal = 0;
  document.querySelectorAll("td[id^='refund-row-tot']").forEach(cell => {
    grandTotal += parseFloat(cell.innerText.replace('₹', '')) || 0;
  });
  document.getElementById("refund-total-val").innerText = `₹${grandTotal.toFixed(2)}`;
}

function completeRefund(invoiceNo) {
  const sale = state.sales.find(s => s.invoiceNo === invoiceNo);
  if (!sale) return;

  const returnItems = [];
  let totalRefund = 0;

  sale.items.forEach((item, index) => {
    const input = document.getElementById(`refund-qty-${index}`);
    if (input) {
      const qty = parseInt(input.value) || 0;
      if (qty > 0) {
        const itemRefundTotal = qty * item.rate;
        returnItems.push({
          sku: item.sku,
          qty,
          refundRate: item.rate,
          refundAmount: itemRefundTotal
        });
        totalRefund += itemRefundTotal;
      }
    }
  });

  if (returnItems.length === 0) {
    showToast("Please enter return quantity for at least one item.", "warning");
    return;
  }

  // Create Return record
  const retId = "RET-2026-" + String(state.returns.length + 1).padStart(6, '0');
  const returnObj = {
    returnNo: retId,
    originalInvoiceNo: invoiceNo,
    dateTime: new Date().toISOString(),
    items: returnItems,
    totalRefund,
    paymentMode: sale.paymentMode === "Credit" ? "Credit" : "Cash"
  };

  // Adjust stock, record movements
  returnItems.forEach(retItem => {
    const prod = state.products.find(p => p.sku === retItem.sku);
    if (prod) {
      prod.stock += retItem.qty; // stock added back on return

      // Stock movement ledger
      state.stockMovements.push({
        id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        sku: retItem.sku,
        type: "Return",
        qty: retItem.qty,
        referenceNo: retId,
        dateTime: new Date().toISOString(),
        notes: `Returned item from invoice ${invoiceNo}`
      });
    }
  });

  // Adjust customer ledger if Credit or Points adjustment
  if (sale.customerMobile !== "N/A") {
    const cust = state.customers.find(c => c.mobile === sale.customerMobile);
    if (cust) {
      // Deduct points proportionally
      const pointsDeducted = Math.floor(totalRefund / 100);
      cust.loyaltyPoints = Math.max(0, cust.loyaltyPoints - pointsDeducted);

      if (sale.paymentMode === "Credit") {
        cust.outstandingDue = Math.max(0, cust.outstandingDue - totalRefund);
      }
    }
  }

  // Save to returns array
  state.returns.push(returnObj);

  // If original invoice is completely returned, mark it
  // Check if everything is returned
  let allReturned = true;
  sale.items.forEach(item => {
    const matchingReturns = state.returns.filter(r => r.originalInvoiceNo === invoiceNo);
    let qtyAlreadyReturned = 0;
    matchingReturns.forEach(r => {
      const matchItem = r.items.find(ri => ri.sku === item.sku);
      if (matchItem) qtyAlreadyReturned += matchItem.qty;
    });
    if (qtyAlreadyReturned < item.qty) allReturned = false;
  });

  if (allReturned) {
    sale.status = "Returned";
  }

  saveStateToStorage();
  closeAndRestorePayModal();
  renderReports();
  showToast(`Refund processed successfully. Voucher: ${retId}`, "success");
}

// ==========================================================================
// MODULE: INVENTORY VALUATION & STOCK ADJUSTMENT
// ==========================================================================

function renderInventoryStock() {
  const tbody = document.getElementById("inventory-stock-tbody");
  if (!tbody) return;

  tbody.innerHTML = state.products.map(p => {
    const isOutOfStock = p.stock === 0;
    const isLowStock = p.stock > 0 && p.stock <= p.reorderLevel;

    let statusBadge = "";
    if (isOutOfStock) {
      statusBadge = `<span class="badge-tag" style="background:var(--danger-bg); color:var(--danger); font-weight:700;">OUT OF STOCK</span>`;
    } else if (isLowStock) {
      statusBadge = `<span class="badge-tag" style="background:var(--warning-bg); color:var(--warning); font-weight:700;">LOW STOCK (${p.stock})</span>`;
    } else {
      statusBadge = `<span class="badge-tag" style="background:var(--success-bg); color:var(--success); font-weight:700;">IN STOCK</span>`;
    }

    const valuation = p.stock * p.costPrice;

    return `
      <tr>
        <td><b>${p.barcode}</b></td>
        <td>
          <div style="font-weight:700;">${p.name}</div>
          <div style="font-size:10px; color:var(--text-muted);">${p.brand} | SKU: ${p.sku}</div>
        </td>
        <td>Size: <b>${p.size}</b> | Color: <b>${p.color}</b></td>
        <td>${p.category}</td>
        <td style="text-align:center;">${statusBadge}</td>
        <td style="text-align:right; font-weight:700;">₹${valuation.toLocaleString('en-IN')}</td>
        <td style="text-align:center;">
          <button class="btn-qty" style="width:auto; padding:0 8px; height:24px;" onclick="openStockAdjustmentModal('${p.sku}')">Adjust</button>
        </td>
      </tr>
    `;
  }).join("");
}

function openStockAdjustmentModal(sku) {
  const p = state.products.find(prod => prod.sku === sku);
  if (!p) return;

  const modal = document.getElementById("modal-pay");
  const modalHeader = modal.querySelector(".modal-card-header h3");
  const modalBody = modal.querySelector(".modal-card-body");
  const modalFooter = modal.querySelector(".modal-card-footer");

  modalHeader.innerHTML = `<i class="fa-solid fa-boxes-stacked"></i> Stock Adjustment: ${p.sku}`;
  modalFooter.style.display = "none";
  modal.querySelector(".modal-close-btn").setAttribute("onclick", "closeAndRestorePayModal()");

  modalBody.innerHTML = `
    <div style="margin-bottom:12px;">Apparel: <strong>${p.name}</strong> (${p.size} / ${p.color})</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Current Stock:</label>
        <input type="text" class="form-control" value="${p.stock}" disabled>
      </div>
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">New Target Qty:</label>
        <input type="number" id="adj-target-qty" class="form-control" value="${p.stock}" min="0">
      </div>
    </div>
    <div>
      <label style="font-weight:700; display:block; margin-bottom:4px;">Adjustment Reason / Note:</label>
      <input type="text" id="adj-reason" class="form-control" placeholder="e.g. Damaged piece / Audit count fix">
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px;">
      <button class="btn-action-checkout" style="background:var(--border); color:var(--text-main);" onclick="closeAndRestorePayModal()">Cancel</button>
      <button class="btn-action-checkout btn-pay" onclick="saveStockAdjustment('${sku}')">Save Change</button>
    </div>
  `;

  openModal("modal-pay");
}

function saveStockAdjustment(sku) {
  const prod = state.products.find(p => p.sku === sku);
  if (!prod) return;

  const targetVal = parseInt(document.getElementById("adj-target-qty").value);
  const reason = document.getElementById("adj-reason").value.trim() || "Stock Audit Correction";

  if (isNaN(targetVal) || targetVal < 0) {
    showToast("Invalid stock quantity value.", "error");
    return;
  }

  const difference = targetVal - prod.stock;
  if (difference === 0) {
    closeAndRestorePayModal();
    return;
  }

  // Update
  prod.stock = targetVal;

  // Log stock movement
  state.stockMovements.push({
    id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    sku,
    type: "Adjustment",
    qty: difference,
    referenceNo: "ADJ-AUDIT",
    dateTime: new Date().toISOString(),
    notes: reason
  });

  saveStateToStorage();
  closeAndRestorePayModal();
  renderInventoryStock();
  showToast("Inventory stock updated successfully", "success");
}

// ==========================================================================
// MODULE: PRODUCT MANAGEMENT (MATRIX GRID) & NEW APPAREL SAVE
// ==========================================================================

function renderProductsMatrix() {
  const tbody = document.getElementById("products-matrix-tbody");
  if (!tbody) return;

  tbody.innerHTML = state.products.map(p => {
    return `
      <tr>
        <td>
          <span style="font-family:monospace; font-weight:700;">${p.barcode}</span><br>
          <span style="font-size:9px; color:var(--text-muted);">${p.sku}</span>
        </td>
        <td>
          <div style="font-weight:700;">${p.name}</div>
          <div style="font-size:9px; color:var(--text-muted);">${p.brand}</div>
        </td>
        <td><span class="badge-tag" style="background:#f1f5f9; color:var(--text-main); font-weight:700;">${p.category}</span></td>
        <td><span class="badge-tag badge-size">${p.size}</span></td>
        <td><span class="badge-tag badge-color">${p.color}</span></td>
        <td><span class="badge-tag badge-fabric">${p.fabric}</span></td>
        <td>${p.hsn}</td>
        <td style="text-align:right;">₹${p.costPrice}</td>
        <td style="text-align:right; font-weight:700; color:var(--primary);">₹${p.sellingPrice}</td>
        <td style="text-align:right; color:var(--text-muted);">₹${p.mrp}</td>
        <td style="text-align:center; font-weight:700;">${p.stock}</td>
      </tr>
    `;
  }).join("");
}

function saveNewApparelProduct() {
  const barcode = document.getElementById("new-barcode").value.trim();
  const title = document.getElementById("new-title").value.trim();
  const category = document.getElementById("new-category").value;
  const size = document.getElementById("new-size").value;
  const color = document.getElementById("new-color").value.trim() || "N/A";
  const fabric = document.getElementById("new-fabric").value.trim() || "N/A";
  const cost = parseFloat(document.getElementById("new-cost").value) || 0;
  const rate = parseFloat(document.getElementById("new-rate").value) || 0;
  const mrp = parseFloat(document.getElementById("new-mrp").value) || 0;
  const hsn = document.getElementById("new-hsn").value.trim() || "6205";
  const stock = parseInt(document.getElementById("new-stock").value) || 0;

  if (!barcode || !title) {
    showToast("Please enter product barcode and title name.", "error");
    return;
  }

  // Check duplicate barcode
  const exists = state.products.find(p => p.barcode === barcode);
  if (exists) {
    showToast("A product with this barcode code already exists.", "warning");
    return;
  }

  // Auto generate SKU from title & variant
  const shortTitle = title.substring(0, 3).toUpperCase();
  const shortColor = color.substring(0, 3).toUpperCase();
  const sku = `${shortTitle}-${shortColor}-${size}-${Math.floor(Math.random() * 1000)}`;

  const newProd = {
    sku,
    barcode,
    name: title,
    category,
    brand: "Local Brand",
    size,
    color,
    fabric,
    hsn,
    gstRate: category === "Jeans & Trousers" ? 12 : 5,
    costPrice: cost,
    sellingPrice: rate,
    mrp: mrp || rate,
    stock,
    reorderLevel: 5,
    supplierId: "SUP001"
  };

  // Add product
  state.products.push(newProd);

  // Stock movement ledger
  state.stockMovements.push({
    id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    sku,
    type: "Opening",
    qty: stock,
    referenceNo: "SYS-NEW",
    dateTime: new Date().toISOString(),
    notes: "Opening Stock Creation"
  });

  saveStateToStorage();
  closeModal("modal-add-product");

  // Clear modal inputs
  document.getElementById("new-barcode").value = "";
  document.getElementById("new-title").value = "";
  document.getElementById("new-color").value = "";
  document.getElementById("new-fabric").value = "";
  document.getElementById("new-cost").value = "";
  document.getElementById("new-rate").value = "";
  document.getElementById("new-mrp").value = "";
  document.getElementById("new-stock").value = "20";

  // Re-render POS and Product masters
  renderPosCatalog();
  renderProductsMatrix();
  showToast("Product variant registered successfully", "success");
}

// ==========================================================================
// MODULE: EXPENSES TRACKING
// ==========================================================================

function renderExpenses() {
  const tbody = document.getElementById("expenses-tbody");
  if (!tbody) return;

  if (state.expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">No expenses recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.expenses.map(e => {
    return `
      <tr>
        <td>${new Date(e.date).toLocaleDateString()}</td>
        <td><span class="badge-tag badge-fabric">${e.category}</span></td>
        <td>${e.description}</td>
        <td>${e.paymentMethod}</td>
        <td style="text-align:right; font-weight:700; color:var(--danger);">₹${e.amount.toFixed(2)}</td>
      </tr>
    `;
  }).join("");
}

function openAddExpenseModal() {
  const modal = document.getElementById("modal-pay");
  const modalHeader = modal.querySelector(".modal-card-header h3");
  const modalBody = modal.querySelector(".modal-card-body");
  const modalFooter = modal.querySelector(".modal-card-footer");

  modalHeader.innerHTML = `<i class="fa-solid fa-wallet"></i> Record Daily Store Expense`;
  modalFooter.style.display = "none";
  modal.querySelector(".modal-close-btn").setAttribute("onclick", "closeAndRestorePayModal()");

  modalBody.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Expense Category:</label>
        <select id="exp-category" class="form-control">
          <option value="Shop Rent">Shop Rent</option>
          <option value="Electricity">Electricity</option>
          <option value="Salary">Salary / Helper wages</option>
          <option value="Transport">Transport / Delivery charges</option>
          <option value="Maintenance">Maintenance & Cleaning</option>
          <option value="Packaging">Carrybags & Packaging</option>
          <option value="Other">Other Expenses</option>
        </select>
      </div>
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Amount (₹):</label>
        <input type="number" id="exp-amount" class="form-control" placeholder="e.g. 500" min="1">
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Date:</label>
        <input type="date" id="exp-date" class="form-control" value="${new Date().toISOString().substring(0, 10)}">
      </div>
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Payment Method:</label>
        <select id="exp-method" class="form-control">
          <option value="Cash">Cash</option>
          <option value="UPI GPay">UPI / GPay</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Card">Card</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom:14px;">
      <label style="font-weight:700; display:block; margin-bottom:4px;">Description / Details:</label>
      <input type="text" id="exp-desc" class="form-control" placeholder="e.g. Purchase of 50 paper packaging bags">
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px;">
      <button class="btn-action-checkout" style="background:var(--border); color:var(--text-main);" onclick="closeAndRestorePayModal()">Cancel</button>
      <button class="btn-action-checkout btn-pay" onclick="saveNewExpense()">Save Entry</button>
    </div>
  `;

  openModal("modal-pay");
}

function saveNewExpense() {
  const category = document.getElementById("exp-category").value;
  const amount = parseFloat(document.getElementById("exp-amount").value) || 0;
  const date = document.getElementById("exp-date").value;
  const paymentMethod = document.getElementById("exp-method").value;
  const description = document.getElementById("exp-desc").value.trim() || "Store Expense";

  if (amount <= 0) {
    showToast("Please enter a valid expense amount.", "error");
    return;
  }

  const expObj = {
    id: "EXP-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    date,
    category,
    description,
    paymentMethod,
    amount
  };

  state.expenses.push(expObj);
  saveStateToStorage();

  closeAndRestorePayModal();
  renderExpenses();
  showToast("Expense entry saved successfully", "success");
}

// ==========================================================================
// MODULE: CUSTOMER DIRECTORY MANAGEMENT
// ==========================================================================

function renderCustomers() {
  const tbody = document.querySelector("#view-customers tbody");
  if (!tbody) return;

  tbody.innerHTML = state.customers.map(c => {
    return `
      <tr>
        <td><b>${c.mobile}</b></td>
        <td><strong>${c.name}</strong><br><span style="font-size:10px; color:var(--text-muted);">${c.email || 'N/A'}</span></td>
        <td>${c.address}</td>
        <td><span style="color:var(--primary); font-weight:700;">${c.loyaltyPoints} Pts</span></td>
        <td style="color:${c.outstandingDue > 0 ? 'var(--danger)' : 'var(--text-main)'}; font-weight:700;">₹${c.outstandingDue.toFixed(2)}</td>
      </tr>
    `;
  }).join("");
}

// ==========================================================================
// MODULE: SUPPLIER DIRECTORY MANAGEMENT
// ==========================================================================

function renderSuppliers() {
  const tbody = document.querySelector("#view-suppliers tbody");
  if (!tbody) return;

  tbody.innerHTML = state.suppliers.map(s => {
    return `
      <tr>
        <td><strong>${s.name}</strong><br><span style="font-size:10px; color:var(--text-muted);">GSTIN: ${s.gstin}</span></td>
        <td>${s.address}</td>
        <td>${s.phone}</td>
        <td style="font-weight:700;">₹${s.totalPurchases.toLocaleString('en-IN')}</td>
        <td style="color:${s.outstandingDue > 0 ? 'var(--danger)' : 'var(--text-main)'}; font-weight:700;">
          ₹${s.outstandingDue.toLocaleString('en-IN')}
          ${s.outstandingDue > 0 ? `<br><button class="btn-qty" style="width:auto; padding:0 6px; height:20px; font-size:9px; margin-top:4px;" onclick="settleSupplierPayment('${s.id}')">Pay</button>` : ''}
        </td>
      </tr>
    `;
  }).join("");
}

function settleSupplierPayment(id) {
  const s = state.suppliers.find(sup => sup.id === id);
  if (!s) return;

  const modal = document.getElementById("modal-pay");
  const modalHeader = modal.querySelector(".modal-card-header h3");
  const modalBody = modal.querySelector(".modal-card-body");
  const modalFooter = modal.querySelector(".modal-card-footer");

  modalHeader.innerHTML = `<i class="fa-solid fa-building-user"></i> Settle Supplier Ledger: ${s.name}`;
  modalFooter.style.display = "none";
  modal.querySelector(".modal-close-btn").setAttribute("onclick", "closeAndRestorePayModal()");

  modalBody.innerHTML = `
    <div style="margin-bottom:12px;">Outstanding Due Balance: <strong style="color:var(--danger); font-size:16px;">₹${s.outstandingDue.toLocaleString('en-IN')}</strong></div>
    <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:14px;">
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Payment Amount (₹):</label>
        <input type="number" id="sup-pay-amount" class="form-control" value="${s.outstandingDue}" max="${s.outstandingDue}" min="1">
      </div>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px;">
      <button class="btn-action-checkout" style="background:var(--border); color:var(--text-main);" onclick="closeAndRestorePayModal()">Cancel</button>
      <button class="btn-action-checkout btn-pay" onclick="saveSupplierPayment('${id}')">Record Payment</button>
    </div>
  `;

  openModal("modal-pay");
}

function saveSupplierPayment(id) {
  const sup = state.suppliers.find(s => s.id === id);
  if (!sup) return;

  const amt = parseFloat(document.getElementById("sup-pay-amount").value) || 0;
  if (amt <= 0 || amt > sup.outstandingDue) {
    showToast("Invalid payment amount entered.", "error");
    return;
  }

  // Update supplier ledger
  sup.outstandingDue -= amt;
  sup.paid += amt;

  // Record expense as supplier payment
  state.expenses.push({
    id: "EXP-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    date: new Date().toISOString().substring(0, 10),
    category: "Supplier Payment",
    description: `Supplier payment to ${sup.name}`,
    paymentMethod: "Bank Transfer",
    amount: amt
  });

  saveStateToStorage();
  closeAndRestorePayModal();
  renderSuppliers();
  showToast("Supplier settlement recorded", "success");
}

// ==========================================================================
// MODULE: DASHBOARD ANALYTICS WIDGETS
// ==========================================================================

function renderDashboard() {
  const salesToday = state.sales.filter(s => {
    const today = new Date().toISOString().substring(0, 10);
    return s.dateTime.substring(0, 10) === today && s.status === "Completed";
  });

  const totalSalesVal = salesToday.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalBills = salesToday.length;

  // Compute Profit: (SellingPrice - CostPrice) * qty
  let totalProfit = 0;
  let itemsSold = 0;
  salesToday.forEach(s => {
    s.items.forEach(item => {
      const prod = state.products.find(p => p.sku === item.sku);
      const cost = prod ? prod.costPrice : item.rate * 0.6; // fallback 40% margin
      const itemMargin = (item.rate - cost) * item.qty - (item.discountAmount);
      totalProfit += itemMargin;
      itemsSold += item.qty;
    });
  });

  // Calculate Low Stock alerts count
  const lowStockCount = state.products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length;

  // Update KPI fields
  document.getElementById("top-today-sales").innerText = `₹${totalSalesVal.toFixed(2)}`;
  document.getElementById("dash-kpi-sales").innerText = `₹${totalSalesVal.toFixed(2)}`;
  document.getElementById("dash-kpi-profit").innerText = `₹${totalProfit.toFixed(2)}`;
  document.getElementById("dash-kpi-bills").innerText = `${totalBills} Bills`;
  document.getElementById("dash-kpi-stock").innerText = `${lowStockCount} Dress Items`;

  // Render recent billing transactions list
  const recentTbody = document.getElementById("dash-sales-tbody");
  if (recentTbody) {
    const recents = [...state.sales].reverse().slice(0, 5);
    if (recents.length === 0) {
      recentTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">No sales bills generated today.</td></tr>`;
    } else {
      recentTbody.innerHTML = recents.map(s => {
        const time = new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
          <tr>
            <td><b>${s.invoiceNo}</b></td>
            <td>${time}</td>
            <td>${s.customerName}</td>
            <td><span class="badge-tag badge-size">${s.paymentMode}</span></td>
            <td style="text-align:right; font-weight:700;">₹${s.grandTotal.toFixed(2)}</td>
          </tr>
        `;
      }).join("");
    }
  }

  // Render Top Selling Apparel (derived from completed sales)
  const topList = document.getElementById("dash-top-products-list");
  if (topList) {
    // Map of sku -> { name, qty }
    const counts = {};
    state.sales.forEach(s => {
      if (s.status !== "Completed") return;
      s.items.forEach(i => {
        counts[i.sku] = counts[i.sku] || { name: i.name, qty: 0 };
        counts[i.sku].qty += i.qty;
      });
    });

    const sorted = Object.values(counts).sort((a, b) => b.qty - a.qty).slice(0, 5);
    if (sorted.length === 0) {
      topList.innerHTML = `<li style="text-align:center; padding: 10px; color: var(--text-muted); font-size:11px;">No records yet</li>`;
    } else {
      topList.innerHTML = sorted.map((p, idx) => {
        return `
          <li style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom: 1px dashed var(--border);">
            <span>${idx + 1}. <strong>${p.name}</strong></span>
            <span class="badge-tag badge-fabric" style="font-weight:800;">${p.qty} Sold</span>
          </li>
        `;
      }).join("");
    }
  }

  // Render 7-day sales trend bar chart
  const trendContainer = document.getElementById("dash-sales-trend-chart");
  if (trendContainer) {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().substring(0, 10);

      const daySales = state.sales.filter(s => s.dateTime.substring(0, 10) === dateStr && s.status === "Completed")
        .reduce((sum, s) => sum + s.grandTotal, 0);

      const dayLabel = d.toLocaleDateString([], { weekday: 'short' });
      last7Days.push({ dateStr, dayLabel, amount: daySales });
    }

    const maxAmount = Math.max(...last7Days.map(d => d.amount), 1000);

    trendContainer.innerHTML = last7Days.map(d => {
      const pct = (d.amount / maxAmount) * 100;
      return `
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
          <div style="font-size:10px; font-weight:700; margin-bottom:4px;">₹${Math.round(d.amount)}</div>
          <div style="width:100%; background:linear-gradient(to top, var(--primary) 0%, var(--accent) 100%); height:${pct}%; border-radius:4px 4px 0 0; min-height:4px; transition: height 0.5s ease;"></div>
          <div style="font-size:10px; color:var(--text-muted); margin-top:6px; font-weight:600;">${d.dayLabel}</div>
        </div>
      `;
    }).join("");
  }
}

// Redirect low stock dashboard KPI click to inventory stock page
function handleDashboardLowStockClick() {
  state.activeCategoryFilter = "All";
  switchModuleView("inventory");

  // Highlight/Filter low stock elements. Let's do a simple filter
  const tbody = document.getElementById("inventory-stock-tbody");
  if (tbody) {
    const rows = tbody.querySelectorAll("tr");
    rows.forEach(r => {
      const isLow = r.innerHTML.includes("LOW STOCK") || r.innerHTML.includes("OUT OF STOCK");
      r.style.display = isLow ? "" : "none";
    });
  }
}

// ==========================================================================
// SYSTEM INITIALIZATION & GLOBAL SHORTCUTS
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  loadStateFromStorage();

  // Clear active operator session on startup to enforce secure PIN pad authentication
  state.currentUser = null;

  // Render sidebar navigation links based on user/mode
  renderSidebar();

  // Bind menu triggers
  switchModuleView("dashboard");

  // Auto-focus passcode entry input field on page load
  const loginInput = document.getElementById("login-pin-input");
  if (loginInput) {
    setTimeout(() => { loginInput.focus(); }, 300);
  }

  // Update clocks every second
  setInterval(() => {
    const clockEl = document.getElementById("top-clock-pill");
    if (clockEl) {
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ` + new Date().toLocaleTimeString([], options);
    }
  }, 1000);

  // Initialize WebRTC P2P remote mobile scanner synchronization service
  initRemoteScannerSync();

  // Setup POS hotkeys keyboard event bindings
  document.addEventListener("keydown", (event) => {
    // Intercept keyboard typing if login screen is active
    const loginOverlay = document.getElementById("pos-login-screen");
    if (loginOverlay && loginOverlay.classList.contains("active")) {
      if (event.key >= "0" && event.key <= "9") {
        pressLoginPin(event.key);
      } else if (event.key === "Backspace") {
        const pinInput = document.getElementById("login-pin-input");
        if (pinInput && pinInput.value.length > 0) {
          pinInput.value = pinInput.value.substring(0, pinInput.value.length - 1);
        }
      } else if (event.key === "Enter") {
        submitLoginPin();
      }
      return; // Stop further processing
    }

    // Prevent default actions for function keys if we override them
    const hotkeys = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "Escape"];
    if (hotkeys.includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === "Escape") {
      closeAllModals();
    }

    if (state.currentView !== "pos") {
      // If pressing POS keys when elsewhere, switch view first
      if (["F2", "F5", "F6", "F8", "F9"].includes(event.key)) {
        switchModuleView("pos");
        return;
      }
    }

    switch (event.key) {
      case "F1": // Customer Mobile focus
        const phone = document.getElementById("pos-cust-phone");
        if (phone) {
          phone.focus();
          phone.select();
        }
        break;
      case "F2": // Product focus
        refocusBarcode();
        break;
      case "F3": // Focus Discount input
        const disc = document.getElementById("pos-discount-input");
        if (disc) {
          disc.focus();
          disc.select();
        }
        break;
      case "F4": // Open settlement modal
        openPaymentModal();
        break;
      case "F5": // Pay & Print Checkout
        if (document.getElementById("modal-pay").classList.contains("active")) {
          // If modal already open, complete settlement
          finishSaleAndPrint();
        } else {
          openPaymentModal();
        }
        break;
      case "F6": // Suspended bills queue view
        openHeldBillsModal();
        break;
      case "F7": // Switch to reports
        switchModuleView("reports");
        break;
      case "F8": // Clear active bill
        clearCurrentBill();
        break;
      case "F9": // Suspend current bill
        holdCurrentBill();
        break;
    }
  });

  // Bind Dashboard low stock KPI card click handler
  const kpiStockCard = document.querySelector(".kpi-card:nth-child(4)");
  if (kpiStockCard) {
    kpiStockCard.style.cursor = "pointer";
    kpiStockCard.setAttribute("onclick", "handleDashboardLowStockClick()");
  }

  // Handle global print settings override style widths dynamically
  const widthSelect = document.getElementById("settings-printer-width");
  if (widthSelect) {
    widthSelect.addEventListener("change", (e) => {
      state.settings.printerWidth = e.target.value;
      saveStateToStorage();

      const receipt = document.getElementById("thermal-receipt-area");
      if (receipt) {
        if (e.target.value === "58mm") {
          receipt.style.width = "58mm";
        } else if (e.target.value === "a4") {
          receipt.style.width = "100%";
          receipt.style.fontFamily = "var(--font-sans)";
        } else {
          receipt.style.width = "80mm";
        }
      }
      showToast(`Printer width adjusted to ${e.target.value}`, "info");
    });
  }

  // Sidebar toggle collapse click listener
  const sidebarToggle = document.getElementById("sidebar-toggle-btn");
  if (sidebarToggle) {
    sidebarToggle.style.cursor = "pointer";
    sidebarToggle.addEventListener("click", () => {
      document.querySelector(".app-sidebar").classList.toggle("collapsed");
    });
  }

  // Initial logo rendering and settings setup
  const headerName = document.querySelector(".sidebar-logo-text h2");
  const headerSub = document.querySelector(".sidebar-logo-text p");
  if (headerName && state.settings.storeName) headerName.innerText = state.settings.storeName;
  if (headerSub && state.settings.storeNameTamil) headerSub.innerText = state.settings.storeNameTamil;

  // Bind new category option
  const categoryForm = document.getElementById("new-category");
  if (categoryForm) {
    // Populate form drop downs with configured categories
    const categories = ["Shirts", "T-Shirts", "Jeans", "Trousers", "Formal Pants", "Casual Pants", "Shorts", "Blazers", "Suits", "Jackets", "Innerwear", "Track Pants", "Kurtas", "Traditional Wear", "Accessories", "Belts", "Wallets", "Caps", "Socks", "Other"];
    categoryForm.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
  }
});

// ==========================================================================
// SYSTEM HELPERS & ADDITIONAL ACTIONS
// ==========================================================================

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);

  const icon = document.getElementById("theme-icon");
  const text = document.getElementById("theme-text");

  if (icon && text) {
    if (newTheme === "dark") {
      icon.className = "fa-solid fa-sun";
      text.innerText = "Light Mode";
    } else {
      icon.className = "fa-solid fa-moon";
      text.innerText = "Dark Mode";
    }
  }

  showToast(`Theme changed to ${newTheme} mode`, "info");
}

function saveSystemSettings() {
  const name = document.getElementById("settings-name").value.trim();
  const nameTamil = document.getElementById("settings-name-tamil").value.trim();
  const address = document.getElementById("settings-address").value.trim();
  const gstin = document.getElementById("settings-gstin").value.trim();
  const phone = document.getElementById("settings-phone").value.trim();
  const upiId = document.getElementById("settings-upi-id").value.trim();
  const taxType = document.getElementById("settings-tax-type").value;
  const printerWidth = document.getElementById("settings-printer-width").value;

  if (!name || !gstin) {
    showToast("Store name and GSTIN are required.", "error");
    return;
  }

  state.settings = {
    storeName: name,
    storeNameTamil: nameTamil,
    address,
    gstin,
    phone,
    upiId,
    printerWidth,
    roundOffEnabled: true,
    taxCalculationType: taxType
  };

  saveStateToStorage();

  const headerName = document.querySelector(".sidebar-logo-text h2");
  const headerSub = document.querySelector(".sidebar-logo-text p");
  if (headerName) headerName.innerText = name;
  if (headerSub) headerSub.innerText = nameTamil;

  const rTitle = document.querySelector(".receipt-paper .title");
  const rTitleTamil = document.querySelector(".receipt-paper .tamil-title");
  const rSub = document.querySelector(".receipt-paper .sub");
  if (rTitle) rTitle.innerText = name;
  if (rTitleTamil) rTitleTamil.innerText = nameTamil;
  if (rSub) {
    rSub.innerHTML = `${address}<br>GSTIN: ${gstin} | Ph: ${phone}`;
  }

  showToast("System settings saved successfully!", "success");
  switchModuleView("dashboard");
}

function loadSettingsInUi() {
  const nameInput = document.getElementById("settings-name");
  const tamilInput = document.getElementById("settings-name-tamil");
  const addrInput = document.getElementById("settings-address");
  const gstinInput = document.getElementById("settings-gstin");
  const phoneInput = document.getElementById("settings-phone");
  const upiInput = document.getElementById("settings-upi-id");
  const taxSelect = document.getElementById("settings-tax-type");
  const widthSelect = document.getElementById("settings-printer-width");

  if (nameInput) nameInput.value = state.settings.storeName || "";
  if (tamilInput) tamilInput.value = state.settings.storeNameTamil || "";
  if (addrInput) addrInput.value = state.settings.address || "";
  if (gstinInput) gstinInput.value = state.settings.gstin || "";
  if (phoneInput) phoneInput.value = state.settings.phone || "";
  if (upiInput) upiInput.value = state.settings.upiId || "";
  if (taxSelect) taxSelect.value = state.settings.taxCalculationType || "Local";
  if (widthSelect) widthSelect.value = state.settings.printerWidth || "80mm";
}

function openPurchaseModal() {
  const modal = document.getElementById("modal-pay");
  const modalHeader = modal.querySelector(".modal-card-header h3");
  const modalBody = modal.querySelector(".modal-card-body");
  const modalFooter = modal.querySelector(".modal-card-footer");

  modalHeader.innerHTML = `<i class="fa-solid fa-plus"></i> Record Wholesale Purchase Intake`;
  modalFooter.style.display = "none";
  modal.querySelector(".modal-close-btn").setAttribute("onclick", "closeAndRestorePayModal()");

  const supplierOptions = state.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  const productOptions = state.products.map(p => `<option value="${p.sku}">${p.name} - ${p.sku} (Stock: ${p.stock})</option>`).join("");

  modalBody.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Select Supplier:</label>
        <select id="pur-supplier" class="form-control">
          ${supplierOptions}
        </select>
      </div>
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Wholesale Invoice No:</label>
        <input type="text" id="pur-invoice-no" class="form-control" placeholder="e.g. WH-45124">
      </div>
    </div>
    <div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:10px; margin-bottom:14px;">
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Apparel Item Variant:</label>
        <select id="pur-sku" class="form-control">
          ${productOptions}
        </select>
      </div>
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Quantity (Pcs):</label>
        <input type="number" id="pur-qty" class="form-control" value="10" min="1">
      </div>
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Cost Rate (₹/Pc):</label>
        <input type="number" id="pur-cost" class="form-control" placeholder="Cost per pc">
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Amount Paid (₹):</label>
        <input type="number" id="pur-paid" class="form-control" placeholder="e.g. 5000">
      </div>
      <div>
        <label style="font-weight:700; display:block; margin-bottom:4px;">Payment Method:</label>
        <select id="pur-payment-method" class="form-control">
          <option value="Cash">Cash</option>
          <option value="UPI GPay">UPI / GPay</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px;">
      <button class="btn-action-checkout" style="background:var(--border); color:var(--text-main);" onclick="closeAndRestorePayModal()">Cancel</button>
      <button class="btn-action-checkout btn-pay" onclick="savePurchaseEntry()">Save Stock & Invoice</button>
    </div>
  `;

  const skuSelect = document.getElementById("pur-sku");
  const costInput = document.getElementById("pur-cost");

  const updateCostField = () => {
    const selectedSku = skuSelect.value;
    const p = state.products.find(prod => prod.sku === selectedSku);
    if (p && costInput) costInput.value = p.costPrice;
  };

  if (skuSelect) {
    skuSelect.addEventListener("change", updateCostField);
    updateCostField();
  }

  openModal("modal-pay");
}

function savePurchaseEntry() {
  const supplierId = document.getElementById("pur-supplier").value;
  const invoiceNo = document.getElementById("pur-invoice-no").value.trim();
  const sku = document.getElementById("pur-sku").value;
  const qty = parseInt(document.getElementById("pur-qty").value) || 0;
  const cost = parseFloat(document.getElementById("pur-cost").value) || 0;
  const paid = parseFloat(document.getElementById("pur-paid").value) || 0;
  const payMethod = document.getElementById("pur-payment-method").value;

  if (!invoiceNo) {
    showToast("Please enter supplier invoice number.", "error");
    return;
  }
  if (qty <= 0 || cost <= 0) {
    showToast("Quantity and cost price must be positive values.", "error");
    return;
  }

  const totalBill = qty * cost;
  const due = Math.max(0, totalBill - paid);

  const supplierObj = state.suppliers.find(s => s.id === supplierId);
  const productObj = state.products.find(p => p.sku === sku);

  if (!supplierObj || !productObj) {
    showToast("Invalid supplier or product selected.", "error");
    return;
  }

  const purchaseId = "PO-2026-" + String(state.purchases.length + 88);
  const purchaseObj = {
    purchaseId,
    invoiceNo,
    date: new Date().toLocaleDateString('en-GB'),
    supplierName: supplierObj.name,
    supplierId,
    itemsList: `${productObj.name} (${productObj.size}) x${qty} pcs`,
    totalBill,
    paid,
    due,
    status: due === 0 ? "Full Paid" : (paid === 0 ? "Unpaid" : "Partial Paid")
  };

  state.purchases.push(purchaseObj);

  productObj.stock += qty;
  state.stockMovements.push({
    id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    sku,
    type: "Purchase",
    qty: qty,
    referenceNo: purchaseId,
    dateTime: new Date().toISOString(),
    notes: `Wholesale stock purchase intake, Inv ${invoiceNo}`
  });

  supplierObj.totalPurchases += totalBill;
  supplierObj.paid += paid;
  supplierObj.outstandingDue += due;

  if (paid > 0) {
    state.expenses.push({
      id: "EXP-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toISOString().substring(0, 10),
      category: "Stock Purchase",
      description: `Payment for Purchase Entry ${purchaseId} / Inv ${invoiceNo}`,
      paymentMethod: payMethod,
      amount: paid
    });
  }

  saveStateToStorage();
  closeAndRestorePayModal();

  renderPurchases();
  renderSuppliers();
  renderInventoryStock();

  showToast("Purchase recorded and stock added successfully!", "success");
}

function renderPurchases() {
  const tbody = document.getElementById("purchases-tbody");
  if (!tbody) return;

  if (state.purchases.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No purchases logged yet.</td></tr>`;
    return;
  }

  const reversed = [...state.purchases].reverse();
  tbody.innerHTML = reversed.map(p => {
    let badgeClass = "badge-fabric";
    if (p.status === "Full Paid") badgeClass = "badge-size";
    else if (p.status === "Unpaid") badgeClass = "badge-color";

    return `
      <tr>
        <td><b>${p.purchaseId}</b><br><span style="font-size:9px; color:var(--text-muted);">Ref: ${p.invoiceNo}</span></td>
        <td>${p.date}</td>
        <td>${p.supplierName}</td>
        <td>${p.itemsList}</td>
        <td style="text-align:right; font-weight:700;">₹${p.totalBill.toFixed(2)}</td>
        <td style="text-align:right; color:var(--success);">₹${p.paid.toFixed(2)}</td>
        <td style="text-align:right; color:${p.due > 0 ? 'var(--danger)' : 'var(--text-main)'}; font-weight:700;">₹${p.due.toFixed(2)}</td>
        <td style="text-align:center;"><span class="badge-tag ${badgeClass}">${p.status}</span></td>
      </tr>
    `;
  }).join("");
}

// ==========================================================================
// ROLE-BASED ACCESS CONTROL (RBAC) & SESSION MANAGERS
// ==========================================================================

function openSwitchUserModal() {
  const select = document.getElementById("switch-user-select");
  if (select) {
    select.innerHTML = state.users.map(u => {
      return `<option value="${u.username}">${u.name} (${u.role})</option>`;
    }).join("");
  }
  const pinField = document.getElementById("switch-user-pin");
  if (pinField) pinField.value = "";
  openModal("modal-switch-user");
}

function handleUserSelectChange() {
  const pinField = document.getElementById("switch-user-pin");
  if (pinField) pinField.value = "";
}

function validateUserSwitchPIN() {
  const username = document.getElementById("switch-user-select").value;
  const pin = document.getElementById("switch-user-pin").value;

  const user = state.users.find(u => u.username === username);
  if (!user) {
    showToast("Selected user profile does not exist.", "error");
    return;
  }

  if (user.pin !== pin) {
    alert("Incorrect PIN code. Access Denied.");
    showToast("Invalid 4-digit passcode PIN. Try again.", "error");
    return;
  }

  // Successful Switch
  state.currentUser = user;
  saveStateToStorage();

  const userRoleEl = document.getElementById("top-user-role");
  if (userRoleEl) {
    userRoleEl.innerText = `${user.username} (${user.role})`;
  }

  logAuditActivity("User Login", `User switched to ${user.name} (${user.role})`);
  showToast(`Welcome back, ${user.name}!`, "success");

  // Update view mode toggle display button
  updateViewModeToggleBtnDisplay();

  // If role is Cashier, force to cashier mode
  if (user.role === "CASHIER") {
    state.viewMode = "cashier";
    saveStateToStorage();
    switchModuleView("pos");
  } else {
    // Keep active view mode but re-render dashboard or POS
    if (state.viewMode === "admin") {
      switchModuleView("admin-dashboard");
    } else {
      switchModuleView("dashboard");
    }
  }

  renderSidebar();
  closeModal("modal-switch-user");
}

function updateViewModeToggleBtnDisplay() {
  const btn = document.getElementById("view-mode-toggle-btn");
  if (!btn) return;

  if (state.currentUser && state.currentUser.role !== "CASHIER") {
    btn.style.display = "flex";
    const toggleText = document.getElementById("view-mode-toggle-text");
    if (toggleText) {
      toggleText.innerText = state.viewMode === "admin" ? "POS WORKSTATION" : "ADMIN PANEL";
    }
    const toggleIcon = btn.querySelector("i");
    if (toggleIcon) {
      toggleIcon.className = state.viewMode === "admin" ? "fa-solid fa-cash-register" : "fa-solid fa-user-gear";
    }
  } else {
    btn.style.display = "none";
  }
}

function toggleViewMode() {
  if (!state.currentUser || state.currentUser.role === "CASHIER") {
    showToast("Access Denied: Cashiers do not have Admin privileges.", "error");
    return;
  }

  state.viewMode = state.viewMode === "admin" ? "cashier" : "admin";
  saveStateToStorage();

  updateViewModeToggleBtnDisplay();
  renderSidebar();

  if (state.viewMode === "admin") {
    switchModuleView("admin-dashboard");
  } else {
    switchModuleView("dashboard");
  }

  showToast(`Switched workspace to ${state.viewMode.toUpperCase()} mode`, "info");
}

function checkPermission(requiredRole) {
  return true;
}

function renderSidebar() {
  const container = document.getElementById("sidebar-nav-links");
  if (!container) return;

  // Render unified navigation matching all administrative and sales billing features
  const html = `
    <div class="nav-section-title">SALES & BILLING</div>
    
    <button class="sidebar-menu-btn active" onclick="switchModuleView('pos', this)">
      <div class="left-grp"><i class="fa-solid fa-cash-register"></i> <span>POS Billing Workspace</span></div>
      <span class="menu-badge" style="background:var(--success); color:#fff; font-size:9px; padding:2px 6px;">POS</span>
    </button>
    
    <button class="sidebar-menu-btn" onclick="switchModuleView('admin-dashboard', this)">
      <div class="left-grp"><i class="fa-solid fa-chart-pie"></i> <span>Admin Dashboard</span></div>
    </button>

    <div class="nav-section-title">CATALOG & INVENTORY</div>
    
    <button class="sidebar-menu-btn" onclick="switchModuleView('products', this)">
      <div class="left-grp"><i class="fa-solid fa-shirt"></i> <span>Manage Apparel Matrix</span></div>
    </button>
    
    <button class="sidebar-menu-btn" onclick="switchModuleView('admin-barcodes', this)">
      <div class="left-grp"><i class="fa-solid fa-barcode"></i> <span>Barcode Labels Manager</span></div>
    </button>

    <button class="sidebar-menu-btn" onclick="switchModuleView('admin-categories', this)">
      <div class="left-grp"><i class="fa-solid fa-tags"></i> <span>Categories & Brands</span></div>
    </button>

    <button class="sidebar-menu-btn" onclick="switchModuleView('inventory', this)">
      <div class="left-grp"><i class="fa-solid fa-boxes-stacked"></i> <span>Current Stock Overview</span></div>
    </button>

    <div class="nav-section-title">SALES & PURCHASES</div>
    
    <button class="sidebar-menu-btn" onclick="switchModuleView('purchases', this)">
      <div class="left-grp"><i class="fa-solid fa-truck-ramp-box"></i> <span>Purchases History</span></div>
    </button>
    
    <button class="sidebar-menu-btn" onclick="switchModuleView('suppliers', this)">
      <div class="left-grp"><i class="fa-solid fa-building-user"></i> <span>Suppliers Outstanding</span></div>
    </button>

    <button class="sidebar-menu-btn" onclick="switchModuleView('customers', this)">
      <div class="left-grp"><i class="fa-solid fa-users"></i> <span>Customers Directory</span></div>
    </button>

    <button class="sidebar-menu-btn" onclick="switchModuleView('expenses', this)">
      <div class="left-grp"><i class="fa-solid fa-wallet"></i> <span>Expenses Logs</span></div>
    </button>

    <div class="nav-section-title">REPORTS & SECURITY</div>

    <button class="sidebar-menu-btn" onclick="switchModuleView('reports', this)">
      <div class="left-grp"><i class="fa-solid fa-chart-line"></i> <span>Reports & GST Audit</span></div>
    </button>

    <button class="sidebar-menu-btn" onclick="switchModuleView('admin-users', this)">
      <div class="left-grp"><i class="fa-solid fa-users-gear"></i> <span>Users & Roles</span></div>
    </button>

    <button class="sidebar-menu-btn" onclick="switchModuleView('admin-audit-logs', this)">
      <div class="left-grp"><i class="fa-solid fa-clock-rotate-left"></i> <span>Activity Audit Logs</span></div>
    </button>

    <button class="sidebar-menu-btn" onclick="switchModuleView('settings', this)">
      <div class="left-grp"><i class="fa-solid fa-gears"></i> <span>System Settings</span></div>
    </button>

    <div style="padding:15px; margin-top:10px;">
      <button class="btn-qty" style="width:100%; font-size:10px; background:var(--bg-card-subtle); color:var(--text-main); height:28px;" onclick="lockWorkstation()">
        <i class="fa-solid fa-lock"></i> Lock Station
      </button>
    </div>
  `;

  container.innerHTML = html;
}

// ==========================================================================
// SYSTEM AUDIT LOG SERVICE
// ==========================================================================

function logAuditActivity(action, details) {
  const operator = state.currentUser ? state.currentUser.name : "System";
  const log = {
    id: "LOG-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    timestamp: new Date().toISOString(),
    user: operator,
    action: action,
    details: details
  };
  state.auditLogs.unshift(log);
  // Keep logs capped at 500 records
  if (state.auditLogs.length > 500) {
    state.auditLogs.pop();
  }
  saveStateToStorage();
}

// ==========================================================================
// ADMIN DASHBOARD RENDERING
// ==========================================================================

function renderAdminDashboard() {
  const today = new Date().toISOString().substring(0, 10);

  // Today KPI calculations
  const salesToday = state.sales.filter(s => s.dateTime.substring(0, 10) === today && s.status === "Completed");
  const salesVal = salesToday.reduce((sum, s) => sum + s.grandTotal, 0);
  const billsVal = salesToday.length;

  let grossProfit = 0;
  let itemsSold = 0;

  salesToday.forEach(s => {
    s.items.forEach(item => {
      const prod = state.products.find(p => p.sku === item.sku);
      const cost = prod ? prod.costPrice : item.rate * 0.6;
      grossProfit += (item.rate - cost) * item.qty - (item.discountAmount);
      itemsSold += item.qty;
    });
  });

  // Today's Returns
  const returnsToday = state.returns.filter(r => r.date === new Date().toLocaleDateString('en-GB'));
  const returnsVal = returnsToday.reduce((sum, r) => sum + r.refundAmount, 0);

  // Today's Expenses
  const expensesToday = state.expenses.filter(e => e.date === today);
  const expensesVal = expensesToday.reduce((sum, e) => sum + e.amount, 0);

  // Low Stock Count
  const lowStockCount = state.products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel && !p.isArchived).length;

  // Customer Outstanding Credit Due
  const creditVal = state.customers.reduce((sum, c) => sum + (c.outstandingDue || 0), 0);

  // Weekly Sales (Last 7 Days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklySales = state.sales.filter(s => {
    const sDate = new Date(s.dateTime);
    return sDate >= oneWeekAgo && s.status === "Completed";
  }).reduce((sum, s) => sum + s.grandTotal, 0);

  // Monthly Sales (Current Month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySales = state.sales.filter(s => {
    const sDate = new Date(s.dateTime);
    return sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear && s.status === "Completed";
  }).reduce((sum, s) => sum + s.grandTotal, 0);

  // Update elements
  document.getElementById("admin-kpi-sales").innerText = `₹${salesVal.toFixed(2)}`;
  document.getElementById("admin-kpi-sales-sub").innerText = `${billsVal} completed invoice(s)`;
  document.getElementById("admin-kpi-profit").innerText = `₹${grossProfit.toFixed(2)}`;
  document.getElementById("admin-kpi-bills").innerText = `${billsVal} Bills`;
  document.getElementById("admin-kpi-bills-sub").innerText = `${itemsSold} items sold`;
  document.getElementById("admin-kpi-stock").innerText = `${lowStockCount} SKUs`;

  document.getElementById("admin-kpi-weekly").innerText = `₹${weeklySales.toFixed(2)}`;
  document.getElementById("admin-kpi-monthly").innerText = `₹${monthlySales.toFixed(2)}`;
  document.getElementById("admin-kpi-returns").innerText = `₹${returnsVal.toFixed(2)}`;
  document.getElementById("admin-kpi-credit").innerText = `₹${creditVal.toFixed(2)}`;

  document.getElementById("admin-kpi-expenses").innerText = `₹${expensesVal.toFixed(2)}`;
  document.getElementById("admin-kpi-expenses-sub").innerText = `${expensesToday.length} expense item(s) logged`;

  // Payment Mode Splits
  const paymentBreakdown = document.getElementById("admin-payment-breakdown");
  if (paymentBreakdown) {
    const splits = { Cash: 0, UPI: 0, Card: 0, Credit: 0 };
    salesToday.forEach(s => {
      splits[s.paymentMode] = (splits[s.paymentMode] || 0) + s.grandTotal;
    });

    const maxVal = Math.max(...Object.values(splits), 1);
    paymentBreakdown.innerHTML = Object.entries(splits).map(([mode, amt]) => {
      const pct = (amt / maxVal) * 100;
      return `
        <div style="display:flex; flex-direction:column; align-items:center; flex:1;">
          <div style="font-weight:700; font-size:10px;">₹${Math.round(amt)}</div>
          <div style="width:20px; height:60px; background:var(--bg-card-subtle); border-radius:4px; display:flex; align-items:flex-end; margin:4px 0;">
            <div style="width:100%; height:${pct}%; background:var(--primary); border-radius:4px;"></div>
          </div>
          <span style="font-size:10px; font-weight:600; color:var(--text-muted);">${mode}</span>
        </div>
      `;
    }).join("");
  }

  // Recent Wholesale purchases
  const purchaseTbody = document.getElementById("admin-dash-purchases-tbody");
  if (purchaseTbody) {
    const recents = state.purchases.slice(-3).reverse();
    if (recents.length === 0) {
      purchaseTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; font-size:10px; color:var(--text-muted); padding:10px;">No purchases logs.</td></tr>`;
    } else {
      purchaseTbody.innerHTML = recents.map(p => {
        return `
          <tr>
            <td><b>${p.purchaseId}</b></td>
            <td>${p.supplierName}</td>
            <td style="font-size:10px;">${p.itemsList}</td>
            <td style="text-align:right; font-weight:700;">₹${p.totalBill.toFixed(2)}</td>
          </tr>
        `;
      }).join("");
    }
  }

  // Recent returns
  const returnsTbody = document.getElementById("admin-dash-returns-tbody");
  if (returnsTbody) {
    const recents = state.returns.slice(-3).reverse();
    if (recents.length === 0) {
      returnsTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; font-size:10px; color:var(--text-muted); padding:10px;">No returns.</td></tr>`;
    } else {
      returnsTbody.innerHTML = recents.map(r => {
        return `
          <tr>
            <td><b>${r.returnId}</b></td>
            <td>${r.invoiceNo}</td>
            <td style="text-align:right; font-weight:700; color:var(--danger);">₹${r.refundAmount.toFixed(2)}</td>
          </tr>
        `;
      }).join("");
    }
  }

  // Populate category filters in Products catalog views while rendering
  const catFilter = document.getElementById("admin-filter-category");
  const quickCat = document.getElementById("quick-prod-category");
  const addCat = document.getElementById("add-prod-category");
  const bulkCat = document.getElementById("bulk-new-category");

  const categories = Array.from(new Set(state.products.map(p => p.category)));
  if (catFilter) {
    catFilter.innerHTML = `<option value="All">All Categories</option>` + categories.map(c => `<option value="${c}">${c}</option>`).join("");
  }
  if (quickCat) {
    quickCat.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
  }
  if (addCat) {
    addCat.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
  }
  if (bulkCat) {
    bulkCat.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
  }

  const brandFilter = document.getElementById("admin-filter-brand");
  if (brandFilter) {
    const brands = Array.from(new Set(state.products.map(p => p.brand || "Local Brand")));
    brandFilter.innerHTML = `<option value="All">All Brands</option>` + brands.map(b => `<option value="${b}">${b}</option>`).join("");
  }
}

// ==========================================================================
// ADMIN PRODUCTS CATALOG RENDERING & CRUD
// ==========================================================================

let adminProductsPage = 1;

function renderAdminProductsList() {
  const tbody = document.getElementById("products-matrix-tbody");
  if (!tbody) return;

  const query = document.getElementById("admin-prod-search").value.trim().toLowerCase();
  const cat = document.getElementById("admin-filter-category").value;
  const brand = document.getElementById("admin-filter-brand").value;
  const size = document.getElementById("admin-filter-size").value;
  const status = document.getElementById("admin-filter-status").value;

  // Filter products list
  let filtered = state.products.filter(p => {
    // Query search
    const matchesQuery = p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.barcode.includes(query) ||
      (p.color && p.color.toLowerCase().includes(query));

    const matchesCat = cat === "All" || p.category === cat;
    const matchesBrand = brand === "All" || (p.brand || "Local Brand") === brand;
    const matchesSize = size === "All" || p.size === size;

    let matchesStatus = true;
    if (status === "InStock") matchesStatus = p.stock > p.reorderLevel && !p.isArchived;
    else if (status === "LowStock") matchesStatus = p.stock > 0 && p.stock <= p.reorderLevel && !p.isArchived;
    else if (status === "OutOfStock") matchesStatus = p.stock === 0 && !p.isArchived;
    else if (status === "Archived") matchesStatus = p.isArchived === true;
    else matchesStatus = !p.isArchived; // default hide archived in normal view

    return matchesQuery && matchesCat && matchesBrand && matchesSize && matchesStatus;
  });

  // Pagination Calculations
  const perPage = parseInt(document.getElementById("admin-prod-per-page").value) || 25;
  const totalItems = filtered.length;
  const totalPages = Math.max(Math.ceil(totalItems / perPage), 1);
  if (adminProductsPage > totalPages) adminProductsPage = totalPages;

  const startIdx = (adminProductsPage - 1) * perPage;
  const endIdx = Math.min(startIdx + perPage, totalItems);

  document.getElementById("admin-prod-pagination-info").innerText = `Showing ${totalItems > 0 ? startIdx + 1 : 0}-${endIdx} of ${totalItems} variants`;

  const pageItems = filtered.slice(startIdx, endIdx);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding:30px; color:var(--text-muted);">No products match the selected criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(p => {
    const isSelected = state.selectedProductSkus.includes(p.sku);
    let statusBadge = `<span class="badge-tag badge-size" style="background:#d1fae5; color:#065f46;">In Stock</span>`;
    if (p.isArchived) {
      statusBadge = `<span class="badge-tag" style="background:#e5e7eb; color:#374151;">Archived</span>`;
    } else if (p.stock === 0) {
      statusBadge = `<span class="badge-tag badge-color" style="background:#fee2e2; color:#991b1b;">Out Stock</span>`;
    } else if (p.stock <= p.reorderLevel) {
      statusBadge = `<span class="badge-tag badge-fabric" style="background:#fef3c7; color:#92400e;">Low Stock</span>`;
    }

    return `
      <tr style="opacity: ${p.isArchived ? 0.6 : 1};">
        <td><input type="checkbox" ${isSelected ? "checked" : ""} onchange="toggleProductSelection('${p.sku}', this.checked)"></td>
        <td>
          <div style="font-weight:700;">${p.name}</div>
          <span style="font-size:10px; color:var(--text-muted);">${p.size} | ${p.color} | ${p.fabric}</span>
        </td>
        <td><code>${p.sku}</code></td>
        <td><code>${p.barcode}</code></td>
        <td><span class="badge-tag badge-fabric">${p.category}</span></td>
        <td style="text-align:right;">₹${p.mrp}</td>
        <td style="text-align:right; font-weight:700;">₹${p.sellingPrice}</td>
        <td style="text-align:center; font-weight:700; color:${p.stock <= p.reorderLevel ? 'var(--danger)' : 'var(--success)'};">${p.stock}</td>
        <td style="text-align:center;">${p.gstRate}%</td>
        <td style="text-align:center;">${statusBadge}</td>
        <td style="text-align:center;">
          <div style="display:flex; justify-content:center; gap:4px;">
            <button class="btn-qty" style="width:24px; height:24px; padding:0;" title="Edit" onclick="editProductAndVariants('${p.name}')"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-qty" style="width:24px; height:24px; padding:0; color:var(--primary);" title="Duplicate" onclick="duplicateApparelProduct('${p.sku}')"><i class="fa-solid fa-copy"></i></button>
            ${p.isArchived ? `
              <button class="btn-qty" style="width:24px; height:24px; padding:0; color:var(--success);" title="Restore" onclick="restoreApparelProduct('${p.sku}')"><i class="fa-solid fa-rotate-left"></i></button>
            ` : `
              <button class="btn-qty" style="width:24px; height:24px; padding:0; color:var(--danger);" title="Archive" onclick="archiveApparelProduct('${p.sku}')"><i class="fa-solid fa-box-archive"></i></button>
            `}
            <button class="btn-qty" style="width:24px; height:24px; padding:0; color:red;" title="Delete" onclick="deleteApparelProduct('${p.sku}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Render Pagination Controls
  const pag = document.getElementById("admin-prod-pagination-controls");
  if (pag) {
    let ctrlHtml = "";
    ctrlHtml += `<button class="btn-qty" style="width:auto; padding:0 8px; height:26px;" ${adminProductsPage === 1 ? 'disabled' : ''} onclick="changeAdminProductsPage(1)">First</button>`;
    ctrlHtml += `<button class="btn-qty" style="width:26px; height:26px; padding:0;" ${adminProductsPage === 1 ? 'disabled' : ''} onclick="changeAdminProductsPage(${adminProductsPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
    ctrlHtml += `<span style="font-size:12px; font-weight:700; align-self:center; margin:0 8px;">Page ${adminProductsPage} of ${totalPages}</span>`;
    ctrlHtml += `<button class="btn-qty" style="width:26px; height:26px; padding:0;" ${adminProductsPage === totalPages ? 'disabled' : ''} onclick="changeAdminProductsPage(${adminProductsPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
    ctrlHtml += `<button class="btn-qty" style="width:auto; padding:0 8px; height:26px;" ${adminProductsPage === totalPages ? 'disabled' : ''} onclick="changeAdminProductsPage(${totalPages})">Last</button>`;

    pag.innerHTML = ctrlHtml;
  }
}

function changeAdminProductsPage(page) {
  adminProductsPage = page;
  renderAdminProductsList();
}

function toggleAllProductCheckboxes(master) {
  const query = document.getElementById("admin-prod-search").value.trim().toLowerCase();
  const cat = document.getElementById("admin-filter-category").value;
  const brand = document.getElementById("admin-filter-brand").value;
  const size = document.getElementById("admin-filter-size").value;
  const status = document.getElementById("admin-filter-status").value;

  let filtered = state.products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query) || p.barcode.includes(query);
    const matchesCat = cat === "All" || p.category === cat;
    const matchesBrand = brand === "All" || (p.brand || "Local Brand") === brand;
    const matchesSize = size === "All" || p.size === size;
    let matchesStatus = !p.isArchived;
    if (status === "Archived") matchesStatus = p.isArchived === true;
    return matchesQuery && matchesCat && matchesBrand && matchesSize && matchesStatus;
  });

  if (master.checked) {
    filtered.forEach(p => {
      if (!state.selectedProductSkus.includes(p.sku)) {
        state.selectedProductSkus.push(p.sku);
      }
    });
  } else {
    filtered.forEach(p => {
      state.selectedProductSkus = state.selectedProductSkus.filter(s => s !== p.sku);
    });
  }

  renderAdminProductsList();
  updateBulkToolbar();
}

function toggleProductSelection(sku, isChecked) {
  if (isChecked) {
    if (!state.selectedProductSkus.includes(sku)) state.selectedProductSkus.push(sku);
  } else {
    state.selectedProductSkus = state.selectedProductSkus.filter(s => s !== sku);
  }
  updateBulkToolbar();
}

function updateBulkToolbar() {
  const bar = document.getElementById("admin-bulk-toolbar");
  const count = document.getElementById("admin-bulk-selected-count");
  if (!bar || !count) return;

  if (state.selectedProductSkus.length > 0) {
    bar.style.display = "flex";
    count.innerText = state.selectedProductSkus.length;
  } else {
    bar.style.display = "none";
  }
}

// Bulk Actions Logic
function triggerBulkChangeCategory() {
  const select = document.getElementById("bulk-new-category");
  if (select) {
    const categories = Array.from(new Set(state.products.map(p => p.category)));
    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
  }
  openModal("modal-bulk-category");
}

function applyBulkCategoryChange() {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Managers or Admins only.", "error");
    return;
  }
  const newCat = document.getElementById("bulk-new-category").value;
  state.selectedProductSkus.forEach(sku => {
    const p = state.products.find(prod => prod.sku === sku);
    if (p) p.category = newCat;
  });

  logAuditActivity("Bulk Edit", `Updated category to "${newCat}" for ${state.selectedProductSkus.length} variants.`);
  saveStateToStorage();
  state.selectedProductSkus = [];
  updateBulkToolbar();
  renderAdminProductsList();
  closeModal("modal-bulk-category");
  showToast("Selected products updated successfully", "success");
}

function triggerBulkChangePrice() {
  const input = document.getElementById("bulk-new-price");
  if (input) input.value = "";
  openModal("modal-bulk-price");
}

function applyBulkPriceChange() {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Managers or Admins only.", "error");
    return;
  }
  const newPrice = parseFloat(document.getElementById("bulk-new-price").value) || 0;
  if (newPrice <= 0) {
    showToast("Please enter a valid price.", "error");
    return;
  }
  state.selectedProductSkus.forEach(sku => {
    const p = state.products.find(prod => prod.sku === sku);
    if (p) p.sellingPrice = newPrice;
  });

  logAuditActivity("Bulk Edit", `Updated price to ₹${newPrice} for ${state.selectedProductSkus.length} variants.`);
  saveStateToStorage();
  state.selectedProductSkus = [];
  updateBulkToolbar();
  renderAdminProductsList();
  closeModal("modal-bulk-price");
  showToast("Selected selling prices updated successfully", "success");
}

function triggerBulkChangeGST() {
  openModal("modal-bulk-gst");
}

function applyBulkGSTChange() {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrators privilege only.", "error");
    return;
  }
  const newGst = parseInt(document.getElementById("bulk-new-gst").value) || 0;
  state.selectedProductSkus.forEach(sku => {
    const p = state.products.find(prod => prod.sku === sku);
    if (p) p.gstRate = newGst;
  });

  logAuditActivity("Bulk Edit", `Updated GST rate to ${newGst}% for ${state.selectedProductSkus.length} variants.`);
  saveStateToStorage();
  state.selectedProductSkus = [];
  updateBulkToolbar();
  renderAdminProductsList();
  closeModal("modal-bulk-gst");
  showToast("Selected GST rates updated successfully", "success");
}

function triggerBulkArchive() {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Managers or Admins only.", "error");
    return;
  }
  if (!confirm(`Are you sure you want to archive ${state.selectedProductSkus.length} variants?`)) return;

  state.selectedProductSkus.forEach(sku => {
    const p = state.products.find(prod => prod.sku === sku);
    if (p) p.isArchived = true;
  });

  logAuditActivity("Bulk Archive", `Archived ${state.selectedProductSkus.length} product variants.`);
  saveStateToStorage();
  state.selectedProductSkus = [];
  updateBulkToolbar();
  renderAdminProductsList();
  showToast("Selected variants archived", "success");
}

function triggerBulkDelete() {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrator privilege only.", "error");
    return;
  }
  if (!confirm(`Are you sure you want to delete ${state.selectedProductSkus.length} variants? Items with previous invoice sales history will be archived instead.`)) return;

  let deletedCount = 0;
  let archivedCount = 0;

  state.selectedProductSkus.forEach(sku => {
    const p = state.products.find(prod => prod.sku === sku);
    if (!p) return;

    const hasSalesHistory = state.sales.some(s => s.items.some(item => item.sku === sku));
    if (hasSalesHistory) {
      p.isArchived = true;
      archivedCount++;
    } else {
      state.products = state.products.filter(prod => prod.sku !== sku);
      deletedCount++;
    }
  });

  logAuditActivity("Bulk Delete", `Deleted ${deletedCount} and archived ${archivedCount} variants.`);
  saveStateToStorage();
  state.selectedProductSkus = [];
  updateBulkToolbar();
  renderAdminProductsList();
  showToast(`Bulk delete complete (${deletedCount} deleted, ${archivedCount} archived)`, "success");
}

// Single Action Handlers
function duplicateApparelProduct(sku) {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Managers or Admins only.", "error");
    return;
  }
  const original = state.products.find(p => p.sku === sku);
  if (!original) return;

  const randNum = String(Math.floor(1000 + Math.random() * 9000));
  const newSku = original.sku + "-COPY";
  const newBarcode = original.barcode ? original.barcode + randNum.substring(2) : "890" + randNum;

  const duplicated = {
    ...original,
    sku: newSku,
    barcode: newBarcode,
    name: original.name + " (Copy)",
    stock: 0 // duplicate with zero opening stock
  };

  state.products.push(duplicated);
  logAuditActivity("Duplicate Product", `Duplicated product ${sku} to create ${newSku}`);
  saveStateToStorage();
  renderAdminProductsList();
  showToast(`Product variant duplicated to SKU ${newSku}`, "success");
}

function archiveApparelProduct(sku) {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Managers or Admins only.", "error");
    return;
  }
  const p = state.products.find(prod => prod.sku === sku);
  if (p) {
    p.isArchived = true;
    logAuditActivity("Archive Product", `Archived SKU variant: ${sku}`);
    saveStateToStorage();
    renderAdminProductsList();
    showToast("Variant archived", "success");
  }
}

function restoreApparelProduct(sku) {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Managers or Admins only.", "error");
    return;
  }
  const p = state.products.find(prod => prod.sku === sku);
  if (p) {
    p.isArchived = false;
    logAuditActivity("Restore Product", `Restored SKU variant: ${sku}`);
    saveStateToStorage();
    renderAdminProductsList();
    showToast("Variant restored to catalog", "success");
  }
}

function deleteApparelProduct(sku) {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrator privilege required.", "error");
    return;
  }
  const p = state.products.find(prod => prod.sku === sku);
  if (!p) return;

  const hasSalesHistory = state.sales.some(s => s.items.some(item => item.sku === sku));
  if (hasSalesHistory) {
    if (confirm(`"${p.name}" has invoice transaction history and cannot be permanently deleted. Would you like to archive it instead?`)) {
      p.isArchived = true;
      logAuditActivity("Archive Product", `Archived variant ${sku} due to active transactional dependencies.`);
      saveStateToStorage();
      renderAdminProductsList();
      showToast("Variant archived instead of deletion", "success");
    }
    return;
  }

  if (confirm(`Are you sure you want to permanently delete variant SKU: ${sku}?`)) {
    state.products = state.products.filter(prod => prod.sku !== sku);
    logAuditActivity("Delete Product", `Permanently deleted SKU variant: ${sku}`);
    saveStateToStorage();
    renderAdminProductsList();
    showToast("Variant deleted successfully", "success");
  }
}

// ==========================================================================
// DYNAMIC MULTI-VARIANT ADD/EDIT PRODUCT PANEL
// ==========================================================================

let editingBaseProduct = null;

function addNewVariantRowInput(initialValues = null) {
  const tbody = document.getElementById("add-prod-variants-tbody");
  if (!tbody) return;

  const rowId = "var-row-" + Math.random().toString(36).substring(2, 9);
  const sizeOptions = ["S", "M", "L", "XL", "XXL", "3XL", "28", "30", "32", "34", "36", "38", "40"].map(s => {
    const sel = initialValues && initialValues.size === s ? "selected" : "";
    return `<option value="${s}" ${sel}>${s}</option>`;
  }).join("");

  const gstOptions = [0, 5, 12, 18, 28].map(g => {
    const sel = initialValues && initialValues.gstRate === g ? "selected" : (g === 5 ? "selected" : "");
    return `<option value="${g}" ${sel}>${g}%</option>`;
  }).join("");

  const tr = document.createElement("tr");
  tr.id = rowId;
  tr.innerHTML = `
    <td><input type="text" class="form-control var-sku" value="${initialValues ? initialValues.sku : ''}" style="font-family:monospace; font-size:11px;" placeholder="SKU-CODE"></td>
    <td><input type="text" class="form-control var-barcode" value="${initialValues ? initialValues.barcode : ''}" style="font-family:monospace; font-size:11px;" placeholder="Barcode"></td>
    <td><select class="form-control var-size">${sizeOptions}</select></td>
    <td><input type="text" class="form-control var-color" value="${initialValues ? initialValues.color : 'Blue'}" placeholder="Color"></td>
    <td><input type="text" class="form-control var-fabric" value="${initialValues ? initialValues.fabric : 'Cotton'}" placeholder="Fabric"></td>
    <td><input type="number" class="form-control var-cost" value="${initialValues ? initialValues.costPrice : ''}" style="text-align:right;" placeholder="Cost"></td>
    <td><input type="number" class="form-control var-mrp" value="${initialValues ? initialValues.mrp : ''}" style="text-align:right;" placeholder="MRP"></td>
    <td><input type="number" class="form-control var-rate" value="${initialValues ? initialValues.sellingPrice : ''}" style="text-align:right;" placeholder="Price"></td>
    <td><select class="form-control var-gst">${gstOptions}</select></td>
    <td><input type="number" class="form-control var-stock" value="${initialValues ? initialValues.stock : '10'}" style="text-align:center;" min="0"></td>
    <td><input type="number" class="form-control var-reorder" value="${initialValues ? initialValues.reorderLevel : '3'}" style="text-align:center;" min="0"></td>
    <td><button class="btn-qty" style="color:var(--danger); border:none; background:none;" onclick="this.closest('tr').remove()">&times;</button></td>
  `;

  tbody.appendChild(tr);
}

function editProductAndVariants(baseProductName) {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Managers or Admins privileges only.", "error");
    return;
  }
  editingBaseProduct = baseProductName;
  switchModuleView("admin-add-product");

  // Set Title
  document.getElementById("add-product-view-title").innerText = `Edit Apparel Catalog details: ${baseProductName}`;

  // Get all variants matching name
  const variants = state.products.filter(p => p.name === baseProductName || p.name.startsWith(baseProductName + " (Copy)"));
  if (variants.length === 0) return;

  // Populate Section 1
  document.getElementById("add-prod-name").value = baseProductName;
  document.getElementById("add-prod-category").value = variants[0].category;
  document.getElementById("add-prod-brand").value = variants[0].brand || "Local Brand";

  // Clear and Populate Section 2
  const tbody = document.getElementById("add-prod-variants-tbody");
  if (tbody) {
    tbody.innerHTML = "";
    variants.forEach(v => addNewVariantRowInput(v));
  }
}

function saveProductAndVariants() {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Permission block.", "error");
    return;
  }
  const prodName = document.getElementById("add-prod-name").value.trim();
  const category = document.getElementById("add-prod-category").value;
  const brand = document.getElementById("add-prod-brand").value.trim() || "Local Brand";

  if (!prodName) {
    showToast("Please enter product title name.", "error");
    return;
  }

  const tbody = document.getElementById("add-prod-variants-tbody");
  const rows = tbody.querySelectorAll("tr");
  if (rows.length === 0) {
    showToast("Please add at least one product variant.", "error");
    return;
  }

  const parsedVariants = [];
  let validationError = false;

  rows.forEach(r => {
    if (validationError) return;
    const sku = r.querySelector(".var-sku").value.trim();
    const barcode = r.querySelector(".var-barcode").value.trim();
    const size = r.querySelector(".var-size").value;
    const color = r.querySelector(".var-color").value.trim();
    const fabric = r.querySelector(".var-fabric").value.trim();
    const cost = parseFloat(r.querySelector(".var-cost").value) || 0;
    const mrp = parseFloat(r.querySelector(".var-mrp").value) || 0;
    const rate = parseFloat(r.querySelector(".var-rate").value) || 0;
    const gst = parseInt(r.querySelector(".var-gst").value) || 0;
    const stock = parseInt(r.querySelector(".var-stock").value) || 0;
    const reorder = parseInt(r.querySelector(".var-reorder").value) || 0;

    if (!sku || !barcode) {
      showToast("SKU and Barcode are required for all variants.", "error");
      validationError = true;
      return;
    }
    if (cost <= 0 || rate <= 0) {
      showToast("Cost and Selling Price must be positive numeric values.", "error");
      validationError = true;
      return;
    }

    parsedVariants.push({
      sku,
      barcode,
      size,
      color,
      fabric,
      costPrice: cost,
      mrp,
      sellingPrice: rate,
      gstRate: gst,
      stock,
      reorderLevel: reorder,
      isArchived: false
    });
  });

  if (validationError) return;

  // If editing, remove old variants list matching base product name first to avoid duplication
  if (editingBaseProduct) {
    state.products = state.products.filter(p => p.name !== editingBaseProduct);
  }

  // Insert newly built variants
  parsedVariants.forEach(v => {
    // Generate standard HSN
    const hsn = category === "Shirts" || category === "T-Shirts" ? "6205" : "6203";
    state.products.push({
      sku: v.sku,
      barcode: v.barcode,
      name: prodName,
      category,
      brand,
      size: v.size,
      color: v.color,
      fabric: v.fabric,
      hsnCode: hsn,
      costPrice: v.costPrice,
      mrp: v.mrp,
      sellingPrice: v.sellingPrice,
      gstRate: v.gstRate,
      stock: v.stock,
      reorderLevel: v.reorderLevel,
      isArchived: false
    });

    // Log stock movements for opening stock if this is a new SKU
    const isNewSku = !state.stockMovements.some(sm => sm.sku === v.sku);
    if (isNewSku && v.stock > 0) {
      state.stockMovements.push({
        id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        sku: v.sku,
        type: "Opening",
        qty: v.stock,
        referenceNo: "SYS-NEW",
        dateTime: new Date().toISOString(),
        notes: "Opening Stock Variant Initialization"
      });
    }
  });

  logAuditActivity("Save Product", `Saved product catalog title "${prodName}" with ${parsedVariants.length} variants.`);
  saveStateToStorage();

  // Reset Title and Views
  editingBaseProduct = null;
  document.getElementById("add-product-view-title").innerText = "Add New Apparel Item & Variant Matrices";
  document.getElementById("add-prod-name").value = "";
  document.getElementById("add-prod-brand").value = "Local Brand";
  tbody.innerHTML = "";

  switchModuleView("products");
  showToast("Apparel variants registered successfully!", "success");
}

function openStockAdjustmentModalFromDashboard() {
  // Try to locate first product variant to open stock adjust modal
  if (state.products.length > 0) {
    openStockAdjustModal(state.products[0].sku);
  } else {
    showToast("No products registered to adjust.", "error");
  }
}

// Quick Add product logic
function saveQuickAddProduct() {
  if (!checkPermission("MANAGER")) {
    showToast("Access Denied: Managers or Admins privilege only.", "error");
    return;
  }
  const name = document.getElementById("quick-prod-name").value.trim();
  const category = document.getElementById("quick-prod-category").value;
  const rate = parseFloat(document.getElementById("quick-prod-price").value) || 0;
  const stock = parseInt(document.getElementById("quick-prod-stock").value) || 0;
  let barcode = document.getElementById("quick-prod-barcode").value.trim();

  if (!name || rate <= 0 || stock < 0) {
    showToast("Please enter product name, selling price, and positive stock amount.", "error");
    return;
  }

  const randNum = String(Math.floor(100000 + Math.random() * 900000));
  if (!barcode) {
    barcode = "890" + randNum;
  }
  const sku = name.substring(0, 3).toUpperCase() + "-" + randNum.substring(2) + "-M";

  const newProduct = {
    sku,
    barcode,
    name,
    category,
    brand: "Local Brand",
    size: "M",
    color: "Mixed",
    fabric: "Cotton",
    hsnCode: "6205",
    costPrice: Math.round(rate * 0.6),
    mrp: Math.round(rate * 1.2),
    sellingPrice: rate,
    gstRate: 5,
    stock,
    reorderLevel: 3,
    isArchived: false
  };

  state.products.push(newProduct);

  if (stock > 0) {
    state.stockMovements.push({
      id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      sku,
      type: "Opening",
      qty: stock,
      referenceNo: "SYS-QUICK",
      dateTime: new Date().toISOString(),
      notes: "Quick Add Opening Stock Intake"
    });
  }

  logAuditActivity("Quick Add Product", `Quick added product SKU ${sku} (${name})`);
  saveStateToStorage();

  document.getElementById("quick-prod-name").value = "";
  document.getElementById("quick-prod-price").value = "";
  document.getElementById("quick-prod-barcode").value = "";

  closeModal("modal-quick-add");

  if (state.currentView === "products") renderAdminProductsList();
  else if (state.currentView === "pos") renderPosCatalog();

  showToast("Quick product added successfully!", "success");
}

// ==========================================================================
// CSV IMPORT & EXPORT SERVICE
// ==========================================================================

let csvImportData = [];

function handleCSVFileSelect(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    parseCSVProductsText(text);
  };
  reader.readAsText(file);
}

function parseCSVProductsText(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) {
    showToast("Invalid CSV file structure. Missing data rows.", "error");
    return;
  }

  // Headers parsing
  const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = lines.slice(1);

  csvImportData = [];
  const errors = [];

  rows.forEach((r, idx) => {
    // Simple comma splitter (ignores commas inside quotes)
    const values = r.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || r.split(",");
    const val = values.map(v => v.trim().replace(/^["']|["']$/g, ''));

    if (val.length < headers.length) return;

    // Map headers to fields
    const rowObj = {};
    headers.forEach((h, hIdx) => {
      rowObj[h] = val[hIdx];
    });

    const rowNum = idx + 2;
    const name = rowObj["Product Name"] || rowObj["name"] || "";
    const category = rowObj["Category"] || rowObj["category"] || "Other";
    const brand = rowObj["Brand"] || rowObj["brand"] || "Local Brand";
    const sku = rowObj["SKU"] || rowObj["sku"] || "";
    const barcode = rowObj["Barcode"] || rowObj["barcode"] || "";
    const size = rowObj["Size"] || rowObj["size"] || "M";
    const color = rowObj["Color"] || rowObj["color"] || "Mixed";
    const cost = parseFloat(rowObj["Cost Price"] || rowObj["costPrice"] || 0);
    const mrp = parseFloat(rowObj["MRP"] || rowObj["mrp"] || 0);
    const rate = parseFloat(rowObj["Selling Price"] || rowObj["sellingPrice"] || 0);
    const gst = parseInt(rowObj["GST"] || rowObj["gstRate"] || 5);
    const stock = parseInt(rowObj["Opening Stock"] || rowObj["stock"] || 0);
    const reorder = parseInt(rowObj["Reorder Level"] || rowObj["reorderLevel"] || 3);

    // Validations
    if (!name) errors.push(`Row ${rowNum}: Product Name is empty`);
    if (!sku) errors.push(`Row ${rowNum}: SKU code is empty`);
    if (!barcode) errors.push(`Row ${rowNum}: Barcode is empty`);
    if (rate <= 0) errors.push(`Row ${rowNum}: Selling rate must be positive numeric`);

    csvImportData.push({
      sku, barcode, name, category, brand, size, color,
      costPrice: cost, mrp, sellingPrice: rate, gstRate: gst, stock, reorderLevel: reorder
    });
  });

  // Render Preview
  const previewContainer = document.getElementById("csv-preview-container");
  const summaryEl = document.getElementById("csv-preview-summary");
  const headerEl = document.getElementById("csv-preview-header");
  const tbodyEl = document.getElementById("csv-preview-tbody");
  const errorsEl = document.getElementById("csv-errors-log");
  const importBtn = document.getElementById("csv-import-submit-btn");

  if (previewContainer && summaryEl && headerEl && tbodyEl && errorsEl && importBtn) {
    previewContainer.style.display = "block";
    summaryEl.innerText = `Detected ${csvImportData.length} apparel variants in CSV`;

    headerEl.innerHTML = `<th>Product Name</th><th>SKU</th><th>Barcode</th><th>Rate</th><th>Stock</th>`;
    tbodyEl.innerHTML = csvImportData.slice(0, 5).map(v => {
      return `
        <tr>
          <td><b>${v.name}</b></td>
          <td><code>${v.sku}</code></td>
          <td><code>${v.barcode}</code></td>
          <td>₹${v.sellingPrice}</td>
          <td>${v.stock}</td>
        </tr>
      `;
    }).join("") + (csvImportData.length > 5 ? `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">+ ${csvImportData.length - 5} more variants</td></tr>` : "");

    if (errors.length > 0) {
      errorsEl.style.display = "block";
      errorsEl.innerHTML = `<strong>Validation Errors:</strong><br>` + errors.slice(0, 5).join("<br>") + (errors.length > 5 ? `<br>...and ${errors.length - 5} more errors` : "");
      importBtn.disabled = true;
    } else {
      errorsEl.style.display = "none";
      importBtn.disabled = false;
    }
  }
}

function confirmCSVImportData() {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrator privilege only.", "error");
    return;
  }

  let overrideCount = 0;
  let importCount = 0;

  csvImportData.forEach(v => {
    // If SKU exists, override it. Else insert
    const idx = state.products.findIndex(prod => prod.sku === v.sku);
    const hsn = v.category === "Shirts" || v.category === "T-Shirts" ? "6205" : "6203";

    const prodObj = {
      sku: v.sku,
      barcode: v.barcode,
      name: v.name,
      category: v.category,
      brand: v.brand,
      size: v.size,
      color: v.color,
      fabric: "Cotton",
      hsnCode: hsn,
      costPrice: v.costPrice,
      mrp: v.mrp,
      sellingPrice: v.sellingPrice,
      gstRate: v.gstRate,
      stock: v.stock,
      reorderLevel: v.reorderLevel,
      isArchived: false
    };

    if (idx !== -1) {
      state.products[idx] = prodObj;
      overrideCount++;
    } else {
      state.products.push(prodObj);
      importCount++;
    }

    // Log stock movements
    if (v.stock > 0) {
      state.stockMovements.push({
        id: "MVT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        sku: v.sku,
        type: "Opening",
        qty: v.stock,
        referenceNo: "SYS-CSV",
        dateTime: new Date().toISOString(),
        notes: "CSV Batch import entry"
      });
    }
  });

  logAuditActivity("CSV Import", `Batch imported catalog data (${importCount} new, ${overrideCount} overridden SKUs).`);
  saveStateToStorage();

  // Clear and close
  csvImportData = [];
  document.getElementById("csv-file-input").value = "";
  document.getElementById("csv-preview-container").style.display = "none";
  closeModal("modal-import-csv");

  renderAdminProductsList();
  showToast(`Successfully imported ${importCount + overrideCount} apparel variants`, "success");
}

function exportProductsToCSV() {
  const csvHeaders = "Product Name,Category,Brand,SKU,Barcode,Size,Color,Cost Price,MRP,Selling Price,GST,Opening Stock,Reorder Level\n";
  const rows = state.products.filter(p => !p.isArchived).map(p => {
    return `"${p.name}","${p.category}","${p.brand || 'Local Brand'}","${p.sku}","${p.barcode}","${p.size}","${p.color}",${p.costPrice},${p.mrp},${p.sellingPrice},${p.gstRate},${p.stock},${p.reorderLevel}`;
  }).join("\n");

  const blob = new Blob([csvHeaders + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `tdc_catalog_backup_${new Date().toISOString().substring(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("CSV catalog exported successfully", "success");
}

// ==========================================================================
// BARCODE MANAGER RENDERING & TAG PRINTING
// ==========================================================================

let selectedBarcodeSkus = [];

function renderBarcodeMgmtList() {
  const tbody = document.getElementById("barcode-mgmt-tbody");
  if (!tbody) return;

  const query = document.getElementById("barcode-mgmt-search").value.trim().toLowerCase();

  const filtered = state.products.filter(p => {
    return !p.isArchived && (p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query) || p.barcode.includes(query));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">No active product variants found to generate tags.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const isChecked = selectedBarcodeSkus.includes(p.sku);
    return `
      <tr>
        <td><input type="checkbox" ${isChecked ? "checked" : ""} onchange="toggleBarcodeSelection('${p.sku}', this.checked)"></td>
        <td><strong>${p.name}</strong></td>
        <td>
          <div style="font-family:monospace; font-weight:700;">${p.barcode}</div>
          <img src="https://barcodeapi.org/api/128/${p.barcode}" alt="${p.barcode}" style="height:25px; max-width:130px; margin-top:2px; display:block;">
        </td>
        <td><code>${p.sku}</code></td>
        <td><span class="badge-tag badge-size">${p.size}</span> / <span class="badge-tag badge-color">${p.color}</span></td>
        <td style="text-align:right; font-weight:700;">₹${p.sellingPrice}</td>
        <td style="text-align:center;">
          <input type="number" id="label-qty-${p.sku}" class="form-control" style="width:60px; text-align:center; height:24px;" value="1" min="1">
        </td>
        <td style="text-align:center;">
          <button class="btn-qty" style="width:auto; padding:0 8px; height:24px;" onclick="printSingleBarcodeLabel('${p.sku}')">Print Tag</button>
        </td>
      </tr>
    `;
  }).join("");
}

function toggleBarcodeSelection(sku, isChecked) {
  if (isChecked) {
    if (!selectedBarcodeSkus.includes(sku)) selectedBarcodeSkus.push(sku);
  } else {
    selectedBarcodeSkus = selectedBarcodeSkus.filter(s => s !== sku);
  }
}

function toggleAllBarcodeCheckboxes(master) {
  const query = document.getElementById("barcode-mgmt-search").value.trim().toLowerCase();
  const filtered = state.products.filter(p => {
    return !p.isArchived && (p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query) || p.barcode.includes(query));
  });

  if (master.checked) {
    filtered.forEach(p => {
      if (!selectedBarcodeSkus.includes(p.sku)) selectedBarcodeSkus.push(p.sku);
    });
  } else {
    filtered.forEach(p => {
      selectedBarcodeSkus = selectedBarcodeSkus.filter(s => s !== p.sku);
    });
  }
  renderBarcodeMgmtList();
}

function printSingleBarcodeLabel(sku) {
  const p = state.products.find(prod => prod.sku === sku);
  if (!p) return;
  const labelQty = parseInt(document.getElementById(`label-qty-${sku}`).value) || 1;
  triggerLabelsPrintSheet([{ product: p, qty: labelQty }]);
}

function printSelectedBarcodes() {
  if (selectedBarcodeSkus.length === 0) {
    showToast("Please select at least one barcode label to print.", "warning");
    return;
  }

  const printList = [];
  selectedBarcodeSkus.forEach(sku => {
    const p = state.products.find(prod => prod.sku === sku);
    const qtyInput = document.getElementById(`label-qty-${sku}`);
    const labelQty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
    if (p) printList.push({ product: p, qty: labelQty });
  });

  triggerLabelsPrintSheet(printList);
}

function printAllBarcodes() {
  const printList = state.products
    .filter(p => !p.isArchived)
    .map(p => {
      const qtyInput = document.getElementById(`label-qty-${p.sku}`);
      const labelQty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
      return { product: p, qty: labelQty };
    });

  if (printList.length === 0) {
    showToast("No active product variants found in catalog to print.", "warning");
    return;
  }

  triggerLabelsPrintSheet(printList);
}

function triggerLabelsPrintSheet(labelItems) {
  const storeName = state.settings.storeName || "TAMIL DRESS COLLECTION";

  // Construct printable HTML sheet structure
  let labelsHtml = "";
  labelItems.forEach(item => {
    const p = item.product;
    // Calculate a crossed out retail MRP (sellingPrice + 35% markup fallback if not set)
    const mrpVal = p.mrp && p.mrp > p.sellingPrice ? p.mrp : Math.round(p.sellingPrice * 1.35);

    for (let i = 0; i < item.qty; i++) {
      labelsHtml += `
        <div class="barcode-tag-card">
          <div class="tag-header">${storeName}</div>
          <div class="tag-title">${p.name}</div>
          <div class="tag-meta">SKU: ${p.sku} | Size: ${p.size}</div>
          
          <div class="barcode-wrapper">
            <img class="barcode-img" src="https://barcodeapi.org/api/128/${p.barcode}" alt="${p.barcode}">
            <div class="barcode-digits">${p.barcode}</div>
          </div>
          
          <div class="price-section">
            <span class="mrp-cross">MRP: ₹${mrpVal}</span>
            <span class="sell-price">RATE: <b>₹${p.sellingPrice}</b></span>
          </div>
          <div class="tag-footer">Made in India | Salem Branch</div>
        </div>
      `;
    }
  });

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Barcode Label Sheets Print</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
          
          body { 
            margin: 0; 
            padding: 10px; 
            background: #ffffff; 
            color: #000000; 
            font-family: 'Outfit', sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Labels layout grid */
          .labels-container { 
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(50mm, 1fr));
            gap: 12px;
            justify-content: center;
          }
          
          /* Professional 50mm x 38mm Barcode Sticker */
          .barcode-tag-card {
            width: 50mm;
            height: 38mm;
            border: 1px solid #000000;
            border-radius: 4px;
            padding: 6px 4px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            background: #ffffff;
            page-break-inside: avoid;
            text-align: center;
            overflow: hidden;
          }
          
          .tag-header { 
            font-size: 8px; 
            font-weight: 800; 
            letter-spacing: 0.8px; 
            text-transform: uppercase; 
            color: #000;
            border-bottom: 0.5px solid #000;
            width: 90%;
            padding-bottom: 2px;
            margin-bottom: 2px;
          }
          
          .tag-title { 
            font-size: 9px; 
            font-weight: 600; 
            text-transform: uppercase; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
            width: 100%;
            margin-bottom: 1px;
          }
          
          .tag-meta { 
            font-size: 7px; 
            font-weight: 600;
            color: #444; 
            margin-bottom: 2px;
            text-transform: uppercase;
          }
          
          .barcode-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            margin: 2px 0;
          }
          
          .barcode-img { 
            height: 24px; 
            width: auto; 
            max-width: 90%; 
            display: block; 
            image-rendering: pixelated; 
            image-rendering: crisp-edges;
          }
          
          .barcode-digits { 
            font-size: 8px; 
            font-family: monospace; 
            letter-spacing: 2px; 
            font-weight: 700;
            margin-top: 1px;
          }
          
          .price-section { 
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 90%;
            font-size: 8px; 
            border-top: 0.5px dashed #000;
            padding-top: 3px;
            margin-top: 2px;
          }
          
          .mrp-cross {
            text-decoration: line-through;
            font-weight: 400;
            color: #555;
            font-size: 7px;
          }
          
          .sell-price {
            font-size: 8px;
            font-weight: 700;
          }
          
          .sell-price b {
            font-size: 10px;
          }

          .tag-footer {
            font-size: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #666;
            margin-top: 1px;
          }
          
          @media print {
            body { 
              padding: 0; 
              margin: 0;
            }
            .labels-container {
              gap: 8px;
            }
            .barcode-tag-card { 
              border: 1px solid #000000; /* High contrast black for printer alignment */
            }
          }
        </style>
      </head>
      <body>
        <div class="labels-container">
          ${labelsHtml}
        </div>
        <script>
          window.onload = function() { 
            window.print(); 
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();

  logAuditActivity("Print Barcodes", `Printed barcode tags sheet containing ${labelItems.reduce((s, i) => s + i.qty, 0)} labels.`);
}

// ==========================================================================
// CATEGORIES, BRANDS, SIZES MANAGEMENT
// ==========================================================================

function renderCategoriesAndBrandsMgmt() {
  const catTbody = document.getElementById("categories-mgmt-tbody");
  const brandTbody = document.getElementById("brands-mgmt-tbody");

  if (catTbody) {
    const categories = Array.from(new Set(state.products.map(p => p.category)));
    catTbody.innerHTML = categories.map(c => {
      const pCount = state.products.filter(p => p.category === c && !p.isArchived).length;
      return `
        <tr>
          <td><strong>${c}</strong></td>
          <td style="text-align:center;"><span class="badge-tag badge-fabric" style="font-weight:700;">${pCount} variants</span></td>
          <td style="text-align:center;">
            <button class="btn-qty" style="color:var(--danger); border:none; background:none;" ${pCount > 0 ? 'disabled title="Cannot delete category containing products"' : ''} onclick="archiveCategorySetting('${c}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    }).join("");
  }

  if (brandTbody) {
    const brands = Array.from(new Set(state.products.map(p => p.brand || "Local Brand")));
    brandTbody.innerHTML = brands.map(b => {
      const pCount = state.products.filter(p => (p.brand || "Local Brand") === b && !p.isArchived).length;
      return `
        <tr>
          <td><strong>${b}</strong></td>
          <td style="text-align:center;"><span class="badge-tag badge-size" style="font-weight:700;">${pCount} variants</span></td>
          <td style="text-align:center;">
            <button class="btn-qty" style="color:var(--danger); border:none; background:none;" ${pCount > 0 ? 'disabled title="Cannot delete brand containing products"' : ''} onclick="archiveBrandSetting('${b}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    }).join("");
  }
}

function saveNewCategorySetting() {
  const name = document.getElementById("new-cat-name").value.trim();
  if (!name) return;

  // categories are derived from products catalog, so to save a new category we can seed a dummy placeholder with 0 stock
  const placeholderSku = `CAT-NEW-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  const dummyProduct = {
    sku: placeholderSku,
    barcode: "890" + Math.floor(10000 + Math.random() * 90000),
    name: `New Category Entry ${name}`,
    category: name,
    brand: "Local Brand",
    size: "M",
    color: "Other",
    fabric: "Cotton",
    hsnCode: "6205",
    costPrice: 100,
    mrp: 200,
    sellingPrice: 150,
    gstRate: 5,
    stock: 0,
    reorderLevel: 1,
    isArchived: true // archived by default so it doesn't show in sales, only catalog setup
  };

  state.products.push(dummyProduct);
  logAuditActivity("Create Category", `Registered new apparel category: ${name}`);
  saveStateToStorage();

  document.getElementById("new-cat-name").value = "";
  renderCategoriesAndBrandsMgmt();
  showToast(`Category "${name}" registered successfully`, "success");
}

function archiveCategorySetting(categoryName) {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrators privileges required.", "error");
    return;
  }
  // Remove placeholder dummies
  state.products = state.products.filter(p => !(p.category === categoryName && p.isArchived && p.stock === 0));
  logAuditActivity("Remove Category", `Archived Category: ${categoryName}`);
  saveStateToStorage();
  renderCategoriesAndBrandsMgmt();
  showToast("Category removed from configuration", "success");
}

function saveNewBrandSetting() {
  const name = document.getElementById("new-brand-name").value.trim();
  if (!name) return;

  const placeholderSku = `BRD-NEW-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  const dummyProduct = {
    sku: placeholderSku,
    barcode: "890" + Math.floor(10000 + Math.random() * 90000),
    name: `New Brand Entry ${name}`,
    category: "Other",
    brand: name,
    size: "M",
    color: "Other",
    fabric: "Cotton",
    hsnCode: "6205",
    costPrice: 100,
    mrp: 200,
    sellingPrice: 150,
    gstRate: 5,
    stock: 0,
    reorderLevel: 1,
    isArchived: true
  };

  state.products.push(dummyProduct);
  logAuditActivity("Create Brand", `Registered brand: ${name}`);
  saveStateToStorage();

  document.getElementById("new-brand-name").value = "";
  renderCategoriesAndBrandsMgmt();
  showToast(`Brand "${name}" registered`, "success");
}

function archiveBrandSetting(brandName) {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrators only.", "error");
    return;
  }
  state.products = state.products.filter(p => !(p.brand === brandName && p.isArchived && p.stock === 0));
  logAuditActivity("Remove Brand", `Archived Brand: ${brandName}`);
  saveStateToStorage();
  renderCategoriesAndBrandsMgmt();
  showToast("Brand removed", "success");
}

// ==========================================================================
// SECURITY USERS & ROLES CONFIGURATION
// ==========================================================================

function renderUsersMgmt() {
  const tbody = document.getElementById("users-mgmt-tbody");
  if (!tbody) return;

  tbody.innerHTML = state.users.map(u => {
    return `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td><code>${u.username}</code></td>
        <td><span class="badge-tag badge-size">${u.role}</span></td>
        <td style="text-align:center;"><code>••••</code></td>
        <td style="text-align:center;">
          <button class="btn-qty" style="color:var(--danger); border:none; background:none;" ${u.username === 'admin' ? 'disabled title="Cannot delete primary admin profile"' : ''} onclick="deleteUserProfile('${u.username}')"><i class="fa-solid fa-user-minus"></i></button>
        </td>
      </tr>
    `;
  }).join("");
}

function openAddUserModal() {
  document.getElementById("user-display-name").value = "";
  document.getElementById("user-username").value = "";
  document.getElementById("user-pin").value = "";
  openModal("modal-add-user");
}

function saveNewUserProfile() {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrators privileges only.", "error");
    return;
  }
  const name = document.getElementById("user-display-name").value.trim();
  const username = document.getElementById("user-username").value.trim().toLowerCase();
  const role = document.getElementById("user-role").value;
  const pin = document.getElementById("user-pin").value.trim();

  if (!name || !username || !pin || pin.length !== 4) {
    showToast("Please enter username, role, and a 4-digit numeric pin passcode.", "error");
    return;
  }

  // Check for duplicate username
  if (state.users.some(u => u.username === username)) {
    showToast("Username already registered.", "error");
    return;
  }

  state.users.push({ name, username, role, pin });
  logAuditActivity("Create User", `Added user credentials profile: ${name} (${role})`);
  saveStateToStorage();

  closeModal("modal-add-user");
  renderUsersMgmt();
  showToast(`User ${name} registered successfully`, "success");
}

function deleteUserProfile(username) {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrator privilege required.", "error");
    return;
  }

  if (username === "admin") {
    showToast("Cannot delete primary admin root user account.", "error");
    return;
  }

  if (confirm(`Are you sure you want to delete user login profile: ${username}?`)) {
    state.users = state.users.filter(u => u.username !== username);
    logAuditActivity("Delete User", `Deleted user configuration: ${username}`);
    saveStateToStorage();
    renderUsersMgmt();
    showToast("User deleted from settings", "success");
  }
}

// ==========================================================================
// SYSTEM AUDIT TRAIL VISUALIZATION
// ==========================================================================

function renderAuditLogsList() {
  const tbody = document.getElementById("audit-logs-tbody");
  if (!tbody) return;

  const query = document.getElementById("audit-log-search").value.trim().toLowerCase();

  const filtered = state.auditLogs.filter(l => {
    return l.user.toLowerCase().includes(query) || l.action.toLowerCase().includes(query) || l.details.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">No activity matching query exists.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(l => {
    const time = new Date(l.timestamp).toLocaleString();
    return `
      <tr>
        <td><span style="font-family:monospace; font-size:11px;">${time}</span></td>
        <td><strong>${l.user}</strong></td>
        <td><span class="badge-tag badge-fabric" style="font-size:10px; font-weight:800;">${l.action}</span></td>
        <td style="font-size:11px;">${l.details}</td>
      </tr>
    `;
  }).join("");
}

function clearAuditLogs() {
  if (!checkPermission("ADMIN")) {
    showToast("Access Denied: Administrators privilege only.", "error");
    return;
  }
  if (confirm("Are you sure you want to permanently purge all system audit trail logs? This action is untraceable.")) {
    state.auditLogs = [];
    saveStateToStorage();
    renderAuditLogsList();
    showToast("System audit trail purged successfully", "success");
  }
}

// ==========================================================================
// DATABASE JSON BACKUP & RESTORE UTILITIES
// ==========================================================================

function backupDatabaseState() {
  const backupObject = {
    products: state.products,
    customers: state.customers,
    suppliers: state.suppliers,
    expenses: state.expenses,
    sales: state.sales,
    returns: state.returns,
    purchases: state.purchases,
    stockMovements: state.stockMovements,
    settings: state.settings,
    users: state.users,
    auditLogs: state.auditLogs
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObject));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `tdc_db_backup_${new Date().toISOString().substring(0, 10)}.json`);
  link.click();

  logAuditActivity("System Backup", "Database state backup JSON file generated.");
  showToast("Database backup downloaded successfully", "success");
}

function triggerRestoreBackupSelector() {
  const fileSelector = document.createElement("input");
  fileSelector.setAttribute("type", "file");
  fileSelector.setAttribute("accept", ".json");
  fileSelector.style.display = "none";

  fileSelector.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!parsed.products || !parsed.sales || !parsed.settings) {
          showToast("Invalid JSON Backup structure.", "error");
          return;
        }

        if (confirm("WARNING: Confirming this action will completely overwrite all local configurations, products inventory, billing reports, and supplier ledgers. Proceed?")) {
          // Restore
          localStorage.setItem("tdc_products", JSON.stringify(parsed.products));
          localStorage.setItem("tdc_customers", JSON.stringify(parsed.customers));
          localStorage.setItem("tdc_suppliers", JSON.stringify(parsed.suppliers));
          localStorage.setItem("tdc_expenses", JSON.stringify(parsed.expenses));
          localStorage.setItem("tdc_sales", JSON.stringify(parsed.sales));
          localStorage.setItem("tdc_settings", JSON.stringify(parsed.settings));
          localStorage.setItem("tdc_returns", JSON.stringify(parsed.returns || []));
          localStorage.setItem("tdc_purchases", JSON.stringify(parsed.purchases || []));
          localStorage.setItem("tdc_stock_movements", JSON.stringify(parsed.stockMovements || []));
          localStorage.setItem("tdc_users", JSON.stringify(parsed.users || SEED_USERS));

          const restoreLogs = parsed.auditLogs || [];
          restoreLogs.unshift({
            id: "LOG-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
            timestamp: new Date().toISOString(),
            user: state.currentUser ? state.currentUser.name : "System",
            action: "System Restore",
            details: "Database recovered from uploaded json configuration backup file."
          });
          localStorage.setItem("tdc_audit_logs", JSON.stringify(restoreLogs));

          showToast("Data restore successful! Reloading POS system...", "success");
          setTimeout(() => { window.location.reload(); }, 1500);
        }
      } catch (err) {
        showToast("Error parsing database backup JSON file.", "error");
      }
    };
    reader.readAsText(file);
  });

  document.body.appendChild(fileSelector);
  fileSelector.click();
  document.body.removeChild(fileSelector);
}

// ==========================================================================
// SECURE LOGIN SYSTEM PIN PAD HANDLERS
// ==========================================================================

function populateLoginUserSelect() { }

function pressLoginPin(digit) {
  const pinInput = document.getElementById("login-pin-input");
  if (!pinInput) return;

  if (pinInput.value.length < 4) {
    pinInput.value += digit;
  }

  // Auto-submit on reaching 4 digits is extremely satisfying!
  if (pinInput.value.length === 4) {
    setTimeout(submitLoginPin, 150);
  }
}

function clearLoginPin() {
  const pinInput = document.getElementById("login-pin-input");
  if (pinInput) pinInput.value = "";
}

function submitLoginPin() {
  const pin = document.getElementById("login-pin-input").value;

  if (pin.length !== 4) {
    showToast("Please enter a 4-digit passcode PIN.", "warning");
    return;
  }

  // Find Admin profile matching this passcode PIN
  const adminUser = state.users.find(u => u.role === "ADMIN" && u.pin === pin);

  if (!adminUser) {
    alert("Incorrect PIN code. Access Denied.");
    showToast("Incorrect passcode PIN. Access Denied.", "error");
    clearLoginPin();
    return;
  }

  // Authorize Operator
  state.currentUser = adminUser;
  state.viewMode = "admin";
  saveStateToStorage();

  // Redirect straight to POS billing view
  switchModuleView("pos");
  renderSidebar();

  // Deactivate login screen overlay view
  const loginOverlay = document.getElementById("pos-login-screen");
  if (loginOverlay) {
    loginOverlay.classList.remove("active");
  }

  logAuditActivity("Secure Login", `Administrator unlocked POS workstation.`);
  showToast(`Welcome back, Administrator!`, "success");
}

function lockWorkstation() {
  // Clear active operator session
  state.currentUser = null;
  saveStateToStorage();

  // Activating full login screen overlay
  const loginOverlay = document.getElementById("pos-login-screen");
  if (loginOverlay) {
    loginOverlay.classList.add("active");
  }

  clearLoginPin();

  // Auto-focus passcode entry input field
  const loginInput = document.getElementById("login-pin-input");
  if (loginInput) {
    setTimeout(() => { loginInput.focus(); }, 300);
  }

  logAuditActivity("Workstation Locked", "Terminal locked by user.");
  showToast("POS Workstation Terminal locked.", "info");
}

// ==========================================================================
// REAL-TIME CLOUD-RELAYED MOBILE SCANNER SYNC SERVICE
// ==========================================================================

let pcPeerId = "";
let sseEventSource = null;
let html5QrReader = null;

function initRemoteScannerSync() {
  const urlParams = new URLSearchParams(window.location.search);
  const isScanMode = urlParams.get("scanMode") === "true";
  const targetPeerId = urlParams.get("peerId");

  if (isScanMode && targetPeerId) {
    // -------------------------------------------------------------
    // MOBILE CAMERA SCANNER VIEW STATE
    // -------------------------------------------------------------
    const loginOverlay = document.getElementById("pos-login-screen");
    if (loginOverlay) loginOverlay.classList.remove("active");

    document.getElementById("mobile-scanner-view").style.display = "flex";

    const statusEl = document.getElementById("mobile-peer-status");
    if (statusEl) {
      statusEl.innerText = "CONNECTED TO CLOUD ✔";
      statusEl.style.background = "#065f46";
      statusEl.style.borderColor = "#059669";
      statusEl.style.color = "#ecfdf5";
    }

    // Start camera viewport scanning immediately
    startMobileCameraScanning();
  } else {
    // -------------------------------------------------------------
    // PC TERMINAL WORKSTATION VIEW STATE
    // -------------------------------------------------------------
    pcPeerId = "tdc-pc-" + Math.floor(1000 + Math.random() * 9000);
    console.log("Workstation Cloud Sync ID initialized:", pcPeerId);

    // Initialize Server-Sent Events (SSE) relay connection via free public ntfy.sh server
    try {
      const sseUrl = "https://ntfy.sh/tamildresspos_" + pcPeerId + "/sse";
      sseEventSource = new EventSource(sseUrl);

      sseEventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          // ntfy.sh sends a keepalive comment or message events
          if (data.event === "message" && data.message) {
            console.log("Cloud scan received:", data.message);
            handleRemoteScannedBarcode(data.message);
          }
        } catch (err) {
          console.error("SSE parse error:", err);
        }
      };

      sseEventSource.onerror = (err) => {
        console.warn("SSE connection interrupted. Reconnecting automatically...", err);
      };
    } catch (err) {
      console.error("Cloud Sync connection failed to start:", err);
    }
  }
}

const SCAN_DEBOUNCE_MS = 1800;
const scanLockState = {
  lastValue: "",
  lastTimestamp: 0
};

function resetScanLock() {
  scanLockState.lastValue = "";
  scanLockState.lastTimestamp = 0;
}

function acceptScanValue(value) {
  const normalized = normalizeScanValue(value);
  if (!normalized) return false;

  const now = Date.now();
  if (normalized === scanLockState.lastValue && (now - scanLockState.lastTimestamp) < SCAN_DEBOUNCE_MS) {
    return false;
  }

  scanLockState.lastValue = normalized;
  scanLockState.lastTimestamp = now;
  return true;
}

function normalizeScanValue(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toUpperCase();
}

function processScannedBarcode(rawValue, source = "scanner") {
  const normalizedText = normalizeScanValue(rawValue);
  if (!normalizedText) return false;

  if (!acceptScanValue(normalizedText)) {
    return false;
  }

  const product = findProductByScanValue(normalizedText);
  if (product) {
    addCartItemBySku(product.sku);
    renderPosCatalog();
    return true;
  }

  showToast(`Unknown Barcode: "${normalizedText}"`, "warning");
  return false;
}

function findProductByScanValue(value) {
  const input = normalizeScanValue(value);
  if (!input) return null;

  const directMatch = state.products.find(product => {
    const productBarcode = normalizeScanValue(product.barcode);
    const productSku = normalizeScanValue(product.sku);
    return productBarcode === input || productSku === input;
  });

  if (directMatch) return directMatch;

  const numericInput = input.replace(/[^0-9]/g, "");
  if (numericInput) {
    const numericMatch = state.products.find(product => {
      const barcodeDigits = normalizeScanValue(product.barcode).replace(/[^0-9]/g, "");
      const skuDigits = normalizeScanValue(product.sku).replace(/[^0-9]/g, "");
      return barcodeDigits === numericInput || skuDigits === numericInput || barcodeDigits.endsWith(numericInput) || skuDigits.endsWith(numericInput);
    });

    if (numericMatch) return numericMatch;
  }

  const containsMatch = state.products.find(product => {
    const productBarcode = normalizeScanValue(product.barcode);
    const productSku = normalizeScanValue(product.sku);
    return productBarcode.includes(input) || productSku.includes(input) || input.includes(productBarcode) || input.includes(productSku);
  });

  return containsMatch || null;
}

function handleRemoteScannedBarcode(barcode) {
  try {
    playNotificationBeep();
    const item = findProductByScanValue(barcode);

    if (item) {
      const shouldAdd = processScannedBarcode(item.barcode, "cloud");
      if (!shouldAdd) {
        return;
      }
    } else {
      showToast(`Cloud Scanned Unknown Barcode: "${String(barcode || "").trim()}"`, "warning");
    }
  } catch (error) {
    console.error("Remote scanned barcode handler error:", error);
    showToast("Barcode scan could not be processed. Please retry.", "error");
  }
}

function playNotificationBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 920; // 920Hz audio tone
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    console.error("Audio Context beep failed", e);
  }
}

let isPairedScanningActive = true;

function startMobileCameraScanning() {
  html5QrReader = new Html5Qrcode("camera-reader");

  const lastScannedEl = document.getElementById("last-scanned-item");
  const targetPeerId = new URLSearchParams(window.location.search).get("peerId");

  isPairedScanningActive = true;

  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    try {
      if (!isPairedScanningActive) return;

      const normalizedText = normalizeScanValue(decodedText);
      if (!normalizedText) return;

      if (!acceptScanValue(normalizedText)) {
        return;
      }

      // Deactivate scanning immediately to prevent duplicate scans while fetch is flying
      isPairedScanningActive = false;

      try {
        html5QrReader.pause(true);
      } catch (e) { }

      // Send barcode immediately to ntfy.sh pubsub topic
      const topicUrl = "https://ntfy.sh/tamildresspos_" + targetPeerId;

      fetch(topicUrl, {
        method: "POST",
        body: normalizedText
      })
        .then(() => {
          // Play confirmations audio on mobile phone
          playNotificationBeep();

          if (lastScannedEl) {
            lastScannedEl.style.display = "block";

            // Display matched catalog product name locally for confirmation
            const product = findProductByScanValue(normalizedText);
            if (product) {
              lastScannedEl.innerHTML = `<span style="color:#10b981; font-weight:bold;">✔ SENT:</span> <b>${product.name}</b><br>Size: ${product.size} | Rate: ₹${product.sellingPrice}`;
            } else {
              lastScannedEl.innerHTML = `<span style="color:#f59e0b; font-weight:bold;">✔ SENT CODE:</span> <code>${normalizedText}</code>`;
            }
          }

          // Show scan next button and change status prompt
          const scanNextBtn = document.getElementById("paired-scan-next-btn");
          if (scanNextBtn) scanNextBtn.style.display = "inline-block";

          const statusEl = document.getElementById("mobile-peer-status");
          if (statusEl) {
            statusEl.innerText = "SCAN SENT ✔ TAP SCAN NEXT";
            statusEl.style.background = "#4f46e5";
          }
        })
        .catch(err => {
          console.error("Failed to transmit scan:", err);
          alert("Transmitting Scan Error: Please check your mobile data connection.");

          // Still show the Scan Next button so they can re-trigger scanning
          const scanNextBtn = document.getElementById("paired-scan-next-btn");
          if (scanNextBtn) scanNextBtn.style.display = "inline-block";
        });
    } catch (error) {
      console.error("Mobile scan callback error:", error);
      isPairedScanningActive = true;
      try {
        html5QrReader.resume();
      } catch (e) { }
    }
  };

  const config = { fps: 15, qrbox: { width: 260, height: 190 } };

  html5QrReader.start(
    { facingMode: "environment" },
    config,
    qrCodeSuccessCallback
  ).catch(err => {
    console.error("Camera capture stream failed:", err);
    const statusEl = document.getElementById("mobile-peer-status");
    if (statusEl) {
      statusEl.innerText = "Camera Access Blocked ✖";
      statusEl.style.background = "#991b1b";
    }
    if (lastScannedEl) {
      lastScannedEl.style.display = "block";
      lastScannedEl.innerHTML = `
        <span style="color:#ef4444; font-weight:bold;">CAMERA ERROR:</span><br>
        <span style="font-size:11px; color:#f87171;">${err}</span>
        <br><br>
        <div style="font-size:10px; text-align:left; color:#ccc; line-height:1.3; border-top:1px dashed #4b5563; padding-top:8px;">
          <strong>Security Note:</strong> Mobile browsers block camera API access (getUserMedia) on insecure <code>http://</code> IP addresses.<br><br>
          Please <strong>deploy your app to Vercel (HTTPS)</strong> to resolve this browser block and enable direct mobile camera scanning!
        </div>
      `;
    }
  });
}

function openPairScannerModal() {
  if (!pcPeerId) {
    showToast("Cloud sync channel is initializing. Please try again in a few seconds.", "warning");
    return;
  }

  const pairingUrl = window.location.origin + window.location.pathname + "?scanMode=true&peerId=" + pcPeerId;

  // Render pairing warning on localhost
  const warningEl = document.getElementById("pairing-localhost-warning");
  if (warningEl) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      warningEl.style.display = "block";
      warningEl.innerHTML = `
        <strong>⚠️ Localhost Testing Notice:</strong><br>
        Your phone cannot connect to a "localhost" address directly. To pair locally:
        <ol style="margin: 4px 0 0 15px; padding: 0; line-height: 1.3;">
          <li>Connect both phone and laptop to the <strong>same Wi-Fi network / hotspot</strong>.</li>
          <li>Find your laptop's Wi-Fi IP address (run <code>ipconfig</code> in Command Prompt, e.g., <code>192.168.1.15</code>).</li>
          <li>Open this app on your laptop using that IP: <strong>http://[IP-Address]:8000/</strong>.</li>
          <li>Scan the QR code generated from that URL!</li>
        </ol>
        <br>
        <em>Or simply deploy the app to <strong>Vercel</strong> for instant, seamless pairing from anywhere!</em>
      `;
    } else {
      warningEl.style.display = "none";
    }
  }

  const qrContainer = document.getElementById("pair-qr-container");
  if (qrContainer) {
    // Generate QR using the robust free QR code API image instead of client-side canvas render
    qrContainer.innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(pairingUrl)}" 
           alt="Pairing QR Code" 
           style="width: 170px; height: 170px; display: block; border: none; margin: 0 auto;"
           onerror="handleQrGenerationError()">
    `;
  }

  const statusEl = document.getElementById("pair-status-info");
  if (statusEl) {
    statusEl.innerHTML = `<span style="color:var(--success); font-weight:700;"><i class="fa-solid fa-circle-check"></i> Cloud Sync Active & Ready to Scan!</span>`;
  }

  openModal("modal-pair-scanner");
}

function handleQrGenerationError() {
  const qrContainer = document.getElementById("pair-qr-container");
  if (qrContainer) {
    const pairingUrl = window.location.origin + window.location.pathname + "?scanMode=true&peerId=" + pcPeerId;
    qrContainer.innerHTML = `
      <div style="font-size: 11px; color: var(--danger); padding: 15px; background: var(--danger-bg); border-radius: 6px;">
        Failed to load QR code image. Tap link below to copy pairing URL:
        <br><br>
        <a href="${pairingUrl}" target="_blank" style="word-break: break-all; color: var(--primary); font-weight: bold;">${pairingUrl}</a>
      </div>
    `;
  }
}

function exitMobileScanner() {
  if (directQrReader) {
    try {
      directQrReader.stop().then(() => {
        const overlay = document.getElementById("mobile-scanner-view");
        if (overlay) overlay.style.display = "none";
        switchMobilePosTab("cart");
      }).catch(() => {
        const overlay = document.getElementById("mobile-scanner-view");
        if (overlay) overlay.style.display = "none";
        switchMobilePosTab("cart");
      });
      return;
    } catch (e) { }
  }

  if (html5QrReader) {
    try {
      html5QrReader.stop().then(() => {
        window.location.href = window.location.origin + window.location.pathname;
      }).catch(() => {
        window.location.href = window.location.origin + window.location.pathname;
      });
      return;
    } catch (e) { }
  }
  window.location.href = window.location.origin + window.location.pathname;
}

// ==========================================================================
// MOBILE RESPONSIVE LAYOUT & INTERACTIVE CONTROLLERS
// ==========================================================================

let directQrReader = null;

function toggleMobileSidebar(open) {
  const sidebar = document.querySelector(".app-sidebar");
  const overlay = document.getElementById("sidebar-mobile-overlay");

  if (sidebar && overlay) {
    if (open) {
      sidebar.classList.add("mobile-open");
      overlay.style.display = "block";
    } else {
      sidebar.classList.remove("mobile-open");
      overlay.style.display = "none";
    }
  }
}

function switchMobilePosTab(tabName) {
  const container = document.querySelector(".pos-workspace-container");
  const catalogBtn = document.getElementById("tab-btn-catalog");
  const cartBtn = document.getElementById("tab-btn-cart");

  if (!container || !catalogBtn || !cartBtn) return;

  if (tabName === "catalog") {
    container.classList.remove("show-cart");
    container.classList.add("show-catalog");
    catalogBtn.classList.add("active");
    cartBtn.classList.remove("active");
  } else {
    container.classList.remove("show-catalog");
    container.classList.add("show-cart");
    cartBtn.classList.add("active");
    catalogBtn.classList.remove("active");
  }
}

function toggleDirectCameraScan(open = true) {
  const inlineContainer = document.getElementById("pos-direct-cam-container");
  const mobileOverlay = document.getElementById("mobile-scanner-view");
  const mobileStatus = document.getElementById("mobile-peer-status");
  const scanResult = document.getElementById("last-scanned-item");

  if (window.innerWidth <= 768) {
    if (open) {
      if (mobileOverlay) mobileOverlay.style.display = "flex";
      if (mobileStatus) {
        mobileStatus.innerText = "Scanning barcode...";
        mobileStatus.style.background = "rgba(79, 70, 229, 0.12)";
        mobileStatus.style.borderColor = "rgba(165, 180, 252, 0.6)";
        mobileStatus.style.color = "#dfe7ff";
      }
      if (scanResult) {
        scanResult.style.display = "none";
        scanResult.innerHTML = "";
      }

      if (directQrReader) {
        try { directQrReader.stop().catch(() => { }); } catch (e) { }
      }

      directQrReader = new Html5Qrcode("camera-reader");

      let isScanningActive = true;
      const scanCooldownMs = 1800;

      const qrSuccess = (decodedText) => {
        try {
          const normalizedText = normalizeScanValue(decodedText);
          const now = Date.now();

          if (!isScanningActive || !normalizedText) return;
          if (!acceptScanValue(normalizedText)) return;

          isScanningActive = false;

          try { directQrReader.pause(true); } catch (e) { }

          const item = findProductByScanValue(normalizedText);
          playNotificationBeep();

          if (item) {
            addCartItemBySku(item.sku);
            renderPosCatalog();
          } else {
            showToast(`Unknown Barcode: "${normalizedText}"`, "warning");
          }

          const searchInput = document.getElementById("pos-barcode-input");
          if (searchInput) {
            searchInput.value = normalizedText;
            setTimeout(() => { searchInput.value = ""; }, 1200);
          }

          if (scanResult) {
            scanResult.style.display = "block";
            scanResult.innerHTML = item
              ? `<span style="color:#34d399; font-weight:800;">✓ ADDED TO CART</span><br><span style="color:#f8fafc;">${item.name}</span><br><span style="color:#cbd5e1; font-size:11px;">Ready for next scan</span>`
              : `<span style="color:#fbbf24; font-weight:800;">⚠ UNKNOWN BARCODE</span><br><span style="color:#f8fafc;">${normalizedText}</span><br><span style="color:#cbd5e1; font-size:11px;">Ready for next scan</span>`;
          }

          switchMobilePosTab("cart");

          if (directQrReader) {
            try {
              directQrReader.stop().then(() => {
                if (mobileOverlay) mobileOverlay.style.display = "none";
                directQrReader = null;
                isScanningActive = true;
              }).catch(() => {
                if (mobileOverlay) mobileOverlay.style.display = "none";
                directQrReader = null;
                isScanningActive = true;
              });
            } catch (e) {
              if (mobileOverlay) mobileOverlay.style.display = "none";
              directQrReader = null;
              isScanningActive = true;
            }
          } else {
            if (mobileOverlay) mobileOverlay.style.display = "none";
            isScanningActive = true;
          }
        } catch (error) {
          console.error("Direct camera scan handler error:", error);
          isScanningActive = true;
        }
      };

      const config = { fps: 10, qrbox: { width: 260, height: 190 } };

      directQrReader.start(
        { facingMode: "environment" },
        config,
        qrSuccess
      ).catch(err => {
        console.error("Direct scanner failed:", err);
        showToast("Camera Permission Blocked: Please enable camera access.", "error");
        if (mobileStatus) {
          mobileStatus.innerText = "Camera access blocked";
          mobileStatus.style.background = "rgba(127, 29, 29, 0.9)";
          mobileStatus.style.borderColor = "rgba(248, 113, 113, 0.7)";
          mobileStatus.style.color = "#fee2e2";
        }
      });

      return;
    }

    if (mobileOverlay) mobileOverlay.style.display = "none";
    if (directQrReader) {
      try { directQrReader.stop().catch(() => { }); } catch (e) { }
      directQrReader = null;
    }
    resetScanLock();
    return;
  }

  if (!inlineContainer) return;

  if (open) {
    inlineContainer.style.display = "block";

    if (directQrReader) {
      try { directQrReader.stop().catch(() => { }); } catch (e) { }
    }

    directQrReader = new Html5Qrcode("pos-direct-camera-reader");

    let isScanningActive = true;
    const scanCooldownMs = 1800;

    const qrSuccess = (decodedText) => {
      try {
        const normalizedText = normalizeScanValue(decodedText);
        const now = Date.now();

        if (!isScanningActive || !normalizedText) return;
        if (!acceptScanValue(normalizedText)) return;

        isScanningActive = false;

        try { directQrReader.pause(true); } catch (e) { }

        const item = findProductByScanValue(normalizedText);
        playNotificationBeep();

        if (item) {
          addCartItemBySku(item.sku);
          renderPosCatalog();
        } else {
          showToast(`Unknown Barcode: "${normalizedText}"`, "warning");
        }

        const searchInput = document.getElementById("pos-barcode-input");
        if (searchInput) {
          searchInput.value = normalizedText;
          setTimeout(() => { searchInput.value = ""; }, 1500);
        }

        if (window.innerWidth <= 768) {
          switchMobilePosTab("cart");
        }

        setTimeout(() => {
          isScanningActive = true;
          try { directQrReader.resume(); } catch (e) { }
        }, SCAN_DEBOUNCE_MS);
      } catch (error) {
        console.error("Inline direct scan handler error:", error);
        isScanningActive = true;
        try { directQrReader.resume(); } catch (e) { }
      }
    };

    const config = { fps: 10, qrbox: { width: 220, height: 160 } };

    directQrReader.start(
      { facingMode: "environment" },
      config,
      qrSuccess
    ).catch(err => {
      console.error("Direct scanner failed:", err);
      showToast("Camera Permission Blocked: Please enable camera access.", "error");
      inlineContainer.style.display = "none";
      isScanningActive = false;
    });
  } else {
    inlineContainer.style.display = "none";
    if (directQrReader) {
      try { directQrReader.stop().catch(() => { }); } catch (e) { }
      directQrReader = null;
    }
    resetScanLock();
  }
}

function resumePairedScanner() {
  const scanNextBtn = document.getElementById("paired-scan-next-btn");
  const lastScannedEl = document.getElementById("last-scanned-item");
  const statusEl = document.getElementById("mobile-peer-status");

  if (scanNextBtn) scanNextBtn.style.display = "none";
  if (lastScannedEl) lastScannedEl.style.display = "none";
  if (statusEl) {
    statusEl.innerText = "CONNECTED TO CLOUD ✔";
    statusEl.style.background = "#065f46";
  }

  // Clear previous lock state so same barcode can be scanned again if needed
  resetScanLock();

  isPairedScanningActive = true;

  if (html5QrReader) {
    try {
      html5QrReader.resume();
    } catch (e) { }
  }
}
