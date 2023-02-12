import { axiosInstance } from "config/constants";
import axios, { AxiosResponse } from "axios";
import { GetServerSidePropsContext } from "next";
import Cookies from "js-cookie";
import { AuthService } from "service/auth_service";

export async function sendAndHandleRequest(
  uri: string,
  method: "post" | "get" | "put" | "delete",
  payload: any = {},
  ctx?: GetServerSidePropsContext
) {
  if (ctx) return sendAndHandleServerSideRequest(uri, method, payload, ctx);
  const response: AxiosResponse = await axiosInstance.request({
    method,
    url: uri,
    data: payload,
  });

  const { data, message, page } = response.data;
  return { data, message, page };
}

export function parseErrorMessage(error: any): string {
  return error?.response?.data?.message || "Something went wrong";
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

export async function handleInvalidToken(
  callback: () => Promise<{ data: any; message: string }>
) {
  try {
    const response = await callback();
    return response;
  } catch (e: any) {
    console.log(e);
    if (e.response.status !== 401) {
      throw e;
    }

    const refreshToken = Cookies.get("refreshToken");
    const response = await AuthService.refreshAccessToken(refreshToken ?? "");
    if (!response.data.access_token) {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    }
    Cookies.set("accessToken", response.data.access_token);
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
    if (e.response.status !== 401) {
      throw e;
    }

    const refreshToken =
      ctx.req.cookies.refreshToken ?? Cookies.get("refreshToken");
    const response = await AuthService.refreshAccessToken(refreshToken ?? "");
    if (!response.data.access_token) {
      if (ctx) {
        ctx.res.setHeader("set-cookie", [
          "accessToken=1;max-age=-1",
          "refreshToken=1;max-age=-1",
        ]);
      }
      return { data: null, message: "Unauthorized" };
    }
    console.log(response.data.access_token);
    if (ctx) {
      ctx.res.setHeader("set-cookie", [
        `accessToken=${response.data.access_token};path=/`,
      ]);
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
