import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
    }
    supabase = createClient(url, key)
  }
  return supabase
}

export interface Lead {
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
  verification_token: string
  ip: string
  user_agent: string
  created_at: string
  updated_at: string
}

export async function insertLead(data: Partial<Lead>): Promise<{ id: string; token: string; email: string }> {
  const db = getSupabase()
  const id = crypto.randomUUID()
  const token = crypto.randomUUID()
  const email = data.email?.toLowerCase().trim() || ''

  try {
    const { error } = await db.from('leads').insert({
      id,
      name: data.name || '',
      email,
      phone: data.phone || '',
      company: data.company || '',
      city: data.city || '',
      source: data.source || 'website',
      interests: JSON.stringify(data.interests || []),
      message: data.message || '',
      verification_token: token,
      ip: data.ip || '',
      user_agent: data.user_agent || '',
      subscribed: 0,
      verified: 0,
    })

    if (error) {
      if (error.code === '23505' || error.message?.includes('duplicate')) {
        throw new Error('This email is already registered.')
      }
      throw error
    }

    return { id, token, email }
  } catch (err: any) {
    if (err.message?.includes('already registered')) throw err
    // If table doesn't exist yet, create it then retry
    if (err.code === '42P01' || err.message?.includes('relation "leads"')) {
      throw new Error('Leads table not found. Run the SQL setup in Supabase first.')
    }
    throw err
  }
}

export async function verifyLead(token: string): Promise<Lead | null> {
  const db = getSupabase()

  // Find lead by token
  const { data, error } = await db
    .from('leads')
    .select('*')
    .eq('verification_token', token)
    .single()

  if (error || !data) return null

  if (data.verified) return data as Lead

  // Update as verified
  const { data: updated } = await db
    .from('leads')
    .update({ verified: 1, subscribed: 1, verification_token: '', updated_at: new Date().toISOString() })
    .eq('id', data.id)
    .select()
    .single()

  return updated as Lead
}

export async function getLeads(
  page: number = 1,
  limit: number = 50,
  search?: string,
  source?: string,
  city?: string
) {
  const db = getSupabase()
  const offset = (page - 1) * limit

  let query = db.from('leads').select('*', { count: 'exact', head: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%,phone.ilike.%${search}%`)
  }
  if (source) query = query.eq('source', source)
  if (city) query = query.ilike('city', `%${city}%`)

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, error, count } = await query
  if (error) throw error

  const leads = (data || []).map((l: any) => ({
    ...l,
    interests: typeof l.interests === 'string' ? JSON.parse(l.interests || '[]') : (l.interests || []),
  }))

  return { leads, total: count || 0, page, limit }
}

export async function getLeadById(id: string) {
  const db = getSupabase()
  const { data } = await db.from('leads').select('*').eq('id', id).single()
  return data as Lead | null
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = getSupabase()
  const { error } = await db.from('leads').delete().eq('id', id)
  return !error
}

export async function getStats() {
  const db = getSupabase()

  const [totalRes, verifiedRes, todayRes, weekRes, sourcesRes, citiesRes] = await Promise.all([
    db.from('leads').select('*', { count: 'exact', head: true }),
    db.from('leads').select('*', { count: 'exact', head: true }).eq('verified', 1),
    db.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    db.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    db.from('leads').select('source'),
    db.from('leads').select('city').neq('city', '').not('city', 'is', null),
  ])

  const sources: Record<string, number> = {}
  ;(sourcesRes.data || []).forEach((r: any) => {
    sources[r.source] = (sources[r.source] || 0) + 1
  })

  const cityCounts: Record<string, number> = {}
  ;(citiesRes.data || []).forEach((r: any) => {
    if (r.city) cityCounts[r.city] = (cityCounts[r.city] || 0) + 1
  })
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }))

  return {
    total: totalRes.count || 0,
    verified: verifiedRes.count || 0,
    today: todayRes.count || 0,
    thisWeek: weekRes.count || 0,
    sources,
    topCities,
  }
}

export async function getLeadsByFilter(search?: string, source?: string, city?: string) {
  const db = getSupabase()
  let query = db.from('leads').select('*')
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
  if (source) query = query.eq('source', source)
  if (city) query = query.ilike('city', `%${city}%`)
  query = query.order('created_at', { ascending: false })
  const { data, error } = await query
  if (error) throw error
  return (data || []).map((l: any) => ({
    ...l,
    interests: typeof l.interests === 'string' ? JSON.parse(l.interests || '[]') : (l.interests || []),
  }))
}

// In-memory rate limit (Vercel serverless — resets per instance)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string, maxRequests: number = 5, windowMinutes: number = 15) {
  const now = Date.now()
  const windowMs = windowMinutes * 60000
  const key = ip

  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

export async function logEmail(leadId: string, email: string, template: string, status: string, error: string = '') {
  try {
    const db = getSupabase()
    await db.from('email_log').insert({
      lead_id: leadId,
      email,
      template,
      status,
      error,
    })
  } catch {
    // Don't fail the main flow if logging fails
  }
}
