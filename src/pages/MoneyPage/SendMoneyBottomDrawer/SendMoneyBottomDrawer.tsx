import { Box, Typography, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { MouseEvent, KeyboardEvent } from "react";

type SendMoneyBottomDrawerProps = {
  open: boolean;
  onClose: (event: KeyboardEvent | MouseEvent) => void;
};

export const SendMoneyBottomDrawer: React.FC<SendMoneyBottomDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer
      anchor={"bottom"}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '100vh',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          width: '100%',
          margin: 0,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          p: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
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
      </Box>
    </Drawer>
  );
};  