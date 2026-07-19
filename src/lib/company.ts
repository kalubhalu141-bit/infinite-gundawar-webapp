import type { Pillar } from '@/components/three/PillarsScene'

export const COMPANY = {
  name: 'Infinite Gundawar Business Private Limited',
  short: 'Infinite Gundawar',
  director: 'Niraj Sunilrao Gundawar',
  location: 'Gadchiroli, Maharashtra, India',
  registered: 'Maharashtra, India',
  shareCapital: '₹1,00,000 (10,000 equity shares of ₹10 each)',
  tagline: 'Building Maharashtra’s future — infrastructure, trade, education & digital.',
  vision:
    'To be a catalyst for inclusive growth in Maharashtra — linking infrastructure, global trade, skill-building and digital reach into one ecosystem that creates lasting value for communities and partners.',
  mission:
    'Deliver dependable infrastructure, trustworthy import/export trade, accessible coaching, and measurable digital marketing outcomes — all powered by free, on-device technology.',
}

export const PILLARS: Pillar[] = [
  {
    id: 'infra',
    title: 'Infrastructure & Real Estate',
    color: 0xffb347,
    blurb:
      'Infrastructure developers, builders, promoters, contractors, town planners, surveyors and property agents — end-to-end project execution across Maharashtra.',
  },
  {
    id: 'trade',
    title: 'Import / Export Trading',
    color: 0x38bdf8,
    blurb:
      'Consumer goods, electronics, industrial & agricultural products, technology and fashion & lifestyle — connecting Indian suppliers to global markets.',
  },
  {
    id: 'education',
    title: 'Coaching & Education',
    color: 0x818cf8,
    blurb:
      'Skill development, professional certification, competitive exam preparation and coaching classes for the next generation of Maharashtra’s talent.',
  },
  {
    id: 'digital',
    title: 'Digital Marketing',
    color: 0x34d399,
    blurb:
      'Data-driven marketing campaigns, branding and promotional activities that put businesses in front of the right audience.',
  },
]

export const STATS = [
  { label: 'Business Verticals', value: '4' },
  { label: 'Headquarters', value: 'Gadchiroli, MH' },
  { label: 'Share Capital', value: '₹1,00,000' },
  { label: 'AI Models (free)', value: '10+' },
]

export const SERVICES = [
  {
    id: 'infra',
    title: 'Infrastructure & Real Estate',
    tags: ['Developers', 'Builders', 'Promoters', 'Contractors', 'Town Planners', 'Surveyors', 'Property Agents'],
    color: '#ffb347',
  },
  {
    id: 'trade',
    title: 'Import / Export Trading',
    tags: ['Consumer Goods', 'Electronics', 'Industrial', 'Agricultural', 'Technology', 'Fashion & Lifestyle'],
    color: '#38bdf8',
  },
  {
    id: 'education',
    title: 'Coaching & Education',
    tags: ['Skill Development', 'Certification', 'Competitive Exams', 'Coaching Classes'],
    color: '#818cf8',
  },
  {
    id: 'digital',
    title: 'Digital Marketing & Advertising',
    tags: ['Campaigns', 'Branding', 'Promotions', 'Analytics'],
    color: '#34d399',
  },
]

export const TIMELINE = [
  { year: 'Incorporation', text: 'Infinite Gundawar Business Private Limited registered in Maharashtra with ₹1,00,000 share capital.' },
  { year: 'Verticals', text: 'Four aligned verticals launched: Infrastructure, Trade, Education and Digital.' },
  { year: 'Today', text: 'A 3D, AI-powered corporate experience — with free on-device AI for everyone.' },
]
