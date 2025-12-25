import sharp from 'sharp'

export const IMAGE_CONFIG = {
  ENABLE_OPTIMIZATION: true,
  TARGET_FORMAT: 'webp' as keyof sharp.FormatEnum,
  QUALITY: 80,
  RESIZE: {
    WIDTH: 800,
    HEIGHT: null,
    FIT: 'cover' as keyof sharp.FitEnum,
  },
}

export const processImage = async (buffer: Buffer): Promise<Buffer> => {
  if (!IMAGE_CONFIG.ENABLE_OPTIMIZATION) {
    return buffer
  }

  let pipeline = sharp(buffer)

  if (IMAGE_CONFIG.RESIZE.WIDTH) {
    pipeline = pipeline.resize({
      width: IMAGE_CONFIG.RESIZE.WIDTH,
      height: IMAGE_CONFIG.RESIZE.HEIGHT || undefined,
      fit: IMAGE_CONFIG.RESIZE.FIT,
    })
  }

  pipeline = pipeline.toFormat(IMAGE_CONFIG.TARGET_FORMAT, {
    quality: IMAGE_CONFIG.QUALITY,
  })

  return await pipeline.toBuffer()
}

export const validateImage = (mimeType: string, size: number) => {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const MAX_SIZE = 5 * 1024 * 1024

  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`)
  }

  if (size > MAX_SIZE) {
    throw new Error(`File too large. Max: ${MAX_SIZE / 1024 / 1024}MB`)
  }

  return true
}
