import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { TransactionsList } from "../../components/transaction-list/TransactionsList";
import Button from "../../components/button/Button";

import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const auth = useAuth() as unknown as {
    isLoading: boolean;
    error: { message: string };
    isAuthenticated: string;
    user: { access_token: string; profile: { email: string; sub: string } };
  };
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ balance: 0 } );
  const [transactions, setTransactions] = useState([]);

  console.log(auth.user?.access_token);
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      fetchUserData(auth.user?.profile.sub);
      fetchTransactions(auth.user?.profile.sub);
    }
  }, [auth.isAuthenticated, auth.user?.profile]);

  const fetchUserData = async (userId: string) => {
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
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchTransactions = async (userId: string) => {
    if (auth.user?.access_token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}transactions/user-id/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Encountering error... {auth.error.message}</div>;

  return (
    <div className={styles.homePage}>
      {userInfo && (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
          <h2 className="text-3xl font-bold my-4">
            Welcome, {auth.user?.profile?.email.replace(/@.*/, "")}
          </h2>
          <p className="text-green-500 text-xl mb-6">
            <span className={styles.balance}>${userInfo.balance}</span>
          </p>
          <Button onClick={() => navigate("/friends")}>Friends</Button>
        </div>
      )}
      <h3>History</h3>
      <TransactionsList transactions={transactions} userId={auth.user?.profile.sub} />
    </div>
  );
};

export default HomePage;