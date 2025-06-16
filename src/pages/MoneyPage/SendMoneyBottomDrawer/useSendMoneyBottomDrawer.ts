import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axios.interceptor';

const fetchUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const useSendMoneyBottomDrawer = (open: boolean) => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: open, // Only fetch when drawer is open
    staleTime: 1000 * 60 * 5, // Optional: cache for 5 minutes
  });

  return {
    users,
    isLoading,
    error,
  };
};
