import { AlertContext } from "context/alertContext";
import { useContext, useMemo } from "react";

export default function useAlert() {
  const { setAlertMsg, setShowAlert, setAlertType } = useContext(AlertContext);

  const methods = useMemo(() => {
    const showAlert = (msg: string, type: string) => {
      setAlertType(type);
      setAlertMsg(msg);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    };
    const showSuccessAlert = (msg: string) => {
      showAlert(msg, "success");
    };
    const showErrorAlert = (msg: string) => {
      showAlert(msg, "error");
    };

    return { showSuccessAlert, showErrorAlert };
  }, [setAlertMsg, setAlertType, setShowAlert]);

  return methods;
}
