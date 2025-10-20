import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getExpenses } from '../services/api';

const MonthlyView = () => {
  const { token, logoutUser } = useAuth();
  const navigate = useNavigate();
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Get all expenses
      const allExpenses = await getExpenses(token);
      
      // Group expenses by month
      const monthsMap = {};
      
      allExpenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthsMap[monthKey]) {
          monthsMap[monthKey] = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            expenses: [],
            total_income: 0,
            total_expenses: 0,
            net_balance: 0
          };
        }
        
        monthsMap[monthKey].expenses.push(expense);
        
        if (expense.category?.type === 'income') {
          monthsMap[monthKey].total_income += expense.amount;
        } else {
          monthsMap[monthKey].total_expenses += expense.amount;
        }
      });
      
      // Calculate net balance and sort by date (newest first)
      const monthsArray = Object.values(monthsMap).map(month => ({
        ...month,
        net_balance: month.total_income - month.total_expenses
      })).sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      });
      
      setMonthlyData(monthsArray);
      
    } catch (err) {
      if (err.response?.status === 401) {
        logoutUser();
        navigate('/login');
      } else {
        setError('Failed to load monthly data');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const formatMonth = (year, month) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[month - 1]} ${year}`;
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
          <h1 className="text-2xl font-bold text-gray-800">Monthly View</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Back to Dashboard
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

        {/* Monthly Summary - Vertical List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Monthly Summary</h2>
          
          {monthlyData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No expenses yet. Start tracking your expenses!
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyData.map((month, index) => (
                <div key={index}>
                  <div
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500"
                    onClick={() => setSelectedMonth(selectedMonth === index ? null : index)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">
                        {formatMonth(month.year, month.month)}
                      </h3>
                      <span className="text-sm text-blue-600 font-medium">
                        {selectedMonth === index ? 'Hide Details ▲' : 'Show Details ▼'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <span className="text-sm text-gray-600">Income</span>
                        <p className="text-lg font-semibold text-green-600">
                          ${month.total_income.toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">Expenses</span>
                        <p className="text-lg font-semibold text-red-600">
                          ${month.total_expenses.toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">Net Balance</span>
                        <p className={`text-lg font-bold ${
                          month.net_balance >= 0 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          ${month.net_balance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-500">
                      {month.expenses.length} transaction{month.expenses.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedMonth === index && (
                    <div className="bg-gray-50 rounded-b-lg shadow-md p-6 mt-2 border-l-4 border-blue-300">
                      <h4 className="font-semibold text-gray-700 mb-4">Transactions:</h4>
                      
                      {month.expenses.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No transactions for this month
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {month.expenses.map((expense) => (
                            <div 
                              key={expense.id} 
                              className="bg-white p-4 rounded-lg flex justify-between items-center hover:bg-gray-50"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{expense.description}</p>
                                <div className="flex gap-3 mt-1">
                                  <span className="text-sm text-gray-500">
                                    {new Date(expense.date).toLocaleDateString()}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    expense.category?.type === 'income' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {expense.category?.name || 'N/A'}
                                  </span>
                                </div>
                              </div>
                              <div className={`text-lg font-bold ${
                                expense.category?.type === 'income' 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {expense.category?.type === 'income' ? '+' : '-'}
                                ${expense.amount.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;