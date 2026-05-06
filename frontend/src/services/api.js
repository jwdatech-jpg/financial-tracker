import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  register: (email, password, name, currency = 'USD', country = 'US') =>
    apiClient.post('/auth/register', { email, password, name, currency, country }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/me', data),
}

export const accountService = {
  getAccounts: () => apiClient.get('/accounts'),
  createAccount: (data) => apiClient.post('/accounts', data),
  updateAccount: (id, data) => apiClient.put(`/accounts/${id}`, data),
  deleteAccount: (id) => apiClient.delete(`/accounts/${id}`),
}

export const transactionService = {
  getTransactions: (params) => apiClient.get('/transactions', { params }),
  createTransaction: (data) => apiClient.post('/transactions', data),
  updateTransaction: (id, data) => apiClient.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => apiClient.delete(`/transactions/${id}`),
}

export const budgetService = {
  getBudgets: () => apiClient.get('/budgets'),
  createBudget: (data) => apiClient.post('/budgets', data),
  updateBudget: (id, data) => apiClient.put(`/budgets/${id}`, data),
  deleteBudget: (id) => apiClient.delete(`/budgets/${id}`),
}

export const goalsService = {
  getGoals: () => apiClient.get('/goals'),
  createGoal: (data) => apiClient.post('/goals', data),
  updateGoal: (id, data) => apiClient.put(`/goals/${id}`, data),
  deleteGoal: (id) => apiClient.delete(`/goals/${id}`),
}

export const dashboardService = {
  getSummary: () => apiClient.get('/dashboard/summary'),
  getChartData: (period) => apiClient.get(`/dashboard/chart?period=${period}`),
}
