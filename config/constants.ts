import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers!["Authorization"] = `Bearer ${Cookies.get("accessToken")}`;
  return config;
});

export { axiosInstance };
