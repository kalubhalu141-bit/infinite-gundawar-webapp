'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'


const HAPPINESS_SECTIONS = [
  {
    title: '🧘 Meditation & Mindfulness',
    items: [
      { name: 'Anapanasati (Breathing)', desc: '10 min daily. Focus on breath. Reduces anxiety by 40% (Harvard study).', level: 'Beginner' },
      { name: 'Body Scan Meditation', desc: 'Lie down, scan body head to toe. Releases physical tension. 15 min.', level: 'Beginner' },
      { name: 'Loving Kindness (Metta)', desc: 'Send love to yourself, then others. Increases compassion and happiness.', level: 'Intermediate' },
      { name: 'Vipassana', desc: '10-day silent retreat. Most powerful technique. Free courses at dhamma.org.', level: 'Advanced' },
    ]
  },
  {
    title: '💪 Mental Health First Aid',
    items: [
      { name: '5-4-3-2-1 Grounding', desc: 'Name 5 things you see, 4 hear, 3 touch, 2 smell, 1 taste. Instant anxiety relief.', level: 'Anytime' },
      { name: 'Journaling', desc: 'Write 3 things you are grateful for every morning. Proven to increase happiness.', level: 'Daily' },
      { name: 'Digital Detox', desc: 'No phone 1 hour before bed and 1 hour after waking. Improves sleep and focus.', level: 'Daily' },
      { name: 'Talk to Someone', desc: 'Call a friend/family daily. Loneliness is as harmful as smoking 15 cigarettes.', level: 'Daily' },
      { name: 'Professional Help', desc: 'No shame in therapy. iCall (9152987821), NIMHANS (080-46110007) are free 24/7.', level: 'When needed' },
    ]
  },
  {
    title: '❤️ Relationship & Family',
    items: [
      { name: 'Active Listening', desc: 'Listen to understand, not to reply. Repeat back what they said. Game changer.', level: 'Daily' },
      { name: 'Appreciation Ritual', desc: 'Tell one person daily what you appreciate about them. Strengthens bonds.', level: 'Daily' },
      { name: 'Quality Time', desc: '30 min uninterrupted time with family. No phones. Just presence.', level: 'Daily' },
      { name: 'Forgiveness Practice', desc: 'Holding grudges hurts you more. Write a forgiveness letter (even if unsent).', level: 'Weekly' },
    ]
  },
  {
    title: '🏃 Physical Wellness = Mental Wellness',
    items: [
      { name: 'Morning Walk 30 min', desc: 'Sunlight + movement = serotonin boost. Best antidepressant, free.', level: 'Daily' },
      { name: 'Yoga Surya Namaskar', desc: '12 rounds morning. Full body + mind exercise. Ancient and proven.', level: 'Daily' },
      { name: 'Sleep 7-8 Hours', desc: 'Non-negotiable. Sleep deprivation causes anxiety, depression, weight gain.', level: 'Nightly' },
      { name: 'Cold Shower 2 min', desc: 'Boosts dopamine 250%. Increases willpower and mood.', level: 'Morning' },
    ]
  },
  {
    title: '📱 Free Mental Health Resources India',
    items: [
      { name: 'iCall (TISS)', desc: 'Phone: 9152987821 | Email: icall@tiss.edu | Free counselling', level: 'Free' },
      { name: 'NIMHANS', desc: 'Phone: 080-46110007 | Govt. mental health helpline', level: 'Free' },
      { name: 'Manas Foundation', desc: 'Phone: +91-11-43182020 | Affordable therapy', level: 'Affordable' },
      { name: 'YourDOST', desc: 'Online counselling platform. Chat, audio, video sessions.', level: 'Affordable' },
      { name: 'Wysa AI Therapist', desc: 'Free AI chatbot for anxiety, depression, sleep. Available 24/7.', level: 'Free' },
    ]
  },
]

const DAILY_HABITS = [
  { time: '6:00 AM', habit: 'Wake up, drink warm water with lemon', icon: '🌅' },
  { time: '6:15 AM', habit: '10 min meditation or deep breathing', icon: '🧘' },
  { time: '6:30 AM', habit: 'Exercise / Yoga / Walk (30 min)', icon: '🏃' },
  { time: '7:30 AM', habit: 'Gratitude journal — 3 things', icon: '📝' },
  { time: '8:00 AM', habit: 'Healthy breakfast (no phone)', icon: '🥗' },
  { time: '1:00 PM', habit: 'Lunch with family/colleagues (no screen)', icon: '🍽️' },
  { time: '6:00 PM', hobby: true, habit: 'Hobby time — music, art, reading, sport', icon: '🎨' },
  { time: '8:00 PM', habit: 'Family time — talk, play, connect', icon: '👨‍👩‍👧' },
  { time: '9:30 PM', habit: 'Digital detox — no screens', icon: '📵' },
  { time: '10:00 PM', habit: 'Read a book / light music', icon: '📚' },
  { time: '10:30 PM', habit: 'Sleep — aim for 7-8 hours', icon: '😴' },
]

export default function HappinessPage() {
  return (
    <>
      <PageHead
        title="Happiness Hub — Mental Health, Meditation, Mindfulness, Daily Routine"
        description="Free happiness guide: meditation techniques, mental health first aid, relationship tips, daily routine for happiness, free mental health helplines India. Beat stress, anxiety, depression naturally."
        keywords={[
          'happiness tips India', 'meditation for beginners', 'mental health India',
          'how to be happy', 'stress relief techniques', 'anxiety cure natural',
          'daily routine for happiness', 'mindfulness meditation India',
          'free mental health helpline India', 'depression help India',
          'work-life balance tips', 'relationship advice India',
          'gratitude journal', 'yoga for mental health',
        ]}
        canonical="/happiness"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'HealthTopicContent',
          name: 'Happiness & Mental Health Guide',
          url: 'https://infinite-gundawar-webapp.vercel.app/happiness',
          about: { '@type': 'Thing', name: 'Mental Health and Happiness' },
        }}
      />
      <Navbar />
      <PageEnhancements />
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-purple-50/30">

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

        {/* Hero */}
        <section className="py-20 bg-gradient-to-r from-pink-700 to-purple-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-10 right-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"/></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-pink-200 text-sm font-medium mb-4">Your Happiness is Your Responsibility</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-yellow-400">Happiness</span> Hub — Mental Wellness
            </h1>
            <p className="text-lg text-pink-100/80 max-w-2xl mx-auto">
              Free guide to mental health, meditation, stress relief, relationships and daily happiness habits. Because a healthy mind is the foundation of everything.
            </p>
          </div>
        </section>

        {/* Daily Routine */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8 text-center">⏰ Ideal Daily Routine for Happiness</h2>
            <div className="space-y-3">
              {DAILY_HABITS.map((h, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${h.hobby ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
                  <span className="text-2xl">{h.icon}</span>
                  <span className="font-mono text-sm text-gray-500 w-20 flex-shrink-0">{h.time}</span>
                  <span className="text-sm text-gray-700">{h.habit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sections */}
        {HAPPINESS_SECTIONS.map(section => (
          <section key={section.title} className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{section.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map(item => (
                  <div key={item.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-[#0f172a]">{item.name}</h3>
                      <span className="text-xs px-2 py-1 bg-pink-50 text-pink-600 rounded-full font-medium">{item.level}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Crisis Helpline */}
        <section className="py-12 bg-red-50 border-t border-red-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-4">🆘 If You Are in Crisis</h2>
            <p className="text-red-700 mb-4">You are not alone. Help is available 24/7. Please reach out.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-red-200">
                <p className="font-bold text-red-800">iCall (TISS)</p>
                <p className="text-2xl font-bold text-red-600">9152987821</p>
                <p className="text-xs text-gray-500">Mon-Sat, 8AM-10PM</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-red-200">
                <p className="font-bold text-red-800">NIMHANS</p>
                <p className="text-2xl font-bold text-red-600">080-46110007</p>
                <p className="text-xs text-gray-500">24/7 Govt. Helpline</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    <GoalModeFeatures page="happiness-hub" />
    </>
  )
}