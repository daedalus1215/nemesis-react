import React from "react";
import { useAuth } from "../../auth/useAuth";
import { useUserProfile } from "./useUserProfile";
import { useUserBalance } from "./useUserBalance";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import ResponsiveAppBar from "../../components/AppBar/ResponsiveAppBar";
import Container from "@mui/material/Container";
import styles from "./HomePage.module.css";

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { data: userDetails, isLoading, error } = useUserProfile();
  const {
    data: balance,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useUserBalance();
  if (!user) {
    return null; // This shouldn't happen due to ProtectedRoute, but TypeScript needs it
  }

  if (isLoading) return <div>Loading user details...</div>;
  const getErrorMessage = (err: unknown) => {
    if (typeof err === "object" && err !== null) {
      if (
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
      ) {
        return (err as { response: { data: { message: string } } }).response
          .data.message;
      }
      if (
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
      ) {
        return (err as { message: string }).message;
      }
    }
    return "An error occurred.";
  };

  if (error)
    return <div style={{ color: "red" }}>{getErrorMessage(error)}</div>;
  if (!userDetails) return null;

  let balanceContent;
  if (isBalanceLoading) {
    balanceContent = <div className={styles.balance}>Loading balance...</div>;
  } else if (balanceError) {
    balanceContent = (
      <div className={styles.balance} style={{ color: "red" }}>
        {getErrorMessage(balanceError)}
      </div>
    );
  } else if (balance) {
    balanceContent = (
      <div className={styles.balance}>Balance: ${balance.amount}</div>
    );
  }

  return (
    <>
      <ResponsiveAppBar title="Home" username={userDetails.username}/>
      <Container maxWidth="xl">
        <div className={styles.homePage}>
          <main className={styles.main}>
            {balanceContent}
            <div>Welcome, {userDetails.username}!</div>
          </main>
          <button className={styles.fab} aria-label="Create new note">
            A Button
          </button>

          <BottomNavigation selected="Home" />
        </div>
      </Container>
    </>
  );
};
