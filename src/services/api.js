import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Master Admin API
export const masterAdminAPI = {
  createUser: (userData) => api.post('/master-admin/users', userData),
  getAllUsers: () => api.get('/master-admin/users'),
  getUsersByRole: (role) => api.get(`/master-admin/users/role/${role}`),
  getUserSummary: () => api.get('/master-admin/users/summary'),
  deleteUser: (userId) => api.delete(`/master-admin/users/${userId}`),
  restoreUser: (userId) => api.post(`/master-admin/users/${userId}/restore`),
  getDeletedUsers: () => api.get('/master-admin/users/deleted'),
};

// Admin API
export const adminAPI = {
  // Product Management
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (productId, productData) => api.put(`/admin/products/${productId}`, productData),
  deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),
  restoreProduct: (productId) => api.post(`/admin/products/${productId}/restore`),
  getAllProducts: () => api.get('/admin/products'),
  getDeletedProducts: () => api.get('/admin/products/deleted'),
  getProductBySku: (sku) => api.get(`/admin/products/${sku}`),
  searchProducts: (query) => api.get(`/admin/products/search?query=${query}`),
  
  // Stock Management
  stockIn: (stockData) => api.post('/admin/stock/in', stockData),
  stockOut: (stockData) => api.post('/admin/stock/out', stockData),
  
  // Reports
  getInventorySummary: () => api.get('/admin/reports/inventory-summary'),
  getCategoryWiseReport: () => api.get('/admin/reports/category-wise'),
  getLowStockProducts: () => api.get('/admin/reports/low-stock'),
  
  // Employees
  getEmployees: () => api.get('/admin/employees'),
  getEmployeeCount: () => api.get('/admin/employees/count'),
};

// Employee API
export const employeeAPI = {
  getAllProducts: () => api.get('/employee/products'),
  getProductBySku: (sku) => api.get(`/employee/products/${sku}`),
  searchProducts: (query) => api.get(`/employee/products/search?query=${query}`),
  stockIn: (stockData) => api.post('/employee/stock/in', stockData),
  stockOut: (stockData) => api.post('/employee/stock/out', stockData),
  getTransactions: (filters) => {
    const params = new URLSearchParams();
    if (filters.sku) params.append('sku', filters.sku);
    if (filters.productName) params.append('productName', filters.productName);
    if (filters.transactionType) params.append('transactionType', filters.transactionType);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    return api.get(`/employee/transactions?${params.toString()}`);
  },
  getInventorySummary: () => api.get('/employee/reports/inventory-summary'),
  getLowStockProducts: () => api.get('/employee/reports/low-stock'),
};

export default api;
