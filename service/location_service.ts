import { sendAndHandleRequest } from "utils/api";

export default class LocationService {
  static async gets(payload = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/job-locations?${params}`, "get");
  }

  static async get(id: number) {
    return sendAndHandleRequest(`/job-locations/${id}`, "get");
  }
}
