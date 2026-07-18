import { NextRequest, NextResponse } from 'next/server'

// ─── Marketing Content Generator Engine ────────────────────────

interface MarketingInput {
  productName: string
  productDescription: string
  category: string
  targetAudience: string
  platforms: string[]
  tone: string
  usp: string
  priceRange: string
  location: string
  callToAction: string
}

interface PlatformContent {
  platform: string
  caption: string
  hashtags: string[]
  postType: string
  bestTime: string
  tips: string[]
}

interface MarketingOutput {
  productName: string
  category: string
  tagline: string
  elevator_pitch: string
  platforms: PlatformContent[]
  content_calendar: string[]
  ad_copy: { headline: string; primary_text: string; description: string }[]
  email_subject_lines: string[]
  bio_suggestion: string
  keywords: string[]
}

// ─── Template Engine ───────────────────────────────────────────

const CATEGORY_TEMPLATES: Record<string, { taglines: string[]; hooks: string[]; benefits: string[]; emotions: string[] }> = {
  'food': {
    taglines: [
      'Taste the Difference',
      'Made with Love, Served with Pride',
      'Flavours You\'ll Remember',
      'Fresh. Authentic. Delicious.',
      'A Bite of Happiness',
    ],
    hooks: [
      'Craving something delicious?',
      'Your taste buds deserve better.',
      'Forget boring meals.',
      'The secret ingredient? Always love.',
    ],
    benefits: ['Fresh ingredients', 'Authentic recipes', 'Fast delivery', 'Family-friendly', 'Healthy options'],
    emotions: ['comfort', 'joy', 'nostalgia', 'excitement', 'trust'],
  },
  'fashion': {
    taglines: [
      'Wear Your Confidence',
      'Style That Speaks',
      'Elegance Redefined',
      'Fashion Forward, Always',
      'Dress Different',
    ],
    hooks: [
      'Your wardrobe is calling.',
      'Style upgrade needed?',
      'Look good. Feel better.',
      'Fashion meets comfort.',
    ],
    benefits: ['Trendy designs', 'Premium quality', 'Affordable luxury', 'Size-inclusive', 'Sustainable fashion'],
    emotions: ['confidence', 'elegance', 'boldness', 'sophistication', 'self-expression'],
  },
  'technology': {
    taglines: [
      'Innovation at Your Fingertips',
      'Smarter. Faster. Better.',
      'Tech That Works for You',
      'Future-Ready Solutions',
      'Power Your Potential',
    ],
    hooks: [
      'Still doing it the old way?',
      'Technology should simplify, not complicate.',
      'Upgrade your life.',
      'The future is here.',
    ],
    benefits: ['Cutting-edge technology', 'Easy to use', 'Reliable performance', '24/7 support', 'Great value'],
    emotions: ['empowerment', 'curiosity', 'trust', 'excitement', 'progress'],
  },
  'real-estate': {
    taglines: [
      'Build Your Dream Home',
      'Where Dreams Find Address',
      'Invest in Your Future',
      'Space That Inspires',
      'Your Home, Your Legacy',
    ],
    hooks: [
      'Looking for the perfect home?',
      'Your dream property awaits.',
      'Smart investment starts here.',
      'A home that matches your ambition.',
    ],
    benefits: ['Prime locations', 'RERA registered', 'Transparent pricing', 'Loan assistance', 'Quality construction'],
    emotions: ['security', 'pride', 'aspiration', 'trust', 'belonging'],
  },
  'health': {
    taglines: [
      'Your Health, Our Priority',
      'Wellness Starts Here',
      'Feel Better. Live Better.',
      'Natural Care, Real Results',
      'Healthy Habits, Happy Life',
    ],
    hooks: [
      'Feeling your best starts today.',
      'Don\'t wait for wellness.',
      'Your body deserves the best.',
      'Small changes, big results.',
    ],
    benefits: ['Natural ingredients', 'Expert guidance', 'Proven results', 'Personalized plans', 'Holistic approach'],
    emotions: ['care', 'hope', 'vitality', 'relief', 'confidence'],
  },
  'education': {
    taglines: [
      'Learn. Grow. Succeed.',
      'Knowledge Is Power',
      'Skill Up, Stand Out',
      'Education That Empowers',
      'Your Future Starts Here',
    ],
    hooks: [
      'Ready to level up?',
      'The best investment? Yourself.',
      'Skills that pay bills.',
      'Learn from the best.',
    ],
    benefits: ['Expert mentors', 'Practical training', 'Certification', 'Job assistance', 'Flexible schedule'],
    emotions: ['ambition', 'growth', 'confidence', 'achievement', 'motivation'],
  },
  'services': {
    taglines: [
      'Service You Can Trust',
      'Excellence in Every Detail',
      'We Deliver, You Smile',
      'Professional. Reliable. Affordable.',
      'Your Problem, Our Solution',
    ],
    hooks: [
      'Need it done right?',
      'We handle the hard part.',
      'Quality service, guaranteed.',
      'Let the experts take over.',
    ],
    benefits: ['Quick turnaround', 'Experienced team', 'Transparent pricing', 'Customer support', 'Satisfaction guaranteed'],
    emotions: ['relief', 'trust', 'satisfaction', 'confidence', 'peace'],
  },
  'fitness': {
    taglines: [
      'Sweat Now, Shine Later',
      'Stronger Every Day',
      'Transform Your Body',
      'Push Your Limits',
      'Fitness Is a Lifestyle',
    ],
    hooks: [
      'Your transformation starts now.',
      'No excuses. Just results.',
      'Get fit. Feel fierce.',
      'Strong is the new beautiful.',
    ],
    benefits: ['Personal training', 'Modern equipment', 'Flexible timings', 'Nutrition guidance', 'Community support'],
    emotions: ['motivation', 'strength', 'determination', 'pride', 'energy'],
  },
  'beauty': {
    taglines: [
      'Glow Different',
      'Beauty Redefined',
      'Look Amazing, Feel Incredible',
      'Radiate Confidence',
      'Natural Beauty, Enhanced',
    ],
    hooks: [
      'Your glow-up starts here.',
      'Beauty without compromise.',
      'Feel confident every day.',
      'Pamper yourself.',
    ],
    benefits: ['Premium products', 'Expert advice', 'Cruelty-free', 'Long-lasting results', 'Affordable luxury'],
    emotions: ['confidence', 'self-love', 'elegance', 'happiness', 'glamour'],
  },
  'default': {
    taglines: [
      'Experience the Difference',
      'Quality You Can Trust',
      'Innovation Meets Excellence',
      'Your Success, Our Mission',
    ],
    hooks: [
      'Looking for something better?',
      'We\'ve got you covered.',
      'Quality meets affordability.',
      'Discover the difference.',
    ],
    benefits: ['High quality', 'Great value', 'Trusted brand', 'Customer support', 'Proven results'],
    emotions: ['trust', 'excitement', 'confidence', 'satisfaction', 'joy'],
  },
}

const TONE_MODIFIERS: Record<string, { prefix: string; style: string; emoji: boolean }> = {
  'professional': { prefix: '', style: 'formal', emoji: false },
  'casual': { prefix: 'Hey! ', style: 'friendly', emoji: true },
  'fun': { prefix: '🎉 ', style: 'playful', emoji: true },
  'luxury': { prefix: '', style: 'sophisticated', emoji: false },
  'motivational': { prefix: '💪 ', style: 'inspiring', emoji: true },
  'informative': { prefix: '', style: 'educational', emoji: false },
}

const PLATFORM_TEMPLATES: Record<string, { maxLength: string; style: string; hashtagCount: number; bestTime: string }> = {
  'instagram': { maxLength: '150-300 chars', style: 'Visual-first with emojis', hashtagCount: 15, bestTime: '11 AM - 1 PM, 7 PM - 9 PM' },
  'facebook': { maxLength: '200-500 chars', style: 'Storytelling + CTA', hashtagCount: 5, bestTime: '1 PM - 4 PM' },
  'twitter': { maxLength: '280 chars max', style: 'Punchy + Threads', hashtagCount: 3, bestTime: '8 AM - 10 AM, 12 PM - 1 PM' },
  'linkedin': { maxLength: '300-700 chars', style: 'Professional + Value', hashtagCount: 5, bestTime: 'Tue-Thu, 8 AM - 10 AM' },
  'youtube': { maxLength: 'Title + Description', style: 'SEO + Hook', hashtagCount: 5, bestTime: 'Thu-Sat, 2 PM - 4 PM' },
  'pinterest': { maxLength: '500-600 chars', style: 'Descriptive + Keywords', hashtagCount: 5, bestTime: '8 PM - 11 PM' },
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function genHashtags(product: string, category: string, location: string): string[] {
  const tags = new Set<string>()
  const catKey = category.toLowerCase().split(/[\s&]+/)[0]
  const words = product.split(/[\s,]+/).filter(w => w.length > 2)

  // Product tags
  words.forEach(w => tags.add(`#${w.replace(/[^a-zA-Z0-9]/g, '')}`))
  tags.add(`#${catKey.replace(/[\s&]+/g, '')}`)

  // Category-specific tags
  const categoryTags: Record<string, string[]> = {
    'food': ['#FoodLovers', '#FoodieLife', '#Delicious', '#Homemade', '#FoodPorn', '#Yummy', '#InstaFood'],
    'fashion': ['#Fashion', '#StyleInspo', '#OOTD', '#FashionTrends', '#StreetStyle', '#LookBook'],
    'technology': ['#Tech', '#Innovation', '#TechNews', '#Gadgets', '#Digital', '#FutureTech'],
    'real': ['#RealEstate', '#Property', '#HomeSweetHome', '#Investment', '#DreamHome'],
    'health': ['#Health', '#Wellness', '#HealthyLiving', '#SelfCare', '#HealthTips'],
    'education': ['#Education', '#Learning', '#SkillDevelopment', '#CareerGrowth', '#Knowledge'],
    'services': ['#Services', '#Professional', '#QualityService', '#CustomerFirst'],
    'fitness': ['#Fitness', '#Workout', '#GymLife', '#FitnessMotivation', '#HealthyLifestyle'],
    'beauty': ['#Beauty', '#GlowUp', '#Skincare', '#BeautyTips', '#Makeup'],
  }

  const matchedKey = Object.keys(categoryTags).find(k => catKey.includes(k)) || 'services'
  categoryTags[matchedKey].forEach(t => tags.add(t))

  if (location) {
    const locClean = location.replace(/[\s,]+/g, '')
    tags.add(`#${locClean}`)
    tags.add(`#${locClean}Business`)
  }

  // Generic tags
  tags.add('#India')
  tags.add('#Business')
  tags.add('#LocalBusiness')
  tags.add('#SupportLocal')
  tags.add('#Quality')

  return Array.from(tags).slice(0, 20)
}

function genInstagramPost(input: MarketingInput, templates: typeof CATEGORY_TEMPLATES['default'], tone: typeof TONE_MODIFIERS['professional']): PlatformContent {
  const hook = pick(templates.hooks)
  const benefit = pick(templates.benefits)
  const cta = input.callToAction || 'DM us to learn more!'
  
  let caption = ''
  if (tone.emoji) {
    caption = `${hook}\n\n✨ Introducing **${input.productName}**\n\n${input.productDescription}\n\n✅ ${benefit}\n🎯 Perfect for ${input.targetAudience}\n📍 ${input.location}\n\n${cta}\n\n👉 Follow for more updates!\n\n`
  } else {
    caption = `${hook}\n\nIntroducing ${input.productName}.\n\n${input.productDescription}\n\n- ${benefit}\n- Designed for ${input.targetAudience}\n- Available in ${input.location}\n\n${cta}\n`
  }
  
  return {
    platform: 'Instagram',
    caption,
    hashtags: genHashtags(input.productName, input.category, input.location),
    postType: 'Carousel / Reel / Story',
    bestTime: '11 AM - 1 PM, 7 PM - 9 PM',
    tips: [
      'Use high-quality visuals or short video (Reels get 2x reach)',
      'Post behind-the-scenes content on Stories',
      'Use Instagram Shopping if selling products',
    ],
  }
}

function genFacebookPost(input: MarketingInput, templates: typeof CATEGORY_TEMPLATES['default'], tone: typeof TONE_MODIFIERS['professional']): PlatformContent {
  const tagline = pick(templates.taglines)
  const cta = input.callToAction || 'Contact us today!'
  
  let caption = `**${tagline}**\n\n${input.productName} — ${input.productDescription}\n\n`
  caption += `Who is this for? ${input.targetAudience}\n`
  if (input.priceRange) caption += `Starting at: ${input.priceRange}\n`
  caption += `Location: ${input.location}\n\n`
  if (input.usp) caption += `Why choose us? ${input.usp}\n\n`
  caption += `${cta}\n\n📞 +91 79721 40672\n📧 talenthebhai123@gmail.com`
  
  return {
    platform: 'Facebook',
    caption,
    hashtags: genHashtags(input.productName, input.category, input.location).slice(0, 8),
    postType: 'Image Post / Video / Event',
    bestTime: '1 PM - 4 PM',
    tips: [
      'Use Facebook Groups to reach local audience',
      'Run targeted ads (₹500/day can reach 5,000+ people)',
      'Go live to showcase products/services',
    ],
  }
}

function genTwitterPost(input: MarketingInput, templates: typeof CATEGORY_TEMPLATES['default'], tone: typeof TONE_MODIFIERS['professional']): PlatformContent {
  const hook = pick(templates.hooks)
  const tagline = pick(templates.taglines)
  
  let text = `${hook}\\n\\n🚀 ${input.productName}\\n\\n${tagline}.`
  if (input.usp) text += ` ${input.usp}`
  text += `\\n\\n📍 ${input.location} | ${input.priceRange || 'Contact for pricing'}`
  
  // Thread continuation
  const thread = `${hook}\n\n🚀 ${input.productName}\n\n${tagline}.\n\n🧵 Here's why this matters 👇\n\n1/ ${input.productDescription}\n\n2/ Perfect for ${input.targetAudience}\n\n3/ ${input.usp || pick(templates.benefits)}\n\n4/ Location: ${input.location}\n\n${input.priceRange ? `5/ Pricing: ${input.priceRange}\n\n` : ''}Ready? ${input.callToAction || 'DM us!'} 🚀`
  
  return {
    platform: 'Twitter/X',
    caption: thread,
    hashtags: genHashtags(input.productName, input.category, input.location).slice(0, 5),
    postType: 'Tweet + Thread',
    bestTime: '8 AM - 10 AM, 12 PM - 1 PM',
    tips: [
      'Threads get 3x more engagement than single tweets',
      'Use polls to boost engagement',
      'Quote-tweet industry news with your take',
    ],
  }
}

function genLinkedInPost(input: MarketingInput, templates: typeof CATEGORY_TEMPLATES['default'], tone: typeof TONE_MODIFIERS['professional']): PlatformContent {
  const template = `I'm excited to share something we've been working on.\n\n**${input.productName}** — ${input.productDescription}\n\nAfter months of research and development, we've created something that truly makes a difference for ${input.targetAudience}.\n\nHere's what sets us apart:\n\n✅ ${input.usp || pick(templates.benefits)}\n✅ ${pick(templates.benefits)}\n✅ ${pick(templates.benefits)}\n\n${input.location}\n${input.priceRange ? `${input.priceRange}\n` : ''}\nIf you're interested, I'd love to connect and share more.\n\n${input.callToAction || 'Drop a comment or message me!'}\n\n---\n#Entrepreneurship #Innovation`
  
  return {
    platform: 'LinkedIn',
    caption: template,
    hashtags: genHashtags(input.productName, input.category, input.location).slice(0, 8),
    postType: 'Text Post / Article / Document',
    bestTime: 'Tue-Thu, 8 AM - 10 AM',
    tips: [
      'Personal stories perform best on LinkedIn',
      'Use document posts (PDF carousels) for 3x reach',
      'Tag relevant people and companies',
    ],
  }
}

function genAdCopy(input: MarketingInput, templates: typeof CATEGORY_TEMPLATES['default']) {
  const hook = pick(templates.hooks)
  const tagline = pick(templates.taglines)
  
  return [
    {
      headline: `${input.productName} | ${tagline}`,
      primary_text: `${hook}\n\n${input.productDescription}\n\nServing ${input.targetAudience} in ${input.location}.\n\n${input.usp ? `Why us: ${input.usp}\n` : ''}${input.priceRange || ''}\n\n${input.callToAction || 'Contact us today!'}`,
      description: `${input.productName} - ${tagline}. ${input.location}. ${input.priceRange || 'Contact for pricing'}.`,
    },
    {
      headline: `${pick(templates.taglines)}`,
      primary_text: `Looking for ${input.category} in ${input.location}?\n\n${input.productName} offers ${input.productDescription.toLowerCase()}\n\n✅ ${input.usp || pick(templates.benefits)}\n✅ ${pick(templates.benefits)}\n✅ ${pick(templates.benefits)}\n\nLimited offer for new customers!`,
      description: `Best ${input.category} services in ${input.location}. ${input.callToAction || 'Book now!'}`,
    },
    {
      headline: `${input.targetAudience} — This Is For You`,
      primary_text: `${pick(templates.hooks)}\n\n${input.productName}: ${tagline}\n\n${input.productDescription}\n\n📍 ${input.location}\n💰 ${input.priceRange || 'Best in market'}\n\nDon't miss out! ${input.callToAction || 'Order now!'}`,
      description: `Top-rated ${input.category} in ${input.location}. Rated ★★★★★ by customers.`,
    },
  ]
}

function genEmailSubjects(input: MarketingInput, templates: typeof CATEGORY_TEMPLATES['default']): string[] {
  return [
    `${pick(templates.hooks).replace('?', '')} — ${input.productName}`,
    `${input.productName}: ${pick(templates.taglines)}`,
    `New: ${input.productName} is here! 🚀`,
    `${input.targetAudience} — You'll love this`,
    `${pick(templates.taglines)} | ${input.productName}`,
  ]
}

function genContentCalendar(input: MarketingInput): string[] {
  return [
    `Monday: Motivational Monday — Share a success story related to ${input.productName}`,
    `Tuesday: Tutorial Tuesday — How-to or tips about ${input.category}`,
    `Wednesday: Behind the Scenes — Show the making/process of ${input.productName}`,
    `Thursday: Throwback/Testimonial — Customer review or before/after`,
    `Friday: Feature Friday — Highlight a specific feature of ${input.productName}`,
    `Saturday: Social Saturday — Fun poll, quiz, or user-generated content`,
    `Sunday: Story Sunday — Share the brand story or founder's journey`,
  ]
}

// ─── Main Generator ────────────────────────────────────────────

function generateMarketingContent(input: MarketingInput): MarketingOutput {
  const catKey = CATEGORY_TEMPLATES[input.category] ? input.category : 'default'
  const templates = CATEGORY_TEMPLATES[catKey]
  const toneKey = TONE_MODIFIERS[input.tone] ? input.tone : 'professional'
  const tone = TONE_MODIFIERS[toneKey]
  
  const platforms: PlatformContent[] = []
  
  for (const p of input.platforms) {
    switch (p) {
      case 'instagram': platforms.push(genInstagramPost(input, templates, tone)); break
      case 'facebook': platforms.push(genFacebookPost(input, templates, tone)); break
      case 'twitter': platforms.push(genTwitterPost(input, templates, tone)); break
      case 'linkedin': platforms.push(genLinkedInPost(input, templates, tone)); break
    }
  }
  
  return {
    productName: input.productName,
    category: input.category,
    tagline: pick(templates.taglines),
    elevator_pitch: `${input.productName} — ${input.productDescription}. Perfect for ${input.targetAudience} in ${input.location}.${input.usp ? ` ${input.usp}` : ''}${input.priceRange ? ` Starting at ${input.priceRange}.` : ''}`,
    platforms,
    content_calendar: genContentCalendar(input),
    ad_copy: genAdCopy(input, templates),
    email_subject_lines: genEmailSubjects(input, templates),
    bio_suggestion: `${input.productName} | ${pick(templates.taglines)} | ${input.category} | ${input.location} | ${input.callToAction || 'Contact us!'}`,
    keywords: genHashtags(input.productName, input.category, input.location).map(h => h.replace('#', '')),
  }
}

// ─── API Route ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const input: MarketingInput = await req.json()
    
    if (!input.productName || !input.productDescription) {
      return NextResponse.json(
        { error: 'Product name and description are required' },
        { status: 400 }
      )
    }
    
    const result = generateMarketingContent(input)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Marketing API error:', err)
    return NextResponse.json(
      { error: 'Generation failed', message: err.message },
      { status: 500 }
    )
  }
}
