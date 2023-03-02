import { getURLSearchParams, sendAndHandleRequest } from "utils/api";

export default class JobService {
  static async gets(payload: any = {}) {
    const params = getURLSearchParams(payload);
    return sendAndHandleRequest(`/jobs?${params}`, "get");
  }

  static async getSimilarJobs(companyId: number) {
    return sendAndHandleRequest(`/jobs/${companyId}/similar`, "get");
  }

  static async get(id: number) {
    return sendAndHandleRequest(`/jobs/${id}`, "get");
  }

  static async create(formData: any) {
    return sendAndHandleRequest(`/jobs`, "post", formData);
  }

  static async createTemp(payload: any) {
    return sendAndHandleRequest("/jobs/temp", "post", payload);
  }

  static async getJobTemp(token: string) {
    return sendAndHandleRequest(`/jobs/temp/${token}`, "get");
  }
}
