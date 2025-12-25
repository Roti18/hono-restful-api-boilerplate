import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const tokenSchema = z.object({
  grant_type: z.enum(['client_credentials', 'password']),
  client_id: z.string(),
  client_secret: z.string(),
  scope: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
})
