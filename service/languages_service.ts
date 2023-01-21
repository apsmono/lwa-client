import { sendAndHandleRequest } from "utils/api";

export default class LanguageService {
  static async gets(payload = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/languages?${params}`, "get");
  }

  static async get(id: number) {
    return sendAndHandleRequest(`/languages/${id}`, "get");
  }
}
