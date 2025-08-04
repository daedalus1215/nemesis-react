import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../api/axios.interceptor";

type TransactionWithType = {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  type: 'INCOMING' | 'OUTGOING';
  otherUserId: number;
  otherUsername: string; // Backend now provides this!
};

const fetchTransactionsPaginated = async ({ pageParam }: { pageParam?: string }) => {
  const params = new URLSearchParams({
    limit: '20',
    ...(pageParam && { cursor: pageParam }),
  });
  
  const { data } = await api.get(`/accounts/transactions/paginated?${params}`);
  return data as TransactionWithType[];
};

export const useTransactionsPaginated = () => {
  return useInfiniteQuery({
    queryKey: ['transactionsPaginated'],
    queryFn: fetchTransactionsPaginated,
    getNextPageParam: (lastPage) => {
      // Use the last transaction's ID as cursor for next page
      if (lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    initialPageParam: undefined,
    retry: false,
  });
}; 