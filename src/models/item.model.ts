import { db } from "../config/database";
import { uuid } from "../utils/uuid";
import { ItemRow } from "../tables/all";

export const findAll = async (): Promise<ItemRow[]> => {
  const rs = await db.execute("SELECT * FROM items ORDER BY created_at DESC");
  return rs.rows as unknown as ItemRow[];
};

export const findById = async (id: string): Promise<ItemRow | null> => {
  const rs = await db.execute({
    sql: "SELECT * FROM items WHERE id = ?",
    args: [id],
  });
  return (rs.rows[0] as unknown as ItemRow) || null;
};

export const create = async (
  name: string,
  description?: string,
  imageUrl?: string,
): Promise<ItemRow> => {
  const id = uuid();
  await db.execute({
    sql: "INSERT INTO items (id, name, description, image_url) VALUES (?, ?, ?, ?)",
    args: [id, name, description || null, imageUrl || null],
  });
  return findById(id) as Promise<ItemRow>;
};
