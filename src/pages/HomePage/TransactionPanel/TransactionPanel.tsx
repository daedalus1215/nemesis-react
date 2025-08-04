import React from "react";
import styles from "./TransactionPanel.module.css";
import { TransactionListView } from "../TransactionListView/TransactionListView";

export const TransactionPanel: React.FC = () => {
  return (
  <div className={styles.transactionsSection}>
          <div className={styles.transactionsHeader}>
            <div className={styles.sectionTitle}>Transactions</div>
            <a href="#" className={styles.viewAll}>View all</a>
          </div>
      <TransactionListView />
    </div>
  );
};