import { useState, useEffect } from 'react';
import api from '../../api/axios.interceptor';

type User = {
  id: number;
  username: string;
};

type UseUsersResult = {
  users: User[];
  loading: boolean;
  error: string | null;
};

export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/users');
        setUsers(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
