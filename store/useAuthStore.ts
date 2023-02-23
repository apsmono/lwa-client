import Cookies from "js-cookie";
import { create } from "zustand";

interface IAuthStore {
  accessToken: string;
  refreshToken: string;
  setAuth: (val: { accessToken: string; refreshToken: string }) => void;
}

const useAuthStore = create<IAuthStore>((set) => {
  const accessToken = Cookies.get("accessToken") || "";
  const refreshToken = Cookies.get("refreshToken") || "";
  return {
    accessToken: accessToken,
    refreshToken,
    setAuth: (val) => {
      set((state) => ({
        ...state,
        ...val,
      }));
    },
  };
});

export default useAuthStore;
