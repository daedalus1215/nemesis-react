import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import styles from "./AccountInvoicePage.module.css";

export const AccountInvoicePage: React.FC = () => {
  const navigate = useNavigate();
    
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button className={styles.backButton} onClick={() => navigate("/accounts")}>
            ← Back
          </button>
        </div>
        <div className={styles.pageTitle}>
          <div className={styles.titleText}>Invoices</div>
          {/* <div className={styles.subtitle}>{account.accountType} -  {account.isDefault && (
            <span className={styles.defaultBadge}>Default Account</span>
          )}</div>          */}
        </div>

        <div className={styles.actionButtons}>

        </div>
      </div>

      <div className={styles.content}>
        'content'
      </div>

      <BottomNavigation selected="Invoices" />
    </div>
  );
};