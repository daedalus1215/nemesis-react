import React  from 'react';
import { useAuth } from '../../auth/useAuth';
import styles from './HomePage.module.css';
import api from '../../api/axios.interceptor';
import { useQuery } from '@tanstack/react-query';

const fetchUserProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    retry: false, // or true, depending on your needs
  });
};

// const useUserDetails = (userId: string) => {
//   const [userDetails, setUserDetails] = useState<{ id: string; username: string } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   //@TODO: Can we do this without useEffect?
//   useEffect(() => {
//     if (!userId) return;
//     setLoading(true);
//     setError(null);
//     api.get(`/users/profile`)
//       .then((res) => {
//         setUserDetails(res.data);
//         console.log('yes', res.data);
//       })
//       .catch((err) => {
//         const backendMsg = err?.response?.data?.message || err?.message || 'Failed to fetch user details';
//         setError(backendMsg);
//       })
//       .finally(() => setLoading(false));
//   }, [userId]);

//   return { userDetails, loading, error };
// };

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