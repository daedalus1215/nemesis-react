import React, { useState, useRef } from "react";
import { useUserProfile } from "./useUserProfile";
import { useAccounts } from "./useAccounts";
import { useAccountBalances } from "./useAccountBalances";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import { BackButton } from "../../components/BackButton/BackButton";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { SignOutButton } from "../../components/SignOutButton/SignOutButton";
import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import api from "../../api/axios.interceptor";
import styles from "./AccountsListPage.module.css";

export const AccountsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  
  const {
    userDetails,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();
  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
    refetch,
  } = useAccounts();

  // Extract account IDs for the balances query
  const accountIds = accounts.map((account) => account.id);
  const { data: accountBalances, isLoading: balancesLoading } =
    useAccountBalances(accountIds);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleCreateAccount = () => {
    handleMenuClose();
    navigate("/accounts/create");
  };

  const handleTransferFunds = () => {
    handleMenuClose();
    navigate("/accounts/transfer");
  };

  const handleSendMoney = () => {
    handleMenuClose();
    navigate("/money");
  };

  const handleSetDefault = async (accountId: number) => {
    try {
      await api.put(`/accounts/${accountId}/default`);
      // Refresh accounts list - balances will automatically refetch
      await refetch();
    } catch (err) {
      console.error("Failed to set default account:", err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <BackButton />
          <div className={styles.pageTitle}>
            <div className={styles.titleText}>My Accounts</div>
            <div className={styles.subtitle}>Manage your financial accounts</div>
          </div>


        <SignOutButton />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.accountsSection}>
          {accountsLoading ? (
            <div className={styles.loading}>Loading accounts...</div>
          ) : accountsError ? (
            <ErrorMessage
              message={`Error loading accounts: ${accountsError}`}
            />
          ) : accounts && accounts.length > 0 ? (
            <div className={styles.accountsGrid}>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`${styles.accountCard} ${account.isDefault ? styles.defaultAccount : ""
                    }`}
                  onClick={() => navigate(`/accounts/detail/${account.id}`)}
                  style={{ cursor: "pointer" }}
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
                      <span className={styles.detailValue}>
                        {account.accountType}
                      </span>
                    </div>
                    <div className={styles.accountDetail}>
                      <span className={styles.detailLabel}>Balance:</span>
                      <span
                        className={`${styles.detailValue} ${styles.balance}`}
                      >
                        {balancesLoading
                          ? "Loading..."
                          : accountBalances?.[account.id] !== undefined
                            ? formatCurrency(accountBalances[account.id])
                            : "Error"}
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
                You don't have any accounts yet. Create your first account to
                get started with managing your finances.
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

      <div className={styles.fabContainer}>
        <Fab
          ref={fabRef}
          color="primary"
          aria-label="Account actions"
          onClick={handleMenuToggle}
          className={styles.fab}
        >
          <Add />
        </Fab>
        {menuOpen && (
          <div className={styles.actionMenu} onClick={(e) => e.stopPropagation()}>
            <button className={styles.menuItem} onClick={handleCreateAccount}>
              <span className={styles.menuItemIcon}>+</span>
              <span className={styles.menuItemText}>Add Account</span>
            </button>
            <button className={styles.menuItem} onClick={handleTransferFunds}>
              <span className={styles.menuItemIcon}>⇄</span>
              <span className={styles.menuItemText}>Transfer Funds</span>
            </button>
            <button className={styles.menuItem} onClick={handleSendMoney}>
              <span className={styles.menuItemIcon}>$</span>
              <span className={styles.menuItemText}>Send Money</span>
            </button>
          </div>
        )}
        {menuOpen && (
          <div className={styles.menuBackdrop} onClick={handleMenuClose} />
        )}
      </div>

      <BottomNavigation selected="Accounts" />
    </div>
  );
};
