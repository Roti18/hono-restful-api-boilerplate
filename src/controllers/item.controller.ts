import { Context } from "hono";
import * as model from "../models/item.model";
import { Success, Error } from "../factories/response.factory";

export const list = async (c: Context) => {
  const items = await model.findAll();
  return Success(c, items);
};

export const get = async (c: Context) => {
  const id = c.req.param("id");
  const item = await model.findById(id);
  if (!item) return Error(c, "Not Found", 404);
  return Success(c, item);
};

export const create = async (c: Context) => {
  const body = await c.req.json();
  const item = await model.create(body.name, body.description);
  return Success(c, item, 201);
};
