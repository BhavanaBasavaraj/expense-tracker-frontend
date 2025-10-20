import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDashboard, getExpenses, createExpense, deleteExpense, getCategories } from '../services/api';

const Dashboard = () => {
  const { logoutUser, token } = useAuth();
  const navigate = useNavigate();
  
  // State variables
  const [analytics, setAnalytics] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch analytics
      const analyticsData = await getDashboard(token);
      setAnalytics(analyticsData);
      
      // Fetch expenses
      const expensesData = await getExpenses(token);
      setExpenses(expensesData);
      
      // Fetch categories
      const categoriesData = await getCategories(token);
      setCategories(categoriesData);
      
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure date is in YYYY-MM-DD format
      const dateValue = formData.date.includes('T') 
        ? formData.date.split('T')[0] 
        : formData.date;
      
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        category_id: parseInt(formData.category_id),
        date: dateValue
      };
      
      console.log('Sending expense data:', expenseData);
      
      await createExpense(token, expenseData);
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        category_id: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      
      // Refresh data
      fetchData();
      alert('Expense added successfully!');
    } catch (err) {
      console.error('Error adding expense:', err);
      console.error('Error response:', err.response?.data);
      alert('Failed to add expense: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(token, expenseId);
        fetchData();
        alert('Expense deleted successfully!');
      } catch (err) {
        alert('Failed to delete expense');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
          <div className="flex gap-4">
  <button
    onClick={() => navigate('/monthly')}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
  >
    Monthly View
  </button>
  <button
    onClick={() => navigate('/categories')}
    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
  >
    Manage Categories
  </button>
  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
  >
    Logout
  </button>
</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Income */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-green-600">
                ${analytics.total_income?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Total Expenses */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">
                ${analytics.total_expenses?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Net Balance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Net Balance</h3>
              <p className={`text-3xl font-bold ${
                (analytics.net_balance || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                ${analytics.net_balance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        )}

        {/* Add Expense Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            {showForm ? 'Cancel' : '+ Add Expense'}
          </button>
        </div>
        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Amount</label>
                  <input
  type="number"
  name="amount"
  value={formData.amount}
  onChange={handleChange}
  step="0.01"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  placeholder="0.00"
  required
/>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Grocery shopping"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        )}{/* Expenses List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Expenses</h2>
          </div>

          {expenses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No expenses yet. Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          expense.category?.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {expense.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <span className={
                          expense.category?.type === 'income' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }>
                          {expense.category?.type === 'income' ? '+' : '-'}
                          ${expense.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;