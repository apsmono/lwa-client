import { sendAndHandleRequest } from "utils/api";

export class UserService {
  static async update(payload: any) {
    return sendAndHandleRequest("/users", "put", payload);
  }
}
