import { getCookie } from "cookies-next";
import { create } from "zustand";

interface IAuthStore {
  accessToken: string;
  refreshToken: string;
  setAuth: (val: { accessToken: string; refreshToken: string }) => void;
}

const useAuthStore = create<IAuthStore>((set) => {
  const accessToken = getCookie("accessToken")?.toString() || "";
  const refreshToken = getCookie("refreshToken")?.toString() || "";
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
