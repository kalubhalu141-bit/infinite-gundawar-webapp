'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import SectionTip from '@/components/SectionTip'
import Footer from '@/components/Footer'
import AIDoctorBot from '@/components/AIDoctorBot'
import AyurvedaDoctorScraper from '@/components/AyurvedaDoctorScraper'

/* ─── Massive Herbs Database ─── */
const herbs = [
  { name: 'Ashwagandha', sanskrit: 'अश्वगंधा', image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=600&fit=crop', family: 'Solanaceae', partsUsed: 'Root, Leaves', benefits: ['Reduces stress & anxiety', 'Boosts immunity', 'Improves sleep quality', 'Enhances stamina & energy', 'Supports thyroid function', 'Increases testosterone', 'Improves muscle strength', 'Anti-inflammatory'], usage: 'Take 1-2 tsp of Ashwagandha powder with warm milk before bed. Can also be taken as capsules (300-500mg) twice daily.', dosage: '300-500mg twice daily', precautions: 'Avoid during pregnancy. May interact with thyroid medications.', dosha: 'Balances Vata & Kapha', conditions: ['Stress', 'Anxiety', 'Insomnia', 'Low energy', 'Thyroid', 'Arthritis'] },
  { name: 'Turmeric (Haldi)', sanskrit: 'हरिद्रा', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&h=600&fit=crop', family: 'Zingiberaceae', partsUsed: 'Rhizome', benefits: ['Powerful anti-inflammatory', 'Antioxidant properties', 'Supports joint health', 'Boosts brain function', 'Improves skin health', 'Supports liver detox', 'Heart health', 'Cancer prevention'], usage: 'Add 1 tsp turmeric to warm milk with black pepper (enhances absorption by 2000%). Use in cooking daily.', dosage: '500-1000mg curcumin daily', precautions: 'High doses may cause digestive issues. Avoid before surgery.', dosha: 'Balances all three Doshas', conditions: ['Arthritis', 'Inflammation', 'Skin issues', 'Liver problems', 'Heart disease'] },
  { name: 'Tulsi (Holy Basil)', sanskrit: 'तुलसी', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop', family: 'Lamiaceae', partsUsed: 'Leaves, Seeds', benefits: ['Respiratory health', 'Reduces fever', 'Purifies blood', 'Stress relief', 'Boosts immunity', 'Antimicrobial', 'Blood sugar control', 'Kidney protection'], usage: 'Chew 5-6 fresh leaves daily on empty stomach. Or brew tulsi tea by boiling leaves for 5-10 minutes.', dosage: '5-6 leaves or 1 cup tea daily', precautions: 'May slow blood clotting. Avoid 2 weeks before surgery.', dosha: 'Balances Kapha & Vata', conditions: ['Cold', 'Cough', 'Fever', 'Respiratory', 'Diabetes', 'Stress'] },
  { name: 'Brahmi', sanskrit: 'ब्राह्मी', image: 'https://images.unsplash.com/photo-1515586166318-a2073ffe7b1b?w=800&h=600&fit=crop', family: 'Plantaginaceae', partsUsed: 'Whole plant', benefits: ['Enhances memory & focus', 'Reduces anxiety', 'Supports nervous system', 'Improves learning ability', 'Anti-aging for brain', 'Antioxidant', 'Liver protection', 'Hair growth'], usage: 'Take 1-2 tsp Brahmi powder with honey or ghee. Can also consume as fresh juice (2-3 tsp daily).', dosage: '250-500mg extract twice daily', precautions: 'May cause nausea in high doses. Start with small amounts.', dosha: 'Balances Vata & Pitta', conditions: ['Memory loss', 'Anxiety', 'ADHD', 'Hair fall', 'Epilepsy'] },
  { name: 'Triphala', sanskrit: 'त्रिफला', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop', family: 'Combination', partsUsed: 'Fruits (Amalaki, Bibhitaki, Haritaki)', benefits: ['Digestive health', 'Detoxification', 'Eye health', 'Weight management', 'Boosts immunity', 'Anti-aging', 'Gentle laxative', 'Antioxidant'], usage: 'Mix 1 tsp Triphala powder in warm water. Drink before bed on empty stomach for best results.', dosage: '500-1000mg before bed', precautions: 'Avoid during pregnancy. May cause loose stools initially.', dosha: 'Balances all three Doshas', conditions: ['Constipation', 'Digestive issues', 'Eye problems', 'Obesity', 'Detox'] },
  { name: 'Neem', sanskrit: 'निम्ब', image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=600&fit=crop', family: 'Meliaceae', partsUsed: 'Leaves, Bark, Seeds', benefits: ['Blood purifier', 'Skin health', 'Antibacterial & antiviral', 'Dental health', 'Diabetes support', 'Anti-malarial', 'Wound healing', 'Anti-fungal'], usage: 'Chew 2-3 neem leaves daily. Neem tea can be made by boiling leaves. Apply neem paste for skin issues.', dosage: '2-3 leaves or 250mg extract daily', precautions: 'Bitter taste. Avoid long-term use. Not for children under 12.', dosha: 'Balances Pitta & Kapha', conditions: ['Skin diseases', 'Diabetes', 'Infections', 'Dental issues', 'Malaria'] },
  { name: 'Shatavari', sanskrit: 'शतावरी', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', family: 'Asparagaceae', partsUsed: 'Root', benefits: ["Women's health", 'Reproductive system support', 'Lactation support', 'Digestive health', 'Immune booster', 'Anti-aging', 'Stress relief', 'Hormonal balance'], usage: "Take 1-2 tsp Shatavari powder with warm milk. Especially beneficial for women's hormonal balance.", dosage: '500mg twice daily with milk', precautions: 'Avoid if allergic to asparagus family. Consult doctor if on hormone therapy.', dosha: 'Balances Vata & Pitta', conditions: ['PCOS', 'Menstrual issues', 'Low lactation', 'Menopause', 'Infertility'] },
  { name: 'Giloy (Guduchi)', sanskrit: 'गुडूची', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop', family: 'Menispermaceae', partsUsed: 'Stem, Leaves', benefits: ['Immunity booster', 'Fever management', 'Liver protection', 'Anti-diabetic', 'Digestive health', 'Anti-allergic', 'Rheumatism relief', 'Gout treatment'], usage: 'Boil Giloy stems in water for 10 minutes. Drink the decoction twice daily. Fresh juice can also be consumed.', dosage: '1-2 tsp juice or 250mg extract daily', precautions: 'May lower blood sugar. Monitor if diabetic. Autoimmune conditions — consult doctor.', dosha: 'Balances all three Doshas', conditions: ['Fever', 'Diabetes', 'Liver disease', 'Arthritis', 'Allergies'] },
  { name: 'Amla (Indian Gooseberry)', sanskrit: 'आमलकी', image: 'https://images.unsplash.com/photo-1609501676725-7186f78b4eff?w=800&h=600&fit=crop', family: 'Phyllanthaceae', partsUsed: 'Fruit', benefits: ['Rich in Vitamin C', 'Boosts immunity', 'Improves digestion', 'Hair health', 'Anti-aging', 'Heart health', 'Liver protection', 'Eye health'], usage: 'Eat fresh amla daily or take 1 tsp amla powder with honey. Amla juice can be consumed in the morning.', dosage: '500mg powder or 30ml juice daily', precautions: 'May increase bleeding risk. Avoid before surgery.', dosha: 'Balances all three Doshas', conditions: ['Low immunity', 'Hair fall', 'Digestive issues', 'Heart disease', 'Eye problems'] },
  { name: 'Arjuna', sanskrit: 'अर्जुन', image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=600&fit=crop', family: 'Combretaceae', partsUsed: 'Bark', benefits: ['Heart health', 'Blood pressure control', 'Cholesterol reduction', 'Wound healing', 'Anti-inflammatory', 'Cardiac tonic', 'Stress on heart', 'Angina relief'], usage: 'Take 1-2 tsp Arjuna bark powder with warm water or milk. Can also be taken as capsules (500mg) twice daily.', dosage: '500mg twice daily', precautions: 'May lower blood pressure. Consult doctor if on heart medications.', dosha: 'Balances Pitta & Kapha', conditions: ['Heart disease', 'High BP', 'High cholesterol', 'Chest pain', 'Heart failure'] },
  { name: 'Guggulu', sanskrit: 'गुग्गुल', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop', family: 'Burseraceae', partsUsed: 'Resin', benefits: ['Weight management', 'Cholesterol reduction', 'Joint pain relief', 'Thyroid support', 'Anti-inflammatory', 'Acne treatment', 'Atherosclerosis', 'Obesity'], usage: 'Take 500mg Guggulu extract twice daily with warm water. Best taken after meals.', dosage: '500mg twice daily', precautions: 'May cause digestive upset. Avoid during pregnancy.', dosha: 'Balances Vata & Kapha', conditions: ['Obesity', 'High cholesterol', 'Arthritis', 'Thyroid', 'Acne'] },
  { name: 'Shankhpushpi', sanskrit: 'शंखपुष्पी', image: 'https://images.unsplash.com/photo-1515586166318-a2073ffe7b1b?w=800&h=600&fit=crop', family: 'Convolvulaceae', partsUsed: 'Whole plant, Flowers', benefits: ['Memory enhancement', 'Nervous system tonic', 'Anxiety relief', 'Blood pressure control', 'Epilepsy management', 'Anti-depressant', 'Sleep improvement', 'Mental clarity'], usage: 'Take 1-2 tsp powder with warm milk at bedtime. Fresh juice can also be consumed.', dosage: '250-500mg twice daily', precautions: 'May cause drowsiness. Start with small doses.', dosha: 'Balances Vata & Pitta', conditions: ['Memory loss', 'Anxiety', 'Insomnia', 'Epilepsy', 'Depression'] },
  { name: 'Jatamansi', sanskrit: 'जटामांसी', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', family: 'Caprifoliaceae', partsUsed: 'Rhizome', benefits: ['Calms the mind', 'Insomnia cure', 'Anti-epileptic', 'Blood pressure control', 'Liver protection', 'Anti-stress', 'Memory booster', 'Skin health'], usage: 'Take 250-500mg powder with warm milk before sleep. Can also be used as oil for head massage.', dosage: '250-500mg at bedtime', precautions: 'May cause drowsiness. Avoid with sedative medications.', dosha: 'Balances Vata & Pitta', conditions: ['Insomnia', 'Anxiety', 'Epilepsy', 'High BP', 'Stress'] },
  { name: 'Haritaki', sanskrit: 'हरितकी', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop', family: 'Combretaceae', partsUsed: 'Fruit', benefits: ['Digestive health', 'Detoxification', 'Weight management', 'Eye health', 'Constipation relief', 'Anti-aging', 'Brain health', 'Respiratory health'], usage: 'Take 1 tsp powder with warm water at bedtime. Can also be taken with honey for Vata conditions.', dosage: '500-1000mg at bedtime', precautions: 'Avoid during pregnancy. May cause dehydration.', dosha: 'Balances all three Doshas', conditions: ['Constipation', 'Digestive issues', 'Obesity', 'Eye problems', 'Cough'] },
  { name: 'Bibhitaki', sanskrit: 'बिभीतकी', image: 'https://images.unsplash.com/photo-1609501676725-7186f78b4eff?w=800&h=600&fit=crop', family: 'Combretaceae', partsUsed: 'Fruit', benefits: ['Respiratory health', 'Hair health', 'Eye health', 'Diabetes support', 'Liver protection', 'Sore throat relief', 'Anti-inflammatory', 'Weight management'], usage: 'Take 1 tsp powder with honey for respiratory conditions. Can also be taken with warm water.', dosage: '500-1000mg daily', precautions: 'Avoid during pregnancy. May lower blood sugar.', dosha: 'Balances Kapha & Pitta', conditions: ['Cough', 'Asthma', 'Hair fall', 'Diabetes', 'Liver issues'] },
  { name: 'Pippali (Long Pepper)', sanskrit: 'पिप्पली', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&h=600&fit=crop', family: 'Piperaceae', partsUsed: 'Fruit, Root', benefits: ['Digestive fire enhancer', 'Respiratory health', 'Metabolism booster', 'Detoxification', 'Joint pain relief', 'Liver support', 'Bioavailability enhancer', 'Anti-microbial'], usage: 'Take 1/4 to 1/2 tsp powder with honey after meals. Often combined with other herbs for enhanced absorption.', dosage: '250-500mg with meals', precautions: 'May increase Pitta in excess. Avoid in acute inflammation.', dosha: 'Balances Vata & Kapha', conditions: ['Indigestion', 'Respiratory issues', 'Low metabolism', 'Joint pain', 'Liver problems'] },
  { name: 'Vidanga', sanskrit: 'विडंग', image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=600&fit=crop', family: 'Myrtaceae', partsUsed: 'Fruit', benefits: ['Anti-parasitic', 'Digestive health', 'Weight management', 'Skin diseases', 'Intestinal worms', 'Anti-fungal', 'Metabolism booster', 'Detoxification'], usage: 'Take 1-2 tsp powder with honey on empty stomach. Often combined with Triphala for digestive issues.', dosage: '500-1000mg daily', precautions: 'Avoid during pregnancy. May cause nausea in high doses.', dosha: 'Balances Kapha & Vata', conditions: ['Intestinal worms', 'Obesity', 'Skin diseases', 'Digestive issues', 'Fungal infections'] },
  { name: 'Yashtimadhu (Licorice)', sanskrit: 'यष्टिमधु', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop', family: 'Fabaceae', partsUsed: 'Root', benefits: ['Sore throat relief', 'Respiratory health', 'Digestive soothing', 'Adrenal support', 'Anti-inflammatory', 'Hormonal balance', 'Skin health', 'Stress relief'], usage: 'Take 1 tsp powder with warm water or milk. Can also be used as a throat gargle for sore throat.', dosage: '500mg twice daily', precautions: 'May raise blood pressure. Avoid in hypertension. Not for long-term use.', dosha: 'Balances Vata & Pitta', conditions: ['Sore throat', 'Cough', 'Acid reflux', 'Adrenal fatigue', 'Skin issues'] },
  { name: 'Guduchi Satva', sanskrit: 'गुडूची सत्व', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', family: 'Menispermaceae', partsUsed: 'Stem extract', benefits: ['High potency immunity', 'Fever management', 'Liver protection', 'Anti-diabetic', 'Digestive health', 'Anti-allergic', 'Blood purification', 'Chronic fever'], usage: 'Take 250-500mg with warm water twice daily. Best taken on empty stomach.', dosage: '250-500mg twice daily', precautions: 'May lower blood sugar. Monitor if diabetic.', dosha: 'Balances all three Doshas', conditions: ['Chronic fever', 'Diabetes', 'Liver disease', 'Low immunity', 'Allergies'] },
  { name: 'Kutki', sanskrit: 'कुटकी', image: 'https://images.unsplash.com/photo-1515586166318-a2073ffe7b1b?w=800&h=600&fit=crop', family: 'Plantaginaceae', partsUsed: 'Rhizome, Root', benefits: ['Liver protection', 'Digestive health', 'Weight management', 'Anti-inflammatory', 'Respiratory health', 'Cholesterol reduction', 'Blood sugar control', 'Detoxification'], usage: 'Take 250-500mg powder with warm water before meals. Often combined with other liver herbs.', dosage: '250-500mg twice daily', precautions: 'Very bitter. May cause digestive upset in high doses.', dosha: 'Balances Pitta & Kapha', conditions: ['Liver disease', 'Obesity', 'High cholesterol', 'Diabetes', 'Digestive issues'] },
  { name: 'Manjistha', sanskrit: 'मञ�िष्ठा', image: 'https://images.unsplash.com/photo-1609501676725-7186f78b4eff?w=800&h=600&fit=crop', family: 'Rubiaceae', partsUsed: 'Root, Stem', benefits: ['Blood purifier', 'Skin health', 'Anti-inflammatory', 'Liver support', 'Menstrual health', 'Wound healing', 'Anti-tumor', 'Urinary health'], usage: 'Take 1-2 tsp powder with warm water twice daily. Can also be applied as paste on skin.', dosage: '500mg twice daily', precautions: 'May color urine red (harmless). Avoid during pregnancy.', dosha: 'Balances Pitta & Kapha', conditions: ['Skin diseases', 'Menstrual issues', 'Liver problems', 'Wounds', 'Urinary issues'] },
  { name: 'Kalmegh (Green Chiretta)', sanskrit: 'कालमेघ', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop', family: 'Acanthaceae', partsUsed: 'Whole plant', benefits: ['Immunity booster', 'Fever management', 'Liver protection', 'Anti-viral', 'Digestive health', 'Respiratory health', 'Anti-malarial', 'Blood purification'], usage: 'Take 1-2 tsp juice or 500mg extract twice daily. Bitter taste — can be taken with honey.', dosage: '500mg twice daily', precautions: 'Very bitter. May lower blood sugar. Avoid in pregnancy.', dosha: 'Balances Pitta & Kapha', conditions: ['Fever', 'Liver disease', 'Infections', 'Malaria', 'Low immunity'] },
  { name: 'Vacha', sanskrit: 'वचा', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop', family: 'Araceae', partsUsed: 'Rhizome', benefits: ['Speech improvement', 'Memory enhancement', 'Nervous system tonic', 'Epilepsy management', 'Voice clarity', 'Mental clarity', 'Anti-inflammatory', 'Respiratory health'], usage: 'Take 250-500mg powder with honey. Can also be used as oil for head massage in speech disorders.', dosage: '250-500mg with honey', precautions: 'High doses may cause vomiting. Use under guidance.', dosha: 'Balances Vata & Kapha', conditions: ['Speech disorders', 'Memory loss', 'Epilepsy', 'Hoarse voice', 'Mental fog'] },
  { name: 'Punarnava', sanskrit: 'पुनर्नवा', image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=600&fit=crop', family: 'Nyctaginaceae', partsUsed: 'Root, Whole plant', benefits: ['Kidney support', 'Water retention relief', 'Liver protection', 'Heart health', 'Anti-inflammatory', 'Diuretic', 'Anemia support', 'Digestive health'], usage: 'Take 1-2 tsp powder with warm water twice daily. Can also be consumed as fresh juice.', dosage: '500mg twice daily', precautions: 'May interact with diuretic medications. Consult doctor if on heart meds.', dosha: 'Balances Kapha & Vata', conditions: ['Kidney disease', 'Edema', 'Heart failure', 'Liver disease', 'Anemia'] },
  { name: 'Bhumyamalaki', sanskrit: 'भूम्यामलकी', image: 'https://images.unsplash.com/photo-1515586166318-a2073ffe7b1b?w=800&h=600&fit=crop', family: 'Phyllanthaceae', partsUsed: 'Whole plant', benefits: ['Liver protection', 'Hepatitis support', 'Anti-viral', 'Digestive health', 'Blood sugar control', 'Kidney support', 'Anti-inflammatory', 'Immune support'], usage: 'Take 1-2 tsp juice or 500mg extract twice daily. Highly effective for liver conditions.', dosage: '500mg twice daily', precautions: 'May lower blood sugar. Monitor if diabetic.', dosha: 'Balances Pitta & Kapha', conditions: ['Hepatitis', 'Liver disease', 'Diabetes', 'Kidney issues', 'Jaundice'] },
]

const herbCategories = ['All', 'Adaptogen', 'Digestive', 'Respiratory', 'Heart & Blood', 'Brain & Nervous', 'Skin & Beauty', 'Women\'s Health', 'Liver & Detox', 'Immunity', 'Joint & Muscle']

const herbCategoryMap: Record<string, string[]> = {
  'Adaptogen': ['Ashwagandha', 'Shatavari', 'Guduchi Satva', 'Jatamansi', 'Shankhpushpi'],
  'Digestive': ['Triphala', 'Haritaki', 'Pippali', 'Vidanga', 'Yashtimadhu', 'Kutki'],
  'Respiratory': ['Tulsi', 'Bibhitaki', 'Vacha', 'Yashtimadhu', 'Kalmegh'],
  'Heart & Blood': ['Arjuna', 'Manjistha', 'Punarnava', 'Guggulu'],
  'Brain & Nervous': ['Brahmi', 'Shankhpushpi', 'Jatamansi', 'Vacha', 'Ashwagandha'],
  'Skin & Beauty': ['Neem', 'Turmeric', 'Manjistha', 'Amla', 'Kutki'],
  "Women's Health": ['Shatavari', 'Ashwagandha', 'Manjistha', 'Yashtimadhu'],
  'Liver & Detox': ['Giloy (Guduchi)', 'Kutki', 'Bhumyamalaki', 'Kalmegh', 'Punarnava', 'Guduchi Satva'],
  'Immunity': ['Tulsi', 'Amla', 'Giloy (Guduchi)', 'Guduchi Satva', 'Kalmegh', 'Ashwagandha'],
  'Joint & Muscle': ['Ashwagandha', 'Turmeric', 'Guggulu', 'Pippali', 'Giloy (Guduchi)'],
}

/* ─── AI Herb Finder Bot ─── */
function AIHerbFinderBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{role: 'user' | 'bot', text: string}>>([
    { role: 'bot', text: '🌿 **Namaste! I\'m HerbFinder AI**\n\nI can help you find the perfect Ayurvedic herb for any health concern. Try asking me:\n\n• "Which herb is good for stress?"\n• "Find herbs for diabetes"\n• "What helps with hair fall?"\n• "Herbs for joint pain"\n• "Best herbs for immunity"\n\nJust type your health concern below! 👇' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const findHerbs = (query: string): string => {
    const lower = query.toLowerCase()
    const matchedHerbs: typeof herbs = []

    // Search by conditions
    herbs.forEach(herb => {
      const matchCondition = herb.conditions.some(c => lower.includes(c.toLowerCase()))
      const matchBenefit = herb.benefits.some(b => lower.includes(b.toLowerCase()))
      const matchName = herb.name.toLowerCase().includes(lower)
      const matchDosha = lower.includes(herb.dosha.toLowerCase())
      if (matchCondition || matchBenefit || matchName || matchDosha) {
        matchedHerbs.push(herb)
      }
    })

    // Keyword matching
    const keywordMap: Record<string, string[]> = {
      'stress': ['Stress', 'Anxiety'],
      'anxiety': ['Anxiety', 'Stress'],
      'sleep': ['Insomnia'],
      'insomnia': ['Insomnia'],
      'diabetes': ['Diabetes'],
      'sugar': ['Diabetes'],
      'hair': ['Hair fall', 'Hair health'],
      'fall': ['Hair fall'],
      'joint': ['Arthritis', 'Joint pain'],
      'arthritis': ['Arthritis'],
      'pain': ['Joint pain', 'Arthritis'],
      'immunity': ['Low immunity'],
      'immune': ['Low immunity'],
      'cough': ['Cough', 'Respiratory'],
      'cold': ['Cold', 'Respiratory'],
      'liver': ['Liver disease', 'Liver problems'],
      'skin': ['Skin diseases', 'Skin issues', 'Acne'],
      'acne': ['Acne'],
      'weight': ['Obesity', 'Weight management'],
      'obesity': ['Obesity'],
      'memory': ['Memory loss'],
      'brain': ['Memory loss', 'Mental clarity'],
      'heart': ['Heart disease', 'Heart failure'],
      'blood pressure': ['High BP', 'Heart disease'],
      'bp': ['High BP'],
      'cholesterol': ['High cholesterol'],
      'thyroid': ['Thyroid'],
      'digestion': ['Digestive issues', 'Indigestion', 'Constipation'],
      'constipation': ['Constipation'],
      'period': ['Menstrual issues', 'PCOS'],
      'pcos': ['PCOS'],
      'menstrual': ['Menstrual issues'],
      'fever': ['Fever', 'Chronic fever'],
      'inflammation': ['Inflammation', 'Arthritis'],
      'detox': ['Detox'],
      'aging': ['Anti-aging'],
      'energy': ['Low energy', 'Fatigue'],
      'fatigue': ['Fatigue', 'Adrenal fatigue'],
      'depression': ['Depression'],
      'focus': ['Memory loss', 'ADHD'],
      'adhd': ['ADHD'],
      'wound': ['Wounds'],
      'urinary': ['Urinary issues'],
      'kidney': ['Kidney disease'],
      'edema': ['Edema'],
      'anemia': ['Anemia'],
      'malaria': ['Malaria'],
      'allergy': ['Allergies'],
      'asthma': ['Asthma'],
      'epilepsy': ['Epilepsy'],
      'speech': ['Speech disorders'],
      'voice': ['Hoarse voice'],
    }

    for (const [keyword, conditions] of Object.entries(keywordMap)) {
      if (lower.includes(keyword)) {
        herbs.forEach(herb => {
          if (herb.conditions.some(c => conditions.some(cond => c.includes(cond))) && !matchedHerbs.includes(herb)) {
            matchedHerbs.push(herb)
          }
        })
      }
    }

    if (matchedHerbs.length === 0) {
      return `I couldn't find specific herbs for "${query}". Here are some popular herbs to explore:\n\n🌿 **Top Recommended Herbs:**\n• Ashwagandha — Stress & energy\n• Turmeric — Inflammation\n• Triphala — Digestion\n• Tulsi — Immunity\n• Brahmi — Brain health\n\nTry asking about a specific condition like "stress", "diabetes", "hair fall", "joint pain", etc.`
    }

    const topHerbs = matchedHerbs.slice(0, 5)
    let response = `🌿 **Found ${matchedHerbs.length} herb(s) for "${query}":**\n\n`
    topHerbs.forEach((herb, i) => {
      response += `**${i + 1}. ${herb.name}** (${herb.sanskrit})\n`
      response += `   📋 Parts: ${herb.partsUsed}\n`
      response += `   🎯 Key benefits: ${herb.benefits.slice(0, 3).join(', ')}\n`
      response += `   💊 Dosage: ${herb.dosage}\n`
      response += `   ⚖️ Dosha: ${herb.dosha}\n\n`
    })

    if (matchedHerbs.length > 5) {
      response += `...and ${matchedHerbs.length - 5} more herbs. Ask about a specific herb for details!\n\n`
    }

    response += `---\n📞 **For personalized consultation:** +91 79721 40672\n⚠️ *Always consult an Ayurvedic doctor before starting new herbs.*`

    return response
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user' as const, text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = findHerbs(input)
      setMessages(prev => [...prev, { role: 'bot', text: response }])
      setIsTyping(false)
    }, 800)
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group">
        <span className="text-2xl">🌿</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-400 rounded-full animate-pulse border-2 border-white" />
        <span className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">🌿 Herb Finder AI</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[440px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <div><h3 className="font-bold text-sm">AI Herb Finder</h3><p className="text-xs text-emerald-200">{herbs.length} herbs in database</p></div>
        </div>
        <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-md' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start"><div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm"><div className="flex gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></div></div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
        {['Stress', 'Diabetes', 'Hair fall', 'Joint pain', 'Immunity', 'Digestion'].map(q => (
          <button key={q} onClick={() => { setInput(q); setTimeout(() => { setMessages(prev => [...prev, { role: 'user', text: q }]); setIsTyping(true); setTimeout(() => { setMessages(prev => [...prev, { role: 'bot', text: findHerbs(q) }]); setIsTyping(false) }, 800) }, 100) }}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-emerald-100">{q}</button>
        ))}
      </div>
      <form onSubmit={e => { e.preventDefault(); sendMessage() }} className="p-3 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about any health concern..."
            className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-100" />
          <button type="submit" disabled={!input.trim()} className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white disabled:opacity-40">➤</button>
        </div>
      </form>
    </div>
  )
}

/* ─── Herbs Section ─── */
function HerbsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHerb, setSelectedHerb] = useState(0)

  const filteredHerbs = herbs.filter(h => {
    const matchCat = selectedCategory === 'All' || (herbCategoryMap[selectedCategory] && herbCategoryMap[selectedCategory].includes(h.name))
    const matchSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())) || h.conditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  const herb = filteredHerbs[selectedHerb] || filteredHerbs[0]

  return (
    <section id="herbs" className="py-16">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">🌿 Medicinal Herbs Encyclopedia</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">{herbs.length}+ Powerful Ayurvedic Herbs & Their Medicinal Uses</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Nature's pharmacy — each herb has been used for thousands of years in Ayurvedic medicine</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-6">
        <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSelectedHerb(0) }} placeholder="Search herbs by name, benefit, or condition..."
          className="w-full px-5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {herbCategories.map(cat => (
          <button key={cat} onClick={() => { setSelectedCategory(cat); setSelectedHerb(0) }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Herbs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        {filteredHerbs.map((h, i) => (
          <button key={h.name} onClick={() => setSelectedHerb(i)}
            className={`p-3 rounded-xl text-left transition-all ${selectedHerb === i ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-300' : 'bg-white border border-gray-100 hover:border-emerald-300 hover:shadow-md'}`}>
            <div className="w-full h-16 rounded-lg overflow-hidden mb-2">
              <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
            </div>
            <h5 className={`font-semibold text-xs ${selectedHerb === i ? 'text-white' : 'text-[#0f172a]'}`}>{h.name}</h5>
            <p className={`text-[10px] mt-0.5 ${selectedHerb === i ? 'text-emerald-100' : 'text-gray-400'}`}>{h.sanskrit}</p>
          </button>
        ))}
      </div>

      {/* Selected Herb Detail */}
      {herb && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-2">
            <div className="relative h-80 md:h-auto">
              <img src={herb.image} alt={herb.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm opacity-80">{herb.sanskrit}</p>
                <h3 className="text-2xl font-bold">{herb.name}</h3>
                <p className="text-xs opacity-70 mt-1">Family: {herb.family} • Parts: {herb.partsUsed}</p>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div>
                <h4 className="font-bold text-[#0f172a] mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>Health Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {herb.benefits.map(b => (<span key={b} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">{b}</span>))}
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <h5 className="font-semibold text-emerald-800 text-sm mb-1">How to Use</h5>
                <p className="text-sm text-emerald-700">{herb.usage}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-3"><p className="text-xs text-blue-500 font-medium">Dosage</p><p className="text-sm font-semibold text-blue-800">{herb.dosage}</p></div>
                <div className="bg-purple-50 rounded-xl p-3"><p className="text-xs text-purple-500 font-medium">Dosha</p><p className="text-sm font-semibold text-purple-800">{herb.dosha}</p></div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3"><p className="text-xs text-amber-500 font-medium">⚠️ Precautions</p><p className="text-sm text-amber-800">{herb.precautions}</p></div>
              <div><h5 className="font-semibold text-[#0f172a] text-sm mb-1">Treats Conditions:</h5><div className="flex flex-wrap gap-1">{herb.conditions.map(c => (<span key={c} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{c}</span>))}</div></div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* ─── Therapies, Books, HealthTips (unchanged) ─── */
const therapies = [
  { name: 'Panchakarma', icon: '🧘', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop', description: 'The ultimate Ayurvedic detoxification therapy involving five purification procedures.', procedures: ['Vamana', 'Virechana', 'Basti', 'Nasya', 'Raktamokshana'], duration: '14-21 days', benefits: 'Complete body detox, immunity boost, chronic disease management' },
  { name: 'Abhyanga', icon: '💆', image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop', description: 'Full-body warm oil massage using medicated herbal oils.', procedures: ['Warm oil preparation', 'Full-body massage', 'Steam therapy', 'Rest'], duration: '60-90 min', benefits: 'Improved circulation, stress relief, skin nourishment' },
  { name: 'Shirodhara', icon: '🫗', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop', description: 'Warm medicated oil poured on the forehead (third eye).', procedures: ['Oil preparation', 'Oil stream on forehead', 'Head massage'], duration: '30-45 min', benefits: 'Anxiety relief, insomnia cure, mental clarity' },
  { name: 'Nasya', icon: '👃', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop', description: 'Herbal oils administered through the nasal passage.', procedures: ['Face massage', 'Steam', 'Oil drops in nostrils'], duration: '30 min', benefits: 'Sinus relief, migraine cure, memory enhancement' },
]

const books = [
  { title: 'Charaka Samhita', author: 'Charaka', description: 'Foundational text of Ayurvedic medicine.', year: '300 BCE', category: 'Classical' },
  { title: 'Sushruta Samhita', author: 'Sushruta', description: 'Surgical treatise of Ayurveda.', year: '600 BCE', category: 'Surgery' },
  { title: 'Ashtanga Hridaya', author: 'Vagbhata', description: 'Comprehensive compilation of Ayurvedic knowledge.', year: '7th Century', category: 'Comprehensive' },
  { title: 'Bhavaprakasha', author: 'Bhavamishra', description: 'Medicinal plants and their properties.', year: '16th Century', category: 'Materia Medica' },
  { title: 'Sharangadhara Samhita', author: 'Sharangadhara', description: 'Pharmaceutical preparations and formulations.', year: '13th Century', category: 'Pharmacy' },
  { title: 'Madhava Nidana', author: 'Madhavakara', description: 'Disease diagnosis and classification.', year: '8th Century', category: 'Diagnosis' },
]

const healthTips = [
  { category: 'Morning Routine', icon: '🌅', tips: ['Wake up before sunrise (Brahma Muhurta)', 'Drink warm water with lemon and honey', 'Practice oil pulling for 10-15 minutes', 'Do 15-20 minutes of yoga', 'Practice Pranayama for 10 minutes'] },
  { category: 'Diet & Nutrition', icon: '🍽️', tips: ['Eat according to your Dosha', 'Include all 6 tastes in every meal', 'Eat largest meal at lunch', 'Avoid ice-cold drinks with meals', 'Use spices like cumin, coriander, fennel daily'] },
  { category: 'Sleep & Rest', icon: '😴', tips: ['Sleep by 10 PM', 'Avoid screens 1 hour before bed', 'Massage feet with warm sesame oil', 'Keep bedroom cool and dark', 'Aim for 7-8 hours of sleep'] },
  { category: 'Mental Wellness', icon: '🧠', tips: ['Practice meditation 15-20 min daily', 'Practice gratitude daily', 'Spend time in nature', 'Limit social media to 30 min', 'Practice deep breathing when stressed'] },
  { category: 'Seasonal Care', icon: '🍂', tips: ['Follow Ritucharya (seasonal regimen)', 'Spring: Detox with light foods', 'Summer: Cooling foods', 'Winter: Heavy, warming foods'] },
  { category: 'Daily Detox', icon: '🧹', tips: ['Drink warm water throughout the day', 'Eat Triphala before bed', 'Practice tongue scraping', 'Dry brush skin before bathing'] },
]

function TherapiesSection() {
  return (
    <section className="py-16 bg-emerald-50/50">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">🧘 Therapies</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Traditional Healing Therapies</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {therapies.map(t => (
          <div key={t.name} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
            <div className="relative h-48 overflow-hidden">
              <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white"><span className="text-2xl mr-2">{t.icon}</span><span className="font-bold text-lg">{t.name}</span></div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-3">{t.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">{t.procedures.map(p => (<span key={p} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">{p}</span>))}</div>
              <div className="flex justify-between text-xs"><span className="text-gray-500">⏱️ {t.duration}</span><span className="text-emerald-600 font-medium">{t.benefits}</span></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BooksSection() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">📚 Sacred Texts</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Foundational Ayurvedic Books</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {books.map(b => (
          <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl mb-4">📖</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">{b.category}</span>
            <h3 className="font-bold text-[#0f172a] mt-2 mb-1">{b.title}</h3>
            <p className="text-xs text-gray-400 mb-2">By {b.author} • {b.year}</p>
            <p className="text-sm text-gray-600">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HealthTipsSection() {
  const [active, setActive] = useState(0)
  const tip = healthTips[active]
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">💚 Daily Wellness</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Healthy Living Tips</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {healthTips.map((t, i) => (
          <button key={t.category} onClick={() => setActive(i)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${active === i ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'}`}>
            <span>{t.icon}</span>{t.category}
          </button>
        ))}
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6"><span className="text-3xl">{tip.icon}</span><h3 className="text-xl font-bold text-[#0f172a]">{tip.category}</h3></div>
        <div className="grid sm:grid-cols-2 gap-4">
          {tip.tips.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl"><span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 flex-shrink-0">{i + 1}</span><p className="text-sm text-gray-700">{t}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section id="consultation" className="py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">👨‍⚕️ Doctor Consultation</span>
          <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Book an Ayurvedic Consultation</h2>
          <p className="text-gray-600 text-sm">🆓 First consultation is FREE! Call <a href="tel:+917972140672" className="font-bold text-emerald-600">+91 79721 40672</a></p>
        </div>
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"><span className="text-4xl mb-4 block">✅</span><h3 className="text-xl font-bold text-emerald-800 mb-2">Consultation Request Submitted!</h3><p className="text-emerald-600 text-sm">Our doctor will contact you within 24 hours.</p></div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Your name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="+91 XXXXX XXXXX" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Health Concern *</label><select required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"><option>Select Concern</option><option>Digestive Issues</option><option>Stress & Anxiety</option><option>Joint Pain</option><option>Skin Problems</option><option>Weight Management</option><option>Women's Health</option><option>General Wellness</option><option>Other</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Describe Symptoms</label><textarea rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none resize-none" placeholder="Describe your symptoms..." /></div>
            <div className="flex gap-4">
              <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg">Book Free Consultation 🌿</button>
              <a href="tel:+917972140672" className="px-6 py-4 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-100 flex items-center gap-2">📞 Call Now</a>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

/* ─── Main Page ─── */
export default function AyurvedaPage() {
  return (<>
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageEnhancements />
      <SectionTip topic="ayurveda" />
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop" alt="Ayurveda" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-emerald-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-emerald-300 text-sm font-medium mb-6 backdrop-blur-sm">🌿 5000+ Years of Ancient Wisdom</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">Ayurveda &<br /><span className="text-emerald-300">Natural Health</span></h1>
            <p className="text-lg text-white/70 mb-8">{herbs.length}+ medicinal herbs, traditional therapies, classical texts, and AI-powered herb finder — all in one place.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#consultation" className="px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:shadow-lg">🆓 Free Consultation</a>
              <a href="#herbs" className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10">Explore {herbs.length}+ Herbs</a>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HerbsSection />
        <TherapiesSection />
        <BooksSection />
        <HealthTipsSection />
        <ConsultationForm />
        <AyurvedaDoctorScraper />
      </div>
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-white font-medium text-center">🆓 Need immediate Ayurvedic advice? Call our doctor for FREE!</p>
          <a href="tel:+917972140672" className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:shadow-lg flex items-center gap-2 whitespace-nowrap">📞 +91 79721 40672</a>
        </div>
      </div>
      <AIDoctorBot />
      <AIHerbFinderBot />
      <Footer />
    </div>
    <GoalModeFeatures page="ayurveda" />
  </>
  )
}
