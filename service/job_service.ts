import { sendAndHandleRequest } from "utils/api";

export default class JobService {
  static async gets(payload: any = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/jobs?${params}`, "get");
  }
}
