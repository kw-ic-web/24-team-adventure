//google.ts
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../config/keys";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// 구글의 OAuth2 인증 서버에서 받은 ID 토큰을 검증
export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Error verifying Google token", error);
    throw new Error("Invalid token");
  }
};
