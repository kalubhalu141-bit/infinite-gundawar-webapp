// Cinematic AI-Style Images for Each Page
// All images are content-relevant to their respective pages

export interface PageImage {
  hero: string
  sections: string[]
}

export const CINEMATIC_IMAGES: Record<string, PageImage> = {
  // Homepage - Business/Corporate
  home: {
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=800&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop', // modern office
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop', // business meeting
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', // data analytics
    ],
  },

  // AI Tools - AI/Digital
  'ai-tools': {
    hero: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop', // AI robot
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop', // technology
    ],
  },

  // Career - Professional/Business
  career: {
    hero: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop', // working
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', // teamwork
    ],
  },

  // Finance - Wealth/Trading/Money
  finance: {
    hero: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop', // stock chart
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop', // wealth
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop', // gold/coins
    ],
  },

  // Happiness - Nature/Peace/Wellness
  happiness: {
    hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=700&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop', // yoga nature
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop', // beach serenity
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop', // forest peace
    ],
  },

  // Ayurveda - Wellness/Nature/Herbs
  ayurveda: {
    hero: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=400&fit=crop', // spa wellness
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=400&fit=crop', // herbs
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop', // meditation
    ],
  },

  // Data Scraper - Data/Technology/Network
  'data-scraper': {
    hero: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', // data dashboard
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop', // network/server
    ],
  },

  // Email Sender - Communication/Email
  'email-sender': {
    hero: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop', // email inbox
      'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&h=400&fit=crop', // communication
    ],
  },

  // Lead Dashboard - Business/Analytics
  'lead-dashboard': {
    hero: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', // analytics
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop', // business
    ],
  },

  // Phone Scraper - Mobile/Communication
  'phone-scraper': {
    hero: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop', // mobile app
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&h=400&fit=crop', // contact
    ],
  },

  // Interior Design - Architecture/Design
  'interior-design': {
    hero: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=400&fit=crop', // modern interior
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=400&fit=crop', // luxury room
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=400&fit=crop', // minimal interior
    ],
  },

  // Property Finder - Real Estate/Property
  'property-finder': {
    hero: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=600&fit=crop',
    sections: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=400&fit=crop', // luxury home
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=400&fit=crop', // modern house
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=400&fit=crop', // apartment
    ],
  },
}
