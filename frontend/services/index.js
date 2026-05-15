import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (categorySlug, productSlug) => api.get(`/products/by-slug/${categorySlug}/${productSlug}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  reorder: (id, direction) => api.patch(`/products/${id}/reorder`, { direction }),
  remove: (id) => api.delete(`/products/${id}`),
};

export const cartService = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (id, data) => api.put(`/cart/${id}`, data),
  remove: (id) => api.delete(`/cart/${id}`),
};

export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  verify: (data) => api.post('/orders/verify', data),
  updateStatus: (id, data) => api.put(`/orders/${id}`, data),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const adminService = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPayments: () => api.get('/admin/payments'),
};

export const reviewService = {
  getByProduct: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  getEligibility: (productId) => api.get(`/reviews/eligibility/${productId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  remove: (id) => api.delete(`/reviews/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/categories/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  reorder: (id, direction) => api.patch(`/categories/${id}/reorder`, { direction }),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const heroService = {
  getAll: () => api.get('/hero'),
  getAdmin: () => api.get('/hero/admin'),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/hero/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  create: (data) => api.post('/hero', data),
  update: (id, data) => api.put(`/hero/${id}`, data),
  reorder: (id, direction) => api.patch(`/hero/${id}/reorder`, { direction }),
  remove: (id) => api.delete(`/hero/${id}`),
};
