import { GetServerSidePropsContext } from "next";
import { sendAndHandleRequest } from "utils/api";

export class AuthService {
  static async signIn(payload: { email: string; password: string }) {
    return sendAndHandleRequest("/authentications", "post", payload);
  }

  static async refreshAccessToken(refreshToken: string) {
    return sendAndHandleRequest("/authentications", "put", {
      refresh_token: refreshToken,
    });
  }

  static async logout(refreshToken: string) {
    return sendAndHandleRequest("/authentications", "delete", {
      refresh_token: refreshToken,
    });
  }

  static async fetchMe(ctx?: GetServerSidePropsContext) {
    return sendAndHandleRequest("/users/me", "get", null, ctx);
  }

  static async signUpEmployers(payload: {
    email: string;
    password: string;
    name: string;
  }) {
    return sendAndHandleRequest("/users/employers", "post", payload);
  }

  static async verify(token: string) {
    return sendAndHandleRequest("/users/verify", "post", { token });
  }
}
