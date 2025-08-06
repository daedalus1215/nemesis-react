import { Box, Typography, IconButton, TextField, Autocomplete } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BottomDrawer } from "../../../components/BottomDrawer/BottomDrawer";
import { useSendMoneyBottomDrawer } from "./useSendMoneyBottomDrawer";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import api from '../../../api/axios.interceptor';

type UserAutocompleteOption = {
  label: string;
  id: number;
};

type SendMoneyBottomDrawerProps = {
  open: boolean;
  onClose: () => void;
  amount: string | number;
};

type FormValues = {
  to: UserAutocompleteOption | null;
  note: string;
};

export const SendMoneyBottomDrawer: React.FC<SendMoneyBottomDrawerProps> = ({
  open,
  onClose,
  amount,
}) => {
  const { users, isLoading, error } = useSendMoneyBottomDrawer(open);

  const userOptions: UserAutocompleteOption[] = (users || []).map((user: { username: string; id: number }) => ({
    label: user.username,
    id: user.id,
  }));

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { to: null, note: "" },
  });

  // Reset form when drawer closes
  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!data.to) {
      alert('Please select a user to send money to.');
      return;
    }
    try {
      await api.post('/accounts/transfer', {
        toUserId: data.to.id,
        amount: Number(amount),
        description: data.note,
      });
      alert('Transfer successful!');
    } catch {
      alert('Transfer failed. Please try again.');
    }
  };

  return (
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
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <IconButton
          aria-label="close"
          onClick={() => onClose()}
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
        <Box
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disablePortal
                options={userOptions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={isLoading}
                onChange={(_, value) => field.onChange(value)}
                value={field.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To"
                    placeholder="Name, $Cashtag, Phone, Email"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error ? "Error loading users" : ""}
                  />
                )}
              />
            )}
          />
          <Controller
            name="note"
            control={control}
            rules={{ required: "Note is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="For"
                placeholder="Note (required)"
                variant="outlined"
                fullWidth
                size="medium"
                InputLabelProps={{ shrink: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>
        <button type="submit" style={{ display: "none" }} />
      </Box>
    </BottomDrawer>
  );
};
