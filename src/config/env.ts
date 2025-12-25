import { envSchema } from '../types/env.d'
import 'dotenv/config'

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 4))
}

export const env = parsed.success ? parsed.data : (process.env as any)
