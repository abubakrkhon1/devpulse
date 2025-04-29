import { createContext, useContext } from "react";

export const UserOnlineContext = createContext({
    isOnline: false,
    isNetworkOnline: true,
  });

export function useUserOnlineContext() {
  const context = useContext(UserOnlineContext);

  if (context === undefined) {
    throw new Error(
      "useUserOnlineContext must be used within a UserOnlineProvider"
    );
  }

  return context;
}
