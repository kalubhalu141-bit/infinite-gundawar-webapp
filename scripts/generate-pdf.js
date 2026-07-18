const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const outputPath = path.join(__dirname, '..', 'public', 'downloads', 'business-starter-kit.pdf')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })

const doc = new PDFDocument({ margin: 50 })
doc.pipe(fs.createWriteStream(outputPath))

// Colors
const primary = '#4F46E5'
const dark = '#1E293B'
const gray = '#64748B'
const light = '#F1F5F9'
const accent = '#F59E0B'

// ─── Cover Page ───
doc.rect(0, 0, 612, 792).fill(primary)
doc.fillColor('white').fontSize(14).font('Helvetica-Bold').text('INFINITE GUNDAWAR', 50, 60)
doc.moveDown(1)
doc.fontSize(42).font('Helvetica-Bold').text('Business', 50, 140)
doc.text('Starter Kit', 50, 190)
doc.moveDown(0.5)
doc.fontSize(16).font('Helvetica').text('Everything you need to launch and', 50, 260)
doc.text('grow your business in India', 50, 282)
doc.moveDown(2)
doc.fontSize(12).text('2025 Edition', 50, 340)
doc.text('Free Download', 50, 358)

// ─── Page 2: Table of Contents ───
doc.addPage()
doc.fillColor(primary).fontSize(28).font('Helvetica-Bold').text('Table of Contents', 50, 50)
doc.moveDown(1)
doc.fillColor(dark).fontSize(13).font('Helvetica')

const toc = [
  '1. Business Registration Checklist',
  '2. Financial Planning Templates',
  '3. Marketing Plan Framework',
  '4. Legal Compliance Guide for India',
  '5. Cold Email Templates (50+ Templates)',
  '6. Sales Pitch Deck Outline',
  '7. Social Media Content Calendar',
  '8. Vendor & Client Agreement Templates',
  '9. GST & Tax Planning Guide',
  '10. Hiring & HR Checklist',
]

toc.forEach((item, i) => {
  doc.text(item, 70, 120 + i * 30)
  doc.fillColor(gray).text(`Page ${i + 3}`, 430, 120 + i * 30)
  doc.fillColor(dark)
})

// ─── Page 3: Business Registration Checklist ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('1. Business Registration Checklist', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('Step-by-step guide to register your business in India')
doc.moveDown(1)

const regSteps = [
  { step: 'Choose Business Structure', desc: 'Decide between Sole Proprietorship, Partnership, LLP, One Person Company (OPC), or Private Limited Company. Each has different compliance requirements, liability protection, and tax implications.' },
  { step: 'Obtain Digital Signature Certificate (DSC)', desc: 'Required for all directors/partners. Apply through authorized agencies like eMudhra, Sify, or nCode. Cost: ₹1,000-2,000 per person. Processing time: 1-3 days.' },
  { step: 'Apply for Director Identification Number (DIN)', desc: 'Required for directors of Pvt Ltd and OPC. File Form DIR-3 on MCA portal. Cost: ₹500 per DIN.' },
  { step: 'Reserve Company Name (RUN)', desc: 'File Reserve Unique Name application on MCA portal. Provide 2 alternative names. Cost: ₹1,000 per application.' },
  { step: 'Draft Memorandum & Articles of Association', desc: 'MOA defines company objectives. AOA defines internal rules. Get these drafted by a CA or CS for best results.' },
  { step: 'File SPICe+ Form (INC-32)', desc: 'Integrated form for incorporation, DIN allotment, PAN, TAN, EPFO, ESIC, and GSTIN. Filed on MCA portal.' },
  { step: 'Obtain Certificate of Incorporation', desc: 'Once approved, you receive COI with CIN number. This is your company\'s birth certificate.' },
  { step: 'Open Bank Account', desc: 'Use COI, MOA, AOA, and board resolution to open a current account in your company name.' },
  { step: 'Register for GST', desc: 'Mandatory if turnover exceeds ₹20 lakh (₹10 lakh for special category states). Voluntary registration recommended for B2B businesses.' },
  { step: 'Register for MSME/Udyam', desc: 'Free registration on udyamregistration.gov.in. Provides access to government schemes, priority lending, and tax benefits.' },
  { step: 'Shop & Establishment License', desc: 'Required for all businesses with physical premises. Apply to local municipal authority.' },
  { step: 'Professional Tax Registration', desc: 'Required in most states. Register with state commercial tax department.' },
]

regSteps.forEach((item, i) => {
  if (doc.y > 700) doc.addPage()
  doc.fillColor(primary).fontSize(12).font('Helvetica-Bold').text(`${i + 1}. ${item.step}`, 50, doc.y + 10)
  doc.fillColor(dark).fontSize(10).font('Helvetica').text(item.desc, 50, doc.y + 5, { width: 512, align: 'justify' })
  doc.moveDown(0.5)
  doc.fillColor('#22C55E').fontSize(10).text('☐ Not Started    ☐ In Progress    ☐ Completed', 50, doc.y)
  doc.moveDown(1)
})

// ─── Page 4: Financial Planning Templates ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('2. Financial Planning Templates', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('Key financial documents every business needs')
doc.moveDown(1)

doc.fillColor(dark).fontSize(13).font('Helvetica-Bold').text('Cash Flow Statement Template')
doc.moveDown(0.5)
doc.fontSize(10).font('Helvetica').text('Track money coming in and going out of your business. Update weekly for best results.')
doc.moveDown(0.5)

// Table header
const tableY = doc.y
doc.rect(50, tableY, 512, 22).fill(light)
doc.fillColor(dark).fontSize(9).font('Helvetica-Bold')
doc.text('Item', 55, tableY + 6)
doc.text('Month 1', 200, tableY + 6)
doc.text('Month 2', 290, tableY + 6)
doc.text('Month 3', 380, tableY + 6)
doc.text('Total', 470, tableY + 6)

const cashItems = [
  'Opening Balance',
  'Sales Revenue',
  'Other Income',
  'Total Inflows',
  '',
  'Raw Materials',
  'Employee Salaries',
  'Rent & Utilities',
  'Marketing & Ads',
  'Transportation',
  'Insurance',
  'Loan EMI',
  'Other Expenses',
  'Total Outflows',
  '',
  'Net Cash Flow',
  'Closing Balance',
]

cashItems.forEach((item, i) => {
  const y = tableY + 22 + i * 18
  if (y > 750) { doc.addPage(); return }
  if (item === '') { return }
  doc.fillColor(dark).fontSize(9).font('Helvetica').text(item, 55, y + 3)
  doc.rect(195, y, 80, 16).stroke('#CBD5E1')
  doc.rect(285, y, 80, 16).stroke('#CBD5E1')
  doc.rect(375, y, 80, 16).stroke('#CBD5E1')
  doc.rect(465, y, 80, 16).stroke('#CBD5E1')
})

doc.moveDown(2)
doc.fillColor(primary).fontSize(13).font('Helvetica-Bold').text('Break-Even Analysis')
doc.moveDown(0.5)
doc.fillColor(dark).fontSize(10).font('Helvetica').text('Break-Even Point (units) = Fixed Costs ÷ (Selling Price per Unit - Variable Cost per Unit)')
doc.moveDown(0.5)
doc.text('Example: If your fixed costs are ₹5,00,000/month, selling price is ₹500/unit, and variable cost is ₹300/unit:')
doc.text('Break-Even = 5,00,000 ÷ (500 - 300) = 2,500 units/month')
doc.moveDown(1)
doc.text('Use this to set realistic sales targets and pricing strategies.')

// ─── Page 5: Marketing Plan Framework ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('3. Marketing Plan Framework', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('A complete marketing strategy template for Indian businesses')
doc.moveDown(1)

const marketingSections = [
  { title: '1. Executive Summary', content: 'Write a 2-3 sentence overview of your marketing goals for the next 12 months. Example: "We aim to acquire 500 new customers in the Mumbai region through digital marketing and partnerships, with a budget of ₹5 lakh."' },
  { title: '2. Target Audience', content: 'Define your ideal customer:\n• Demographics: Age, gender, income, location\n• Psychographics: Interests, values, lifestyle\n• Pain points: What problems do they face?\n• Where do they spend time online? (Instagram, LinkedIn, YouTube, etc.)' },
  { title: '3. Unique Value Proposition', content: 'What makes you different? Write one clear sentence. Example: "We provide same-day interior design consultation at 40% lower cost than traditional firms."' },
  { title: '4. Marketing Channels', content: 'Choose 2-3 primary channels:\n• SEO & Content Marketing (long-term)\n• Google Ads (immediate results)\n• Instagram/Facebook Ads (B2C)\n• LinkedIn (B2B)\n• WhatsApp Marketing (India-specific)\n• Local partnerships & referrals' },
  { title: '5. Budget Allocation', content: 'Recommended split for ₹1 lakh/month:\n• Digital Ads: 40% (₹40,000)\n• Content Creation: 20% (₹20,000)\n• Tools & Software: 15% (₹15,000)\n• Events/Offline: 15% (₹15,000)\n• Contingency: 10% (₹10,000)' },
  { title: '6. KPIs & Metrics', content: 'Track these monthly:\n• Website visitors & conversion rate\n• Cost per lead (CPL)\n• Customer acquisition cost (CAC)\n• Return on ad spend (ROAS)\n• Social media engagement rate\n• Email open & click rates' },
  { title: '7. 90-Day Action Plan', content: 'Month 1: Setup (website, social profiles, Google My Business)\nMonth 2: Launch (start ads, publish content, begin outreach)\nMonth 3: Optimize (analyze data, double down on what works, cut what doesn\'t)' },
]

marketingSections.forEach((section) => {
  if (doc.y > 680) doc.addPage()
  doc.fillColor(primary).fontSize(12).font('Helvetica-Bold').text(section.title, 50, doc.y + 10)
  doc.fillColor(dark).fontSize(10).font('Helvetica').text(section.content, 50, doc.y + 5, { width: 512, align: 'justify' })
  doc.moveDown(1)
})

// ─── Page 6: Legal Compliance Guide ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('4. Legal Compliance Guide for India', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('Mandatory registrations and compliances for Indian businesses')
doc.moveDown(1)

const complianceItems = [
  { name: 'GST Registration', mandatory: 'Mandatory if turnover > ₹20L (₹10L for special states)', frequency: 'One-time + monthly/quarterly returns', penalty: '₹10,000 or 10% of tax due' },
  { name: 'MSME/Udyam Registration', mandatory: 'Optional but highly recommended', frequency: 'One-time', penalty: 'N/A — provides benefits' },
  { name: 'Shop & Establishment Act', mandatory: 'Mandatory for all businesses with premises', frequency: 'One-time + renewal', penalty: '₹10,000 - ₹1,00,000' },
  { name: 'Professional Tax', mandatory: 'Mandatory in most states', frequency: 'Monthly', penalty: 'Varies by state' },
  { name: 'Income Tax Returns', mandatory: 'Mandatory for all businesses', frequency: 'Annual (31st July/31st Oct)', penalty: '₹5,000 - ₹10,000' },
  { name: 'TDS Returns', mandatory: 'If making specified payments', frequency: 'Quarterly', penalty: '₹200/day of delay' },
  { name: 'EPF Registration', mandatory: 'Mandatory if >20 employees', frequency: 'Monthly', penalty: '5% per month of delay' },
  { name: 'ESI Registration', mandatory: 'Mandatory if >10 employees (wage <₹21,000)', frequency: 'Monthly', penalty: 'Interest + damages' },
  { name: 'FSSAI License', mandatory: 'Mandatory for food businesses', frequency: 'One-time + renewal', penalty: 'Up to ₹5,00,000' },
  { name: 'Trade License', mandatory: 'Mandatory in most cities', frequency: 'Annual renewal', penalty: 'Varies by municipality' },
]

doc.fillColor(light).fontSize(9).font('Helvetica-Bold')
doc.text('Requirement', 55, doc.y)
doc.text('Frequency', 250, doc.y - 12)
doc.text('Penalty', 400, doc.y - 12)
doc.moveDown(0.5)

complianceItems.forEach((item, i) => {
  if (doc.y > 730) doc.addPage()
  const bg = i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
  doc.rect(50, doc.y - 3, 512, 36).fill(bg)
  doc.fillColor(dark).fontSize(9).font('Helvetica-Bold').text(item.name, 55, doc.y)
  doc.font('Helvetica').fontSize(8).fillColor(gray)
  doc.text(item.mandatory, 55, doc.y + 2, { width: 190 })
  doc.text(item.frequency, 250, doc.y - 14, { width: 140 })
  doc.text(item.penalty, 400, doc.y - 14, { width: 160 })
  doc.moveDown(1.5)
})

// ─── Page 7-8: Email Templates ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('5. Cold Email Templates', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('Copy, customize, and send. These templates have been tested across industries.')
doc.moveDown(1)

const emailTemplates = [
  {
    title: 'Template 1: Introduction Email',
    subject: 'Quick question about [Company Name]',
    body: `Hi [First Name],

I noticed [specific observation about their business — e.g., "your recent expansion into the Pune market"].

I work with [type of companies] to help them [specific benefit — e.g., "reduce operational costs by 20-30% through automation"].

Would you be open to a quick 15-minute call this week to see if this could work for [Company Name]?

Best regards,
[Your Name]
[Your Company]
[Phone Number]`
  },
  {
    title: 'Template 2: Follow-Up Email',
    subject: 'Re: Quick question about [Company Name]',
    body: `Hi [First Name],

Just following up on my previous email. I understand you're busy.

To make this easy, here's a one-page overview of how we helped [similar company] achieve [specific result].

Would Tuesday or Thursday work for a quick call?

Best,
[Your Name]`
  },
  {
    title: 'Template 3: Value-First Email',
    subject: 'An idea for [Company Name]',
    body: `Hi [First Name],

I was researching [industry/company] and had an idea that could help [Company Name]:

[Specific, actionable idea — e.g., "Adding a WhatsApp chatbot to your website could capture 3x more leads based on what we've seen in the interior design space"]

I put together a quick 2-minute Loom video explaining: [link]

No pitch — just thought it might be useful.

Cheers,
[Your Name]`
  },
  {
    title: 'Template 4: Referral Email',
    subject: '[Mutual Connection] suggested I reach out',
    body: `Hi [First Name],

[Mutual Connection's Name] suggested I reach out to you regarding [topic].

We help [type of businesses] with [service], and [Mutual Connection] thought this might be relevant for [Company Name] because [reason].

Would you have 15 minutes this week for a quick chat?

Best regards,
[Your Name]`
  },
  {
    title: 'Template 5: Post-Meeting Follow-Up',
    subject: 'Great speaking with you, [First Name]',
    body: `Hi [First Name],

Thank you for taking the time to speak with me today. I really enjoyed learning about [something specific they mentioned].

As discussed, here's a summary of next steps:
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

I'll follow up on [date] to check on progress.

Looking forward to working together!

Best,
[Your Name]`
  },
]

emailTemplates.forEach((template, i) => {
  if (doc.y > 600) doc.addPage()
  doc.fillColor(primary).fontSize(12).font('Helvetica-Bold').text(template.title, 50, doc.y + 10)
  doc.fillColor(accent).fontSize(10).font('Helvetica-Bold').text(`Subject: ${template.subject}`, 50, doc.y + 5)
  doc.fillColor(dark).fontSize(9).font('Helvetica').text(template.body, 50, doc.y + 8, { width: 512, align: 'left' })
  doc.moveDown(1)
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke('#E2E8F0')
  doc.moveDown(1)
})

// ─── Page 9: Pitch Deck Outline ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('6. Sales Pitch Deck Outline', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('15-slide structure that works for investors and clients')
doc.moveDown(1)

const slides = [
  { slide: 'Slide 1: Title', content: 'Company name, tagline, your name and contact info. Keep it clean and professional.' },
  { slide: 'Slide 2: Problem', content: 'What pain point are you solving? Use data. "Indian SMEs lose ₹2 lakh/year on average to inefficient processes."' },
  { slide: 'Slide 3: Solution', content: 'Your product/service. How does it solve the problem? Keep it simple — one clear message.' },
  { slide: 'Slide 4: Market Size', content: 'TAM, SAM, SOM. "India\'s interior design market is ₹25,000 crore and growing at 12% annually."' },
  { slide: 'Slide 5: Product Demo', content: 'Screenshots, video, or live demo. Show, don\'t tell.' },
  { slide: 'Slide 6: Business Model', content: 'How do you make money? Subscription, one-time, commission? Show unit economics.' },
  { slide: 'Slide 7: Traction', content: 'Key metrics: revenue, users, growth rate, partnerships. "500 customers, 150% YoY growth."' },
  { slide: 'Slide 8: Competitive Landscape', content: '2x2 matrix showing your positioning. Be honest about competitors.' },
  { slide: 'Slide 9: Go-to-Market Strategy', content: 'How will you acquire customers? Channels, partnerships, pricing.' },
  { slide: 'Slide 10: Team', content: 'Key team members with relevant experience. Highlight domain expertise.' },
  { slide: 'Slide 11: Financial Projections', content: '3-year revenue forecast. Be realistic. Show assumptions.' },
  { slide: 'Slide 12: The Ask', content: 'How much funding do you need? What will you use it for? "Raising ₹50 lakh for marketing and team expansion."' },
  { slide: 'Slide 13: Use of Funds', content: 'Pie chart: 40% marketing, 30% product, 20% team, 10% operations.' },
  { slide: 'Slide 14: Milestones', content: 'Past achievements and future goals. "Q1: Launch in 3 cities. Q2: 1000 customers."' },
  { slide: 'Slide 15: Contact', content: 'End with clear contact info. Make it easy for them to reach you.' },
]

slides.forEach((s, i) => {
  if (doc.y > 700) doc.addPage()
  doc.fillColor(primary).fontSize(11).font('Helvetica-Bold').text(s.slide, 50, doc.y + 8)
  doc.fillColor(dark).fontSize(9).font('Helvetica').text(s.content, 50, doc.y + 3, { width: 512, align: 'justify' })
  doc.moveDown(0.8)
})

// ─── Page 10: Social Media Calendar ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('7. Social Media Content Calendar', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('30-day content plan for Instagram, LinkedIn, and Facebook')
doc.moveDown(1)

const contentCalendar = [
  { day: 'Week 1', mon: 'Monday: Industry tip/stat', tue: 'Tuesday: Behind-the-scenes', wed: 'Wednesday: Customer testimonial', thu: 'Thursday: How-to carousel', fri: 'Friday: Product showcase', sat: 'Saturday: Motivational quote', sun: 'Sunday: Poll/Question' },
  { day: 'Week 2', mon: 'Monday: Trend analysis', tue: 'Tuesday: Team introduction', wed: 'Wednesday: Case study', thu: 'Thursday: Infographic', fri: 'Friday: Offer/Promotion', sat: 'Saturday: User-generated content', sun: 'Sunday: Week recap' },
  { day: 'Week 3', mon: 'Monday: Expert interview', tue: 'Tuesday: Before/After', wed: 'Wednesday: FAQ post', thu: 'Thursday: Tutorial video', fri: 'Friday: Partnership announcement', sat: 'Saturday: Fun/Meme', sun: 'Sunday: Community spotlight' },
  { day: 'Week 4', mon: 'Monday: Monthly recap', tue: 'Tuesday: New product/service', wed: 'Wednesday: Customer success story', thu: 'Thursday: Industry news commentary', fri: 'Friday: Weekend offer', sat: 'Saturday: Live Q&A', sun: 'Sunday: Next month preview' },
]

doc.fillColor(light).fontSize(9).font('Helvetica-Bold')
const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
days.forEach((d, i) => doc.text(d, 55 + i * 65, doc.y, { width: 60 }))
doc.moveDown(0.5)

contentCalendar.forEach((week, wi) => {
  if (doc.y > 720) doc.addPage()
  const items = [week.mon, week.tue, week.wed, week.thu, week.fri, week.sat, week.sun]
  doc.fillColor(primary).fontSize(9).font('Helvetica-Bold').text(week.day, 55, doc.y + 5)
  doc.moveDown(0.3)
  items.forEach((item, i) => {
    const text = item.replace(/^[A-Z][a-z]+: /, '')
    doc.fillColor(dark).fontSize(7.5).font('Helvetica').text(text, 120 + i * 65, doc.y, { width: 58 })
  })
  doc.moveDown(2)
})

// ─── Page 11: Agreement Templates ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('8. Agreement Templates', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('Basic contract templates — customize for your business')
doc.moveDown(1)

doc.fillColor(primary).fontSize(13).font('Helvetica-Bold').text('Service Agreement Template')
doc.moveDown(0.5)
doc.fillColor(dark).fontSize(9).font('Helvetica').text(`SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on [DATE] between:

SERVICE PROVIDER:
Name: [Your Company Name]
Address: [Your Address]
GSTIN: [Your GST Number]

CLIENT:
Name: [Client Company Name]
Address: [Client Address]
GSTIN: [Client GST Number]

1. SCOPE OF SERVICES
The Service Provider agrees to provide the following services: [Describe services in detail]

2. PAYMENT TERMS
Total Value: ₹[Amount]
Payment Schedule: [e.g., 50% advance, 50% on completion]
Payment Method: [Bank transfer / UPI / Cheque]
Late Payment: Interest at 18% per annum on overdue amounts

3. TIMELINE
Start Date: [Date]
Completion Date: [Date]
Milestones: [List key milestones]

4. CONFIDENTIALITY
Both parties agree to keep all business information confidential.

5. TERMINATION
Either party may terminate with 30 days written notice.

6. GOVERNING LAW
This Agreement shall be governed by the laws of India.

Signed:
_________________    _________________
Service Provider      Client
Date: ___________    Date: ___________`)

doc.moveDown(1)
doc.fillColor(primary).fontSize(13).font('Helvetica-Bold').text('NDA Template')
doc.moveDown(0.5)
doc.fillColor(dark).fontSize(9).font('Helvetica').text(`NON-DISCLOSURE AGREEMENT

This NDA is entered into on [DATE] between [Your Company] and [Recipient Company].

1. CONFIDENTIAL INFORMATION
Includes all business, technical, financial, and strategic information shared.

2. OBLIGATIONS
Recipient shall not disclose, copy, or use confidential information for any purpose other than [purpose].

3. DURATION
This agreement remains in effect for [2-5] years from the date of signing.

4. EXCEPTIONS
Information that is publicly available or independently developed.

5. REMEDIES
Breach may result in injunctive relief and damages.

Signed:
_________________    _________________
Disclosing Party      Receiving Party`)

// ─── Page 12: GST & Tax Guide ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('9. GST & Tax Planning Guide', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('Essential tax information for Indian businesses')
doc.moveDown(1)

const taxSections = [
  { title: 'GST Slabs in India', content: '• 0%: Essential items (fresh food, milk, education)\n• 5%: Mass consumption items (tea, spices, rail transport)\n• 12%: Processed food, business class air travel\n• 18%: Standard rate (most goods and services)\n• 28%: Luxury items (cars, AC, cement) + cess' },
  { title: 'GST Return Filing Schedule', content: '• GSTR-1: Outward supplies — 11th of next month\n• GSTR-3B: Summary return — 20th of next month\n• GSTR-9: Annual return — 31st December\n• GSTR-9C: Reconciliation — 31st December (if turnover > ₹5 crore)' },
  { title: 'Income Tax for Businesses', content: '• Sole Proprietorship: Individual slab rates (up to 30%)\n• Partnership/LLP: 30% flat + surcharge\n• Pvt Ltd/OPC: 25% (if turnover < ₹400 crore) or 30%\n• Section 80C deductions: Up to ₹1.5 lakh\n• Presumptive taxation (Section 44AD): For businesses with turnover < ₹2 crore' },
  { title: 'TDS Requirements', content: '• Salary: As per income tax slab\n• Professional fees: 10%\n• Rent: 10% (individual/HUF), 2% (others)\n• Contractor: 1% (individual/HUF), 2% (others)\n• Returns: Quarterly (15th of next month)' },
  { title: 'Tax Saving Tips', content: '• Claim all business expenses (travel, office, equipment)\n• Depreciation on assets (15-40% depending on asset type)\n• Section 80D: Health insurance premium (up to ₹25,000)\n• Section 80G: Donations to approved charities\n• HRA exemption if paying rent\n• Home office deduction' },
]

taxSections.forEach((section) => {
  if (doc.y > 680) doc.addPage()
  doc.fillColor(primary).fontSize(12).font('Helvetica-Bold').text(section.title, 50, doc.y + 10)
  doc.fillColor(dark).fontSize(10).font('Helvetica').text(section.content, 50, doc.y + 5, { width: 512, align: 'justify' })
  doc.moveDown(1)
})

// ─── Page 13: Hiring & HR Checklist ───
doc.addPage()
doc.fillColor(primary).fontSize(24).font('Helvetica-Bold').text('10. Hiring & HR Checklist', 50, 50)
doc.moveDown(0.5)
doc.fillColor(gray).fontSize(11).font('Helvetica').text('Complete guide to hiring your first employees in India')
doc.moveDown(1)

const hrSteps = [
  '☐ Draft a clear job description with role, responsibilities, and salary range',
  '☐ Post on job portals (Naukri, LinkedIn, Indeed, Foundit)',
  '☐ Screen resumes and shortlist candidates',
  '☐ Conduct phone screening (15-20 minutes)',
  '☐ Schedule in-person or video interviews',
  '☐ Check references from previous employers',
  '☐ Send offer letter with clear terms',
  '☐ Collect documents: PAN, Aadhaar, bank details, previous employment proof',
  '☐ Create employment contract with probation period (3-6 months)',
  '☐ Register with EPF (if >20 employees) — UAN generation',
  '☐ Register with ESI (if applicable)',
  '☐ Set up payroll system (Zoho Payroll, GreytHR, or Keka)',
  '☐ Issue appointment letter and employee handbook',
  '☐ Conduct orientation and training',
  '☐ Set up attendance tracking (biometric or app-based)',
  '☐ Define leave policy (casual, sick, earned/privilege leave)',
  '☐ Set performance review schedule (quarterly recommended)',
  '☐ Ensure compliance with Minimum Wages Act',
  '☐ Display required labor law notices at workplace',
  '☐ File annual returns under various labor laws',
]

hrSteps.forEach((step, i) => {
  if (doc.y > 730) doc.addPage()
  doc.fillColor(dark).fontSize(10).font('Helvetica').text(step, 60, doc.y + 8, { width: 500 })
  doc.moveDown(0.3)
})

// ─── Back Cover ───
doc.addPage()
doc.rect(0, 0, 612, 792).fill(primary)
doc.fillColor('white').fontSize(14).font('Helvetica-Bold').text('INFINITE GUNDAWAR', 50, 200)
doc.moveDown(1)
doc.fontSize(28).font('Helvetica-Bold').text('Need Help?', 50, 260)
doc.moveDown(0.5)
doc.fontSize(14).font('Helvetica').text('We\'re here to support your business journey.', 50, 310)
doc.moveDown(1)
doc.fontSize(12).text('📧 talenthebhai123@gmail.com', 50, 360)
doc.text('📱 +91 79721 40672', 50, 385)
doc.text('🌐 infinite-gundawar-webapp.vercel.app', 50, 410)
doc.moveDown(2)
doc.fontSize(10).fillColor('#C7D2FE').text('© 2025 Infinite Gundawar Business Private Limited. All rights reserved.', 50, 480)

doc.end()
console.log('PDF generated:', outputPath)
