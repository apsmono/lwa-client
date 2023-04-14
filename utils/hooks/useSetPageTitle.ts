import useAppStore from "store/useAppStore";

const useSetPageTitle = (title: string) => {
  const { setAppState } = useAppStore();
  setAppState({ title });
};

export default useSetPageTitle;
