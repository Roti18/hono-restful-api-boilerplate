import { db } from '../config/database'
import { uuid } from '../utils/uuid'

export type UserRow = {
  id: string
  email: string
  password_hash: string
  role: string
  created_at: string
}

export const findByEmail = async (email: string): Promise<UserRow | null> => {
  const rs = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email],
  })
  return (rs.rows[0] as unknown as UserRow) || null
}

export const create = async (email: string, passwordHash: string): Promise<UserRow> => {
  const id = uuid()
  await db.execute({
    sql: 'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
    args: [id, email, passwordHash],
  })
  return {
    id,
    email,
    password_hash: passwordHash,
    role: 'user',
    created_at: new Date().toISOString(),
  }
}
