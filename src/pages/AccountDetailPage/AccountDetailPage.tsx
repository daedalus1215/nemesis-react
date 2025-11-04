import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccountDetail } from "../../hooks/useAccountDetail";
import { useAccountBalance } from "../../hooks/useAccountBalance";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { SignOutButton } from "../../components/SignOutButton/SignOutButton";
import api from "../../api/axios.interceptor";
import styles from "./AccountDetailPage.module.css";
import { TransactionHistorySection } from "./TransactionHistorySection/TransactionHistorySection";

export const AccountDetailPage: React.FC = () => {
  const { accountId: id } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const accountId = parseInt(id || "0");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const lastScrollTop = useRef(0);

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

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleScroll = () => {
      const scrollTop = contentElement.scrollTop;
      const scrollThreshold = 50; // Start collapsing after 50px scroll

      if (scrollTop > scrollThreshold) {
        // Scrolling down
        if (scrollTop > lastScrollTop.current) {
          setIsHeaderCollapsed(true);
        } else {
          // Scrolling up
          setIsHeaderCollapsed(false);
        }
      } else {
        // Near the top, always show header
        setIsHeaderCollapsed(false);
      }

      lastScrollTop.current = scrollTop;
    };

    contentElement.addEventListener("scroll", handleScroll);
    return () => {
      contentElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <div className={`${styles.header}`}>
        <div className={styles.navigation}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          <SignOutButton />
        </div>

        {!isHeaderCollapsed && (
          <>
            <div className={styles.pageTitle}>
              <div className={styles.titleText}>{account.name} - {account.accountType}</div>
              <div className={styles.subtitle}>
                {account.isDefault && (
                  <span className={styles.defaultBadge}>Default Account</span>
                )}
              </div>
              <span className={styles.subtitle}>            {balanceLoading
                  ? "Loading..."
                  : balanceError
                  ? "Error"
                  : formatCurrency(balance || 0)}</span>
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
          </>
        )}
      </div>

      <div className={styles.content} ref={contentRef}>
        <TransactionHistorySection account={account} scrollContainerRef={contentRef} />
      </div>

      <BottomNavigation selected="Accounts" />
    </div>
  );
};
