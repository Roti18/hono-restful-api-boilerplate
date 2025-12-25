import { serve } from '@hono/node-server'
import { initDB } from './config/database'
import { env } from './config/env'
import app from './app'

const start = async () => {
  try {
    await initDB()
    console.log('[INFO] Database connected & synced')
  } catch (e) {
    console.error('[ERROR] Database init failed', e)
  }

  const port = Number(env.PORT) || 3000
  console.log(`[INFO] Security API running on http://localhost:${port}`)

  if (env.NODE_ENV === 'development') {
    console.log(`[INFO] Local DB Viewer: http://localhost:${port}/admin/db`)
  }

  serve({
    fetch: app.fetch,
    port,
  })
}

start()
