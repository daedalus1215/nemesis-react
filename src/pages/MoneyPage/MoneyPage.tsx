import React, { useState } from "react";
import ResponsiveAppBar from "../../components/AppBar/ResponsiveAppBar";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useAuth } from "../../auth/useAuth";
import { SendMoneyBottomDrawer } from "./SendMoneyBottomDrawer/SendMoneyBottomDrawer";
import { MoneyDialPad } from "./MoneyDialPad";

const numberPadKeys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "⌫"],
];

const getDisplayAmount = (amount: string) => {
  if (!amount || amount === ".") return "$0";
  return `$${amount}`;
};

export const MoneyPage: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { user } = useAuth();
  const [state, setState] = useState({
    bottom: false,
  });
  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <ResponsiveAppBar title="Send Money" username={user?.username || ""} />
      <Container
        maxWidth="xs"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: "3rem",
            mt: 2,
            mb: 2,
            color: "var(--color-text-primary)",
          }}
        >
          {getDisplayAmount(amount)}
        </Typography>
        <MoneyDialPad amount={amount} setAmount={setAmount} />
        <Box sx={{ display: "flex", gap: 2, width: "100%", maxWidth: 320 }}>
          <Button
            variant="contained"
            sx={{
              flex: 1,
              background: "var(--color-secondary)",
              color: "var(--color-text-primary)",
              fontWeight: 700,
              fontSize: "1.2rem",
              py: 2,
              "&:hover": { background: "var(--color-secondary-dark)" },
            }}
          >
            Request
          </Button>
          <Button
            variant="contained"
            onClick={toggleDrawer("bottom", true)}
            sx={{
              flex: 1,
              background: "var(--color-primary-dark)",
              color: "var(--color-text-primary)",
              fontWeight: 700,
              fontSize: "1.2rem",
              py: 2,
              "&:hover": { background: "var(--color-primary-light)" },
            }}
          >
            PayI
          </Button>
        </Box>
        <SendMoneyBottomDrawer
          open={state["bottom"]}
          onClose={toggleDrawer("bottom", false)}
        />
      </Container>
      <BottomNavigation selected="Send" />
    </Box>
  );
};

export default MoneyPage;
