import { sendAndHandleRequest } from "utils/api";

export default class JobIndustryService {
  static async gets(payload = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/job-industries?${params}`, "get");
  }

  static async get(id: number) {
    return sendAndHandleRequest(`/job-industries/${id}`, "get");
  }
}
