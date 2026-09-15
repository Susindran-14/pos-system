import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// High-speed In-Memory Cache for fast UI navigation
const apiCache = new Map();
const DEFAULT_TTL = 30000; // 30 seconds

export function invalidateCache(prefix = '') {
  if (!prefix) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.startsWith(prefix) || key.includes(prefix)) {
      apiCache.delete(key);
    }
  }
}

async function cachedGet(url, config = {}, ttl = DEFAULT_TTL) {
  const cacheKey = `${url}_${JSON.stringify(config.params || {})}`;
  const hit = apiCache.get(cacheKey);
  if (hit && Date.now() - hit.timestamp < ttl) {
    return hit.data;
  }
  const data = await api.get(url, config);
  apiCache.set(cacheKey, { timestamp: Date.now(), data });
  return data;
}

// --- API SERVICES ---
export const authApi = {
  login: (pin) => api.post('/auth/login', { pin }),
  getUsers: () => cachedGet('/auth/users', {}, 15000),
  createUser: async (userData) => {
    invalidateCache('/auth/users');
    return api.post('/auth/users', userData);
  },
  deleteUser: async (id) => {
    invalidateCache('/auth/users');
    return api.delete(`/auth/users/${id}`);
  },
};

export const productsApi = {
  getAll: (params) => cachedGet('/products', { params }, 20000),
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),
  getById: (id) => api.get(`/products/${id}`),
  create: async (data) => {
    invalidateCache('/products');
    invalidateCache('/inventory');
    invalidateCache('/reports');
    return api.post('/products', data);
  },
  update: async (id, data) => {
    invalidateCache('/products');
    invalidateCache('/inventory');
    invalidateCache('/reports');
    return api.put(`/products/${id}`, data);
  },
  delete: async (id) => {
    invalidateCache('/products');
    invalidateCache('/inventory');
    invalidateCache('/reports');
    return api.delete(`/products/${id}`);
  },
  getCategories: () => cachedGet('/products/meta/categories', {}, 60000),
  addCategory: async (data) => {
    invalidateCache('/products/meta/categories');
    return api.post('/products/meta/categories', data);
  },
  getBrands: () => cachedGet('/products/meta/brands', {}, 60000),
  addBrand: async (data) => {
    invalidateCache('/products/meta/brands');
    return api.post('/products/meta/brands', data);
  },
};

export const salesApi = {
  create: async (data) => {
    invalidateCache('/sales');
    invalidateCache('/products');
    invalidateCache('/inventory');
    invalidateCache('/reports');
    invalidateCache('/customers');
    return api.post('/sales', data);
  },
  getAll: (params) => cachedGet('/sales', { params }, 15000),
  getById: (id) => api.get(`/sales/${id}`),
  returnSale: async (id, reason) => {
    invalidateCache('/sales');
    invalidateCache('/products');
    invalidateCache('/inventory');
    invalidateCache('/reports');
    return api.post(`/sales/${id}/return`, null, { params: { reason } });
  },
};

export const customersApi = {
  getAll: (search) => cachedGet('/customers', { params: { search } }, 20000),
  getByMobile: (mobile) => api.get(`/customers/by-mobile/${mobile}`),
  create: async (data) => {
    invalidateCache('/customers');
    return api.post('/customers', data);
  },
  update: async (id, data) => {
    invalidateCache('/customers');
    return api.put(`/customers/${id}`, data);
  },
  settleDue: async (id, amount_paid, notes) => {
    invalidateCache('/customers');
    invalidateCache('/reports');
    return api.post(`/customers/${id}/settle-due`, { amount_paid, notes });
  },
  delete: async (id) => {
    invalidateCache('/customers');
    return api.delete(`/customers/${id}`);
  },
};

export const suppliersApi = {
  getAll: () => cachedGet('/suppliers', {}, 20000),
  create: async (data) => {
    invalidateCache('/suppliers');
    return api.post('/suppliers', data);
  },
  update: async (id, data) => {
    invalidateCache('/suppliers');
    return api.put(`/suppliers/${id}`, data);
  },
  pay: async (id, amount_paid, notes) => {
    invalidateCache('/suppliers');
    invalidateCache('/reports');
    return api.post(`/suppliers/${id}/pay`, { amount_paid, notes });
  },
  delete: async (id) => {
    invalidateCache('/suppliers');
    return api.delete(`/suppliers/${id}`);
  },
};

export const purchasesApi = {
  getAll: () => cachedGet('/purchases', {}, 15000),
  create: async (data) => {
    invalidateCache('/purchases');
    invalidateCache('/products');
    invalidateCache('/inventory');
    invalidateCache('/suppliers');
    invalidateCache('/reports');
    return api.post('/purchases', data);
  },
};

export const inventoryApi = {
  getSummary: () => cachedGet('/inventory/summary', {}, 20000),
  getMovements: (params) => cachedGet('/inventory/movements', { params }, 15000),
  adjustStock: async (data) => {
    invalidateCache('/inventory');
    invalidateCache('/products');
    return api.post('/inventory/adjust', data);
  },
};

export const expensesApi = {
  getAll: (category) => cachedGet('/expenses', { params: { category } }, 20000),
  create: async (data) => {
    invalidateCache('/expenses');
    invalidateCache('/reports');
    return api.post('/expenses', data);
  },
  delete: async (id) => {
    invalidateCache('/expenses');
    invalidateCache('/reports');
    return api.delete(`/expenses/${id}`);
  },
};

export const reportsApi = {
  getDashboard: () => cachedGet('/reports/dashboard', {}, 15000),
  getGstSummary: () => cachedGet('/reports/gst-summary', {}, 30000),
  getDayEndZReport: (date_str) => cachedGet('/reports/day-end-zreport', { params: { date_str } }, 30000),
  getPnL: () => cachedGet('/reports/pnl', {}, 30000),
  getAuditLogs: (limit = 100) => cachedGet('/reports/audit-logs', { params: { limit } }, 15000),
};

export const settingsApi = {
  getSettings: () => cachedGet('/settings', {}, 60000),
  updateSettings: async (data) => {
    invalidateCache('/settings');
    return api.put('/settings', data);
  },
  getDbStatus: () => api.get('/settings/db-status'),
  syncToNeon: async () => {
    // Invalidate all cached data upon full DB sync
    clearCache();
    return api.post('/settings/sync-to-neon');
  },
};

export const scannerApi = {
  pushScan: (session_id, barcode) => api.post('/scanner/push', { session_id, barcode }),
  pollScans: (session_id) => api.get(`/scanner/poll/${session_id}`),
  syncCart: (payload) => api.post('/scanner/sync-cart', payload),
  getCartStatus: (session_id) => api.get(`/scanner/cart-status/${session_id}`),
};

export default api;
