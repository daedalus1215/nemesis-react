import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./SendMoneyPage.module.css";
import axios from "axios";

interface UserDetails {
  id: string;
  email: string;
}

const SendMoneyPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [amount, setAmount] = useState<number | string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      
      if (userId) {
          fetchUserDetails();
        }
    }, [userId]);
    
    const fetchUserDetails = async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await axios.get(`/user.json`);
        if (!response.data) throw new Error("Failed to fetch user details");
        const data: UserDetails = await response.data;
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Could not fetch user details. Please try again later.");
      }
    };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+(\.[0-9]{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  const handlePay = async () => {
    if (!amount || parseFloat(amount as string) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace this with your payment API endpoint
      const response = await fetch(`/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount as string),
        }),
      });

      if (!response.ok) throw new Error("Payment failed");
      alert(`Successfully sent $${amount} to ${user?.email}!`);
      setAmount("");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles["send-money-container"]}>
      <h1>Send Money</h1>

      {user ? (
        <>
          <p>
            You're sending money to <strong>{user?.email?.replace(/@.*/, '')}</strong>.
          </p>

          <div className={styles["input-group"]}>
            <label htmlFor="amount">Amount:</label>
            <input
              id="amount"
              type="money"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>

          <button
            onClick={handlePay}
            disabled={
              isSubmitting || !amount || parseFloat(amount as string) <= 0
            }
            className={styles["pay-button"]}
          >
            {isSubmitting ? "Processing..." : "Pay"}
          </button>
        </>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default SendMoneyPage;
