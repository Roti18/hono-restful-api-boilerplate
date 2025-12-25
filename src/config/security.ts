import { env } from './env'

export const securityConfig = {
  bcryptRounds: 10,
  jwtSecret: env.API_SECRET || 'secret',
  tokenLife: 3600,
  refreshTokenLife: 86400,
}
