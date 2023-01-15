import { createContext } from "react";

const AppContext = createContext({
  loading: false,
  setLoading: (val: boolean) => {},
});

export { AppContext };
