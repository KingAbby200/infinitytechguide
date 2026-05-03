import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload a Buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {string} folder  e.g. 'posts', 'products', 'avatars'
 * @returns {Promise<string>} secure_url
 */
export async function uploadImage(buffer, folder = 'general') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:        `infinity-tech-guide/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

/**
 * Delete image by public_id
 */
export async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId)
}

export default cloudinary