// Real Disease-Symptom Database for AI Doctor
// Maps symptoms → conditions → Ayurvedic herbs & treatments

export interface Disease {
  id: string
  name: string
  category: string
  commonSymptoms: string[]
  description: string
  ayurvedicView: string
  herbs: { name: string; herbId: string; why: string; dosage: string }[]
  homeRemedies: string[]
  diet: string[]
  yogaTherapy: string[]
  lifestyle: string[]
  redFlags: string[]
  severity: 'mild' | 'moderate' | 'serious'
  seeDoctorIf: string
}

export const DISEASES: Disease[] = [
  {
    id: 'stress-anxiety',
    name: 'Stress & Anxiety',
    category: 'Mental Health',
    commonSymptoms: ['anxiety', 'stress', 'worry', 'nervousness', 'racing thoughts', 'tension', 'restlessness', 'panic'],
    description: 'Chronic stress and anxiety affect mind and body. Ayurveda sees this as Vata imbalance aggravating the nervous system.',
    ayurvedicView: 'Vata dosha imbalance affecting Majja Dhatu (nervous tissue). Prana Vayu disruption causes mental agitation.',
    herbs: [
      { name: 'Ashwagandha', herbId: 'ashwagandha', why: 'Adaptogenic — reduces cortisol, calms nervous system', dosage: '500mg extract 2x daily with warm milk' },
      { name: 'Brahmi', herbId: 'brahmi', why: 'Brain tonic — calms mind, improves clarity', dosage: '250-500mg powder 2x daily' },
      { name: 'Shankhpushpi', herbId: 'shankhpushpi', why: 'Nervine tonic — reduces anxiety, promotes sleep', dosage: '250mg powder at bedtime' },
      { name: 'Jatamansi', herbId: 'shankhpushpi', why: 'Natural tranquilizer — deep calm without drowsiness', dosage: '250mg powder with warm water' },
    ],
    homeRemedies: [
      'Warm milk with Ashwagandha powder at bedtime',
      'Oil massage (Abhyanga) with warm sesame oil on scalp and feet',
      'Brahmi ghee — 1 tsp with warm milk morning',
      'Soaked almonds + saffron in milk',
      'Aromatherapy with lavender or sandalwood essential oil'
    ],
    diet: ['Warm, nourishing foods', 'Sweet, sour, salty tastes', 'Ghee, milk, nuts, seeds', 'Avoid caffeine, alcohol, dry/cold foods', 'Regular meal times'],
    yogaTherapy: ['Shavasana (Corpse Pose)', 'Balasana (Child Pose)', 'Pranayama — Nadi Shodhana (Alternate Nostril)', 'Yoga Nidra (Guided Meditation)', 'Slow Surya Namaskar'],
    lifestyle: ['Oil pulling with sesame oil', 'Regular sleep schedule — sleep by 10 PM', 'Nature walks', 'Digital detox 1 hour before bed', 'Abhyanga (self-massage) daily'],
    redFlags: ['Panic attacks', 'Thoughts of self-harm', 'Inability to function daily', 'Chest pain', 'Severe insomnia > 1 week'],
    severity: 'moderate',
    seeDoctorIf: 'Symptoms persist > 2 weeks, or if interfering with daily functioning, or suicidal thoughts.'
  },
  {
    id: 'insomnia',
    name: 'Insomnia (Sleep Disorders)',
    category: 'Mental Health',
    commonSymptoms: ['insomnia', 'sleepless', 'cannot sleep', 'waking up', 'restless sleep', 'night waking', 'early awakening'],
    description: 'Difficulty falling or staying sleeping. Ayurveda considers this a Vata imbalance — the mind cannot settle.',
    ayurvedicView: 'Vata aggravation in Manovaha Srotas (mind channels). Excess Rajas quality in mind. Prana Vayu dysfunction.',
    herbs: [
      { name: 'Ashwagandha', herbId: 'ashwagandha', why: 'Promotes deep sleep without drowsiness', dosage: '500mg with warm milk at bedtime' },
      { name: 'Brahmi', herbId: 'brahmi', why: 'Calms racing thoughts, quiets mind', dosage: '250mg with warm water before bed' },
      { name: 'Tagar (Valerian)', herbId: 'shankhpushpi', why: 'Natural sedative — used as alternative to valerian', dosage: '250mg powder at bedtime' },
    ],
    homeRemedies: [
      'Warm milk + nutmeg powder (1/8 tsp) + ashwagandha at bedtime',
      'Apply Brahmi oil or coconut oil on scalp before sleep',
      'Soaked dates + warm milk at bedtime',
      'Foot massage with warm sesame oil before bed',
      'Nasal drops (Nasya) with 2 drops warm ghee or Anu Taila'
    ],
    diet: ['Light dinner — finish by 7 PM', 'Warm milk with spices', 'Avoid caffeine after 2 PM', 'Sweet fruits like banana, figs', 'Kitchari for dinner'],
    yogaTherapy: ['Yoga Nidra (most effective)', 'Shavasana with deep breathing', 'Pranayama — Bhramari (Humming Bee)', 'Gentle forward bends', 'Moon salutations'],
    lifestyle: ['Sleep by 10 PM (Kapha time — natural sleep)', 'Dark, cool bedroom', 'No screens 1 hour before bed', 'Consistent wake time', 'Abhyanga before bedtime'],
    redFlags: ['Chronic insomnia > 1 month', 'Sleep apnea symptoms', 'Severe daytime fatigue', 'Depression', 'Night terrors'],
    severity: 'moderate',
    seeDoctorIf: 'Sleep disruption > 4 weeks, loud snoring, excessive daytime sleepiness, depression.'
  },
  {
    id: 'diabetes',
    name: 'Type 2 Diabetes (Prameha)',
    category: 'Metabolic',
    commonSymptoms: ['diabetes', 'blood sugar', 'high sugar', 'frequent urination', 'thirsty', 'weight loss', 'blurry vision', 'tired', 'fatigue', 'numbness'],
    description: 'Chronic blood sugar elevation. Ayurveda classifies 20 types of Prameha; Type 2 is primarily Kapha imbalance.',
    ayurvedicView: 'Kapha dosha imbalance with Meda Dhatu (fat tissue) and Mutra (urine) involvement. Dhatwagni Mandya (weak tissue metabolism).',
    herbs: [
      { name: 'Turmeric', herbId: 'turmeric', why: 'Insulin sensitizer — improves glucose uptake', dosage: '500mg extract 2x daily or 1 tsp powder with meals' },
      { name: 'Neem', herbId: 'neem', why: 'Blood sugar regulator — bitter principle lowers glucose', dosage: '5-10 drops neem juice on empty stomach' },
      { name: 'Fenugreek (Methi)', herbId: 'fenugreek', why: 'Soluble fiber slows sugar absorption', dosage: '10-20g soaked seeds on empty stomach' },
      { name: 'Guduchi', herbId: 'guduchi', why: 'Immunomodulator + antidiabetic — protects pancreas', dosage: '500mg extract 2x daily' },
      { name: 'Amla', herbId: 'amla', why: 'Vitamin C + antioxidant — protects blood vessels', dosage: '500mg powder or 30ml juice daily' },
    ],
    homeRemedies: [
      'Bitter gourd (karela) juice — 2 tbsp on empty stomach',
      'Fenugreek seeds soaked overnight — eat seeds on empty stomach',
      'Turmeric + amla powder — 1/2 tsp each with warm water',
      'Cinnamon water — soak 1 stick in water overnight, drink in morning',
      'Triphala at bedtime for metabolic reset',
      'Jamun (black plum) fruit or vinegar'
    ],
    diet: ['Low glycemic foods', 'Bitter, astringent tastes', 'Barley, millets, old rice', 'Bitter gourd, fenugreek leaves', 'Avoid sugar, white rice, white bread', 'No fruits with meals'],
    yogaTherapy: ['Dhanurasana (Bow pose)', 'Ardha Matsyendrasana', 'Paschimottanasana', 'Sarvangasana', 'Pranayama — Kapalbhati, Bhastrika'],
    lifestyle: ['Daily 30-min walk minimum', 'Maintain healthy weight', 'No daytime sleeping', 'Regular fasting (12-14 hr overnight)', 'Stress management'],
    redFlags: ['Blood sugar > 300 mg/dL', 'Fruity breath (ketoacidosis)', 'Non-healing wounds', 'Sudden vision loss', 'Chest pain'],
    severity: 'serious',
    seeDoctorIf: 'Blood sugar consistently above 200, any red flag symptoms, starting insulin, foot ulcers.'
  },
  {
    id: 'arthritis',
    name: 'Joint Pain & Arthritis (Amavata)',
    category: 'Musculoskeletal',
    commonSymptoms: ['joint pain', 'arthritis', 'knee pain', 'back pain', 'stiffness', 'swelling', 'inflammation', 'joints hurt', 'morning stiffness', 'rheumatism'],
    description: 'Joint inflammation and pain. Arthritis is Amavata in Ayurveda — Ama (toxins) accumulating in joints.',
    ayurvedicView: 'Ama (undigested toxins) + Vata aggravation in Sandhis (joints). Often triggered by irregular digestion and incompatible foods.',
    herbs: [
      { name: 'Turmeric', herbId: 'turmeric', why: 'Powerful anti-inflammatory — as effective as NSAIDs for some', dosage: '500mg curcumin extract 2x daily with black pepper' },
      { name: 'Ashwagandha', herbId: 'ashwagandha', why: 'Strengthens muscles and joints, reduces pain', dosage: '500mg with warm milk 2x daily' },
      { name: 'Guggulu', herbId: 'guggulu', why: 'Anti-arthritic — penetrates deep tissues, clears Ama', dosage: '500mg Yogaraja Guggulu 2x daily' },
      { name: 'Shallaki (Boswellia)', herbId: 'guggulu', why: 'Joint tissue repair — reduces swelling without stomach side effects', dosage: '300mg Boswellia extract 2x daily' },
      { name: 'Ginger (Shunti)', herbId: 'turmeric', why: 'Digestive fire + joint pain relief', dosage: 'Fresh ginger tea 2-3x daily' },
    ],
    homeRemedies: [
      'Hot fomentation with salt poultice on affected joints',
      'Castor oil pack on painful joints at bedtime',
      'Turmeric milk (golden milk) daily',
      'Ginger + turmeric tea',
      'Epsom salt warm bath with ginger powder',
      'Ashwagandha ghee massage on joints'
    ],
    diet: ['Warm, cooked foods', 'Anti-inflammatory spices', 'Avoid nightshades (tomato, potato, brinjal)', 'No cold drinks', 'Ghee in moderation', 'Avoid incompatible food combinations'],
    yogaTherapy: ['Gentle joint rotations', 'Supta Padangusthasana', 'Vrikshasana (for balance)', 'Swimming or warm water therapy', 'Tai Chi', 'Avoid weight-bearing during flare-ups'],
    lifestyle: ['Keep joints warm', 'Regular gentle movement', 'Oil massage (Mahanarayan oil)', 'Avoid prolonged sitting', 'Maintain healthy weight'],
    redFlags: ['Fever with joint pain', 'Joint deformity', 'Severe swelling redness', 'Loss of joint movement', 'Numbness in limbs'],
    severity: 'moderate',
    seeDoctorIf: 'Sudden severe joint swelling, fever with pain, loss of function, or no improvement in 4 weeks.'
  },
  {
    id: 'digestive-issues',
    name: 'Digestive Issues (Ajirna)',
    category: 'Digestive',
    commonSymptoms: ['indigestion', 'bloating', 'gas', 'constipation', 'diarrhea', 'acid reflux', 'heartburn', 'stomach pain', 'appetite', 'nausea', 'acidity'],
    description: 'Impaired digestion is the root of most diseases in Ayurveda. Mandagni (low digestive fire) creates Ama (toxins).',
    ayurvedicView: 'Agnimandya (weak digestive fire) leading to Ama production. Vata or Pitta subtype depending on symptoms.',
    herbs: [
      { name: 'Triphala', herbId: 'triphala', why: 'Digestive tonic — regulates bowel movements, detoxifies', dosage: '1 tsp with warm water at bedtime' },
      { name: 'Ginger', herbId: 'turmeric', why: 'Deepana — kindles digestive fire, anti-nausea', dosage: 'Fresh ginger tea before meals' },
      { name: 'Fennel (Saunf)', herbId: 'triphala', why: 'Carminative — reduces gas, soothes stomach', dosage: '1 tsp fennel seeds after meals' },
      { name: 'Cumin-Coriander-Fennel tea', herbId: 'triphala', why: 'CFF tea — balances all doshas, cools inflammation', dosage: 'Equal parts, steep in hot water, drink after meals' },
    ],
    homeRemedies: [
      'Buttermilk with roasted cumin and rock salt after lunch',
      'Triphala water at bedtime for constipation',
      'Ginger pickle before meals (1 small piece)',
      'Ajwain (carom seeds) with warm water for gas',
      'Castor oil — 1 tsp at bedtime (gentle laxative)',
      'Isabgol (psyllium husk) with warm water at night'
    ],
    diet: ['Warm, freshly cooked foods', 'Regular meal times', 'Largest meal at lunch', 'Light dinner by 7 PM', 'No ice-cold drinks', 'Ginger tea between meals', 'Avoid leftovers'],
    yogaTherapy: ['Pavanamuktasana (Wind-relieving pose)', 'Vajrasana (sit in this after meals)', 'Ardha Matsyendrasana', 'Kapalbhati Pranayama', 'Agnisar Kriya'],
    lifestyle: ['Eat in calm environment', 'Chew food thoroughly', 'No water during meals (sips OK)', 'Walk 100 steps after dinner', 'No sleeping immediately after eating'],
    redFlags: ['Blood in stool', 'Severe abdominal pain', 'Persistent vomiting', 'Weight loss > 5kg', 'Difficulty swallowing'],
    severity: 'mild',
    seeDoctorIf: 'Blood in stool, severe pain, unexplained weight loss, or symptoms > 2 weeks.'
  },
  {
    id: 'hypertension',
    name: 'High Blood Pressure (Rakta Gata Vata)',
    category: 'Cardiovascular',
    commonSymptoms: ['blood pressure', 'hypertension', 'headache', 'dizziness', 'chest pain', 'shortness of breath', 'flushing', 'bp high'],
    description: 'High BP affects millions. Ayurveda sees this as Rakta Dhatu (blood tissue) and Vata imbalance.',
    ayurvedicView: 'Prana Vyu and Vyana Vata vitiation in Rasa-Rakta Dhatu. Stress and toxin accumulation increase pressure on blood vessels.',
    herbs: [
      { name: 'Arjuna', herbId: 'arjuna', why: 'Cardiac tonic — strengthens heart muscle, regulates BP', dosage: '500mg bark extract 2x daily' },
      { name: 'Ashwagandha', herbId: 'ashwagandha', why: 'Reduces stress-induced hypertension', dosage: '500mg with warm milk 2x daily' },
      { name: 'Brahmi', herbId: 'brahmi', why: 'Vasodilator — calms mind, reduces BP', dosage: '250mg powder 2x daily' },
      { name: 'Rauwolfia (Sarpagandha)', herbId: 'arjuna', why: 'Powerful antihypertensive — contains reserpine', dosage: '250mg powder at bedtime (Ayurvedic doctor supervision)' },
      { name: 'Jatamansi', herbId: 'shankhpushpi', why: 'Natural ACE inhibitor — calming BP reducer', dosage: '250mg powder 2x daily' },
    ],
    homeRemedies: [
      'Arjuna bark decoction — 1 cup morning on empty stomach',
      'Amla juice — 30ml daily (antioxidant for blood vessels)',
      'Garlic — 2 raw cloves on empty stomach',
      'Watermelon seeds + poppy seeds powder (equal parts) — 1 tsp morning',
      'Onion juice — 2 tsp with honey',
      'Coconut water daily'
    ],
    diet: ['Low Salt diet (avoid excess)', 'Potassium rich foods (banana, coconut water)', 'Avoid fried, processed foods', 'No alcohol, smoking', 'Include garlic, onion in cooking', 'Moderate protein'],
    yogaTherapy: ['Pranayama — Sheetali, Sheetkari (cooling)', 'Shavasana', 'Gentle walking', 'Meditation 20 min daily', 'Avoid headstand, heavy lifting'],
    lifestyle: ['Daily moderate exercise', 'Yoga and meditation', 'Reduce sodium', 'Maintain healthy weight', 'Regular BP monitoring', 'Stress management', 'Adequate sleep'],
    redFlags: ['BP > 180/120', 'Severe headache with vision changes', 'Chest pain', 'Difficulty speaking', 'Weakness on one side'],
    severity: 'serious',
    seeDoctorIf: 'BP consistently > 140/90, any red flag symptoms, or if already on BP medication (do not stop meds).'
  },
  {
    id: 'cold-cough',
    name: 'Cold, Cough & Flu',
    category: 'Respiratory',
    commonSymptoms: ['cold', 'cough', 'fever', 'runny nose', 'sore throat', 'congestion', 'sneezing', 'flu', 'throat pain', 'headache'],
    description: 'Common respiratory infection. Ayurveda sees this as Kapha-Vata imbalance, often triggered by seasonal changes.',
    ayurvedicView: 'Kapha aggravation in Pranavaha Srotas (respiratory channels). Often post-digestion Ama moving to respiratory system.',
    herbs: [
      { name: 'Tulsi', herbId: 'tulsi', why: 'Antimicrobial — antiviral, antibacterial for respiratory infections', dosage: '5-6 leaves with ginger in tea, or honey' },
      { name: 'Turmeric', herbId: 'turmeric', why: 'Anti-inflammatory — soothes throat, reduces congestion', dosage: 'Golden milk (turmeric + pepper + warm milk)' },
      { name: 'Yashtimadhu (Licorice)', herbId: 'yasthimadhu', why: 'Throat soother — demulcent, expectorant', dosage: '250mg powder with honey 3x daily' },
      { name: 'Pippali', herbId: 'pippali', why: 'Expectorant — clears mucus from lungs', dosage: '250mg with honey 2x daily' },
    ],
    homeRemedies: [
      'Tulsi + ginger + honey tea — 3-4 cups daily',
      'Steam inhalation with eucalyptus or tulsi leaves',
      'Turmeric milk (golden milk) at bedtime',
      'Salt water gargle — warm saline 3-4x daily',
      'Dry ginger + jaggery — small ball to suck on',
      'Honey + onion juice — for wet cough',
      'Vicks-style chest rub with camphor + coconut oil'
    ],
    diet: ['Warm foods and drinks only', 'Light, easy to digest', 'Kitchari (rice + mung dal)', 'Avoid cold food/drinks', 'Avoid dairy (increases mucus)', 'Warm soups and broths'],
    yogaTherapy: ['Neti (nasal cleansing) after recovery', 'Pranayama — Anulom Vilom', 'Bhastrika (only if no fever)', 'Gentle pranayama only'],
    lifestyle: ['Rest — do not push through illness', 'Keep warm', 'Steam inhalation 2-3x daily', 'Avoid AC and cold exposure', 'Separate towels/utensils if contagious'],
    redFlags: ['High fever > 103°F (> 39.4°C)', 'Difficulty breathing', 'Blood in sputum', 'Chest pain', 'Confusion', 'Symptoms > 10 days'],
    severity: 'mild',
    seeDoctorIf: 'High fever persisting > 3 days, difficulty breathing, chest pain, symptoms worsening after 7 days.'
  },
  {
    id: 'skin-diseases',
    name: 'Skin Diseases (Kustha)',
    category: 'Dermatology',
    commonSymptoms: ['acne', 'pimples', 'eczema', 'psoriasis', 'rashes', 'itching', 'dry skin', 'pigmentation', 'dark spots', 'skin', 'dermatitis', 'boils'],
    description: 'Skin reflects internal health. Most skin diseases in Ayurveda involve Rakta (blood) and Pitta imbalance.',
    ayurvedicView: 'Rakta Dhatu (blood tissue) vitiation with Pitta aggravation. Toxins pushed to skin when internal elimination pathways are blocked.',
    herbs: [
      { name: 'Neem', herbId: 'neem', why: 'Blood purifier — antimicrobial, antifungal', dosage: '3-4 leaves on empty stomach or 500mg extract' },
      { name: 'Manjistha', herbId: 'manjistha', why: 'Blood cleanser — specifically for skin pigmentation and acne', dosage: '500mg powder 2x daily' },
      { name: 'Turmeric', herbId: 'turmeric', why: 'Anti-inflammatory — both internal and external application', dosage: '1 tsp powder with water + external paste' },
      { name: 'Khadira', herbId: 'neem', why: 'For chronic skin diseases — kushtha specific', dosage: 'Herbal decoction under guidance' },
    ],
    homeRemedies: [
      'Neem leaves paste on affected areas',
      'Turmeric + sandalwood paste (external) for acne',
      'Aloe vera gel — fresh, directly on skin',
      'Triphala water at bedtime (internal detox)',
      'Manjistha + neem powder in warm water daily',
      'Coconut oil + camphor for itching',
      'Apple cider vinegar diluted for fungal infections'
    ],
    diet: ['Bitter, astringent foods', 'Green leafy vegetables', 'Avoid spicy, sour, fermented foods', 'No curd at night', 'No fish + milk combination', 'Plenty of water'],
    yogaTherapy: ['Surya Namaskar (improves circulation)', 'Inversions — blood flow to skin', 'Pranayama — Sheetali (cooling)', 'Shavasana', 'Regular sweating through exercise'],
    lifestyle: ['Use natural skincare only', 'No harsh soaps', 'Wear cotton clothing', 'Shower after sweating', 'Manage stress (triggers skin flare-ups)', 'Oil massage with neem oil'],
    redFlags: ['Spreading rash with fever', 'Large blisters', 'Infected wounds', 'Sudden severe rash', 'Anaphylaxis symptoms'],
    severity: 'moderate',
    seeDoctorIf: 'Skin infection spreading, fever with rash, no improvement in 4 weeks, suspected psoriasis/eczema.'
  },
  {
    id: 'weight-gain',
    name: 'Obesity & Weight Gain (Medoroga)',
    category: 'Metabolic',
    commonSymptoms: ['obesity', 'overweight', 'weight gain', 'belly fat', 'lose weight', 'weight loss', 'fat', 'heavy', 'slow metabolism'],
    description: 'Excess weight is a Kapha disorder in Ayurveda. Weak digestive fire leads to accumulation of Meda Dhatu (fat tissue).',
    ayurvedicView: 'Meda Dhatu Vriddhi (fat tissue excess) due to Mandagni (weak digestion). Kapha imbalance with accumulation of Ama.',
    herbs: [
      { name: 'Triphala', herbId: 'triphala', why: 'Gentle detox — improves metabolism, regulates bowels', dosage: '1 tsp with warm water at bedtime' },
      { name: 'Guggulu', herbId: 'guggulu', why: 'Fat burner — Medohar Guggulu specifically for weight', dosage: '500mg Medohar/Triphala Guggulu 2x daily' },
      { name: 'Trikatu', herbId: 'pippali', why: 'Digestive fire booster — black pepper + long pepper + ginger', dosage: '500mg before meals' },
      { name: 'Vijaysar', herbId: 'punarnava', why: 'Blood sugar + weight reducer — water in Vijaysar cup', dosage: 'Drink water soaked in Vijaysar wood overnight' },
    ],
    homeRemedies: [
      'Apple cider vinegar — 1 tbsp in water before meals',
      'Lemon + honey + warm water — morning on empty stomach',
      'Triphala + guggulu at bedtime',
      'Drink water from a Vijaysar wood glass (Madhunashini)',
      'Barley water — drink throughout day',
      'Dry ginger + lemon tea between meals'
    ],
    diet: ['Low calorie, high fiber', 'Eat only when genuinely hungry', 'No snacking between meals', 'Light dinner — soups/salads', 'Avoid sugar, fried food, processed food', 'Include bitter vegetables', 'Old rice, barley, mung dal'],
    yogaTherapy: ['Surya Namaskar (12 rounds daily)', 'Kapalbhati (3 rounds, 60 each)', 'Naukasana (Boat pose)', 'Vrikshasana', 'Brisk walking 45 min daily', 'Cycling or swimming'],
    lifestyle: ['Daily vigorous exercise', 'Intermittent fasting (14-16 hr overnight)', 'No daytime sleeping', 'Reduce stress (cortisol causes belly fat)', 'Eat mindfully', 'Drink warm water throughout day'],
    redFlags: ['Sudden rapid weight gain (fluid retention)', 'Weight gain with fatigue (hypothyroid)', 'BMI > 40', 'Sleep apnea symptoms'],
    severity: 'moderate',
    seeDoctorIf: 'BMI > 35, sudden weight gain, suspected thyroid issue, sleep apnea, or weight-related joint damage.'
  },
  {
    id: 'hair-loss',
    name: 'Hair Fall & Premature Graying',
    category: 'Dermatology',
    commonSymptoms: ['hair fall', 'hair loss', 'balding', 'thinning hair', 'premature graying', 'white hair', 'hair breakage', 'bald patch', 'dandruff'],
    description: 'Hair health reflects bone marrow (Asthi Dhatu) and blood (Rakta) health. Pitta imbalance heats the follicles.',
    ayurvedicView: 'Pitta aggravation in Asthi Dhatu (bone marrow — hair is its waste product). Rakta Dhatu impurity also contributes.',
    herbs: [
      { name: 'Bhringraj', herbId: 'bhringraj', why: 'King of hair herbs — promotes regrowth, prevents graying', dosage: 'Apply oil on scalp 2x/week + 500mg powder internally' },
      { name: 'Amla', herbId: 'amla', why: 'Hair growth stimulant — vitamin C for collagen and iron absorption', dosage: '30ml juice or 500mg powder daily' },
      { name: 'Brahmi', herbId: 'brahmi', why: 'Reduces stress-related hair fall', dosage: '250mg with warm milk' },
      { name: 'Neem', herbId: 'neem', why: 'Scalp health — antifungal for dandruff-related hair fall', dosage: 'Neem oil + coconut oil scalp massage' },
    ],
    homeRemedies: [
      'Bhringraj oil or coconut oil + camphor — massage scalp, leave 1 hour, wash',
      'Amla oil (coconut oil cooked with amla) — weekly application',
      'Henna (Lawsonia) — natural coloring + strengthening',
      'Onion juice on scalp — 30 min, then wash (for regrowth)',
      'Aloe vera gel on scalp — moisturizing, reduces dandruff',
      'Fenugreek seed paste — apply on scalp 30 min before wash',
      'Curry leaves + coconut oil — cook together, use as hair oil'
    ],
    diet: ['Iron rich foods (pomegranate, beetroot, spinach)', 'Protein intake — adequate for hair production', 'Amla, berries, nuts', 'Black sesame seeds', 'Avoid excessive salt', 'Adequate hydration'],
    yogaTherapy: ['Adho Mukha Svanasana (Downward Dog)', 'Sarvangasana (Shoulder stand)', 'Pranayama — increases blood flow to scalp', 'Shirsasana (Headstand)'],
    lifestyle: ['Gentle hair care — no harsh chemicals', 'Avoid tight hairstyles', 'Regular oil massage (weekly)', 'Silk pillowcase', 'Manage stress (cortisol triggers hair loss)', 'Pat dry — no rubbing'],
    redFlags: ['Sudden patchy hair loss', 'Scalp infection', 'Hair loss with fatigue/weight changes', 'Scalp scarring', 'Total body hair loss'],
    severity: 'mild',
    seeDoctorIf: 'Sudden patchy alopecia, scalp infection, hair loss with thyroid symptoms, or no improvement in 3 months.'
  },
  {
    id: 'womens-health',
    name: "Women's Health (Stree Roga)",
    category: 'Gynecology',
    commonSymptoms: ['pcos', 'irregular periods', 'menstrual pain', 'cramps', 'heavy periods', 'white discharge', 'fertility', 'menopause', 'hot flashes', 'pms'],
    description: 'Women-specific hormonal and reproductive health. Ayurveda has dedicated branch — Stri Roga — for these conditions.',
    ayurvedicView: 'Vata (especially Apana Vayu) imbalance affecting Artava Vaha Srotas (reproductive channels). Hormonal imbalance viewed as Dosha cycle disruption.',
    herbs: [
      { name: 'Shatavari', herbId: 'shatavari', why: "Queen of women's herbs — phytoestrogen, hormone balancer", dosage: '500-1000mg powder with warm milk 2x daily' },
      { name: 'Ashoka', herbId: 'shatavari', why: 'Uterine tonic — regulates menstrual flow, reduces pain', dosage: '500mg Ashoka extract 2x daily during periods' },
      { name: 'Lodhra', herbId: 'manjistha', why: 'For excessive bleeding and white discharge', dosage: '500mg powder 2x daily with honey' },
      { name: 'Guduchi', herbId: 'guduchi', why: 'Immunomodulator — supports reproductive immunity', dosage: '500mg powder 2x daily' },
    ],
    homeRemedies: [
      'Shatavari milk — warm milk with shatavari powder + honey',
      'Cinnamon tea — for PCOS insulin resistance',
      'Aloe vera juice — 2 tbsp daily (regulates cycles)',
      'Sesame seeds + jaggery — during periods for cramps',
      'Castor oil pack on lower abdomen',
      'Warm water compress on abdomen during cramps',
      'Fennel seeds — chew after meals for bloating'
    ],
    diet: ['Warm, nourishing foods', 'Iron-rich (dates, jaggery, beetroot)', 'Healthy fats (ghee, nuts, seeds)', 'No cold foods during periods', 'Black sesame seeds (calcium)', 'Cinnamon in cooking'],
    yogaTherapy: ['Supta Baddha Konasana', 'Baddha Konasana (Butterfly)', 'Upavistha Konasana', 'Shavasana (with pillow under knees)', 'Mula Bandha practice', 'Avoid inversions during heavy flow'],
    lifestyle: ['Stress management (disrupts hormonal cycle)', 'Regular exercise', 'Adequate sleep', 'Yoga during menstruation (gentle)', 'Track your cycle', 'Natural hygiene products'],
    redFlags: ['Very heavy bleeding (soaking pad every hour)', 'Missed periods > 3 months (not pregnant)', 'Severe pelvic pain', 'Post-menopausal bleeding', 'Lump in breast'],
    severity: 'moderate',
    seeDoctorIf: 'Heavy bleeding, missed periods, fertility concerns > 6 months, menopausal symptoms affecting quality of life.'
  },
  {
    id: 'low-immunity',
    name: 'Low Immunity & Frequent Illness',
    category: 'Immunology',
    commonSymptoms: ['weak immunity', 'frequent cold', 'get sick often', 'infections', 'low energy', 'tired always', 'slow recovery', 'recurrent infections'],
    description: 'Ojas (vital essence) depletion leads to low immunity. Ayurveda strengthens Vyadhi Kshamatva (disease resistance).',
    ayurvedicView: 'Ojas depletion — the essence of all dhatus (tissues). Caused by stress, poor digestion, inadequate sleep, and poor nutrition.',
    herbs: [
      { name: 'Guduchi (Giloy)', herbId: 'guduchi', why: 'Immunomodulator — enhances white blood cell function', dosage: '500mg stem extract 2x daily' },
      { name: 'Tulsi', herbId: 'tulsi', why: 'Antimicrobial + adaptogen — first line of defense', dosage: '5-6 leaves daily in tea or chewing' },
      { name: 'Amla', herbId: 'amla', why: 'Highest vitamin C — strengthens all tissues', dosage: '500mg or 30ml juice daily' },
      { name: 'Ashwagandha', herbId: 'ashwagandha', why: 'Adaptogen — builds Ojas (vital essence)', dosage: '500mg with warm milk 2x daily' },
    ],
    homeRemedies: [
      'Chyawanprash — 1 tbsp morning (classic immune formula)',
      'Golden milk (turmeric + milk) nightly',
      'Honey + ginger + lemon — morning immunity shot',
      'Citrus fruit daily (vitamin C)',
      'Probiotic — buttermilk after lunch',
      'Dry fruits mixture (almonds + dates + walnuts)',
      'Guduchi + tulsi tea — daily'
    ],
    diet: ['Fresh, seasonal fruits', 'Adequate protein', 'Colorful vegetables', 'Nuts and seeds', 'Avoid junk food and sugar', 'Adequate hydration'],
    yogaTherapy: ['Pranayama — Anulom Vilom (daily 10 min)', 'Kapalbhati', 'Surya Namaskar', 'Meditation'],
    lifestyle: ['Regular exercise', 'Adequate sleep', 'Manage stress', 'Avoid overexertion', 'Include all herbs in diet'],
    redFlags: ['Frequent infections', 'Weight loss', 'Night sweats', 'Persistent cough > 3 weeks', 'Swollen glands'],
    severity: 'moderate',
    seeDoctorIf: 'Recurrent severe infections, weight loss, persistent fever, symptoms lasting > 3 weeks'
  }
]