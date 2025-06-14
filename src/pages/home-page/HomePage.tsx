import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import styles from './HomePage.module.css';
import api from '../../api/axios.interceptor';

const useUserDetails = (userId: string) => {
  const [userDetails, setUserDetails] = useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //@TODO: Can we do this without useEffect?
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    api.get(`/users`)
      .then((res) => setUserDetails(res.data))
      .catch((err) => {
        const backendMsg = err?.response?.data?.message || err?.message || 'Failed to fetch user details';
        setError(backendMsg);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { userDetails, loading, error };
};

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { userDetails, loading, error } = useUserDetails(user?.id ?? '');

  if (!user) {
    return null; // This shouldn't happen due to ProtectedRoute, but TypeScript needs it
  }

  return (
    <div className={styles.homePage}>
      {/* <Header /> */}
      <main className={styles.main}>
        <h1>Home Page</h1>
        {loading && <div>Loading user details...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {userDetails && <div>Welcome, {userDetails.username}!</div>}
      </main>
      <button 
        className={styles.fab} 
        aria-label="Create new note"
      >
       A Button
      </button>

    </div>
  );
}; 