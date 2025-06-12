// // src/components/SendMoneyPage.js

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "react-oidc-context";
// import styles from "./FriendsPage.module.css"; // Assuming you're using CSS modules
// import { useNavigate } from "react-router-dom";

// const FriendsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const auth = useAuth() as unknown as {user: {access_token: string}};
//   const [users, setUsers] = useState([{user_id:'', name:''}]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}users`, 
//           {
//           headers: {
//             Authorization: `Bearer ${auth.user.access_token}`, // Replace with actual auth logic
//           },
//         }
//       );
//         setUsers(response.data.users);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch users");
//         setLoading(false);
//       }
//     }

//     fetchUsers();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className={styles.sendMoneyPage}>
//       <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
//         <h2 className="text-3xl font-bold my-4">
//           Friends
//         </h2>

//       <ul className={styles.userList}>
//         {users?.map((user) => (
//           <li key={user.user_id} className={styles.userItem}>
//             <span>
//               {user.name}
//             </span>
//             <button onClick={() => navigate(`/send-money/${user.user_id}`)}>Send</button>
//           </li>
//         ))}
//       </ul>
//       </div>
//     </div>
//   );
// };

// export default FriendsPage;
