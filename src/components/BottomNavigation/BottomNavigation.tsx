import React from "react";
import { AccountBalance, AttachMoney, AccountBox } from "@mui/icons-material";
import {
  BottomNavigationAction,
  BottomNavigation as MuiBottomNavigation,
} from "@mui/material";
import { useScroll } from "../../context/ScrollContext";
import styles from "./BottomNavigation.module.css";

const labels = {
  Home: "Home",
  Send: "Send",
  Accounts: "Accounts",
} as const;

export const BottomNavigation: React.FC<{selected: keyof typeof labels}> = ({selected}) => {
  const [value, setValue] = React.useState(selected);
  const { isVisible, direction, hasScrolled } = useScroll();
    
  console.log('BottomNavigation rendering with:', { isVisible, direction, hasScrolled });
  
  return (
    <MuiBottomNavigation
      showLabels
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
      }}
      className={`${styles.bottomNavigation} ${direction=== "down" ? styles.hidden : styles.visible}`}
    >
      <BottomNavigationAction value="Home" label={labels.Home} icon={<AccountBalance />} href="/" />
      <BottomNavigationAction value="Send" label={labels.Send} icon={<AttachMoney />} href="/money" />
      <BottomNavigationAction value="Accounts" label={labels.Accounts} icon={<AccountBox />} href="/accounts" />
    </MuiBottomNavigation>
  );
};
