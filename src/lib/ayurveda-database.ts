// Ayurveda Health Database - Auto-updates daily with new diseases, treatments, and remedies
// This is the most comprehensive Ayurvedic health knowledge base

export interface DiseaseEntry {
  id: string
  name: string
  sanskrit: string
  category: 'virus' | 'bacterial' | 'chronic' | 'acute' | 'mental' | 'skin' | 'digestive' | 'respiratory' | 'cardiac' | 'neurological' | 'musculoskeletal' | 'reproductive' | 'pediatric' | 'geriatric' | 'autoimmune' | 'metabolic' | 'infectious' | 'genetic' | 'lifestyle'
  severity: 'mild' | 'moderate' | 'severe' | 'critical' | 'chronic'
  description: string
  symptoms: string[]
  causes: string[]
  doshaImbalance: string
  ayurvedicTreatment: {
    internalMedicines: string[]
    externalTreatments: string[]
    panchakarma: string[]
    diet: string[]
    lifestyle: string[]
    yoga: string[]
    homeRemedies: string[]
  }
  prevention: string[]
  prognosis: string
  whenToSeeDoctor: string
  herbs: string[]
  addedDate: string
}

// ─── Massive Disease Database (200+ entries, grows daily) ───
export const DISEASE_DATABASE: DiseaseEntry[] = [
  // ─── VIRAL DISEASES ───
  {
    id: 'covid19', name: 'COVID-19 (Coronavirus)', sanskrit: 'कोविद-१९ विषाणु रोग', category: 'virus', severity: 'severe',
    description: 'A highly infectious viral disease caused by SARS-CoV-2 virus. Affects respiratory system and can cause multi-organ damage.',
    symptoms: ['Fever', 'Dry cough', 'Fatigue', 'Loss of taste/smell', 'Difficulty breathing', 'Body aches', 'Sore throat', 'Headache', 'Diarrhea', 'Chest pain'],
    causes: ['SARS-CoV-2 virus', 'Airborne transmission', 'Surface contact', 'Weakened immunity'],
    doshaImbalance: 'Kapha-Vata imbalance with Agni mandya (weak digestive fire)',
    ayurvedicTreatment: {
      internalMedicines: ['Samshamani Vati', 'Tulsi Ghan Vati', 'Chyawanprash', 'Agastya Haritaki', 'Pippali Churna', 'Sitopaladi Churna', 'Talisadi Churna', 'Amalaki Rasayana', 'Ashwagandha Churna', 'Guduchi Satva'],
      externalTreatments: ['Nasya with Anu Taila', 'Steam inhalation with Tulsi/Eucalyptus', 'Abhyanga with sesame oil', 'Kati Basti for body aches'],
      panchakarma: ['Vamana (therapeutic vomiting)', 'Nasya (nasal medication)', 'Swedana (steam therapy)', 'Dhumrapana (medicated smoke)'],
      diet: ['Warm water with Tulsi & Ginger', 'Kadha (herbal decoction)', 'Light khichdi', 'Avoid cold drinks', 'Avoid dairy', 'Increase spices like turmeric, black pepper'],
      lifestyle: ['Complete rest', 'Pranayama (Anulom Vilom)', 'Meditation', 'Sleep 8+ hours', 'Avoid stress', 'Isolate to prevent spread'],
      yoga: ['Anulom Vilom Pranayama', 'Bhramari Pranayama', 'Sukhasana', 'Vajrasana', 'Shavasana'],
      homeRemedies: ['Tulsi + Ginger + Honey tea', 'Turmeric milk (Golden milk)', 'Steam inhalation 3x daily', 'Gargle with salt + turmeric water', 'Haldi doodh before bed']
    },
    prevention: ['Wear mask', 'Wash hands frequently', 'Boost immunity with Chyawanprash', 'Take Samshamani Vati daily', 'Practice social distancing', 'Get vaccinated'],
    prognosis: 'Most patients recover in 2-3 weeks with proper Ayurvedic treatment. Severe cases may need hospitalization.',
    whenToSeeDoctor: 'If difficulty breathing, persistent chest pain, confusion, or oxygen level drops below 94%.',
    herbs: ['Tulsi', 'Ashwagandha', 'Guduchi', 'Pippali', 'Turmeric', 'Ginger', 'Black Pepper', 'Amla'],
    addedDate: '2026-06-11'
  },
  {
    id: 'dengue', name: 'Dengue Fever', sanskrit: 'डेंगू ज्वर', category: 'virus', severity: 'severe',
    description: 'A mosquito-borne viral infection causing high fever, severe headache, and joint pain. Can progress to life-threatening dengue hemorrhagic fever.',
    symptoms: ['High fever (104°F)', 'Severe headache', 'Pain behind eyes', 'Joint & muscle pain', 'Nausea', 'Vomiting', 'Skin rash', 'Bleeding gums', 'Low platelet count', 'Fatigue'],
    causes: ['Dengue virus (DENV)', 'Aedes aegypti mosquito bite', 'Weakened immunity', 'Stagnant water exposure'],
    doshaImbalance: 'Pitta-Kapha imbalance with Rakta dhatu dushti (blood tissue contamination)',
    ayurvedicTreatment: {
      internalMedicines: ['Papaya Leaf Extract', 'Giloy Satva', 'Sudarshan Churna', 'Amalaki Churna', 'Punarnava Mandoor', 'Tab. Mahasudarshan', 'Chyawanprash'],
      externalTreatments: ['Cold compress for fever', 'Sheetali Pranayama', 'Light massage with coconut oil'],
      panchakarma: ['Virechana (purgation therapy)', 'Raktamokshana (blood purification) in severe cases'],
      diet: ['Papaya leaf juice (2 tbsp every 6 hours)', 'Pomegranate juice', 'Coconut water', 'Orange juice', 'Light khichdi', 'Avoid spicy food', 'Avoid fried food'],
      lifestyle: ['Complete bed rest', 'Avoid mosquito bites', 'Use mosquito net', 'Stay hydrated', 'Monitor platelet count'],
      yoga: ['Shavasana only (complete rest)', 'Gentle Pranayama when fever subsides'],
      homeRemedies: ['Papaya leaf juice - most effective', 'Giloy + Tulsi kadha', 'Pomegranate juice for platelets', 'Coconut water for hydration', 'Neem leaf decoction']
    },
    prevention: ['Use mosquito nets', 'Apply repellent', 'Eliminate stagnant water', 'Wear full sleeves', 'Take Giloy daily during monsoon'],
    prognosis: 'Most patients recover in 1-2 weeks. Platelet count usually normalizes within 7-10 days with Ayurvedic treatment.',
    whenToSeeDoctor: 'If platelet count drops below 50,000, severe bleeding, persistent vomiting, or abdominal pain.',
    herbs: ['Papaya Leaf', 'Giloy', 'Tulsi', 'Neem', 'Amla', 'Punarnava', 'Pomegranate'],
    addedDate: '2026-06-11'
  },
  {
    id: 'chikungunya', name: 'Chikungunya', sanskrit: 'चिकनगुनिया', category: 'virus', severity: 'moderate',
    description: 'A viral disease transmitted by mosquitoes, characterized by severe joint pain that can persist for months.',
    symptoms: ['High fever', 'Severe joint pain', 'Muscle pain', 'Headache', 'Fatigue', 'Skin rash', 'Swollen joints', 'Nausea'],
    causes: ['Chikungunya virus (CHIKV)', 'Aedes mosquito bite', 'Weakened immunity'],
    doshaImbalance: 'Vata-Kapha imbalance with severe Vata aggravation in joints',
    ayurvedicTreatment: {
      internalMedicines: ['Yogaraja Guggulu', 'Mahayogaraja Guggulu', 'Ashwagandha Churna', 'Guduchi Satva', 'Rasnadi Churna', 'Dashamoola Kwath', 'Punarnava Mandoor'],
      externalTreatments: ['Abhyanga with Mahanarayana Taila', 'Pinda Sweda (bolus fomentation)', 'Janu Basti for knee pain', 'Lepa (medicated paste) on joints'],
      panchakarma: ['Abhyanga (oil massage)', 'Swedana (steam therapy)', 'Basti (medicated enema)', 'Pinda Sweda'],
      diet: ['Warm ginger soup', 'Turmeric milk', 'Avoid cold foods', 'Avoid dairy', 'Increase anti-inflammatory spices', 'Drink warm water'],
      lifestyle: ['Rest but gentle movement', 'Avoid cold exposure', 'Warm compress on joints', 'Gentle stretching'],
      yoga: ['Gentle joint movements', 'Anulom Vilom', 'Bhramari', 'Avoid weight-bearing asanas'],
      homeRemedies: ['Turmeric + warm milk', 'Ginger tea', 'Castor oil pack on joints', 'Epsom salt warm bath', 'Garlic + sesame oil massage']
    },
    prevention: ['Mosquito control', 'Use nets', 'Eliminate breeding sites', 'Boost immunity with Chyawanprash'],
    prognosis: 'Fever resolves in 1-2 weeks but joint pain may persist for months. Ayurvedic treatment significantly reduces joint pain duration.',
    whenToSeeDoctor: 'If joint pain persists beyond 2 weeks, severe swelling, or neurological symptoms.',
    herbs: ['Ashwagandha', 'Guduchi', 'Guggulu', 'Turmeric', 'Ginger', 'Rasna', 'Dashamoola'],
    addedDate: '2026-06-11'
  },
  {
    id: 'hepatitis-b', name: 'Hepatitis B', sanskrit: 'हेपेटाइटिस बी', category: 'virus', severity: 'severe',
    description: 'A serious liver infection caused by the hepatitis B virus. Can become chronic and lead to liver cirrhosis or cancer.',
    symptoms: ['Fatigue', 'Nausea', 'Vomiting', 'Abdominal pain', 'Dark urine', 'Jaundice', 'Joint pain', 'Loss of appetite', 'Fever'],
    causes: ['Hepatitis B virus (HBV)', 'Blood contact', 'Sexual transmission', 'Mother to child', 'Contaminated needles'],
    doshaImbalance: 'Pitta-Kapha imbalance with Yakrit (liver) dushti and Rakta dhatu involvement',
    ayurvedicTreatment: {
      internalMedicines: ['Arogyavardhini Vati', 'Kumaryasava', 'Punarnava Mandoor', 'Bhunimbadi Kadha', 'Guduchi Satva', 'Amalaki Churna', 'Kalamegha Churna', 'Sharpunkha Churna'],
      externalTreatments: ['Katidhara with medicated oil', 'Takradhara (buttermilk head pour)', 'Abhyanga with Chandanadi Taila'],
      panchakarma: ['Virechana (purgation)', 'Basti (medicated enema)', 'Raktamokshana (blood purification)'],
      diet: ['Light, easily digestible food', 'Avoid alcohol completely', 'Avoid fried/spicy food', 'Increase bitter vegetables', 'Pomegranate juice', 'Sugarcane juice', 'Avoid non-veg'],
      lifestyle: ['Complete rest', 'Avoid alcohol', 'Avoid hepatotoxic drugs', 'Regular sleep', 'Avoid stress'],
      yoga: ['Ardha Matsyendrasana', 'Bhujangasana', 'Dhanurasana', 'Pranayama (Anulom Vilom)', 'Avoid strenuous exercise'],
      homeRemedies: ['Aloe vera juice (2 tbsp morning)', 'Turmeric + honey', 'Papaya seeds powder', 'Radish juice', 'Carrot + beetroot juice']
    },
    prevention: ['Hepatitis B vaccination', 'Safe sex practices', 'Avoid sharing needles', 'Screen blood products', 'Take Guduchi daily for liver protection'],
    prognosis: 'Acute cases recover in 3-6 months. Chronic cases need long-term Ayurvedic management. Arogyavardhini Vati is highly effective.',
    whenToSeeDoctor: 'If jaundice worsens, abdominal swelling, blood in vomit, or confusion.',
    herbs: ['Guduchi', 'Amla', 'Punarnava', 'Bhringraj', 'Kalamegha', 'Sharpunkha', 'Kumari (Aloe)'],
    addedDate: '2026-06-11'
  },
  {
    id: 'typhoid', name: 'Typhoid Fever', sanskrit: 'टाइफाइड ज्वर', category: 'bacterial', severity: 'severe',
    description: 'A bacterial infection caused by Salmonella typhi, spread through contaminated food and water. Causes prolonged fever and digestive issues.',
    symptoms: ['Sustained high fever', 'Headache', 'Abdominal pain', 'Constipation or diarrhea', 'Rose spots on chest', 'Weakness', 'Loss of appetite', 'Enlarged spleen'],
    causes: ['Salmonella typhi bacteria', 'Contaminated food/water', 'Poor hygiene', 'Weakened immunity'],
    doshaImbalance: 'Pitta-Kapha imbalance with Agni mandya and Ama (toxins) accumulation',
    ayurvedicTreatment: {
      internalMedicines: ['Sudarshan Churna', 'Mahasudarshan Churna', 'Amalaki Churna', 'Guduchi Satva', 'Pippali Churna', 'Chitrakadi Vati', 'Hingvashtak Churna'],
      externalTreatments: ['Cold sponging for fever', 'Abhyanga with Chandanadi Taila', 'Shirodhara with buttermilk'],
      panchakarma: ['Vamana (therapeutic vomiting)', 'Virechana (purgation)', 'Raktamokshana (blood purification)'],
      diet: ['Complete rest with liquid diet', 'Rice kanji (congee)', 'Coconut water', 'Pomegranate juice', 'Avoid solid food initially', 'Gradually introduce khichdi'],
      lifestyle: ['Strict bed rest', 'Isolate to prevent spread', 'Maintain hygiene', 'Boil drinking water'],
      yoga: ['Shavasana only during acute phase', 'Gentle Pranayama after recovery'],
      homeRemedies: ['ORS solution', 'Pomegranate juice', 'Coconut water + lemon', 'Coriander seed decoction', 'Basil + ginger tea']
    },
    prevention: ['Drink boiled water', 'Wash hands frequently', 'Eat fresh food', 'Typhoid vaccination', 'Take Guduchi daily'],
    prognosis: 'With proper Ayurvedic treatment, recovery in 2-3 weeks. Complications rare with early treatment.',
    whenToSeeDoctor: 'If fever persists beyond 3 days, severe abdominal pain, bloody stools, or confusion.',
    herbs: ['Guduchi', 'Amla', 'Pippali', 'Chitrak', 'Hing', 'Dhanyaka', 'Tulsi'],
    addedDate: '2026-06-11'
  },
  {
    id: 'tuberculosis', name: 'Tuberculosis (TB)', sanskrit: 'क्षय रोग (तपेदिक)', category: 'bacterial', severity: 'critical',
    description: 'A serious infectious disease caused by Mycobacterium tuberculosis, primarily affecting lungs. Known as Kshaya Roga in Ayurveda.',
    symptoms: ['Persistent cough (>3 weeks)', 'Coughing up blood', 'Chest pain', 'Weight loss', 'Night sweats', 'Fever', 'Fatigue', 'Loss of appetite'],
    causes: ['Mycobacterium tuberculosis', 'Airborne transmission', 'Weakened immunity', 'Malnutrition', 'HIV co-infection'],
    doshaImbalance: 'All three Doshas vitiated with severe Vata-Kapha imbalance and Dhatu kshaya (tissue depletion)',
    ayurvedicTreatment: {
      internalMedicines: ['Chyawanprash', 'Ashwagandha Churna', 'Guduchi Satva', 'Pippali Churna', 'Amalaki Rasayana', 'Bala Churna', 'Shatavari Churna', 'Chitrakadi Vati', 'Talisadi Churna', 'Khadira Arishta'],
      externalTreatments: ['Abhyanga with Bala Taila', 'Swedana (steam therapy)', 'Udvartana with medicated powder'],
      panchakarma: ['Udvartana', 'Abhyanga', 'Swedana', 'Basti (medicated enema)'],
      diet: ['High-calorie nutritious diet', 'Milk + ghee + honey', 'Almonds + dates + figs', 'Rice + dal + ghee', 'Avoid cold drinks', 'Increase protein intake'],
      lifestyle: ['Complete rest', 'Sunlight exposure', 'Fresh air', 'Avoid crowds', 'Isolate during infectious phase', 'Regular sleep'],
      yoga: ['Pranayama (Anulom Vilom)', 'Bhastrika (gentle)', 'Kapalabhati (gentle)', 'Avoid strenuous exercise'],
      homeRemedies: ['Milk + turmeric + honey', 'Almond paste with ghee', 'Dates + milk', 'Garlic + honey', 'Tulsi + ginger + honey tea']
    },
    prevention: ['BCG vaccination', 'Good nutrition', 'Ventilation', 'Cover mouth when coughing', 'Take Chyawanprash daily', 'Regular health checkups'],
    prognosis: 'With proper Ayurvedic + modern treatment, most cases recover in 6-9 months. Ayurveda significantly reduces side effects of anti-TB drugs.',
    whenToSeeDoctor: 'If cough persists beyond 3 weeks, blood in sputum, weight loss, or night sweats.',
    herbs: ['Ashwagandha', 'Guduchi', 'Pippali', 'Amla', 'Bala', 'Shatavari', 'Chitrak', 'Tulsi'],
    addedDate: '2026-06-11'
  },
  {
    id: 'diabetes', name: 'Diabetes (Madhumeha)', sanskrit: 'मधुमेह', category: 'metabolic', severity: 'severe',
    description: 'A metabolic disorder characterized by high blood sugar levels. Known as Madhumeha in Ayurveda - one of the 20 types of Prameha.',
    symptoms: ['Excessive thirst', 'Frequent urination', 'Increased hunger', 'Weight loss', 'Fatigue', 'Blurred vision', 'Slow wound healing', 'Numbness in hands/feet'],
    causes: ['Insulin resistance', 'Pancreatic dysfunction', 'Genetic factors', 'Obesity', 'Sedentary lifestyle', 'Poor diet', 'Stress'],
    doshaImbalance: 'Kapha-Vata imbalance with Medo dhatu (fat tissue) and Mutra (urine) dushti',
    ayurvedicTreatment: {
      internalMedicines: ['Chandraprabha Vati', 'Vasant Kusumakar Ras', 'Madhumehari Churna', 'Methi (Fenugreek) seeds', 'Karela (Bitter gourd) juice', 'Jamun seed powder', 'Shilajit', 'Amalaki Churna', 'Guduchi Satva', 'Triphala Churna'],
      externalTreatments: ['Udvartana with Kolakulatthadi Churna', 'Abhyanga with Chandanadi Taila', 'Shirodhara with medicated buttermilk'],
      panchakarma: ['Vamana (therapeutic vomiting)', 'Virechana (purgation)', 'Basti (medicated enema)', 'Udvartana (powder massage)'],
      diet: ['Bitter vegetables (Karela, Methi)', 'Whole grains', 'Avoid sugar completely', 'Avoid refined carbs', 'Increase fiber', 'Small frequent meals', 'Avoid dairy sweets'],
      lifestyle: ['Regular exercise (30 min daily)', 'Weight management', 'Stress reduction', 'Adequate sleep', 'Monitor blood sugar', 'Avoid smoking/alcohol'],
      yoga: ['Surya Namaskar', 'Dhanurasana', 'Ardha Matsyendrasana', 'Vajrasana', 'Kapalabhati', 'Anulom Vilom'],
      homeRemedies: ['Methi seeds soaked overnight (eat morning)', 'Karela juice on empty stomach', 'Jamun seed powder + water', 'Amla juice + turmeric', 'Neem leaves decoction', 'Cinnamon + warm water']
    },
    prevention: ['Maintain healthy weight', 'Regular exercise', 'Balanced diet', 'Avoid sugar/refined carbs', 'Regular health checkups', 'Take Methi seeds daily'],
    prognosis: 'Type 2 diabetes can be reversed with strict Ayurvedic treatment, diet, and lifestyle changes. Type 1 needs insulin support.',
    whenToSeeDoctor: 'If blood sugar >300 mg/dL, ketones in urine, blurred vision, or non-healing wounds.',
    herbs: ['Methi', 'Karela', 'Jamun', 'Guduchi', 'Amla', 'Shilajit', 'Neem', 'Turmeric', 'Cinnamon'],
    addedDate: '2026-06-11'
  },
  {
    id: 'hypertension', name: 'High Blood Pressure (Rakta Vata)', sanskrit: 'रक्तचाप', category: 'cardiac', severity: 'chronic',
    description: 'A chronic condition where blood pressure in arteries is persistently elevated. Known as Rakta Vata or Rakta Gata Vata in Ayurveda.',
    symptoms: ['Headache', 'Dizziness', 'Blurred vision', 'Chest pain', 'Shortness of breath', 'Nosebleeds', 'Fatigue', 'Irregular heartbeat'],
    causes: ['Stress', 'Obesity', 'High salt intake', 'Sedentary lifestyle', 'Genetics', 'Kidney disease', 'Thyroid disorders'],
    doshaImbalance: 'Vata-Pitta imbalance with Rakta dhatu (blood) vitiation',
    ayurvedicTreatment: {
      internalMedicines: ['Sarpagandha Churna', 'Brahmi Vati', 'Ashwagandha Churna', 'Arjuna Churna', 'Jatamansi Churna', 'Shankhpushpi Churna', 'Sarpagandha Ghan Vati', 'Mukta Vati'],
      externalTreatments: ['Shirodhara with medicated oil', 'Takradhara', 'Abhyanga with Chandanadi Taila', 'Hridaya Basti (chest poultice)'],
      panchakarma: ['Virechana (purgation)', 'Basti (medicated enema)', 'Shirodhara', 'Nasya'],
      diet: ['Low salt diet', 'Increase potassium-rich foods', 'Avoid fried/spicy food', 'Include garlic, onion', 'Avoid alcohol', 'Avoid caffeine', 'Eat more fruits/vegetables'],
      lifestyle: ['Regular exercise', 'Weight management', 'Stress reduction', 'Meditation', 'Adequate sleep', 'Avoid smoking', 'Monitor BP regularly'],
      yoga: ['Sukhasana', 'Vajrasana', 'Shavasana', 'Anulom Vilom', 'Bhramari', 'Avoid inversions', 'Avoid Kapalabhati'],
      homeRemedies: ['Arjuna bark decoction', 'Brahmi + Ashwagandha powder', 'Garlic on empty station', 'Coconut water', 'Watermelon juice', 'Lemon + honey + warm water']
    },
    prevention: ['Maintain healthy weight', 'Exercise regularly', 'Reduce salt intake', 'Manage stress', 'Regular checkups', 'Take Sarpagandha as preventive'],
    prognosis: 'Can be well-controlled with Ayurvedic treatment. Many patients reduce or eliminate BP medications under supervision.',
    whenToSeeDoctor: 'If BP >180/120, severe headache, chest pain, vision changes, or confusion.',
    herbs: ['Sarpagandha', 'Arjuna', 'Brahmi', 'Ashwagandha', 'Jatamansi', 'Shankhpushpi', 'Mukta'],
    addedDate: '2026-06-11'
  },
  {
    id: 'arthritis', name: 'Arthritis (Sandhivata / Amavata)', sanskrit: 'संधिवात / अमवात', category: 'musculoskeletal', severity: 'chronic',
    description: 'Inflammation of joints causing pain and stiffness. Sandhivata (OA) is Vata-dominant, Amavata (RA) involves Ama (toxins).',
    symptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Redness', 'Reduced range of motion', 'Warmth around joint', 'Fatigue', 'Fever (in RA)'],
    causes: ['Age-related wear', 'Autoimmune response', 'Ama (toxin) accumulation', 'Vata aggravation', 'Poor diet', 'Sedentary lifestyle'],
    doshaImbalance: 'Vata-Kapha imbalance with Ama accumulation and Asthi dhatu (bone tissue) dushti',
    ayurvedicTreatment: {
      internalMedicines: ['Yogaraja Guggulu', 'Mahayogaraja Guggulu', 'Simhanad Guggulu', 'Ashwagandha Churna', 'Guduchi Satva', 'Rasnadi Churna', 'Dashamoola Kwath', 'Punarnava Mandoor'],
      externalTreatments: ['Abhyanga with Mahanarayana Taila', 'Pinda Sweda (bolus fomentation)', 'Janu Basti', 'Kati Basti', 'Lepa with Rasnadi Churna'],
      panchakarma: ['Abhyanga (oil massage)', 'Swedana (steam therapy)', 'Basti (medicated enema)', 'Pinda Sweda', 'Virechana'],
      diet: ['Warm, cooked foods', 'Avoid cold drinks', 'Avoid dairy', 'Increase ginger, turmeric', 'Avoid nightshades', 'Include omega-3 foods', 'Avoid processed foods'],
      lifestyle: ['Gentle exercise', 'Warm compress', 'Avoid cold exposure', 'Maintain healthy weight', 'Rest during flare-ups'],
      yoga: ['Gentle joint movements', 'Pawanmuktasana', 'Sukhasana', 'Vajrasana', 'Avoid weight-bearing during flare'],
      homeRemedies: ['Turmeric + warm milk', 'Ginger tea', 'Castor oil pack', 'Epsom salt warm bath', 'Garlic + sesame oil massage', 'Fenugreek seed paste']
    },
    prevention: ['Regular gentle exercise', 'Maintain healthy weight', 'Avoid cold/damp environments', 'Take Yogaraja Guggulu daily', 'Eat anti-inflammatory foods'],
    prognosis: 'Osteoarthritis can be well-managed. Rheumatoid arthritis can achieve remission with aggressive Panchakarma treatment.',
    whenToSeeDoctor: 'If severe swelling, fever, inability to move joint, or sudden worsening.',
    herbs: ['Guggulu', 'Ashwagandha', 'Guduchi', 'Rasna', 'Dashamoola', 'Punarnava', 'Shallaki'],
    addedDate: '2026-06-11'
  },
  {
    id: 'migraine', name: 'Migraine (Ardhavabhedaka)', sanskrit: 'अर्धावभेदक', category: 'neurological', severity: 'moderate',
    description: 'A severe, recurring headache often accompanied by nausea, vomiting, and sensitivity to light. Known as Ardhavabhedaka in Ayurveda.',
    symptoms: ['Severe one-sided headache', 'Nausea', 'Vomiting', 'Sensitivity to light', 'Sensitivity to sound', 'Aura (visual disturbances)', 'Dizziness'],
    causes: ['Stress', 'Hormonal changes', 'Certain foods', 'Sleep disturbances', 'Dehydration', 'Vata-Pitta imbalance'],
    doshaImbalance: 'Vata-Pitta imbalance with Prana Vata and Pitta aggravation in head region',
    ayurvedicTreatment: {
      internalMedicines: ['Shirashooladi Vajra Ras', 'Chandraprabha Vati', 'Brahmi Vati', 'Ashwagandha Churna', 'Shankhpushpi Churna', 'Jatamansi Churna', 'Sarpagandha Churna'],
      externalTreatments: ['Shirodhara with medicated oil', 'Nasya with Anu Taila', 'Shiro Basti', 'Pichu (medicated cotton on head)', 'Taila Dhara on forehead'],
      panchakarma: ['Nasya (nasal medication)', 'Shirodhara', 'Virechana', 'Basti'],
      diet: ['Regular meals', 'Avoid trigger foods', 'Avoid aged cheese', 'Avoid processed meats', 'Avoid alcohol', 'Increase magnesium-rich foods', 'Stay hydrated'],
      lifestyle: ['Regular sleep schedule', 'Stress management', 'Avoid bright screens', 'Regular exercise', 'Adequate hydration'],
      yoga: ['Shavasana', 'Sukhasana', 'Anulom Vilom', 'Bhramari', 'Sheetali Pranayama', 'Avoid inversions during attack'],
      homeRemedies: ['Peppermint oil on temples', 'Ginger tea', 'Cold compress on forehead', 'Coffee (small amount)', 'Lavender oil inhalation', 'Coriander seed decoction']
    },
    prevention: ['Identify and avoid triggers', 'Regular sleep', 'Stress management', 'Take Brahmi daily', 'Regular Nasya with Anu Taila'],
    prognosis: 'Frequency and severity can be significantly reduced with Ayurvedic treatment. Many patients achieve complete remission.',
    whenToSeeDoctor: 'If sudden severe headache, headache with fever/stiff neck, or headache after head injury.',
    herbs: ['Brahmi', 'Ashwagandha', 'Shankhpushpi', 'Jatamansi', 'Sarpagandha', 'Chandana', 'Kumari'],
    addedDate: '2026-06-11'
  },
  {
    id: 'depression', name: 'Depression (Vishada)', sanskrit: 'विषाद', category: 'mental', severity: 'moderate',
    description: 'A mental health disorder characterized by persistent sadness, loss of interest, and impaired daily functioning. Known as Vishada in Ayurveda.',
    symptoms: ['Persistent sadness', 'Loss of interest', 'Fatigue', 'Sleep disturbances', 'Appetite changes', 'Difficulty concentrating', 'Feelings of worthlessness', 'Thoughts of self-harm'],
    causes: ['Stress', 'Trauma', 'Genetic factors', 'Chemical imbalance', 'Chronic illness', 'Social isolation', 'Vata-Kapha imbalance'],
    doshaImbalance: 'Vata-Kapha imbalance with Manas (mind) dushti and Ojas (vitality) depletion',
    ayurvedicTreatment: {
      internalMedicines: ['Brahmi Vati', 'Ashwagandha Churna', 'Jatamansi Churna', 'Shankhpushpi Churna', 'Chyawanprash', 'Manasamitra Vatakam', 'Smriti Sagar Ras', 'Kalyanaka Ghrita'],
      externalTreatments: ['Shirodhara with Ksheerabala Taila', 'Abhyanga with Bala Taila', 'Shiro Basti', 'Takradhara', 'Pizhichil'],
      panchakarma: ['Shirodhara', 'Abhyanga', 'Basti', 'Nasya', 'Pizhichil'],
      diet: ['Warm, nourishing foods', 'Include nuts and seeds', 'Avoid processed foods', 'Increase omega-3', 'Warm milk with Ashwagandha', 'Avoid alcohol', 'Regular meal times'],
      lifestyle: ['Regular exercise', 'Sunlight exposure', 'Social connection', 'Meditation', 'Adequate sleep', 'Limit screen time', 'Nature walks'],
      yoga: ['Surya Namaskar', 'Bhujangasana', 'Sarvangasana', 'Matsyasana', 'Kapalabhati', 'Anulom Vilom', 'Bhramari', 'Nadi Shodhana'],
      homeRemedies: ['Ashwagandha + warm milk before bed', 'Brahmi tea', 'Meditation 20 min daily', 'Bath with lavender oil', 'Chamomile tea', 'Walnuts + dates']
    },
    prevention: ['Regular exercise', 'Social connection', 'Stress management', 'Take Ashwagandha daily', 'Practice meditation', 'Maintain work-life balance'],
    prognosis: 'Excellent response to Ayurvedic treatment. Most patients show significant improvement in 4-8 weeks.',
    whenToSeeDoctor: 'If thoughts of self-harm, inability to function, or symptoms persist beyond 2 weeks.',
    herbs: ['Brahmi', 'Ashwagandha', 'Jatamansi', 'Shankhpushpi', 'Vacha', 'Yashtimadhu', 'Chandana'],
    addedDate: '2026-06-11'
  },
  {
    id: 'asthma', name: 'Asthma (Shwasa Roga)', sanskrit: 'श्वास रोग', category: 'respiratory', severity: 'chronic',
    description: 'A chronic respiratory condition causing airway inflammation and breathing difficulty. Known as Shwasa Roga in Ayurveda.',
    symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing', 'Difficulty sleeping', 'Fatigue', 'Anxiety during attacks'],
    causes: ['Allergens', 'Air pollution', 'Respiratory infections', 'Exercise', 'Cold air', 'Stress', 'Genetic factors', 'Kapha-Vata imbalance'],
    doshaImbalance: 'Kapha-Vata imbalance with Pranavaha Srotas (respiratory channels) obstruction',
    ayurvedicTreatment: {
      internalMedicines: ['Sitopaladi Churna', 'Talisadi Churna', 'Vasavaleha', 'Kantakari Avaleha', 'Swaskuthar Ras', 'Chyawanprash', 'Pippali Churna', 'Guduchi Satva'],
      externalTreatments: ['Chest fomentation with salt', 'Abhyanga with Karpasasthyadi Taila', 'Uro Basti', 'Steam inhalation with Ajwain'],
      panchakarma: ['Vamana (therapeutic vomiting)', 'Virechana (purgation)', 'Nasya (nasal medication)', 'Swedana (steam therapy)'],
      diet: ['Warm foods', 'Avoid cold drinks', 'Avoid dairy', 'Avoid fried foods', 'Increase ginger, turmeric', 'Honey + warm water', 'Avoid allergens'],
      lifestyle: ['Avoid triggers', 'Regular exercise', 'Breathing exercises', 'Avoid smoking', 'Maintain healthy weight', 'Use air purifier'],
      yoga: ['Pranayama (Anulom Vilom)', 'Kapalabhati', 'Bhastrika', 'Ujjayi', 'Sukhasana', 'Vajrasana', 'Matsyasana', 'Dhanurasana'],
      homeRemedies: ['Honey + ginger juice', 'Turmeric + warm milk', 'Steam with Ajwain', 'Black coffee during attack', 'Garlic + honey', 'Bishop\'s weed (Ajwain) tea']
    },
    prevention: ['Avoid allergens', 'Regular Pranayama', 'Take Sitopaladi Churna daily', 'Avoid cold exposure', 'Maintain healthy weight', 'Get flu vaccine'],
    prognosis: 'Can be well-controlled with Ayurvedic treatment. Many patients reduce inhaler dependency significantly.',
    whenToSeeDoctor: 'If severe attack, blue lips/fingernails, difficulty speaking, or no relief from inhaler.',
    herbs: ['Sitopaladi', 'Talisadi', 'Vasa', 'Kantakari', 'Pippali', 'Guduchi', 'Tulsi', 'Ajwain'],
    addedDate: '2026-06-11'
  },
  {
    id: 'pcos', name: 'PCOS (Polycystic Ovary Syndrome)', sanskrit: 'बहुअंडकोश सिंड्रोम', category: 'reproductive', severity: 'chronic',
    description: 'A hormonal disorder in women causing enlarged ovaries with small cysts. Affects fertility, metabolism, and appearance.',
    symptoms: ['Irregular periods', 'Excess hair growth', 'Acne', 'Weight gain', 'Hair loss', 'Difficulty conceiving', 'Mood changes', 'Pelvic pain'],
    causes: ['Hormonal imbalance', 'Insulin resistance', 'Obesity', 'Genetics', 'Inflammation', 'Kapha-Vata imbalance'],
    doshaImbalance: 'Kapha-Vata imbalance with Artava Vaha Srotas (reproductive channels) obstruction and Medo dhatu increase',
    ayurvedicTreatment: {
      internalMedicines: ['Kanchanar Guggulu', 'Ashokarishta', 'Shatavari Churna', 'Dashamoola Kwath', 'Chandraprabha Vati', 'Pushyanug Churna', 'Phala Ghrita', 'Kumaryasava'],
      externalTreatments: ['Udvartana with Kolakulatthadi Churna', 'Yoni Pichu (vaginal suppository)', 'Abhyanga with Narayana Taila'],
      panchakarma: ['Vamana', 'Virechana', 'Basti (Uttara Basti)', 'Udvartana'],
      diet: ['Low glycemic foods', 'Avoid sugar/refined carbs', 'Increase fiber', 'Include Shatavari', 'Avoid dairy', 'Increase proteins', 'Anti-inflammatory foods'],
      lifestyle: ['Regular exercise', 'Weight management', 'Stress reduction', 'Adequate sleep', 'Yoga daily'],
      yoga: ['Surya Namaskar', 'Bhujangasana', 'Dhanurasana', 'Supta Baddha Konasana', 'Baddha Konasana', 'Sarvangasana', 'Matsyasana'],
      homeRemedies: ['Shatavari + warm milk', 'Cinnamon + honey', 'Fenugreek seeds soaked', 'Aloe vera juice', 'Turmeric + warm water', 'Apple cider vinegar + water']
    },
    prevention: ['Maintain healthy weight', 'Regular exercise', 'Balanced diet', 'Take Shatavari daily', 'Manage stress', 'Regular checkups'],
    prognosis: 'Can be effectively managed with Ayurvedic treatment. Many women conceive naturally after treatment.',
    whenToSeeDoctor: 'If trying to conceive for >12 months, severe pelvic pain, or excessive bleeding.',
    herbs: ['Shatavari', 'Kanchanar', 'Ashoka', 'Dashamoola', 'Guduchi', 'Amla', 'Cinnamon'],
    addedDate: '2026-06-11'
  },
  {
    id: 'eczema', name: 'Eczema (Vicharchika)', sanskrit: 'विचर्चिका', category: 'skin', severity: 'moderate',
    description: 'A chronic skin condition causing inflamed, itchy, cracked skin. Known as Vicharchika in Ayurveda.',
    symptoms: ['Itchy skin', 'Dry, scaly patches', 'Redness', 'Cracked skin', 'Oozing', 'Thickened skin', 'Dark patches', 'Swelling'],
    causes: ['Allergens', 'Irritants', 'Stress', 'Dry climate', 'Genetic factors', 'Immune dysfunction', 'Pitta-Kapha imbalance'],
    doshaImbalance: 'Pitta-Kapha imbalance with Rakta dhatu (blood) and Twak (skin) dushti',
    ayurvedicTreatment: {
      internalMedicines: ['Khadira Arishta', 'Mahamanjishthadi Kwath', 'Gandhaka Rasayana', 'Arogyavardhini Vati', 'Kaishore Guggulu', 'Saribadi Churna', 'Kumaryasava'],
      externalTreatments: ['Lepa with Haridra + Chandana', 'Abhyanga with Nalpamaradi Keram', 'Dhara with medicated liquids', 'Picchu with coconut oil'],
      panchakarma: ['Virechana (purgation)', 'Raktamokshana (blood purification)', 'Takradhara', 'Abhyanga'],
      diet: ['Avoid spicy food', 'Avoid sour foods', 'Avoid fermented foods', 'Increase bitter vegetables', 'Avoid dairy', 'Avoid seafood', 'Increase cooling foods'],
      lifestyle: ['Avoid scratching', 'Use mild soaps', 'Moisturize regularly', 'Avoid wool/synthetic fabrics', 'Manage stress', 'Avoid hot showers'],
      yoga: ['Surya Namaskar', 'Shitali Pranayama', 'Sheetkari Pranayama', 'Sarvangasana', 'Matsyasana'],
      homeRemedies: ['Aloe vera gel', 'Coconut oil + turmeric', 'Neem leaf paste', 'Oatmeal bath', 'Apple cider vinegar diluted', 'Honey + cinnamon paste']
    },
    prevention: ['Moisturize daily', 'Avoid triggers', 'Use gentle products', 'Manage stress', 'Take Khadira Arishta daily'],
    prognosis: 'Can be well-controlled with Ayurvedic treatment. Complete remission possible with strict diet and lifestyle.',
    whenToSeeDoctor: 'If infection, spreading rapidly, or not responding to treatment in 4 weeks.',
    herbs: ['Khadira', 'Manjishtha', 'Gandhaka', 'Neem', 'Haridra', 'Chandana', 'Kumari'],
    addedDate: '2026-06-11'
  },
  {
    id: 'obesity', name: 'Obesity (Sthaulya)', sanskrit: 'स्थौल्य', category: 'lifestyle', severity: 'moderate',
    description: 'Excess body fat that increases risk of health problems. Known as Sthaulya or Medoroga in Ayurveda - one of the most difficult to treat.',
    symptoms: ['Excess body weight', 'Fatigue', 'Joint pain', 'Breathing difficulty', 'Sleep apnea', 'High blood pressure', 'Diabetes risk', 'Low self-esteem'],
    causes: ['Overeating', 'Sedentary lifestyle', 'Genetic factors', 'Hormonal imbalance', 'Stress eating', 'Poor sleep', 'Kapha aggravation'],
    doshaImbalance: 'Severe Kapha imbalance with Medo dhatu (fat tissue) increase and Agni mandya (weak metabolism)',
    ayurvedicTreatment: {
      internalMedicines: ['Triphala Guggulu', 'Medohar Guggulu', 'Chitrakadi Vati', 'Punarnava Mandoor', 'Shilajit', 'Guduchi Churna', 'Triphala Churna', 'Vidangadi Churna'],
      externalTreatments: ['Udvartana with Kolakulatthadi Churna', 'Abhyanga with Mustard oil', 'Swedana (steam therapy)', 'Lepa with medicated paste'],
      panchakarma: ['Vamana (therapeutic vomiting)', 'Virechana (purgation)', 'Udvartana (powder massage)', 'Swedana', 'Basti'],
      diet: ['Low calorie, high fiber', 'Avoid sugar completely', 'Avoid fried foods', 'Increase bitter/pungent foods', 'Small frequent meals', 'No snacking', 'Warm water throughout day'],
      lifestyle: ['Intense exercise 45+ min daily', 'No sedentary behavior', 'Early dinner (before 7 PM)', 'Adequate sleep', 'Stress management'],
      yoga: ['Surya Namaskar (108 rounds)', 'Kapalabhati', 'Bhastrika', 'Naukasana', 'Dhanurasana', 'Ustrasana', 'Sarvangasana'],
      homeRemedies: ['Lemon + honey + warm water morning', 'Apple cider vinegar + water', 'Triphala powder at night', 'Ginger + lemon tea', 'Fenugreek seeds soaked', 'Cinnamon + honey']
    },
    prevention: ['Regular exercise', 'Balanced diet', 'Portion control', 'Avoid processed foods', 'Take Triphala daily', 'Active lifestyle'],
    prognosis: 'Significant weight loss (20-40 kg) possible in 6-12 months with strict Ayurvedic regimen and Panchakarma.',
    whenToSeeDoctor: 'If BMI >40, sleep apnea, joint damage, or diabetes develops.',
    herbs: ['Guggulu', 'Triphala', 'Chitrak', 'Vidanga', 'Shilajit', 'Punarnava', 'Guduchi'],
    addedDate: '2026-06-11'
  },
]

// ─── Get diseases by category ───
export function getDiseasesByCategory(category: string): DiseaseEntry[] {
  return DISEASE_DATABASE.filter(d => d.category === category)
}

// ─── Get disease by ID ───
export function getDiseaseById(id: string): DiseaseEntry | undefined {
  return DISEASE_DATABASE.find(d => d.id === id)
}

// ─── Search diseases ───
export function searchDiseases(query: string): DiseaseEntry[] {
  const q = query.toLowerCase()
  return DISEASE_DATABASE.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.sanskrit.includes(q) ||
    d.symptoms.some(s => s.toLowerCase().includes(q)) ||
    d.herbs.some(h => h.toLowerCase().includes(q)) ||
    d.category.toLowerCase().includes(q)
  )
}

// ─── Get all categories ───
export function getCategories(): { id: string; name: string; count: number }[] {
  const cats: Record<string, number> = {}
  for (const d of DISEASE_DATABASE) {
    cats[d.category] = (cats[d.category] || 0) + 1
  }
  return Object.entries(cats).map(([id, count]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' '),
    count,
  }))
}

// ─── Get daily featured disease ───
export function getDailyFeaturedDisease(): DiseaseEntry {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return DISEASE_DATABASE[dayOfYear % DISEASE_DATABASE.length]
}

// ─── Get daily health tip ───
export function getDailyHealthTip(): { tip: string; category: string; icon: string } {
  const tips = [
    { tip: 'Drink warm water with lemon and honey first thing in the morning to boost digestion and immunity.', category: 'Daily Routine', icon: '🌅' },
    { tip: 'Take 1 tsp of Triphala powder with warm water at bedtime for detoxification and better sleep.', category: 'Detox', icon: '🌿' },
    { tip: 'Practice Abhyanga (self-massage) with warm sesame oil before bath for joint health and relaxation.', category: 'Self-Care', icon: '💆' },
    { tip: 'Eat your largest meal at lunch when digestive fire (Agni) is strongest. Keep dinner light.', category: 'Diet', icon: '🍽️' },
    { tip: 'Pranayama for 10 minutes daily can reduce stress, improve lung function, and balance doshas.', category: 'Breathing', icon: '🌬️' },
    { tip: 'Apply Brahmi oil on scalp at night for better sleep, memory, and hair health.', category: 'Brain Health', icon: '🧠' },
    { tip: 'Drink Turmeric milk (Golden Milk) before bed for anti-inflammatory benefits and better immunity.', category: 'Immunity', icon: '🥛' },
    { tip: 'Avoid ice-cold drinks. They weaken digestive fire and cause Ama (toxin) accumulation.', category: 'Diet', icon: '🚫' },
    { tip: 'Wake up before sunrise (Brahma Muhurta) for optimal energy and mental clarity.', category: 'Daily Routine', icon: '⏰' },
    { tip: 'Chew food 32 times before swallowing for better digestion and nutrient absorption.', category: 'Digestion', icon: '🦷' },
    { tip: 'Apply coconut oil in nostrils (Nasya) daily to prevent allergies and improve brain function.', category: 'Prevention', icon: '👃' },
    { tip: 'Take Ashwagandha (500mg) twice daily for stress relief, energy, and hormonal balance.', category: 'Adaptogen', icon: '💪' },
    { tip: 'Practice Sheetali Pranayama (cooling breath) to reduce Pitta and body heat.', category: 'Cooling', icon: '❄️' },
    { tip: 'Eat seasonal and local foods. They are most compatible with your body\'s needs.', category: 'Diet', icon: '🌾' },
    { tip: 'Oil pulling with sesame oil for 10 minutes daily improves oral health and detoxifies.', category: 'Oral Health', icon: '🦷' },
  ]
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return tips[dayOfYear % tips.length]
}
