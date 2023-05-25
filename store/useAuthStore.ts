import { getCookie } from "cookies-next";
import { User } from "service/types";
import { create } from "zustand";

interface IAuthStore {
  accessToken: string;
  refreshToken: string;
  user?: User;
  isAdmin: boolean;
  setAuth: (
    val: Partial<{
      accessToken: string;
      refreshToken: string;
      user: User;
      isAdmin: boolean;
    }>
  ) => void;
  reset: () => void;
}

const useAuthStore = create<IAuthStore>((set) => {
  const accessToken = getCookie("accessToken")?.toString() || "";
  const refreshToken = getCookie("refreshToken")?.toString() || "";
  return {
    accessToken: accessToken,
    refreshToken,
    user: undefined,
    isAdmin: false,
    setAuth: (val) => {
      set((state) => ({
        ...state,
        ...val,
        isAdmin: val.user?.email === "contact@letsworkanywhere.com",
      }));
    },
    reset: () => {
      set((state) => ({
        ...state,
        accessToken: "",
        refreshToken: "",
        user: undefined,
      }));
    },
  };
});

export default useAuthStore;
