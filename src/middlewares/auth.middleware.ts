import { Context, Next } from 'hono'
import { Error } from '../factories/response.factory'

export const protect = async (c: Context, next: Next) => {
  const user = c.get('user')
  if (!user) {
    return Error(c, 'Unauthorized', 401)
  }
  await next()
}
