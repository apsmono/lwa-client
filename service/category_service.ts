import { sendAndHandleRequest } from "utils/api";

export default class CategoryService {
  static async gets(payload: any = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/categories?${params}`, "get");
  }

  static async get(id: number) {
    return sendAndHandleRequest(`/categories/${id}`, "get");
  }
}
