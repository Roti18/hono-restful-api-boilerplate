import { create } from '../models/item.model'

const seed = async () => {
  console.log('[INFO] Seeding database...')
  try {
    const item = await create('Test Item', 'This is a test item created by seed script.')
    console.log('[INFO] Created Item:', item)
  } catch (e) {
    console.error('[ERROR] Encountered error:', e)
  }
}

seed()
