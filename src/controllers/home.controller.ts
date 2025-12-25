import { Context } from 'hono'

export const landingPage = (c: Context) => {
  return c.json({
    message: 'Welcome to Hono Security API',
    docs: '/docs/index.html',
    db: '/admin/db',
    version: '1.0.0',
  })
}
