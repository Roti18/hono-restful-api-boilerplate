import { Context } from "hono";
import { Error as ErrorResponse } from "../factories/response.factory";

export const globalErrorHandler = (err: any, c: Context) => {
  console.error(err);
  const msg =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;
  return ErrorResponse(c, msg, 500);
};
