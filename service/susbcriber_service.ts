import { sendAndHandleRequest } from "utils/api";

export default class SubscriberService {
  static async create(payload: { email: string; category_id: number }) {
    return sendAndHandleRequest("/subscribers", "post", payload);
  }
}
