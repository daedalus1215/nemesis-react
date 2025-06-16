import { Box, Typography, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { MouseEvent, KeyboardEvent, ReactNode } from "react";
import { BottomDrawer } from "../../../components/BottomDrawer/BottomDrawer";

type SendMoneyBottomDrawerProps = {
  open: boolean;
  onClose: (event: KeyboardEvent | MouseEvent) => void;
  amount: string | number;
  children?: ReactNode; // Allow for further extension if needed
};

export const SendMoneyBottomDrawer: React.FC<SendMoneyBottomDrawerProps> = ({
  open,
  onClose,
  amount,
  children,
}) => (
  <BottomDrawer
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        height: "100vh",
        backgroundColor: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
        opacity: 1,
        boxShadow: "none",
      },
    }}
  >
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 2,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography
        variant="h3"
        sx={{
          mt: 2,
          mb: 1,
          fontWeight: 700,
          textAlign: "center",
          fontSize: { xs: "2.5rem", sm: "3rem" },
          letterSpacing: 0.5,
        }}
        data-testid="send-amount"
      >
        ${amount}
      </Typography>
      {/* To and For fields */}
      <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="To"
          placeholder="Name, $Cashtag, Phone, Email"
          variant="outlined"
          fullWidth
          size="medium"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="For"
          placeholder="Note (required)"
          variant="outlined"
          fullWidth
          size="medium"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {children}
    </Box>
  </BottomDrawer>
);
