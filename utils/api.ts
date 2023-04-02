import axios, { AxiosResponse } from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { AuthService } from "service/auth_service";
import { GetServerSidePropsContext } from "next";
import { axiosInstance } from "config/constants";

export async function sendAndHandleRequest(
  uri: string,
  method: "post" | "get" | "put" | "delete",
  payload: any = {},
  ctx?: GetServerSidePropsContext
) {
  if (ctx)
    return await sendAndHandleServerSideRequest(uri, method, payload, ctx);
  const response: AxiosResponse = await axiosInstance.request({
    method,
    url: uri,
    data: payload,
  });

  const { data, message, page } = response.data;
  return { data, message, page };
}

export async function sendAndHandleServerSideRequest(
  uri: string,
  method: "post" | "get" | "put" | "delete",
  payload: any = {},
  ctx: GetServerSidePropsContext
) {
  const { accessToken } = ctx?.req.cookies;
  const response: AxiosResponse = await axios({
    method,
    url: `${process.env.NEXT_PUBLIC_API_URL}${uri}`,
    data: payload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { data, message, page } = response.data;
  return { data, message, page };
}

export function parseErrorMessage(error: any): string {
  return error?.response?.data?.message || "Something went wrong";
}

export async function handleInvalidToken(
  callback: () => Promise<{ data: any; message: string }>,
  token: any = null
) {
  try {
    const response = await callback();
    return response;
  } catch (e: any) {
    console.log(e);
    if (e.response.status !== 401) {
      throw e;
    }

    const refreshToken = token ?? getCookie("refreshToken");
    const response = await AuthService.refreshAccessToken(refreshToken ?? "");
    if (!response.data.access_token) {
      deleteCookie("token");
      deleteCookie("refreshToken");
    }
    setCookie("accessToken", response.data.access_token);
    return await callback();
  }
}

export async function handleInvalidTokenServerSide(
  callback: () => Promise<{ data: any; message: string }>,
  ctx: GetServerSidePropsContext
) {
  try {
    const response = await callback();
    return response;
  } catch (e: any) {
    console.log(e);
    if (e.response.status !== 401) {
      throw e;
    }

    const refreshToken = getCookie("refreshToken", ctx)?.toString();
    const response = await AuthService.refreshAccessToken(refreshToken ?? "");
    if (!response.data.access_token) {
      if (ctx) {
        deleteCookie("accessToken", ctx);
        deleteCookie("refreshToken", ctx);
      }
      return { data: null, message: "Unauthorized" };
    }
    if (ctx) {
      setCookie("accessToken", response.data.access_token, ctx);
    }
    return await callback();
  }
}

export function getURLSearchParams(payload: any) {
  const params = new URLSearchParams();
  const keys = Object.keys(payload);
  keys.forEach((key) => {
    const val = payload[key];
    if (Array.isArray(val)) {
      val.forEach((item) => {
        params.append(key, item);
      });
    } else {
      params.append(key, val);
    }
  });

  return params.toString();
}
