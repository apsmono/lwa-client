import { sendAndHandleRequest } from "utils/api";

export default class JobSalaryService {
  static async gets(payload = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/jobs/salaries?${params}`, "get");
  }
}
