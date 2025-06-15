import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../../components/Logo/Logo';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import styles from './Login.module.css';

type LoginProps = {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Invalid credentials');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
          <Logo className={styles.logo} />
          <Typography variant="h2" className={styles.title}>
            <span className={styles.titleText}>Login</span>
          </Typography>
        {error && <div className={styles.error}>{error}</div>}
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          disabled={isSubmitting}
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
          disabled={isSubmitting}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          sx={{ borderRadius: '9999px', py: 1.5, fontWeight: 600, fontSize: '1rem' }}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <div className={styles.registerLink}>
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
} 