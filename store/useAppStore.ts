import { Category } from "service/types";
import { create } from "zustand";

interface AppState {
  title: string;
  categories: Category[];
}

interface IAppState extends AppState {
  setAppState: (val: Partial<AppState>) => void;
}

const useAppStore = create<IAppState>((set) => {
  return {
    title: "",
    categories: [],
    setAppState(val) {
      set((state) => ({
        ...state,
        ...val,
      }));
    },
  };
});

export default useAppStore;
