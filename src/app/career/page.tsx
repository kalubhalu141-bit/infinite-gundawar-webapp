'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import SectionTip from '@/components/SectionTip'
import Footer from '@/components/Footer'

const categories = ['All', 'Infrastructure', 'Real Estate', 'Trading', 'Ayurveda', 'Finance', 'Education', 'Interior', 'Marketing', 'AI & Tech', 'Career']

// Real openings across Infinite Gundawar's 9 verticals.
const jobs = [
  { title: 'Civil / Construction Engineer', company: 'Infrastructure & Real Estate', location: 'Pune / Nagpur, MH', salary: '₹4-9 LPA', type: 'Full-time', category: 'Infrastructure', posted: 'Open', urgent: true },
  { title: 'Site Supervisor', company: 'Infrastructure & Real Estate', location: 'Aurangabad, MH', salary: '₹3-6 LPA', type: 'Full-time', category: 'Infrastructure', posted: 'Open', urgent: false },
  { title: 'Real Estate Sales Executive', company: 'Real Estate', location: 'Mumbai / Pune, MH', salary: '₹3-7 LPA + incentive', type: 'Full-time', category: 'Real Estate', posted: 'Open', urgent: true },
  { title: 'Property Advisor', company: 'Real Estate', location: 'Nashik, MH', salary: '₹2.5-5 LPA', type: 'Full-time', category: 'Real Estate', posted: 'Open', urgent: false },
  { title: 'Import/Export Executive', company: 'Global Trading', location: 'Pune, MH', salary: '₹3-6 LPA', type: 'Full-time', category: 'Trading', posted: 'Open', urgent: false },
  { title: 'Logistics & Documentation Officer', company: 'Global Trading', location: 'Pan-India (Remote OK)', salary: '₹2.5-5 LPA', type: 'Remote', category: 'Trading', posted: 'Open', urgent: false },
  { title: 'Ayurvedic Consultant', company: 'Ayurveda & Wellness', location: 'Pune / Remote', salary: '₹3-7 LPA', type: 'Full-time', category: 'Ayurveda', posted: 'Open', urgent: false },
  { title: 'Financial Analyst', company: 'Finance & Trading Education', location: 'Nagpur, MH', salary: '₹3-6 LPA', type: 'Full-time', category: 'Finance', posted: 'Open', urgent: false },
  { title: 'Trading & Investment Trainer', company: 'Finance & Trading Education', location: 'Remote (India)', salary: '₹3-6 LPA', type: 'Remote', category: 'Finance', posted: 'Open', urgent: false },
  { title: 'Coaching Faculty (Competitive Exams)', company: 'Education', location: 'Pune, MH', salary: '₹2.5-5 LPA', type: 'Full-time', category: 'Education', posted: 'Open', urgent: false },
  { title: 'Interior Designer', company: 'Interior Design', location: 'Mumbai / Pune, MH', salary: '₹3-7 LPA', type: 'Full-time', category: 'Interior', posted: 'Open', urgent: false },
  { title: 'Digital Marketing Specialist', company: 'Digital Marketing', location: 'Remote (India)', salary: '₹2.5-5 LPA', type: 'Remote', category: 'Marketing', posted: 'Open', urgent: true },
  { title: 'AI Tools Developer', company: 'AI & Innovation', location: 'Remote (India)', salary: '₹4-9 LPA', type: 'Remote', category: 'AI & Tech', posted: 'Open', urgent: true },
  { title: 'Frontend Developer', company: 'AI & Innovation', location: 'Remote (India)', salary: '₹3-7 LPA', type: 'Remote', category: 'AI & Tech', posted: 'Open', urgent: false },
  { title: 'HR & Recruitment Executive', company: 'People Operations', location: 'Pune, MH', salary: '₹2.5-5 LPA', type: 'Full-time', category: 'Career', posted: 'Open', urgent: false },
]

const courses = [
  { title: 'AI & Machine Learning (Hands-on)', platform: 'Infinite Gundawar Education', duration: '6 weeks', rating: 4.8, free: false },
  { title: 'Full Stack Web Development', platform: 'freeCodeCamp', duration: 'Self-paced', rating: 4.9, free: true },
  { title: 'Trading & Investing Basics', platform: 'Infinite Gundawar Finance', duration: '4 weeks', rating: 4.7, free: false },
  { title: 'Digital Marketing Fundamentals', platform: 'Google', duration: '40 hours', rating: 4.6, free: true },
  { title: 'UX & Interior Design Principles', platform: 'Infinite Gundawar Interiors', duration: '6 weeks', rating: 4.8, free: false },
  { title: 'AWS Cloud Practitioner', platform: 'Amazon', duration: '3 months', rating: 4.7, free: true },
]

export default function CareerPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCounselling, setShowCounselling] = useState(false)
  const filtered = jobs.filter(j => {
    const matchCat = activeCategory === 'All' || j.category === activeCategory
    const matchSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Navbar />
      <PageEnhancements />
      <SectionTip topic="career" />
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-4 backdrop-blur-sm">💼 Career Hub</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Today's Career Opportunities</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Discover global job openings, upskill with free courses, and get free career counselling from industry experts</p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10"><span className="text-emerald-400 font-bold">{jobs.length}</span> <span className="text-gray-400 text-sm">New Jobs Today</span></div>
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10"><span className="text-amber-400 font-bold">{jobs.filter(j => j.urgent).length}</span> <span className="text-gray-400 text-sm">Urgent Hiring</span></div>
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10"><span className="text-blue-400 font-bold">{courses.filter(c => c.free).length}</span> <span className="text-gray-400 text-sm">Free Courses</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Free Counselling Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">🆓 Free Career Counselling</h3>
            <p className="text-white/80 text-sm">Get personalized career guidance from industry experts. Resume review, interview prep, and career roadmap — all free!</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCounselling(true)} className="px-6 py-3 bg-white text-orange-700 font-bold rounded-xl hover:shadow-lg whitespace-nowrap">Book Free Session</button>
            <a href="tel:+917972140672" className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 whitespace-nowrap">📞 Call Now</a>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>

        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search openings by role or vertical..."
          className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/50 mb-8" />

        {/* Jobs Grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {filtered.map((job, i) => (
            <div key={i} className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-5 hover:bg-white/10 transition-all group ${job.urgent ? 'border-red-500/30' : 'border-white/10'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  {job.urgent && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium mb-1 inline-block">🔥 Urgent</span>}
                  <h4 className="font-bold text-white text-lg">{job.title}</h4>
                  <p className="text-sm text-indigo-300">{job.company}</p>
                </div>
                <span className="text-xs text-gray-500">{job.posted}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">📍 {job.location}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">💰 {job.salary}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{job.type}</span>
              </div>
              <button onClick={() => window.location.href = 'mailto:talenthebhai123@gmail.com?subject=Application: ' + encodeURIComponent(job.title)}
                className="w-full py-2.5 bg-indigo-600/50 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 transition-all group-hover:bg-indigo-600">
                Apply Now →
              </button>
            </div>
          ))}
        </div>

        {/* Free Courses */}
        <h3 className="text-2xl font-bold text-white mb-6">📚 Free Courses to Upskill</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {courses.map(c => (
            <div key={c.title} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{c.platform}</span>
                <span className="text-amber-400 text-sm">⭐ {c.rating}</span>
              </div>
              <h4 className="font-bold text-white mb-1">{c.title}</h4>
              <p className="text-xs text-gray-500 mb-3">{c.duration} • {c.free ? '🆓 Free' : '💰 Paid'}</p>
              <button className="w-full py-2 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-all">Start Learning →</button>
            </div>
          ))}
        </div>

        {/* Counselling Modal */}
        {showCounselling && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">🆓 Free Career Counselling</h3>
                <button onClick={() => setShowCounselling(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={e => { e.preventDefault(); setShowCounselling(false); alert('Your counselling session has been booked! Our expert will call you within 24 hours.') }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-1">Name *</label><input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500" placeholder="Your name" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Phone *</label><input type="tel" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500" placeholder="+91 XXXXX XXXXX" /></div>
                </div>
                <div><label className="block text-sm text-gray-400 mb-1">Current Role / Status</label><select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none"><option>Student</option><option>Entry Level (0-2 yrs)</option><option>Mid Level (2-5 yrs)</option><option>Senior (5-10 yrs)</option><option>Leadership (10+ yrs)</option><option>Career Change</option></select></div>
                <div><label className="block text-sm text-gray-400 mb-1">Career Interest</label><select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none"><option>AI / Machine Learning</option><option>Software Development</option><option>Data Science</option><option>Product Management</option><option>Digital Marketing</option><option>Design / UX</option><option>Business / Strategy</option><option>Other</option></select></div>
                <div><label className="block text-sm text-gray-400 mb-1">What do you need help with?</label><textarea rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none resize-none" placeholder="e.g., resume review, interview prep, career direction..." /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Preferred Counselling Mode</label><div className="flex gap-3">{['Phone Call', 'Video Call', 'WhatsApp'].map(m => (<label key={m} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer"><input type="radio" name="mode" className="text-indigo-600" />{m}</label>))}</div></div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg">Book Free Session 🎯</button>
              </form>
            </div>
          </div>
        )}

        {/* Free Call CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Your Career Path?</h3>
          <p className="text-white/80 mb-6">Get personalized guidance, resume reviews, and interview prep — completely free!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+917972140672" className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:shadow-lg flex items-center gap-2">📞 Free Call: +91 79721 40672</a>
            <a href="https://wa.me/917972140672" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:shadow-lg flex items-center gap-2">💬 WhatsApp</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    <GoalModeFeatures page="career" />
  </>
  )
}
