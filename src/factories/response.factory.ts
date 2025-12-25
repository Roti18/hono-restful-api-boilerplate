import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

// Lightweight response factory
export const jsonResponse = (
  c: Context,
  success: boolean,
  data?: any,
  error?: any,
  status: number = 200,
) => {
  return c.json({ success, data, error }, status as any);
};

export const Success = (c: Context, data: any, status: number = 200) =>
  jsonResponse(c, true, data, undefined, status);
export const Error = (c: Context, message: string, status: number = 500) =>
  jsonResponse(c, false, undefined, { message }, status);
