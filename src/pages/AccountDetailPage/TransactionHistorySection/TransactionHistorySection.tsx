import React, { useState } from "react";
import styles from "./TransactionHistorySection.module.css";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { useAccountTransactions } from "../useAccountTransactions";
import { AccountDetail } from "../../../hooks/useAccountDetail";

type TransactionHistorySectionProps = {
  account: AccountDetail;
};

export const TransactionHistorySection: React.FC<
  TransactionHistorySectionProps
> = ({ account }) => {
  const [transactionsPerPage] = useState(20);
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useAccountTransactions(account.id, transactionsPerPage, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!transactions) {
    return <ErrorMessage message="Transactions not found" />;
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
      <div className={styles.sectionHeader}>
        <h3>Transaction History</h3>
        <div className={styles.accountMeta}>
          Created: {formatDate(account.createdAt)}
        </div>
      </div>

      {transactionsLoading ? (
        <div className={styles.loading}>Loading transactions...</div>
      ) : transactionsError ? (
        <ErrorMessage
          message={`Error loading transactions: ${transactionsError}`}
        />
      ) : transactions && transactions.length > 0 ? (
        <div className={styles.transactionsList}>
          {transactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionHeader}>
                <span className={styles.transactionType}>
                  {getTransactionTypeIcon(transaction.type)}
                </span>
                <span
                  className={`${
                    styles.transactionAmount
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
