import { ReactNode } from "react";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import { AppRootContextProvider } from "../../context/AppRootContext";
import Snackbar from "../Organism/Snackbar";

const client = new GraphQLClient({
  url: "http://smart-meeting.herokuapp.com",
  headers: { token: "a123gjhgjsdf6576" },
});

export type IAppInitializationProps = {
  children?: ReactNode;
};

const AppInitialization: React.FC<IAppInitializationProps> = ({ children }) => {
  return (
    <AppRootContextProvider>
      <ClientContext.Provider value={client}>
        <Snackbar />
        {children}
      </ClientContext.Provider>
    </AppRootContextProvider>
  );
};

export default AppInitialization;
