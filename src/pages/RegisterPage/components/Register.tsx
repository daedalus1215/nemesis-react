import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../components/Logo/Logo";
import styles from "./Register.module.css";

interface RegisterProps {
  onRegister: (username: string, password: string) => Promise<boolean>;
  backendError?: string | null;
}

export const Register: React.FC<RegisterProps> = ({
  onRegister,
  backendError,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await onRegister(username, password);
    } catch {
      setError("An error occurred during registration");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>
          <Logo height={50} />
          <span className={styles.titleText}>Register</span>
        </h2>
        {error && <div className={styles.error}>{error}</div>}
        {backendError && <div className={styles.error}>{backendError}</div>}
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Register
        </button>
      </form>
      <div className={styles.loginLink}>
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};
