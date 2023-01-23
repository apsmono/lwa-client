import { AuthContext } from "context/authContext";
import { useCallback, useContext } from "react";
import { handleInvalidToken } from "utils/api";

const useWrapHandleInvalidToken = (
  callback: (...args: any) => Promise<{ data: any; message: string }>
) => {
  const { setOpenUnauthorizedModal } = useContext(AuthContext);

  const wrappedCallback = useCallback(
    async (...args: any) => {
      try {
        return handleInvalidToken(() => callback(...args));
      } catch (e: any) {
        setOpenUnauthorizedModal(true);
        return (
          e?.response?.data || {
            data: null,
            message: "Something went wrong",
          }
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback]
  );

  return wrappedCallback;
};

export default useWrapHandleInvalidToken;
