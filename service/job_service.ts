import { getURLSearchParams, sendAndHandleRequest } from "utils/api";

export default class JobService {
  static async gets(payload: any = {}) {
    const params = getURLSearchParams(payload);
    return sendAndHandleRequest(`/jobs?${params}`, "get");
  }

  static async getSimilarJobs(companyId: number) {
    return sendAndHandleRequest(`/jobs/${companyId}/similar`, "get");
  }

  static async get(slug: string) {
    return sendAndHandleRequest(`/jobs/${slug}`, "get");
  }

  static async create(formData: any) {
    return sendAndHandleRequest(`/jobs`, "post", formData);
  }

  static async update(id: number, payload: any) {
    return sendAndHandleRequest(`/jobs/${id}`, "put", payload);
  }

  static async createTemp(payload: any) {
    return sendAndHandleRequest("/jobs/temp", "post", payload);
  }

  static async getJobTemp(token: string) {
    return sendAndHandleRequest(`/jobs/temp/${token}`, "get");
  }

  static async deleteJob(jobId: number) {
    return sendAndHandleRequest(`/jobs/${jobId}`, "delete");
  }

  static async pauseJob(jobId: number) {
    return sendAndHandleRequest(`/jobs/${jobId}/pause`, "put");
  }
}
