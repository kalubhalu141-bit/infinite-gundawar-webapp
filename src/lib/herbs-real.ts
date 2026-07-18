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
  },
  // ── Expanded real Ayurvedic pharmacopoeia (verifiable species) ──
  {
    id: 'giloy', name: 'Giloy (Guduchi)', sanskrit: 'गुडूची', botanical: 'Tinospora cordifolia',
    family: 'Menispermaceae', partsUsed: ['Stem', 'Leaves'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=300&fit=crop',
    benefits: ['Boosts immunity', 'Reduces fever', 'Detoxifies liver', 'Anti-inflammatory', 'Improves digestion'],
    uses: ['Dengue fever', 'Chronic fever', 'Immunity', 'Jaundice', 'Digestive weakness'],
    dosage: '500mg stem extract 2x daily or 30ml juice',
    precautions: 'Avoid in autoimmune conditions without supervision.',
    dosha: 'Balances all three doshas (Tridosha shamak).', category: 'immunity'
  },
  {
    id: 'tulsi', name: 'Tulsi (Holy Basil)', sanskrit: 'तुलसी', botanical: 'Ocimum sanctum',
    family: 'Lamiaceae', partsUsed: ['Leaves'], emoji: '🌱',
    image: 'https://images.unsplash.com/photo-1509423351508-170456f53f19?w=400&h=300&fit=crop',
    benefits: ['Immunity booster', 'Respiratory relief', 'Stress reducer', 'Anti-microbial', 'Blood purifier'],
    uses: ['Cough', 'Cold', 'Asthma', 'Fever', 'Stress'],
    dosage: '2-3 fresh leaves or 1 tsp powder with warm water',
    precautions: 'Avoid excess in pregnancy (emmenagogue).',
    dosha: 'Balances Kapha & Vata.', category: 'respiratory'
  },
  {
    id: 'amla', name: 'Amla (Indian Gooseberry)', sanskrit: 'आमलकी', botanical: 'Phyllanthus emblica',
    family: 'Phyllanthaceae', partsUsed: ['Fruit'], emoji: '🍏',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    benefits: ['Rich in Vitamin C', 'Antioxidant', 'Hair health', 'Improves vision', 'Supports liver'],
    uses: ['Hair fall', 'Immunity', 'Diabetes', 'Anemia', 'Digestive tonic'],
    dosage: '1-2 fruits or 500mg powder daily',
    precautions: 'Generally safe; may aggravate Pitta in excess.',
    dosha: 'Balances all doshas, especially Pitta.', category: 'immunity'
  },
  {
    id: 'neem', name: 'Neem', sanskrit: 'निंब', botanical: 'Azadirachta indica',
    family: 'Meliaceae', partsUsed: ['Leaves', 'Bark'], emoji: '🌳',
    image: 'https://images.unsplash.com/photo-1610448719910-c4ee4243d9a8?w=400&h=300&fit=crop',
    benefits: ['Blood purifier', 'Anti-bacterial', 'Skin health', 'Controls blood sugar', 'Dental care'],
    uses: ['Acne', 'Skin diseases', 'Diabetes', 'Infections', 'Dandruff'],
    dosage: '5-10 drops juice or 500mg powder',
    precautions: 'Avoid in pregnancy; can lower fertility temporarily.',
    dosha: 'Balances Kapha & Pitta.', category: 'skin'
  },
  {
    id: 'triphala', name: 'Triphala', sanskrit: 'त्रिफला', botanical: 'Terminalia chebula+bellirica+emblica',
    family: 'Combretaceae', partsUsed: ['Fruit'], emoji: '🫐',
    image: 'https://images.unsplash.com/photo-1590165482129-1ac3db8f1e33?w=400&h=300&fit=crop',
    benefits: ['Gentle detox', 'Improves digestion', 'Eye health', 'Antioxidant', 'Bowel regularity'],
    uses: ['Constipation', 'Digestive tonic', 'Detox', 'Eye strain', 'Weight management'],
    dosage: '1 tsp powder with warm water at night',
    precautions: 'May cause loose stools initially.',
    dosha: 'Balances all doshas.', category: 'detox'
  },
  {
    id: 'shilajit', name: 'Shilajit', sanskrit: 'शिलाजीत', botanical: 'Asphaltum (mineral pitch)',
    family: 'Mineral', partsUsed: ['Resin'], emoji: '🪨',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400&h=300&fit=crop',
    benefits: ['Rejuvenator', 'Boosts energy', 'Improves strength', 'Anti-aging', 'Supports testosterone'],
    uses: ['Fatigue', 'Weakness', 'Low vitality', 'Diabetes', 'Joint pain'],
    dosage: '300-500mg purified resin with milk',
    precautions: 'Use only purified shilajit; raw may contain heavy metals.',
    dosha: 'Balances Vata & Kapha.', category: 'tonic'
  },
  {
    id: 'brahmi', name: 'Brahmi', sanskrit: 'ब्राह्मी', botanical: 'Bacopa monnieri',
    family: 'Plantaginaceae', partsUsed: ['Leaves'], emoji: '🍃',
    image: 'https://images.unsplash.com/photo-1463320726281-696a5a1338c6?w=400&h=300&fit=crop',
    benefits: ['Memory enhancer', 'Calms mind', 'Neuroprotective', 'Reduces anxiety', 'Improves focus'],
    uses: ['Memory loss', 'Anxiety', 'ADHD', 'Insomnia', 'Cognitive decline'],
    dosage: '250-500mg powder 2x daily',
    precautions: 'Generally safe; may slow heart rate slightly.',
    dosha: 'Balances Vata & Pitta.', category: 'brain'
  },
  {
    id: 'shankhpushpi', name: 'Shankhpushpi', sanskrit: 'शंखपुष्पी', botanical: 'Convolvulus pluricaulis',
    family: 'Convolvulaceae', partsUsed: ['Leaves'], emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    benefits: ['Brain tonic', 'Calms mind', 'Improves memory', 'Reduces anxiety', 'Promotes sleep'],
    uses: ['Anxiety', 'Memory', 'Insomnia', 'Mental fatigue', 'Stress'],
    dosage: '250mg powder at bedtime',
    precautions: 'Generally safe.',
    dosha: 'Balances Vata & Pitta.', category: 'brain'
  },
  {
    id: 'guduchi', name: 'Guduchi', sanskrit: 'गुडूची', botanical: 'Tinospora cordifolia',
    family: 'Menispermaceae', partsUsed: ['Stem'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
    benefits: ['Immunomodulator', 'Anti-pyretic', 'Liver protector', 'Anti-diabetic', 'Anti-inflammatory'],
    uses: ['Fever', 'Immunity', 'Jaundice', 'Diabetes', 'Allergies'],
    dosage: '500mg extract 2x daily',
    precautions: 'Avoid in pregnancy without advice.',
    dosha: 'Balances all doshas.', category: 'immunity'
  },
  {
    id: 'arjuna', name: 'Arjuna', sanskrit: 'अर्जुन', botanical: 'Terminalia arjuna',
    family: 'Combretaceae', partsUsed: ['Bark'], emoji: '🌲',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
    benefits: ['Heart tonic', 'Supports circulation', 'Lowers BP', 'Strengthens myocardium', 'Antioxidant'],
    uses: ['Heart disease', 'High BP', 'Angina', 'Palpitations', 'Cholesterol'],
    dosage: '500mg powder 2x daily with milk',
    precautions: 'Consult doctor if on cardiac medication.',
    dosha: 'Balances Kapha & Pitta.', category: 'heart'
  },
  {
    id: 'punarnava', name: 'Punarnava', sanskrit: 'पुनर्नवा', botanical: 'Boerhavia diffusa',
    family: 'Nyctaginaceae', partsUsed: ['Root'], emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    benefits: ['Diuretic', 'Kidney support', 'Reduces edema', 'Liver tonic', 'Anti-inflammatory'],
    uses: ['Kidney stones', 'Edema', 'Ascites', 'Urinary issues', 'Liver'],
    dosage: '500mg powder 2x daily',
    precautions: 'Use caution in pregnancy.',
    dosha: 'Balances Kapha.', category: 'detox'
  },
  {
    id: 'ginger', name: 'Ginger (Adrak)', sanskrit: 'आर्द्रक', botanical: 'Zingiber officinale',
    family: 'Zingiberaceae', partsUsed: ['Rhizome'], emoji: '🫚',
    image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=300&fit=crop',
    benefits: ['Digestive stimulant', 'Anti-nausea', 'Anti-inflammatory', 'Clears congestion', 'Boosts circulation'],
    uses: ['Nausea', 'Indigestion', 'Cold', 'Arthritis', 'Cough'],
    dosage: '1 tsp fresh/raw or 500mg powder',
    precautions: 'May thin blood; avoid before surgery.',
    dosha: 'Balances Vata & Kapha.', category: 'digestive'
  },
  {
    id: 'cinnamon', name: 'Cinnamon (Dalchini)', sanskrit: 'त्वक्', botanical: 'Cinnamomum verum',
    family: 'Lauraceae', partsUsed: ['Bark'], emoji: '🟤',
    image: 'https://images.unsplash.com/photo-1606914469633-bd39206cd3b8?w=400&h=300&fit=crop',
    benefits: ['Blood sugar control', 'Warming', 'Anti-microbial', 'Digestive aid', 'Circulation'],
    uses: ['Diabetes', 'Cold', 'Digestive weakness', 'PCOS', 'Poor circulation'],
    dosage: '1/2 tsp powder daily',
    precautions: 'Avoid in pregnancy in large amounts.',
    dosha: 'Balances Kapha & Vata.', category: 'digestive'
  },
  {
    id: 'cumin', name: 'Cumin (Jeera)', sanskrit: 'जीरक', botanical: 'Cuminum cyminum',
    family: 'Apiaceae', partsUsed: ['Seed'], emoji: '🟫',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    benefits: ['Digestive aid', 'Relieves gas', 'Iron source', 'Anti-microbial', 'Lactation support'],
    uses: ['Bloating', 'Indigestion', 'Gas', 'Anemia', 'Low milk supply'],
    dosage: '1 tsp roasted powder with meals',
    precautions: 'Generally safe.',
    dosha: 'Balances all doshas.', category: 'digestive'
  },
  {
    id: 'coriander', name: 'Coriander (Dhania)', sanskrit: 'धान्यक', botanical: 'Coriandrum sativum',
    family: 'Apiaceae', partsUsed: ['Seed', 'Leaves'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop',
    benefits: ['Cooling', 'Digestive', 'Detox', 'Cholesterol lowering', 'Anti-anxiety'],
    uses: ['Acidity', 'Urinary issues', 'Fever', 'Digestion', 'Skin rash'],
    dosage: '1 tsp seed powder',
    precautions: 'Generally safe.',
    dosha: 'Balances Pitta & Kapha.', category: 'digestive'
  },
  {
    id: 'fennel', name: 'Fennel (Saunf)', sanskrit: 'मधुरिका', botanical: 'Foeniculum vulgare',
    family: 'Apiaceae', partsUsed: ['Seed'], emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1502741126161-b048400d085d?w=400&h=300&fit=crop',
    benefits: ['Relieves gas', 'Cooling', 'Lactation', 'Breath freshener', 'Digestive'],
    uses: ['Bloating', 'Indigestion', 'Low milk', 'Acidity', 'Cramps'],
    dosage: '1 tsp seeds after meals',
    precautions: 'Generally safe.',
    dosha: 'Balances Vata & Pitta.', category: 'digestive'
  },
  {
    id: 'cardamom', name: 'Cardamom (Elaichi)', sanskrit: 'एला', botanical: 'Elettaria cardamomum',
    family: 'Zingiberaceae', partsUsed: ['Seed'], emoji: '🟢',
    image: 'https://images.unsplash.com/photo-1606914469633-bd39206cd3b8?w=400&h=300&fit=crop',
    benefits: ['Digestive', 'Breath freshener', 'Detox', 'Respiratory', 'Mood lifting'],
    uses: ['Indigestion', 'Bad breath', 'Nausea', 'Cough', 'Detox'],
    dosage: '1-2 pods daily',
    precautions: 'Generally safe.',
    dosha: 'Balances all doshas.', category: 'digestive'
  },
  {
    id: 'clove', name: 'Clove (Laung)', sanskrit: 'लवङ्ग', botanical: 'Syzygium aromaticum',
    family: 'Myrtaceae', partsUsed: ['Flower bud'], emoji: '🟤',
    image: 'https://images.unsplash.com/photo-1599639668273-01a8e17b50e0?w=400&h=300&fit=crop',
    benefits: ['Analgesic', 'Anti-microbial', 'Dental', 'Digestive', 'Warming'],
    uses: ['Toothache', 'Cough', 'Indigestion', 'Sore throat', 'Bad breath'],
    dosage: '1-2 buds or oil for topical',
    precautions: 'Avoid in pregnancy; use sparingly.',
    dosha: 'Balances Kapha & Vata.', category: 'anti-inflammatory'
  },
  {
    id: 'black-pepper', name: 'Black Pepper (Marich)', sanskrit: 'मरिच', botanical: 'Piper nigrum',
    family: 'Piperaceae', partsUsed: ['Fruit'], emoji: '⚫',
    image: 'https://images.unsplash.com/photo-1618164435680-daafb9b1ac8f?w=400&h=300&fit=crop',
    benefits: ['Bio-enhancer', 'Digestive fire', 'Decongestant', 'Anti-oxidant', 'Metabolism'],
    uses: ['Poor digestion', 'Cold', 'Cough', 'Obesity', 'Asthma'],
    dosage: 'Pinch with meals (with ghee/honey)',
    precautions: 'Heating; avoid excess in Pitta.',
    dosha: 'Balances Kapha & Vata.', category: 'digestive'
  },
  {
    id: 'pippali', name: 'Pippali (Long Pepper)', sanskrit: 'पिप्पली', botanical: 'Piper longum',
    family: 'Piperaceae', partsUsed: ['Fruit'], emoji: '🌶️',
    image: 'https://images.unsplash.com/photo-1618164435680-daafb9b1ac8f?w=400&h=300&fit=crop',
    benefits: ['Respiratory tonic', 'Digestive', 'Rejuvenator', 'Bio-enhancer', 'Metabolism'],
    uses: ['Asthma', 'Cough', 'Cold', 'Weak digestion', 'Anemia'],
    dosage: '250mg powder with honey',
    precautions: 'Heating; avoid in pregnancy.',
    dosha: 'Balances Kapha & Vata.', category: 'respiratory'
  },
  {
    id: 'licorice', name: 'Licorice (Mulethi)', sanskrit: 'यष्टिमधु', botanical: 'Glycyrrhiza glabra',
    family: 'Fabaceae', partsUsed: ['Root'], emoji: '🟫',
    image: 'https://images.unsplash.com/photo-1599639668273-01a8e17b50e0?w=400&h=300&fit=crop',
    benefits: ['Soothing', 'Respiratory', 'Digestive', 'Anti-ulcer', 'Hormonal'],
    uses: ['Cough', 'Sore throat', 'Acidity', 'Ulcer', 'Low weight'],
    dosage: '250mg powder with warm water',
    precautions: 'Avoid in hypertension (contains glycyrrhizin).',
    dosha: 'Balances Vata & Pitta.', category: 'respiratory'
  },
  {
    id: 'vijayasar', name: 'Vijayasar (Kino)', sanskrit: 'विजयसार', botanical: 'Pterocarpus marsupium',
    family: 'Fabaceae', partsUsed: ['Bark'], emoji: '🌳',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
    benefits: ['Anti-diabetic', 'Blood sugar', 'Cardiac', 'Antioxidant', 'Wound healing'],
    uses: ['Diabetes', 'High cholesterol', 'Obesity', 'Bleeding', 'Fracture'],
    dosage: '500mg bark powder or water kept overnight in wooden glass',
    precautions: 'Consult doctor if on diabetic medication.',
    dosha: 'Balances Kapha.', category: 'heart'
  },
  {
    id: 'kutki', name: 'Kutki', sanskrit: 'कट्की', botanical: 'Picrorhiza kurroa',
    family: 'Plantaginaceae', partsUsed: ['Root'], emoji: '🪴',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=300&fit=crop',
    benefits: ['Liver protector', 'Detox', 'Immunity', 'Anti-inflammatory', 'Fever'],
    uses: ['Jaundice', 'Fatty liver', 'Allergy', 'Asthma', 'Fever'],
    dosage: '250-500mg powder',
    precautions: 'Avoid in pregnancy; auto-immune caution.',
    dosha: 'Balances Pitta & Kapha.', category: 'detox'
  },
  {
    id: 'bhringraj', name: 'Bhringraj', sanskrit: 'भृङ्गराज', botanical: 'Eclipta alba',
    family: 'Asteraceae', partsUsed: ['Leaves'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    benefits: ['Hair growth', 'Liver tonic', 'Brain', 'Anti-aging', 'Sleep'],
    uses: ['Hair fall', 'Premature graying', 'Liver', 'Insomnia', 'Memory'],
    dosage: '250mg powder with sesame oil (external) or milk',
    precautions: 'Generally safe.',
    dosha: 'Balances Pitta & Kapha.', category: 'skin'
  },
  {
    id: 'jatamansi', name: 'Jatamansi', sanskrit: 'जटामांसी', botanical: 'Nardostachys jatamansi',
    family: 'Caprifoliaceae', partsUsed: ['Root'], emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1509423351508-170456f53f19?w=400&h=300&fit=crop',
    benefits: ['Natural tranquilizer', 'Calms mind', 'Sleep', 'Memory', 'Pitta pacifier'],
    uses: ['Anxiety', 'Insomnia', 'Epilepsy', 'Hysteria', 'Mental agitation'],
    dosage: '250mg powder with warm water',
    precautions: 'Avoid in pregnancy.',
    dosha: 'Balances Vata & Pitta.', category: 'brain'
  },
  {
    id: 'shatavari', name: 'Shatavari', sanskrit: 'शतावरी', botanical: 'Asparagus racemosus',
    family: 'Asparagaceae', partsUsed: ['Root'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    benefits: ['Female tonic', 'Lactation', 'Rejuvenator', 'Hormonal balance', 'Cooling'],
    uses: ['Low milk supply', 'Menopause', 'PMS', 'Infertility', 'Acidity'],
    dosage: '500mg powder 2x daily with milk',
    precautions: 'Avoid in fluid retention.',
    dosha: 'Balances Vata & Pitta.', category: 'womens'
  },
  {
    id: 'ashoka', name: 'Ashoka', sanskrit: 'अशोक', botanical: 'Saraca asoca',
    family: 'Fabaceae', partsUsed: ['Bark'], emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    benefits: ['Female tonic', 'Uterine health', 'Menstrual regulator', 'Anti-inflammatory', 'Blood purifier'],
    uses: ['Menstrual disorders', 'PCOD', 'Leucorrhea', 'Dysmenorrhea', 'Uterine bleeding'],
    dosage: '500mg bark powder',
    precautions: 'Avoid in pregnancy.',
    dosha: 'Balances Pitta & Kapha.', category: 'womens'
  },
  {
    id: 'lodhra', name: 'Lodhra', sanskrit: 'लोध्र', botanical: 'Symplocos racemosa',
    family: 'Symplocaceae', partsUsed: ['Bark'], emoji: '🌳',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
    benefits: ['Female tonic', 'Astringent', 'Skin', 'Anti-inflammatory', 'Wound heal'],
    uses: ['Leucorrhea', 'Menorrhagia', 'Skin diseases', 'Bleeding', 'Diarrhea'],
    dosage: '250-500mg powder',
    precautions: 'Avoid in pregnancy.',
    dosha: 'Balances Kapha & Pitta.', category: 'womens'
  },
  {
    id: 'gokshura', name: 'Gokshura', sanskrit: 'गोक्षुर', botanical: 'Tribulus terrestris',
    family: 'Zygophyllaceae', partsUsed: ['Fruit'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1463320726281-696a5a1338c6?w=400&h=300&fit=crop',
    benefits: ['Urinary', 'Kidney', 'Libido', 'Strength', 'Diuretic'],
    uses: ['Kidney stones', 'UTI', 'Low vitality', 'Prostate', 'Gout'],
    dosage: '500mg powder 2x daily',
    precautions: 'Generally safe.',
    dosha: 'Balances Vata & Kapha.', category: 'detox'
  },
  {
    id: 'varuna', name: 'Varuna', sanskrit: 'वरुण', botanical: 'Crataeva nurvala',
    family: 'Capparaceae', partsUsed: ['Bark'], emoji: '🌳',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    benefits: ['Kidney stone', 'Diuretic', 'Urinary', 'Anti-inflammatory', 'Prostate'],
    uses: ['Kidney stones', 'BPH', 'UTI', 'Edema', 'Gout'],
    dosage: '500mg powder',
    precautions: 'Use caution in pregnancy.',
    dosha: 'Balances Kapha.', category: 'detox'
  },
  {
    id: 'kanchnar', name: 'Kanchnar', sanskrit: 'कण्चनार', botanical: 'Bauhinia variegata',
    family: 'Fabaceae', partsUsed: ['Bark'], emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    benefits: ['Lymphatic', 'Thyroid', 'Detox', 'Anti-tumor', 'Wound heal'],
    uses: ['Thyroid', 'Lumps', 'Cysts', 'Lymphadenopathy', 'Tumors'],
    dosage: '500mg bark powder',
    precautions: 'Consult doctor for thyroid.',
    dosha: 'Balances Kapha.', category: 'detox'
  },
  {
    id: 'haritaki', name: 'Haritaki', sanskrit: 'हरितकी', botanical: 'Terminalia chebula',
    family: 'Combretaceae', partsUsed: ['Fruit'], emoji: '🫐',
    image: 'https://images.unsplash.com/photo-1590165482129-1ac3db8f1e33?w=400&h=300&fit=crop',
    benefits: ['Digestive', 'Rejuvenator', 'Detox', 'Anti-aging', 'Brain'],
    uses: ['Constipation', 'Detox', 'Memory', 'Eye', 'Longevity'],
    dosage: '1-2 fruits powder at night',
    precautions: 'May cause loose stools.',
    dosha: 'Balances all doshas.', category: 'detox'
  },
  {
    id: 'bibhitaki', name: 'Bibhitaki', sanskrit: 'बिभीतक', botanical: 'Terminalia bellirica',
    family: 'Combretaceae', partsUsed: ['Fruit'], emoji: '🫐',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    benefits: ['Respiratory', 'Detox', 'Eye', 'Hair', 'Metabolism'],
    uses: ['Cough', 'Asthma', 'Detox', 'Hair', 'Obesity'],
    dosage: '1-2 fruits powder',
    precautions: 'Avoid in pregnancy.',
    dosha: 'Balances Kapha.', category: 'respiratory'
  },
  {
    id: 'musta', name: 'Musta (Nutgrass)', sanskrit: 'मुस्ता', botanical: 'Cyperus rotundus',
    family: 'Cyperaceae', partsUsed: ['Tuber'], emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=300&fit=crop',
    benefits: ['Digestive', 'Antipyretic', 'Cooling', 'Diarrhea', 'Bleeding'],
    uses: ['Diarrhea', 'Dysentery', 'Fever', 'Bleeding', 'Thirst'],
    dosage: '250-500mg powder',
    precautions: 'Generally safe.',
    dosha: 'Balances Pitta & Kapha.', category: 'digestive'
  },
  {
    id: 'vidanga', name: 'Vidanga', sanskrit: 'विडङ्ग', botanical: 'Embelia ribes',
    family: 'Primulaceae', partsUsed: ['Fruit'], emoji: '🟤',
    image: 'https://images.unsplash.com/photo-1606914469633-bd39206cd3b8?w=400&h=300&fit=crop',
    benefits: ['Anti-parasitic', 'Digestive', 'Detox', 'Anti-microbial', 'Weight'],
    uses: ['Worms', 'Indigestion', 'Bad breath', 'Obesity', 'Skin'],
    dosage: '250-500mg powder',
    precautions: 'Avoid in pregnancy.',
    dosha: 'Balances Kapha & Vata.', category: 'digestive'
  },
  {
    id: 'chitrak', name: 'Chitrak', sanskrit: 'चित्रक', botanical: 'Plumbago zeylanica',
    family: 'Plumbaginaceae', partsUsed: ['Root'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop',
    benefits: ['Digestive fire', 'Metabolism', 'Anti-worm', 'Circulation', 'Detox'],
    uses: ['Poor digestion', 'Obesity', 'Worms', 'Edema', 'Anemia'],
    dosage: '125-250mg powder with ginger',
    precautions: 'Strong; avoid in pregnancy & ulcers.',
    dosha: 'Balances Kapha & Vata.', category: 'digestive'
  },
  {
    id: 'daruharidra', name: 'Daruharidra (Tree Turmeric)', sanskrit: 'दारुहरिद्रा', botanical: 'Berberis aristata',
    family: 'Berberidaceae', partsUsed: ['Stem', 'Root'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1502741126161-b048400d085d?w=400&h=300&fit=crop',
    benefits: ['Anti-diabetic', 'Eye', 'Skin', 'Liver', 'Anti-microbial'],
    uses: ['Diabetes', 'Eye diseases', 'Skin', 'Jaundice', 'Bleeding'],
    dosage: '250-500mg powder',
    precautions: 'Avoid in pregnancy.',
    dosha: 'Balances Kapha & Pitta.', category: 'detox'
  },
  {
    id: 'kumari', name: 'Kumari (Aloe Vera)', sanskrit: 'कुमारी', botanical: 'Aloe barbadensis',
    family: 'Asphodelaceae', partsUsed: ['Leaf gel'], emoji: '🌵',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop',
    benefits: ['Skin', 'Digestive', 'Liver', 'Hair', 'Wound heal'],
    uses: ['Constipation', 'Skin', 'Burns', 'Hair', 'Jaundice'],
    dosage: '10-20ml juice',
    precautions: 'Avoid in pregnancy (late); may cause cramps.',
    dosha: 'Balances Pitta & Kapha.', category: 'skin'
  },
  {
    id: 'manjistha', name: 'Manjistha', sanskrit: 'मञ्जिष्ठा', botanical: 'Rubia cordifolia',
    family: 'Rubiaceae', partsUsed: ['Root'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1463320726281-696a5a1338c6?w=400&h=300&fit=crop',
    benefits: ['Blood purifier', 'Skin', 'Detox', 'Lymphatic', 'Anti-inflammatory'],
    uses: ['Skin diseases', 'Acne', 'Lymph', 'Wounds', 'Gout'],
    dosage: '250-500mg powder',
    precautions: 'Generally safe.',
    dosha: 'Balances Pitta & Kapha.', category: 'skin'
  },
  {
    id: 'sariva', name: 'Sariva (Indian Sarsaparilla)', sanskrit: 'सारिवा', botanical: 'Hemidesmus indicus',
    family: 'Apocynaceae', partsUsed: ['Root'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    benefits: ['Blood purifier', 'Cooling', 'Detox', 'Skin', 'Urinary'],
    uses: ['Skin diseases', 'Fever', 'UTI', 'Syphilis', 'Bleeding'],
    dosage: '250-500mg powder',
    precautions: 'Generally safe.',
    dosha: 'Balances Pitta & Kapha.', category: 'skin'
  },
  {
    id: 'yashtimadhu', name: 'Yashtimadhu', sanskrit: 'यष्टिमधु', botanical: 'Glycyrrhiza glabra',
    family: 'Fabaceae', partsUsed: ['Root'], emoji: '🟫',
    image: 'https://images.unsplash.com/photo-1599639668273-01a8e17b50e0?w=400&h=300&fit=crop',
    benefits: ['Soothing', 'Respiratory', 'Digestive', 'Anti-ulcer', 'Hair darkening'],
    uses: ['Cough', 'Sore throat', 'Acidity', 'Ulcer', 'Hair graying'],
    dosage: '250mg powder',
    precautions: 'Avoid in hypertension.',
    dosha: 'Balances Vata & Pitta.', category: 'respiratory'
  },
  {
    id: 'tagar', name: 'Tagar (Valerian)', sanskrit: 'टगर', botanical: 'Valeriana wallichii',
    family: 'Caprifoliaceae', partsUsed: ['Root'], emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1509423351508-170456f53f19?w=400&h=300&fit=crop',
    benefits: ['Sedative', 'Sleep', 'Calm', 'Muscle relax', 'Anxiety'],
    uses: ['Insomnia', 'Anxiety', 'Muscle spasm', 'Nervousness', 'Headache'],
    dosage: '250mg powder at bedtime',
    precautions: 'Avoid with alcohol/sedatives.',
    dosha: 'Balances Vata & Pitta.', category: 'brain'
  },
  {
    id: 'vacha', name: 'Vacha', sanskrit: 'वचा', botanical: 'Acorus calamus',
    family: 'Acoraceae', partsUsed: ['Rhizome'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=300&fit=crop',
    benefits: ['Brain', 'Speech', 'Digestive', 'Decongestant', 'Memory'],
    uses: ['Speech delay', 'Memory', 'Cough', 'Indigestion', 'Epilepsy'],
    dosage: '125-250mg powder',
    precautions: 'Avoid in pregnancy; use small doses.',
    dosha: 'Balances Kapha & Vata.', category: 'brain'
  },
  {
    id: 'medha', name: 'Medha (Honeywort)', sanskrit: 'मेधा', botanical: 'Polygonatum cirrhifolium',
    family: 'Asparagaceae', partsUsed: ['Root'], emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    benefits: ['Brain tonic', 'Memory', 'Rejuvenator', 'Nerve', 'Immunity'],
    uses: ['Memory', 'Nerve weakness', 'Immunity', 'Convalescence', 'Fatigue'],
    dosage: '250mg powder',
    precautions: 'Generally safe.',
    dosha: 'Balances Vata & Pitta.', category: 'brain'
  },
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
