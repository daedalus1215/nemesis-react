import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccountDetail } from "../../hooks/useAccountDetail";
import { useAccountBalance } from "../../hooks/useAccountBalance";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { MenuIcon } from "../../components/icons/MenuIcon/MenuIcon";
import api from "../../api/axios.interceptor";
import styles from "./AccountDetailPage.module.css";
import { TransactionHistorySection } from "./TransactionHistorySection/TransactionHistorySection";

export const AccountDetailPage: React.FC = () => {
  const { accountId: id } = useParams<{ accountId: string }>();
  console.log(id);
  const navigate = useNavigate();
  const accountId = parseInt(id || "0");

  const {
    account,
    loading: accountLoading,
    error: accountError,
    refetch: refetchAccount,
  } = useAccountDetail(accountId);
  const {
    balance,
    loading: balanceLoading,
    error: balanceError,
  } = useAccountBalance(accountId);

  if (!accountId) {
    return <ErrorMessage message="Invalid account ID" />;
  }

  const handleBack = () => {
    navigate("/accounts");
  };

  const handleSetDefault = async () => {
    try {
      await api.put(`/accounts/${accountId}/default`);
      await refetchAccount();
    } catch (err) {
      console.error("Failed to set default account:", err);
    }
  };

  const handleSendMoney = () => {
    navigate("/money");
  };

  const handleTransferFunds = () => {
    navigate("/accounts/transfer");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (accountLoading) {
    return <div className={styles.loading}>Loading account details...</div>;
  }

  if (accountError) {
    return <ErrorMessage message={`Error loading account: ${accountError}`} />;
  }

  if (!account) {
    return <ErrorMessage message="Account not found" />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          <MenuIcon />
        </div>

        <div className={styles.accountInfo}>
          <div className={styles.accountName}>{account.name}</div>
          <div className={styles.accountType}>{account.accountType}</div>
          {account.isDefault && (
            <span className={styles.defaultBadge}>Default Account</span>
          )}
        </div>

        <div className={styles.balanceSection}>
          <div className={styles.balanceLabel}>Current Balance</div>
          <div className={styles.balanceAmount}>
            {balanceLoading
              ? "Loading..."
              : balanceError
              ? "Error"
              : formatCurrency(balance || 0)}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={handleSendMoney}>
            Send Money
          </button>
          <button className={styles.actionButton} onClick={handleTransferFunds}>
            Transfer Funds
          </button>
          {!account.isDefault && (
            <button className={styles.actionButton} onClick={handleSetDefault}>
              Set as Default
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <TransactionHistorySection account={account} />
      </div>

      <BottomNavigation selected="Accounts" />
    </div>
  );
};
