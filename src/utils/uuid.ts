/**
 * Cryptographically secure UUID v4
 */
export const uuid = (): string => crypto.randomUUID()

/**
 * Generate a random secure string (hex)
 */
export const randomString = (length = 32): string => {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
