import { sendAndHandleRequest } from "utils/api";

export default class BlogService {
  static async gets(payload: any = {}) {
    const params = new URLSearchParams(payload).toString();
    return sendAndHandleRequest(`/blogs?${params}`, "get");
  }

  static async get(slug: string) {
    return sendAndHandleRequest(`/blogs/${slug}`, "get");
  }
}
