import React from "react";
import styles from "./LoginPage.module.css";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.isAuthenticated) {
    navigate("/home");
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Log in</h1>
        <p>
          Enter your email. New to Nemesis App? <a href="#">Create account</a>
        </p>

        <div className={styles["button-group"]}>
          {/* <button className={`${styles.button} ${styles.secondary}`}>
            Use email
          </button> */}
          <button
            onClick={() => auth.signinRedirect()}
            className={`${styles.button} ${styles.primary}`}
          >
            Continue
          </button>
        </div>

        <div className={styles.footer}>
          By entering and clicking Continue, you agree to the{" "}
          <a href="#">Terms</a>, <a href="#">E-Sign Consent</a>, &{" "}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
