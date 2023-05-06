import { GetServerSidePropsContext } from "next";
import { sendAndHandleRequest } from "utils/api";

export class AuthService {
  static async signIn(payload: { email: string; password: string }) {
    return sendAndHandleRequest("/authentications", "post", payload);
  }

  static signInByRegistrationToken(token: string) {
    return sendAndHandleRequest("/authentications/registration-token", "post", {
      token,
    });
  }

  static async refreshAccessToken(refreshToken: string) {
    return sendAndHandleRequest("/authentications", "put", {
      refresh_token: refreshToken,
    });
  }

  static async forgotPassword(email: string) {
    return sendAndHandleRequest("/authentications/forgot-password", "post", {
      email,
    });
  }

  static async verifyResetPasswordToken(token: string) {
    return sendAndHandleRequest(
      `/authentications/forgot-password/${token}/verify`,
      "post"
    );
  }

  static async resetPassword(payload: any) {
    return sendAndHandleRequest(
      "/authentications/reset-password",
      "post",
      payload
    );
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
