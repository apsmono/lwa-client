import { createContext } from "react";

const AlertContext = createContext({
  showAlert: false,
  setShowAlert: (val: boolean) => {},
  alertMsg: "",
  setAlertMsg: (val: string) => {},
  alertType: undefined,
  setAlertType: (val: any) => {},
});

export { AlertContext };
