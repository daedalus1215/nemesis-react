import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { MouseEvent, KeyboardEvent, ReactNode } from "react";
import { BottomDrawer } from "../../../components/BottomDrawer/BottomDrawer";

type SendMoneyBottomDrawerProps = {
  open: boolean;
  onClose: (event: KeyboardEvent | MouseEvent) => void;
  children?: ReactNode; // Allow for further extension if needed
};

export const SendMoneyBottomDrawer: React.FC<SendMoneyBottomDrawerProps> = ({
  open,
  onClose,
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
      <Typography variant="h6" sx={{ mt: 4 }}>
        Send Money
      </Typography>
      {children}
    </Box>
  </BottomDrawer>
);
