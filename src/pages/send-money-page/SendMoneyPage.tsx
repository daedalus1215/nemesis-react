import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "react-oidc-context";

import styles from "./SendMoneyPage.module.css";

interface UserDetails {
  user_id: string;
  name: string;
  balance: number;
}

const SendMoneyPage: React.FC = () => {
  const auth = useAuth() as unknown as {
    isLoading: boolean;
    error: { message: string };
    isAuthenticated: string;
    user: { access_token: string; profile: { email: string; sub: string } };
  };
  const { userId } = useParams<{ userId: string }>();
  const [receivingUser, setReceivingUser] = useState<UserDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<UserDetails | null>(null);
  const [amount, setAmount] = useState<number | string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId, setReceivingUser);
    }
    if (auth.user) {
      fetchUserData(auth.user.profile.sub, setCurrentUser);
    }
  }, [userId, auth.user]);

  const fetchUserData = async (
    userId: string,
    setter: (userDetail: UserDetails) => void
  ) => {
    if (auth.user?.access_token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setter(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
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

    console.log("currentUser?.balance", currentUser?.balance);
    if (parseFloat(amount as string) > (currentUser?.balance || 0)) {
      alert("Insufficient balance");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}transactions`,
        {
          receiverId: userId,
          amount: parseFloat(amount as string),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      

      if (!response.data) throw new Error("Payment failed");
      alert(`Successfully sent $${amount} to ${receivingUser?.name}!`);
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
      {receivingUser ? (
        <>
          <div>
            You're sending money to{" "}
            <span className={styles.name}>{receivingUser.name}</span>
          </div>
          <div>
            Their balance: <strong>${receivingUser?.balance}</strong>
          </div>
          <hr />
          <div>
            Your balance: <strong>${currentUser?.balance}</strong>
          </div>
          <div>
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
            {/* <div className={styles["input-group"]}>
            <label htmlFor="description">description:</label>
              <input type="textarea" id='Description'/>
            </div> */}
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
