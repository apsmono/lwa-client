import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Router } from "next/router";
import { AlertContext } from "context/alertContext";
import { Alert, Loader, UnauthorizedModal } from "components/common";
import { AppContext } from "context/appContext";
import { AuthContext } from "context/authContext";
import useAuthStore from "store/useAuthStore";
import { AuthService } from "service/auth_service";
import CategoryService from "service/category_service";
import useAppStore from "store/useAppStore";
import { Category } from "service/types";
import { Page } from "types/page";
import { GuestLayout } from "components/layout";

type Props = AppProps & {
  Component: Page;
};

export default function App({ Component, pageProps }: Props) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState();
  const [loading, setLoading] = useState(false);
  const [openUnauthorizedModal, setOpenUnauthorizedModal] = useState(false);
  const { accessToken, setAuth } = useAuthStore();
  const { setAppState } = useAppStore();
  const getLayout =
    Component.getLayout || ((page) => <GuestLayout>{page}</GuestLayout>);
  useEffect(() => {
    let active = true;

    (async () => {
      const response = await CategoryService.gets();
      if (!active) return;
      const categoriesCopy = [...response.data];
      const otherCategory = categoriesCopy.filter(
        (item: Category) => item.name === "Other"
      )[0];
      const categoriesWithoutOther = categoriesCopy.filter(
        (item: Category) => item.name !== "Other"
      );
      if (otherCategory) categoriesWithoutOther.push(otherCategory);
      setAppState({ categories: categoriesWithoutOther });
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const response = await AuthService.fetchMe();
      if (!active) return;
      setAuth({ user: response.data.user });
    };

    if (accessToken) fetchData();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setLoading(true);
    });
    Router.events.on("routeChangeComplete", (url) => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) {
      document.querySelector("body")!.style.overflowY = "hidden";
    } else {
      document.querySelector("body")!.style.overflowY = "auto";
    }
  }, [loading]);
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
        <div className="fixed inset-0 w-full h-full flex justify-center items-center z-[60] bg-black/30">
          <Loader color="black" />
        </div>
      ) : null}

      <AuthContext.Provider
        value={{ setOpenUnauthorizedModal, openUnauthorizedModal }}
      >
        <AppContext.Provider value={{ loading, setLoading }}>
          {getLayout(<Component {...pageProps} />)}
          <UnauthorizedModal open={openUnauthorizedModal} />
        </AppContext.Provider>
      </AuthContext.Provider>
    </AlertContext.Provider>
  );
}
