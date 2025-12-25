import { Context, Next } from "hono";
import { secureHeaders } from "hono/secure-headers";

export const securityHeadersMockSelector = secureHeaders();

export const securityHardening = async (c: Context, next: Next) => {
  if (["POST", "PUT", "PATCH"].includes(c.req.method)) {
    const contentType = c.req.header("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      // logic for content type check override or strictness
    }
  }

  await next();

  c.res.headers.delete("X-Powered-By");
};
