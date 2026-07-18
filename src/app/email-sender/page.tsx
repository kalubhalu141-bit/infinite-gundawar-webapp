'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'

export default function EmailSenderPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'recipients' | 'smtp' | 'send' | 'history'>('compose')

  // Email content
  const [fromName, setFromName] = useState('Infinite Gundawar')
  const [fromEmail, setFromEmail] = useState('talenthebhai123@gmail.com')
  const [subject, setSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [isHtml, setIsHtml] = useState(false)
  const [htmlBody, setHtmlBody] = useState('')

  // Recipients
  const [emailsInput, setEmailsInput] = useState('')
  const [namesInput, setNamesInput] = useState('')
  const [companiesInput, setCompaniesInput] = useState('')
  const [emailPatterns, setEmailPatterns] = useState('{first}.{last}@{domain}\n{first}@{domain}\n{firstlast}@{domain}')

  // SMTP
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState(587)
  const [smtpUser, setSmtpUser] = useState('talenthebhai123@gmail.com')
  const [smtpPass, setSmtpPass] = useState('')
  const [smtpSecure, setSmtpSecure] = useState(false)

  // Settings
  const [batchSize, setBatchSize] = useState(100)
  const [delayBetweenEmails, setDelayBetweenEmails] = useState(1000)
  const [delayBetweenBatches, setDelayBetweenBatches] = useState(5000)
  const [enablePersonalization, setEnablePersonalization] = useState(true)
  const [unsubscribeLink, setUnsubscribeLink] = useState('')

  // State
  const [isSending, setIsSending] = useState(false)
  const [sendProgress, setSendProgress] = useState({ sent: 0, failed: 0, total: 0, percent: 0 })
  const [sendLog, setSendLog] = useState<string[]>([])
  const [sendResults, setSendResults] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Parse emails from textarea
  const parsedEmails = emailsInput.split(/[\n,;]+/).map(e => e.trim()).filter(e => e)
  const parsedNames = namesInput.split(/[\n,;]+/).map(n => n.trim()).filter(n => n)
  const parsedCompanies = companiesInput.split(/[\n,;]+/).map(c => c.trim()).filter(c => c)
  const patterns = emailPatterns.split(/[\n]+/).filter(p => p.trim())

  const handleSend = useCallback(async () => {
    if (!subject) { setError('Subject is required'); return }
    if (!emailBody && !htmlBody) { setError('Email body is required'); return }
    if (!fromEmail) { setError('From email is required'); return }
    if (parsedEmails.length === 0) { setError('At least one recipient email is required'); return }

    setIsSending(true)
    setError('')
    setSendLog([])
    setSendResults(null)
    setSendProgress({ sent: 0, failed: 0, total: parsedEmails.length, percent: 0 })

    try {
      const res = await fetch('/api/email-sender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: parsedEmails,
          names: parsedNames,
          companies: parsedCompanies,
          emailPatterns: patterns,
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass,
          smtpSecure,
          fromName,
          fromEmail,
          subject,
          body: emailBody,
          htmlBody,
          isHtml,
          batchSize,
          delayBetweenEmails,
          delayBetweenBatches,
          enablePersonalization,
          unsubscribeLink,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed')

      if (data.smtpConfigured) {
        setSendResults(data.results)
        setSendProgress({ sent: data.results.sent, failed: data.results.failed, total: data.results.total, percent: 100 })
        setSendLog(prev => [...prev, `✅ Sending complete! ${data.results.sent} sent, ${data.results.failed} failed`])
      } else {
        // SMTP not configured - show email list
        setSendResults(data)
        setSendLog(prev => [...prev, `📋 Email list prepared: ${data.totalEmails} valid emails. Configure SMTP to send.`])
        if (data.emailList) {
          setSendLog(prev => [...prev, ...data.emailList.slice(0, 20).map((e: string) => `  📧 ${e}`)])
          if (data.emailList.length > 20) setSendLog(prev => [...prev, `  ... and ${data.emailList.length - 20} more`])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsSending(false)
    }
  }, [subject, emailBody, htmlBody, fromEmail, parsedEmails, parsedNames, parsedCompanies, patterns, smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, fromName, isHtml, batchSize, delayBetweenEmails, delayBetweenBatches, enablePersonalization, unsubscribeLink])

  const copyEmailList = () => {
    const emails = sendResults?.emailList || parsedEmails
    navigator.clipboard.writeText(emails.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'compose', label: '✉️ Compose' },
    { id: 'recipients', label: '👥 Recipients' },
    { id: 'smtp', label: '⚙️ SMTP Config' },
    { id: 'send', label: '🚀 Send' },
    { id: 'history', label: '📜 History' },
  ]

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <PageEnhancements />

      {/* Hero */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2c5282]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Infinite Gundawar" className="h-12 object-contain" />
            <div>
              <h1 className="text-3xl font-bold text-white">Bulk Email Sender</h1>
              <p className="text-white/60 text-sm">Send up to 100,000 emails at once • SMTP connected • Personalization • Tracking</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1.5 shadow-lg border border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[100px] px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-[#1e3a5f] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1e3a5f] mb-4">✉️ Compose Email</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">From Name</label>
                <input type="text" value={fromName} onChange={e => setFromName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">From Email</label>
                <input type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter email subject..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-600">Email Body</label>
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input type="checkbox" checked={isHtml} onChange={e => setIsHtml(e.target.checked)} className="rounded" />
                  HTML Mode
                </label>
              </div>
              {isHtml ? (
                <textarea value={htmlBody} onChange={e => setHtmlBody(e.target.value)} placeholder="<html><body><h1>Hello {name}!</h1><p>Your message here...</p></body></html>" rows={12} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843] font-mono" />
              ) : (
                <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder={`Hello {name}!\n\nI hope this email finds you well. I'm reaching out from Infinite Gundawar Business Private Limited...\n\nBest regards,\n${fromName}\nInfinite Gundawar Business Private Limited\nPhone: +91 79721 40672\nEmail: ${fromEmail}`} rows={12} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
              💡 <strong>Personalization:</strong> Use {'{name}'} for recipient name, {'{email}'} for email address. These will be replaced automatically.
            </div>
          </div>
        )}

        {/* Recipients Tab */}
        {activeTab === 'recipients' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1e3a5f] mb-4">👥 Recipients ({parsedEmails.length} emails)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Email Addresses (one per line)</label>
                <textarea value={emailsInput} onChange={e => setEmailsInput(e.target.value)} placeholder="john@example.com&#10;jane@example.com&#10;info@company.com" rows={10} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843] font-mono" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Names (optional, one per line)</label>
                <textarea value={namesInput} onChange={e => setNamesInput(e.target.value)} placeholder="John Doe&#10;Jane Smith&#10;Company Inc" rows={10} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843] font-mono" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Companies/Domains (optional)</label>
              <textarea value={companiesInput} onChange={e => setCompaniesInput(e.target.value)} placeholder="example.com&#10;company.com&#10;business.org" rows={5} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843] font-mono" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Email Patterns (for generation)</label>
              <textarea value={emailPatterns} onChange={e => setEmailPatterns(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843] font-mono" />
              <p className="text-xs text-gray-400 mt-1">Patterns: {'{first}'} {'{last}'} {'{domain}'} — e.g., john.doe@example.com</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-xl font-bold text-green-600">{parsedEmails.length}</div>
                <div className="text-xs text-green-700">Valid Emails</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-xl font-bold text-blue-600">{parsedNames.length}</div>
                <div className="text-xs text-blue-700">Names</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-xl font-bold text-purple-600">{new Set(parsedEmails.map(e => e.split('@')[1])).size}</div>
                <div className="text-xs text-purple-700">Domains</div>
              </div>
            </div>
          </div>
        )}

        {/* SMTP Tab */}
        {activeTab === 'smtp' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1e3a5f] mb-4">⚙️ SMTP Configuration</h2>
            <p className="text-sm text-gray-500 mb-4">Configure your SMTP server to send emails directly. For Gmail, use App Password.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">SMTP Host</label>
                <input type="text" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} placeholder="smtp.gmail.com" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Port</label>
                <input type="number" value={smtpPort} onChange={e => setSmtpPort(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Username (Email)</label>
                <input type="email" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Password / App Password</label>
                <input type="password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Batch Size</label>
                <input type="number" value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Delay Between Emails (ms)</label>
                <input type="number" value={delayBetweenEmails} onChange={e => setDelayBetweenEmails(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Delay Between Batches (ms)</label>
                <input type="number" value={delayBetweenBatches} onChange={e => setDelayBetweenBatches(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700">
              ⚠️ <strong>Gmail Users:</strong> Use App Password (not your regular password). Go to Google Account → Security → 2-Step Verification → App Passwords.
            </div>
          </div>
        )}

        {/* Send Tab */}
        {activeTab === 'send' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1e3a5f] mb-4">🚀 Send Emails</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-600">{parsedEmails.length}</div>
                  <div className="text-xs text-blue-700">Recipients</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-600">{subject ? '✅' : '❌'}</div>
                  <div className="text-xs text-green-700">Subject</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-600">{emailBody || htmlBody ? '✅' : '❌'}</div>
                  <div className="text-xs text-purple-700">Body</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-orange-600">{smtpPass ? '✅' : '⚠️'}</div>
                  <div className="text-xs text-orange-700">SMTP</div>
                </div>
              </div>

              {!isSending ? (
                <button onClick={handleSend} disabled={parsedEmails.length === 0}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Send {parsedEmails.length.toLocaleString()} Emails
                </button>
              ) : (
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all" style={{ width: `${sendProgress.percent}%` }} />
                  </div>
                  <p className="text-sm text-gray-500 text-center">Sending... {sendProgress.sent} sent, {sendProgress.failed} failed</p>
                </div>
              )}

              {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}
            </div>

            {/* Send Log */}
            {sendLog.length > 0 && (
              <div className="bg-gray-900 rounded-2xl shadow-xl p-4 max-h-60 overflow-y-auto">
                {sendLog.map((log, i) => <div key={i} className="text-xs text-green-400 font-mono py-0.5">{log}</div>)}
              </div>
            )}

            {/* Results */}
            {sendResults && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="font-bold text-[#1e3a5f] mb-4">📊 Results</h3>
                {sendResults.results ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-600">{sendResults.results.total}</div>
                      <div className="text-xs text-blue-700">Total</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-600">{sendResults.results.sent}</div>
                      <div className="text-xs text-green-700">Sent</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-red-600">{sendResults.results.failed}</div>
                      <div className="text-xs text-red-700">Failed</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">{sendResults.message}</p>
                    {sendResults.emailList && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-600">Email List ({sendResults.emailList.length})</span>
                          <button onClick={copyEmailList} className="px-3 py-1 bg-gray-100 rounded text-xs font-medium hover:bg-gray-200">
                            {copied ? '✅ Copied!' : '📋 Copy All'}
                          </button>
                        </div>
                        <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3">
                          {sendResults.emailList.slice(0, 100).map((e: string, i: number) => (
                            <div key={i} className="text-xs text-gray-600 font-mono py-0.5">{e}</div>
                          ))}
                          {sendResults.emailList.length > 100 && <div className="text-xs text-gray-400 mt-2">... and {sendResults.emailList.length - 100} more</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1e3a5f] mb-4">📜 Email History</h2>
            <p className="text-sm text-gray-500">Email sending history will appear here after you send emails.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
    <GoalModeFeatures page="email-sender" />
  </>
  )
}
