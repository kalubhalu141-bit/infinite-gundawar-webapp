'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import { useState, useRef, useCallback, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'

/* ─── Data ─── */

const COUNTRIES = ['India','United States','United Kingdom','UAE','Canada','Australia','Germany','Singapore','Saudi Arabia','Japan','South Korea','China','France','Italy','Spain','Netherlands','Brazil','Mexico','Thailand','Philippines','Indonesia','Malaysia','Pakistan','Bangladesh','Sri Lanka','Nepal','Egypt','Nigeria','Kenya','South Africa','Ghana','Turkey','Israel','Russia','Poland','Sweden','Norway','Denmark','Finland','Switzerland','Belgium','Austria','Portugal','Greece','Czech Republic','Romania','Hungary','Ukraine','Colombia','Argentina','Chile','Peru','Venezuela','Morocco','Tanzania','Ethiopia','New Zealand']

const CITIES: Record<string, string[]> = {
  India: ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Lucknow','Chandigarh','Indore','Bhopal','Nagpur','Kochi','Coimbatore','Visakhapatnam','Surat','Vadodara','Rajkot','Nashik','Patna','Ranchi','Raipur','Guwahati','Bhubaneswar','Dehradun','Shimla','Jammu','Srinagar','Gangtok','Imphal','Shillong','Aizawl','Kohima','Agartala','Itanagar','Panaji','Puducherry','Port Blair'],
  'United States': ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte','San Francisco','Indianapolis','Seattle','Denver','Washington DC','Boston','El Paso','Nashville','Detroit','Oklahoma City','Portland','Las Vegas','Memphis','Louisville','Baltimore','Milwaukee','Albuquerque','Tucson','Fresno','Sacramento','Mesa','Kansas City','Atlanta','Omaha','Colorado Springs','Raleigh','Long Beach','Virginia Beach','Miami','Oakland','Minneapolis','Tampa','Toledo','Arlington','New Orleans'],
  UAE: ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'],
  'United Kingdom': ['London','Manchester','Birmingham','Leeds','Glasgow','Liverpool','Edinburgh','Bristol','Cardiff','Belfast','Sheffield','Nottingham','Newcastle','Leicester','Brighton','Southampton','Oxford','Cambridge','York','Bath'],
  Canada: ['Toronto','Vancouver','Montreal','Calgary','Edmonton','Ottawa','Winnipeg','Quebec City','Hamilton','Victoria','Halifax'],
  Australia: ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Canberra','Hobart','Darwin'],
  Germany: ['Berlin','Munich','Hamburg','Frankfurt','Cologne','Stuttgart','Dusseldorf','Leipzig','Dortmund','Essen'],
  Singapore: ['Singapore'],
  'Saudi Arabia': ['Riyadh','Jeddah','Mecca','Medina','Dammam','Khobar','Tabuk'],
}

// District data for Indian states (keyed by state name)
const DISTRICTS: Record<string, string[]> = {
  Maharashtra: ['Mumbai','Pune','Nagpur','Nashik','Aurangabad','Solapur','Kolhapur','Thane','Raigad','Ratnagiri','Sindhudurg','Satara','Sangli','Ahmednagar','Jalgaon','Dhule','Nandurbar','Jalna','Parbhani','Hingoli','Nanded','Latur','Osmanabad','Beed','Buldhana','Akola','Amravati','Yavatmal','Wardha','Chandrapur','Gadchiroli','Gondia','Bhandara','Washim','Dharni','Pune','Mumbai Suburban','Palghar','Raigad'],
  Delhi: ['Central Delhi','East Delhi','New Delhi','North Delhi','North East Delhi','North West Delhi','Shahdara','South Delhi','South East Delhi','South West Delhi','West Delhi'],
  Karnataka: ['Bangalore Urban','Bangalore Rural','Belgaum','Bellary','Bidar','Bijapur','Chamarajanagar','Chikballapur','Chikkamagaluru','Chitradurga','Dakshina Kannada','Davanagere','Dharwad','Gadag','Gulbarga','Hassan','Haveri','Kodagu','Kolar','Koppal','Mandya','Mysore','Raichur','Ramanagara','Shimoga','Tumkur','Udupi','Uttara Kannada','Vijayapura','Yadgir'],
  'Tamil Nadu': ['Chennai','Coimbatore','Madurai','Salem','Tiruchirappalli','Tirunelveli','Vellore','Erode','Dindigul','Thanjavur','Tuticorin','Kanchipuram','Cuddalore','Dharmapuri','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Sivaganga','Theni','Thoothukudi','Ariyalur','Karur','Nagapattinam','Nilgiris','Tiruppur','Kanyakumari','Villupuram','Virudhunagar','Krishnagiri','Tiruvallur','Tiruvannamalai','Tiruvarur','Ranipet','Chengalpattu','Kallakurichi','Tenkasi','Tirupathur'],
  Gujarat: ['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udaipur','Dahod','Dang','Devbhoomi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kheda','Kutch','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad'],
  Rajasthan: ['Jaipur','Jodhpur','Udaipur','Ajmer','Alwar','Banswara','Baran','Barmer','Bharatpur','Bhilwara','Bikaner','Bundi','Chittorgarh','Churu','Dausa','Dholpur','Dungarpur','Hanumangarh','Jaisalmer','Jalore','Jhalawar','Jhunjhunu','Jodhpur','Karauli','Kota','Nagaur','Pali','Pratapgarh','Rajsamand','Sawai Madhopur','Sikar','Sirohi','Sri Ganganagar','Tonk'],
  'Uttar Pradesh': ['Agra','Aligarh','Allahabad','Ambedkar Nagar','Amethi','Amroha','Auraiya','Azamgarh','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bijnor','Budaun','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah','Etawah','Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad','Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Jaunpur','Jhansi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kushinagar','Lakhimpur Kheri','Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Prayagraj','Rae Bareli','Rampur','Saharanpur','Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shravasti','Siddharthnagar','Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'],
  'West Bengal': ['Kolkata','Howrah','North 24 Parganas','South 24 Parganas','Bardhaman','Hooghly','Nadia','Murshidabad','Birbhum','Bankura','Purulia','Cooch Behar','Darjeeling','Jalpaiguri','Malda','Dinajpur','Medinipur','Alipurduar','Dakshin Dinajpur','Jhargram','Kalimpong','Paschim Bardhaman','Purba Bardhaman'],
  Telangana: ['Hyderabad','Adilabad','Bhadradri Kothagudem','Jagtial','Jangaon','Jayashankar Bhupalpupal','Jogulamba Gadwal','Kamareddy','Karimnagar','Khammam','Kumuram Bheem','Mahabubabad','Mahabubnagar','Mancherial','Medak','Medchal-Malkajgiri','Mulugu','Nagarkurnool','Nalgonda','Narayanpet','Nirmal','Nizamabad','Peddapalli','Rajanna Sircilla','Rangareddy','Sangareddy','Siddipet','Suryapet','Vikarabad','Wanaparthy','Warangal Rural','Warangal Urban','Yadadri Bhuvanagiri'],
  Kerala: ['Thiruvananthapuram','Kollam','Pathanamthitta','Alappuzha','Kottayam','Idukki','Ernakulam','Thrissur','Palakkad','Malappuram','Kozhikode','Wayanad','Kannur','Kasaragod'],
  'Andhra Pradesh': ['Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Kadapa','Rajahmundry','Tirupati','Kakinada','Ongole','Nandyal','Eluru','Anantapur','Chittoor','Srikakulam','East Godavari','West Godavari','Prakasam','Sri Sathya Sai','Annamayya','NTR','Palnadu','Bapatla','Tirupati'],
  Bihar: ['Patna','Gaya','Bhagalpur','Muzaffarpur','Darbhanga','Purnia','Arrah','Begusarai','Katihar','Munger','Chapra','Saharsa','Sasaram','Hajipur','Dehri','Siwan','Motihari','Nawada','Buxar','Kishanganj','Madhubani','Samastipur','Araria','Jehanabad','Jamui','Kaimur','Khagaria','Lakhisarai','Madhepura','Nalanda','Rohtas','Sheikhpura','Sheohar','Sitamarhi','Supaul','Vaishali'],
  'Madhya Pradesh': ['Bhopal','Indore','Gwalior','Jabalpur','Ujjain','Sagar','Rewa','Satna','Ratlam','Dewas','Murwara','Burhanpur','Singrauli','Vidisha','Chhindwara','Damoh','Mandsaur','Khargone','Neemuch','Hoshangabad','Sehore','Raisen','Rajgarh','Shahdol','Anuppur','Sidhi','Satna'],
  Punjab: ['Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Firozpur','Gurdaspur','Hoshiarpur','Kapurthala','Mansa','Moga','Muktsar','Nawanshahr','Pathankot','Rupnagar','Sangrarnagar','Tarn Taran','Faridkot','Fazilka','Barnala','Fatehgarh Sahib','Sri Muktsar Sahib'],
  Haryana: ['Gurugram','Faridabad','Hisar','Rohtak','Panipat','Karnal','Sonipat','Yamunanagar','Panchkula','Ambala','Bhiwani','Fatehabad','Jhajjar','Jind','Kaithal','Kurukshetra','Mahendragarh','Nuh','Palwal','Rewari','Sirsa','Sonipat'],
  Goa: ['North Goa','South Goa'],
  Odisha: ['Bhubaneswar','Cuttack','Rourkela','Berhampur','Sambalpur','Puri','Balasore','Baripada','Bhadrak','Jharsuguda','Sundargarh','Kendujhar','Koraput','Malkangiri','Nabarangpur','Rayagada','Ganjam','Gajapati','Kalahandi','Kandhamal','Nayagarh','Khordha','Jagatsinghpur','Dhenkanal','Angul','Baudh','Subarnapur','Balangir','Nuapada','Jajpur','Kendrapara'],
  Jharkhand: ['Ranchi','Jamshedpur','Dhanbad','Bokaro','Hazaribagh','Giridih','Ramgarh','Dumka','Deoghar','Daltonganj','Chaibasa','Lohardaga','Pakur','Sahebganj','Godda','Chatra','Koderma','Garhwa','Simdega','Latehar','Gumla','Khunti','Palamu','Saraikela Kharsawan','East Singhbhum','West Singhbhum'],
  Chhattisgarh: ['Raipur','Bhilai','Bilaspur','Korba','Rajnandgaon','Raigarh','Jagdalpur','Ambikapur','Dhamtari','Mahasamund','Kanker','Kondagaon','Kabirdham','Sukma','Balod','Baloda Bazar','Bastar','Bijapur','Dantewada','Gariaband','Gaurela-Pendra-Marwahi','Janjgir-Champa','Korba','Koriya','Narayanpur','Raigarh','Rajnandgaun','Sukma','Surajpur','Durg'],
  Uttarakhand: ['Dehradun','Haridwar','Roorkee','Haldwani','Rudrapur','Kashipur','Rishikesh','Nainital','Almora','Pithoragarh','Tehri Garhwal','Uttarkashi','Chamoli','Champawat','Pauri Garhwal','Bageshwar'],
  'Himachal Pradesh': ['Shimla','Dharamshala','Mandi','Solan','Kullu','Hamirpur','Una','Bilaspur','Kangra','Kinnaur','Lahaul and Spiti','Sirmaur','Chamba'],
  Assam: ['Guwahati','Silchar','Dibrugarh','Jorhat','Tinsukia','Nagaon','Tezpur','Bongaigaon','Karimganj','Sivasagar','Goalpara','Barpeta','Dhubri','Dhemaji','Hailakandi','Lakhimpur','Morigaon','Nalbari','Sonitpur','Cachar','Chirang','Kamrup','Kamrup Metropolitan','Kokrajhar','Baksa','Udalguri','Dima Hasao','Biswanath','Charaideo','Hojai','Majuli','South Salmara-Mankachar','West Karbi Anglong'],
  Jammu: ['Jammu','Kathua','Udhampur','Reasi','Doda','Kishtwar','Poonch','Rajouri','Ramban','Samba','Chamba'],
  Sikkim: ['Gangtok','Gyalshing','Mangan','Namchi','Soreng','Pakyong','Rangpo'],
}

// States list for India (for district dropdown)
const INDIA_STATES = Object.keys(DISTRICTS)

const TABS = [
  { id: 'property', label: '🏠 Property' },
  { id: 'cars', label: '🚗 Cars' },
  { id: 'bikes', label: '🏍️ Bikes' },
  { id: 'land', label: '🌾 Land' },
]

interface ScrapedResult {
  id: string
  title: string
  description: string
  price: string
  phones: string
  emails: string
  website: string
  city: string
  district: string
  state: string
  country: string
  sourceUrl: string
  source: string
  scrapedDate: string
}

/* ─── Live Properties For Sale feed (API-backed) ─── */
function LiveProperties() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [cities, setCities] = useState<string[]>([])
  const [city, setCity] = useState('')
  const [onlyNew, setOnlyNew] = useState(false)
  useEffect(() => {
    fetch('/api/properties?limit=36').then(r => r.json()).then(d => { if (d.ok) { setData(d.results); setTotal(d.total); setCities(d.cities) } }).catch(() => {})
  }, [])
  useEffect(() => {
    fetch(`/api/properties?${city ? `city=${encodeURIComponent(city)}&` : ''}${onlyNew ? 'new=1&' : ''}limit=36`).then(r => r.json()).then(d => { if (d.ok) setData(d.results) }).catch(() => {})
  }, [city, onlyNew])
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0f172a] mb-2 text-center">🏠 Live Properties For Sale</h2>
        <p className="text-gray-500 text-center text-sm mb-8">{total} listings · new ones added daily · free to browse</p>
        <div className="flex flex-col md:flex-row gap-3 mb-6 justify-center">
          <select value={city} onChange={e => setCity(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm">
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => setOnlyNew(v => !v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${onlyNew ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>New Today</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] p-4 text-white">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm">{p.type}</h3>
                  {p.listedToday && <span className="text-xs bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full">NEW</span>}
                </div>
                <p className="text-xs text-white/70">{p.city} · {p.areaSqft} sqft · {p.bedrooms} BHK</p>
              </div>
              <div className="p-4">
                <p className="text-xl font-bold text-[#1e3a5f]">{p.priceLabel}</p>
                <p className="text-xs text-gray-500 mt-1">{p.verified ? '✅ Verified' : 'Unverified'} · listed {p.posted}</p>
                <a href="https://wa.me/917972140672?text=Interested%20in%20property" className="block text-center mt-3 py-2 bg-[#1e3a5f] text-white rounded-xl text-xs font-semibold">Enquire</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function PropertyFinderPage() {
  const [activeTab, setActiveTab] = useState('property')
  const [state, setState] = useState('India')
  const [country, setCountry] = useState('India')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [indiaState, setIndiaState] = useState('')
  const [results, setResults] = useState<ScrapedResult[]>([])
  const [searched, setSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [progress, setProgress] = useState({ percent: 0, found: 0, queriesProcessed: 0, totalQueries: 0 })
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const availableCities = CITIES[country] || []

  // When country changes, reset city, district, indiaState
  const handleCountryChange = (c: string) => {
    setCountry(c)
    setCity('')
    setDistrict('')
    setIndiaState('')
  }

  // When india state changes, reset district
  const handleIndiaStateChange = (s: string) => {
    setIndiaState(s)
    setDistrict('')
  }

  // Districts for selected Indian state
  const availableDistricts = indiaState ? (DISTRICTS[indiaState] || []) : []

  /* ─── Real Scraping ─── */
  const handleSearch = useCallback(async () => {
    setIsSearching(true)
    setError('')
    setResults([])
    setStats(null)
    setSearched(true)

    const controller = new AbortController()
    abortRef.current = controller

    // Build query
    const locationParts = [district, city, country].filter(Boolean).join(' ')
    let query = ''
    if (activeTab === 'property') {
      query = `property for sale in ${locationParts} site:99acres.com OR site:magicbricks.com OR site:housing.com`
    } else if (activeTab === 'land') {
      query = `land for sale in ${locationParts} site:99acres.com OR site:magicbricks.com OR site:olx.in`
    } else if (activeTab === 'cars') {
      query = `used cars for sale in ${locationParts} site:cardekho.com OR site:spinny.com OR site:cars24.com OR site:olx.in`
    } else if (activeTab === 'bikes') {
      query = `used bikes for sale in ${locationParts} site:bikewale.com OR site:droom.in OR site:olx.in bikes`
    }

    try {
      // Build multiple queries for better coverage
      const loc = locationParts || 'India'
      let queries: string[] = []
      if (activeTab === 'property') {
        queries = [
          `property for sale in ${loc}`,
          `houses apartments for sale in ${loc}`,
          `flats for sale in ${loc}`,
          `site:99acres.com property ${loc}`,
          `site:magicbricks.com ${loc}`,
          `site:housing.com ${loc}`,
          `site:nobroker.in ${loc}`,
          `site:olx.in property ${loc}`,
          `real estate agents in ${loc}`,
          `new projects in ${loc} real estate`,
          `residential property ${loc}`,
          `commercial property for sale ${loc}`,
        ]
      } else if (activeTab === 'land') {
        queries = [
          `agricultural land for sale in ${loc}`,
          `plot for sale in ${loc}`,
          `farm land for sale in ${loc}`,
          `site:99acres.com land ${loc}`,
          `site:magicbricks.com plot ${loc}`,
          `site:landwatch.com ${loc}`,
          `site:olx.in plot ${loc}`,
          `commercial plot for sale ${loc}`,
          `residential plot ${loc}`,
          `land dealers ${loc}`,
        ]
      } else if (activeTab === 'cars') {
        queries = [
          `used cars for sale in ${loc}`,
          `second hand cars in ${loc}`,
          `site:cardekho.com ${loc}`,
          `site:spinny.com ${loc}`,
          `site:cars24.com ${loc}`,
          `site:olx.in cars ${loc}`,
          `site:carwale.com ${loc}`,
          `site:zigwheels.com ${loc}`,
          `used car dealers ${loc}`,
          `certified pre-owned cars ${loc}`,
          `budget cars for sale ${loc}`,
          `luxury used cars ${loc}`,
        ]
      } else if (activeTab === 'bikes') {
        queries = [
          `used bikes for sale in ${loc}`,
          `second hand bikes in ${loc}`,
          `site:bikewale.com ${loc}`,
          `site:droom.in bikes ${loc}`,
          `site:olx.in bikes ${loc}`,
          `motorcycle for sale ${loc}`,
          `royal enfield for sale ${loc}`,
          `ktm duke for sale ${loc}`,
          `scooter for sale ${loc}`,
          `bike dealers ${loc}`,
        ]
      }

      const STREAM_API = '/api/marketplace-scrape'

      const res = await fetch(STREAM_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab: activeTab,
          country: country || undefined,
          city: city || undefined,
          district: district || undefined,
          maxResults: 100,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || `HTTP ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const data = JSON.parse(line)
            if (data.type === 'status') {
              if (data.totalQueries) setProgress(p => ({ ...p, totalQueries: data.totalQueries }))
            } else if (data.type === 'progress') {
              setProgress({
                percent: data.percentComplete,
                found: data.found,
                queriesProcessed: data.queriesProcessed,
                totalQueries: data.totalQueries,
              })
              const latest = data.latestResults || []
              if (latest.length) {
                setResults(prev => {
                  const existing = new Set(prev.map(r => r.sourceUrl))
                  const filtered = latest.filter((r: ScrapedResult) => !existing.has(r.sourceUrl))
                  return [...prev, ...filtered]
                })
              }
            } else if (data.type === 'complete') {
              setStats(data.stats)
              if (data.allResults?.length) setResults(data.allResults)
              setProgress(p => ({ ...p, percent: 100, found: data.stats?.total || 0 }))
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setError(err?.message || 'Search failed')
        // Fallback: try direct search
        try {
          const loc = locationParts || 'India'
          const searchQuery = activeTab === 'property' ? `property for sale ${loc}` : activeTab === 'land' ? `land for sale ${loc}` : activeTab === 'cars' ? `used cars for sale ${loc}` : `used bikes for sale ${loc}`
          const res = await fetch(`/api/scrape?q=${encodeURIComponent(searchQuery)}&limit=20&location=${encodeURIComponent(loc)}`)
          if (res.ok) {
            const d = await res.json()
            if (d.results?.length) setResults(d.results)
          }
        } catch { /* ignore fallback error */ }
      }
    } finally {
      setIsSearching(false)
      abortRef.current = null
    }
  }, [activeTab, country, city, district])

  const handleStop = () => {
    abortRef.current?.abort()
    setIsSearching(false)
  }

  /* ─── Export ─── */
  const exportCSV = () => {
    if (!results.length) return
    const headers = ['Title','Description','Price','Phone','Email','Website','City','District','State','Country','Source','Source URL','Scraped Date']
    const escape = (v: any) => `"${String(v || '').replace(/"/g, '""')}"`
    const rows = results.map(r => [
      r.title, r.description, r.price, r.phones, r.emails, r.website,
      r.city, r.district, r.state, r.country, r.source, r.sourceUrl, r.scrapedDate
    ].map(escape).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `property-finder-${activeTab}-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    if (!results.length) return
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `property-finder-${activeTab}-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <PageEnhancements />

      {/* Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2c5282]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#d4a843] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2c5282] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[#d4a843] text-sm font-medium mb-3">
              🌍 Global Property & Vehicle Search
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Find Properties, Cars, Bikes & Land</h1>
            <p className="text-white/60 text-sm">Search across 50+ countries • 60+ sources • Real-time scraping</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearched(false) }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-[#1e3a5f] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Country */}
              <select value={country} onChange={e => handleCountryChange(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white">
                <option value="">All Countries</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* City */}
              <select value={city} onChange={e => setCity(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white">
                <option value="">All Cities</option>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* India State (only for India) */}
              {country === 'India' && (
                <select value={indiaState} onChange={e => handleIndiaStateChange(e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white">
                  <option value="">All States</option>
                  {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}

              {/* District (only when India state selected) */}
              {country === 'India' && indiaState && (
                <select value={district} onChange={e => setDistrict(e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white">
                  <option value="">All Districts</option>
                  {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              )}

              {/* Search Button */}
              <button onClick={handleSearch} disabled={isSearching}
                className="px-6 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {isSearching ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Searching...</>
                ) : '🔍 Search'}
              </button>
            </div>

            {isSearching && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <span>Query {progress.queriesProcessed}/{progress.totalQueries || '?'} • {progress.found} found</span>
                  <span>{progress.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#d4a843] rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }} />
                </div>
                <button onClick={handleStop} className="mt-2 px-4 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">⛔ Stop</button>
              </div>
            )}

            {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xl font-bold text-[#1e3a5f]">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xl font-bold text-emerald-600">{stats.withPrice}</div>
              <div className="text-xs text-gray-500">With Price</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xl font-bold text-green-600">{stats.withPhone}</div>
              <div className="text-xs text-gray-500">With Phone</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xl font-bold text-blue-600">{stats.withEmail}</div>
              <div className="text-xs text-gray-500">With Email</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xl font-bold text-purple-600">{stats.sources?.length || 0}</div>
              <div className="text-xs text-gray-500">Sources</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xl font-bold text-orange-600">{stats.cities?.length || 0}</div>
              <div className="text-xs text-gray-500">Cities</div>
            </div>
          </div>
        )}

        {/* Results */}
        {searched && results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1e3a5f]">📋 Results ({results.length})</h2>
              <div className="flex gap-2">
                <button onClick={exportCSV} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">📥 CSV</button>
                <button onClick={exportJSON} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">📥 JSON</button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#1e3a5f] text-sm line-clamp-2">{r.title}</h3>
                    </div>
                    {r.price && <p className="text-lg font-bold text-emerald-600 mb-1">{r.price}</p>}
                    {r.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{r.description}</p>}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {[r.city, r.district, r.state, r.country].filter(Boolean).map((loc, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">📍 {loc}</span>
                      ))}
                    </div>
                    {r.phones && <p className="text-xs text-gray-600 mb-1">📞 {r.phones}</p>}
                    {r.emails && <p className="text-xs text-gray-600 mb-1 truncate">📧 {r.emails}</p>}
                    {r.website && <p className="text-xs text-blue-500 mb-2 truncate">🌐 {r.website}</p>}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{r.source}</span>
                      <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2c5282]">View →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {searched && !isSearching && results.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">No Results Found</h3>
            <p className="text-gray-500 max-w-lg mx-auto">Try broadening your search or selecting a different location.</p>
          </div>
        )}

        {/* Initial state */}
        {!searched && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Search Properties, Cars, Bikes & Land</h3>
            <p className="text-gray-500 max-w-lg mx-auto">
              Select a category, choose country, city, and optionally state & district (India), then click Search.
              Results are scraped in real-time from 60+ sources.
            </p>
          </div>
        )}

        {/* Source info */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-[#1e3a5f] mb-3">🏘️ Property Sources</h3>
            <div className="flex flex-wrap gap-2">
              {['99acres.com','MagicBricks.com','Housing.com','NoBroker.in','Makaan.com','CommonFloor.com','PropertyWala.com','Zillow.com','Realtor.com','Rightmove.co.uk','Bayut.com','OLX.in'].map(s => (
                <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-[#1e3a5f] mb-3">🚗 Vehicle Sources</h3>
            <div className="flex flex-wrap gap-2">
              {['CarDekho.com','Spinny.com','Cars24.com','CarWale.com','ZigWheels.com','Droom.in','AutoTrader.com','Cars.com','BikeWale.com','OLX.in'].map(s => (
                <span key={s} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Live Properties For Sale ─── */}
      <LiveProperties />
      <Footer />
    </div>
    <GoalModeFeatures page="property-finder" />
  </>
)
}
