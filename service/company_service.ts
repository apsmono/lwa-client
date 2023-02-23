import { sendAndHandleRequest } from "utils/api";

export default class CompanyService {
  static async gets(payload = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/companies?${params}`, "get");
  }

  static async uploadLogo(payload: FormData) {
    return sendAndHandleRequest("/companies/logo", "post", payload);
  }

  static async get(id: number) {
    return sendAndHandleRequest(`/companies/${id}`, "get");
  }
}
