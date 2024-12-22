// src/components/SendMoneyPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./SendMoneyPage.module.css"; // Assuming you're using CSS modules
import { useAuth } from "react-oidc-context";

const SendMoneyPage: React.FC = () => {
  const auth = useAuth() as unknown as {user: {access_token: string}};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`${import.meta.env.BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`, // Replace with actual auth logic
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.sendMoneyPage}>
      <h1>Send Money</h1>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.id} className={styles.userItem}>
            <span>
              {user.name} - {user.email}
            </span>
            <button onClick={() => handleSendMoney(user.id)}>Send</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function handleSendMoney(userId) {
  console.log(`Sending money to user with id ${userId}`);
  // Here you would implement the logic to send money, like opening a modal or navigating to a transaction form
}

export default SendMoneyPage;
