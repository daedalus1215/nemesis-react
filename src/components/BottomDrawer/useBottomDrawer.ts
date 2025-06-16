import { useState, useCallback } from "react";
import type { MouseEvent, KeyboardEvent } from "react";

type DrawerEvent = KeyboardEvent | MouseEvent;

export const useBottomDrawer = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback((event?: DrawerEvent) => setOpen(false), []);
  const toggleDrawer = useCallback(
    (open: boolean) => (event?: DrawerEvent) => setOpen(open),
    []
  );

  return {
    open,
    handleOpen,
    handleClose,
    toggleDrawer,
  };
};
