import { GetServerSidePropsContext } from "next";
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

  static async getCompanyJobs(id: number, payload = {}) {
    const params = new URLSearchParams(payload).toString();

    return sendAndHandleRequest(`/companies/${id}/jobs?${params}`, "get");
  }

  static async getOrderSummary(
    company_id: number,
    ctx?: GetServerSidePropsContext
  ) {
    return sendAndHandleRequest(
      `/companies/${company_id}/order/summary`,
      "get",
      null,
      ctx
    );
  }
}
