'use client'
import { useState, useEffect, useCallback } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

// Comprehensive translations for UI elements across all pages
const translations: Record<string, Record<string, string>> = {
  hi: {
    home: 'होम', about: 'हमारे बारे में', services: 'सेवाएं', contact: 'संपर्क करें',
    finance: 'वित्त', ayurveda: 'आयुर्वेद', happiness: 'खुशी', career: 'करियर',
    search: 'खोजें', explore: 'अन्वेषण करें', learn_more: 'और जानें', get_started: 'शुरू करें',
    welcome: 'स्वागत है', our_services: 'हमारी सेवाएं', why_us: 'हमें क्यों चुनें',
    infrastructure: 'बुनियादी ढांचा', real_estate: 'रियल एस्टेट', trading: 'ट्रेडिंग',
    investment: 'निवेश', herbs: 'जड़ी-बूटियां', consultation: 'परामर्श',
    phone: 'फ़ोन', email: 'ईमेल', address: 'पता', name: 'नाम',
    submit: 'जमा करें', send: 'भेजें', call_now: 'अभी कॉल करें',
    free_consultation: 'मुफ्त परामर्श', book_now: 'अभी बुक करें',
    view_all: 'सभी देखें', read_more: 'और पढ़ें', download: 'डाउनलोड करें',
    loading: 'लोड हो रहा है...', error: 'त्रुटि', success: 'सफल',
    language: 'भाषा', select_language: 'भाषा चुनें',
    page_not_found: 'पृष्ठ नहीं मिला', go_home: 'होम जाएं',
    construction: 'निर्माण', properties: 'संपत्तियां', plots: 'प्लॉट',
    apartments: 'अपार्टमेंट', commercial: 'व्यावसायिक', residential: 'आवासीय',
    buy: 'खरीदें', sell: 'बेचें', rent: 'किराया', lease: 'पट्टा',
    stock_market: 'शेयर बाजार', mutual_funds: 'म्यूचुअल फंड', options: 'ऑप्शन्स',
    immunity: 'प्रतिरक्षा', digestion: 'पाचन', stress: 'तनाव', sleep: 'नींद',
    hair: 'बाल', skin: 'त्वचा', heart: 'दिल', brain: 'दिमाग',
    jobs: 'नौकरियां', apply_now: 'अभी आवेदन करें', resume: 'बायोडाटा',
    salary: 'वेतन', experience: 'अनुभव', location: 'स्थान',
    description: 'विवरण', requirements: 'आवश्यकताएं', benefits: 'लाभ',
    testimonials: 'प्रशंसापत्र', gallery: 'गैलरी', blog: 'ब्लॉग',
    privacy_policy: 'गोपनीयता नीति', terms: 'नियम और शर्तें',
    follow_us: 'हमें फॉलो करें', newsletter: 'न्यूज़लेटर',
    subscribe: 'सदस्यता लें', enter_email: 'ईमेल दर्ज करें',
  },
  mr: {
    home: 'मुख्यपृष्ठ', about: 'आमच्याबद्दल', services: 'सेवा', contact: 'संपर्क',
    finance: 'वित्त', ayurveda: 'आयुर्वेद', happiness: 'आनंद', career: 'करियर',
    search: 'शोधा', explore: 'शोधा', learn_more: 'अधिक जाणून घ्या', get_started: 'सुरू करा',
    welcome: 'स्वागत आहे', our_services: 'आमच्या साेवा', why_us: 'आम्हाला का निवडा',
    infrastructure: 'पायाभूत सुविधा', real_estate: 'रिअल एस्टेट', trading: 'ट्रेडिंग',
    investment: 'गुंतवणूक', herbs: 'औषधी वनस्पती', consultation: 'सल्लामसलत',
    phone: 'फोन', email: 'ईमेल', address: 'पत्ता', name: 'नाव',
    submit: 'सबमिट करा', send: 'पाठवा', call_now: 'आता कॉल करा',
    free_consultation: 'मोफत सल्ला', book_now: 'आता बुक करा',
    view_all: 'सर्व पहा', read_more: 'अधिक वाचा', download: 'डाउनलोड करा',
    loading: 'लोड होत आहे...', error: 'त्रुटी', success: 'यशस्वी',
    language: 'भाषा', select_language: 'भाषा निवडा',
    page_not_found: 'पृष्ठ सापडले नाही', go_home: 'मुख्यपृष्ठावर जा',
    construction: 'बांधकाम', properties: 'मालमत्ता', plots: 'प्लॉट',
    apartments: 'अपार्टमेंट', commercial: 'व्यावसायिक', residential: 'निवासी',
    buy: 'खरेदी करा', sell: 'विका', rent: 'भाडे', lease: 'पट्टा',
    stock_market: 'शेयर बाजार', mutual_funds: 'म्युच्युअल फंड', options: 'ऑप्शन्स',
    immunity: 'रोगप्रतिकारक शक्ती', digestion: 'पचन', stress: 'ताण', sleep: 'झोप',
    hair: 'केस', skin: 'त्वचा', heart: 'हृदय', brain: 'मेंदू',
    jobs: 'नोकर्या', apply_now: 'आता अर्ज करा', resume: 'रेस्यूम',
    salary: 'पगार', experience: 'अनुभव', location: 'स्थान',
    description: 'वर्णन', requirements: 'आवश्यकता', benefits: 'फायदे',
    testimonials: 'शिफारसी', gallery: 'गॅलरी', blog: 'ब्लॉग',
    privacy_policy: 'गोपनीयता धोरण', terms: 'अटी आणि शर्ती',
    follow_us: 'आमचे अनुसरण करा', newsletter: 'वृत्तपत्र',
    subscribe: 'सदस्यता घ्या', enter_email: 'ईमेल प्रविष्ट करा',
  },
  gu: {
    home: 'હોમ', about: 'અમારા વિશે', services: 'સેવાઓ', contact: 'સંપર્ક',
    finance: 'ફાયનાન્સ', ayurveda: 'આયુર્વેદ', happiness: 'ખુશી', career: 'કરિયર',
    search: 'શોધો', explore: 'શોધો', learn_more: 'વધુ જાણો', get_started: 'શરૂ કરો',
    welcome: 'સ્વાગત છે', our_services: 'અમારી સેવાઓ', why_us: 'અમને કેમ પસંદ કરો',
    infrastructure: 'ઈન્ફ્રાસ્ટ્રક્ચર', real_estate: 'રીઅલ એસ્ટેટ', trading: 'ટ્રેડિંગ',
    investment: 'રોકાણ', herbs: 'જડીબુટ્ટીઓ', consultation: 'પરામર્શ',
    phone: 'ફોન', email: 'ઈમેઈલ', address: 'સરનામું', name: 'નામ',
    submit: 'સબમિટ કરો', send: 'મોકલો', call_now: 'હમણાં કોલ કરો',
    free_consultation: 'મફત પરામર્શ', book_now: 'હમણાં બુક કરો',
    view_all: 'બધું જુઓ', read_more: 'વધુ વાંચો', download: 'ડાઉનલોડ કરો',
    loading: 'લોડ થઈ રહ્યું છે...', error: 'ભૂલ', success: 'સફળ',
    language: 'ભાષા', select_language: 'ભાષા પસંદ કરો',
    page_not_found: 'પૃષ્ઠ મળ્યું નથી', go_home: 'હોમ જાઓ',
    construction: 'બાંધકામ', properties: 'મિલકત', plots: 'પ્લોટ',
    apartments: 'એપાર્ટમેન્ટ', commercial: 'વ્યાપારિક', residential: 'રહેણાંક',
    buy: 'ખરીદો', sell: 'વેચો', rent: 'ભાડે', lease: 'લીઝ',
    stock_market: 'શેર બજાર', mutual_funds: 'મ્યુચ્યુઅલ ફંડ', options: 'ઓપ્શન્સ',
    immunity: 'રોગપ્રતિકારક', digestion: 'પાચન', stress: 'તણાવ', sleep: 'ઊંઘ',
    hair: 'વાળ', skin: 'ત્વચા', heart: 'હૃદય', brain: 'મગજ',
    jobs: 'નોકરીઓ', apply_now: 'હમણાં અરજી કરો', resume: 'રેસ્યુમ',
    salary: 'પગાર', experience: 'અનુભવ', location: 'સ્થળ',
    description: 'વર્ણન', requirements: 'જરૂરિયાત', benefits: 'ફાયદા',
    testimonials: 'પ્રશંસાપત્રો', gallery: 'ગેલેરી', blog: 'બ્લોગ',
    privacy_policy: 'ગોપનીયતા નીતિ', terms: 'નિયમો અને શરતો',
    follow_us: 'અમને ફોલો કરો', newsletter: 'ન્યૂઝલેટર',
    subscribe: 'સબ્સ્ક્રાઇબ કરો', enter_email: 'ઈમેઈલ દાખલ કરો',
  },
  bn: {
    home: 'হোম', about: 'আমাদের সম্পর্কে', services: 'সেবা', contact: 'যোগাযোগ',
    finance: 'ফাইন্যান্স', ayurveda: 'আয়ুর্বেদ', happiness: 'সুখ', career: 'ক্যারিয়ার',
    search: 'খুঁজুন', explore: 'অন্বেষণ', learn_more: 'আরও জানুন', get_started: 'শুরু করুন',
    welcome: 'স্বাগতম', our_services: 'আমাদের সেবা', why_us: 'আমাদের কেন বেছে নিন',
    infrastructure: 'অবকাঠামো', real_estate: 'রিয়েল এস্টেট', trading: 'ট্রেডিং',
    investment: 'বিনিয়োগ', herbs: 'ভেষজ', consultation: 'পরামর্শ',
    phone: 'ফোন', email: 'ইমেইল', address: 'ঠিকানা', name: 'নাম',
    submit: 'জমা দিন', send: 'পাঠান', call_now: 'এখনই কল করুন',
    free_consultation: 'বিনামূল্যে পরামর্শ', book_now: 'এখনই বুক করুন',
    view_all: 'সব দেখুন', read_more: 'আরও পড়ুন', download: 'ডাউনলোড',
    loading: 'লোড হচ্ছে...', error: 'ত্রুটি', success: 'সফল',
    language: 'ভাষা', select_language: 'ভাষা নির্বাচন করুন',
    page_not_found: 'পৃষ্ঠা পাওয়া যায়নি', go_home: 'হোমে যান',
    construction: 'নির্মাণ', properties: 'সম্পত্তি', plots: 'প্লট',
    apartments: 'অ্যাপার্টমেন্ট', commercial: 'বাণিজ্যিক', residential: 'আবাসিক',
    buy: 'কিনুন', sell: 'বিক্রি', rent: 'ভাড়া', lease: 'লিজ',
    stock_market: 'শেয়ার বাজার', mutual_funds: 'মিউচুয়াল ফান্ড', options: 'অপশন',
    immunity: 'রোগ প্রতিরোধ', digestion: 'পরিপাক', stress: 'চাপ', sleep: 'ঘুম',
    hair: 'চুল', skin: 'ত্বক', heart: 'হৃদয়', brain: 'মস্তিষ্ক',
    jobs: 'চাকরি', apply_now: 'এখনই আবেদন করুন', resume: 'রেজিউমে',
    salary: 'বেতন', experience: 'অভিজ্ঞতা', location: 'অবস্থান',
    description: 'বিবরণ', requirements: 'প্রয়োজনীয়তা', benefits: 'সুবিধা',
    testimonials: 'প্রশংসাপত্র', gallery: 'গ্যালারি', blog: 'ব্লগ',
    privacy_policy: 'গোপনীয়তা নীতি', terms: 'শর্তাবলী',
    follow_us: 'আমাদের অনুসরণ করুন', newsletter: 'নিউজলেটার',
    subscribe: 'সাবস্ক্রাইব', enter_email: 'ইমেইল লিখুন',
  },
  ta: {
    home: 'முகப்பு', about: 'எங்களைப் பற்றி', services: 'சேவைகள்', contact: 'தொடர்பு',
    finance: 'நிதி', ayurveda: 'ஆயுர்வேதா', happiness: 'மகிழ்ச்சி', career: 'வேலை',
    search: 'தேடு', explore: 'ஆராய்', learn_more: 'மேலும் அறிய', get_started: 'தொடங்கு',
    welcome: 'வரவேற்கிறோம்', our_services: 'எங்கள் சேவைகள்', why_us: 'ஏன் எங்களை தேர்வு',
    infrastructure: 'உள்கட்டமைப்பு', real_estate: 'ரியல் எஸ்டேட்', trading: 'டிரேடிங்',
    investment: 'முதலீடு', herbs: 'மூலிகைகள்', consultation: 'ஆலோசனை',
    phone: 'தொலைபேசி', email: 'மின்னஞ்சல்', address: 'முகவரி', name: 'பெயர்',
    submit: 'சமர்ப்பி', send: 'அனுப்பு', call_now: 'இப்போது அழை',
    free_consultation: 'இலவச ஆலோசனை', book_now: 'இப்போது புக்',
    view_all: 'அனைத்தும் காண்', read_more: 'மேலும் படி', download: 'பதிவிறக்கு',
    loading: 'ஏற்றுகிறது...', error: 'பிழை', success: 'வெற்றி',
    language: 'மொழி', select_language: 'மொழி தேர்வு',
    page_not_found: 'பக்கம் கிடைக்கவில்லை', go_home: 'முகப்புக்கு செல்',
    construction: 'கட்டுமானம்', properties: 'சொத்துகள்', plots: 'பிளாட்டுகள்',
    apartments: 'அபார்ட்மென்ட்', commercial: 'வணிக', residential: 'குடியிருப்பு',
    buy: 'வாங்கு', sell: 'விற்கு', rent: 'வாடகை', lease: 'லீஸ்',
    stock_market: 'பங்குச் சந்தை', mutual_funds: 'மியூச்சுவல் ஃபண்ட்', options: 'ஆப்ஷன்ஸ்',
    immunity: 'நோய் எதிர்ப்பு', digestion: 'செரிமானம்', stress: 'மன அழுத்தம்', sleep: 'தூக்கம்',
    hair: 'முடி', skin: 'தோல்', heart: 'இதயம்', brain: 'மூளை',
    jobs: 'வேலைகள்', apply_now: 'இப்போது விண்ணப்பி', resume: 'ரெஸ்யூம்',
    salary: 'சம்பளம்', experience: 'அனுபவம்', location: 'இடம்',
    description: 'விளக்கம்', requirements: 'தேவைகள்', benefits: 'நன்மைகள்',
    testimonials: 'சான்றுகள்', gallery: 'கேலரி', blog: 'பிலாக்',
    privacy_policy: 'தனியுரிமைக் கொள்கை', terms: 'விதிமுறைகள்',
    follow_us: 'எங்களைப் பின்தொடர்', newsletter: 'நியூஸ்லெட்டர்',
    subscribe: 'சப்ஸ்கிரைப்', enter_email: 'மின்னஞ்சல் உள்ளிடு',
  },
  te: {
    home: 'హోమ్', about: 'మా గురించి', services: 'సేవలు', contact: 'సంప్రదించండి',
    finance: 'ఫైనాన్స్', ayurveda: 'ఆయుర్వేదం', happiness: 'సంతోషం', career: 'కెరీర్',
    search: 'వెతుకు', explore: 'అన్వేషించు', learn_more: 'మరింత తెలుసుకోండి', get_started: 'ప్రారంభించు',
    welcome: 'స్వాగతం', our_services: 'మా సేవలు', why_us: 'మమ్మల్ని ఎందుకు ఎంచుకోండి',
    infrastructure: 'ఇన్ఫ్రాస్ట్రక్చర్', real_estate: 'రియల్ ఎస్టేట్', trading: 'ట్రేడింగ్',
    investment: 'పెట్టుబడి', herbs: 'మూలికలు', consultation: 'సలహా',
    phone: 'ఫోన్', email: 'ఇమెయిల్', address: 'చిరునామా', name: 'పేరు',
    submit: 'సమర్పించు', send: 'పంపు', call_now: 'ఇప్పుడు కాల్ చేయండి',
    free_consultation: 'ఉచిత సలహా', book_now: 'ఇప్పుడు బుక్ చేయండి',
    view_all: 'అన్నీ చూడండి', read_more: 'మరింత చదవండి', download: 'డౌన్లోడ్',
    loading: 'లోడ్ అవుతోంది...', error: 'లోపం', success: 'విజయం',
    language: 'భాష', select_language: 'భాష ఎంచుకోండి',
    page_not_found: 'పేజీ కనుగొనబడలేదు', go_home: 'హోమ్ వెళ్ళండి',
    construction: 'నిర్మాణం', properties: 'ఆస్తులు', plots: 'ప్లాట్లు',
    apartments: 'అపార్ట్‌మెంట్', commercial: 'వాణిజ్య', residential: 'నివాస',
    buy: 'కొనుగోలు', sell: 'అమ్మకం', rent: 'అద్దె', lease: 'లీజు',
    stock_market: 'స్టాక్ మార్కెట్', mutual_funds: 'మ్యూచువల్ ఫండ్', options: 'ఆప్షన్స్',
    immunity: 'రోగనిరోధక', digestion: 'జీర్ణం', stress: 'ఒత్తిడి', sleep: 'నిద్ర',
    hair: 'జుట్టు', skin: 'చర్మం', heart: 'హృదయం', brain: 'మెదడు',
    jobs: 'ఉద్యోగాలు', apply_now: 'ఇప్పుడు దరఖాస్తు', resume: 'రెజ్యూమ్',
    salary: 'జీతం', experience: 'అనుభవం', location: 'ప్రాంతం',
    description: 'వివరణ', requirements: 'అవసరాలు', benefits: 'ప్రయోజనాలు',
    testimonials: 'సాక్ష్యాలు', gallery: 'గ్యాలరీ', blog: 'బ్లాగ్',
    privacy_policy: 'గోప్యతా విధానం', terms: 'నిబంధనలు',
    follow_us: 'మమ్మల్ని అనుసరించండి', newsletter: 'న్యూస్‌లెటర్',
    subscribe: 'సబ్‌స్క్రైబ్', enter_email: 'ఇమెయిల్ నమోదు చేయండి',
  },
  kn: {
    home: 'ಮುಖಪುಟ', about: 'ನಮ್ಮ ಬಗ್ಗೆ', services: 'ಸೇವೆಗಳು', contact: 'ಸಂಪರ್ಕಿಸಿ',
    finance: 'ಹಣಕಾಸು', ayurveda: 'ಆಯುರ್ವೇದ', happiness: 'ಸಂತೋಷ', career: 'ವೃತ್ತಿ',
    search: 'ಹುಡುಕು', explore: 'ಅನ್ವೇಷಿಸು', learn_more: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ', get_started: 'ಪ್ರಾರಂಭಿಸು',
    welcome: 'ಸ್ವಾಗತ', our_services: 'ನಮ್ಮ ಸೇವೆಗಳು', why_us: 'ನಮ್ಮನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು',
    infrastructure: 'ಇನ್ಫ್ರಾಸ್ಟ್ರಕ್ಚರ್', real_estate: 'ರಿಯಲ್ ಎಸ್ಟೇಟ್', trading: 'ಟ್ರೇಡಿಂಗ್',
    investment: 'ಹೂಡಿಕೆ', herbs: 'ಔಷಧಿ ಗಿಡಗಳು', consultation: 'ಸಲಹೆ',
    phone: 'ಫೋನ್', email: 'ಇಮೇಲ್', address: 'ವಿಳಾಸ', name: 'ಹೆಸರು',
    submit: 'ಸಲ್ಲಿಸು', send: 'ಕಳುಹಿಸು', call_now: 'ಈಗ ಕರೆ ಮಾಡಿ',
    free_consultation: 'ಉಚಿತ ಸಲಹೆ', book_now: 'ಈಗ ಬುಕ್ ಮಾಡಿ',
    view_all: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ', read_more: 'ಇನ್ನಷ್ಟು ಓದಿ', download: 'ಡೌನ್‌ಲೋಡ್',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', error: 'ದೋಷ', success: 'ಯಶಸ್ಸು',
    language: 'ಭಾಷೆ', select_language: 'ಭಾಷೆ ಆಯ್ಕೆ',
    page_not_found: 'ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ', go_home: 'ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ',
    construction: 'ನಿರ್ಮಾಣ', properties: 'ಆಸ್ತಿಗಳು', plots: 'ಪ್ಲಾಟ್‌ಗಳು',
    apartments: 'ಅಪಾರ್ಟ್‌ಮೆಂಟ್', commercial: 'ವ್ಯಾಪಾರಿಕ', residential: 'ವಾಸಸ್ಥಾನ',
    buy: 'ಖರೀದಿಸು', sell: 'ಮಾರಾಟ', rent: 'ಬಾಡಿಗೆ', lease: 'ಲೀಸ್',
    stock_market: 'ಷೇರು ಮಾರುಕಟ್ಟೆ', mutual_funds: 'ಮ್ಯುಚುವಲ್ ಫಂಡ್', options: 'ಆಪ್ಷನ್ಸ್',
    immunity: 'ರೋಗನಿರೋಧಕ', digestion: 'ಜೀರ್ಣ', stress: 'ಒತ್ತಡ', sleep: 'ನಿದ್ರೆ',
    hair: 'ಕೂದಲು', skin: 'ಚರ್ಮ', heart: 'ಹೃದಯ', brain: 'ಮೆದುಳು',
    jobs: 'ಉದ್ಯೋಗಗಳು', apply_now: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ', resume: 'ರೇಸ್ಯೂಮ್',
    salary: 'ಸಂಬಳ', experience: 'ಅನುಭವ', location: 'ಸ್ಥಳ',
    description: 'ವಿವರಣೆ', requirements: 'ಅಗತ್ಯಗಳು', benefits: 'ಪ್ರಯೋಜನಗಳು',
    testimonials: 'ಸಾಕ್ಷ್ಯಗಳು', gallery: 'ಗ್ಯಾಲರಿ', blog: 'ಬ್ಲಾಗ್',
    privacy_policy: 'ಗೌಪ್ಯತೆ ನೀತಿ', terms: 'ನಿಯಮಗಳು',
    follow_us: 'ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ', newsletter: 'ನ್ಯೂಸ್‌ಲೆಟರ್',
    subscribe: 'ಸಬ್‌ಸ್ಕ್ರೈಬ್', enter_email: 'ಇಮೇಲ್ ನಮೂದಿಸಿ',
  },
  es: {
    home: 'Inicio', about: 'Acerca de', services: 'Servicios', contact: 'Contacto',
    finance: 'Finanzas', ayurveda: 'Ayurveda', happiness: 'Felicidad', career: 'Carrera',
    search: 'Buscar', explore: 'Explorar', learn_more: 'Más información', get_started: 'Comenzar',
    welcome: 'Bienvenido', our_services: 'Nuestros servicios', why_us: 'Por qué elegirnos',
    infrastructure: 'Infraestructura', real_estate: 'Bienes raíces', trading: 'Trading',
    investment: 'Inversión', herbs: 'Hierbas', consultation: 'Consulta',
    phone: 'Teléfono', email: 'Correo', address: 'Dirección', name: 'Nombre',
    submit: 'Enviar', send: 'Enviar', call_now: 'Llamar ahora',
    free_consultation: 'Consulta gratuita', book_now: 'Reservar ahora',
    view_all: 'Ver todo', read_more: 'Leer más', download: 'Descargar',
    loading: 'Cargando...', error: 'Error', success: 'Éxito',
    language: 'Idioma', select_language: 'Seleccionar idioma',
    page_not_found: 'Página no encontrada', go_home: 'Ir al inicio',
    construction: 'Construcción', properties: 'Propiedades', plots: 'Parcelas',
    apartments: 'Apartamentos', commercial: 'Comercial', residential: 'Residencial',
    buy: 'Comprar', sell: 'Vender', rent: 'Alquilar', lease: 'Arrendar',
    stock_market: 'Bolsa de valores', mutual_funds: 'Fondos mutuos', options: 'Opciones',
    immunity: 'Inmunidad', digestion: 'Digestión', stress: 'Estrés', sleep: 'Sueño',
    hair: 'Cabello', skin: 'Piel', heart: 'Corazón', brain: 'Cerebro',
    jobs: 'Empleos', apply_now: 'Aplicar ahora', resume: 'Currículum',
    salary: 'Salario', experience: 'Experiencia', location: 'Ubicación',
    description: 'Descripción', requirements: 'Requisitos', benefits: 'Beneficios',
    testimonials: 'Testimonios', gallery: 'Galería', blog: 'Blog',
    privacy_policy: 'Política de privacidad', terms: 'Términos y condiciones',
    follow_us: 'Síguenos', newsletter: 'Boletín',
    subscribe: 'Suscribirse', enter_email: 'Ingresar correo',
  },
  fr: {
    home: 'Accueil', about: 'À propos', services: 'Services', contact: 'Contact',
    finance: 'Finance', ayurveda: 'Ayurveda', happiness: 'Bonheur', career: 'Carrière',
    search: 'Rechercher', explore: 'Explorer', learn_more: 'En savoir plus', get_started: 'Commencer',
    welcome: 'Bienvenue', our_services: 'Nos services', why_us: 'Pourquoi nous choisir',
    infrastructure: 'Infrastructure', real_estate: 'Immobilier', trading: 'Trading',
    investment: 'Investissement', herbs: 'Herbes', consultation: 'Consultation',
    phone: 'Téléphone', email: 'E-mail', address: 'Adresse', name: 'Nom',
    submit: 'Soumettre', send: 'Envoyer', call_now: 'Appeler maintenant',
    free_consultation: 'Consultation gratuite', book_now: 'Réserver maintenant',
    view_all: 'Voir tout', read_more: 'Lire plus', download: 'Télécharger',
    loading: 'Chargement...', error: 'Erreur', success: 'Succès',
    language: 'Langue', select_language: 'Choisir la langue',
    page_not_found: 'Page non trouvée', go_home: "Aller à l'accueil",
    construction: 'Construction', properties: 'Propriétés', plots: 'Terrains',
    apartments: 'Appartements', commercial: 'Commercial', residential: 'Résidentiel',
    buy: 'Acheter', sell: 'Vendre', rent: 'Louer', lease: 'Bail',
    stock_market: 'Bourse', mutual_funds: 'Fonds communs', options: 'Options',
    immunity: 'Immunité', digestion: 'Digestion', stress: 'Stress', sleep: 'Sommeil',
    hair: 'Cheveux', skin: 'Peau', heart: 'Cœur', brain: 'Cerveau',
    jobs: 'Emplois', apply_now: 'Postuler maintenant', resume: 'CV',
    salary: 'Salaire', experience: 'Expérience', location: 'Lieu',
    description: 'Description', requirements: 'Exigences', benefits: 'Avantages',
    testimonials: 'Témoignages', gallery: 'Galerie', blog: 'Blog',
    privacy_policy: 'Politique de confidentialité', terms: 'Conditions générales',
    follow_us: 'Suivez-nous', newsletter: 'Newsletter',
    subscribe: "S'abonner", enter_email: 'Entrer e-mail',
  },
  de: {
    home: 'Startseite', about: 'Über uns', services: 'Dienstleistungen', contact: 'Kontakt',
    finance: 'Finanzen', ayurveda: 'Ayurveda', happiness: 'Glück', career: 'Karriere',
    search: 'Suchen', explore: 'Erkunden', learn_more: 'Mehr erfahren', get_started: 'Starten',
    welcome: 'Willkommen', our_services: 'Unsere Dienstleistungen', why_us: 'Warum uns wählen',
    infrastructure: 'Infrastruktur', real_estate: 'Immobilien', trading: 'Handel',
    investment: 'Investition', herbs: 'Kräuter', consultation: 'Beratung',
    phone: 'Telefon', email: 'E-Mail', address: 'Adresse', name: 'Name',
    submit: 'Absenden', send: 'Senden', call_now: 'Jetzt anrufen',
    free_consultation: 'Kostenlose Beratung', book_now: 'Jetzt buchen',
    view_all: 'Alle anzeigen', read_more: 'Mehr lesen', download: 'Herunterladen',
    loading: 'Laden...', error: 'Fehler', success: 'Erfolg',
    language: 'Sprache', select_language: 'Sprache auswählen',
    page_not_found: 'Seite nicht gefunden', go_home: 'Zur Startseite',
    construction: 'Bau', properties: 'Immobilien', plots: 'Grundstücke',
    apartments: 'Wohnungen', commercial: 'Gewerblich', residential: 'Wohn',
    buy: 'Kaufen', sell: 'Verkaufen', rent: 'Mieten', lease: 'Pacht',
    stock_market: 'Aktienmarkt', mutual_funds: 'Investmentfonds', options: 'Optionen',
    immunity: 'Immunität', digestion: 'Verdauung', stress: 'Stress', sleep: 'Schlaf',
    hair: 'Haare', skin: 'Haut', heart: 'Herz', brain: 'Gehirn',
    jobs: 'Jobs', apply_now: 'Jetzt bewerben', resume: 'Lebenslauf',
    salary: 'Gehalt', experience: 'Erfahrung', location: 'Standort',
    description: 'Beschreibung', requirements: 'Anforderungen', benefits: 'Vorteile',
    testimonials: 'Referenzen', gallery: 'Galerie', blog: 'Blog',
    privacy_policy: 'Datenschutzrichtlinie', terms: 'AGB',
    follow_us: 'Folgen Sie uns', newsletter: 'Newsletter',
    subscribe: 'Abonnieren', enter_email: 'E-Mail eingeben',
  },
  zh: {
    home: '首页', about: '关于我们', services: '服务', contact: '联系我们',
    finance: '金融', ayurveda: '阿育吠陀', happiness: '幸福', career: '职业',
    search: '搜索', explore: '探索', learn_more: '了解更多', get_started: '开始',
    welcome: '欢迎', our_services: '我们的服务', why_us: '为什么选择我们',
    infrastructure: '基础设施', real_estate: '房地产', trading: '交易',
    investment: '投资', herbs: '草药', consultation: '咨询',
    phone: '电话', email: '邮箱', address: '地址', name: '姓名',
    submit: '提交', send: '发送', call_now: '立即致电',
    free_consultation: '免费咨询', book_now: '立即预约',
    view_all: '查看全部', read_more: '阅读更多', download: '下载',
    loading: '加载中...', error: '错误', success: '成功',
    language: '语言', select_language: '选择语言',
    page_not_found: '页面未找到', go_home: '返回首页',
    construction: '建筑', properties: '房产', plots: '地块',
    apartments: '公寓', commercial: '商业', residential: '住宅',
    buy: '购买', sell: '出售', rent: '租赁', lease: '租约',
    stock_market: '股票市场', mutual_funds: '共同基金', options: '期权',
    immunity: '免疫力', digestion: '消化', stress: '压力', sleep: '睡眠',
    hair: '头发', skin: '皮肤', heart: '心脏', brain: '大脑',
    jobs: '职位', apply_now: '立即申请', resume: '简历',
    salary: '薪资', experience: '经验', location: '地点',
    description: '描述', requirements: '要求', benefits: '福利',
    testimonials: '推荐', gallery: '画廊', blog: '博客',
    privacy_policy: '隐私政策', terms: '条款',
    follow_us: '关注我们', newsletter: '通讯',
    subscribe: '订阅', enter_email: '输入邮箱',
  },
  ar: {
    home: 'الرئيسية', about: 'من نحن', services: 'الخدمات', contact: 'اتصل بنا',
    finance: 'المالية', ayurveda: 'الأيورفيدا', happiness: 'السعادة', career: 'الوظائف',
    search: 'بحث', explore: 'استكشف', learn_more: 'اعرف المزيد', get_started: 'ابدأ',
    welcome: 'مرحباً', our_services: 'خدماتنا', why_us: 'لماذا تختارنا',
    infrastructure: 'البنية التحتية', real_estate: 'العقارات', trading: 'التداول',
    investment: 'الاستثمار', herbs: 'الأعشاب', consultation: 'استشارة',
    phone: 'هاتف', email: 'البريد', address: 'العنوان', name: 'الاسم',
    submit: 'إرسال', send: 'إرسال', call_now: 'اتصل الآن',
    free_consultation: 'استشارة مجانية', book_now: 'احجز الآن',
    view_all: 'عرض الكل', read_more: 'اقرأ المزيد', download: 'تحميل',
    loading: 'جاري التحميل...', error: 'خطأ', success: 'نجاح',
    language: 'اللغة', select_language: 'اختر اللغة',
    page_not_found: 'الصفحة غير موجودة', go_home: 'العودة للرئيسية',
    construction: 'البناء', properties: 'العقارات', plots: 'القطع',
    apartments: 'الشقق', commercial: 'تجاري', residential: 'سكني',
    buy: 'شراء', sell: 'بيع', rent: 'إيجار', lease: 'عقد إيجار',
    stock_market: 'سوق الأسهم', mutual_funds: 'الصناديق المشتركة', options: 'الخيارات',
    immunity: 'المناعة', digestion: 'الهضم', stress: 'التوتر', sleep: 'النوم',
    hair: 'الشعر', skin: 'البشرة', heart: 'القلب', brain: 'الدماغ',
    jobs: 'وظائف', apply_now: 'قدم الآن', resume: 'السيرة الذاتية',
    salary: 'الراتب', experience: 'الخبرة', location: 'الموقع',
    description: 'الوصف', requirements: 'المتطلبات', benefits: 'المزايا',
    testimonials: 'الشهادات', gallery: 'المعرض', blog: 'المدونة',
    privacy_policy: 'سياسة الخصوصية', terms: 'الشروط والأحكام',
    follow_us: 'تابعنا', newsletter: 'النشرة الإخبارية',
    subscribe: 'اشترك', enter_email: 'أدخل البريد',
  },
  ja: {
    home: 'ホーム', about: '会社概要', services: 'サービス', contact: 'お問い合わせ',
    finance: 'ファイナンス', ayurveda: 'アーユルヴェーダ', happiness: '幸福', career: 'キャリア',
    search: '検索', explore: '探索', learn_more: '詳細', get_started: '始める',
    welcome: 'ようこそ', our_services: '私たちのサービス', why_us: '選ぶ理由',
    infrastructure: 'インフラ', real_estate: '不動産', trading: 'トレーディング',
    investment: '投資', herbs: 'ハーブ', consultation: '相談',
    phone: '電話', email: 'メール', address: '住所', name: '名前',
    submit: '送信', send: '送信', call_now: '今すぐ電話',
    free_consultation: '無料相談', book_now: '今すぐ予約',
    view_all: 'すべて見る', read_more: '続きを読む', download: 'ダウンロード',
    loading: '読み込み中...', error: 'エラー', success: '成功',
    language: '言語', select_language: '言語を選択',
    page_not_found: 'ページが見つかりません', go_home: 'ホームへ',
    construction: '建設', properties: '物件', plots: '区画',
    apartments: 'アパート', commercial: '商業', residential: '住宅',
    buy: '購入', sell: '売却', rent: '賃貸', lease: 'リース',
    stock_market: '株式市場', mutual_funds: '投資信託', options: 'オプション',
    immunity: '免疫力', digestion: '消化', stress: 'ストレス', sleep: '睡眠',
    hair: '髪', skin: '肌', heart: '心臓', brain: '脳',
    jobs: '求人', apply_now: '今すぐ応募', resume: '履歴書',
    salary: '給与', experience: '経験', location: '場所',
    description: '説明', requirements: '要件', benefits: '福利厚生',
    testimonials: '推薦', gallery: 'ギャラリー', blog: 'ブログ',
    privacy_policy: 'プライバシーポリシー', terms: '利用規約',
    follow_us: 'フォロー', newsletter: 'ニュースレター',
    subscribe: '購読', enter_email: 'メールを入力',
  },
  ko: {
    home: '홈', about: '회사 소개', services: '서비스', contact: '문의',
    finance: '금융', ayurveda: '아유르베다', happiness: '행복', career: '커리어',
    search: '검색', explore: '탐색', learn_more: '더 알아보기', get_started: '시작하기',
    welcome: '환영합니다', our_services: '우리의 서비스', why_us: '왜 우리를 선택',
    infrastructure: '인프라', real_estate: '부동산', trading: '트레이딩',
    investment: '투자', herbs: '허브', consultation: '상담',
    phone: '전화', email: '이메일', address: '주소', name: '이름',
    submit: '제출', send: '보내기', call_now: '지금 전화',
    free_consultation: '무료 상담', book_now: '지금 예약',
    view_all: '모두 보기', read_more: '더 읽기', download: '다운로드',
    loading: '로딩 중...', error: '오류', success: '성공',
    language: '언어', select_language: '언어 선택',
    page_not_found: '페이지를 찾을 수 없습니다', go_home: '홈으로',
    construction: '건설', properties: '부동산', plots: '부지',
    apartments: '아파트', commercial: '상업', residential: '주거',
    buy: '구매', sell: '판매', rent: '임대', lease: '리스',
    stock_market: '주식 시장', mutual_funds: '뮤추얼 펀드', options: '옵션',
    immunity: '면역력', digestion: '소화', stress: '스트레스', sleep: '수면',
    hair: '머리카락', skin: '피부', heart: '심장', brain: '뇌',
    jobs: '채용', apply_now: '지원하기', resume: '이력서',
    salary: '급여', experience: '경험', location: '위치',
    description: '설명', requirements: '요구사항', benefits: '혜택',
    testimonials: '추천', gallery: '갤러리', blog: '블로그',
    privacy_policy: '개인정보 처리방침', terms: '이용약관',
    follow_us: '팔로우', newsletter: '뉴스레터',
    subscribe: '구독', enter_email: '이메일 입력',
  },
  pt: {
    home: 'Início', about: 'Sobre', services: 'Serviços', contact: 'Contato',
    finance: 'Finanças', ayurveda: 'Ayurveda', happiness: 'Felicidade', career: 'Carreira',
    search: 'Pesquisar', explore: 'Explorar', learn_more: 'Saiba mais', get_started: 'Começar',
    welcome: 'Bem-vindo', our_services: 'Nossos serviços', why_us: 'Por que nos escolher',
    infrastructure: 'Infraestrutura', real_estate: 'Imóveis', trading: 'Trading',
    investment: 'Investimento', herbs: 'Ervas', consultation: 'Consulta',
    phone: 'Telefone', email: 'E-mail', address: 'Endereço', name: 'Nome',
    submit: 'Enviar', send: 'Enviar', call_now: 'Ligar agora',
    free_consultation: 'Consulta grátis', book_now: 'Reservar agora',
    view_all: 'Ver tudo', read_more: 'Ler mais', download: 'Baixar',
    loading: 'Carregando...', error: 'Erro', success: 'Sucesso',
    language: 'Idioma', select_language: 'Selecionar idioma',
    page_not_found: 'Página não encontrada', go_home: 'Ir ao início',
    construction: 'Construção', properties: 'Imóveis', plots: 'Terrenos',
    apartments: 'Apartamentos', commercial: 'Comercial', residential: 'Residencial',
    buy: 'Comprar', sell: 'Vender', rent: 'Alugar', lease: 'Arrendar',
    stock_market: 'Bolsa de valores', mutual_funds: 'Fundos mútuos', options: 'Opções',
    immunity: 'Imunidade', digestion: 'Digestão', stress: 'Estresse', sleep: 'Sono',
    hair: 'Cabelo', skin: 'Pele', heart: 'Coração', brain: 'Cérebro',
    jobs: 'Empregos', apply_now: 'Candidatar-se', resume: 'Currículo',
    salary: 'Salário', experience: 'Experiência', location: 'Local',
    description: 'Descrição', requirements: 'Requisitos', benefits: 'Benefícios',
    testimonials: 'Depoimentos', gallery: 'Galeria', blog: 'Blog',
    privacy_policy: 'Política de privacidade', terms: 'Termos e condições',
    follow_us: 'Siga-nos', newsletter: 'Newsletter',
    subscribe: 'Inscrever-se', enter_email: 'Digite o e-mail',
  },
  ru: {
    home: 'Главная', about: 'О нас', services: 'Услуги', contact: 'Контакты',
    finance: 'Финансы', ayurveda: 'Аюрведа', happiness: 'Счастье', career: 'Карьера',
    search: 'Поиск', explore: 'Исследовать', learn_more: 'Узнать больше', get_started: 'Начать',
    welcome: 'Добро пожаловать', our_services: 'Наши услуги', why_us: 'Почему выбирают нас',
    infrastructure: 'Инфраструктура', real_estate: 'Недвижимость', trading: 'Трейдинг',
    investment: 'Инвестиции', herbs: 'Травы', consultation: 'Консультация',
    phone: 'Телефон', email: 'Почта', address: 'Адрес', name: 'Имя',
    submit: 'Отправить', send: 'Отправить', call_now: 'Позвонить сейчас',
    free_consultation: 'Бесплатная консультация', book_now: 'Забронировать',
    view_all: 'Смотреть все', read_more: 'Читать далее', download: 'Скачать',
    loading: 'Загрузка...', error: 'Ошибка', success: 'Успех',
    language: 'Язык', select_language: 'Выбрать язык',
    page_not_found: 'Страница не найдена', go_home: 'На главную',
    construction: 'Строительство', properties: 'Объекты', plots: 'Участки',
    apartments: 'Квартиры', commercial: 'Коммерция', residential: 'Жильё',
    buy: 'Купить', sell: 'Продать', rent: 'Аренда', lease: 'Лизинг',
    stock_market: 'Фондовый рынок', mutual_funds: 'Паевые фонды', options: 'Опционы',
    immunity: 'Иммунитет', digestion: 'Пищеварение', stress: 'Стресс', sleep: 'Сон',
    hair: 'Волосы', skin: 'Кожа', heart: 'Сердце', brain: 'Мозг',
    jobs: 'Вакансии', apply_now: 'Подать заявку', resume: 'Резюме',
    salary: 'Зарплата', experience: 'Опыт', location: 'Местоположение',
    description: 'Описание', requirements: 'Требования', benefits: 'Преимущества',
    testimonials: 'Отзывы', gallery: 'Галерея', blog: 'Блог',
    privacy_policy: 'Политика конфиденциальности', terms: 'Условия',
    follow_us: 'Подписаться', newsletter: 'Рассылка',
    subscribe: 'Подписаться', enter_email: 'Введите почту',
  },
}

// Hook for using translations
export function useTranslation() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('ig-lang')
    if (saved && translations[saved]) setLang(saved)
  }, [])

  const t = useCallback((key: string): string => {
    if (lang === 'en') return key
    return translations[lang]?.[key] || key
  }, [lang])

  const changeLanguage = useCallback((code: string) => {
    setLang(code)
    localStorage.setItem('ig-lang', code)
    document.documentElement.lang = code
  }, [])

  return { lang, t, changeLanguage, languages }
}

export function FloatingBots() {
  const [showLangBot, setShowLangBot] = useState(false)
  const [selectedLang, setSelectedLang] = useState('en')
  const [showWhatsApp, setShowWhatsApp] = useState(false)

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem('ig-lang')
    if (saved) setSelectedLang(saved)
  }, [])

  const handleLangChange = (code: string) => {
    setSelectedLang(code)
    localStorage.setItem('ig-lang', code)
    document.documentElement.lang = code
    setShowLangBot(false)
  }

  return (
    <>
      {/* Language Bot Button */}
      <button onClick={() => setShowLangBot(!showLangBot)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl flex items-center justify-center hover:scale-110 transition-transform group">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
        <span className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">🌐 Language</span>
      </button>

      {/* Language Bot Panel */}
      {showLangBot && (
        <div className="fixed bottom-24 left-6 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-lg">🌐</span><h4 className="font-bold text-sm">Language / भाषा / 语言</h4></div>
            <button onClick={() => setShowLangBot(false)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20">✕</button>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">
            {languages.map(lang => (
              <button key={lang.code} onClick={() => handleLangChange(lang.code)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${selectedLang === lang.code ? 'bg-indigo-100 text-indigo-700 font-medium border-2 border-indigo-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'}`}>
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
          <div className="px-3 pb-3 pt-1">
            <p className="text-[10px] text-gray-400 text-center">🌍 {languages.length} languages supported • More coming soon</p>
          </div>
        </div>
      )}

      {/* WhatsApp Bot Button */}
      <button onClick={() => setShowWhatsApp(!showWhatsApp)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl flex items-center justify-center hover:scale-110 transition-transform group">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">💬 WhatsApp</span>
      </button>

      {/* WhatsApp Panel */}
      {showWhatsApp && (
        <div className="fixed bottom-24 right-24 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-lg">💬</span><h4 className="font-bold text-sm">WhatsApp Support</h4></div>
              <button onClick={() => setShowWhatsApp(false)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20">✕</button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-600">Get instant support on WhatsApp. Choose a topic:</p>
            {[
              { label: '🏗️ Real Estate Inquiry', msg: "Hi, I'm interested in real estate services" },
              { label: '🌿 Ayurveda Consultation', msg: 'Hi, I want to book an Ayurveda consultation' },
              { label: '💼 Business Partnership', msg: "Hi, I'd like to discuss a business partnership" },
              { label: '📊 Finance & Investment', msg: 'Hi, I need financial advice' },
              { label: '🎓 Career Counselling', msg: 'Hi, I need career guidance' },
              { label: '🤖 AI Tools Help', msg: 'Hi, I need help with AI tools' },
            ].map(item => (
              <a key={item.label} href={`https://wa.me/917972140672?text=${encodeURIComponent(item.msg)}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all border border-green-100">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </a>
            ))}
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Or call us directly</p>
              <a href="tel:+917****0672" className="text-lg font-bold text-emerald-600">+91 79721 40672</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
