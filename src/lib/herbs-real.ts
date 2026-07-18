// Real Ayurvedic Herb Database with actual photographs
// Images from Unsplash (free, no attribution required for hotlinking)

export interface Herb {
  id: string
  name: string
  sanskrit: string
  botanical: string
  family: string
  partsUsed: string[]
  emoji: string
  image: string
  benefits: string[]
  uses: string[]
  dosage: string
  precautions: string
  dosha: string
  category: string
}

export const HERBS: Herb[] = [
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    sanskrit: 'अश्वगंधा',
    botanical: 'Withania somnifera',
    family: 'Solanaceae',
    partsUsed: ['Root', 'Leaves'],
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
    benefits: ['Reduces stress & anxiety', 'Improves sleep quality', 'Boosts strength & muscle', 'Enhances brain function', 'Supports thyroid health'],
    uses: ['Chronic stress', 'Insomnia', 'Fatigue', 'Weakness', 'Anxiety disorders', 'Joint inflammation'],
    dosage: '500-600mg root extract twice daily with warm milk or water',
    precautions: 'Avoid in pregnancy. May interact with thyroid medications.',
    dosha: 'Balances Vata & Kapha. May increase Pitta in excess.',
    category: 'adaptogen'
  },
  {
    id: 'turmeric',
    name: 'Turmeric (Haldi)',
    sanskrit: 'हरिद्रा',
    botanical: 'Curcuma longa',
    family: 'Zingiberaceae',
    partsUsed: ['Rhizome'],
    emoji: '🟡',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop',
    benefits: ['Powerful anti-inflammatory', 'Antioxidant rich', 'Supports joint health', 'Improves skin health', 'Boosts liver function'],
    uses: ['Arthritis & joint pain', 'Skin conditions', 'Digestive issues', 'Liver support', 'Wound healing', 'Cold & cough'],
    dosage: '1/2 to 1 tsp turmeric powder with black pepper, 2x daily with meals',
    precautions: 'High doses may cause stomach upset. Avoid with blood thinners.',
    dosha: 'Balances all three doshas (Tridoshic). Best for Pitta.',
    category: 'anti-inflammatory'
  },
  {
    id: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    sanskrit: 'तुलसी',
    botanical: 'Ocimum sanctum',
    family: 'Lamiaceae',
    partsUsed: ['Leaves', 'Seeds', 'Root'],
    emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&h=300&fit=crop',
    benefits: ['Boosts immunity', 'Reduces stress', 'Respiratory health', 'Antimicrobial', 'Blood sugar control'],
    uses: ['Cold, cough, fever', 'Respiratory infections', 'Stress management', 'Diabetes support', 'Kidney health'],
    dosage: '5-6 fresh leaves daily, or 1-2 tsp dried leaf powder with honey',
    precautions: 'May slow blood clotting. Stop before surgery.',
    dosha: 'Balances Kapha & Vata. Slightly increases Pitta in excess.',
    category: 'immunity'
  },
  {
    id: 'neem',
    name: 'Neem',
    sanskrit: 'निम्ब',
    botanical: 'Azadirachta indica',
    family: 'Meliaceae',
    partsUsed: ['Leaves', 'Bark', 'Seeds', 'Oil'],
    emoji: '🍃',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=300&fit=crop',
    benefits: ['Blood purifier', 'Antidiabetic', 'Skin diseases', 'Dental health', 'Antimalarial'],
    uses: ['Diabetes', 'Skin diseases (eczema, psoriasis)', 'Dental care', 'Malaria', 'Wound healing', 'Hair health'],
    dosage: '2-4 neem leaves on empty stomach, or 5-10 drops neem oil in water',
    precautions: 'Avoid in pregnancy. Can reduce sperm count in high doses.',
    dosha: 'Balances Pitta & Kapha. Increases Vata in excess.',
    category: 'detox'
  },
  {
    id: 'amla',
    name: 'Amla (Indian Gooseberry)',
    sanskrit: 'आमलकी',
    botanical: 'Phyllanthus emblica',
    family: 'Phyllanthaceae',
    partsUsed: ['Fruit', 'Seed', 'Bark'],
    emoji: '💚',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=300&fit=crop',
    benefits: ['Highest vitamin C', 'Anti-aging', 'Hair growth', 'Heart health', 'Immunity booster'],
    uses: ['Hair fall & premature graying', 'Weak immunity', 'Heart disease', 'Diabetes', 'Digestive issues', 'Skin aging'],
    dosage: '30-50ml fresh juice daily, or 1-2 tsp powder with honey/water',
    precautions: 'Sour taste. May worsen acidity in some.',
    dosha: 'Balances all three doshas. Best for Pitta.',
    category: 'tonic'
  },
  {
    id: 'brahmi',
    name: 'Brahmi',
    sanskrit: 'ब्राह्मी',
    botanical: 'Bacopa monnieri',
    family: 'Plantaginaceae',
    partsUsed: ['Leaves', 'Stems'],
    emoji: '🧠',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    benefits: ['Memory enhancement', 'Anxiety relief', 'Brain tonic', 'Improves focus', 'Reduces mental fatigue'],
    uses: ['Memory loss', 'ADHD', 'Anxiety', 'Epilepsy', 'Stress', 'Age-related cognitive decline'],
    dosage: '250-500mg extract twice daily, or 1-2 tsp fresh juice',
    precautions: 'May cause nausea initially. Avoid with thyroid meds.',
    dosha: 'Balances Vata & Pitta. Increases Kapha slightly.',
    category: 'brain'
  },
  {
    id: 'triphala',
    name: 'Triphala',
    sanskrit: 'त्रिफला',
    botanical: 'Three Fruits (Haritaki + Bibhitaki + Amla)',
    family: 'Combination',
    partsUsed: ['Fruits of three plants'],
    emoji: '⚡',
    image: 'https://images.unsplash.com/photo-1515023115894-bacee4e8a6f0?w=400&h=300&fit=crop',
    benefits: ['Digestive tonic', 'Gentle detox', 'Antioxidant', 'Eye health', 'Weight management'],
    uses: ['Constipation', 'Indigestion', 'Eye weakness', 'Weight loss', 'Detoxification', 'Diabetes'],
    dosage: '1 tsp (3-5g) powder with warm water at bedtime',
    precautions: 'May cause loose stools initially. Start with 1/2 tsp.',
    dosha: 'Balances all three doshas (Tridoshic).',
    category: 'digestive'
  },
  {
    id: 'shatavari',
    name: 'Shatavari',
    sanskrit: 'शतावरी',
    botanical: 'Asparagus racemosus',
    family: 'Asparagaceae',
    partsUsed: ['Root', 'Leaves'],
    emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    benefits: ["Women's health tonic", 'Galactagogue (milk production)', 'Hormone balance', 'Digestive soothe', 'Immune support'],
    uses: ['PCOS', 'Menstrual irregularities', 'Menopause symptoms', 'Lactation support', 'Acid reflux', 'Diarrhea'],
    dosage: '500-1000mg powder twice daily with warm milk or water',
    precautions: 'Avoid with estrogen-sensitive conditions.',
    dosha: 'Balances Vata & Pitta. Increases Kapha in excess.',
    category: 'womens'
  },
  {
    id: 'guduchi',
    name: 'Guduchi (Giloy)',
    sanskrit: 'गुडूची',
    botanical: 'Tinospora cordifolia',
    family: 'Menispermaceae',
    partsUsed: ['Stem', 'Leaves', 'Root'],
    emoji: '🔗',
    image: 'https://images.unsplash.com/photo-1597318236275-880d3fa94cd6?w=400&h=300&fit=crop',
    benefits: ['Immunomodulator', 'Antipyretic (fever reducer)', 'Liver protector', 'Anti-inflammatory', 'Antidiabetic'],
    uses: ['Recurrent fevers', 'Liver disease', 'Diabetes', 'Arthritis', 'Skin infections', 'Urinary disorders'],
    dosage: '500mg stem extract twice daily, or 15-20ml decoction',
    precautions: 'May lower blood sugar. Avoid in autoimmune conditions.',
    dosha: 'Balances all three doshas. Best for Pitta.',
    category: 'immunity'
  },
  {
    id: 'arjuna',
    name: 'Arjuna',
    sanskrit: 'अर्जुन',
    botanical: 'Terminalia arjuna',
    family: 'Combretaceae',
    partsUsed: ['Bark', 'Fruit'],
    emoji: '❤️',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=300&fit=crop',
    benefits: ['Cardiac tonic', 'Blood pressure control', 'Cholesterol reduction', 'Heart muscle strengthening', 'Wound healing'],
    uses: ['Heart disease', 'High BP', 'High cholesterol', 'Heart failure', 'Chest pain', 'Skin wounds'],
    dosage: '500mg bark extract twice daily, or 15-20ml decoction',
    precautions: 'May lower BP too much if on BP meds. Monitor regularly.',
    dosha: 'Balances Pitta & Kapha. Increases Vata in excess.',
    category: 'heart'
  },
  {
    id: 'guggulu',
    name: 'Guggulu',
    sanskrit: 'गुग्गुलु',
    botanical: 'Commiphora wightii',
    family: 'Burseraceae',
    partsUsed: ['Gum resin'],
    emoji: '💎',
    image: 'https://images.unsplash.com/photo-1515023115894-bacee4e8a6f0?w=400&h=300&fit=crop',
    benefits: ['Cholesterol lowering', 'Anti-inflammatory', 'Weight management', 'Joint pain relief', 'Acne treatment'],
    uses: ['High cholesterol', 'Obesity', 'Arthritis', 'Acne', 'Thyroid support', 'Atherosclerosis'],
    dosage: '500mg purified guggulu twice daily with warm water',
    precautions: 'Avoid in pregnancy. May cause skin rash.',
    dosha: 'Balances Vata & Kapha. Increases Pitta in excess.',
    category: 'anti-inflammatory'
  },
  {
    id: 'shankhpushpi',
    name: 'Shankhpushpi',
    sanskrit: 'शंखपुष्पी',
    botanical: 'Convolvulus pluricaulis',
    family: 'Convolvulaceae',
    partsUsed: ['Whole plant', 'Leaves'],
    emoji: '🌺',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=300&fit=crop',
    benefits: ['Memory booster', 'Nervine tonic', 'Anxiety relief', 'Blood pressure reducer', 'Hair health'],
    uses: ['Memory loss', 'Insomnia', 'Anxiety', 'High BP', 'Hair fall', 'Mental fatigue'],
    dosage: '250-500mg powder twice daily, or 1-2 tsp syrup',
    precautions: 'May cause excessive drowsiness. Avoid with sedatives.',
    dosha: 'Balances Vata & Pitta. Increases Kapha slightly.',
    category: 'brain'
  },
  {
    id: 'pippali',
    name: 'Pippali (Long Pepper)',
    sanskrit: 'पिप्पली',
    botanical: 'Piper longum',
    family: 'Piperaceae',
    partsUsed: ['Fruit', 'Root'],
    emoji: '🌶️',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    benefits: ['Digestive fire enhancer', 'Respiratory health', 'Bioavailability booster', 'Antidiabetic', 'Detoxifier'],
    uses: ['Indigestion', 'Cold & cough', 'Asthma', 'Diabetes', 'Liver disease', 'Low metabolism'],
    dosage: '250-500mg powder with honey, twice daily',
    precautions: 'Very hot potency. Avoid in high Pitta conditions.',
    dosha: 'Balances Kapha & Vata. Increases Pitta.',
    category: 'digestive'
  },
  {
    id: 'yasthimadhu',
    name: 'Yashtimadhu (Licorice)',
    sanskrit: 'यष्टिमधु',
    botanical: 'Glycyrrhiza glabra',
    family: 'Fabaceae',
    partsUsed: ['Root', 'Rhizome'],
    emoji: '🟤',
    image: 'https://images.unsplash.com/photo-1597318236275-880d3fa94cd6?w=400&h=300&fit=crop',
    benefits: ['Throat soother', 'Adrenal support', 'Anti-inflammatory', 'Digestive soother', 'Respiratory health'],
    uses: ['Sore throat', 'Cough', 'Adrenal fatigue', 'Gastritis', 'Skin inflammation', 'Viral infections'],
    dosage: '250-500mg root powder twice daily, or as lozenge',
    precautions: 'Avoid in high BP, kidney disease, pregnancy.',
    dosha: 'Balances Vata & Pitta. Increases Kapha in excess.',
    category: 'respiratory'
  },
  {
    id: 'kutki',
    name: 'Kutki',
    sanskrit: 'कुटकी',
    botanical: 'Picrorhiza kurroa',
    family: 'Plantaginaceae',
    partsUsed: ['Root', 'Rhizome'],
    emoji: '🟣',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    benefits: ['Liver protector', 'Antioxidant', 'Anti-inflammatory', 'Immunomodulator', 'Antidiabetic'],
    uses: ['Liver disease', 'Jaundice', 'Hepatitis', 'Diabetes', 'Autoimmune conditions', 'Skin diseases'],
    dosage: '250-500mg powder twice daily before meals',
    precautions: 'Bitter taste. Avoid in diarrhea.',
    dosha: 'Balances Pitta & Kapha. Increases Vata.',
    category: 'detox'
  },
  {
    id: 'manjistha',
    name: 'Manjistha',
    sanskrit: 'मञ्जिष्ठा',
    botanical: 'Rubia cordifolia',
    family: 'Rubiaceae',
    partsUsed: ['Root', 'Stem'],
    emoji: '🔴',
    image: 'https://images.unsplash.com/photo-1515023115894-bacee4e8a6f0?w=400&h=300&fit=crop',
    benefits: ['Blood purifier', 'Skin health', 'Anti-inflammatory', 'Liver support', 'Urinary health'],
    uses: ['Skin diseases', 'Pigmentation', 'Acne', 'Urinary tract infections', 'Liver disorders', 'Menstrual disorders'],
    dosage: '250-500mg powder twice daily with water',
    precautions: 'May color urine red (harmless). Avoid in kidney disease.',
    dosha: 'Balances Pitta & Kapha. Increases Vata slightly.',
    category: 'skin'
  },
  {
    id: 'bhringraj',
    name: 'Bhringraj',
    sanskrit: 'भृंगराज',
    botanical: 'Eclipta alba',
    family: 'Asteraceae',
    partsUsed: ['Whole plant', 'Leaves', 'Oil'],
    emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=300&fit=crop',
    benefits: ['Hair growth promoter', 'Liver tonic', 'Skin health', 'Anti-aging', 'Vision support'],
    uses: ['Hair fall', 'Premature graying', 'Liver disease', 'Skin diseases', 'Eye weakness', 'Aging'],
    dosage: '500mg powder twice daily, or apply oil on scalp',
    precautions: 'Cool potency. Safe for most.',
    dosha: 'Balances Vata & Pitta. Increases Kapha slightly.',
    category: 'skin'
  },
  {
    id: 'punarnava',
    name: 'Punarnava',
    sanskrit: 'पुर्णवा',
    botanical: 'Boerhavia diffusa',
    family: 'Nyctaginaceae',
    partsUsed: ['Root', 'Leaves', 'Seeds'],
    emoji: '💧',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=300&fit=crop',
    benefits: ['Diuretic', 'Kidney support', 'Anti-inflammatory', 'Liver health', 'Edema relief'],
    uses: ['Kidney disease', 'Edema', 'Urinary disorders', 'Liver disease', 'Heart failure', 'Ascites'],
    dosage: '250-500mg powder twice daily, or 15-20ml decoction',
    precautions: 'Diuretic. Stay hydrated. Monitor electrolytes.',
    dosha: 'Balances all three doshas.',
    category: 'detox'
  },
  {
    id: 'fenugreek',
    name: 'Fenugreek (Methi)',
    sanskrit: 'मेथी',
    botanical: 'Trigonella foenum-graecum',
    family: 'Fabaceae',
    partsUsed: ['Seeds', 'Leaves'],
    emoji: '🟢',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    benefits: ['Blood sugar control', 'Milk production', 'Digestive health', 'Cholesterol reduction', 'Anti-inflammatory'],
    uses: ['Diabetes', 'Lactation support', 'Indigestion', 'High cholesterol', 'Hair health', 'Joint pain'],
    dosage: '5-30g seeds daily (soaked or sprouted), or 1-2 tsp powder',
    precautions: 'Strong maple syrup smell. Avoid in pregnancy (uterine stimulant).',
    dosha: 'Balances Kapha & Vata. Increases Pitta.',
    category: 'digestive'
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon (Dalchini)',
    sanskrit: 'दारुचिनी',
    botanical: 'Cinnamomum verum',
    family: 'Lauraceae',
    partsUsed: ['Bark', 'Oil', 'Leaves'],
    emoji: '🪵',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    benefits: ['Blood sugar regulation', 'Anti-microbial', 'Digestive aid', 'Circulation booster', 'Anti-inflammatory'],
    uses: ['Type 2 Diabetes', 'Fungal infections', 'Indigestion', 'Cold & flu', 'High cholesterol'],
    dosage: '1-6g bark powder daily, or 1-2 sticks in tea',
    precautions: 'Cassia variety has high coumarin. Use Ceylon for long-term use.',
    dosha: 'Balances Kapha & Vata. Increases Pitta.',
    category: 'digestive'
  }
]

export const CATEGORIES = [
  { id: 'adaptogen', name: 'Adaptogens', emoji: '💪', desc: 'Stress relief & energy' },
  { id: 'digestive', name: 'Digestive', emoji: '🫃', desc: 'Gut health & digestion' },
  { id: 'detox', name: 'Detox & Liver', emoji: '🫁', desc: 'Cleansing & purification' },
  { id: 'brain', name: 'Brain & Memory', emoji: '🧠', desc: 'Cognitive health' },
  { id: 'heart', name: 'Heart & BP', emoji: '❤️', desc: 'Cardiovascular health' },
  { id: 'skin', name: 'Skin & Hair', emoji: '✨', desc: 'Dermatology & beauty' },
  { id: 'immunity', name: 'Immunity', emoji: '🛡️', desc: 'Immune support' },
  { id: 'womens', name: "Women's Health", emoji: '👩', desc: 'Gynecology' },
  { id: 'respiratory', name: 'Respiratory', emoji: '🫁', desc: 'Lungs & breathing' },
  { id: 'anti-inflammatory', name: 'Anti-inflammatory', emoji: '🔥', desc: 'Pain & inflammation' },
  { id: 'tonic', name: 'Rejuvenation', emoji: '⚡', desc: 'Anti-aging & vitality' },
]

export function getHerbsByCategory(category: string): Herb[] {
  return HERBS.filter(h => h.category === category)
}

export function searchHerbs(query: string): Herb[] {
  const q = query.toLowerCase()
  return HERBS.filter(h =>
    h.name.toLowerCase().includes(q) ||
    h.sanskrit.includes(q) ||
    h.botanical.toLowerCase().includes(q) ||
    h.benefits.some(b => b.toLowerCase().includes(q)) ||
    h.uses.some(u => u.toLowerCase().includes(q))
  )
}

export function getHerbById(id: string): Herb | undefined {
  return HERBS.find(h => h.id === id)
}
