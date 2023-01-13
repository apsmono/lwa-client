import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Router } from "next/router";
import { AlertContext } from "context/alertContext";
import { Alert } from "components/common";
import { Loader } from "react-feather";

export default function App({ Component, pageProps }: AppProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setLoading(true);
    });
    Router.events.on("routeChangeComplete", (url) => {
      setLoading(false);
    });
  }, []);
  return (
    <AlertContext.Provider
      value={{
        showAlert,
        setShowAlert,
        alertMsg,
        setAlertMsg,
        alertType,
        setAlertType,
      }}
    >
      <Alert msg={alertMsg} type={alertType} show={showAlert} />
      {loading ? (
        <div className="fixed inset-0 w-full h-full flex justify-center items-center z-50 bg-black/30">
          <Loader color="black" />
        </div>
      ) : null}

      <Component {...pageProps} />
    </AlertContext.Provider>
  );
}
