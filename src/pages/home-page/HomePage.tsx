import React  from 'react';
import { useAuth } from '../../auth/useAuth';
import styles from './HomePage.module.css';
import { useUserProfile } from './useUserProfile';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { data: userDetails, isLoading, error } = useUserProfile();

  if (!user) {
    return null; // This shouldn't happen due to ProtectedRoute, but TypeScript needs it
  }

  if (isLoading) return <div>Loading user details...</div>;
  if (error) return <div style={{ color: 'red' }}>{(error as any).response?.data?.message || error.message}</div>;
  if (!userDetails) return null;

  return (
    <div className={styles.homePage}>
      {/* <Header /> */}
      <main className={styles.main}>
        <h1>Home Page</h1>
        <div>Welcome, {userDetails.username}!</div>
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