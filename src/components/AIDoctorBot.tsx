'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  timestamp: Date
}

interface PatientData {
  name: string
  age: string
  gender: string
  symptoms: string[]
  duration: string
  severity: number
  medicalHistory: string
  medications: string
  sleep: string
  diet: string
  stress: string
  exercise: string
}

const symptomOptions = [
  'Digestive issues (bloating, gas, acidity)',
  'Headache / Migraine',
  'Joint pain / Arthritis',
  'Skin problems (acne, eczema, rashes)',
  'Stress / Anxiety',
  'Depression / Low mood',
  'Sleep problems (insomnia)',
  'Respiratory issues (cough, asthma)',
  'Back pain / Spine issues',
  'Weight management',
  'Hair fall / Premature graying',
  'Eye strain / Vision problems',
  'High blood pressure',
  'Diabetes / Blood sugar',
  'Women\'s health (PCOS, periods)',
  'Thyroid issues',
  'Kidney / Urinary problems',
  'Liver issues',
  'Immunity weakness',
  'Memory / Focus problems',
]

const diagnosisDB: Record<string, { dosha: string; diagnosis: string; herbs: string; diet: string; lifestyle: string; urgency: string }> = {
  'Digestive issues (bloating, gas, acidity)': {
    dosha: 'Vata imbalance (Vata Vikriti) — aggravated Vata in the digestive tract (Samana Vayu)',
    diagnosis: 'You may be experiencing **Ajirna** (indigestion) or **Grahani** (chronic digestive disorder) as per Ayurveda. This is commonly caused by irregular eating habits, consuming cold foods, excess raw foods, or high stress.',
    herbs: '🌿 **Recommended Herbs:**\n• Ajwain (Carom seeds) — 1 tsp with warm water after meals\n• Trikatu (Ginger + Black Pepper + Long Pepper) — 500mg before meals\n• Fennel (Saunf) — Chew 1 tsp after meals\n• Cumin-Coriander-Fennel tea (CCF Tea) — 2-3 cups daily\n• Ginger fresh juice — 1 tsp with honey before meals',
    diet: '🍽️ **Diet Plan:**\n• Eat warm, cooked foods — avoid raw salads\n• Include ginger, cumin, fennel in every meal\n• Drink warm water throughout the day\n• Avoid cold drinks, ice cream, fried foods\n• Eat largest meal at lunch (11 AM - 1 PM)\n• Chew food thoroughly (32 times per bite)\n• Avoid eating when not hungry',
    lifestyle: '🧘 **Lifestyle Changes:**\n• Practice Agni Deepana (digestive fire strengthening)\n• Take a 10-min walk after each meal\n• Avoid sleeping immediately after eating\n• Practice Vajrasana (sit on heels) for 5 min after meals\n• Abhyanga (oil massage) with warm sesame oil on abdomen\n• Manage stress — it directly affects digestion',
    urgency: '**When to see a doctor:** If symptoms persist beyond 2 weeks, if you notice blood in stool, severe weight loss, or persistent vomiting.'
  },
  'Headache / Migraine': {
    dosha: 'Pitta imbalance with Vata involvement — Ardhavabhedaka (migraine) or Suryavarta (morning headache)',
    diagnosis: 'Your headaches are likely caused by Pitta aggravation affecting the nervous system. Triggers include skipping meals, dehydration, excessive sun exposure, stress, and irregular sleep.',
    herbs: '🌿 **Recommended Herbs:**\n• Brahmi — 500mg twice daily (calms nervous system)\n• Shankhpushpi — 500mg with warm milk at bedtime\n• Jatamansi — 250mg before sleep\n• Ashwagandha — 500mg with warm milk (stress-related headaches)\n• Apply peppermint oil or Bhringraj oil on temples',
    diet: '🍽️ **Diet Plan:**\n• Avoid skipping meals — regular meal times\n• Reduce sour, spicy, and fermented foods\n• Avoid aged cheese, processed meats, alcohol\n• Increase cooling foods: cucumber, coconut water, sweet fruits\n• Include ghee in your diet (lubricates nervous system)\n• Drink 8-10 glasses of water daily',
    lifestyle: '🧘 **Lifestyle Changes:**\n• Shirodhara therapy (highly effective for migraines)\n• Nasya with Anu taila — 2 drops in each nostril\n• Practice Sheetali Pranayama (cooling breath) for 5 min\n• Regular sleep schedule — sleep by 10 PM\n• Avoid excessive screen time\n• Cold compress on forehead during headache',
    urgency: '**When to see a doctor:** Sudden severe headache unlike before, headache with fever/stiff neck, vision changes, or headaches increasing in frequency.'
  },
  'Joint pain / Arthritis': {
    dosha: 'Vata imbalance (Vata Vriddhi) — Sandhivata (joint disorder) as per Ayurveda',
    diagnosis: 'Your joint pain is a classic Vata disorder. Vata governs movement in the body, and when aggravated, it causes dryness, stiffness, and pain in joints. Common in cold weather, with aging, or after injury.',
    herbs: '🌿 **Recommended Herbs:**\n• Ashwagandha — 500mg twice daily (anti-inflammatory)\n• Guggulu (Commiphora) — 500mg twice daily (joint specific)\n• Shallaki (Boswellia) — 500mg twice daily\n• Turmeric with black pepper — 1 tsp with warm milk\n• Eranda (Castor) oil — apply warm on affected joints\n• Maharasnadi Kwath — 15ml twice daily before meals',
    diet: '🍽️ **Diet Plan:**\n• Include warm, oily, nourishing foods\n• Sesame oil, ghee, and bone broth\n• Avoid cold, dry, raw foods\n• Reduce nightshade vegetables (tomato, potato, brinjal)\n• Include ginger, turmeric, garlic in cooking\n• Warm milk with turmeric at bedtime',
    lifestyle: '🧘 **Lifestyle Changes:**\n• Abhyanga (warm oil massage) daily — sesame or Mahanarayana oil\n• Compression bandaging with warm oil\n• Gentle yoga — avoid high-impact exercises\n• Pinda Sweda (warm bolus massage) — weekly\n• Keep joints warm — avoid cold exposure\n• Gentle stretching — never force movements',
    urgency: '**When to see a doctor:** Severe swelling/redness in joints, inability to move joint, fever with joint pain, or sudden worsening.'
  },
  'Stress / Anxiety': {
    dosha: 'Vata Pradhana Tridosha Vikriti — Vata is primary, affecting Manovaha Srotas (mind channels)',
    diagnosis: 'According to Ayurveda, anxiety is a Vata disorder affecting the mind (Manas). Vata governs the nervous system, and when imbalanced, it creates fear, worry, restlessness, and insomnia.',
    herbs: '🌿 **Recommended Herbs:**\n• Ashwagandha — 500mg twice daily (adaptogen, reduces cortisol)\n• Brahmi — 500mg morning and evening (calms mind)\n• Jatamansi — 250mg at bedtime\n• Shankhpushpi — 1 tsp powder with warm milk\n• Tagara — 250mg before sleep\n• Saraswatarishta — 15ml with equal water after meals',
    diet: '🍽️ **Diet Plan:**\n• Warm, sweet, sour, and salty tastes\n• Regular meal times — never skip\n• Warm milk with nutmeg and saffron at bedtime\n• Sweet fruits: bananas, dates, grapes, mangoes\n• Nuts: almonds (soaked), walnuts, cashews\n• Avoid caffeine, alcohol, and excess spice\n• Include rice, wheat, oats in diet',
    lifestyle: '🧘 **Lifestyle Changes:**\n• Abhyanga with warm sesame or Brahmi oil (daily)\n• Shirodhara therapy — deeply calming\n• Pranayama: Nadi Shodhana (alternate nostril) 10 min\n• Meditation: 15-20 min daily\n• Nature walks — ground yourself\n• Digital detox — reduce screen time\n• Maintain regular sleep schedule',
    urgency: '**When to see a doctor:** Panic attacks, inability to function, suicidal thoughts, or anxiety lasting more than 2 weeks without improvement.'
  },
  'Skin problems (acne, eczema, rashes)': {
    dosha: 'Pitta-Kapha imbalance — Rakta Dhatu Dusti (blood tissue impurity) with Pitta aggravation',
    diagnosis: 'Skin disorders in Ayurveda are called Kustha. Your symptoms suggest Pitta aggravation affecting the blood tissue (Rakta Dhatu). Causes include improper diet, stress, toxins, and hormonal imbalance.',
    herbs: '🌿 **Recommended Herbs:**\n• Neem — 500mg twice daily (blood purifier)\n• Manjistha — 500mg twice daily (skin purifier)\n• Turmeric — 1 tsp with warm water on empty stomach\n• Aloe Vera juice — 30ml morning and evening\n• Khadira — 500mg twice daily\n• Apply Neem-Turmeric paste on affected areas',
    diet: '🍽️ **Diet Plan:**\n• Cooling foods: cucumber, bitter gourd, leafy greens\n• Avoid spicy, sour, fried foods\n• Reduce dairy and sugar intake\n• Drink plenty of water (warm preferred)\n• Include bitter foods: neem leaves, fenugreek\n• Avoid reheated food, processed food\n• Reduce salt intake',
    lifestyle: '🧘 **Lifestyle Changes:**\n• Panchakarma therapy (Virechana) — deep detox\n• Abhyanga with coconut oil or Chandan oil\n• Avoid scratching or picking at skin\n• Use natural skincare products only\n• Manage stress — it worsens skin conditions\n• Get adequate sleep for skin repair',
    urgency: '**When to see a doctor:** Spreading rash, fever with skin changes, pus-filled lesions, or skin problems not responding to treatment after 3 weeks.'
  },
  'Sleep problems (insomnia)': {
    dosha: 'Vata imbalance affecting Tarpaka Kapha — the sub-dosha responsible for nourishing the brain',
    diagnosis: 'Insomnia in Ayurveda is called Anidra. It occurs when Vata becomes aggravated, creating restlessness and an overactive mind. Tarpaka Kapha, which nourishes the brain, becomes depleted.',
    herbs: '🌿 **Recommended Herbs:**\n• Ashwagandha — 500mg with warm milk at bedtime\n• Jatamansi — 500mg before sleep\n• Brahmi — 500mg evening and bedtime\n• Shankhpushpi — 1 tsp with warm milk\n• Nutmeg (Jaiphal) — pinch in warm milk\n• Tagara — 250mg before bed',
    diet: '🍽️ **Diet Plan:**\n• Warm, sweet, heavy foods in the evening\n• Warm milk with nutmeg, saffron, and honey\n• Kiwi fruit, tart cherries (natural melatonin)\n• Avoid caffeine after 2 PM\n• Light dinner — finish by 7 PM\n• Include sweet potatoes, rice, ghee in dinner\n• Avoid cold, dry foods at night',
    lifestyle: '🧘 **Lifestyle Changes:**\n• Abhyanga (full body oil massage) with warm sesame oil\n• Shirodhara — extremely effective for insomnia\n• Foot massage with warm sesame oil before bed\n• Practice Yoga Nidra (yogic sleep) for 20 min\n• Digital sunset — no screens 1 hour before bed\n• Sleep and wake at the same time daily\n• Keep bedroom cool, dark, and quiet',
    urgency: '**When to see a doctor:** Insomnia lasting more than 3 weeks, excessive daytime sleepiness, sleep apnea symptoms (snoring, gasping).'
  },
  'Weight management': {
    dosha: 'Kapha aggravation with Meda Dhatu Vriddhi — impaired fat metabolism (Agnimandya)',
    diagnosis: 'Weight issues in Ayurveda are linked to impaired digestive fire (Agnimandya) and excess Kapha. When Agni is weak, the body accumulates Ama (toxins) and excess Meda Dhatu (fat tissue).',
    herbs: '🌿 **Recommended Herbs:**\n• Triphala — 1g before bed (detox + digestion)\n• Guggulu — 500mg twice daily (fat metabolism)\n• Trikatu — 500mg before meals (boosts Agni)\n• Punarnava — 500mg twice daily (water balance)\n• Lemon-honey water on empty stomach\n• Green tea with ginger (metabolism booster)',
    diet: '🍽️ **Diet Plan:**\n• Eat according to Agni (digestive fire)\n• Light, warm, dry foods — reduce heavy foods\n• Include bitter and pungent tastes\n• Reduce dairy, wheat, sugar, and oil\n• Eat largest meal at lunch\n• Fast or eat very light on one day per week\n• Drink warm water with ginger throughout day\n• Avoid snacking between meals',
    lifestyle: '🧘 **Lifestyle Changes:**\n• Exercise daily — minimum 30 min brisk walk\n• Surya Namaskar — 12 rounds daily\n• Panchakarma (Virechana) — deep detox\n• Dry brushing (Garshana) before bath\n• Avoid daytime sleeping\n• Practice Kapalabhati Pranayama — 10 min\n• Maintain consistent meal times',
    urgency: '**When to see a doctor:** Rapid weight gain without cause, difficulty losing weight despite effort, or associated symptoms like fatigue/swelling.'
  },
  'default': {
    dosha: 'Multi-dosha involvement — requires further assessment',
    diagnosis: 'Based on your symptoms, there appears to be a multi-dosha imbalance. Ayurvedic treatment requires understanding your unique constitution (Prakriti) and current imbalance (Vikriti) for accurate diagnosis.',
    herbs: '🌿 **General Supportive Herbs:**\n• Triphala — 1g before bed (overall balance)\n• Ashwagandha — 500mg daily (adaptogen)\n• Turmeric — 1 tsp with warm milk\n• Ginger tea — 2-3 cups daily\n• Tulsi tea — immunity and stress support',
    diet: '🍽️ **Universal Ayurvedic Diet:**\n• Eat warm, freshly cooked foods\n• Include all 6 tastes in meals\n• Largest meal at lunch\n• Warm water throughout the day\n• Seasonal and local foods\n• Mindful eating — no screens',
    lifestyle: '🧘 **Foundational Practices:**\n• Daily Abhyanga (oil massage)\n• 15 min morning walk or yoga\n• 10 min meditation or pranayama\n• Regular sleep schedule (10 PM - 6 AM)\n• Nature connection daily\n• Digital detox periods',
    urgency: '**When to see a doctor:** If symptoms persist, worsen, or you develop new concerning symptoms. For a personalized consultation, book an appointment with our Ayurvedic doctor.'
  }
}

function getDiagnosis(symptoms: string[]): { dosha: string; diagnosis: string; herbs: string; diet: string; lifestyle: string; urgency: string } {
  for (const symptom of symptoms) {
    if (diagnosisDB[symptom]) {
      return diagnosisDB[symptom]
    }
  }
  return diagnosisDB['default']
}

export default function AIDoctorBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'intake' | 'diagnosis' | 'chat'>('intake')
  const [intakeStep, setIntakeStep] = useState(1)
  const [patient, setPatient] = useState<Partial<PatientData>>({ symptoms: [], severity: 5 })
  const [diagnosis, setDiagnosis] = useState<ReturnType<typeof getDiagnosis> | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleIntakeComplete = () => {
    const diag = getDiagnosis(patient.symptoms || [])
    setDiagnosis(diag)
    const msg: Message = {
      id: Date.now(),
      role: 'bot',
      text: `🙏 Namaste **${patient.name}**! I've analyzed your symptoms. Here's your preliminary Ayurvedic assessment:\n\n---\n\n**🔍 Dosha Analysis:**\n${diag.dosha}\n\n**📋 Assessment:**\n${diag.diagnosis}\n\n**🌿 Herbal Recommendations:**\n${diag.herbs}\n\n**🍽️ Diet Plan:**\n${diag.diet}\n\n**🧘 Lifestyle Changes:**\n${diag.lifestyle}\n\n**⚠️ Important:**\n${diag.urgency}\n\n---\n\n*Note: This is an AI-generated preliminary assessment. For a definitive diagnosis and personalized treatment plan, please consult our Ayurvedic doctor in person or via video call.*\n\n📞 **Book Consultation:** +91 79721 40672\n\nFeel free to ask me any follow-up questions!`,
      timestamp: new Date()
    }
    setMessages([msg])
    setStep('chat')
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const lower = text.toLowerCase()
      let response = ''
      if (lower.includes('diet') || lower.includes('food') || lower.includes('eat')) {
        response = `Great question about diet! 🍽️\n\n${diagnosis?.diet || 'Please complete the intake form first for personalized diet advice.'}\n\n📞 For a detailed diet plan, consult: +91 79721 40672`
      } else if (lower.includes('herb') || lower.includes('medicine') || lower.includes('remedy')) {
        response = `Here are the herbal recommendations: 🌿\n\n${diagnosis?.herbs || 'Please complete the intake form first for personalized herbal recommendations.'}\n\n⚠️ Always consult before starting new herbs. 📞 +91 79721 40672`
      } else if (lower.includes('dosha')) {
        response = `🔍 **Your Dosha Analysis:**\n\n${diagnosis?.dosha || 'Please complete the intake form first.'}\n\nUnderstanding your dosha imbalance is the first step to healing. Would you like specific remedies for your dosha type?`
      } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('consult')) {
        response = `📞 **Book Your Consultation:**\n\n🆓 **Free Call:** +91 79721 40672\n📧 Email: talenthebhai123@gmail.com\n\n**Available Consultations:**\n• In-Person (Maharashtra)\n• Video Call (Pan India)\n• Phone Call (Free)\n\nOur Ayurvedic doctor will provide a comprehensive Prakriti (constitution) analysis and personalized treatment plan.`
      } else {
        response = `Thank you for your question! Based on your profile, here's my advice:\n\n${diagnosis?.lifestyle || 'For personalized advice, please complete the intake form.'}\n\nFor a detailed consultation with our Ayurvedic doctor:\n🆓 **Call: +91 79721 40672**`
      }
      const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: response, timestamp: new Date() }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input) }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group">
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-400 rounded-full animate-pulse border-2 border-white" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">AI Doctor 🩺</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">🩺</div>
            <div>
              <h3 className="font-bold text-sm">AI Ayurvedic Doctor</h3>
              <p className="text-xs text-emerald-200">{step === 'chat' ? `Patient: ${patient.name}` : 'Intelligent Diagnosis'}</p>
            </div>
          </div>
          <button onClick={() => { setIsOpen(false); setStep('intake'); setIntakeStep(1) }} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {step === 'intake' && (
          <div className="p-6">
            <div className="flex gap-2 mb-6">
              {[1,2,3,4,5].map(s => (
                <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${intakeStep >= s ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-4">Step {intakeStep} of 5</p>

            {intakeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0f172a]">👋 Welcome! Let's get started</h3>
                <p className="text-sm text-gray-600">I'm your AI Ayurvedic Doctor. I'll ask a few questions to understand your health.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input type="text" value={patient.name || ''} onChange={e => setPatient(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Enter your name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input type="number" value={patient.age || ''} onChange={e => setPatient(p => ({ ...p, age: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Age" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select value={patient.gender || ''} onChange={e => setPatient(p => ({ ...p, gender: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => patient.name && patient.age && patient.gender && setIntakeStep(2)} disabled={!patient.name || !patient.age || !patient.gender}
                  className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-40">
                  Continue →
                </button>
              </div>
            )}

            {intakeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0f172a]">🤒 What are your symptoms?</h3>
                <p className="text-sm text-gray-600">Select all that apply (multiple allowed)</p>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                  {symptomOptions.map(s => (
                    <button key={s} onClick={() => {
                      const current = patient.symptoms || []
                      const updated = current.includes(s) ? current.filter(x => x !== s) : [...current, s]
                      setPatient(p => ({ ...p, symptoms: updated }))
                    }}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${(patient.symptoms || []).includes(s) ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400' : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'}`}>
                      {(patient.symptoms || []).includes(s) ? '✓ ' : '○ '}{s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIntakeStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50">← Back</button>
                  <button onClick={() => (patient.symptoms || []).length > 0 && setIntakeStep(3)} disabled={!(patient.symptoms || []).length}
                    className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40">Continue →</button>
                </div>
              </div>
            )}

            {intakeStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0f172a]">⏱️ Duration & Severity</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How long have you had these symptoms? *</label>
                  <select value={patient.duration || ''} onChange={e => setPatient(p => ({ ...p, duration: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none">
                    <option value="">Select duration</option>
                    <option value="Less than a week">Less than a week</option>
                    <option value="1-4 weeks">1-4 weeks</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="More than a year">More than a year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pain/Severity Level: {patient.severity}/10</label>
                  <input type="range" min="1" max="10" value={patient.severity || 5} onChange={e => setPatient(p => ({ ...p, severity: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Mild</span><span>Severe</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIntakeStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50">← Back</button>
                  <button onClick={() => patient.duration && setIntakeStep(4)} disabled={!patient.duration}
                    className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40">Continue →</button>
                </div>
              </div>
            )}

            {intakeStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0f172a]">📋 Medical History</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Any previous medical conditions?</label>
                  <textarea rows={3} value={patient.medicalHistory || ''} onChange={e => setPatient(p => ({ ...p, medicalHistory: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none resize-none" placeholder="e.g., diabetes, hypertension, thyroid..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current medications (if any)</label>
                  <input type="text" value={patient.medications || ''} onChange={e => setPatient(p => ({ ...p, medications: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none" placeholder="List any medicines you're taking" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIntakeStep(3)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50">← Back</button>
                  <button onClick={() => setIntakeStep(5)} className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700">Continue →</button>
                </div>
              </div>
            )}

            {intakeStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0f172a]">🧘 Lifestyle Questions</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sleep quality *</label>
                  <select value={patient.sleep || ''} onChange={e => setPatient(p => ({ ...p, sleep: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none">
                    <option value="">Select</option>
                    <option value="Good (7-8 hours)">Good (7-8 hours)</option>
                    <option value="Fair (5-6 hours)">Fair (5-6 hours)</option>
                    <option value="Poor (less than 5)">Poor (less than 5)</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diet pattern *</label>
                  <select value={patient.diet || ''} onChange={e => setPatient(p => ({ ...p, diet: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none">
                    <option value="">Select</option>
                    <option value="Mostly home-cooked">Mostly home-cooked</option>
                    <option value="Mix of home and outside">Mix of home and outside</option>
                    <option value="Mostly outside food">Mostly outside food</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stress level *</label>
                  <select value={patient.stress || ''} onChange={e => setPatient(p => ({ ...p, stress: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none">
                    <option value="">Select</option>
                    <option value="Low">Low — relaxed most of the time</option>
                    <option value="Moderate">Moderate — occasional stress</option>
                    <option value="High">High — frequently stressed</option>
                    <option value="Very High">Very High — constant pressure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exercise frequency *</label>
                  <select value={patient.exercise || ''} onChange={e => setPatient(p => ({ ...p, exercise: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none">
                    <option value="">Select</option>
                    <option value="Daily">Daily</option>
                    <option value="3-4 times/week">3-4 times/week</option>
                    <option value="1-2 times/week">1-2 times/week</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIntakeStep(4)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50">← Back</button>
                  <button onClick={handleIntakeComplete} disabled={!patient.sleep || !patient.diet || !patient.stress || !patient.exercise}
                    className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40">
                    🔍 Get Diagnosis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(step === 'diagnosis' || step === 'chat') && (
          <div className="p-4 space-y-4 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] ${msg.role === 'user' ? '' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-md' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md shadow-sm'}`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {step === 'chat' && messages.length > 0 && (
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
          {['Diet plan', 'Herbs', 'Book consultation'].map(q => (
            <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-emerald-100 transition-colors">{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      {step === 'chat' && (
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask follow-up questions..."
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-100 focus:border-emerald-500" />
            <button type="submit" disabled={!input.trim()} className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white disabled:opacity-40">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">🤖 AI-generated advice. For treatment, consult our doctor. 📞 +91 79721 40672</p>
        </form>
      )}
    </div>
  )
}
