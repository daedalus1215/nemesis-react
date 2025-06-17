import React from "react";
import { Box, Grid, Button } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';

type MoneyDialPadProps = {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
};

const numberPadKeys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "⌫"],
];

const MoneyDialPad: React.FC<MoneyDialPadProps> = ({ amount, setAmount }) => {
  const handleKeyPress = (key: string) => {
    if (key === "⌫") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (key === ".") {
      if (!amount.includes(".")) setAmount((prev) => prev + ".");
    } else {
      if (amount.length < 7)
        setAmount((prev) => (prev === "0" ? key : prev + key));
    }
  };

  return (
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
            // @ts-expect-error MUI Grid type resolution issue
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
                  "&:hover": { background: "var(--color-primary-dark)" },
                }}
              >
                {key === "⌫" ? <BackspaceIcon fontSize="large" /> : key}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export { MoneyDialPad }; 