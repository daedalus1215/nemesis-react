import React, { useState } from 'react';
import styles from './SendMoneyPage.module.css';

const SendMoneyPage: React.FC = () => {
  const [amount, setAmount] = useState<number | string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure input is a valid number or empty
    if (value === '' || /^[0-9]+(\.[0-9]{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  const handlePay = async () => {
    if (!amount || parseFloat(amount as string) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Example API call (replace with actual payment logic)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating network request
      alert(`Payment of $${amount} successfully sent!`);
      setAmount(''); // Reset the amount
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['send-money-container']}>
      <h1>Send Money</h1>
      <p>Enter the amount you wish to send:</p>

      <div className={styles['input-group']}>
        <label htmlFor="amount">Amount (USD):</label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          disabled={isSubmitting}
        />
      </div>

      <button 
        onClick={handlePay} 
        disabled={isSubmitting || !amount || parseFloat(amount as string) <= 0}
        className={styles['pay-button']}
      >
        {isSubmitting ? 'Processing...' : 'Pay'}
      </button>
    </div>
  );
};

export default SendMoneyPage;
