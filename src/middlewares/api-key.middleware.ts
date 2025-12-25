import { Context, Next } from 'hono'
import { Error } from '../factories/response.factory'
import * as crypto from '../utils/crypto'
import * as apiKeyModel from '../models/api-key.model'

export const apiKeyMiddleware = async (c: Context, next: Next) => {
  const key = c.req.header('X-API-Key')

  if (!key) {
    return await next()
  }

  const hashed = await crypto.hash(key)
  const record = await apiKeyModel.findByHash(hashed)

  if (!record) {
    return Error(c, 'Invalid API Key', 401)
  }

  if (record.expires_at && new Date(record.expires_at) < new Date()) {
    return Error(c, 'API Key Expired', 401)
  }

  c.set('user', { id: record.user_id, role: 'user', scopes: record.scopes.split(',') })
  await next()
}
