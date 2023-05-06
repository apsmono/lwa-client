import { sendAndHandleRequest } from "utils/api";

export default class CompanySizeService {
  static async gets(payload: any = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/company-sizes?${params}`, "get");
  }
}
