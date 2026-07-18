'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'

const quotes = [
  { text: 'Happiness is not something ready-made. It comes from your own actions.', author: 'Dalai Lama', category: 'Wisdom' },
  { text: 'The purpose of our lives is to be happy.', author: 'Dalai Lama', category: 'Purpose' },
  { text: 'Happiness depends upon ourselves.', author: 'Aristotle', category: 'Philosophy' },
  { text: 'The secret of happiness is not in doing what one likes, but in liking what one does.', author: 'James M. Barrie', perspective: 'Mindset' },
  { text: 'Happiness is a direction, not a destination.', author: 'Unknown', category: 'Philosophy' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha', category: 'Mindfulness' },
  { text: 'Peace comes from within. Do not seek it without.', author: 'Buddha', category: 'Inner Peace' },
  { text: 'He who has health has hope; and he who has hope has everything.', author: 'Arabian Proverb', category: 'Health' },
]

const practices = [
  { name: 'Meditation', icon: '🧘', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop', description: 'Train your mind to focus and redirect thoughts. Even 10 minutes daily can transform your mental state.', steps: ['Find a quiet, comfortable space', 'Sit with your spine straight', 'Close your eyes and focus on your breath', 'When thoughts arise, gently return to breathing', 'Start with 5 minutes, gradually increase'], benefits: 'Reduces stress, improves focus, increases self-awareness, promotes emotional health' },
  { name: 'Pranayama (Breathing)', icon: '🌬️', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop', description: 'Ancient breathing techniques that balance your energy and calm the nervous system.', steps: ['Anulom Vilom: Alternate nostril breathing (5 min)', 'Kapalbhati: Skull-shining breath (3 min)', 'Bhramari: Humming bee breath (3 min)', 'Deep belly breathing (5 min)', 'Practice on empty stomach, morning preferred'], benefits: 'Oxygenates blood, calms mind, balances doshas, boosts energy, reduces anxiety' },
  { name: 'Gratitude Practice', icon: '🙏', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=400&fit=crop', description: 'Cultivating thankfulness rewires your brain for positivity and contentment.', steps: ['Keep a gratitude journal', 'Write 3 things you\'re grateful for each morning', 'Express thanks to someone daily', 'Notice small joys throughout the day', 'Before sleep, recall the best moment of your day'], benefits: 'Increases happiness by 25%, improves sleep, strengthens relationships, reduces depression' },
  { name: 'Yoga Asanas', icon: '🤸', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=400&fit=crop', description: 'Physical postures that unite body, mind, and spirit for complete well-being.', steps: ['Surya Namaskar (Sun Salutation) — 12 rounds', 'Vrikshasana (Tree Pose) — balance & focus', 'Sukhasana (Easy Pose) — meditation posture', 'Savasana (Corpse Pose) — deep relaxation', 'Practice 20-30 minutes daily, morning ideal'], benefits: 'Flexibility, strength, mental clarity, stress relief, better sleep, emotional balance' },
  { name: 'Seva (Selfless Service)', icon: '🤝', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop', description: 'Serving others without expectation of reward — the fastest path to lasting happiness.', steps: ['Volunteer at local organizations', 'Help a neighbor or stranger daily', 'Share your knowledge freely', 'Practice random acts of kindness', 'Donate to causes you believe in'], benefits: 'Deep fulfillment, stronger community, reduced self-focus, increased empathy, lasting joy' },
  { name: 'Digital Detox', icon: '📵', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=400&fit=crop', description: 'Disconnecting from digital noise to reconnect with yourself and the present moment.', steps: ['Set screen time limits (max 2 hours for leisure)', 'No phones during meals', 'Digital sunset — no screens 1 hour before bed', 'One full day per week without social media', 'Replace scrolling with reading or walking'], benefits: 'Better sleep, reduced anxiety, improved focus, deeper relationships, present-moment awareness' },
]

const happinessTips = [
  { category: 'Morning Rituals', icon: '🌅', color: 'from-amber-400 to-orange-500', tips: ['Wake up with the sun — align with nature\'s rhythm', 'Start with 5 minutes of silence or meditation', 'Set a positive intention for the day', 'Drink warm water to activate your body', 'Move your body — even 10 minutes of stretching', 'Eat a nourishing breakfast mindfully'] },
  { category: 'Mindset Shifts', icon: '🧠', color: 'from-purple-400 to-pink-500', tips: ['Replace "I have to" with "I get to"', 'Focus on what you can control, release the rest', 'See challenges as opportunities for growth', 'Compare yourself only to your past self', 'Celebrate small wins daily', 'Practice self-compassion — treat yourself like a friend'] },
  { category: 'Relationships', icon: '❤️', color: 'from-red-400 to-rose-500', tips: ['Spend quality time with loved ones daily', 'Practice active listening — be fully present', 'Express appreciation and love openly', 'Forgive — holding grudges only hurts you', 'Set healthy boundaries with toxic people', 'Build a community that supports your growth'] },
  { category: 'Physical Wellness', icon: '💪', color: 'from-emerald-400 to-teal-500', tips: ['Exercise 30 minutes daily — walk, dance, swim', 'Eat whole, unprocessed foods 80% of the time', 'Sleep 7-8 hours — your body heals during sleep', 'Spend time in nature at least 20 minutes daily', 'Practice deep breathing when stressed', 'Stay hydrated — drink 8-10 glasses of water'] },
  { category: 'Inner Peace', icon: '☮️', color: 'from-blue-400 to-indigo-500', tips: ['Meditate daily — even 5 minutes counts', 'Spend time in silence and solitude', 'Let go of perfectionism — embrace "good enough"', 'Accept that change is the only constant', 'Practice non-judgment of self and others', 'Connect with something greater than yourself'] },
  { category: 'Purpose & Growth', icon: '🎯', color: 'from-cyan-400 to-blue-500', tips: ['Identify your core values and live by them', 'Set meaningful goals — not just achievements', 'Learn something new every day', 'Use your unique gifts to serve others', 'Create more than you consume', 'Leave every place better than you found it'] },
]

const bollywoodQuotes = [
  { text: 'जिंदगी में तीन चीज़ें कभी ना त्यागो — खुशी, और मुस्कान!', author: 'Bollywood Wisdom', category: 'Hindi' },
  { text: 'हर रोज़ नई शुरुआत करो, हर रोज़ खुश रहो!', author: 'Daily Motivation', category: 'Hindi' },
  { text: 'मुश्किलें आती हैं इसलिए कि ताकत बढ़े — खुशी उसी में छुपी है!', author: 'Life Lesson', category: 'Hindi' },
]

export default function HappinessPage() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [activeTipCategory, setActiveTipCategory] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [isBreathing, setIsBreathing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const startBreathing = () => {
    setIsBreathing(true)
    setBreathCount(0)
    let count = 0
    const interval = setInterval(() => {
      count++
      setBreathCount(count)
      if (count >= 10) {
        clearInterval(interval)
        setIsBreathing(false)
      }
    }, 4000)
  }

  return (<>
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageEnhancements />

      {/* Hero */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop" alt="Happiness" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-pink-800/80 to-amber-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-pink-300 text-sm font-medium mb-6 backdrop-blur-sm">
              🧘 The Art of Living Happily
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Discover Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-300">Inner Happiness</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Happiness is not a destination — it's a way of life. Explore ancient wisdom, modern science, and practical practices that lead to lasting joy and inner peace.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#practices" className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl hover:shadow-lg transition-all">
                Get Started
              </a>
              <a href="#breathing" onClick={startBreathing} className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                🧘 Quick Breathing Exercise
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Rotating Quotes */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-8">✨ Daily Inspiration</span>
          <div className="relative min-h-[160px] flex items-center justify-center">
            {quotes.map((q, i) => (
              <div key={i} className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${currentQuote === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <svg className="w-10 h-10 text-purple-200 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                <p className="text-2xl sm:text-3xl font-light text-[#0f172a] leading-relaxed mb-4 italic">"{q.text}"</p>
                <p className="text-sm text-purple-600 font-medium">— {q.author}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {quotes.map((_, i) => (
              <button key={i} onClick={() => setCurrentQuote(i)} className={`w-2 h-2 rounded-full transition-all ${currentQuote === i ? 'bg-purple-600 w-6' : 'bg-purple-200'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Breathing Exercise */}
      <section id="breathing" className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">🌬️ Breathing Exercise</span>
            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">4-7-8 Breathing Technique</h2>
            <p className="text-gray-600 text-sm">A simple yet powerful technique to reduce anxiety and promote calm</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 text-center">
            <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-6 transition-all duration-[4000ms] ${isBreathing ? 'scale-110' : 'scale-100'}`}>
              <span className="text-white text-3xl font-bold">{breathCount}</span>
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">
              {!isBreathing && breathCount === 0 && 'Ready to begin?'}
              {isBreathing && breathCount < 10 && 'Breathe in... hold... breathe out...'}
              {breathCount >= 10 && '🎉 Wonderful! You completed 10 breaths!'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {!isBreathing && breathCount === 0 && 'Click the button below to start a guided 4-7-8 breathing session.'}
              {isBreathing && breathCount < 10 && 'Inhale for 4 seconds, hold for 7, exhale for 8. Let the circle guide you.'}
              {breathCount >= 10 && 'Notice how calm you feel? Practice this 2x daily for best results.'}
            </p>
            <button onClick={startBreathing} disabled={isBreathing}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
              {isBreathing ? 'Breathing...' : breathCount >= 10 ? 'Start Again' : 'Start Breathing'}
            </button>
          </div>
        </div>
      </section>

      {/* Happiness Practices */}
      <section id="practices" className="py-16 bg-gray-50">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium mb-4">🧘 Practices</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Happiness Practices</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Ancient and modern practices scientifically proven to increase happiness</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {practices.map(p => (
            <div key={p.name} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
              <div className="relative h-44 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white flex items-center gap-2">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-bold text-lg">{p.name}</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">{p.description}</p>
                <h5 className="font-semibold text-[#0f172a] text-sm mb-2">How to Practice:</h5>
                <ol className="space-y-1 mb-4">
                  {p.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600 flex-shrink-0">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-700"><strong>Benefits:</strong> {p.benefits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Happiness Tips */}
      <section className="py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">💡 Daily Tips</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Happiness Tips for Every Area of Life</h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {happinessTips.map((t, i) => (
              <button key={t.category} onClick={() => setActiveTipCategory(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTipCategory === i ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'}`}>
                <span>{t.icon}</span>
                {t.category}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${happinessTips[activeTipCategory].color} flex items-center justify-center text-2xl`}>
                {happinessTips[activeTipCategory].icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">{happinessTips[activeTipCategory].category}</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {happinessTips[activeTipCategory].tips.map((t, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">{i + 1}</span>
                  <p className="text-sm text-gray-700">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hindi Quotes */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-8">🙏 हिंदी में प्रेरणा</span>
          <h2 className="text-3xl font-bold text-[#0f172a] mb-8">Hindi Happiness Quotes</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {bollywoodQuotes.map((q, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-orange-100">
                <span className="text-3xl mb-3 block">🪷</span>
                <p className="text-lg font-medium text-[#0f172a] mb-2 leading-relaxed">{q.text}</p>
                <p className="text-sm text-orange-600">— {q.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start Your Happiness Plan Today</h2>
          <p className="text-white/80 mb-8">Join thousands who have transformed their lives with our Ayurvedic and wellness programs</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/ayurveda" className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl hover:shadow-lg transition-all">
              Explore Ayurveda 🌿
            </a>
            <a href="/" className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
              Back to Home
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    <GoalModeFeatures page="happiness" />
  </>
  )
}
