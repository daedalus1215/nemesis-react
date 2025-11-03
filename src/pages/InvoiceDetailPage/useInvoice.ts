import { useState, useEffect } from 'react';
import api from '../../api/axios.interceptor';
import { Invoice } from '../../api/responses/invoice.response';

interface UseInvoiceResult {
  invoice: Invoice | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInvoice = (invoiceId: number): UseInvoiceResult => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/invoices');
      const invoices = response.data.invoices;
      const foundInvoice = invoices.find((inv: Invoice) => inv.id === invoiceId);
      
      if (!foundInvoice) {
        setError('Invoice not found');
        setInvoice(null);
      } else {
        setInvoice(foundInvoice);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  return {
    invoice,
    loading,
    error,
    refetch: fetchInvoice,
  };
};

