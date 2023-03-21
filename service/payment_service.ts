import { sendAndHandleRequest } from "utils/api";

export default class PaymentService {
  static async getClientToken() {
    return sendAndHandleRequest(`/payments/client-token`, "get");
  }

  static async createOrder(packageId: number) {
    return sendAndHandleRequest("/payments/order", "post", {
      package_id: packageId,
    });
  }
}
