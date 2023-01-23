import { createContext } from "react";
export const AuthContext = createContext({
  openUnauthorizedModal: false,
  setOpenUnauthorizedModal: (val: boolean) => console.log(val),
});
