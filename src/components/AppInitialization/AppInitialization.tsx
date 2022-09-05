import { ReactNode } from "react";
import { GraphQLClient, ClientContext } from "graphql-hooks";

const client = new GraphQLClient({
  url: "http://smart-meeting.herokuapp.com",
  headers: { token: "a123gjhgjsdf6576" },
});

export type IAppInitializationProps = {
  children?: ReactNode;
};

const AppInitialization: React.FC<IAppInitializationProps> = ({ children }) => {
  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
};

export default AppInitialization;
