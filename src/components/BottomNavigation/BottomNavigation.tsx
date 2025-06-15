import { AccountBalance, AttachMoney } from "@mui/icons-material";
import {
  BottomNavigationAction,
  BottomNavigation as MuiBottomNavigation,
} from "@mui/material";
import styles from "./BottomNavigation.module.css";
import React from "react";

export const BottomNavigation: React.FC = () => {
  const [value, setValue] = React.useState(0);
  return (
    <MuiBottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      className={styles.bottomNavigation}
    >
      <BottomNavigationAction label="Home" icon={<AccountBalance />} />
      <BottomNavigationAction label="Send" icon={<AttachMoney />} />
    </MuiBottomNavigation>
  );
};
