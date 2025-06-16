// src/components/TransactionsList.tsx

import React from 'react';
import styles from './Transactions.module.css'; // Import CSS module
import { FaMoneyCheckAlt } from 'react-icons/fa'; // Example icon

type Transaction = {
  transaction_id: string; // ID should match the API field
  description: string;
  amount: number;
  timestamp: string;
  sender_id: string;
  receiver_id: string;
};

type Props = {
  transactions: Transaction[];
  userId: string; // Current user's ID to determine sender or receiver
};

const TransactionsList: React.FC<Props> = ({ transactions, userId }) => {
  return (
    <div className={styles.transactionsList}>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.transaction_id}
          transaction={transaction}
          styles={styles}
          userId={userId}
        />
      ))}
    </div>
  );
};

function TransactionItem({
  transaction,
  styles,
  userId,
}: {
  transaction: Transaction;
  styles: { [key: string]: string };
  userId: string;
}) {
  const isSender = transaction.sender_id === userId;

  return (
    <div
      className={`${styles.transactionItem} ${
        isSender ? styles.senderTransaction : styles.receiverTransaction
      }`}
    >
      <div className={styles.transactionDetails}>
        <div className={styles.paymentIcon}>
        <FaMoneyCheckAlt size={24} color={isSender ? '#ff4d4d' : '#4dff4d'} />
        </div>
        <div>
          <div className={styles.transactionAmount}>
            {isSender ? `- $${transaction.amount}` : `+ $${transaction.amount}`}
          </div>
          <div className={styles.transactionDescription}>
            {transaction.description}
          </div>
        </div>
      </div>
      <div className={styles.transactionTime}>
        {new Date(transaction.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

export { TransactionsList, TransactionItem };
