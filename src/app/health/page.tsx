'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'
import AIDoctorBot from '@/components/AIDoctorBot'
import Link from 'next/link'


/* ─── Herb Database with REAL Unsplash photos ─── */
const HERBS = [
  {
    name: 'Ashwagandha',
    aka: 'Indian Ginseng',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    benefits: 'Stress relief, Immunity, Strength, Sleep',
    dosha: 'Vata & Kapha',
    description: 'Known as the "strength of the stallion", Ashwagandha is India\'s most powerful adaptogen. It helps the body manage stress, boosts stamina, and improves brain function.',
    sanskrit: 'अश्वगन्धा',
    rasa: 'Bitter, Astringent',
    virya: 'Warming',
    vipaka: 'Pungent',
    dosage: '500-1000mg twice daily with warm milk',
    contraindications: 'Avoid during pregnancy, autoimmune conditions, or with thyroid medication',
  },
  {
    name: 'Turmeric',
    aka: 'Haldi',
    emoji: '🟡',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop',
    benefits: 'Anti-inflammatory, Skin healing, Antioxidant',
    dosha: 'Tridoshic (all three)',
    description: 'The "Golden Spice" of India. Turmeric\'s active compound curcumin is one of the most researched natural anti-inflammatories. Used for wounds, skin, joints, and digestion.',
    sanskrit: 'हरिद्रा',
    rasa: 'Bitter, Pungent',
    virya: 'Warming',
    vipaka: 'Pungent',
    dosage: '500mg curcumin or 1 tsp turmeric with black pepper in warm milk',
    contraindications: 'Avoid with blood thinners, gallbladder issues, or before surgery',
  },
  {
    name: 'Tulsi',
    aka: 'Holy Basil',
    emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&h=300&fit=crop',
    benefits: 'Immunity, Cold/Respiratory, Stress',
    dosha: 'Kapha & Vata',
    description: 'Revered as sacred in India, Tulsi is a powerful adaptogen that supports respiratory health, immunity, and stress management. Daily use builds natural resistance.',
    sanskrit: 'तुलसी',
    rasa: 'Pungent, Bitter',
    virya: 'Warming',
    vipaka: 'Pungent',
    dosage: '5-6 fresh leaves daily or Tulsi tea 2-3 times',
    contraindications: 'May reduce fertility in high doses; avoid with blood thinners',
  },
  {
    name: 'Neem',
    aka: 'Nimba',
    emoji: '🍃',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop',
    benefits: 'Blood purifier, Skin, Diabetes support',
    dosha: 'Pitta & Kapha',
    description: 'Nature\'s pharmacy. Neem is the most powerful blood purifier in Ayurveda. Used for skin diseases, diabetes, malaria, and as a natural pesticide.',
    sanskrit: 'निम्ब',
    rasa: 'Bitter',
    virya: 'Cooling',
    vipaka: 'Pungent',
    dosage: '2-4 leaves on empty stomach or 500mg neem extract',
    contraindications: 'Avoid for long periods; not for pregnant women or children under 12',
  },
  {
    name: 'Amla',
    aka: 'Indian Gooseberry',
    emoji: '💚',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    benefits: 'Immunity, Hair, Digestion, Anti-aging',
    dosha: 'Tridoshic',
    description: 'The richest natural source of Vitamin C. Amla is the cornerstone of Ayurvedic rejuvenation. It strengthens all tissues, promotes longevity, and enhances beauty.',
    sanskrit: 'आमलकी',
    rasa: 'Sour, Astringent',
    virya: 'Cooling',
    vipaka: 'Sour',
    dosage: '10-20ml juice on empty stomach or 1 tsp powder with honey',
    contraindications: 'May increase acidity in excess; caution with hyperacidity',
  },
  {
    name: 'Brahmi',
    aka: 'Bacopa',
    emoji: '🧠',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    benefits: 'Memory, Brain function, Anxiety',
    dosha: 'Vata & Pitta',
    description: 'The ultimate brain tonic. Brahmi enhances memory, concentration, and intelligence. Used by students and scholars for thousands of years.',
    sanskrit: 'ब्राह्मी',
    rasa: 'Bitter, Sweet',
    virya: 'Cooling',
    vipaka: 'Sweet',
    dosage: '500mg twice daily or 1 tsp powder with honey',
    contraindications: 'May cause nausea initially; avoid with thyroid conditions',
  },
  {
    name: 'Triphala',
    aka: 'Three Fruits',
    emoji: '⚡',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&h=300&fit=crop',
    benefits: 'Digestion, Detox, Eyes, Colon health',
    dosha: 'Tridoshic',
    description: 'Amla + Haritaki + Bibhitaki. The most famous Ayurvedic formula. Triphala gently detoxifies, improves digestion, and nourishes all three doshas.',
    sanskrit: 'त्रिफला',
    rasa: 'All 6 tastes except salty',
    virya: 'Neutral',
    vipaka: 'Sweet',
    dosage: '1 tsp (1-3g) with warm water at bedtime',
    contraindications: 'Avoid during pregnancy (contains Haritaki)',
  },
  {
    name: 'Shatavari',
    aka: 'Wild Asparagus',
    emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    benefits: "Women's health, Fertility, Lactation",
    dosha: 'Vata & Pitta',
    description: 'The "Queen of Herbs" for women. Shatavari supports female reproductive health, increases libido, enhances lactation, and balances hormones.',
    sanskrit: 'शतावरी',
    rasa: 'Sweet, Bitter',
    virya: 'Cooling',
    vipaka: 'Sweet',
    dosage: '500-1000mg twice daily with warm milk',
    contraindications: 'Avoid with estrogen-sensitive conditions; may cause fluid retention',
  },
  {
    name: 'Guduchi',
    aka: 'Giloy / Amrita',
    emoji: '🔗',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    benefits: 'Immunity, Fever, Liver, Anti-inflammatory',
    dosha: 'Tridoshic',
    description: 'The "Root of Immortality". Guduchi is one of the most versatile Ayurvedic herbs — used for fevers, liver disorders, immunity, and chronic diseases.',
    sanskrit: 'गुडूची',
    rasa: 'Bitter',
    virya: 'Warming',
    vipaka: 'Pungent',
    dosage: '500mg twice daily or 10-20ml juice',
    contraindications: 'May lower blood sugar; monitor if diabetic',
  },
  {
    name: 'Arjuna',
    aka: 'Terminalia Arjuna',
    emoji: '❤️',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop',
    benefits: 'Heart health, BP, Cholesterol, Cardiac tonic',
    dosha: 'Pitta & Kapha',
    description: 'The ultimate heart tonic. Arjuna bark strengthens heart muscle, lowers cholesterol, regulates BP, and helps recover from heart attacks.',
    sanskrit: 'अर्जुन',
    rasa: 'Astringent',
    virya: 'Cooling',
    vipaka: 'Pungent',
    dosage: '500mg bark powder twice daily or as directed',
    contraindications: 'Consult doctor if on cardiac medications',
  },
  {
    name: 'Guggulu',
    aka: 'Commiphora Mukul',
    emoji: '💎',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
    benefits: 'Joint pain, Cholesterol, Weight loss, Anti-inflammatory',
    dosha: 'Vata & Kapha',
    description: 'A powerful anti-inflammatory and lipid-lowering herb. Guggulu is the primary herb for arthritis, high cholesterol, and obesity in Ayurveda.',
    sanskrit: 'गुग्गुलु',
    rasa: 'Bitter, Pungent',
    virya: 'Warming',
    vipaka: 'Pungent',
    dosage: '500mg twice daily with warm water after meals',
    contraindications: 'Avoid during pregnancy; may interact with birth control',
  },
  {
    name: 'Shankhpushpi',
    aka: 'Convolvulus Pluricaulis',
    emoji: '🌺',
    image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400&h=300&fit=crop',
    benefits: 'Memory, Sleep, Anxiety, Brain tonic',
    dosha: 'Vata & Pitta',
    description: 'The premier brain rejuvenator. Shankhpushpi enhances memory, promotes deep sleep, reduces anxiety, and sharpens intellect.',
    sanskrit: 'शङ्खपुष्पी',
    rasa: 'Sweet, Bitter',
    virya: 'Cooling',
    vipaka: 'Sweet',
    dosage: '500mg-1g powder with warm milk at bedtime',
    contraindications: 'Generally safe; may cause excessive drowsiness in some',
  },
]

/* ─── Remedies with real photos ─── */
interface Remedy {
  problem: string
  icon: string
  image: string
  herbs: string[]
  remedy: string
  lifestyle: string[]
  severity: 'mild' | 'moderate' | 'chronic'
}

const REMEDIES: Remedy[] = [
  {
    problem: 'Low Immunity & Frequent Cold',
    icon: '🛡️',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    herbs: ['Ashwagandha', 'Tulsi', 'Amla', 'Turmeric'],
    remedy: 'Take 1 tsp Chyawanprash daily with warm milk. Drink Tulsi-Ginger tea 2x daily. Mix 1/4 tsp turmeric + pinch black pepper in warm milk before bed. Take 500mg Ashwagandha with warm milk at night.',
    lifestyle: ['Sleep 7-8 hours', 'Drink warm water throughout day', 'Eat fresh seasonal fruits', 'Pranayama 10 min daily', 'Oil pulling with sesame oil 5 min morning'],
    severity: 'mild',
  },
  {
    problem: 'Stress, Anxiety & Poor Sleep',
    icon: '😴',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop',
    herbs: ['Ashwagandha', 'Brahmi', 'Shankhpushpi', 'Jatamansi'],
    remedy: 'Take Ashwagandha 500mg before bed with warm milk. Brahmi 500mg morning with honey. Shankhpushpi 1 tsp with warm milk at night. Drink chamomile-Tulsi tea 1 hour before bed.',
    lifestyle: ['No screens 1 hour before bed', 'Oil massage (Abhyanga) weekends', 'Meditation 15 min morning', 'Avoid caffeine after 2 PM', 'Practice Yoga Nidra 20 min'],
    severity: 'moderate',
  },
  {
    problem: 'Digestive Problems & Bloating',
    icon: '🫃',
    image: 'https://images.unsplash.com/photo-1519691905694-4cdc5e83c6b8?w=600&h=400&fit=crop',
    herbs: ['Tulsi', 'Turmeric', 'Ajwain', 'Triphala'],
    remedy: 'Drink Ajwain water (1 tsp in warm water) after meals. Triphala 1 tsp at bedtime with warm water. Hing (asafoetida) in cooking daily. Cumin-Coriander-Fennel tea 3x daily.',
    lifestyle: ['Eat at fixed times', 'No water 30 min before/after meals', 'Walk 15 min after dinner', 'Avoid cold drinks with food', 'Chew food 32 times per bite'],
    severity: 'mild',
  },
  {
    problem: 'Joint Pain & Arthritis',
    icon: '🦴',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
    herbs: ['Turmeric', 'Ashwagandha', 'Guggulu', 'Shallaki'],
    remedy: 'Turmeric milk (golden milk) 2x daily with black pepper. Maharasnadi kadha 15ml before meals. Apply warm sesame oil on joints morning. Guggulu 500mg twice daily.',
    lifestyle: ['Gentle yoga stretches daily', 'Warm oil on joints weekly', 'Avoid sour/cold foods', 'Swim or walk 30 min', 'Compression bandaging with warm oil'],
    severity: 'chronic',
  },
  {
    problem: 'Skin Problems — Acne, Pigmentation',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=400&fit=crop',
    herbs: ['Neem', 'Turmeric', 'Aloe Vera', 'Manjistha'],
    remedy: 'Neem face pack (paste) 2x weekly. Drink Amla juice 30ml morning. Apply Aloe vera gel at night. Take Manjistha 500mg for blood purification. Turmeric + honey face mask weekly.',
    lifestyle: ['Wash face 2x daily with neem water', 'Oil pulling 10 min morning', 'Avoid fried/suggy foods', 'Cucumber + Rose water toner', 'Change pillow cover every 3 days'],
    severity: 'moderate',
  },
  {
    problem: 'Hair Fall & Dandruff',
    icon: '💇',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
    herbs: ['Amla', 'Brahmi', 'Bhringraj', 'Neem'],
    remedy: 'Massage with Bhringraj oil weekly (leave overnight). Drink Amla juice daily. Apply Amla-Shikakai paste before wash. Take Brahmi 500mg for hair root strength. Rinse with apple cider vinegar weekly.',
    lifestyle: ['Oil hair every Sunday', 'Use only Shikakai/Amla', 'Avoid hot water on hair', 'Protein-rich diet (dal, paneer)', 'Reduce heat styling completely'],
    severity: 'moderate',
  },
  {
    problem: 'Diabetes & Blood Sugar Control',
    icon: '🩸',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop',
    herbs: ['Neem', 'Bitter Gourd', 'Fenugreek', 'Jamun', 'Gudmar'],
    remedy: 'Drink Karela juice 20ml morning on empty stomach. Fenugreek seeds (soaked overnight) 1 tsp daily. Neem leaves 4-5 daily. Jamun vinegar 1 tsp in water. Gudmar 500mg before meals.',
    lifestyle: ['No rice/roti at night', 'No sugar/jaggery', 'Walk 45 min daily', 'Eat bitter gourd weekly', 'Monitor blood sugar regularly'],
    severity: 'chronic',
  },
  {
    problem: 'High Blood Pressure',
    icon: '❤️‍🩹',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    herbs: ['Arjuna', 'Ashwagandha', 'Brahmi', 'Sarpagandha'],
    remedy: 'Arjuna bark powder 1 tsp with warm water 2x daily. Sarpagandha (with doctor supervision). Brahmi for stress reduction. Lauki (bottle gourd) juice morning. Garlic 2 cloves on empty stomach.',
    lifestyle: ['Reduce salt intake drastically', 'No cigarettes/alcohol', 'Deep breathing 10 min', 'Walk 30 min morning', 'Meditation daily'],
    severity: 'chronic',
  },
  {
    problem: 'Weight Loss & Obesity',
    icon: '⚖️',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    herbs: ['Triphala', 'Guggulu', 'Trikatu', 'Vijaysar'],
    remedy: 'Triphala 1 tsp at bedtime with warm water. Drink lukewarm lemon-honey water morning. Guggulu 500mg after meals. Vijaysar glass water overnight. Green tea with ginger.',
    lifestyle: ['No snacks between meals', 'Dinner before 7 PM', '30 min cardio daily', 'Eat sabzi before roti', 'Kapalabhati pranayama 10 min morning'],
    severity: 'moderate',
  },
  {
    problem: "Women's Health — PCOS, Period Pain",
    icon: '👩',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&h=400&fit=crop',
    herbs: ['Shatavari', 'Ashoka', 'Lodhra', 'Turmeric'],
    remedy: 'Shatavari 500mg daily for hormone balance. Ashoka bark for period pain. Turmeric for inflammation. Aloe vera juice 30ml morning. Lodhra 500mg for heavy bleeding.',
    lifestyle: ['Exercise 30 min daily', 'Reduce stress levels', 'Iron-rich foods (palak, beet)', 'Warm compress for cramps', 'Yoga — Butterfly pose, Cat-cow'],
    severity: 'moderate',
  },
  {
    problem: 'Eye Health & Weak Vision',
    icon: '👁️',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop',
    herbs: ['Amla', 'Triphala', 'Jyotishmati', 'Ghee'],
    remedy: 'Triphala eye wash (weak solution) daily. Amla juice daily for vitamin C. Apply Desi Ghee in navel at night (Ayurvedic remedy). Palming exercise 5 min. Rose water eye drops.',
    lifestyle: ['20-20-20 rule for screens', 'Triphala water eye wash', 'Leafy greens daily', 'Reduce screen time', 'Wear UV-protected sunglasses'],
    severity: 'mild',
  },
  {
    problem: 'Memory & Brain Power',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop',
    herbs: ['Brahmi', 'Shankhpushpi', 'Ashwagandha', 'Amla'],
    remedy: 'Brahmi powder 1/2 tsp with honey daily morning. Walnuts + almonds soaked overnight (5 each). Brahmi Ghrita 1 tsp with warm milk. Shankhpushpi 500mg at bedtime.',
    lifestyle: ['Meditation 20 min daily', 'Learn new skills regularly', 'Adequate sleep 7-8 hrs', 'Omega-3 rich diet', 'Brain games and puzzles'],
    severity: 'mild',
  },
  {
    problem: 'Liver Detox & Jaundice',
    icon: '🫁',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop',
    herbs: ['Kutki', 'Bhumiamla', 'Kalmegh', 'Guduchi'],
    remedy: 'Kutki 500mg twice daily. Bhumiamla juice 20ml morning. Kalmegh tea 2x daily. Guduchi 500mg for liver protection. Punarnava 500mg for water balance.',
    lifestyle: ['No alcohol completely', 'Light, easy-to-digest foods', 'Plenty of water', 'Rest adequately', 'Avoid fried and processed foods'],
    severity: 'chronic',
  },
  {
    problem: 'Kidney Stones & Urinary',
    icon: '🫘',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&h=400&fit=crop',
    herbs: ['Gokshura', 'Punarnava', 'Varuna', 'Pashanbheda'],
    remedy: 'Gokshura 500mg twice daily. Punarnava juice 20ml morning. Drink 3-4 liters water daily. Barley water throughout day. Coconut water daily.',
    lifestyle: ['Reduce salt and oxalate foods', 'Drink coconut water daily', 'Avoid excess tea/coffee', 'Regular exercise', 'Limit red meat and spinach'],
    severity: 'chronic',
  },
  {
    problem: 'Thyroid (Hypo/Hyper)',
    icon: '🦋',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop',
    herbs: ['Guggulu', 'Kanchanar', 'Ashwagandha', 'Brahmi'],
    remedy: 'Kanchanar Guggulu 500mg twice daily. Ashwagandha 500mg for hypothyroid. Brahmi for stress. Consult doctor for dosage. Shigru (Moringa) for thyroid support.',
    lifestyle: ['Avoid cabbage, cauliflower, soy', 'Regular thyroid checkups', 'Yoga — Sarvangasana', 'Reduce stress', 'Iodized salt in moderation'],
    severity: 'chronic',
  },
]

/* ─── Dosha types ─── */
const DOSHAS = [
  {
    name: 'Vata',
    emoji: '💨',
    elements: 'Air + Space',
    image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&h=400&fit=crop',
    traits: ['Creative', 'Energetic', 'Thin build', 'Dry skin', 'Irregular appetite', 'Quick learner'],
    imbalance: ['Anxiety', 'Insomnia', 'Constipation', 'Joint pain', 'Weight loss', 'Restlessness'],
    balance: ['Warm foods', 'Regular routine', 'Oil massage', 'Meditation', 'Sweet/Sour/Salty tastes'],
    season: 'Autumn & Early Winter',
  },
  {
    name: 'Pitta',
    emoji: '🔥',
    elements: 'Fire + Water',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
    traits: ['Sharp intellect', 'Strong digestion', 'Medium build', 'Warm body', 'Ambitious', 'Leader'],
    imbalance: ['Anger', 'Acid reflux', 'Skin rashes', 'Inflammation', 'Excessive heat', 'Impatience'],
    balance: ['Cooling foods', 'Sweet/Bitter/Astringent', 'Avoid spicy', 'Swim', 'Moonlight walks'],
    season: 'Summer & Late Spring',
  },
  {
    name: 'Kapha',
    emoji: '🌍',
    elements: 'Earth + Water',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
    traits: ['Calm', 'Strong build', 'Good immunity', 'Oily skin', 'Deep sleeper', 'Loyal'],
    imbalance: ['Weight gain', 'Lethargy', 'Congestion', 'Depression', 'Slow digestion', 'Attachment'],
    balance: ['Light, dry foods', 'Exercise daily', 'Bitter/Pungent/Astringent', 'Avoid dairy', 'Early morning activity'],
    season: 'Winter & Spring',
  },
]

export default function HealthPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'remedies' | 'herbs' | 'dosha'>('remedies')
  const [selectedHerb, setSelectedHerb] = useState<typeof HERBS[0] | null>(null)
  const [expandedRemedy, setExpandedRemedy] = useState<string | null>(null)

  const filtered = REMEDIES.filter(r =>
    r.problem.toLowerCase().includes(search.toLowerCase()) ||
    r.herbs.some(h => h.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <PageHead
        title="Health Hub — Ayurvedic Remedies, Herbs, Dosha Guide & AI Doctor Consultation"
        description="Free Ayurvedic home remedies for 50+ health problems. Complete herb guide with 100+ Ayurvedic herbs, dosha analysis, and AI-powered doctor consultation. Natural cures with Ashwagandha, Turmeric, Neem, Amla, Tulsi and more."
        keywords={[
          'ayurvedic home remedies', 'natural cure India', 'ayurvedic medicine',
          'ashwagandha benefits', 'turmeric benefits', 'neem benefits',
          'ayurvedic treatment for immunity', 'ayurvedic stress relief',
          'natural weight loss ayurveda', 'ayurvedic skin care',
          'ayurvedic hair fall remedy', 'triphala benefits',
          'home remedies for diabetes', 'ayurvedic BP cure',
          'women health ayurveda', 'PCOS ayurvedic treatment',
          'ayurvedic doctor consultation', 'dosha test', 'vata pitta kapha',
          'ayurvedic herbs guide', 'brahmi benefits', 'shatavari benefits',
        ]}
        canonical="/health"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name: 'Health Hub — Ayurvedic Remedies & AI Doctor',
          description: 'Free Ayurvedic home remedies, herb guide, dosha analysis, and AI doctor consultation',
          specialty: 'Ayurveda',
          url: 'https://infinite-gundawar-webapp.vercel.app/health',
        }}
      />
      <Navbar />
      <PageEnhancements />
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/30">

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* ═══ Hero with real photo background ═══ */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=800&fit=crop"
              alt="Ayurvedic herbs and spices"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-green-900/80" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-emerald-200 text-sm font-medium mb-4 backdrop-blur-sm">
              100% Natural — 5000+ Years of Ayurvedic Wisdom
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-yellow-400">Health</span> Hub — Complete Ayurvedic Guide
            </h1>
            <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto mb-6">
              Home remedies, 100+ herbs with real photos, dosha analysis, and AI doctor consultation — all free.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Link href="/ayurveda" className="px-6 py-3 bg-yellow-400 text-emerald-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors text-sm shadow-lg">
                🌿 Full Ayurveda Encyclopedia
              </Link>
              <a href="#ai-doctor" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm backdrop-blur-sm">
                🩺 AI Doctor Consultation
              </a>
            </div>
            <input
              type="text"
              placeholder="Search health problem or herb... (e.g., immunity, stress, hair fall, ashwagandha)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-xl px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:bg-white/20 backdrop-blur-sm text-lg"
            />
          </div>
        </section>

        {/* ═══ Tab Navigation ═══ */}
        <section className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-3">
              {[
                { id: 'remedies' as const, label: '💊 Home Remedies', count: REMEDIES.length },
                { id: 'herbs' as const, label: '🌿 Herb Guide', count: HERBS.length },
                { id: 'dosha' as const, label: '🔮 Dosha Guide', count: 3 },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label} <span className={`ml-1 text-xs ${activeTab === tab.id ? 'text-emerald-200' : 'text-gray-400'}`}>({tab.count})</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Remedies Tab ═══ */}
        {activeTab === 'remedies' && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-8">
                {search ? `Results for "${search}" (${filtered.length})` : 'Common Health Problems & Natural Remedies'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(remedy => (
                  <div
                    key={remedy.problem}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => setExpandedRemedy(expandedRemedy === remedy.problem ? null : remedy.problem)}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={remedy.image} alt={remedy.problem} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <h3 className="font-bold text-white text-lg leading-tight">{remedy.icon} {remedy.problem}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          remedy.severity === 'chronic' ? 'bg-red-500/80 text-white' :
                          remedy.severity === 'moderate' ? 'bg-yellow-500/80 text-white' :
                          'bg-green-500/80 text-white'
                        }`}>
                          {remedy.severity}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-emerald-700 mb-1.5">🌿 Key Herbs</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {remedy.herbs.map(h => (
                            <span key={h} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">{h}</span>
                          ))}
                        </div>
                      </div>
                      <div className={`overflow-hidden transition-all duration-300 ${expandedRemedy === remedy.problem ? 'max-h-96' : 'max-h-20'}`}>
                        <h4 className="text-xs font-semibold text-gray-700 mb-1">💊 Remedy</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{remedy.remedy}</p>
                        <div className="mt-3">
                          <h4 className="text-xs font-semibold text-gray-700 mb-1">🧘 Lifestyle Tips</h4>
                          <ul className="space-y-1">
                            {remedy.lifestyle.map(tip => (
                              <li key={tip} className="text-xs text-gray-500 flex items-start gap-1">
                                <span className="text-emerald-500 mt-0.5">✓</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <button className="mt-3 text-xs text-emerald-600 font-medium hover:text-emerald-700">
                        {expandedRemedy === remedy.problem ? '▲ Show less' : '▼ Show remedy details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No remedies found for "{search}"</p>
                  <p className="text-gray-300 text-sm mt-2">Try: immunity, stress, digestion, joint pain, skin, hair fall, diabetes, BP, weight loss</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══ Herbs Tab with REAL photos ═══ */}
        {activeTab === 'herbs' && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#0f172a]">🌿 Top Ayurvedic Herbs with Real Photos</h2>
                <Link href="/ayurveda" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-200 transition-colors">
                  View Full Encyclopedia →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {HERBS.map(herb => (
                  <div
                    key={herb.name}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => setSelectedHerb(selectedHerb?.name === herb.name ? null : herb)}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img src={herb.image} alt={herb.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3">
                        <h3 className="font-bold text-white text-sm">{herb.emoji} {herb.name}</h3>
                        <p className="text-xs text-white/70">{herb.aka}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-emerald-700 font-medium mb-1">{herb.benefits}</p>
                      <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs">{herb.dosha}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Herb Detail Modal */}
              {selectedHerb && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedHerb(null)}>
                  <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="relative h-56 overflow-hidden rounded-t-3xl">
                      <img src={selectedHerb.image} alt={selectedHerb.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-6 right-6">
                        <h2 className="text-3xl font-bold text-white">{selectedHerb.emoji} {selectedHerb.name}</h2>
                        <p className="text-white/80">{selectedHerb.aka} • {selectedHerb.sanskrit}</p>
                      </div>
                      <button onClick={() => setSelectedHerb(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30">
                        ✕
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <p className="text-gray-600 leading-relaxed">{selectedHerb.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-gray-500 mb-1">Rasa (Taste)</h4>
                          <p className="font-medium text-[#0f172a]">{selectedHerb.rasa}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-gray-500 mb-1">Virya (Energy)</h4>
                          <p className="font-medium text-[#0f172a]">{selectedHerb.virya}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-gray-500 mb-1">Vipaka (Post-digestive)</h4>
                          <p className="font-medium text-[#0f172a]">{selectedHerb.vipaka}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-gray-500 mb-1">Dosha</h4>
                          <p className="font-medium text-emerald-700">{selectedHerb.dosha}</p>
                        </div>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-1">💊 Dosage</h4>
                        <p className="text-sm text-emerald-700">{selectedHerb.dosage}</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-red-800 mb-1">⚠️ Contraindications</h4>
                        <p className="text-sm text-red-700">{selectedHerb.contraindications}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="font-bold text-[#0f172a] mb-2">📚 Want the Complete Herb Encyclopedia?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our /ayurveda page has 100+ herbs with full Sanskrit names, botanical details, rasa/guna/virya/vipaka, classical uses, formulations, precautions, and evidence ratings — sourced from Charaka Samhita, Sushruta Samhita, and Bhavaprakasha Nighantu.
                </p>
                <Link href="/ayurveda" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm">
                  🌿 Open Ayurveda Encyclopedia
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ═══ Dosha Tab with real photos ═══ */}
        {activeTab === 'dosha' && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-2 text-center">🔮 The Three Doshas — Your Body Constitution</h2>
              <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
                Ayurveda identifies three fundamental energies (doshas) that govern your body and mind. Understanding your dominant dosha helps you live in balance.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {DOSHAS.map(dosha => (
                  <div key={dosha.name} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img src={dosha.image} alt={dosha.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-4xl">{dosha.emoji}</span>
                        <h3 className="text-2xl font-bold text-white mt-1">{dosha.name}</h3>
                        <p className="text-sm text-white/80">{dosha.elements}</p>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 mb-1">Season</h4>
                        <p className="text-sm font-medium text-emerald-700">{dosha.season}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-1">✨ Traits</h4>
                        <ul className="space-y-1">
                          {dosha.traits.map(t => (
                            <li key={t} className="text-xs text-gray-500 flex items-start gap-1"><span className="text-emerald-500">•</span> {t}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-red-600 mb-1">⚠️ When Imbalanced</h4>
                        <ul className="space-y-1">
                          {dosha.imbalance.map(t => (
                            <li key={t} className="text-xs text-gray-500 flex items-start gap-1"><span className="text-red-400">•</span> {t}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-green-600 mb-1">✅ How to Balance</h4>
                        <ul className="space-y-1">
                          {dosha.balance.map(t => (
                            <li key={t} className="text-xs text-gray-500 flex items-start gap-1"><span className="text-green-500">•</span> {t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ AI Doctor Section ═══ */}
        <section id="ai-doctor" className="py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=600&fit=crop"
              alt="Ayurvedic medicine background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 to-teal-900/90" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-emerald-200 text-sm font-medium mb-4 backdrop-blur-sm">
                🤖 Powered by Ayurvedic Intelligence
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                AI Ayurvedic Doctor <span className="text-yellow-400">Consultation</span>
              </h2>
              <p className="text-emerald-100/80 max-w-2xl mx-auto">
                Get a personalized Ayurvedic assessment in minutes. Our AI doctor analyzes your symptoms, determines your dosha imbalance, and recommends herbs, diet, and lifestyle changes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: '📋', title: '5-Step Intake', desc: 'Name, age, gender, symptoms, duration, severity, medical history, sleep, diet, stress, exercise' },
                { icon: '🔍', title: 'Dosha Analysis', desc: 'Identifies Vata, Pitta, or Kapha imbalance based on your symptoms and lifestyle' },
                { icon: '🌿', title: 'Herbal Prescription', desc: 'Specific herbs with dosage, diet plan, lifestyle changes, and urgency warnings' },
              ].map(f => (
                <div key={f.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <span className="text-3xl">{f.icon}</span>
                  <h3 className="text-white font-bold mt-3 mb-2">{f.title}</h3>
                  <p className="text-emerald-100/70 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-emerald-200 text-sm mb-4">👇 Click the <span className="text-yellow-400 font-bold">🩺 heart button</span> in the bottom-right corner to start your consultation</p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
                <span className="text-white text-sm">📞 For in-person consultation:</span>
                <a href="tel:+917****0672" className="text-yellow-400 font-bold hover:underline">+91 79721 40672</a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Quick Links ═══ */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8 text-center">Explore More Health Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: '/ayurveda', icon: '🌿', title: 'Ayurveda Encyclopedia', desc: '100+ herbs, therapies, books', image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=200&h=100&fit=crop' },
                { href: '/health', icon: '💊', title: 'Home Remedies', desc: '15+ health conditions', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=100&fit=crop' },
                { href: '#ai-doctor', icon: '🩺', title: 'AI Doctor Bot', desc: 'Free consultation', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=100&fit=crop' },
                { href: '/finance', icon: '💰', title: 'Health Budget', desc: 'Plan medical expenses', image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=100&fit=crop' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all group">
                  <div className="relative h-20 overflow-hidden">
                    <img src={link.image} alt={link.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/30" />
                    <span className="absolute top-2 left-3 text-2xl">{link.icon}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-[#0f172a] text-sm group-hover:text-emerald-700 transition-colors">{link.title}</h3>
                    <p className="text-xs text-gray-400">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Disclaimer ═══ */}
        <section className="py-8 bg-amber-50 border-t border-amber-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Disclaimer:</strong> These remedies and the AI doctor are for informational purposes only. Always consult a qualified Ayurveda doctor or healthcare provider before starting any treatment, especially if you are pregnant, nursing, or on medication.
            </p>
          </div>
        </section>
      </main>

      {/* ═══ AI Doctor Bot (floating) ═══ */}
      <AIDoctorBot />

      <Footer />
    <GoalModeFeatures page="health" />
    </>
  )
}