/**
 * Build a WhatsApp URL pre-filled with cart + customer info
 */
export function buildWhatsAppURL(cart, { name, address, phone }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  const itemLines = cart
    .map(item => `  • ${item.name} × ${item.qty}  —  ₦${(item.price * item.qty).toLocaleString()}`)
    .join('\n')

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const message = [
    '🛒 *New Order — Infinity Tech Guide*',
    '',
    `*Customer:* ${name}`,
    `*Phone:* ${phone}`,
    `*Address:* ${address}`,
    '',
    '*Items:*',
    itemLines,
    '',
    `*Total: ₦${total.toLocaleString()}*`,
    '',
    '_Sent via InfinityTechGuide.com_',
  ].join('\n')

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}