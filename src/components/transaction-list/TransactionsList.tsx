// src/components/TransactionsList.js

import React from 'react';
import styles from './Transactions.module.css'; // Import CSS module


type Transaction = {
    id: number;
    description: string;
    amount: number;
    date: string;
}
type Props = {
    transactions: Transaction[]
}


const TransactionsList: React.FC<Props> = ({ transactions }) => {
  return (
    <div className={styles.transactionsList}>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} styles={styles} />
      ))}
    </div>
  );
}

function TransactionItem({ transaction, styles }: { transaction: Transaction, styles: { [key: string]: string } }) {
  return (
    <div className={styles.transactionItem}>
      <div className={styles.transactionDetails}>
        <div className={styles.paymentIcon}>
        <img className={styles.paymentIcon} />
        </div>
        <div>
          <div className={styles.transactionAmount}>${transaction.amount}</div>
          <div className={styles.transactionDescription}>{transaction.description}</div>
        </div>
      </div>
      <div className={styles.transactionTime}>{transaction.date}</div>
    </div>
  );
}

export { TransactionsList, TransactionItem };