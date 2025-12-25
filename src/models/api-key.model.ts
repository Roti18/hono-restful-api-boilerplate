import { db } from '../config/database'

export type ApiKeyRow = {
  id: string
  key_hash: string
  user_id: string
  scopes: string
  expires_at: string | null
}

export const findByHash = async (hash: string): Promise<ApiKeyRow | null> => {
  const rs = await db.execute({
    sql: 'SELECT * FROM api_keys WHERE key_hash = ?',
    args: [hash],
  })
  return (rs.rows[0] as unknown as ApiKeyRow) || null
}
