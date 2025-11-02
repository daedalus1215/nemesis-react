import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./TransactionHistorySection.module.css";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { useAccountTransactions } from "../useAccountTransactions";
import { AccountDetail } from "../../../hooks/useAccountDetail";

type TransactionHistorySectionProps = {
  account: AccountDetail;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
};

type TransactionWithType = {
  id: number;
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  category: string;
  type: 'INCOMING' | 'OUTGOING';
  createdAt: string;
};

export const TransactionHistorySection: React.FC<
  TransactionHistorySectionProps
> = ({ account, scrollContainerRef: externalScrollRef }) => {
  const [transactionsPerPage] = useState(20);
  const [offset, setOffset] = useState(0);
  const [allTransactions, setAllTransactions] = useState<TransactionWithType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const transactionsListRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);
  
  const {
    transactions: fetchedTransactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useAccountTransactions(account.id, transactionsPerPage, offset);

  // Accumulate transactions as we fetch more
  useEffect(() => {
    if (fetchedTransactions.length > 0) {
      if (offset === 0) {
        // First load - replace all transactions
        setAllTransactions(fetchedTransactions);
      } else {
        // Subsequent loads - append new transactions
        setAllTransactions(prev => [...prev, ...fetchedTransactions]);
      }
      
      // Check if we have more transactions to load
      setHasMore(fetchedTransactions.length === transactionsPerPage);
      setIsLoadingMore(false);
      loadingMoreRef.current = false;
    } else if (offset > 0 && fetchedTransactions.length === 0) {
      // No more transactions
      setHasMore(false);
      setIsLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [fetchedTransactions, offset, transactionsPerPage]);

  // Reset when account changes
  useEffect(() => {
    setOffset(0);
    setAllTransactions([]);
    setHasMore(true);
  }, [account.id]);

  const loadMore = useCallback(() => {
    if (loadingMoreRef.current || !hasMore || transactionsLoading) {
      return;
    }
    
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setOffset(prev => prev + transactionsPerPage);
  }, [hasMore, transactionsLoading, transactionsPerPage]);

  // Scroll detection for infinite scroll
  useEffect(() => {
    // Use the external scroll ref if provided, otherwise find scrollable parent
    const getScrollContainer = (): HTMLElement | null => {
      if (externalScrollRef?.current) {
        return externalScrollRef.current;
      }
      
      // Fallback: find scrollable parent
      const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
        if (!element) return null;
        
        const style = window.getComputedStyle(element);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll' || 
            style.overflow === 'auto' || style.overflow === 'scroll') {
          return element;
        }
        
        return findScrollableParent(element.parentElement);
      };

      return findScrollableParent(transactionsListRef.current?.parentElement || null);
    };

    let scrollContainer: HTMLElement | null = null;
    let cleanup: (() => void) | null = null;

    const setupScrollListener = (container: HTMLElement) => {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Load more when user is 300px from bottom
            const threshold = 300;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            
            if (distanceFromBottom < threshold && hasMore && !loadingMoreRef.current && !transactionsLoading) {
              loadMore();
            }
            
            ticking = false;
          });
          ticking = true;
        }
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    };

    // Try to get scroll container immediately
    scrollContainer = getScrollContainer();
    
    if (scrollContainer) {
      cleanup = setupScrollListener(scrollContainer);
    } else {
      // Retry after a short delay if container not found
      const timeoutId = setTimeout(() => {
        const retryContainer = getScrollContainer();
        if (retryContainer) {
          cleanup = setupScrollListener(retryContainer);
        }
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        if (cleanup) cleanup();
      };
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [externalScrollRef, hasMore, transactionsLoading, loadMore]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (transactionsLoading && allTransactions.length === 0) {
    return <div className={styles.loading}>Loading transactions...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTransactionTypeIcon = (type: "INCOMING" | "OUTGOING") => {
    return type === "INCOMING" ? "↗️" : "↘️";
  };

  const getTransactionTypeClass = (type: "INCOMING" | "OUTGOING") => {
    return type === "INCOMING" ? styles.incoming : styles.outgoing;
  };

  return (
    <div className={styles.transactionsSection}>
      {transactionsError ? (
        <ErrorMessage
          message={`Error loading transactions: ${transactionsError}`}
        />
      ) : allTransactions && allTransactions.length > 0 ? (
        <div className={styles.transactionsList} ref={transactionsListRef}>
          {allTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionHeader}>
                <span className={styles.transactionType}>
                  {getTransactionTypeIcon(transaction.type)}
                </span>
                <span
                  className={`${styles.transactionAmount
                    } ${getTransactionTypeClass(transaction.type)}`}
                >
                  {transaction.type === "INCOMING" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>

              <div className={styles.transactionDetails}>
                <div className={styles.transactionDescription}>
                  {transaction.description || "Transfer"}
                </div>
                <div className={styles.transactionMeta}>
                  <span className={styles.transactionCategory}>
                    {transaction.category}
                  </span>
                  <span className={styles.transactionDate}>
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>
                <div className={styles.transactionStatus}>
                  Status: {transaction.status}
                </div>
              </div>
            </div>
          ))}
          {isLoadingMore && (
            <div className={styles.loadingMore}>
              Loading more transactions...
            </div>
          )}
          {!hasMore && allTransactions.length > 0 && (
            <div className={styles.noMoreTransactions}>
              No more transactions to load
            </div>
          )}
        </div>
      ) : (
        <div className={styles.noTransactions}>
          <div className={styles.noTransactionsTitle}>No transactions yet</div>
          <div className={styles.noTransactionsMessage}>
            This account doesn't have any transactions yet. Start by sending
            money or transferring funds.
          </div>
        </div>
      )}
    </div>
  );
};
