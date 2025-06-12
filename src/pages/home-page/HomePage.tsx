import React from 'react';
import { useAuth } from '../../auth/useAuth';
import styles from './HomePage.module.css';


export const HomePage: React.FC = () => {
  const { user } = useAuth();


  if (!user) {
    return null; // This shouldn't happen due to ProtectedRoute, but TypeScript needs it
  }

  return (
    <div className={styles.homePage}>
      {/* <Header /> */}
      <main className={styles.main}>
        <h1>Home Page</h1>
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