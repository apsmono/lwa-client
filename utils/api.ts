import { axiosInstance } from "config/constants";
import { AxiosResponse } from "axios";

export async function sendAndHandleRequest(
  uri: string,
  method: "post" | "get" | "put" | "delete",
  payload: any = {}
) {
  const response: AxiosResponse = await axiosInstance.request({
    method,
    url: uri,
    data: payload,
  });

  const { data, message, page } = response.data;
  return { data, message, page };
}
