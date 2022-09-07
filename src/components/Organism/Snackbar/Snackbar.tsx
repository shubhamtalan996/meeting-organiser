import MaterialSnackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppRootContext } from "../../../context/AppRootContext";

export type ISnackBarState = {
  open: boolean;
  message?: string;
  severity: AlertColor;
};

const getDefaultSnackBarState = (): ISnackBarState => ({
  open: false,
  message: "",
  severity: "error",
});

const Snackbar: React.FC = () => {
  const [snackBarState, setSnackBarState] = useState(getDefaultSnackBarState());

  const { setAppRootState } = useContext(AppRootContext);

  const handleOpenSnackbar = useCallback(
    (msg: string, alertSeverity?: AlertColor) => {
      setSnackBarState(() => ({
        open: true,
        message: msg || "",
        severity: alertSeverity || "error",
      }));
    },
    []
  );

  useEffect(() => {
    setAppRootState((prevValue) => ({
      ...prevValue,
      snackbar: handleOpenSnackbar,
    }));
  }, [setAppRootState, handleOpenSnackbar]);

  const handleCloseSnackbar = () => {
    setSnackBarState(getDefaultSnackBarState());
  };

  return (
    <>
      <MaterialSnackbar
        style={{ zIndex: 1401 }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackBarState?.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackBarState?.severity}>
          {snackBarState?.message}
        </Alert>
      </MaterialSnackbar>
    </>
  );
};

export default Snackbar;
