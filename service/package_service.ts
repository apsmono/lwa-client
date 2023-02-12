import { sendAndHandleRequest } from "utils/api";

export default class PackageService {
  static async gets(payload = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/packages?${params}`, "get");
  }

  static async get(id: number) {
    return sendAndHandleRequest(`/packages/${id}`, "get");
  }
}
