import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccountDetail } from "../../hooks/useAccountDetail";
import { useAccountBalance } from "../../hooks/useAccountBalance";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { SignOutButton } from "../../components/SignOutButton/SignOutButton";
import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import api from "../../api/axios.interceptor";
import styles from "./AccountDetailPage.module.css";
import { TransactionHistorySection } from "./TransactionHistorySection/TransactionHistorySection";

export const AccountDetailPage: React.FC = () => {
  const { accountId: id } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const accountId = parseInt(id || "0");
  const contentRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
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
      <div className={`${styles.header}`}>
        <div className={styles.navigation}>
          <button className={styles.backButton} onClick={handleBack}>
            ←
          </button>
          <div className={styles.pageTitle}>
              <div className={styles.titleText}>{account.name} - {account.accountType}</div>
              <span className={styles.subtitle}>            {balanceLoading
                  ? "Loading..."
                  : balanceError
                  ? "Error"
                  : formatCurrency(balance || 0)}</span>
            </div>
          <SignOutButton />
        </div>
      </div>

      <div className={styles.content} ref={contentRef}>
        <TransactionHistorySection key={account.id} account={account} scrollContainerRef={contentRef} />
      </div>

      <div className={styles.fabContainer}>
        <Fab
          color="primary"
          aria-label="Account actions"
          onClick={handleMenuToggle}
          className={styles.fab}
        >
          <Add />
        </Fab>
        {menuOpen && (
          <div className={styles.actionMenu} onClick={(e) => e.stopPropagation()}>
            <button className={styles.menuItem} onClick={() => { handleMenuClose(); handleSendMoney(); }}>
              <span className={styles.menuItemIcon}>$</span>
              <span className={styles.menuItemText}>Send Money</span>
            </button>
            <button className={styles.menuItem} onClick={() => { handleMenuClose(); handleTransferFunds(); }}>
              <span className={styles.menuItemIcon}>⇄</span>
              <span className={styles.menuItemText}>Transfer Funds</span>
            </button>
            {!account.isDefault && (
              <button className={styles.menuItem} onClick={() => { handleMenuClose(); handleSetDefault(); }}>
                <span className={styles.menuItemIcon}>★</span>
                <span className={styles.menuItemText}>Set as Default</span>
              </button>
            )}
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
