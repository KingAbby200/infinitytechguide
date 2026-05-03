/**
 * Calculate estimated reading time from HTML content
 * @param {string} html
 * @returns {number} minutes (minimum 1)
 */
export function calculateReadingTime(html) {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/**
 * Generate excerpt from HTML content
 * @param {string} html
 * @param {number} maxLength
 */
export function generateExcerpt(html, maxLength = 160) {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? text.slice(0, maxLength).trim() + '…' : text
}