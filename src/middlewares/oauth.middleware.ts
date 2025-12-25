import { Context, Next } from "hono";
import { Error } from "../factories/response.factory";
import * as crypto from "../utils/crypto";
import * as oauthModel from "../models/oauth.model";

export const oauthMiddleware = async (c: Context, next: Next) => {
  const auth = c.req.header("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return await next();
  }

  const token = auth.split(" ")[1];
  const hashed = await crypto.hash(token);

  const record = await oauthModel.findByAccessToken(hashed);

  if (!record) {
    return Error(c, "Invalid Access Token", 401);
  }

  if (new Date(record.expires_at) < new Date()) {
    return Error(c, "Token Expired", 401);
  }

  // Set user context
  c.set("user", {
    id: record.user_id,
    clientId: record.client_id,
    scopes: record.scopes ? record.scopes.split(",") : [],
  });

  await next();
};
