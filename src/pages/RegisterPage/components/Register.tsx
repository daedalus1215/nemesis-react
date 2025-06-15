import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../components/Logo/Logo";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./Register.module.css";

type RegisterProps = {
  onRegister: (username: string, password: string) => Promise<boolean>;
  backendError?: string | null;
};

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
          <Logo className={styles.logo} />
          <span className={styles.titleText}>Register</span>
        </h2>
        {error && <div className={styles.error}>{error}</div>}
        {backendError && <div className={styles.error}>{backendError}</div>}
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            borderRadius: "9999px",
            py: 1.5,
            fontWeight: 600,
            fontSize: "1rem",
            mt: 2,
          }}
        >
          Register
        </Button>
      </form>
      <div className={styles.loginLink}>
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};
