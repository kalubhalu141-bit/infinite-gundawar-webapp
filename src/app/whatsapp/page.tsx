'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useEffect, useCallback, useRef } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'


// ─── Types ───
interface Account {
  id: string; name: string; phone: string; status: string;
  total_sent: number; total_failed: number; daily_sent: number;
  daily_limit: number; send_delay_min: number; send_delay_max: number;
  live_state: string; qr: string | null; is_active: number;
}

interface Campaign {
  id: string; name: string; message: string; status: string;
  total_contacts: number; sent_count: number; failed_count: number;
  account_id: string; delay_sec: number; concurrency: number;
  created_at: string; started_at: string; completed_at: string;
  scheduled_at: string; media_files: any[];
}

interface Contact {
  id: string; name: string; phone: string; group_tag: string;
  source: string; is_blocked: number;
}

interface Template {
  id: string; name: string; message: string; category: string;
}

interface DashboardStats {
  totalContacts: number; totalAccounts: number; activeAccounts: number;
  totalCampaigns: number; runningCampaigns: number; totalSent: number;
  totalFailed: number; pendingQueue: number; todaySent: number; totalInbound: number;
}

interface QueueItem {
  id: string; status: string; name: string; phone: string; error: string;
  sent_at: string; attempts: number;
}

// ─── Helpers ───
const API = '/whatsapp/api'

async function api(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  return res.json()
}

function statusColor(s: string) {
  switch (s) {
    case 'ready': return 'text-green-400'
    case 'running': return 'text-yellow-400'
    case 'sent': return 'text-green-400'
    case 'failed': return 'text-red-400'
    case 'pending': return 'text-blue-400'
    case 'processing': return 'text-yellow-400'
    case 'completed': return 'text-green-400'
    case 'paused': return 'text-orange-400'
    case 'scheduled': return 'text-purple-400'
    case 'qr': return 'text-yellow-400'
    case 'connecting': return 'text-blue-400'
    default: return 'text-gray-400'
  }
}

function statusBg(s: string) {
  switch (s) {
    case 'ready': return 'bg-green-500/20 border-green-500/30'
    case 'running': return 'bg-yellow-500/20 border-yellow-500/30'
    case 'sent': return 'bg-green-500/20 border-green-500/30'
    case 'failed': return 'bg-red-500/20 border-red-500/30'
    case 'pending': return 'bg-blue-500/20 border-blue-500/30'
    case 'completed': return 'bg-green-500/20 border-green-500/30'
    case 'paused': return 'bg-orange-500/20 border-orange-500/30'
    case 'scheduled': return 'bg-purple-500/20 border-purple-500/30'
    default: return 'bg-gray-500/20 border-gray-500/30'
  }
}

// ─── Component ───
export default function WhatsAppPage() {
  const [tab, setTab] = useState<'dashboard' | 'accounts' | 'campaigns' | 'contacts' | 'templates' | 'autoreply' | 'inbound'>('dashboard')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal states
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrData, setQrData] = useState('')
  const [qrAccountId, setQrAccountId] = useState('')

  // Form states
  const [newAccountName, setNewAccountName] = useState('')
  const [newAccountDaily, setNewAccountDaily] = useState('500')
  const [newAccountDelayMin, setNewAccountDelayMin] = useState('3')
  const [newAccountDelayMax, setNewAccountDelayMax] = useState('8')
  const [campaignName, setCampaignName] = useState('')
  const [campaignMsg, setCampaignMsg] = useState('')
  const [campaignAccount, setCampaignAccount] = useState('')
  const [campaignDelay, setCampaignDelay] = useState('5')
  const [campaignConcurrency, setCampaignConcurrency] = useState('3')
  const [campaignFile, setCampaignFile] = useState<File | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactGroup, setContactGroup] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [templateMsg, setTemplateMsg] = useState('')
  const [templateCat, setTemplateCat] = useState('general')
  const [contactPage, setContactPage] = useState(1)
  const [contactTotal, setContactTotal] = useState(0)
  const [contactSearch, setContactSearch] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [showQueueModal, setShowQueueModal] = useState(false)

  // ─── Data fetching ───
  const fetchDashboard = useCallback(async () => {
    try {
      const d = await api('/dashboard')
      if (d && !d.error) setDashboard(d)
    } catch {}
  }, [])

  const fetchAccounts = useCallback(async () => {
    try {
      const d = await api('/accounts')
      if (Array.isArray(d)) setAccounts(d)
    } catch {}
  }, [])

  const fetchCampaigns = useCallback(async () => {
    try {
      const d = await api('/campaigns')
      if (Array.isArray(d)) setCampaigns(d)
    } catch {}
  }, [])

  const fetchContacts = useCallback(async (page = 1, search = '') => {
    try {
      const d = await api(`/contacts?page=${page}&limit=50&search=${encodeURIComponent(search)}`)
      if (d && d.contacts) {
        setContacts(d.contacts)
        setContactTotal(d.total)
      }
    } catch {}
  }, [])

  const fetchTemplates = useCallback(async () => {
    try {
      const d = await api('/templates')
      if (Array.isArray(d)) setTemplates(d)
    } catch {}
  }, [])

  // Initial load + polling
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      setError('')
      try {
        await Promise.all([
          fetchDashboard(),
          fetchAccounts(),
          fetchCampaigns(),
          fetchContacts(),
          fetchTemplates(),
        ])
      } catch (e: any) {
        setError(e.message || 'Failed to connect to server')
      }
      setLoading(false)
    }
    loadAll()

    // Poll every 5 seconds
    const iv = setInterval(() => {
      fetchDashboard()
      fetchAccounts()
      fetchCampaigns()
    }, 5000)

    return () => clearInterval(iv)
  }, [fetchDashboard, fetchAccounts, fetchCampaigns, fetchContacts, fetchTemplates])

  // ─── Account CRUD ───
  const createAccount = async () => {
    if (!newAccountName.trim()) return
    await api('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        name: newAccountName,
        daily_limit: parseInt(newAccountDaily) || 500,
        send_delay_min: parseInt(newAccountDelayMin) || 3,
        send_delay_max: parseInt(newAccountDelayMax) || 8,
      }),
    })
    setNewAccountName('')
    setShowAccountModal(false)
    fetchAccounts()
  }

  const connectAccount = async (id: string) => {
    await api(`/accounts/${id}/connect`, { method: 'POST' })
    fetchAccounts()
    // Poll for QR
    setTimeout(async () => {
      const accs = await api('/accounts')
      const acc = accs.find((a: Account) => a.id === id)
      if (acc && acc.qr) {
        setQrData(acc.qr)
        setQrAccountId(id)
        setShowQrModal(true)
      }
    }, 3000)
  }

  const disconnectAccount = async (id: string) => {
    await api(`/accounts/${id}/disconnect`, { method: 'POST' })
    fetchAccounts()
  }

  const deleteAccount = async (id: string) => {
    if (!confirm('Delete this account?')) return
    await api(`/accounts/${id}`, { method: 'DELETE' })
    fetchAccounts()
  }

  // ─── Campaign CRUD ───
  const createCampaign = async () => {
    if (!campaignName.trim() || !campaignMsg.trim()) return
    const formData = new FormData()
    formData.append('name', campaignName)
    formData.append('message', campaignMsg)
    formData.append('account_id', campaignAccount)
    formData.append('delay', campaignDelay)
    formData.append('concurrency', campaignConcurrency)
    if (campaignFile) formData.append('files', campaignFile)

    await fetch(`${API}/campaigns`, { method: 'POST', body: formData })
    setCampaignName('')
    setCampaignMsg('')
    setCampaignFile(null)
    setShowCampaignModal(false)
    fetchCampaigns()
    fetchDashboard()
  }

  const startCampaign = async (id: string) => {
    await api(`/campaigns/${id}/start`, { method: 'POST' })
    fetchCampaigns()
    fetchDashboard()
  }

  const pauseCampaign = async (id: string) => {
    await api(`/campaigns/${id}/pause`, { method: 'POST' })
    fetchCampaigns()
  }

  const resumeCampaign = async (id: string) => {
    await api(`/campaigns/${id}/resume`, { method: 'POST' })
    fetchCampaigns()
  }

  const retryCampaign = async (id: string) => {
    await api(`/campaigns/${id}/retry`, { method: 'POST' })
    fetchCampaigns()
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('Delete this campaign?')) return
    await api(`/campaigns/${id}`, { method: 'DELETE' })
    fetchCampaigns()
    fetchDashboard()
  }

  const viewQueue = async (id: string) => {
    setSelectedCampaign(id)
    const d = await api(`/campaigns/${id}/queue`)
    if (Array.isArray(d)) setQueueItems(d)
    setShowQueueModal(true)
  }

  const exportCampaign = (id: string) => {
    window.open(`${API}/campaigns/${id}/export?format=csv`, '_blank')
  }

  // ─── Contact CRUD ───
  const addContact = async () => {
    if (!contactPhone.trim()) return
    await api('/contacts/add', {
      method: 'POST',
      body: JSON.stringify({ name: contactName, phone: contactPhone, group_tag: contactGroup }),
    })
    setContactName('')
    setContactPhone('')
    setContactGroup('')
    setShowContactModal(false)
    fetchContacts(contactPage, contactSearch)
    fetchDashboard()
  }

  const importContacts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('source', file.name)
    await fetch(`${API}/contacts/import`, { method: 'POST', body: formData })
    fetchContacts()
    fetchDashboard()
    e.target.value = ''
  }

  // ─── Template CRUD ───
  const addTemplate = async () => {
    if (!templateName.trim() || !templateMsg.trim()) return
    await api('/templates', {
      method: 'POST',
      body: JSON.stringify({ name: templateName, message: templateMsg, category: templateCat }),
    })
    setTemplateName('')
    setTemplateMsg('')
    setShowTemplateModal(false)
    fetchTemplates()
  }

  const deleteTemplate = async (id: string) => {
    await api(`/templates/${id}`, { method: 'DELETE' })
    fetchTemplates()
  }

  const useTemplate = (msg: string) => {
    setCampaignMsg(msg)
    setTab('campaigns')
  }

  // ─── Render ───
  if (loading) {
    return (<>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 flex items-center justify-center">
        <Navbar />
      <PageEnhancements />

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Connecting to WhatsApp Server...</p>
          <p className="text-gray-500 text-sm mt-2">Loading dashboard data</p>
        </div>
      </div>
      <GoalModeFeatures page="whatsapp" />
    </>
  )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center">
        <Navbar />
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Server Unreachable</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-6">Make sure the WhatsApp backend server is running on port 3212</p>
          <button onClick={() => { setError(''); setLoading(true); fetchDashboard().catch(e => setError(e.message)).finally(() => setLoading(false)) }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all">
            🔄 Retry Connection
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'accounts', label: '📱 Accounts' },
    { id: 'campaigns', label: '📢 Campaigns' },
    { id: 'contacts', label: '👥 Contacts' },
    { id: 'templates', label: '📝 Templates' },
    { id: 'autoreply', label: '🤖 Auto-Reply' },
    { id: 'inbound', label: '📥 Inbound' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900">
      <Navbar />
      <PageHead
        title="WhatsApp Bulk Messenger Pro — Dashboard"
        description="Commercial-grade WhatsApp bulk messaging platform. Multi-account, auto-reply, campaigns, analytics."
        keywords={['WhatsApp bulk sender', 'WhatsApp marketing', 'bulk messaging', 'WhatsApp automation']}
        canonical="https://infinite-gundawar-webapp.vercel.app/whatsapp"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">WhatsApp Bulk Messenger Pro</h1>
            <p className="text-gray-400 text-sm">Commercial-grade multi-account messaging platform</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${dashboard?.activeAccounts ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-400">
              {dashboard?.activeAccounts || 0} Active Account{dashboard?.activeAccounts !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-1.5 border border-white/10 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id as any); if (t.id === 'contacts') fetchContacts(); if (t.id === 'templates') fetchTemplates(); }}
              className={`flex-1 min-w-[90px] px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${tab === t.id ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'text-gray-400 hover:bg-white/5'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══ DASHBOARD ═══ */}
        {tab === 'dashboard' && dashboard && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Contacts', value: dashboard.totalContacts, icon: '👥', color: 'text-blue-400' },
                { label: 'Accounts', value: `${dashboard.activeAccounts}/${dashboard.totalAccounts}`, icon: '📱', color: 'text-green-400' },
                { label: 'Campaigns', value: `${dashboard.runningCampaigns} running`, icon: '📢', color: 'text-yellow-400' },
                { label: 'Total Sent', value: dashboard.totalSent, icon: '✅', color: 'text-emerald-400' },
                { label: 'Pending', value: dashboard.pendingQueue, icon: '⏳', color: 'text-orange-400' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Active Campaigns */}
            {campaigns.filter(c => c.status === 'running').length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 text-sm">🔴 Active Campaigns</h3>
                {campaigns.filter(c => c.status === 'running').map(c => {
                  const pct = c.total_contacts > 0 ? Math.round((c.sent_count / c.total_contacts) * 100) : 0
                  return (
                    <div key={c.id} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{c.name}</span>
                        <span className="text-gray-400">{c.sent_count}/{c.total_contacts} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => setShowCampaignModal(true)} className="bg-green-600/20 border border-green-500/30 rounded-xl p-4 text-center hover:bg-green-600/30 transition-all">
                <div className="text-2xl mb-1">📢</div>
                <div className="text-green-400 text-sm font-medium">New Campaign</div>
              </button>
              <button onClick={() => setShowAccountModal(true)} className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4 text-center hover:bg-blue-600/30 transition-all">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-blue-400 text-sm font-medium">Add Account</div>
              </button>
              <button onClick={() => setShowContactModal(true)} className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4 text-center hover:bg-purple-600/30 transition-all">
                <div className="text-2xl mb-1">👤</div>
                <div className="text-purple-400 text-sm font-medium">Add Contact</div>
              </button>
              <button onClick={() => setShowTemplateModal(true)} className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4 text-center hover:bg-yellow-600/30 transition-all">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-yellow-400 text-sm font-medium">New Template</div>
              </button>
            </div>
          </div>
        )}

        {/* ═══ ACCOUNTS ═══ */}
        {tab === 'accounts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-bold text-lg">WhatsApp Accounts</h2>
              <button onClick={() => setShowAccountModal(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all">
                + Add Account
              </button>
            </div>
            {accounts.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">📱</div>
                <p className="text-gray-400">No accounts yet. Add your first WhatsApp account to get started.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {accounts.map(acc => (
                  <div key={acc.id} className={`bg-white/5 border rounded-xl p-4 ${acc.live_state === 'ready' ? 'border-green-500/30' : 'border-white/10'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${acc.live_state === 'ready' ? 'bg-green-600' : 'bg-gray-600'}`}>
                          {acc.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{acc.name}</div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${statusColor(acc.live_state)}`}>● {acc.live_state}</span>
                            {acc.phone && <span className="text-xs text-gray-500">{acc.phone}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{acc.total_sent} sent</span>
                        <span className="text-xs text-gray-400">{acc.daily_sent}/{acc.daily_limit} today</span>
                        {acc.live_state === 'ready' ? (
                          <button onClick={() => disconnectAccount(acc.id)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30">Disconnect</button>
                        ) : (
                          <button onClick={() => connectAccount(acc.id)} className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30">Connect</button>
                        )}
                        <button onClick={() => deleteAccount(acc.id)} className="px-3 py-1.5 bg-gray-600/20 text-gray-400 rounded-lg text-xs hover:bg-gray-600/30">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ CAMPAIGNS ═══ */}
        {tab === 'campaigns' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-bold text-lg">Campaigns</h2>
              <button onClick={() => setShowCampaignModal(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all">
                + New Campaign
              </button>
            </div>
            {campaigns.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">📢</div>
                <p className="text-gray-400">No campaigns yet. Create your first broadcast campaign.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {campaigns.map(c => (
                  <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-white font-medium text-sm">{c.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{c.message.slice(0, 80)}{c.message.length > 80 ? '...' : ''}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${statusBg(c.status)} ${statusColor(c.status)}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                      <span>📊 {c.sent_count}/{c.total_contacts} sent</span>
                      <span>❌ {c.failed_count} failed</span>
                      <span>⏱ {c.delay_sec}s delay</span>
                      <span>🔄 {c.concurrency}x concurrency</span>
                    </div>
                    {c.status === 'running' && (
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                        <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${c.total_contacts > 0 ? (c.sent_count / c.total_contacts) * 100 : 0}%` }} />
                      </div>
                    )}
                    <div className="flex gap-2">
                      {c.status === 'draft' && <button onClick={() => startCampaign(c.id)} className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30">▶ Start</button>}
                      {c.status === 'running' && <button onClick={() => pauseCampaign(c.id)} className="px-3 py-1.5 bg-yellow-600/20 text-yellow-400 rounded-lg text-xs hover:bg-yellow-600/30">⏸ Pause</button>}
                      {c.status === 'paused' && <button onClick={() => resumeCampaign(c.id)} className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30">▶ Resume</button>}
                      {(c.status === 'completed' || c.status === 'paused') && <button onClick={() => retryCampaign(c.id)} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30">🔄 Retry Failed</button>}
                      <button onClick={() => viewQueue(c.id)} className="px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-lg text-xs hover:bg-purple-600/30">📋 Queue</button>
                      <button onClick={() => exportCampaign(c.id)} className="px-3 py-1.5 bg-gray-600/20 text-gray-400 rounded-lg text-xs hover:bg-gray-600/30">📥 Export</button>
                      <button onClick={() => deleteCampaign(c.id)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30">🗑 Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ CONTACTS ═══ */}
        {tab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-white font-bold text-lg">Contacts ({contactTotal})</h2>
              <div className="flex gap-2">
                <input type="text" value={contactSearch} onChange={e => { setContactSearch(e.target.value); setContactPage(1); fetchContacts(1, e.target.value); }}
                  placeholder="Search..." className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-green-500" />
                <label className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 cursor-pointer">
                  📥 Import CSV
                  <input type="file" accept=".csv,.xlsx,.xls" onChange={importContacts} className="hidden" />
                </label>
                <button onClick={() => setShowContactModal(true)} className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all">
                  + Add
                </button>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-400 font-medium px-4 py-2 text-xs">Name</th>
                      <th className="text-left text-gray-400 font-medium px-4 py-2 text-xs">Phone</th>
                      <th className="text-left text-gray-400 font-medium px-4 py-2 text-xs">Group</th>
                      <th className="text-left text-gray-400 font-medium px-4 py-2 text-xs">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(c => (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-2 text-white text-xs">{c.name || '—'}</td>
                        <td className="px-4 py-2 text-gray-300 text-xs font-mono">{c.phone}</td>
                        <td className="px-4 py-2 text-gray-400 text-xs">{c.group_tag || '—'}</td>
                        <td className="px-4 py-2 text-gray-400 text-xs">{c.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {contactTotal > 50 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: Math.min(Math.ceil(contactTotal / 50), 10) }, (_, i) => (
                  <button key={i} onClick={() => { setContactPage(i + 1); fetchContacts(i + 1, contactSearch); }}
                    className={`px-3 py-1 rounded text-xs ${contactPage === i + 1 ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ TEMPLATES ═══ */}
        {tab === 'templates' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-bold text-lg">Message Templates</h2>
              <button onClick={() => setShowTemplateModal(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all">
                + New Template
              </button>
            </div>
            <div className="grid gap-3">
              {templates.map(t => (
                <div key={t.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="flex gap-2">
                      <button onClick={() => useTemplate(t.message)} className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30">Use</button>
                      <button onClick={() => deleteTemplate(t.id)} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30">Delete</button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs whitespace-pre-wrap">{t.message}</p>
                  <span className="text-[10px] text-gray-600 mt-1 inline-block">{t.category}</span>
                </div>
              ))}
              {templates.length === 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-400">No templates yet. Create reusable message templates.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ AUTO-REPLY ═══ */}
        {tab === 'autoreply' && <AutoReplyTab />}

        {/* ═══ INBOUND ═══ */}
        {tab === 'inbound' && <InboundTab />}

        {/* ═══ MODALS ═══ */}

        {/* Add Account Modal */}
        {showAccountModal && (
          <Modal title="Add WhatsApp Account" onClose={() => setShowAccountModal(false)}>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Account Name</label>
                <input type="text" value={newAccountName} onChange={e => setNewAccountName(e.target.value)} placeholder="e.g., Main Business"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 text-xs mb-1 block">Daily Limit</label>
                  <input type="number" value={newAccountDaily} onChange={e => setNewAccountDaily(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-gray-300 text-xs mb-1 block">Min Delay (s)</label>
                  <input type="number" value={newAccountDelayMin} onChange={e => setNewAccountDelayMin(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-gray-300 text-xs mb-1 block">Max Delay (s)</label>
                  <input type="number" value={newAccountDelayMax} onChange={e => setNewAccountDelayMax(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                </div>
              </div>
              <button onClick={createAccount} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-all">
                Create & Connect
              </button>
            </div>
          </Modal>
        )}

        {/* QR Modal */}
        {showQrModal && (
          <Modal title="Scan QR Code" onClose={() => setShowQrModal(false)}>
            <div className="text-center">
              {qrData ? (
                <img src={qrData} alt="WhatsApp QR" className="mx-auto mb-4 rounded-xl max-w-[250px]" />
              ) : (
                <div className="w-48 h-48 bg-gray-800 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <p className="text-gray-400 text-sm">Open WhatsApp → Settings → Linked Devices → Link a Device</p>
              <p className="text-gray-500 text-xs mt-2">Scan with your phone camera</p>
            </div>
          </Modal>
        )}

        {/* New Campaign Modal */}
        {showCampaignModal && (
          <Modal title="New Campaign" onClose={() => setShowCampaignModal(false)}>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Campaign Name</label>
                <input type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g., Diwali Sale 2026"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Account</label>
                <select value={campaignAccount} onChange={e => setCampaignAccount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500">
                  <option value="">Select account...</option>
                  {accounts.filter(a => a.live_state === 'ready').map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.phone})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Message (use {'{name}'} for personalization)</label>
                <textarea value={campaignMsg} onChange={e => setCampaignMsg(e.target.value)} rows={4} placeholder="Hello {name}! Check out our latest offers..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-xs mb-1 block">Delay (seconds)</label>
                  <input type="number" value={campaignDelay} onChange={e => setCampaignDelay(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-gray-300 text-xs mb-1 block">Concurrency</label>
                  <input type="number" value={campaignConcurrency} onChange={e => setCampaignConcurrency(e.target.value)} min="1" max="10"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Contact File (CSV/Excel)</label>
                <input type="file" accept=".csv,.xlsx,.xls" onChange={e => setCampaignFile(e.target.files?.[0] || null)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <button onClick={createCampaign} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-all">
                Create Campaign
              </button>
            </div>
          </Modal>
        )}

        {/* Add Contact Modal */}
        {showContactModal && (
          <Modal title="Add Contact" onClose={() => setShowContactModal(false)}>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Name</label>
                <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="John Doe"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Phone (with country code)</label>
                <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+917****0672"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Group</label>
                <input type="text" value={contactGroup} onChange={e => setContactGroup(e.target.value)} placeholder="e.g., Customers, Leads"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <button onClick={addContact} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-all">
                Add Contact
              </button>
            </div>
          </Modal>
        )}

        {/* New Template Modal */}
        {showTemplateModal && (
          <Modal title="New Template" onClose={() => setShowTemplateModal(false)}>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Template Name</label>
                <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="e.g., Welcome Message"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Message</label>
                <textarea value={templateMsg} onChange={e => setTemplateMsg(e.target.value)} rows={4} placeholder="Hello {name}! Welcome..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Category</label>
                <input type="text" value={templateCat} onChange={e => setTemplateCat(e.target.value)} placeholder="general"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
              </div>
              <button onClick={addTemplate} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-all">
                Save Template
              </button>
            </div>
          </Modal>
        )}

        {/* Queue Modal */}
        {showQueueModal && (
          <Modal title={`Campaign Queue (${queueItems.length} items)`} onClose={() => setShowQueueModal(false)} wide>
            <div className="max-h-96 overflow-y-auto space-y-1">
              {queueItems.slice(0, 100).map(q => (
                <div key={q.id} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg text-xs">
                  <span className="text-gray-300">{q.name || q.phone}</span>
                  <span className="text-gray-500 font-mono">{q.phone}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusBg(q.status)} ${statusColor(q.status)}`}>{q.status}</span>
                  {q.error && <span className="text-red-400 text-[10px] max-w-[150px] truncate">{q.error}</span>}
                </div>
              ))}
              {queueItems.length === 0 && <p className="text-gray-500 text-center py-4">No queue items</p>}
            </div>
          </Modal>
        )}
      </div>
      <Footer />
    </div>
  )
}

// ─── Modal Component ───
function Modal({ title, children, onClose, wide }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className={`relative bg-gray-900 border border-white/10 rounded-2xl p-6 ${wide ? 'max-w-2xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Auto-Reply Tab ───
function AutoReplyTab() {
  const [rules, setRules] = useState<any[]>([])
  const [keyword, setKeyword] = useState('')
  const [response, setResponse] = useState('')
  const [matchType, setMatchType] = useState('contains')

  const load = useCallback(async () => {
    const d = await api('/autoreply')
    if (Array.isArray(d)) setRules(d)
  }, [])

  useEffect(() => { load() }, [load])

  const add = async () => {
    if (!keyword.trim() || !response.trim()) return
    await api('/autoreply', { method: 'POST', body: JSON.stringify({ keyword, response, match_type: matchType }) })
    setKeyword(''); setResponse(''); load()
  }

  const del = async (id: string) => {
    await api(`/autoreply/${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">🤖 Auto-Reply Rules</h2>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Keyword"
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
          <input type="text" value={response} onChange={e => setResponse(e.target.value)} placeholder="Auto response..."
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
          <div className="flex gap-2">
            <select value={matchType} onChange={e => setMatchType(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500 flex-1">
              <option value="contains">Contains</option>
              <option value="exact">Exact</option>
              <option value="starts">Starts with</option>
            </select>
            <button onClick={add} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Add</button>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {rules.map(r => (
          <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-yellow-400 text-xs font-mono">{r.keyword}</span>
              <span className="text-gray-500 text-xs mx-2">→</span>
              <span className="text-gray-300 text-xs">{r.response.slice(0, 60)}{r.response.length > 60 ? '...' : ''}</span>
              <span className="text-gray-600 text-[10px] ml-2">({r.match_type})</span>
            </div>
            <button onClick={() => del(r.id)} className="text-red-400 text-xs hover:text-red-300">Delete</button>
          </div>
        ))}
        {rules.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">No auto-reply rules. Add keywords to auto-respond to incoming messages.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Inbound Tab ───
function InboundTab() {
  const [messages, setMessages] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const load = useCallback(async (p = 1) => {
    const d = await api(`/inbound?page=${p}&limit=50`)
    if (d && d.messages) { setMessages(d.messages); setTotal(d.total) }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">📥 Inbound Messages ({total})</h2>
      <div className="space-y-2">
        {messages.map(m => (
          <div key={m.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-sm font-medium">{m.from_name || m.from_phone}</span>
              <span className="text-gray-500 text-[10px]">{m.created_at}</span>
            </div>
            <p className="text-gray-300 text-xs">{m.message || '(media)'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-600 text-[10px]">{m.from_phone}</span>
              {m.is_replied ? <span className="text-green-400 text-[10px]">✓ Replied</span> : <span className="text-yellow-400 text-[10px]">⏳ Pending</span>}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">No inbound messages yet.</p>
          </div>
        )}
      </div>
      {total > 50 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.min(Math.ceil(total / 50), 10) }, (_, i) => (
            <button key={i} onClick={() => { setPage(i + 1); load(i + 1); }}
              className={`px-3 py-1 rounded text-xs ${page === i + 1 ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}