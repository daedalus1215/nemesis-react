import React from "react";
import { AccountBalance, AttachMoney, AccountBox, TrendingFlat, Receipt } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const navItems = [
  { value: "Home", label: "Home", icon: AccountBalance, path: "/" },
  { value: "Send", label: "Send", icon: AttachMoney, path: "/money" },
  { value: "Accounts", label: "Accounts", icon: AccountBox, path: "/accounts" },
  { value: "Transfer", label: "Transfer", icon: TrendingFlat, path: "/accounts/transfer" },
  { value: "Invoices", label: "Invoices", icon: Receipt, path: "/invoices" },
] as const;

type NavValue = typeof navItems[number]["value"];

export const Sidebar: React.FC<{ selected: NavValue }> = ({ selected }) => {
  const location = useLocation();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.navItems}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.value === selected && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.value}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            >
              <Icon className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
