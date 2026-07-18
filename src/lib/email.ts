import { Resend } from 'resend'
import { logEmail } from '@/lib/leads-db'

let resend: Resend | null = null

function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured. Get one at resend.com — free tier: 100 emails/day.')
    }
    resend = new Resend(apiKey)
  }
  return resend
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://infinite-gundawar-webapp.vercel.app'
const PDF_URL = `${APP_URL}/downloads/business-starter-kit.pdf`

export async function sendVerificationEmail(leadId: string, name: string, email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/leads/verify?token=${token}`
  const firstName = name.split(' ')[0] || 'there'

  try {
    const r = await getResend().emails.send({
      from: `Infinite Gundawar <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your email — Your Business Starter Kit is ready!',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
  <tr><td style="padding:40px 20px;text-align:center;background:linear-gradient(135deg,#4F46E5,#7C3AED);">
    <h1 style="color:white;margin:0;font-size:28px;">Infinite Gundawar</h1>
  </td></tr>
  <tr><td style="padding:40px 30px;background:white;">
    <h2 style="color:#1E293B;margin-top:0;">Hi ${firstName}! 👋</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;">Thank you for downloading our <strong>Business Starter Kit</strong>. We're excited to help you grow your business!</p>
    <p style="color:#475569;font-size:16px;line-height:1.6;">Please verify your email to get instant access to your free kit:</p>
    <div style="text-align:center;margin:30px 0;">
      <a href="${verifyUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;text-decoration:none;border-radius:12px;font-size:18px;font-weight:700;">Verify & Download Kit</a>
    </div>
    <p style="color:#64748B;font-size:14px;">Or copy this link: <a href="${verifyUrl}" style="color:#4F46E5;">${verifyUrl}</a></p>
    <div style="background:#F1F5F9;border-radius:12px;padding:20px;margin-top:24px;">
      <h3 style="color:#1E293B;margin-top:0;font-size:16px;">📦 What's in your kit:</h3>
      <ul style="color:#475569;font-size:14px;padding-left:20px;">
        <li>Business Registration Checklist</li>
        <li>Financial Planning Templates</li>
        <li>Marketing Plan Framework</li>
        <li>Legal Compliance Guide for India</li>
        <li>50+ Cold Email Templates</li>
        <li>Sales Pitch Deck Outline</li>
        <li>Social Media Content Calendar</li>
        <li>Vendor & Client Agreement Templates</li>
        <li>GST & Tax Planning Guide</li>
        <li>Hiring & HR Checklist</li>
      </ul>
    </div>
  </td></tr>
  <tr><td style="padding:20px 30px;text-align:center;background:#F8FAFC;">
    <p style="color:#94A3B8;font-size:12px;">Infinite Gundawar Business Private Limited<br>+91 79721 40672 | talenthebhai123@gmail.com<br><a href="${APP_URL}" style="color:#4F46E5;">${APP_URL}</a></p>
  </td></tr>
</table>
</body>
</html>`,
    })
    logEmail(leadId, email, 'verification', 'sent')
    return { success: true, id: r.data?.id }
  } catch (err: any) {
    logEmail(leadId, email, 'verification', 'failed', err.message)
    throw err
  }
}

export async function sendWelcomeEmail(leadId: string, name: string, email: string) {
  const firstName = name.split(' ')[0] || 'there'

  try {
    const r = await getResend().emails.send({
      from: `Infinite Gundawar <${FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome! Here\'s your Business Starter Kit 📦',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
  <tr><td style="padding:40px 20px;text-align:center;background:linear-gradient(135deg,#4F46E5,#7C3AED);">
    <h1 style="color:white;margin:0;font-size:28px;">Infinite Gundawar</h1>
  </td></tr>
  <tr><td style="padding:40px 30px;background:white;">
    <h2 style="color:#1E293B;margin-top:0;">Welcome, ${firstName}! 🎉</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;">Your email is verified and your Business Starter Kit is ready to download.</p>
    <div style="text-align:center;margin:30px 0;">
      <a href="${PDF_URL}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;text-decoration:none;border-radius:12px;font-size:18px;font-weight:700;">Download Business Starter Kit (PDF)</a>
    </div>
    <p style="color:#64748B;font-size:14px;text-align:center;">Direct link: <a href="${PDF_URL}" style="color:#4F46E5;">${PDF_URL}</a></p>
    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin-top:24px;">
      <h3 style="color:#166534;margin-top:0;font-size:16px;">💡 Quick Start Tips:</h3>
      <ol style="color:#166534;font-size:14px;padding-left:20px;">
        <li>Start with the Business Registration Checklist</li>
        <li>Set up your Financial Planning Templates in Excel</li>
        <li>Customize the Marketing Plan for your industry</li>
        <li>Review the Legal Compliance Guide with your CA</li>
      </ol>
    </div>
    <p style="color:#475569;font-size:14px;margin-top:24px;">Need help? Reply to this email or call us at <strong>+91 79721 40672</strong>.</p>
  </td></tr>
  <tr><td style="padding:20px 30px;text-align:center;background:#F8FAFC;">
    <p style="color:#94A3B8;font-size:12px;">Infinite Gundawar Business Private Limited<br>+91 79721 40672 | talenthebhai123@gmail.com</p>
  </td></tr>
</table>
</body>
</html>`,
    })
    logEmail(leadId, email, 'welcome', 'sent')
    return { success: true, id: r.data?.id }
  } catch (err: any) {
    logEmail(leadId, email, 'welcome', 'failed', err.message)
    throw err
  }
}

export async function sendNewsletterWelcome(leadId: string, name: string, email: string) {
  const firstName = name.split(' ')[0] || 'there'

  try {
    const r = await getResend().emails.send({
      from: `Infinite Gundawar <${FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to the Infinite Gundawar newsletter! 🚀',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
  <tr><td style="padding:40px 20px;text-align:center;background:linear-gradient(135deg,#4F46E5,#7C3AED);">
    <h1 style="color:white;margin:0;font-size:28px;">Infinite Gundawar</h1>
  </td></tr>
  <tr><td style="padding:40px 30px;background:white;">
    <h2 style="color:#1E293B;margin-top:0;">Hi ${firstName}! 👋</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;">You're now subscribed to our newsletter. Expect:</p>
    <ul style="color:#475569;font-size:15px;padding-left:20px;">
      <li>Weekly business growth tips</li>
      <li>New AI tools & resources</li>
      <li>Indian market insights</li>
      <li>Exclusive offers & early access</li>
    </ul>
    <p style="color:#475569;font-size:16px;">We send 1-2 emails per week. No spam, ever. Unsubscribe anytime.</p>
  </td></tr>
  <tr><td style="padding:20px 30px;text-align:center;background:#F8FAFC;">
    <p style="color:#94A3B8;font-size:12px;">Infinite Gundawar | +91 79721 40672</p>
  </td></tr>
</table>
</body>
</html>`,
    })
    logEmail(leadId, email, 'newsletter-welcome', 'sent')
    return { success: true }
  } catch (err: any) {
    logEmail(leadId, email, 'newsletter-welcome', 'failed', err.message)
    throw err
  }
}
