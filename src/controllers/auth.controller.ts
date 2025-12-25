import { Context } from "hono";
import * as oauthModel from "../models/oauth.model";
import * as uuid from "../utils/uuid";
import * as crypto from "../utils/crypto";
import { Success, Error } from "../factories/response.factory";
import { tokenSchema } from "../validations/auth.validation";

export const token = async (c: Context) => {
  const body = await c.req.parseBody();

  const check = tokenSchema.safeParse(body);
  if (!check.success) {
    return Error(c, "Invalid Request", 400);
  }

  const { grant_type, client_id, client_secret } = check.data;

  if (client_secret !== "demo_secret") {
    return Error(c, "Invalid Client Credentials", 401);
  }

  const accessToken = uuid.randomString(64);
  const refreshToken = uuid.randomString(64);

  const accessHash = await crypto.hash(accessToken);
  const refreshHash = await crypto.hash(refreshToken);

  const expires = new Date();
  expires.setSeconds(expires.getSeconds() + 3600);

  await oauthModel.storeToken(
    accessHash,
    refreshHash,
    client_id,
    expires,
    undefined,
    "read,write",
  );

  return Success(c, {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: refreshToken,
  });
};
