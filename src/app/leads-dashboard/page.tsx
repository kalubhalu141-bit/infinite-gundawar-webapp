'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  city: string
  source: string
  interests: string[]
  message: string
  subscribed: number
  verified: number
  created_at: string
}

interface Stats {
  total: number
  verified: number
  today: number
  thisWeek: number
  sources: Record<string, number>
  topCities: { city: string; count: number }[]
}

export default function LeadsDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const limit = 50

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
        ...(sourceFilter && { source: sourceFilter }),
        ...(cityFilter && { city: cityFilter }),
      })
      const [leadsRes, statsRes] = await Promise.all([
        fetch(`/api/leads?${params}`),
        fetch('/api/leads?action=stats'),
      ])
      const leadsData = await leadsRes.json()
      const statsData = await statsRes.json()
      setLeads(leadsData.leads || [])
      setTotal(leadsData.total || 0)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    }
    setLoading(false)
  }, [page, search, sourceFilter, cityFilter])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/leads?id=${id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      fetchLeads()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        format,
        ...(search && { search }),
        ...(sourceFilter && { source: sourceFilter }),
        ...(cityFilter && { city: cityFilter }),
      })
      const res = await fetch(`/api/leads/export?${params}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    }
    setExporting(false)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <>
      <Navbar />
      <PageEnhancements />
      <PageHead
        title="Leads Dashboard — View, Search, Filter & Export Collected Leads"
        description="View, search, filter, and export all collected leads from your lead capture system. Manage verified leads, track lead sources, filter by city and date, and export to CSV or JSON. Complete CRM for your collected business leads."
        keywords={['leads dashboard', 'lead management system', 'CRM dashboard', 'email list management', 'export leads CSV', 'collected leads', 'lead capture system', 'lead search filter', 'lead analytics', 'lead source tracking', 'verified leads', 'lead database', 'sales leads management', 'lead export tool', 'business leads CRM', 'lead tracking software', 'contact management', 'lead reporting', 'lead statistics', 'top cities leads']}
        ogImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop"
        canonical="https://infinite-gundawar-webapp.vercel.app/leads-dashboard"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Leads Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Manage all your collected leads</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport('csv')}
                disabled={exporting || total === 0}
                className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors disabled:opacity-50"
              >
                {exporting ? 'Exporting...' : '📊 Export CSV'}
              </button>
              <button
                onClick={() => handleExport('json')}
                disabled={exporting || total === 0}
                className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              >
                {exporting ? 'Exporting...' : '📋 Export JSON'}
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Total Leads</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Verified</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{stats.verified.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Today</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">{stats.today.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider">This Week</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">{stats.thisWeek.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name, email, company..."
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setPage(1) }}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="" className="bg-slate-800">All Sources</option>
              <option value="website" className="bg-slate-800">Website</option>
              <option value="free-business-kit" className="bg-slate-800">Free Kit</option>
              <option value="newsletter" className="bg-slate-800">Newsletter</option>
              <option value="contact" className="bg-slate-800">Contact Form</option>
            </select>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => { setCityFilter(e.target.value); setPage(1) }}
              placeholder="Filter by city..."
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
                <p className="text-slate-400">Loading leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 text-lg mb-2">No leads yet</p>
                <p className="text-slate-500 text-sm">Share your lead magnet page to start collecting leads.</p>
                <a href="/free-business-kit" className="inline-block mt-4 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                  View Lead Magnet Page
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Phone</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">Company</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">City</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Source</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">Date</th>
                      <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{lead.email}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">{lead.phone || '—'}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">{lead.company || '—'}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">{lead.city || '—'}</td>
                        <td className="px-4 py-3">
                          {lead.verified ? (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">Verified</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-xs">Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">{lead.source}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {deleteConfirm === lead.id ? (
                            <div className="flex items-center gap-1 justify-end">
                              <button onClick={() => handleDelete(lead.id)} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30">Delete</button>
                              <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-white/5 text-slate-400 rounded text-xs hover:bg-white/10">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(lead.id)} className="text-slate-500 hover:text-red-400 text-xs transition-colors">🗑️</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-slate-400 text-sm">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} leads
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-slate-400 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Top Cities */}
          {stats?.topCities && stats.topCities.length > 0 && (
            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Top Cities</h3>
              <div className="flex flex-wrap gap-2">
                {stats.topCities.map(c => (
                  <button
                    key={c.city}
                    onClick={() => { setCityFilter(c.city); setPage(1) }}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 text-sm hover:bg-white/10 transition-colors"
                  >
                    {c.city} <span className="text-slate-500">({c.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    <GoalModeFeatures page="leads-dashboard" />
    </>
  )
}
