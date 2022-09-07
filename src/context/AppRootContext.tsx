import React, { Dispatch, useState } from "react";

import { AlertColor } from "@mui/material/Alert";
export declare type Locale = "en";

interface IAppRootContextState {
  locales?: Locale[];
  snackbar: (message: string, alertSeverity?: AlertColor) => void;
}

interface IAppRootContextProviderProps {
  children: React.ReactNode;
}

interface IAppRootContextProps {
  appRootState: IAppRootContextState;
  setAppRootState: Dispatch<React.SetStateAction<IAppRootContextState>>;
}

const defaultValues: IAppRootContextState = {
  snackbar: () => {},
};

const AppRootContext = React.createContext<IAppRootContextProps>({
  appRootState: defaultValues,
  setAppRootState: () => {},
});

const AppRootContextProvider: React.FC<IAppRootContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<IAppRootContextState>(defaultValues);
  return (
    <AppRootContext.Provider
      value={{ appRootState: state, setAppRootState: setState }}
    >
      {children}
    </AppRootContext.Provider>
  );
};

export { AppRootContext, AppRootContextProvider };
