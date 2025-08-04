import { useMemo } from "react";
import { useTransactionsPaginated } from "./useTransactionsPaginated";
import styles from "../HomePage.module.css";
import { TransactionStatus, TransactionType } from "../../../constant";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";

type TransactionWithType = {
  id: string;
  amount: number;
  description: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  type: TransactionType;
  otherUserId: number;
  otherUsername: string;
};

export const TransactionListView = () => {
  const {
    data: transactionPages,
    isLoading: transactionsLoading,
    error: transactionsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactionsPaginated();

  const allTransactions = useMemo(() => {
    return transactionPages?.pages.flat() || [];
  }, [transactionPages]);

  if (transactionsLoading && allTransactions.length === 0) {
    return <div>Loading transactions...</div>;
  }

  if (transactionsError) {
    return (
      <ErrorMessage
        message={`Error loading transactions: ${transactionsError.message}`}
      />
    );
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderTransactionItem = (
    transaction: TransactionWithType,
    index: number
  ) => {
    const avatarClass =
      index % 3 === 0 ? "avatar1" : index % 3 === 1 ? "avatar2" : "avatar3";
    const isOutgoing = transaction.type === "OUTGOING";

    return (
      <div key={transaction.id} className={styles.transactionItem}>
        <div className={styles.transactionDetails}>
          <div className={`${styles.transactionIcon} ${styles[avatarClass]}`}>
            {transaction.otherUsername.charAt(0).toUpperCase()}
          </div>
          <div className={styles.transactionInfo}>
            <div className={styles.transactionName}>
              {transaction.otherUsername}
            </div>
            <div className={styles.transactionTime}>
              {isOutgoing ? "Sent" : "Received"} •{" "}
              {new Date(transaction.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </div>
        <div
          className={`${styles.transactionAmount} ${
            isOutgoing ? styles.sent : styles.received
          }`}
        >
          {isOutgoing ? "-" : "+"}${transaction.amount.toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.transactionsList}>
      {transactionsLoading && allTransactions.length === 0 ? (
        <div className={styles.loading}>Loading transactions...</div>
      ) : transactionsError ? (
       <ErrorMessage message={`Error loading transactions: ${transactionsError}`} />
      ) : allTransactions.length > 0 ? (
        <div>
          {allTransactions.map(renderTransactionItem)}

          {/* Load more button */}
          {hasNextPage && (
            <div style={{ textAlign: "center", padding: "16px" }}>
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className={styles.loadMoreButton}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.loading}>No transactions yet</div>
      )}
    </div>
  );
};
