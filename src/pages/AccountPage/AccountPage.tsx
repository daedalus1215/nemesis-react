import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import api from '../../api/axios.interceptor';

interface Account {
  id: number;
  name: string;
  isDefault: boolean;
  accountType: string;
  createdAt: string;
}

export function AccountPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAccounts();
  }, [isAuthenticated, navigate]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/accounts');
      console.log('Fetched accounts:', response.data);
      setAccounts(response.data.accounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (accountId: number) => {
    try {
      await api.put(`/accounts/${accountId}/default`);
      // Refresh accounts list
      fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set default account');
    }
  };

  const handleCreateAccount = () => {
    navigate('/accounts/create');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading accounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Accounts</h1>
        <button
          onClick={handleCreateAccount}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            You don't have any accounts yet.
          </div>
          <button
            onClick={handleCreateAccount}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Create Your First Account
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`p-6 rounded-lg border-2 transition duration-200 ${
                account.isDefault
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {account.name}
                </h3>
                {account.isDefault && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Type:</span> {account.accountType}
                </div>
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(account.createdAt).toLocaleDateString()}
                </div>
              </div>

              {!account.isDefault && (
                <div className="mt-4">
                  <button
                    onClick={() => handleSetDefault(account.id)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded transition duration-200"
                  >
                    Set as Default
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
