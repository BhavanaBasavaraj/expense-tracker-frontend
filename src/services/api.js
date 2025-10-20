import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// ============================================
// AUTHENTICATION APIs
// ============================================

export const register = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
// ============================================
// EXPENSES APIs
// ============================================

export const getExpenses = async (token, skip = 0, limit = 100) => {
    const response = await axios.get(`${API_BASE_URL}/expenses/?skip=${skip}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const createExpense = async (token, expenseData) => {
    const response = await axios.post(`${API_BASE_URL}/expenses/`, 
      expenseData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  };
  
  export const updateExpense = async (token, expenseId, expenseData) => {
    const response = await axios.put(`${API_BASE_URL}/expenses/${expenseId}`, 
      expenseData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  };
  
  export const deleteExpense = async (token, expenseId) => {
    const response = await axios.delete(`${API_BASE_URL}/expenses/${expenseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  };
  // ============================================
// CATEGORIES APIs
// ============================================

export const getCategories = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/categories/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const createCategory = async (token, categoryData) => {
    const response = await axios.post(`${API_BASE_URL}/categories/`, 
      categoryData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  };
  export const deleteCategory = async (token, categoryId) => {
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  };
  // ============================================
  // ANALYTICS APIs
  // ============================================
  
  export const getDashboard = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const getCategoryBreakdown = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/analytics/by-category`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const getMonthlySummary = async (token, months = 6) => {
    const response = await axios.get(`${API_BASE_URL}/analytics/monthly?months=${months}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  };