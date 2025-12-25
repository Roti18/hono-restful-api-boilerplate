import { db } from '../config/database'
import { uuid } from '../utils/uuid'

export type OAuthTokenRow = {
  id: string
  access_token_hash: string
  refresh_token_hash: string
  client_id: string
  user_id: string | null
  scopes: string | null
  expires_at: string
}

export const storeToken = async (
  accessTokenHash: string,
  refreshTokenHash: string,
  clientId: string,
  expiresAt: Date,
  userId?: string,
  scopes?: string
) => {
  const id = uuid()
  await db.execute({
    sql: `INSERT INTO oauth_tokens (id, access_token_hash, refresh_token_hash, client_id, user_id, scopes, expires_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      accessTokenHash,
      refreshTokenHash,
      clientId,
      userId || null,
      scopes || null,
      expiresAt.toISOString(),
    ],
  })
  return id
}

export const findByAccessToken = async (hash: string): Promise<OAuthTokenRow | null> => {
  const rs = await db.execute({
    sql: 'SELECT * FROM oauth_tokens WHERE access_token_hash = ?',
    args: [hash],
  })
  return (rs.rows[0] as unknown as OAuthTokenRow) || null
}
