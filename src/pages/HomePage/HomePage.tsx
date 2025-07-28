import React, { useMemo } from "react";
import { useAuth } from "../../auth/useAuth";
import { useUserProfile } from "./useUserProfile";
import { useUserBalance } from "./useUserBalance";
import { useTransactionsPaginated } from "./useTransactionsPaginated";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

type TransactionWithType = {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  type: 'INCOMING' | 'OUTGOING';
  otherUserId: number;
  otherUsername: string;
};

const MenuIcon = () => (
  <svg className={styles.menuIcon} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TransferIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 14l5-5 5 5M7 14h10"/>
  </svg>
);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userDetails, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useUserBalance();
  
  // Fetch paginated transactions with usernames included!
  const {
    data: transactionPages,
    isLoading: transactionsLoading,
    error: transactionsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useTransactionsPaginated();

  // Flatten all transactions from all pages
  const allTransactions = useMemo(() => {
    return transactionPages?.pages.flat() || [];
  }, [transactionPages]);

  if (!user) {
    return null;
  }

  const getErrorMessage = (err: unknown) => {
    if (typeof err === "object" && err !== null) {
      if (
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
      ) {
        return (err as { response: { data: { message: string } } }).response
          .data.message;
      }
      if (
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
      ) {
        return (err as { message: string }).message;
      }
    }
    return "An error occurred.";
  };

  const handleTransferClick = () => {
    navigate("/money");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitials = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  const renderTransactionItem = (transaction: TransactionWithType, index: number) => {
    const avatarClass = index % 3 === 0 ? 'avatar1' : index % 3 === 1 ? 'avatar2' : 'avatar3';
    const isOutgoing = transaction.type === 'OUTGOING';
    
    return (
      <div key={transaction.id} className={styles.transactionItem}>
        <div className={styles.transactionDetails}>
          <div 
            className={`${styles.transactionIcon} ${styles[avatarClass]}`}
          >
            {transaction.otherUsername.charAt(0).toUpperCase()}
          </div>
          <div className={styles.transactionInfo}>
            <div className={styles.transactionName}>
              {transaction.otherUsername}
            </div>
            <div className={styles.transactionTime}>
              {isOutgoing ? 'Sent' : 'Received'} • {new Date(transaction.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>
        </div>
        <div 
          className={`${styles.transactionAmount} ${isOutgoing ? styles.sent : styles.received}`}
        >
          {isOutgoing ? '-' : '+'}${transaction.amount.toLocaleString()}
        </div>
      </div>
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (profileLoading) {
    return <div className={styles.loading}>Loading user details...</div>;
  }

  if (profileError) {
    return <div className={styles.error}>{getErrorMessage(profileError)}</div>;
  }

  if (!userDetails) {
    return null;
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <div className={styles.userGreeting}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {getInitials(userDetails.username)}
            </div>
            <div className={styles.greeting}>
              Hello, {userDetails.username}
            </div>
          </div>
          <MenuIcon />
        </div>

        <div className={styles.balanceSection}>
          <div className={styles.balanceLabel}>Total Balance</div>
          <div className={styles.balanceAmount}>
            {balanceLoading ? 
              "Loading..." : 
              balanceError ? 
                "Error" : 
                formatCurrency(balance?.amount || 0)
            }
          </div>
          <div className={styles.lastUpdated}>
            Balance last updated at {formatTime()} ↻
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={handleTransferClick}>
            <TransferIcon />
            Transfer
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.transactionsSection}>
          <div className={styles.transactionsHeader}>
            <div className={styles.sectionTitle}>Transactions</div>
            <a href="#" className={styles.viewAll}>View all</a>
          </div>
          
          <div className={styles.transactionsList}>
            {transactionsLoading && allTransactions.length === 0 ? (
              <div className={styles.loading}>Loading transactions...</div>
            ) : transactionsError ? (
              <div className={styles.error}>{getErrorMessage(transactionsError)}</div>
            ) : allTransactions.length > 0 ? (
              <div>
                {allTransactions.map(renderTransactionItem)}
                
                {/* Load more button */}
                {hasNextPage && (
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <button 
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      className={styles.loadMoreButton}
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.loading}>No transactions yet</div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation selected="Home" />
    </div>
  );
};
