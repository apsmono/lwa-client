import { sendAndHandleRequest } from "utils/api";

export default class EmploymentTypeService {
  static async gets(payload = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/employment-types?${params}`, "get");
  }

  static async get(id: number) {
    return sendAndHandleRequest(`/employment-types/${id}`, "get");
  }
}
