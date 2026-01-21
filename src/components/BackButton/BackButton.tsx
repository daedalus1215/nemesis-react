import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css";

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className={styles.backButton} onClick={handleBack} aria-label="Go back">
      ←
    </button>
  );
};
