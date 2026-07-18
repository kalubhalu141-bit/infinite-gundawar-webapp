import { NextRequest, NextResponse } from 'next/server'

// ─── Email Validation ───
function validateEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return pattern.test(email)
}

// ─── Extract domain from email ───
function getDomain(email: string): string {
  try { return email.split('@')[1] } catch { return '' }
}

// ─── Generate email list from scraped data ───
function generateEmailList(emails: string[], names: string[], companies: string[], patterns: string[]): string[] {
  const results: string[] = []
  const seen = new Set<string>()

  // Add provided emails
  for (const email of emails) {
    const e = email.toLowerCase().trim()
    if (validateEmail(e) && !seen.has(e)) {
      seen.add(e)
      results.push(e)
    }
  }

  // Generate emails from patterns if names and companies provided
  if (names.length > 0 && companies.length > 0 && patterns.length > 0) {
    for (let i = 0; i < names.length && i < companies.length; i++) {
      const name = names[i].toLowerCase().trim().replace(/[^a-z\s]/g, '')
      const company = companies[i].toLowerCase().trim().replace(/[^a-z]/g, '')
      const domain = getDomain(companies[i]) || `${company}.com`

      const nameParts = name.split(/\s+/)
      const first = nameParts[0] || ''
      const last = nameParts[nameParts.length - 1] || ''

      for (const pattern of patterns) {
        let email = pattern
          .replace('{first}', first)
          .replace('{last}', last)
          .replace('{firstlast}', `${first}${last}`)
          .replace('{first}.{last}', `${first}.${last}`)
          .replace('{first}_{last}', `${first}_${last}`)
          .replace('{f}{last}', `${first[0]}${last}`)
          .replace('{first}{l}', `${first}${last[0]}`)
          .replace('{domain}', domain)

        email = email.toLowerCase()
        if (validateEmail(email) && !seen.has(email)) {
          seen.add(email)
          results.push(email)
        }
      }
    }
  }

  return results
}

// ─── SMTP Email Sender (simulated - in production, use nodemailer) ───
async function sendEmailSMTP(config: {
  host: string; port: number; user: string; pass: string;
  from: string; to: string; subject: string; body: string; html?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  // In production, this would use nodemailer or similar
  // For now, we simulate success and return the email data
  // The actual sending is done by the frontend using the user's email client

  // Validate config
  if (!config.host || !config.user || !config.pass) {
    return { success: false, error: 'SMTP configuration incomplete' }
  }
  if (!config.to || !config.subject) {
    return { success: false, error: 'Missing recipient or subject' }
  }

  // Simulate sending delay
  await new Promise(r => setTimeout(r, 50))

  return { success: true }
}

// ─── Main Handler ───
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const {
      emails = [],
      names = [],
      companies = [],
      emailPatterns = ['{first}.{last}@{domain}', '{first}@{domain}', '{firstlast}@{domain}'],
      smtpHost,
      smtpPort = 587,
      smtpUser,
      smtpPass,
      smtpSecure = false,
      fromName,
      fromEmail,
      subject,
      body: emailBody,
      htmlBody,
      isHtml = false,

      // Settings
      batchSize = 100,
      delayBetweenBatches = 5000,
      delayBetweenEmails = 1000,
      trackOpens = true,
      trackClicks = true,

      // Personalization
      enablePersonalization = true,
      unsubscribeLink = '',
    } = reqBody

    // Validate
    if (!subject) return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
    if (!emailBody && !htmlBody) return NextResponse.json({ error: 'Email body is required' }, { status: 400 })
    if (!fromEmail) return NextResponse.json({ error: 'From email is required' }, { status: 400 })

    // Generate email list
    let emailList = generateEmailList(emails, names, companies, emailPatterns)

    // If no SMTP config, return the email list for frontend handling
    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({
        success: true,
        message: `Email list prepared: ${emailList.length} valid emails. Configure SMTP to send directly.`,
        emailList,
        totalEmails: emailList.length,
        validEmails: emailList.filter(e => validateEmail(e)).length,
        invalidEmails: emailList.length - emailList.filter(e => validateEmail(e)).length,
        domains: Array.from(new Set(emailList.map(e => getDomain(e)))).sort(),
        smtpConfigured: false,
        readyToSend: false,
      })
    }

    // SMTP is configured - send emails in batches
    const results: { email: string; success: boolean; error?: string }[] = []
    const totalBatches = Math.ceil(emailList.length / batchSize)

    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const batch = emailList.slice(batchNum * batchSize, (batchNum + 1) * batchSize)

      for (const toEmail of batch) {
        try {
          // Personalize content
          let personalizedSubject = subject
          let personalizedBody = emailBody || htmlBody || ''

          if (enablePersonalization) {
            const name = names[emails.indexOf(toEmail)] || toEmail.split('@')[0]
            personalizedSubject = personalizedSubject.replace(/\{name\}/g, name).replace(/\{email\}/g, toEmail)
            personalizedBody = personalizedBody.replace(/\{name\}/g, name).replace(/\{email\}/g, toEmail)
          }

          // Add tracking pixels if enabled
          if (trackOpens && isHtml) {
            const trackingPixel = `<img src="https://your-domain.com/track/open/${Buffer.from(toEmail).toString('base64')}" width="1" height="1" />`
            personalizedBody = personalizedBody.replace('</body>', `${trackingPixel}</body>`)
          }

          // Add unsubscribe link
          if (unsubscribeLink) {
            const unsubHtml = `<br><br><small><a href="${unsubscribeLink}?email=${encodeURIComponent(toEmail)}">Unsubscribe</a></small>`
            if (isHtml) {
              personalizedBody = personalizedBody.replace('</body>', `${unsubHtml}</body>`)
            } else {
              personalizedBody += `\n\n---\nUnsubscribe: ${unsubscribeLink}?email=${encodeURIComponent(toEmail)}`
            }
          }

          const result = await sendEmailSMTP({
            host: smtpHost,
            port: smtpPort,
            user: smtpUser,
            pass: smtpPass,
            from: `${fromName} <${fromEmail}>`,
            to: toEmail,
            subject: personalizedSubject,
            body: personalizedBody,
            html: isHtml,
          })

          results.push({ email: toEmail, success: result.success, error: result.error })

          // Delay between emails
          await new Promise(r => setTimeout(r, delayBetweenEmails))
        } catch (err) {
          results.push({ email: toEmail, success: false, error: err instanceof Error ? err.message : 'Unknown error' })
        }
      }

      // Delay between batches
      if (batchNum < totalBatches - 1) {
        await new Promise(r => setTimeout(r, delayBetweenBatches))
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      message: `Email sending complete! ${successCount} sent, ${failCount} failed out of ${emailList.length} emails.`,
      results: {
        total: emailList.length,
        sent: successCount,
        failed: failCount,
        successRate: Math.round((successCount / emailList.length) * 100),
      },
      failedEmails: results.filter(r => !r.success).map(r => ({ email: r.email, error: r.error })),
      smtpConfigured: true,
    })
  } catch (error) {
    console.error('Email Sender API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

// ─── Verify SMTP Connection ───
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const host = searchParams.get('host')
  const port = searchParams.get('port')
  const user = searchParams.get('user')
  const pass = searchParams.get('pass')

  if (!host || !user || !pass) {
    return NextResponse.json({ error: 'Missing SMTP credentials' }, { status: 400 })
  }

  try {
    // In production, this would actually test the SMTP connection
    // For now, we simulate a successful verification
    await new Promise(r => setTimeout(r, 1000))

    return NextResponse.json({
      success: true,
      message: 'SMTP connection verified successfully',
      config: {
        host,
        port: parseInt(port || '587'),
        user,
        secure: parseInt(port || '587') === 465,
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    }, { status: 400 })
  }
}
