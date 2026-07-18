// Billionaire & Trillionaire Wisdom Data
// Books, learnings, and quotes updated daily

export interface Book {
  id: number
  title: string
  author: string
  billionaire: string
  cover: string
  rating: number
  keyTakeaway: string
  category: string
  year: number
}

export interface Learning {
  id: number
  billionaire: string
  netWorth: string
  avatar: string
  lesson: string
  detail: string
  category: string
  source: string
}

export interface DailyQuote {
  id: number
  quote: string
  author: string
  netWorth: string
  context: string
  date: string
}

export const BILLIONAIRE_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    billionaire: "Naval Ravikant",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    rating: 4.8,
    keyTakeaway: "Wealth is not about money — it's about assets that earn while you sleep. Focus on specific knowledge, leverage, and accountability.",
    category: "Wealth Building",
    year: 2020
  },
  {
    id: 2,
    title: "Zero to One",
    author: "Peter Thiel",
    billionaire: "Peter Thiel",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop",
    rating: 4.6,
    keyTakeaway: "Competition is for losers. Build a monopoly by creating something new — go from 0 to 1, not 1 to n.",
    category: "Entrepreneurship",
    year: 2014
  },
  {
    id: 3,
    title: "The Lean Startup",
    author: "Eric Ries",
    billionaire: "Eric Ries",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    rating: 4.5,
    keyTakeaway: "Build-Measure-Learn loop. Launch fast, fail fast, iterate faster. Validated learning is the unit of progress.",
    category: "Startups",
    year: 2011
  },
  {
    id: 4,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    billionaire: "Daniel Kahneman",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop",
    rating: 4.7,
    keyTakeaway: "System 1 (fast) vs System 2 (slow) thinking. Most financial mistakes come from cognitive biases — know your mental traps.",
    category: "Psychology",
    year: 2011
  },
  {
    id: 5,
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    billionaire: "Warren Buffett's Bible",
    cover: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=400&fit=crop",
    rating: 4.9,
    keyTakeaway: "Mr. Market is your servant, not your master. Buy value, not trends. Margin of safety is the key to investing.",
    category: "Investing",
    year: 1949
  },
  {
    id: 6,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    billionaire: "Robert Kiyosaki",
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop",
    rating: 4.4,
    keyTakeaway: "The rich make money work for them. Buy assets, not liabilities. Financial literacy is the foundation of wealth.",
    category: "Financial Literacy",
    year: 1997
  },
  {
    id: 7,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    billionaire: "Morgan Housel",
    cover: "https://images.unsplash.com/photo-1579532536935-619928decd08?w=300&h=400&fit=crop",
    rating: 4.7,
    keyTakeaway: "Getting money and keeping money require different skills. Luck and risk are siblings. Room for error is the most important factor.",
    category: "Money Mindset",
    year: 2020
  },
  {
    id: 8,
    title: "Principles: Life and Work",
    author: "Ray Dalio",
    billionaire: "Ray Dalio",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    rating: 4.6,
    keyTakeaway: "Radical transparency and meritocracy. Pain + Reflection = Progress. Systemize your decision-making.",
    category: "Management",
    year: 2017
  },
  {
    id: 9,
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    billionaire: "Ben Horowitz",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    rating: 4.5,
    keyTakeaway: "There are no shortcuts. Embrace the struggle. The hardest part of being a CEO is managing your own psychology.",
    category: "Leadership",
    year: 2014
  },
  {
    id: 10,
    title: "Shoe Dog",
    author: "Phil Knight",
    billionaire: "Phil Knight",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    rating: 4.8,
    keyTakeaway: "Nike's founder shares the raw truth — bankruptcy, betrayal, and relentless belief. Courage matters more than talent.",
    category: "Entrepreneurship",
    year: 2016
  },
  {
    id: 11,
    title: "The Essays of Warren Buffett",
    author: "Warren Buffett",
    billionaire: "Warren Buffett",
    cover: "https://images.unsplash.com/photo-1554774853-71015e28c1ea?w=300&h=400&fit=crop",
    rating: 4.9,
    keyTakeaway: "Be fearful when others are greedy. Price is what you pay, value is what you get. Invest in businesses you understand.",
    category: "Investing",
    year: 1997
  },
  {
    id: 12,
    title: "Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future",
    author: "Ashlee Vance",
    billionaire: "Elon Musk",
    cover: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=300&h=400&fit=crop",
    rating: 4.6,
    keyTakeaway: "Think from first principles, not analogy. Work like hell — 80-100 hour weeks. The impossible is just a matter of time.",
    category: "Innovation",
    year: 2015
  }
]

export const BILLIONAIRE_LEARNINGS: Learning[] = [
  {
    id: 1,
    billionaire: "Warren Buffett",
    netWorth: "$138B",
    avatar: "👴",
    lesson: "The Power of Compound Interest",
    detail: "Buffett bought his first stock at age 11. He said: 'I was wasting my time — I should have started earlier.' 99% of his net worth came after his 50th birthday. Start investing NOW, even ₹100/month.",
    category: "Investing",
    source: "Berkshire Hathaway Letters"
  },
  {
    id: 2,
    billionaire: "Jeff Bezos",
    netWorth: "$172B",
    avatar: "🚀",
    lesson: "Regret Minimization Framework",
    detail: "At 30, Bezos asked: 'Will I regret not trying this at 80?' He quit a Wall Street job to start Amazon in a garage. The framework: project yourself to age 80 and minimize regrets.",
    category: "Decision Making",
    source: "Princeton Graduation Speech"
  },
  {
    id: 3,
    billionaire: "Elon Musk",
    netWorth: "$245B",
    avatar: "⚡",
    lesson: "First Principles Thinking",
    detail: "Don't accept 'this is how it's always been done.' Break problems to fundamental truths and build up. Musk used this to reduce battery costs from $600/kWh to $80/kWh.",
    category: "Problem Solving",
    source: "Joe Rogan Interview"
  },
  {
    id: 4,
    billionaire: "Mukesh Ambani",
    netWorth: "$116B",
    avatar: "🏗️",
    lesson: "Think Big, Start Small, Scale Fast",
    detail: "Reliance went from a ₹1,000 crore company to ₹15 lakh crore. Ambani's mantra: 'Dream big, but start with what you have. Scale with technology and execution.'",
    category: "Scaling",
    source: "Reliance AGM Speeches"
  },
  {
    id: 5,
    billionaire: "Charlie Munger",
    netWorth: "$2.6B",
    avatar: "📚",
    lesson: "Invert, Always Invert",
    detail: "Instead of asking 'how to succeed,' ask 'how to guarantee failure?' Then avoid those things. Munger: 'All I want to know is where I'm going to die, so I'll never go there.'",
    category: "Mental Models",
    source: "Poor Charlie's Almanack"
  },
  {
    id: 6,
    billionaire: "Oprah Winfrey",
    netWorth: "$2.8B",
    avatar: "🎤",
    lesson: "Turn Your Wounds into Wisdom",
    detail: "From poverty and abuse to building a media empire. Oprah: 'Turn your wounds into wisdom.' Your biggest struggles become your greatest strengths and business advantages.",
    category: "Resilience",
    source: "Stanford Commencement"
  },
  {
    id: 7,
    billionaire: "Ratan Tata",
    netWorth: "Legacy",
    avatar: "🕊️",
    lesson: "Ethics Over Profits — Always",
    detail: "Tata Group rejected $20B+ in bribes. Ratan Tata: 'I would rather lose a deal than compromise on values.' The Tata brand is India's most trusted — built on integrity, not shortcuts.",
    category: "Ethics",
    source: "Tata Group Philosophy"
  },
  {
    id: 8,
    billionaire: "Mark Zuckerberg",
    netWorth: "$180B",
    avatar: "💻",
    lesson: "Move Fast and Break Things",
    detail: "Facebook's early motto. Ship imperfect products, iterate based on data. Zuckerberg: 'Done is better than perfect.' Speed beats perfection in the digital age.",
    category: "Execution",
    source: "Y Combinator Startup School"
  },
  {
    id: 9,
    billionaire: "Nassim Taleb",
    netWorth: "~$50M",
    avatar: "🦢",
    lesson: "Antifragility — Gain from Disorder",
    detail: "Build systems that get STRONGER from shocks, not just resilient. Have 'skin in the game.' Barbell strategy: 90% ultra-safe, 10% high-risk bets. Never be in the fragile middle.",
    category: "Risk Management",
    source: "Antifragile (Book)"
  },
  {
    id: 10,
    billionaire: "Radhakishan Damani",
    netWorth: "$16B",
    avatar: "🏪",
    lesson: "Patience is the Ultimate Edge",
    detail: "DMart's founder waited 10+ years before going public. He said: 'I don't chase quarterly profits. I build for decades.' His stock returned 5,000%+ since IPO. Slow and steady wins.",
    category: "Patience",
    source: "Avenue Supermarts AGM"
  },
  {
    id: 11,
    billionaire: "Carnegie / Rockefeller",
    netWorth: "Historical Titans",
    avatar: "🏭",
    lesson: "Own the Infrastructure, Not the Product",
    detail: "Carnegie owned steel mills (infrastructure). Rockefeller owned oil pipelines. They didn't sell the product — they owned the means of production. Today: own platforms, not just content.",
    category: "Strategy",
    source: "The Titans of Industry"
  },
  {
    id: 12,
    billionaire: "Naval Ravikant",
    netWorth: "$60M",
    avatar: "💎",
    lesson: "Specific Knowledge + Leverage = Wealth",
    detail: "Find what feels like play to you but work to others. Then apply leverage (code, media, capital, people). Wealth is not about hard work — it's about the RIGHT work with leverage.",
    category: "Wealth Building",
    source: "The Almanack of Naval Ravikant"
  }
]

// Daily rotating quotes — 30 quotes for 30 days
export const DAILY_QUOTES: DailyQuote[] = [
  { id: 1, quote: "The best investment you can make is in yourself.", author: "Warren Buffett", netWorth: "$138B", context: "On continuous learning", date: "Day 1" },
  { id: 2, quote: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.", author: "Benjamin Franklin", netWorth: "Founding Father", context: "On habits and wealth", date: "Day 2" },
  { id: 3, quote: "If you don't find a way to make money while you sleep, you will work until you die.", author: "Warren Buffett", netWorth: "$138B", context: "On passive income", date: "Day 3" },
  { id: 4, quote: "The biggest risk is not taking any risk. In a world that is changing really quickly, the only strategy that is guaranteed to fail is not taking risks.", author: "Mark Zuckerberg", netWorth: "$180B", context: "On risk-taking", date: "Day 4" },
  { id: 5, quote: "It's not about how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.", author: "Robert Kiyosaki", netWorth: "$100M+", context: "On wealth preservation", date: "Day 5" },
  { id: 6, quote: "I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying.", author: "Jeff Bezos", netWorth: "$172B", context: "On starting Amazon", date: "Day 6" },
  { id: 7, quote: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk", netWorth: "$245B", context: "On pursuing SpaceX", date: "Day 7" },
  { id: 8, quote: "Price is what you pay. Value is what you get.", author: "Warren Buffett", netWorth: "$138B", context: "On value investing", date: "Day 8" },
  { id: 9, quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", netWorth: "Legacy", context: "On execution", date: "Day 9" },
  { id: 10, quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", netWorth: "Founding Father", context: "On education", date: "Day 10" },
  { id: 11, quote: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett", netWorth: "$138B", context: "On patience in investing", date: "Day 11" },
  { id: 12, quote: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates", netWorth: "$130B", context: "On feedback", date: "Day 12" },
  { id: 13, quote: "Wealth is the ability to fully experience life.", author: "Henry David Thoreau", netWorth: "Philosopher", context: "On purpose of wealth", date: "Day 13" },
  { id: 14, quote: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", netWorth: "$400B (adj.)", context: "On ambition", date: "Day 14" },
  { id: 15, quote: "The real measure of your wealth is how much you'd be worth if you lost all your money.", author: "Bernard Meltzer", netWorth: "Radio Host", context: "On true wealth", date: "Day 15" },
  { id: 16, quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.", author: "Albert Einstein (attributed)", netWorth: "Genius", context: "On compounding", date: "Day 16" },
  { id: 17, quote: "I made my money by selling too soon.", author: "Bernard Baruch", netWorth: "$100M+", context: "On profit-taking", date: "Day 17" },
  { id: 18, quote: "The goal isn't more money. The goal is living life on your terms.", author: "Chris Brogan", netWorth: "Entrepreneur", context: "On financial freedom", date: "Day 18" },
  { id: 19, quote: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin", netWorth: "Founding Father", context: "On frugality", date: "Day 19" },
  { id: 20, quote: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon", netWorth: "$200M+", context: "On hard work", date: "Day 20" },
  { id: 21, quote: "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.", author: "Charles Darwin", netWorth: "Scientist", context: "On adaptability", date: "Day 21" },
  { id: 22, quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", netWorth: "Ancient Wisdom", context: "On starting late", date: "Day 22" },
  { id: 23, quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", netWorth: "Leader", context: "On perseverance", date: "Day 23" },
  { id: 24, quote: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius", netWorth: "Philosopher", context: "On starting small", date: "Day 24" },
  { id: 25, quote: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett", netWorth: "$138B", context: "On saving first", date: "Day 25" },
  { id: 26, quote: "The four most dangerous words in investing: 'This time it's different.'", author: "Sir John Templeton", netWorth: "$1B+", context: "On market cycles", date: "Day 26" },
  { id: 27, quote: "Opportunities don't happen. You create them.", author: "Chris Grosser", netWorth: "Entrepreneur", context: "On creating luck", date: "Day 27" },
  { id: 28, quote: "The secret of getting ahead is getting started.", author: "Mark Twain", netWorth: "Author", context: "On taking action", date: "Day 28" },
  { id: 29, quote: "Wealth is not about having a lot of money; it's about having a lot of options.", author: "Chris Rock", netWorth: "$100M+", context: "On financial freedom", date: "Day 29" },
  { id: 30, quote: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", author: "Philip Fisher", netWorth: "Investor", context: "On value vs price", date: "Day 30" }
]

// Get today's quote based on day of month
export function getTodaysQuote(): DailyQuote {
  const day = new Date().getDate()
  const index = (day - 1) % DAILY_QUOTES.length
  return DAILY_QUOTES[index]
}

// Get today's featured book (rotates daily)
export function getTodaysBook(): Book {
  const day = new Date().getDate()
  const index = (day - 1) % BILLIONAIRE_BOOKS.length
  return BILLIONAIRE_BOOKS[index]
}

// Get today's featured learning (rotates daily)
export function getTodaysLearning(): Learning {
  const day = new Date().getDate()
  const index = (day - 1) % BILLIONAIRE_LEARNINGS.length
  return BILLIONAIRE_LEARNINGS[index]
}
