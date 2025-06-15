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

  const handleKeyPress = (key: string) => {
    if (key === "⌫") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (key === ".") {
      if (!amount.includes(".")) setAmount((prev) => prev + ".");
    } else {
      if (amount.length < 7) setAmount((prev) => (prev === "0" ? key : prev + key));
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-primary)", color: "var(--color-text-primary)" }}>
      <ResponsiveAppBar title="Send Money" username={user?.username || ""} />
      <Container maxWidth="xs" sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
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
        {/* @TODO: Abstract this into a component */}
        <Box sx={{ width: "100%", maxWidth: 320, mb: 2 }}>
          {numberPadKeys.map((row, rowIdx) => (
            <Grid
              container
              spacing={1}
              key={rowIdx}
              justifyContent="center"
              sx={{ mb: rowIdx < numberPadKeys.length - 1 ? 1 : 0 }}
            >
              {row.map((key, colIdx) => (
                <Grid item xs={4} key={key + colIdx}>
                  <Button
                    variant="contained"
                    onClick={() => handleKeyPress(key)}
                    sx={{
                      width: "100%",
                      height: 60,
                      fontSize: "2rem",
                      background: "var(--color-surface)",
                      color: "var(--color-text-primary)",
                      borderRadius: 2,
                      boxShadow: "none",
                      '&:hover': { background: "var(--color-primary-dark)" },
                    }}
                  >
                    {key === "⌫" ? <BackspaceIcon fontSize="large" /> : key}
                  </Button>
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
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
              '&:hover': { background: "var(--color-secondary-dark)" },
            }}
          >
            Request
          </Button>
          <Button
            variant="contained"
            sx={{
              flex: 1,
              background: "var(--color-primary-dark)",
              color: "var(--color-text-primary)",
              fontWeight: 700,
              fontSize: "1.2rem",
              py: 2,
              '&:hover': { background: "var(--color-primary-light)" },
            }}
          >
            Pay
          </Button>
        </Box>
      </Container>
      <BottomNavigation selected="Send" />
    </Box>
  );
};

export default MoneyPage;
