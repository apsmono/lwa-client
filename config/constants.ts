import axios from "axios";
import { getCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers!["Authorization"] = `Bearer ${getCookie("accessToken")}`;
  return config;
});

export { axiosInstance };
