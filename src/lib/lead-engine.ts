// AI Lead Generation Engine
// Autonomous system that generates leads daily using all scraping tools
// and delivers them in Excel format

export interface LeadRecord {
  // Contact Info
  name: string
  email: string
  phone: string
  whatsapp: string
  website: string

  // Company Info
  company: string
  industry: string
  category: string
  city: string
  state: string
  country: string
  address: string
  pincode: string

  // Social Media
  linkedin: string
  facebook: string
  instagram: string
  twitter: string

  // Business Info
  businessType: string
  employeeCount: string
  annualRevenue: string
  yearEstablished: string
  services: string[]

  // Lead Scoring
  leadScore: number // 0-100
  leadQuality: 'hot' | 'warm' | 'cold'
  leadSource: string
  leadCategory: string

  // Ayurveda Specific
  specialty: string
  ayurvedaServices: string[]
  bamsDegree: boolean
  panchakarmaAvailable: boolean
  hasWebsite: boolean
  googleRating: number
  reviewCount: number

  // Metadata
  scrapedDate: string
  verified: boolean
  notes: string
}

// ─── Lead Generation Strategies ───
export const LEAD_STRATEGIES = [
  {
    id: 'ayurveda-doctors-india',
    name: 'Ayurveda Doctors in India',
    description: 'Find BAMS doctors, Ayurveda clinics, and Panchakarma centers across India',
    category: 'ayurveda',
    queries: [
      'BAMS doctor in {city} phone number',
      'Ayurvedic clinic in {city} contact',
      'Panchakarma center in {city} phone',
      'Ayurveda hospital in {city} address',
      'BAMS practitioner in {city} mobile',
    ],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtula', 'Davanagere', 'Kozhikode', 'Kurnool'],
    enabled: true,
    priority: 1,
    targetPerCity: 50,
  },
  {
    id: 'ayurveda-doctors-global',
    name: 'Ayurveda Doctors Worldwide',
    description: 'Find Ayurveda practitioners, clinics, and training centers globally',
    category: 'ayurveda',
    queries: [
      'Ayurveda doctor in {country} phone number',
      'Ayurvedic practitioner in {country} contact',
      'Ayurveda clinic in {country} address',
      'BAMS doctor in {country} mobile',
      'Ayurveda treatment center in {country}',
    ],
    countries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'UAE', 'Singapore', 'Malaysia', 'South Africa', 'Kenya', 'Nepal', 'Sri Lanka', 'Bangladesh', 'Mauritius', 'Fiji', 'Trinidad', 'Guyana', 'Suriname', 'South Korea', 'Japan', 'Thailand', 'Indonesia', 'Philippines', 'Brazil', 'Argentina', 'Mexico'],
    enabled: true,
    priority: 2,
    targetPerCountry: 100,
  },
  {
    id: 'ayurveda-product-manufacturers',
    name: 'Ayurveda Product Manufacturers',
    description: 'Find Ayurvedic medicine, herbal product, and supplement manufacturers',
    category: 'ayurveda-business',
    queries: [
      'Ayurvedic medicine manufacturer in {city} phone',
      'Herbal product manufacturer in {city} contact',
      'Ayurveda pharmaceutical company in {city}',
      'Ayurvedic supplement manufacturer in {city}',
      'Herbal medicine factory in {city} address',
    ],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Indore', 'Bhopal', 'Patna', 'Vadodara', 'Guwahati', 'Coimbatore', 'Kochi', 'Mysore', 'Tiruchirappalli', 'Jalandhar', 'Bhubaneswar', 'Dehradun', 'Haridwar', 'Rishikesh', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Belgaum'],
    enabled: true,
    priority: 3,
    targetPerCity: 30,
  },
  {
    id: 'ayurveda-spa-wellness',
    name: 'Ayurveda Spa & Wellness Centers',
    description: 'Find Ayurvedic spas, wellness centers, and retreats',
    category: 'ayurveda-wellness',
    queries: [
      'Ayurveda spa in {city} phone number',
      'Ayurvedic wellness center in {city} contact',
      'Panchakarma spa in {city} address',
      'Ayurveda retreat in {city} mobile',
      'Ayurvedic massage center in {city}',
    ],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Goa', 'Kerala', 'Udaipur', 'Rishikesh', 'Haridwar', 'Ooty', 'Kodaikanal', 'Coorg', 'Munnar', 'Alleppey', 'Kovalam', 'Varkala', 'Gokarna', 'Hampi', 'Mysore', 'Chikmagalur', 'Wayanad', 'Thekkady', 'Kumarakom', 'Poovar', 'Marari', 'Fort Kochi', 'Thrissur', 'Kozhikode', 'Kannur', 'Kasaragod', 'Malappuram', 'Palakkad', 'Ernakulam', 'Idukki', 'Kottayam', 'Pathanamthitta', 'Alappuzha', 'Thiruvananthapuram'],
    enabled: true,
    priority: 4,
    targetPerCity: 40,
  },
  {
    id: 'ayurveda-training-institutes',
    name: 'Ayurveda Training Institutes',
    description: 'Find BAMS colleges, Ayurveda training centers, and certification programs',
    category: 'ayurveda-education',
    queries: [
      'BAMS college in {city} phone number',
      'Ayurveda training institute in {city} contact',
      'Ayurvedic certification course in {city}',
      'Ayurveda school in {city} address',
      'Panchakarma training center in {city}',
    ],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Bhopal', 'Patna', 'Guwahati', 'Coimbatore', 'Kochi', 'Mysore', 'Tiruchirappalli', 'Jalandhar', 'Bhubaneswar', 'Dehradun', 'Haridwar', 'Rishikesh', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Belgaum', 'Hubli', 'Dharwad', 'Mangalore', 'Manipal', 'Udupi', 'Shimoga', 'Hassan', 'Tumkur', 'Bellary', 'Raichur', 'Bidar', 'Gulbarga', 'Bijapur', 'Bagalkot', 'Gadag', 'Haveri', 'Davangere', 'Chitradurga', 'Shimoga', 'Kodagu', 'Chikmagalur', 'Dakshina Kannada', 'Uttara Kannada', 'Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur', 'Ernakulam', 'Idukki', 'Kottayam', 'Pathanamthitta', 'Alappuzha', 'Thiruvananthapuram'],
    enabled: true,
    priority: 5,
    targetPerCity: 20,
  },
  {
    id: 'ayurveda-herb-suppliers',
    name: 'Ayurveda Herb & Raw Material Suppliers',
    description: 'Find Ayurvedic herb suppliers, raw material dealers, and exporters',
    category: 'ayurveda-supply',
    queries: [
      'Ayurvedic herb supplier in {city} phone',
      'Ayurveda raw material dealer in {city} contact',
      'Herbal extract supplier in {city} address',
      'Ayurvedic ingredient exporter in {city}',
      'Medicinal plant supplier in {city}',
    ],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Indore', 'Bhopal', 'Patna', 'Guwahati', 'Coimbatore', 'Kochi', 'Mysore', 'Tiruchirappalli', 'Jalandhar', 'Bhubaneswar', 'Dehradun', 'Haridwar', 'Rishikesh', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Belgaum', 'Hubli', 'Dharwad', 'Mangalore', 'Manipal', 'Udupi', 'Shimoga', 'Hassan', 'Tumkur', 'Bellary', 'Raichur', 'Bidar', 'Gulbarga', 'Bijapur', 'Bagalkot', 'Gadag', 'Haveri', 'Davangere', 'Chitradurga', 'Shimoga', 'Kodagu', 'Chikmagalur', 'Dakshina Kannada', 'Uttara Kannada', 'Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur', 'Ernakulam', 'Idukki', 'Kottayam', 'Pathanamthitta', 'Alappuzha', 'Thiruvananthapuram'],
    enabled: true,
    priority: 6,
    targetPerCity: 25,
  },
  {
    id: 'ayurveda-product-distributors',
    name: 'Ayurveda Product Distributors & Dealers',
    description: 'Find Ayurvedic product distributors, dealers, and franchise opportunities',
    category: 'ayurveda-distribution',
    queries: [
      'Ayurvedic product distributor in {city} phone',
      'Ayurveda medicine dealer in {city} contact',
      'Herbal product franchise in {city} address',
      'Ayurvedic product wholesale in {city}',
      'Patanjali distributor in {city}',
      'Dabur distributor in {city}',
      'Himalaya distributor in {city]',
    ],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Indore', 'Bhopal', 'Patna', 'Guwahati', 'Coimbatore', 'Kochi', 'Mysore', 'Tiruchirappalli', 'Jalandhar', 'Bhubaneswar', 'Dehradun', 'Haridwar', 'Rishikesh', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Belgaum', 'Hubli', 'Dharwad', 'Mangalore', 'Manipal', 'Udupi', 'Shimoga', 'Hassan', 'Tumkur', 'Bellary', 'Raichur', 'Bidar', 'Gulbarga', 'Bijapur', 'Bagalkot', 'Gadag', 'Haveri', 'Davangere', 'Chitradurga', 'Shimoga', 'Kodagu', 'Chikmagalur', 'Dakshina Kannada', 'Uttara Kannada', 'Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur', 'Ernakulam', 'Idukki', 'Kottayam', 'Pathanamthitta', 'Alappuzha', 'Thiruvananthapuram'],
    enabled: true,
    priority: 7,
    targetPerCity: 35,
  },
  {
    id: 'ayurveda-tourism',
    name: 'Ayurveda Tourism & Resorts',
    description: 'Find Ayurveda tourism packages, health resorts, and treatment vacations',
    category: 'ayurveda-tourism',
    queries: [
      'Ayurveda tourism in {city} phone number',
      'Ayurvedic health resort in {city} contact',
      'Ayurveda treatment vacation in {city} address',
      'Panchakarma tourism package in {city}',
      'Ayurveda wellness tourism in {city}',
    ],
    cities: ['Kerala', 'Goa', 'Udaipur', 'Rishikesh', 'Haridwar', 'Ooty', 'Kodaikanal', 'Coorg', 'Munnar', 'Alleppey', 'Kovalam', 'Varkala', 'Gokarna', 'Hampi', 'Mysore', 'Chikmagalur', 'Wayanad', 'Thekkady', 'Kumarakom', 'Poovar', 'Marari', 'Fort Kochi', 'Thrissur', 'Kozhikode', 'Kannur', 'Kasaragod', 'Malappuram', 'Palakkad', 'Ernakulam', 'Idukki', 'Kottayam', 'Pathanamthitta', 'Alappuzha', 'Thiruvananthapuram'],
    enabled: true,
    priority: 8,
    targetPerCity: 30,
  },
  {
    id: 'ayurveda-ecommerce',
    name: 'Ayurveda E-commerce & Online Stores',
    description: 'Find Ayurvedic product e-commerce stores, online retailers, and D2C brands',
    category: 'ayurveda-ecommerce',
    queries: [
      'Ayurvedic products online store {city} phone',
      'Ayurveda e-commerce website {city} contact',
      'Herbal products online {city} address',
      'Ayurvedic D2C brand {city}',
      'Ayurveda online retailer {city}',
    ],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Indore', 'Bhopal', 'Patna', 'Guwahati', 'Coimbatore', 'Kochi', 'Mysore', 'Tiruchirappalli', 'Jalandhar', 'Bhubaneswar', 'Dehradun', 'Haridwar', 'Rishikesh', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Belgaum', 'Hubli', 'Dharwad', 'Mangalore', 'Manipal', 'Udupi', 'Shimoga', 'Hassan', 'Tumkur', 'Bellary', 'Raichur', 'Bidar', 'Gulbarga', 'Bijapur', 'Bagalkot', 'Gadag', 'Haveri', 'Davangere', 'Chitradurga', 'Shimoga', 'Kodagu', 'Chikmagalur', 'Dakshina Kannada', 'Uttara Kannada', 'Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur', 'Ernakulam', 'Idukki', 'Kottayam', 'Pathanamthitta', 'Alappuzha', 'Thiruvananthapuram'],
    enabled: true,
    priority: 9,
    targetPerCity: 20,
  },
  {
    id: 'ayurveda-research',
    name: 'Ayurveda Research Institutes & Labs',
    description: 'Find Ayurvedic research institutes, testing labs, and clinical trial centers',
    category: 'ayurveda-research',
    queries: [
      'Ayurveda research institute in {city} phone',
      'Ayurvedic testing lab in {city} contact',
      'Ayurveda clinical trial center in {city}',
      'Ayurvedic research lab in {city} address',
      'CCRAS center in {city}',
    ],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Bhopal', 'Patna', 'Guwahati', 'Coimbatore', 'Kochi', 'Mysore', 'Tiruchirappalli', 'Jalandhar', 'Bhubaneswar', 'Dehradun', 'Haridwar', 'Rishikesh', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Belgaum', 'Hubli', 'Dharwad', 'Mangalore', 'Manipal', 'Udupi', 'Shimoga', 'Hassan', 'Tumkur', 'Bellary', 'Raichur', 'Bidar', 'Gulbarga', 'Bijapur', 'Bagalkot', 'Gadag', 'Haveri', 'Davangere', 'Chitradurga', 'Shimoga', 'Kodagu', 'Chikmagalur', 'Dakshina Kannada', 'Uttara Kannada', 'Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur', 'Ernakulam', 'Idukki', 'Kottayam', 'Pathanamthitta', 'Alappuzha', 'Thiruvananthapuram'],
    enabled: true,
    priority: 10,
    targetPerCity: 15,
  },
]

// ─── AI Lead Scoring Algorithm ───
export function scoreLead(lead: Partial<LeadRecord>): { score: number; quality: 'hot' | 'warm' | 'cold' } {
  let score = 0

  // Phone number (30 points)
  if (lead.phone && lead.phone.length >= 10) score += 30
  else if (lead.phone) score += 15

  // Email (20 points)
  if (lead.email && lead.email.includes('@')) score += 20

  // WhatsApp (10 points)
  if (lead.whatsapp) score += 10

  // Website (10 points)
  if (lead.website) score += 10

  // Address (10 points)
  if (lead.address) score += 10

  // Social media (5 points each)
  if (lead.linkedin) score += 5
  if (lead.facebook) score += 5
  if (lead.instagram) score += 5

  // Company info (5 points)
  if (lead.company) score += 5

  // Ayurveda specific
  if (lead.bamsDegree) score += 10
  if (lead.panchakarmaAvailable) score += 10
  if (lead.googleRating && lead.googleRating >= 4) score += 10
  if (lead.reviewCount && lead.reviewCount >= 50) score += 5

  // Cap at 100
  score = Math.min(score, 100)

  const quality = score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold'
  return { score, quality }
}

// ─── Get active strategies ───
export function getActiveStrategies() {
  return LEAD_STRATEGIES.filter(s => s.enabled).sort((a, b) => a.priority - b.priority)
}

// ─── Get strategies by category ───
export function getStrategiesByCategory(category: string) {
  return LEAD_STRATEGIES.filter(s => s.category === category && s.enabled)
}

// ─── Calculate total daily lead target ───
export function getDailyLeadTarget(): number {
  let total = 0
  for (const strategy of LEAD_STRATEGIES.filter(s => s.enabled)) {
    if ('cities' in strategy && strategy.cities) {
      total += strategy.cities.length * (strategy.targetPerCity || 10)
    }
    if ('countries' in strategy && strategy.countries) {
      total += strategy.countries.length * (strategy.targetPerCountry || 10)
    }
  }
  return total
}
