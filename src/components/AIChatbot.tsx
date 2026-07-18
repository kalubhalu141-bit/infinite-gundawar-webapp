'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

/* ─── Types ─── */
interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  timestamp: Date
}

interface BotConfig {
  id: string
  name: string
  icon: string
  color: string
  gradient: string
  description: string
  expertise: string[]
  suggestions: string[]
  responses: Record<string, string>
}

/* ─── Bot Configurations ─── */
const bots: BotConfig[] = [
  {
    id: 'infrastructure',
    name: 'InfraBot AI',
    icon: '🏗️',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-800',
    description: 'Infrastructure & Real Estate expert AI',
    expertise: ['Construction', 'Real Estate', 'Township Planning', 'BOT Projects', 'Property Management', 'Infrastructure Development'],
    suggestions: [
      'How to start a construction project?',
      'What is a BOT contract?',
      'Real estate investment tips for 2025',
      'How to get construction permits in Maharashtra?',
      'Best practices for township development',
    ],
    responses: {
      'how to start a construction project': 'Starting a construction project involves several key steps:\n\n1️⃣ **Land Acquisition** — Verify land titles, check zoning laws, and ensure clear ownership\n2️⃣ **Planning & Design** — Hire architects and engineers for blueprints and structural design\n3️⃣ **Permits & Approvals** — Obtain building permits from local municipal authorities (MBRERA registration for Maharashtra)\n4️⃣ **Budgeting** — Estimate costs: materials (40-50%), labor (25-30%), permits (5-10%), contingency (10-15%)\n5️⃣ **Contractor Selection** — Choose licensed contractors with proven track records\n6️⃣ **Construction Phase** → Foundation → Structure → Finishing → Handover\n\n💡 **Pro Tip:** Always register your project under RERA for legal protection and buyer confidence. Our team at Infinite Gundawar can guide you through every step!',
      'what is a bot contract': 'A **BOT (Build-Operate-Transfer)** contract is a project delivery method where:\n\n🏗️ **Build** — A private entity constructs the infrastructure project\n⚙️ **Operate** — The entity operates and maintains it for a fixed period (usually 20-30 years) to recover costs and earn profit\n🔄 **Transfer** — After the concession period, ownership transfers to the government\n\n**Common BOT Projects:**\n• Highways & Roads\n• Bridges & Tunnels\n• Power Plants\n• Water Treatment Facilities\n• Airports & Ports\n\n**Benefits:**\n✅ Reduces government financial burden\n✅ Brings private sector efficiency\n✅ Faster project completion\n✅ Technology transfer\n\n💡 India has over ₹5 lakh crore worth of BOT projects in the pipeline. Infinite Gundawar is actively exploring BOT opportunities in infrastructure!',
      'real estate investment tips': '**Real Estate Investment Tips for 2025:**\n\n📊 **Market Trends:**\n• Tier-2 cities (Pune, Nagpur, Nashik) showing 15-20% growth\n• Commercial real estate booming near IT corridors\n• Affordable housing demand surging\n\n🎯 **Investment Strategies:**\n1. **Location First** — Areas near upcoming metro, highways, airports\n2. **RERA Registered Only** — Legal safety\n3. **Diversify** — Mix of residential + commercial\n4. **Long-term Hold** — 5-7 years for maximum appreciation\n5. **REITs** — Start with ₹10,000 in Real Estate Investment Trusts\n\n💰 **Best Returns:**\n• Plots near upcoming infrastructure: 25-40% in 3 years\n• Pre-launch apartments: 15-25% appreciation\n• Commercial shops: 8-12% rental yield\n\n💡 Our team can help you identify the best real estate opportunities in Maharashtra!',
      'construction permits': '**Getting Construction Permits in Maharashtra:**\n\n📋 **Required Documents:**\n1. 7/12 Extract (land record)\n2. Architect\'s plan & structural design\n3. NOC from fire department\n4. Environmental clearance (for large projects)\n5. Soil testing report\n6. RERA registration\n\n🏛️ **Approval Process:**\n1. Submit application to local municipal corporation\n2. Plan scrutiny (15-30 days)\n3. Site inspection\n4. Permit issuance (30-60 days total)\n\n⚠️ **Common Rejection Reasons:**\n• FSI (Floor Space Index) violations\n• Setback rule violations\n• Missing NOCs\n• Incomplete documentation\n\n💡 **Infinite Gundawar Advantage:** We handle the entire permit process for our clients, ensuring smooth approvals with our established relationships with local authorities!',
      'township development': '**Best Practices for Township Development:**\n\n🏘️ **Planning Phase:**\n• Minimum 10-acre land for viable township\n• Master plan with residential, commercial, recreational zones\n• Green spaces: minimum 15% of total area\n• Road network: 40ft main roads, 30ft internal roads\n\n🏗️ **Infrastructure Requirements:**\n• Water supply & sewage treatment plant\n• Rainwater harvesting (mandatory)\n• Solar power for common areas\n• Smart security systems\n• Clubhouse, parks, community centers\n\n📊 **Phased Development:**\nPhase 1: Infrastructure + Model flats (Year 1-2)\nPhase 2: Residential blocks (Year 2-4)\nPhase 3: Commercial + Amenities (Year 3-5)\n\n💰 **Investment:** ₹50-200 crore depending on scale\n📈 **ROI:** 20-35% over 5 years\n\n💡 Infinite Gundawar has expertise in developing integrated townships with modern amenities and sustainable design!',
      'default': 'Hello! I\'m **InfraBot AI**, your Infrastructure & Real Estate expert. 🏗️\n\nI can help you with:\n• Construction project planning\n• Real estate investment advice\n• BOT contracts & infrastructure projects\n• Permit & approval processes\n• Township development strategies\n\nAsk me anything about infrastructure and real estate!'
    }
  },
  {
    id: 'trading',
    name: 'TradeBot AI',
    icon: '🌐',
    color: 'emerald',
    gradient: 'from-emerald-600 to-emerald-800',
    description: 'Import/Export & Global Trade expert AI',
    expertise: ['Import/Export', 'Global Trade', 'Logistics', 'Customs', 'Trade Finance', 'Market Analysis'],
    suggestions: [
      'How to start an import-export business?',
      'What documents are needed for export?',
      'Best products to export from India',
      'How to find international buyers?',
      'What is a Letter of Credit?',
    ],
    responses: {
      'how to start an import export business': '**Starting an Import-Export Business in India:**\n\n📋 **Step-by-Step Guide:**\n\n1️⃣ **Company Registration**\n   • Register as Pvt Ltd / LLP / Proprietorship\n   • Get PAN and GST registration\n\n2️⃣ **IEC (Import Export Code)**\n   • Apply at DGFT (Directorate General of Foreign Trade)\n   • Cost: ₹500, Processing: 2-3 days\n   • Mandatory for all import/export\n\n3️⃣ **RCMC**\n   • Register with Export Promotion Council\n   • Required for export benefits\n\n4️⃣ **Bank Account**\n   • Open a current account with authorized dealer bank\n   • Enable forex transactions\n\n5️⃣ **Market Research**\n   • Identify products with export potential\n   • Find target markets\n   • Analyze competition\n\n💰 **Initial Investment:** ₹2-5 lakh\n📈 **Profit Margins:** 10-30% depending on product\n\n💡 Infinite Gundawar can help you set up your entire import-export operation!',
      'export documents': '**Essential Export Documents:**\n\n📄 **Commercial Documents:**\n1. Commercial Invoice\n2. Packing List\n3. Bill of Lading / Airway Bill\n4. Certificate of Origin\n5. Insurance Certificate\n\n🏛️ **Regulatory Documents:**\n6. IEC (Import Export Code)\n7. GST Registration\n8. RCMC Certificate\n9. APEDA Registration (for agricultural products)\n10. FSSAI License (for food products)\n\n💰 **Financial Documents:**\n11. Letter of Credit (L/C)\n12. Bank Guarantee\n13. Foreign Inward Remittance Certificate (FIRC)\n\n⚠️ **Pro Tip:** Missing even one document can delay shipment by weeks. Always double-check before shipping!\n\n💡 Our trade team at Infinite Gundawar handles all documentation for hassle-free exports!',
      'best products to export': '**Best Products to Export from India (2025):**\n\n🏆 **Top Categories:**\n\n1. **Pharmaceuticals** — $25B+ market\n   • Generic medicines, APIs, vaccines\n   • Top destinations: USA, Africa, Europe\n\n2. **Textiles & Garments** — $40B+ market\n   • Cotton fabrics, ready-made garments\n   • Top destinations: USA, EU, UAE\n\n3. **Agriculture & Spices** — $50B+ market\n   • Rice, wheat, spices, tea, coffee\n   • Top destinations: Middle East, Europe\n\n4. **IT Services & Software** — $200B+ market\n   • Software development, BPO, consulting\n   • Top destinations: USA, UK, Europe\n\n5. **Automobile Parts** — $20B+ market\n   • Engine parts, accessories, tires\n   • Top destinations: USA, Europe, Africa\n\n6. **Gems & Jewelry** — $40B+ market\n   • Diamonds, gold jewelry, precious stones\n   • Top destinations: USA, UAE, Hong Kong\n\n💡 Infinite Gundawar specializes in trading consumer goods, industrial products, and technology items globally!',
      'find international buyers': '**How to Find International Buyers:**\n\n🌐 **Online Platforms:**\n1. **B2B Marketplaces:**\n   • Alibaba.com (largest B2B platform)\n   • IndiaMART (Indian B2B giant)\n   • TradeIndia, ExportersIndia\n   • Global Sources, Made-in-China\n\n2. **Government Platforms:**\n   • DGFT\'s Trade Portal\n   • Export Promotion Councils\n   • Indian Trade Portal (tradent.indiantradeportal.in)\n\n🏢 **Offline Methods:**\n3. **Trade Fairs & Exhibitions**\n   • India International Trade Fair (IITF)\n   • Canton Fair (China)\n   • Dubai Trade Fair\n\n4. **Embassy & Consulate**\n   • Commercial attachés can connect you\n   • Trade delegations\n\n5. **LinkedIn & Social Media**\n   • Connect with procurement managers\n   • Join industry-specific groups\n\n💡 **Infinite Gundawar\'s Edge:** We have an established network of international buyers across 15+ countries for consumer goods, industrial products, and technology items!',
      'letter of credit': '**Letter of Credit (L/C) Explained:**\n\n📜 **What is L/C?**\nA Letter of Credit is a bank guarantee that ensures the seller gets paid if they fulfill the terms of the contract. It\'s the most secure payment method in international trade.\n\n🔄 **How It Works:**\n1. Buyer applies for L/C at their bank\n2. Buyer\'s bank issues L/C to seller\'s bank\n3. Seller ships goods and presents documents\n4. Seller\'s bank verifies and pays\n5. Buyer\'s bank reimburses seller\'s bank\n\n📋 **Types of L/C:**\n• **Irrevocable** — Cannot be changed without consent\n• **Confirmed** — Additional bank guarantee\n• **Sight L/C** — Payment on document presentation\n• **Usance L/C** • Payment after 30/60/90 days\n• **Back-to-Back** — For intermediaries\n\n💰 **Cost:** 1-3% of L/C value\n⏱️ **Processing:** 3-7 working days\n\n💡 Infinite Gundawar uses secure L/C transactions for all international trade deals!',
      'default': 'Hello! I\'m **TradeBot AI**, your Import/Export & Global Trade expert. 🌐\n\nI can help you with:\n• Starting an import-export business\n• Export documentation & procedures\n• Finding international buyers\n• Trade finance (L/C, etc.)\n• Product sourcing & market analysis\n\nAsk me anything about global trade!'
    }
  },
  {
    id: 'education',
    name: 'EduBot AI',
    icon: '📚',
    color: 'purple',
    gradient: 'from-purple-600 to-purple-800',
    description: 'Coaching & Education expert AI',
    expertise: ['Competitive Exams', 'Skill Development', 'Online Learning', 'Career Guidance', 'Course Planning', 'Study Strategies'],
    suggestions: [
      'How to prepare for competitive exams?',
      'Best skill development courses in 2025',
      'How to start a coaching center?',
      'Online vs offline learning — which is better?',
      'Career guidance for students',
    ],
    responses: {
      'how to prepare for competitive exams': '**Competitive Exam Preparation Strategy:**\n\n📚 **Step-by-Step Plan:**\n\n1️⃣ **Understand the Exam**\n   • Syllabus analysis\n   • Previous year papers (last 5 years)\n   • Exam pattern & marking scheme\n\n2️⃣ **Create a Study Plan**\n   • 6-12 months preparation ideal\n   • Daily 6-8 hours of focused study\n   • Weekly targets and monthly revisions\n\n3️⃣ **Study Materials**\n   • NCERT books (foundation)\n   • Standard reference books\n   • Online courses & video lectures\n   • Mock test series\n\n4️⃣ **Practice Strategy**\n   • Solve 50-100 MCQs daily\n   • Take weekly mock tests\n   • Analyze mistakes and improve\n   • Time management practice\n\n5️⃣ **Revision Plan**\n   • Daily: Quick review of previous day\n   • Weekly: Full week revision\n   • Monthly: Complete syllabus revision\n\n🏆 **Top Exams We Coach For:**\n• UPSC, MPSC, SSC\n• Banking (IBPS, SBI)\n• JEE, NEET\n• CAT, GMAT\n• NET, SET\n\n💡 Infinite Gundawar\'s coaching programs have helped 500+ students crack competitive exams!',
      'skill development courses': '**Best Skill Development Courses in 2025:**\n\n🔥 **High-Demand Skills:**\n\n1. **Digital Marketing** (₹3-15 LPA)\n   • SEO, SEM, Social Media Marketing\n   • Google & Meta certifications\n   • Duration: 3-6 months\n\n2. **Data Science & AI** (₹8-25 LPA)\n   • Python, Machine Learning, Deep Learning\n   • Duration: 6-12 months\n\n3. **Web Development** (₹4-18 LPA)\n   • Full Stack (React, Node.js, Python)\n   • Duration: 4-8 months\n\n4. **Cloud Computing** (₹6-20 LPA)\n   • AWS, Azure, Google Cloud\n   • Duration: 3-6 months\n\n5. **Cybersecurity** (₹5-18 LPA)\n   • Ethical Hacking, Network Security\n   • Duration: 4-8 months\n\n6. **Financial Planning** (₹4-12 LPA)\n   • CFA, CFP, Financial Modeling\n   • Duration: 6-12 months\n\n💡 **Infinite Gundawar\'s Edge:** We offer both online and offline coaching with industry-experienced faculty, practical projects, and placement assistance!',
      'start a coaching center': '**How to Start a Coaching Center in India:**\n\n🏫 **Step-by-Step Guide:**\n\n1️⃣ **Planning**\n   • Decide your niche (competitive exams, skill development, academic)\n   • Target audience analysis\n   • Location selection (near schools/colleges)\n\n2️⃣ **Legal Requirements**\n   • Business registration (Pvt Ltd/LLP/Proprietorship)\n   • GST registration\n   • Shop & Establishment license\n   • Fire safety NOC\n   • Municipal permissions\n\n3️⃣ **Infrastructure**\n   • Classrooms (20-30 students each)\n   • Smart boards / projectors\n   • Library / study material\n   • Computer lab (if needed)\n   • Parking facility\n\n4️⃣ **Faculty & Staff**\n   Hire experienced teachers\n   • Subject experts\n   • Admin staff\n   • Marketing team\n\n5️⃣ **Marketing**\n   • Social media presence\n   • Free demo classes\n   • Referral programs\n   • Local advertising\n\n💰 **Investment:** ₹5-25 lakh\n📈 **Break-even:** 12-18 months\n💡 **Profit Margin:** 30-50%\n\n💡 Infinite Gundawar can help you set up and run a successful coaching business!',
      'online vs offline learning': '**Online vs Offline Learning — Which is Better?**\n\n📊 **Comparison:**\n\n| Factor | Online | Offline |\n|--------|--------|---------|\n| Flexibility | ✅ High | ❌ Fixed schedule |\n| Cost | ✅ Lower | ❌ Higher |\n| Interaction | ❌ Limited | ✅ Direct |\n| Discipline | ❌ Self-motivated | ✅ Structured |\n| Resources | ✅ Unlimited | ❌ Limited |\n| Networking | ❌ Virtual | ✅ In-person |\n\n🎯 **Best Approach: Hybrid Learning**\n\n**Online is better for:**\n• Self-paced learners\n• Working professionals\n• Access to global content\n• Cost-effective learning\n\n**Offline is better for:**\n• Hands-on practical training\n• Competitive exam preparation\n• Students needing discipline\n• Group discussions & peer learning\n\n💡 **Infinite Gundawar\'s Solution:** We offer a hybrid model combining the best of both worlds — online lectures + offline doubt sessions + practical workshops!',
      'career guidance': '**Career Guidance for Students:**\n\n🎓 **Stream Selection (After 10th):**\n\n**Science (PCM):** Engineering, Architecture, Defense, Research\n**Science (PCB):** Medical, Pharmacy, Biotechnology, Agriculture\n**Commerce:** CA, CS, MBA, Banking, Finance\n**Arts:** Law, Journalism, Civil Services, Design\n\n📈 **Top Career Paths in 2025:**\n\n1. **Technology** — Software, AI/ML, Cybersecurity\n2. **Healthcare** — Doctor, Dentist, Physiotherapist\n3. **Finance** — CA, CFA, Investment Banking\n4. **Civil Services** — IAS, IPS, IFS\n5. **Entrepreneurship** — Startups, E-commerce\n6. **Creative** — Design, Content Creation, UX/UI\n\n💡 **Infinite Gundawar\'s Career Services:**\n• Aptitude testing\n• Career counseling sessions\n• Industry expert talks\n• Internship placement\n• Skill development programs\n\n🎯 **Remember:** Choose a career based on your interest + aptitude + market demand. We help you find the perfect match!',
      'default': 'Hello! I\'m **EduBot AI**, your Coaching & Education expert. 📚\n\nI can help you with:\n• Competitive exam preparation\n• Skill development courses\n• Starting a coaching center\n• Career guidance for students\n• Online vs offline learning\n\nAsk me anything about education and coaching!'
    }
  },
  {
    id: 'marketing',
    name: 'MarketBot AI',
    icon: '📱',
    color: 'orange',
    gradient: 'from-orange-600 to-orange-800',
    description: 'Digital Marketing & Branding expert AI',
    expertise: ['SEO', 'Social Media', 'Brand Strategy', 'Content Marketing', 'PPC Advertising', 'Analytics'],
    suggestions: [
      'How to create a digital marketing strategy?',
      'SEO tips for small businesses',
      'Best social media platforms for business',
      'How to build a brand from scratch?',
      'What is PPC advertising?',
    ],
    responses: {
      'digital marketing strategy': '**How to Create a Digital Marketing Strategy:**\n\n📋 **Step-by-Step Framework:**\n\n1️⃣ **Define Your Goals**\n   • Brand awareness\n   • Lead generation\n   • Sales conversion\n   • Customer retention\n\n2️⃣ **Know Your Audience**\n   • Create buyer personas\n   • Identify pain points\n   • Map customer experience\n\n3️⃣ **Choose Channels**\n   • SEO (organic search)\n   • Social Media (Facebook, Instagram, LinkedIn)\n   • Email Marketing\n   • PPC (Google Ads, Meta Ads)\n   • Content Marketing (Blogs, Videos)\n\n4️⃣ **Content Strategy**\n   • 80% value content, 20% promotional\n   • Consistent posting schedule\n   • Multi-format (text, image, video)\n\n5️⃣ **Budget Allocation**\n   • SEO: 30%\n   • Social Media: 25%\n   • PPC: 25%\n   • Content: 20%\n\n6️⃣ **Measure & Optimize**\n   • Track KPIs weekly\n   • A/B test everything\n   • Monthly strategy review\n\n💡 **Infinite Gundawar\'s Digital Marketing Services:** We offer end-to-end digital marketing solutions including SEO, social media management, PPC campaigns, and brand strategy!',
      'seo tips': '**SEO Tips for Small Businesses:**\n\n🔍 **On-Page SEO:**\n1. **Keyword Research** — Use Google Keyword Planner, Ubersuggest\n2. **Title Tags** — Include primary keyword, keep under 60 chars\n3. **Meta Descriptions** — Compelling, 150-160 chars\n4. **Header Tags** — H1, H2, H3 with keywords\n5. **Image Optimization** — Alt text, compressed images\n6. **Internal Linking** — Link related pages\n\n🏗️ **Off-Page SEO:**\n7. **Google My Business** — Claim and optimize your listing\n8. **Local Citations** — List on Justdial, Sulekha, IndiaMART\n9. **Backlinks** — Guest posting, directory submissions\n10. **Social Signals** — Active social media presence\n\n⚡ **Technical SEO:**\n11. **Mobile-Friendly** — Responsive design\n12. **Page Speed** — Under 3 seconds load time\n13. **SSL Certificate** — HTTPS is mandatory\n14. **XML Sitemap** — Submit to Google Search Console\n\n📊 **Results Timeline:** 3-6 months for organic rankings\n💰 **Cost:** ₹5,000-50,000/month depending on competition\n\n💡 Infinite Gundawar\'s SEO experts can get your business to page 1 of Google!',
      'social media platforms': '**Best Social Media Platforms for Business:**\n\n📱 **Platform Guide:**\n\n1. **Facebook** — Best for B2C, local businesses\n   • 3.05 billion users worldwide\n   • Great for ads targeting\n   • Facebook Shops for e-commerce\n\n2. **Instagram** — Best for visual brands\n   • 2 billion users\n   • Reels for viral reach\n   • Shopping features\n\n3. **LinkedIn** — Best for B2B, professional services\n   • 1 billion users\n   • Thought leadership\n   • Lead generation\n\n4. **YouTube** — Best for long-form content\n   • 2.7 billion users\n   • Second largest search engine\n   • High conversion rates\n\n5. **Twitter/X** — Best for news, tech, real-time\n   • 500+ million users\n   • Great for brand personality\n\n6. **WhatsApp Business** — Best for direct communication\n   • 2+ billion users\n   • WhatsApp Catalog\n   • Broadcast lists\n\n💡 **Infinite Gundawar\'s Social Media Services:** We manage your entire social media presence — content creation, posting, engagement, and paid advertising!',
      'build a brand': '**How to Build a Brand from Scratch:**\n\n🏗️ **Brand Building Framework:**\n\n1️⃣ **Define Your Brand Identity**\n   • Mission & Vision\n   • Core values\n   • Unique selling proposition (USP)\n   • Target audience\n\n2️⃣ **Visual Identity**\n   • Logo design\n   • Color palette\n   • Typography\n   • Brand guidelines\n\n3️⃣ **Brand Voice**\n   • Tone of communication\n   • Language style\n   • Personality traits\n\n4️⃣ **Online Presence**\n   • Website (professional, mobile-friendly)\n   • Social media profiles\n   • Google My Business\n   • Industry directories\n\n5️⃣ **Content Strategy**\n   • Blog posts\n   • Social media content\n   • Video content\n   • Email newsletters\n\n6️⃣ **Brand Awareness**\n   • Paid advertising\n   • Influencer partnerships\n   • PR & media coverage\n   • Community building\n\n💰 **Brand Building Cost:** ₹1-10 lakh (initial)\n⏱️ **Timeline:** 6-12 months for strong brand recognition\n\n💡 **Infinite Gundawar\'s Branding Services:** From logo design to full brand strategy, we build brands that stand out and convert!',
      'ppc advertising': '**PPC Advertising Explained:**\n\n💰 **What is PPC?**\nPay-Per-Click (PPC) is a digital advertising model where you pay each time someone clicks on your ad. It\'s the fastest way to get traffic and leads.\n\n🎯 **Top PPC Platforms:**\n\n1. **Google Ads**\n   • Search ads (top of Google results)\n   • Display ads (banner ads on websites)\n   • YouTube ads\n   • Shopping ads\n   • Cost: ₹10-500 per click\n\n2. **Meta Ads (Facebook + Instagram)**\n   • Feed ads\n   • Story ads\n   • Reels ads\n   • Cost: ₹5-50 per click\n\n3. **LinkedIn Ads**\n   • Sponsored content\n   • InMail ads\n   • Cost: ₹50-200 per click (B2B)\n\n📊 **PPC Best Practices:**\n• Start with ₹5,000-10,000/month budget\n• Target specific keywords and audiences\n• A/B test ad copy and creatives\n• Track conversions with pixels\n• Optimize weekly based on data\n\n📈 **Expected Results:**\n• Website traffic: 2-5x increase\n• Leads: 50-200 per month\n• ROI: 200-500% with proper optimization\n\n💡 **Infinite Gundawar\'s PPC Services:** Our certified Google and Meta ads experts create, manage, and optimize PPC campaigns that deliver real ROI!',
      'default': 'Hello! I\'m **MarketBot AI**, your Digital Marketing & Branding expert. 📱\\n\\nI can help you with:\\n• Digital marketing strategy\\n• SEO for small businesses\\n• Social media marketing\\n• Brand building from scratch\\n• PPC advertising\\n\\nAsk me anything about digital marketing!'
    }
  },
  {
    id: 'finance',
    name: 'FinanceBot AI',
    icon: '💰',
    color: 'green',
    gradient: 'from-green-600 to-green-800',
    description: 'Finance, Tax & Investment expert AI',
    expertise: ['Tax Planning', 'Investment', 'Mutual Funds', 'Insurance', 'Retirement Planning', 'Budgeting'],
    suggestions: [
      'How to save tax in India 2025?',
      'Best mutual funds for beginners',
      'How to plan for retirement?',
      'What is the 50-30-20 budget rule?',
      'Should I invest in stocks or mutual funds?',
    ],
    responses: {
      'save tax': '**Tax Saving Tips for India 2025:**\\n\\n📋 **Section 80C (₹1.5 Lakh):**\\n• PPF (Public Provident Fund)\\n• ELSS Mutual Funds\\n• NSC (National Savings Certificate)\\n• 5-year FD\\n• Life Insurance Premium\\n• Home Loan Principal\\n• Sukanya Samriddhi Yojana\\n\\n📋 **Section 80D (Health Insurance):**\\n• Self + Family: ₹25,000\\n• Parents (senior citizens): ₹50,000\\n\\n📋 **Other Deductions:**\\n• Section 80E: Education loan interest (no limit)\\n• Section 80G: Donations\\n• Section 24: Home loan interest (₹2 lakh)\\n• HRA Exemption\\n• LTA (Leave Travel Allowance)\\n\\n💡 **Pro Tip:** Start tax planning in April, not March!',
      'mutual funds beginners': '**Best Mutual Funds for Beginners (2025):**\\n\\n📊 **Top Picks:**\\n\\n1. **Index Funds (Low Risk)**\\n   • UTI Nifty 50 Index Fund\\n   • HDFC Index Fund - Nifty 50\\n   • Expected return: 10-12% p.a.\\n\\n2. **Large Cap Funds (Moderate Risk)**\\n   • Mirae Asset Large Cap Fund\\n   • Axis Bluechip Fund\\n   • Expected return: 12-14% p.a.\\n\\n3. **Flexi Cap Funds (Moderate-High)**\\n   • Parag Parikh Flexi Cap\\n   • Quant Active Fund\\n   • Expected return: 14-18% p.a.\\n\\n4. **ELSS (Tax Saving)**\\n   • Mirae Asset Tax Saver\\n   • Axis Long Term Equity\\n   • Lock-in: 3 years\\n\\n💰 **Start with SIP:** ₹1,000-5,000/month\\n⏱️ **Hold for:** 5-7 years minimum',
      'retirement planning': '**Retirement Planning Guide:**\\n\\n🎯 **Steps to Plan Your Retirement:**\\n\\n1️⃣ **Set Your Retirement Age**\\n   • Target: 55-60 years\\n   • Calculate corpus needed\\n\\n2️⃣ **Estimate Monthly Expenses**\\n   • Current expenses × (1.07)^years until retirement\\n   • Example: ₹50,000/month today → ₹2.5 lakh/month in 25 years\\n\\n3️⃣ **Build Your Corpus:**\\n   • NPS (National Pension Scheme)\\n   • PPF (₹1.5 lakh/year)\\n   • Equity Mutual Funds (SIP)\\n   • Real Estate\\n   • Fixed Deposits\\n\\n4️⃣ **Rule of Thumb:**\\n   • Corpus = 25× annual expenses\\n   • For ₹10 lakh/year → ₹2.5 crore corpus\\n\\n5️⃣ **Start Early!**\\n   • Start at 25: ₹5,000/month → ₹2.2 crore at 60\\n   • Start at 35: ₹15,000/month → ₹2.2 crore at 60',
      'budget rule': '**The 50-30-20 Budget Rule:**\\n\\n💰 **How It Works:**\\n\\n📊 **50% — Needs (Essential Expenses)**\\n• Rent / EMI, Groceries, Utilities\\n• Insurance premiums, Transportation\\n\\n🎯 **30% — Wants (Lifestyle)**\\n• Dining out, Entertainment, Shopping\\n• Subscriptions, Travel, Hobbies\\n\\n💎 **20% — Savings & Investments**\\n• Emergency fund (3-6 months expenses)\\n• Mutual fund SIPs, PPF / NPS\\n• Extra debt payments\\n\\n📱 **Example (₹50,000/month income):**\\n• Needs: ₹25,000 | Wants: ₹15,000 | Savings: ₹10,000\\n\\n💡 **Pro Tip:** Automate your savings on salary day!',
      'stocks vs mutual funds': '**Stocks vs Mutual Funds:**\\n\\n📊 **Comparison:**\\n\\n| Factor | Stocks | Mutual Funds |\\n|--------|--------|-------------|\\n| Risk | High | Moderate |\\n| Return Potential | 15-30%+ | 12-18% |\\n| Knowledge Needed | High | Low |\\n| Time Required | High | Low |\\n| Diversification | Manual | Automatic |\\n\\n🎯 **Best for Beginners:**\\n1. Start with Mutual Funds (80% of portfolio)\\n2. Learn Stock Investing (20% of portfolio)\\n3. Gradually shift as you learn\\n\\n💡 Most people lose money in stocks because they don\'t research. Start with mutual funds!',
      'default': 'Hello! I\'m **FinanceBot AI**, your Finance, Tax & Investment expert. 💰\\n\\nI can help you with:\\n• Tax planning & saving\\n• Mutual fund investments\\n• Retirement planning\\n• Budgeting strategies\\n• Stock market guidance\\n\\nAsk me anything about finance and investments!'
    }
  },
  {
    id: 'health',
    name: 'HealthBot AI',
    icon: '🏥',
    color: 'red',
    gradient: 'from-red-600 to-red-800',
    description: 'Health, Wellness & Ayurveda expert AI',
    expertise: ['Ayurveda', 'Nutrition', 'Mental Health', 'Fitness', 'Common Diseases', 'Preventive Care'],
    suggestions: [
      'What is Ayurveda and how does it work?',
      'Best home remedies for common cold',
      'How to improve mental health naturally?',
      'What foods boost immunity?',
      'Ayurvedic tips for better sleep',
    ],
    responses: {
      'ayurveda': '**What is Ayurveda?**\\n\\n🌿 **The Science of Life:**\\n\\nAyurveda is a 5,000-year-old Indian system of medicine that focuses on balancing the body, mind, and spirit.\\n\\n🔬 **Three Doshas (Body Types):**\\n\\n1. **Vata** (Air + Space)\\n   • Thin build, creative, energetic\\n   • Imbalance: anxiety, dry skin, constipation\\n   • Balance with: warm foods, routine, oil massage\\n\\n2. **Pitta** (Fire + Water)\\n   • Medium build, intelligent, driven\\n   • Imbalance: anger, inflammation, acidity\\n   • Balance with: cooling foods, meditation, nature\\n\\n3. **Kapha** (Earth + Water)\\n   • Strong build, calm, loving\\n   • Imbalance: weight gain, lethargy, congestion\\n   • Balance with: exercise, light foods, spices\\n\\n💡 Visit our /ayurveda page for complete Ayurvedic treatments!',
      'home remedies cold': '**Best Home Remedies for Common Cold:**\\n\\n🍵 **Effective Remedies:**\\n\\n1. **Tulsi-Ginger Tea**\\n   • Boil 5 tulsi leaves + 1 inch ginger\\n   • Add honey and lemon, drink 3-4 times daily\\n\\n2. **Turmeric Milk (Haldi Doodh)**\\n   • 1 tsp turmeric in warm milk, drink before bed\\n\\n3. **Steam Inhalation**\\n   • Add eucalyptus oil to hot water, inhale 5-10 min\\n\\n4. **Honey + Ginger**\\n   • Mix 1 tsp honey with ginger juice, 3 times daily\\n\\n5. **Salt Water Gargle**\\n   • Warm water + salt, gargle 3-4 times daily\\n\\n⚠️ **See a doctor if:** Fever above 103°F, symptoms > 7 days, difficulty breathing',
      'mental health': '**How to Improve Mental Health Naturally:**\\n\\n🧠 **Natural Approaches:**\\n\\n1. **Meditation** (10-20 min daily) — Reduces stress and anxiety\\n2. **Exercise** (30 min daily) — Releases endorphins\\n3. **Sleep** (7-8 hours) — Fixed schedule, no screens before bed\\n4. **Nutrition** — Omega-3, Magnesium, Vitamin B complex\\n5. **Social Connection** — Spend time with loved ones\\n6. **Ayurvedic Herbs** — Ashwagandha, Brahmi, Jatamansi\\n\\n⚠️ **Seek professional help if:** Persistent sadness > 2 weeks, thoughts of self-harm, inability to function\\n\\n💡 Visit our Happiness Hub for mental health resources!',
      'immunity foods': '**Foods That Boost Immunity:**\\n\\n🛡️ **Top Immunity Boosters:**\\n\\n1. **Citrus Fruits** (Vitamin C) — Oranges, lemons, amla\\n2. **Turmeric** (Curcumin) — Anti-inflammatory, antioxidant\\n3. **Ginger & Garlic** — Antimicrobial properties\\n4. **Tulsi (Holy Basil)** — 5-6 leaves daily\\n5. **Amla** — Highest Vitamin C content\\n6. **Nuts & Seeds** — Almonds, walnuts, pumpkin seeds\\n7. **Yogurt/Probiotics** — Gut health = immunity\\n8. **Green Leafy Vegetables** — Spinach, moringa\\n\\n💡 Visit our /health page for complete nutrition guides!',
      'better sleep': '**Ayurvedic Tips for Better Sleep:**\\n\\n😴 **Natural Sleep Solutions:**\\n\\n1. **Ashwagandha** — 300-500mg before bed\\n2. **Warm Milk with Nutmeg** — 1 cup + pinch of nutmeg\\n3. **Abhyanga (Oil Massage)** — Warm sesame oil on feet/scalp\\n4. **Brahmi Tea** — Calms the mind\\n5. **Sleep Routine** — Fixed bedtime (10-10:30 PM)\\n6. **Pranayama** — Anulom Vilom, Bhramari\\n\\n💡 Our /ayurveda page has detailed sleep treatments!',
      'default': 'Hello! I\'m **HealthBot AI**, your Health, Wellness & Ayurveda expert. 🏥\\n\\nI can help you with:\\n• Ayurveda & natural remedies\\n• Nutrition & immunity\\n• Mental health & stress\\n• Fitness & wellness\\n• Common disease prevention\\n\\nAsk me anything about health and wellness!'
    }
  },
  {
    id: 'legal',
    name: 'LegalBot AI',
    icon: '⚖️',
    color: 'indigo',
    gradient: 'from-indigo-600 to-indigo-800',
    description: 'Legal Advice & Business Law expert AI',
    expertise: ['Business Law', 'Company Registration', 'Contracts', 'IP Rights', 'GST Law', 'Employment Law'],
    suggestions: [
      'How to register a company in India?',
      'What is GST and how to register?',
      'How to protect my business trademark?',
      'What contracts does my business need?',
      'Employment law basics for startups',
    ],
    responses: {
      'register a company': '**How to Register a Company in India:**\\n\\n📋 **Step-by-Step Process:**\\n\\n1️⃣ **Choose Company Type:**\\n   • Private Limited (most popular)\\n   • LLP, OPC, Proprietorship\\n\\n2️⃣ **Get DSC** (Digital Signature Certificate) — ₹1,000-2,000\\n3️⃣ **Get DIN** (Director Identification Number)\\n4️⃣ **Name Approval** — Run application on MCA\\n5️⃣ **File SPICe+ Form** — MOA, AOA, registered office\\n6️⃣ **PAN & TAN** — Auto-generated\\n7️⃣ **Certificate of Incorporation** — 3-7 working days\\n\\n💰 **Cost:** ₹5,000-15,000\\n⏱️ **Timeline:** 7-15 days\\n\\n💡 Infinite Gundawar can handle your entire company registration!',
      'gst register': '**GST Registration & Compliance:**\\n\\n📊 **What is GST?**\\nGoods and Services Tax — indirect tax on supply of goods and services.\\n\\n📋 **Who Must Register:**\\n• Annual turnover > ₹20 lakh (₹10 lakh for NE states)\\n• E-commerce sellers, Interstate suppliers\\n\\n🔄 **Registration Process:**\\n1. Visit gst.gov.in\\n2. Fill Form GST REG-01\\n3. Upload documents (PAN, Aadhaar, address proof)\\n4. Verify via OTP/Aadhaar\\n5. Receive GSTIN in 7-15 days\\n\\n📅 **Compliance:** GSTR-1, GSTR-3B, GSTR-9\\n\\n💡 Our LegalBot team handles GST registration and filing!',
      'trademark': '**How to Protect Your Business Trademark:**\\n\\n™️ **Trademark Protection Guide:**\\n\\n1️⃣ **Trademark Search** — Search on ipindia.gov.in\\n2️⃣ **File Application** — Form TM-A, ₹4,500-9,000\\n3️⃣ **Examination** — 3-6 months\\n4️⃣ **Publication** — 4-month opposition period\\n5️⃣ **Registration** — Valid for 10 years (renewable)\\n\\n📋 **What Can Be Trademarked:**\\nBrand name, Logo, Tagline, Sound mark, Shape\\n\\n💡 Infinite Gundawar\'s legal team handles trademark registration!',
      'contracts business': '**Essential Contracts for Your Business:**\\n\\n📄 **Must-Have Contracts:**\\n\\n1. **Founders Agreement** — Equity split, roles, vesting\\n2. **Employment Contracts** — Salary, non-compete, IP\\n3. **Vendor/Supplier Agreements** — Pricing, delivery, quality\\n4. **Customer/Client Agreements** — Scope, payment, liability\\n5. **NDA** — Confidentiality terms\\n6. **Terms of Service / Privacy Policy** — For websites/apps\\n\\n💡 Infinite Gundawar provides legal document drafting and review!',
      'employment law': '**Employment Law Basics for Startups:**\\n\\n👥 **Key Laws:**\\n\\n1. **Shops & Establishments Act** — Register within 30 days\\n2. **EPF** — Mandatory for 20+ employees (12%+12%)\\n3. **ESI** — Mandatory for 10+ employees\\n4. **Minimum Wages Act** — Varies by state\\n5. **Payment of Bonus Act** — 8.33% minimum\\n6. **Maternity Benefit Act** — 26 weeks paid leave\\n7. **Gratuity Act** — 5+ employees\\n\\n💡 Infinite Gundawar\'s legal team ensures full compliance!',
      'default': 'Hello! I\'m **LegalBot AI**, your Legal Advice & Business Law expert. ⚖️\\n\\nI can help you with:\\n• Company registration\\n• GST law & compliance\\n• Trademark & IP protection\\n• Business contracts\\n• Employment law\\n\\nAsk me anything about legal matters for your business!'
    }
  },
  {
    id: 'travel',
    name: 'TravelBot AI',
    icon: '✈️',
    color: 'cyan',
    gradient: 'from-cyan-600 to-cyan-800',
    description: 'Travel Planning & Tourism expert AI',
    expertise: ['Trip Planning', 'Budget Travel', 'International Travel', 'Hotels', 'Visa Guidance', 'Travel Insurance'],
    suggestions: [
      'Best places to visit in India on a budget',
      'How to get a tourist visa for USA/UK?',
      'Tips for solo travel in India',
      'Best time to visit Europe from India',
      'How to find cheap flights from India?',
    ],
    responses: {
      'budget india': '**Best Budget Travel Destinations in India:**\\n\\n🏔️ **Top Picks:**\\n\\n1. **Himachal Pradesh** (₹1,000-2,000/day) — Manali, Kasol, Bir Billing\\n2. **Rajasthan** (₹1,500-3,000/day) — Jaipur, Jodhpur, Udaipur\\n3. **Kerala** (₹1,500-2,500/day) — Munnar, Alleppey, Varkala\\n4. **Goa** (₹1,000-2,000/day) — Beaches, churches, nightlife\\n5. **Northeast India** (₹1,000-2,000/day) — Meghalaya, Assam, Sikkim\\n\\n💰 **Budget Tips:**\\n• Use trains (sleeper class)\\n• Stay in hostels/guesthouses\\n• Eat at local dhabas\\n• Travel off-season',
      'tourist visa': '**Tourist Visa Guide for USA/UK:**\\n\\n🇺🇸 **USA (B1/B2 Visa):**\\n1. Fill DS-160 form online\\n2. Pay fee: $185 (₹15,000)\\n3. Book appointment at VFS\\n4. Attend interview\\n5. Processing: 7-15 days\\n\\n📋 **Documents:** Passport, Bank statements, ITR, Employment letter, Travel itinerary\\n\\n🇬🇧 **UK (Standard Visitor Visa):**\\n1. Apply online at gov.uk\\n2. Pay fee: £100 (₹10,000)\\n3. Book VFS appointment\\n4. Processing: 3-6 weeks\\n\\n💡 Show strong ties to India (job, property, family) to improve approval!',
      'solo travel': '**Tips for Solo Travel in India:**\\n\\n🎒 **Safety & Planning:**\\n\\n1. **Safe Destinations:** Rishikesh, Hampi, Pondicherry, McLeodganj\\n2. **Accommodation:** Hostels, OYO (verified)\\n3. **Safety Tips:** Share live location, trust instincts\\n4. **Budget:** ₹1,000-2,000/day (budget)\\n5. **Must-Have Apps:** Google Maps, IRCTC, RedBus, Zomato\\n\\n💡 Solo travel is the best way to discover yourself!',
      'europe travel': '**Best Time to Visit Europe from India:**\\n\\n🗓️ **Season Guide:**\\n\\n🌸 **Spring (April-May)** — 15-25°C, Moderate crowds\\n☀️ **Summer (June-August)** — 25-35°C, Peak season\\n🍂 **Autumn (Sept-Oct)** — 10-20°C, Low crowds\\n❄️ **Winter (Nov-March)** — 0-10°C, Christmas markets\\n\\n💰 **Budget:** ₹1.5-3 lakh for 10 days (budget)\\n\\n💡 Best value: Shoulder season (April-May or Sept-Oct)!',
      'cheap flights': '**How to Find Cheap Flights from India:**\\n\\n✈️ **Money-Saving Tips:**\\n\\n1. **Book Early** — Domestic: 2-3 months, International: 3-6 months\\n2. **Use Comparison Sites** — Google Flights, Skyscanner, Kayak\\n3. **Be Flexible** — Mid-week flights, red-eyes\\n4. **Set Price Alerts** — Google Flights, Skyscanner\\n5. **Use Incognito Mode** — Airlines track searches\\n6. **Budget Airlines** — IndiGo, SpiceJet, AirAsia, FlyDubai\\n\\n💡 Book return flights separately — sometimes two one-ways are cheaper!',
      'default': 'Hello! I\'m **TravelBot AI**, your Travel Planning & Tourism expert. ✈️\\n\\nI can help you with:\\n• Trip planning & itineraries\\n• Budget travel tips\\n• Visa guidance\\n• Flight & hotel booking\\n• Travel insurance\\n\\nAsk me anything about travel!'
    }
  },
  {
    id: 'food',
    name: 'FoodBot AI',
    icon: '🍳',
    color: 'amber',
    gradient: 'from-amber-600 to-amber-800',
    description: 'Food, Recipes & Restaurant expert AI',
    expertise: ['Indian Recipes', 'Healthy Cooking', 'Restaurant Guide', 'Food Business', 'Nutrition', 'Street Food'],
    suggestions: [
      'Easy healthy Indian recipes for beginners',
      'How to start a food business in India?',
      'Best street food in India',
      'High-protein vegetarian Indian meals',
      'How to make restaurant-style biryani at home?',
    ],
    responses: {
      'healthy recipes': '**Easy Healthy Indian Recipes for Beginners:**\\n\\n🥗 **Top 5 Recipes:**\\n\\n1. **Moong Dal Chilla** — Protein-rich pancake\\n2. **Vegetable Oats Upma** — Fiber-rich, 15 min\\n3. **Palak Paneer** — Iron + Calcium\\n4. **Ragi Dosa** — Calcium-rich\\n5. **Sprouts Salad** — Protein + Vitamins\\n\\n💡 **Healthy Cooking Tips:**\\n• Use less oil (spray instead of pouring)\\n• Steam instead of fry\\n• Use whole grains, add more vegetables\\n\\n💡 Visit our /health page for complete nutrition guides!',
      'food business': '**How to Start a Food Business in India:**\\n\\n🍽️ **Step-by-Step Guide:**\\n\\n1️⃣ **Choose Model:** Cloud kitchen, Food truck, Restaurant, Tiffin service\\n\\n2️⃣ **Licenses Required:**\\n   • FSSAI License (mandatory)\\n   • GST Registration\\n   • Shop & Establishment License\\n   • Fire Safety NOC\\n\\n3️⃣ **FSSAI License Types:**\\n   • Basic: Turnover < ₹12 lakh (₹100/year)\\n   • State: ₹12 lakh - ₹20 crore\\n   • Central: > ₹20 crore\\n\\n4️⃣ **Setup Costs:**\\n   • Cloud kitchen: ₹2-5 lakh\\n   • Food truck: ₹5-15 lakh\\n   • Restaurant: ₹10-50 lakh\\n\\n💡 Infinite Gundawar helps food entrepreneurs with business planning!',
      'street food': '**Best Street Food in India:**\\n\\n🍢 **Must-Try by City:**\\n\\n📍 **Delhi:** Chole Bhature, Paranthe Wali Gali\\n📍 **Mumbai:** Vada Pav, Pav Bhaji, Bhel Puri\\n📍 **Kolkata:** Phuchka, Kathi Roll\\n📍 **Lucknow:** Tunday Kebab, Basket Chaat\\n📍 **Indore:** Poha-Jalebi, Daal Bafla\\n📍 **Ahmedabad:** Dhokla, Fafda-Jalebi\\n\\n⚠️ **Safety Tips:** Eat at busy stalls, avoid raw salads, drink bottled water',
      'protein vegetarian': '**High-Protein Vegetarian Indian Meals:**\\n\\n💪 **Protein-Rich Foods:**\\n\\n1. **Paneer** (18g/100g) — Paneer Bhurji, Palak Paneer\\n2. **Tofu** (15g/100g) — Tofu Tikka\\n3. **Dal/Lentils** (9g/100g) — Moong, Masoor, Chana\\n4. **Chickpeas** (19g/100g) — Chole, Chana Masala\\n5. **Sprouts** (9g/100g) — Mixed sprout salad\\n6. **Quinoa** (14g/100g) — Quinoa upma\\n\\n📊 **Sample Day (60g+ protein):**\\nBreakfast: Sprouts + 2 eggs\\nLunch: Dal + Paneer + Rice\\nSnack: Greek yogurt + nuts\\nDinner: Tofu curry + Roti\\n\\n💡 Combine grains + lentils for complete protein!',
      'biryani recipe': '**Restaurant-Style Biryani at Home:**\\n\\n🍚 **Hyderabadi Biryani Recipe:**\\n\\n📋 **Ingredients:**\\nBasmati rice 500g, Chicken/Mutton 500g, Onions 3 (fried), Yogurt 1 cup, Biryani masala 2 tbsp, Saffron pinch, Ghee 3 tbsp\\n\\n🔪 **Steps:**\\n1️⃣ **Marinate Meat:** Mix with yogurt, masala, fried onions. Marinate 2-4 hours.\\n2️⃣ **Parboil Rice:** Boil with whole spices, cook 70%. Drain.\\n3️⃣ **Layer (Dum):** Meat → Rice → Saffron milk → Fried onions → Ghee. Repeat.\\n4️⃣ **Dum Cooking:** Seal pot, high flame 5 min, lowest flame 25-30 min.\\n5️⃣ **Serve:** Gently mix, serve with raita.\\n\\n💡 The dum (steam) is what makes biryani special!',
      'default': 'Hello! I\'m **FoodBot AI**, your Food, Recipes & Restaurant expert. 🍳\\n\\nI can help you with:\\n• Indian recipes & cooking\\n• Healthy meal planning\\n• Food business guidance\\n• Restaurant recommendations\\n• Street food guide\\n\\nAsk me anything about food and cooking!'
    }
  },
]
export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeBot, setActiveBot] = useState<BotConfig>(bots[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg: Message = {
        id: Date.now(),
        role: 'bot',
        text: activeBot.responses['default'] || `Hello! I'm ${activeBot.name}. How can I help you today?`,
        timestamp: new Date()
      }
      setMessages([welcomeMsg])
    }
  }, [isOpen, activeBot, messages.length])

  const switchBot = (bot: BotConfig) => {
    setActiveBot(bot)
    setShowSuggestions(true)
    const welcomeMsg: Message = {
      id: Date.now(),
      role: 'bot',
      text: bot.responses['default'] || `Hello! I'm ${bot.name}. How can I help you?`,
      timestamp: new Date()
    }
    setMessages([welcomeMsg])
  }

  const getBotResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase().trim()
    const responses = activeBot.responses

    // Check for keyword matches
    for (const [key, response] of Object.entries(responses)) {
      if (key === 'default') continue
      const keywords = key.split(' ')
      if (keywords.every(kw => lower.includes(kw))) {
        return response
      }
    }

    // Partial matching
    for (const [key, response] of Object.entries(responses)) {
      if (key === 'default') continue
      const keywords = key.split(' ')
      const matchCount = keywords.filter(kw => lower.includes(kw)).length
      if (matchCount >= Math.ceil(keywords.length * 0.5)) {
        return response
      }
    }

    // Fuzzy matching for common terms
    if (lower.includes('price') || lower.includes('cost') || lower.includes('fee')) {
      return `Great question about pricing! ${activeBot.name} can help you understand the costs involved in ${activeBot.expertise[0]}.\n\nFor detailed pricing, I'd recommend connecting with our team at Infinite Gundawar. We offer competitive rates and customized solutions.\n\n📞 Call: +91 79721 40672\n📧 Email: talenthebhai123@gmail.com`
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return `Hello! 👋 Welcome to ${activeBot.name}!\n\nI'm your AI assistant for ${activeBot.description.toLowerCase()}.\n\nHere's what I can help you with:\n${activeBot.expertise.map(e => `• ${e}`).join('\n')}\n\nFeel free to ask me anything!`
    }
    if (lower.includes('thank')) {
      return `You're welcome! 😊 Glad I could help!\n\nIf you have more questions about ${activeBot.expertise[0]}, feel free to ask. You can also:\n\n📞 Call us: +91 79721 40672\n📧 Email: talenthebhai123@gmail.com\n🌐 Visit: Infinite Gundawar Business Private Limited`
    }

    return `That's an interesting question! While I may not have a specific answer for that, here's what I can tell you about ${activeBot.expertise[0]}:\n\n${activeBot.expertise.map(e => `• ${e}`).join('\n')}\n\nFor more specific information, I'd recommend:\n1. Asking one of my suggested questions below\n2. Contacting our experts at Infinite Gundawar\n\n📞 +91 79721 40672 | 📧 talenthebhai123@gmail.com`
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowSuggestions(false)
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getBotResponse(text)
      const botMsg: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 1200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full gradient-accent shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <svg className="w-7 h-7 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-white" />
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with AI Experts 🤖
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${activeBot.gradient} p-4 text-white`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">
                  {activeBot.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{activeBot.name}</h3>
                  <p className="text-xs text-white/70">{activeBot.description}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Bot Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {bots.map(bot => (
                <button
                  key={bot.id}
                  onClick={() => switchBot(bot)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeBot.id === bot.id ? 'bg-white/30 backdrop-blur-sm' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <span>{bot.icon}</span>
                  <span>{bot.name.replace(' AI', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-1'}`}>
                  {msg.role === 'bot' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs">{activeBot.icon}</span>
                      <span className="text-xs font-medium text-gray-500">{activeBot.name}</span>
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-[#1e3a5f] text-white rounded-br-md' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md shadow-sm'}`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && messages.length <= 2 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium">💡 Suggested questions:</p>
                {activeBot.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s)}
                    className="w-full text-left px-4 py-2.5 bg-white rounded-xl border border-gray-100 text-sm text-gray-600 hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Ask ${activeBot.name.replace(' AI', '')} anything...`}
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 border border-gray-100 focus:border-[#1e3a5f]/30 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center text-[#1e3a5f] disabled:opacity-40 hover:shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Powered by Infinite Gundawar AI • Responses are AI-generated
            </p>
          </form>
        </div>
      )}
    </>
  )
}
