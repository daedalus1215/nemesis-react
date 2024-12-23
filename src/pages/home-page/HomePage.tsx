import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { TransactionsList } from "../../components/transaction-list/TransactionsList";
import Button from "../../components/button/Button";

import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ balance: 0 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      fetchUserData();
      fetchTransactions();
    }
  }, [auth.isAuthenticated, auth.user]);

  const fetchUserData = async () => {
    if (auth.user?.access_token) {
      try {
        const response = await axios.get(`user.json`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchTransactions = async () => {
    if (auth.user?.access_token) {
      try {                  
        const response = await axios.get("transactions.json");
        setTransactions(response.data);
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
            Welcome, {auth.user?.profile?.email.replace(/@.*/, '')}
          </h2>
          <p className="text-green-500 text-xl mb-6">
            <span className={styles.balance}>${userInfo.balance}</span>
          </p>
          <Button onClick={() => navigate('/friends')}>Friends</Button>
        </div>
      )}
      <h3>History</h3>
      <TransactionsList transactions={transactions} />
    </div>
  );
};

export default HomePage;
