// src/pages/HomePage.js

import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { TransactionsList } from "../../components/transaction-list/TransactionsList";

import styles from "../App.css";

const HomePage: React.FC = () => {
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState({ balance: 0 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      fetchUserData();
      fetchTransactions();
    }
  }, [auth.isAuthenticated, auth.user]);

  const fetchUserData = async () => {
    if (auth.user && auth.user.access_token) {
      try {
        const response = await axios.get("user.json"); // Replace with actual API call
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchTransactions = async () => {
    if (auth.user && auth.user.access_token) {
      try {
        const response = await axios.get("transactions.json"); // Replace with actual API call
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Encountering error... {auth.error.message}</div>;

  if (!auth.isAuthenticated) return <div>Please log in.</div>;

  return (
    <div>
      <h2>Welcome, {auth.user?.profile.email}</h2>
      {userInfo && (
        <>
          <p>Balance: ${userInfo.balance}</p>
          <button onClick={() => console.log("Send money")}>Send</button>
        </>
      )}
      <h3>Transaction History</h3>
      <TransactionsList transactions={transactions} />
      <button onClick={() => auth.signinRedirect()}>Sign in</button>

    </div>
  );
};

export default HomePage;
