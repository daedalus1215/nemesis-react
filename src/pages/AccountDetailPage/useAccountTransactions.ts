import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios.interceptor";

type Transaction = {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  category: string;
  debitAccountId: number;
  creditAccountId: number;
  initiatingUserId?: number;
  counterpartyUserId?: number;
  createdAt: string;
  updatedAt: string;
};

type TransactionWithType = Transaction & {
  type: 'INCOMING' | 'OUTGOING';
  otherAccountId: number;
};

type UseAccountTransactionsResult = {
  transactions: TransactionWithType[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useAccountTransactions = (
  accountId: number,
  limit: number = 20,
  offset: number = 0
): UseAccountTransactionsResult => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['accountTransactions', accountId, limit, offset],
    queryFn: async () => {
      const response = await api.get(`/accounts/${accountId}/transactions`, {
        params: { limit, offset }
      });
      
      // Transform transactions to add type and other account info
      const transactions = response.data.transactions.map((tx: Transaction): TransactionWithType => {
        const isIncoming = tx.creditAccountId === accountId;
        return {
          ...tx,
          type: isIncoming ? 'INCOMING' : 'OUTGOING',
          otherAccountId: isIncoming ? tx.debitAccountId : tx.creditAccountId,
        };
      });
      
      return { transactions, currentBalance: response.data.currentBalance };
    },
    enabled: !!accountId,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });

  return {
    transactions: data?.transactions || [],
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};
