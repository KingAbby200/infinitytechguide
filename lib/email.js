import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
})

/**
 * Send a single email
 */
export async function sendEmail({ to, subject, html, text }) {
  return transporter.sendMail({
    from:    process.env.EMAIL_FROM || 'Infinity Tech Guide <noreply@infinitytechguide.com>',
    to,
    subject,
    html,
    text,
  })
}

/**
 * Send newsletter to many recipients in batches to avoid SMTP limits
 */
export async function sendBulkEmail({ recipients, subject, html, batchSize = 20, delayMs = 1000 }) {
  const results = { sent: 0, failed: 0, errors: [] }

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize)

    await Promise.allSettled(
      batch.map(async (recipient) => {
        try {
          await sendEmail({ to: recipient.email, subject, html: recipient.html || html })
          results.sent++
        } catch (err) {
          results.failed++
          results.errors.push({ email: recipient.email, error: err.message })
        }
      })
    )

    // Pause between batches
    if (i + batchSize < recipients.length) {
      await new Promise(r => setTimeout(r, delayMs))
    }
  }

  return results
}

/**
 * Generate unsubscribe footer HTML
 */
export function unsubscribeFooter(token, baseUrl) {
  const url = `${baseUrl}/newsletter/unsubscribe?token=${token}`
  return `
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #222;text-align:center;font-family:sans-serif;font-size:13px;color:#666;">
      <p>You're receiving this because you subscribed to Infinity Tech Guide.</p>
      <p><a href="${url}" style="color:#00D46A;">Unsubscribe</a></p>
    </div>
  `
}