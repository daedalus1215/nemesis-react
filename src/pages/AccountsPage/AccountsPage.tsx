import React from "react";
import { useAuth } from "../../auth/useAuth";
import { useUserProfile } from "./useUserProfile";
import { useAccounts } from "./useAccounts";
import { useAccountBalances } from "./useAccountBalances";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { MenuIcon } from "../../components/icons/MenuIcon/MenuIcon";
import api from "../../api/axios.interceptor";
import styles from "./AccountsPage.module.css";

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userDetails, loading: profileLoading, error: profileError } = useUserProfile();
  const { accounts, loading: accountsLoading, error: accountsError, refetch } = useAccounts();
  
  // Extract account IDs for the balances query
  const accountIds = accounts.map(account => account.id);
  const { data: accountBalances, isLoading: balancesLoading } = useAccountBalances(accountIds);

  if (!user) {
    return null;
  }

  const handleCreateAccount = () => {
    navigate("/accounts/create");
  };

  const handleTransferFunds = () => {
    navigate("/accounts/transfer");
  };

  const handleSendMoney = () => {
    navigate("/money");
  };

  const handleSetDefault = async (accountId: number) => {
    try {
      await api.put(`/accounts/${accountId}/default`);
      // Refresh accounts list - balances will automatically refetch
      await refetch();
    } catch (err) {
      console.error('Failed to set default account:', err);
    }
  };

  const getInitials = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (profileLoading) {
    return <div className={styles.loading}>Loading user details...</div>;
  }

  if (profileError) {
    return <ErrorMessage message={`Error loading profile: ${profileError}`} />;
  }

  if (!userDetails) {
    return null;
  }

  return (
    <div className={styles.accountPage}>
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

        <div className={styles.pageTitle}>
          <div className={styles.titleText}>My Accounts</div>
          <div className={styles.subtitle}>
            Manage your financial accounts
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={handleCreateAccount}>
            + Add Account
          </button>
          <button className={styles.actionButton} onClick={handleTransferFunds}>
            Transfer Funds
          </button>
          <button className={styles.actionButton} onClick={handleSendMoney}>
            Send Money
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.accountsSection}>
          {accountsLoading ? (
            <div className={styles.loading}>Loading accounts...</div>
          ) : accountsError ? (
            <ErrorMessage message={`Error loading accounts: ${accountsError}`} />
          ) : accounts && accounts.length > 0 ? (
            <div className={styles.accountsGrid}>
              {accounts.map((account) => (
                <div 
                  key={account.id} 
                  className={`${styles.accountCard} ${
                    account.isDefault ? styles.defaultAccount : ''
                  }`}
                >
                  <div className={styles.accountHeader}>
                    <h3 className={styles.accountName}>{account.name}</h3>
                    {account.isDefault && (
                      <span className={styles.defaultBadge}>Default</span>
                    )}
                  </div>
                  
                  <div className={styles.accountDetails}>
                    <div className={styles.accountDetail}>
                      <span className={styles.detailLabel}>Type:</span>
                      <span className={styles.detailValue}>{account.accountType}</span>
                    </div>
                    <div className={styles.accountDetail}>
                      <span className={styles.detailLabel}>Balance:</span>
                      <span className={`${styles.detailValue} ${styles.balance}`}>
                        {balancesLoading ? (
                          "Loading..."
                        ) : accountBalances?.[account.id] !== undefined ? (
                          formatCurrency(accountBalances[account.id])
                        ) : (
                          "Error"
                        )}
                      </span>
                    </div>
                    <div className={styles.accountDetail}>
                      <span className={styles.detailLabel}>Created:</span>
                      <span className={styles.detailValue}>
                        {new Date(account.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {!account.isDefault && (
                    <button
                      onClick={() => handleSetDefault(account.id)}
                      className={styles.setDefaultButton}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noAccounts}>
              <div className={styles.noAccountsTitle}>No accounts yet</div>
              <div className={styles.noAccountsMessage}>
                You don't have any accounts yet. Create your first account to get started with managing your finances.
              </div>
              <button 
                className={styles.createAccountButton}
                onClick={handleCreateAccount}
              >
                Create Your First Account
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation selected="Accounts" />
    </div>
  );
};
