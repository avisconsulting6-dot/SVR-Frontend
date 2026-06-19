// Mock content. In production this is replaced by API responses (see lib/api.js).
// Images are hotlinked from Unsplash; swap for your own CDN/asset URLs.

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const ORG = {
  name: 'SVR Educational Society',
  fullName: 'Sri Vommi Ramana Educational Society (SVR)',
  shortName: 'SVR Educational Society',
  tagline: 'Humanity · Since 2020',
  regNo: 'Reg. No. S/1L/45872 (Societies Act, 1860)',
  reg80G: 'ABJAS1501ME20231',
  reg12A: 'ABJAS1501ME20231',
  csr: 'CSR00012845',
  fcra: 'FCRA 231650489',
  pan: 'ABJAS1501M',
  founded: 2020,
  email: 'svrsociety2020@gmail.com',
  phone: '+91 6304360779',
  address: '1-111/1, Ganeshnagar Sachivalayam, Chinamushidiwada, Pendurthi, Visakhapatnam - 530051',
  social: {
    facebook: 'https://www.facebook.com/share/17KsqMJGYM/',
    instagram: 'https://www.instagram.com/svr_society',
    youtube: 'https://youtube.com/@svrsociety3391',
  },
}

export const TRUST = [
  { label: 'Registered NGO', value: '80G · 12A · CSR · FCRA', kind: 'text' },
  { label: 'Years of Service', value: 16, suffix: '+' },
  { label: 'Total Beneficiaries', value: 2840000, format: 'number' },
  { label: 'Active Volunteers', value: 4200, suffix: '+' },
]

export const IMPACT = [
  { label: 'Families Supported', value: 186000, suffix: '+' },
  { label: 'Students Educated', value: 312000, suffix: '+' },
  { label: 'Trees Planted', value: 540000, suffix: '+' },
  { label: 'Medical Camps Conducted', value: 4180, suffix: '+' },
]

export const CATEGORIES = ['Education', 'Health', 'Women Empowerment', 'Environment', 'Rural Development']

export const CAMPAIGNS = [
  {
    id: 'midday-meals',
    title: 'Warm Midday Meals for 5,000 Rural Children',
    category: 'Education',
    location: 'Kalaburagi, Karnataka',
    image: img('1488521787991-ed7bbaae773c'),
    raised: 1840000, goal: 2500000, endDate: '2026-08-20', donors: 1240,
    summary: 'A nutritious midday meal keeps a child in the classroom. We cook and serve hot meals across 42 government schools every working day.',
    urgent: true,
  },
  {
    id: 'girl-scholarship',
    title: 'Beti Padhao Scholarships for 800 Girls',
    category: 'Women Empowerment',
    location: 'Jaipur, Rajasthan',
    image: img('1503676260728-1c00da094a0b'),
    raised: 980000, goal: 1500000, endDate: '2026-07-15', donors: 760,
    summary: 'Tuition, books and a safe commute so adolescent girls complete secondary school instead of dropping out.',
  },
  {
    id: 'mobile-clinic',
    title: 'Mobile Health Clinic for Tribal Villages',
    category: 'Health',
    location: 'Gadchiroli, Maharashtra',
    image: img('1576091160550-2173dba999ef'),
    raised: 2210000, goal: 3000000, endDate: '2026-09-30', donors: 1810,
    summary: 'A fully-equipped van bringing doctors, diagnostics and medicines to 28 remote villages with no health centre.',
  },
  {
    id: 'reforest-western-ghats',
    title: 'Restore 50,000 Native Trees in the Western Ghats',
    category: 'Environment',
    location: 'Chikkamagaluru, Karnataka',
    image: img('1542601906990-b4d3fb778b09'),
    raised: 640000, goal: 1200000, endDate: '2026-10-10', donors: 530,
    summary: 'Community-led plantation of native species with two years of monitoring and local employment.',
  },
  {
    id: 'clean-water-wells',
    title: 'Solar Borewells for 12 Drought-Hit Villages',
    category: 'Rural Development',
    location: 'Latur, Maharashtra',
    image: img('1541544741938-0af808871cc0'),
    raised: 1560000, goal: 2000000, endDate: '2026-08-05', donors: 990, urgent: true,
    summary: 'Year-round safe drinking water through solar-powered borewells, ending the daily 4 km walk for water.',
  },
  {
    id: 'skill-women',
    title: 'Tailoring & Digital Skills for 300 Women',
    category: 'Women Empowerment',
    location: 'Lucknow, Uttar Pradesh',
    image: img('1573496359142-b8d87734a5a2'),
    raised: 410000, goal: 900000, endDate: '2026-11-01', donors: 340,
    summary: 'A six-month livelihood programme with placement support and seed capital for home-based enterprises.',
  },
]

export const STORIES = [
  {
    id: 1, name: 'Lakshmi, 14', place: 'Kalaburagi',
    image: img('1517256064527-09c73fc73e38', 600),
    text: 'I used to skip school by noon because I was hungry. Now I eat with my friends and I want to become a teacher.',
    tag: 'Education',
  },
  {
    id: 2, name: 'Sunita Devi', place: 'Lucknow',
    image: img('1594744803329-e58b31de8bf5', 600),
    text: 'After the tailoring course I started stitching from home. I earn ₹9,000 a month and my daughters study now.',
    tag: 'Women Empowerment',
  },
  {
    id: 3, name: 'Ramesh & family', place: 'Latur',
    image: img('1500382017468-9049fed747ef', 600),
    text: 'The borewell changed everything. My children no longer miss school to fetch water from the next village.',
    tag: 'Rural Development',
  },
]

export const ACTIVITIES = [
  { date: '24 May 2026', title: 'Mega health camp, Gadchiroli', text: '1,240 patients screened, 18 surgeries scheduled, free medicines distributed.' },
  { date: '11 May 2026', title: '10,000th tree planted in Chikkamagaluru', text: 'Local self-help groups joined the monsoon plantation drive.' },
  { date: '28 Apr 2026', title: 'New learning centre opened in Jaipur', text: 'Evening classes for 120 first-generation learners begin.' },
  { date: '06 Apr 2026', title: 'Annual audited accounts published', text: 'FY 2025–26 statements and impact report released for public review.' },
]

export const TESTIMONIALS = [
  { type: 'Donor', name: 'Arvind Menon', role: 'Monthly donor since 2018', avatar: img('1507003211169-0a1dd7228f2d', 200),
    text: 'I get a clear receipt and a quarterly report on exactly where my money went. That transparency is why I keep giving.' },
  { type: 'Volunteer', name: 'Priya Nair', role: 'Weekend volunteer, Bengaluru', avatar: img('1494790108377-be9c29b29330', 200),
    text: 'Teaching at the learning centre on Saturdays has been the most meaningful part of my week for three years.' },
  { type: 'Beneficiary', name: 'Mohammed Irfan', role: 'Scholarship recipient', avatar: img('1506794778202-cad84cf45f1d', 200),
    text: 'The scholarship covered my college fees. I am the first graduate in my family. I now volunteer here too.' },
  { type: 'Donor', name: 'TechNova CSR', role: 'Corporate partner', avatar: img('1560250097-0b93528c311a', 200),
    text: 'SVR Educational Society runs our employee giving and rural school programme with audited reporting we can take to our board.' },
]

export const PARTNERS = [
  'TechNova', 'BharatBank', 'Aarogya Health', 'GreenLeaf Co.',
  'Vidya Trust', 'Sankalp CSR', 'Nirmal Works', 'Udaan Labs',
  'CarePlus', 'MetroSteel', 'KisanFPO', 'SevaNet',
]

export const PRODUCTS = [
  { id: 'handloom-stole', name: 'Handloom Cotton Stole', price: 650, category: 'Handloom', maker: 'Lucknow women’s collective', image: img('1606760227091-3dd870d97f1d', 600) },
  { id: 'jute-bag', name: 'Upcycled Jute Tote', price: 420, category: 'Upcycled', maker: 'Goonj-style waste collective', image: img('1597484661973-ee6cd0b6482c', 600) },
  { id: 'honey', name: 'Wild Forest Honey 500g', price: 540, category: 'Food', maker: 'Tribal forest cooperative', image: img('1587049352846-4a222e784d38', 600) },
  { id: 'diyas', name: 'Hand-painted Terracotta Diyas (set of 6)', price: 360, category: 'Craft', maker: 'Self-help group, Jaipur', image: img('1605651531144-51381895e23d', 600) },
]

export const TEAM = [
  { name: 'Dr. Anjali Rao', role: 'Founder & Managing Trustee', image: img('1573496799652-408c2ac9fe98', 400) },
  { name: 'Vikram Shetty', role: 'Director, Programmes', image: img('1500648767791-00dcc994a43e', 400) },
  { name: 'Fatima Sheikh', role: 'Head, Field Operations', image: img('1580489944761-15a19d654956', 400) },
  { name: 'Rohan Das', role: 'Head, Finance & Compliance', image: img('1519085360753-af0119f7cbe7', 400) },
]

export const JOURNEY = [
  { year: '2009', title: 'SVR Educational Society is founded', text: 'Started as an evening tuition centre for 30 children in a Bengaluru slum.' },
  { year: '2012', title: '80G & 12A registration', text: 'Formalised as a registered society; first corporate CSR partnership.' },
  { year: '2016', title: 'Healthcare programme begins', text: 'First mobile medical clinic launched in rural Maharashtra.' },
  { year: '2019', title: 'FCRA approval', text: 'Enabled to receive international grants; expanded to 6 states.' },
  { year: '2023', title: 'Two million beneficiaries', text: 'Crossed 20 lakh lives touched across education, health and livelihoods.' },
  { year: '2026', title: 'Digital transparency platform', text: 'Live campaign tracking, donor wallets and public impact dashboards.' },
]

// ===================== EXTENDED CONTENT (full pages) =====================

export const VOLUNTEER_BENEFITS = [
  { icon: 'award', t: 'Recognised certificate', d: 'A verifiable certificate and letter of recommendation after 40+ logged hours.' },
  { icon: 'users', t: 'Real community', d: 'Join 4,200+ volunteers across 6 states with regular meet-ups and training.' },
  { icon: 'cap', t: 'Skill building', d: 'Free workshops in teaching, field research, fundraising and project management.' },
  { icon: 'heart', t: 'Direct impact', d: 'See exactly whose life your time changed through your volunteer dashboard.' },
  { icon: 'clock', t: 'Flexible hours', d: 'Weekend, weekday, remote and on-ground roles — contribute on your schedule.' },
  { icon: 'globe', t: 'References & network', d: 'Connect with NGOs, CSR teams and development professionals.' },
]

export const VOLUNTEER_JOURNEY = [
  { step: '01', t: 'Apply online', d: 'Fill the application with your skills, interests and availability.' },
  { step: '02', t: 'Orientation', d: 'A short induction call and a values & safeguarding briefing.' },
  { step: '03', t: 'Get matched', d: 'We match you to a role — teaching, camps, drives or remote support.' },
  { step: '04', t: 'Contribute & log', d: 'Show up, make an impact, and log your hours on your dashboard.' },
  { step: '05', t: 'Get certified', d: 'Earn certificates, recommendations and recognition for your service.' },
]

export const VOLUNTEER_ROLES = [
  { t: 'Teaching & mentoring', loc: 'Bengaluru, Jaipur, Lucknow', type: 'On-ground', commit: '4 hrs/week' },
  { t: 'Health camp support', loc: 'Maharashtra (field)', type: 'On-ground', commit: 'Event-based' },
  { t: 'Tree plantation drives', loc: 'Western Ghats', type: 'On-ground', commit: 'Seasonal' },
  { t: 'Content & social media', loc: 'Remote', type: 'Remote', commit: '3 hrs/week' },
  { t: 'Translation (regional)', loc: 'Remote', type: 'Remote', commit: 'Flexible' },
  { t: 'Fundraising champion', loc: 'Remote', type: 'Remote', commit: 'Flexible' },
]

export const TRACKS = [
  { id: 'education', name: 'Education & Teaching', icon: 'cap', weeks: 8, fee: 2999,
    desc: 'Classroom support, curriculum design and learning-outcome measurement.',
    skills: ['Lesson planning', 'Child psychology basics', 'Assessment design', 'Field reporting'] },
  { id: 'public-health', name: 'Public Health', icon: 'health', weeks: 10, fee: 3999,
    desc: 'Community health, camp operations and health data collection.',
    skills: ['Camp logistics', 'Health surveys', 'Data hygiene', 'Awareness campaigns'] },
  { id: 'environment', name: 'Environment & Sustainability', icon: 'leaf', weeks: 8, fee: 2999,
    desc: 'Reforestation, waste management and climate-resilience projects.',
    skills: ['Plantation methods', 'GIS basics', 'Monitoring', 'Community mobilisation'] },
  { id: 'social-comms', name: 'Communications & Fundraising', icon: 'mail', weeks: 6, fee: 2499,
    desc: 'Storytelling, donor communications, campaigns and digital fundraising.',
    skills: ['Copywriting', 'Social media', 'Campaign analytics', 'Donor relations'] },
]

export const INTERN_BENEFITS = [
  'Government & NGO-recognised completion certificate',
  'Live field project with a real programme team',
  'Weekly mentorship from sector professionals',
  'Letter of recommendation on merit',
  'Stipend-eligible top performers',
  'Placement support & alumni network',
]

const galleryImg = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=70`
export const GALLERY = [
  { id: 1, cat: 'Education', cap: 'Morning assembly, Indiranagar centre', src: galleryImg('1497486751825-1233686d5d80'), h: 'tall' },
  { id: 2, cat: 'Healthcare', cap: 'Mobile clinic, Gadchiroli', src: galleryImg('1576091160399-112ba8d25d1d'), h: 'short' },
  { id: 3, cat: 'Environment', cap: 'Monsoon plantation drive', src: galleryImg('1542601906990-b4d3fb778b09'), h: 'short' },
  { id: 4, cat: 'Events', cap: 'Annual volunteer meet 2025', src: galleryImg('1511632765486-a01980e01a18'), h: 'tall' },
  { id: 5, cat: 'Camps', cap: 'Eye screening camp, Latur', src: galleryImg('1579684385127-1ef15d508118'), h: 'short' },
  { id: 6, cat: 'Education', cap: 'Beti Padhao scholarship day', src: galleryImg('1503676260728-1c00da094a0b'), h: 'tall' },
  { id: 7, cat: 'Environment', cap: 'Seedling nursery, Chikkamagaluru', src: galleryImg('1416879595882-3373a0480b5b'), h: 'short' },
  { id: 8, cat: 'Healthcare', cap: 'Community health worker training', src: galleryImg('1631815588090-d4bfec5b1ccb'), h: 'short' },
  { id: 9, cat: 'Camps', cap: 'Solar borewell inauguration', src: galleryImg('1541544741938-0af808871cc0'), h: 'tall' },
  { id: 10, cat: 'Events', cap: 'Founder’s day, Bengaluru', src: galleryImg('1540575467063-178a50c2df87'), h: 'short' },
  { id: 11, cat: 'Education', cap: 'Tailoring & digital skills batch', src: galleryImg('1573496359142-b8d87734a5a2'), h: 'short' },
  { id: 12, cat: 'Environment', cap: 'River clean-up volunteers', src: galleryImg('1532996122724-e3c354a0b15b'), h: 'tall' },
]

export const VIDEOS = [
  { id: 'ScMzIvxBSi4', cat: 'Documentary', title: 'A meal, a future — the midday meal story', dur: '6:42', thumb: galleryImg('1488521787991-ed7bbaae773c') },
  { id: 'aqz-KE-bpKQ', cat: 'Field', title: 'Inside our mobile health clinic', dur: '4:18', thumb: galleryImg('1576091160550-2173dba999ef') },
  { id: 'L_jWHffIx5E', cat: 'Stories', title: 'Sunita’s second chance', dur: '3:05', thumb: galleryImg('1594744803329-e58b31de8bf5') },
  { id: 'fJ9rUzIMcZQ', cat: 'Documentary', title: 'Restoring the Western Ghats', dur: '8:11', thumb: galleryImg('1542601906990-b4d3fb778b09') },
  { id: 'kJQP7kiw5Fk', cat: 'Events', title: 'Annual volunteer meet 2025 — highlights', dur: '2:47', thumb: galleryImg('1511632765486-a01980e01a18') },
  { id: '3JZ_D3ELwOQ', cat: 'Stories', title: 'The first graduate in the family', dur: '4:55', thumb: galleryImg('1506794778202-cad84cf45f1d') },
]

export const AWARDS = [
  { year: '2025', t: 'National CSR Excellence Award', by: 'Ministry of Corporate Affairs (recognition)' },
  { year: '2024', t: 'GuideStar India — Platinum Certification', by: 'Transparency & accountability' },
  { year: '2023', t: 'Best NGO in Education', by: 'India Development Forum' },
  { year: '2022', t: 'Green Impact Honour', by: 'State Environment Council' },
]

export const RECOGNITION = [
  { t: 'NITI Aayog NGO Darpan', id: 'KA/2016/0102345' },
  { t: 'Income Tax 80G & 12A', id: ORG.reg80G },
  { t: 'FCRA, Ministry of Home Affairs', id: ORG.fcra },
  { t: 'CSR-1 (MCA)', id: ORG.csr },
]

export const MEDIA = [
  { src: 'The Hindu', t: '“How a Bengaluru NGO feeds 5,000 children every day”', date: 'Apr 2026' },
  { src: 'Times of India', t: '“SVR Educational Society’s solar borewells end the 4-km walk for water”', date: 'Feb 2026' },
  { src: 'YourStory', t: '“Radical transparency: the NGO that publishes every rupee”', date: 'Jan 2026' },
  { src: 'The Better India', t: '“From a tin roof to six states in 16 years”', date: 'Nov 2025' },
]

export const REPORTS = [
  { t: 'Annual Report FY 2025–26', size: '4.2 MB', type: 'PDF' },
  { t: 'Audited Financial Statements 2025–26', size: '1.1 MB', type: 'PDF' },
  { t: 'Impact Assessment — Education', size: '2.8 MB', type: 'PDF' },
  { t: '80G / 12A / FCRA Certificates', size: '900 KB', type: 'PDF' },
]

export const REVIEWS = [
  { name: 'Deepa R.', rating: 5, text: 'Beautiful craftsmanship and I love that it directly supports the women who made it.', date: 'May 2026' },
  { name: 'Arjun K.', rating: 5, text: 'Great quality, fast delivery, and a lovely note about the maker came with it.', date: 'Apr 2026' },
  { name: 'Nisha P.', rating: 4, text: 'Lovely product. Packaging could be a touch sturdier, but the cause makes it worth it.', date: 'Mar 2026' },
]

// ===================== WHAT WE DO (real nav tree from SVR site) =====================
const causeImg = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`

export const WHATWEDO = [
  {
    key: 'medical', label: 'Medical', icon: 'health',
    intro: 'Direct medical support for individuals and families facing critical illness, plus free health screening drives in underserved areas.',
    items: [
      { id: 'support-ramakrishna', title: 'Support to Ramakrishna to recover from kidney failure',
        blurb: 'Help fund dialysis and a life-saving kidney transplant for Ramakrishna, a daily-wage earner and sole breadwinner.',
        image: causeImg('1579684385127-1ef15d508118'), raised: 320000, goal: 800000, beneficiary: 'Ramakrishna, 42' },
      { id: 'support-chiranjeevi', title: 'Support Yellapu Chiranjeevi Surya from kidney failure',
        blurb: 'Young Chiranjeevi needs urgent, ongoing dialysis. Your support keeps his treatment uninterrupted.',
        image: causeImg('1631815588090-d4bfec5b1ccb'), raised: 145000, goal: 600000, beneficiary: 'Y. Chiranjeevi Surya, 19' },
      { id: 'free-cholesterol-test', title: 'Support free medical cholesterol test camps',
        blurb: 'Fund free cholesterol and lifestyle-disease screening camps for low-income communities.',
        image: causeImg('1576091160550-2173dba999ef'), raised: 88000, goal: 250000, beneficiary: '2,000+ residents' },
      { id: 'cancer-fight', title: 'Your support can be a future — help this person fight cancer',
        blurb: 'Chemotherapy and care are out of reach for many families. Stand with a patient fighting cancer.',
        image: causeImg('1505751172876-fa1923c5c528'), raised: 410000, goal: 1200000, beneficiary: 'Cancer patient & family' },
    ],
  },
  {
    key: 'education', label: 'Education', icon: 'cap',
    intro: 'Keeping first-generation learners in school — free education, uniforms, books and classroom infrastructure.',
    items: [
      { id: 'free-child-education', title: 'Support for free child education',
        blurb: 'Sponsor tuition, learning material and a safe space for children who would otherwise drop out.',
        image: causeImg('1503676260728-1c00da094a0b'), raised: 260000, goal: 500000, beneficiary: '300 children' },
      { id: 'school-uniform', title: 'Donate for kids’ school uniforms',
        blurb: 'A clean uniform brings dignity and confidence. Gift uniforms to government-school children.',
        image: causeImg('1509062522246-3755977927d7'), raised: 95000, goal: 200000, beneficiary: '500 students' },
      { id: 'books-distribution', title: 'Donate for books distribution',
        blurb: 'Textbooks, notebooks and library books for children and rural learning centres.',
        image: causeImg('1497486751825-1233686d5d80'), raised: 120000, goal: 250000, beneficiary: '800 students' },
      { id: 'school-furniture', title: 'Donate furniture to the school',
        blurb: 'Desks, benches and blackboards so children no longer study on the floor.',
        image: causeImg('1580582932707-520aed937b7b'), raised: 70000, goal: 300000, beneficiary: '4 schools' },
    ],
  },
  {
    key: 'devotional', label: 'Devotional', icon: 'heart',
    intro: 'Community seva rooted in faith — free meals (annadanam) and support for temple and community service activities.',
    items: [
      { id: 'annadanam', title: 'Support Annadanam — free community meals',
        blurb: 'Sponsor wholesome free meals served to devotees, elders and the needy at community kitchens.',
        image: causeImg('1488521787991-ed7bbaae773c'), raised: 180000, goal: 400000, beneficiary: '10,000 meals' },
      { id: 'temple-seva', title: 'Support temple & community seva activities',
        blurb: 'Help maintain community spaces and organise festivals and seva for the local community.',
        image: causeImg('1540575467063-178a50c2df87'), raised: 64000, goal: 150000, beneficiary: 'Local community' },
    ],
  },
  {
    key: 'awareness', label: 'Awareness', icon: 'shield',
    intro: 'Awareness drives that protect rights and improve wellbeing — from human and consumer rights to adolescent health and legal literacy.',
    items: [
      { id: 'human-rights', title: 'Support awareness of human rights',
        blurb: 'Workshops and campaigns that help communities understand and claim their fundamental rights.',
        image: causeImg('1532619675605-1ede6c2ed2b0'), raised: 42000, goal: 120000, beneficiary: 'Communities' },
      { id: 'consumer-rights', title: 'Support awareness of consumer rights',
        blurb: 'Help citizens recognise fraud, unfair trade practices and how to seek redressal.',
        image: causeImg('1450101499163-c8848c66ca85'), raised: 31000, goal: 100000, beneficiary: 'Consumers' },
      { id: 'general-health', title: 'Support general health awareness',
        blurb: 'Preventive-health and hygiene awareness sessions across villages and schools.',
        image: causeImg('1576091160399-112ba8d25d1d'), raised: 58000, goal: 150000, beneficiary: 'Rural families' },
      { id: 'gynae-awareness', title: 'Support gynae & menstrual-health awareness (adolescent girls)',
        blurb: 'Safe, respectful health-education sessions and sanitary support for adolescent girls.',
        image: causeImg('1573496359142-b8d87734a5a2'), raised: 76000, goal: 200000, beneficiary: 'Adolescent girls' },
      { id: 'student-career', title: 'Support student career awareness',
        blurb: 'Career guidance, scholarships info and counselling for school and college students.',
        image: causeImg('1523240795612-9a054b0db644'), raised: 49000, goal: 120000, beneficiary: 'Students' },
      { id: 'child-growth', title: 'Support child growth-screening awareness',
        blurb: 'Early growth and nutrition screening to catch and prevent childhood developmental issues.',
        image: causeImg('1517256064527-09c73fc73e38'), raised: 33000, goal: 100000, beneficiary: 'Children' },
      { id: 'legal-awareness', title: 'Support legal awareness',
        blurb: 'Free legal-literacy camps so people know their rights and how to access justice.',
        image: causeImg('1589829545856-d10d557cf95f'), raised: 27000, goal: 90000, beneficiary: 'General public' },
    ],
  },
  {
    key: 'service', label: 'Service', icon: 'hands',
    intro: 'On-the-ground relief and welfare distribution for the most vulnerable, especially through harsh seasons.',
    items: [
      { id: 'blanket-distribution', title: 'Donate for blanket distribution',
        blurb: 'Warm blankets for the homeless and elderly through the cold winter months.',
        image: causeImg('1516627145497-ae6968895b74'), raised: 110000, goal: 250000, beneficiary: '1,500 people' },
      { id: 'food-distribution', title: 'Donate for food distribution',
        blurb: 'Cooked meals and dry-ration kits for families facing hunger and hardship.',
        image: causeImg('1488521787991-ed7bbaae773c'), raised: 230000, goal: 400000, beneficiary: '5,000 meals' },
    ],
  },
]

export function findCause(catKey, itemId) {
  const cat = WHATWEDO.find((c) => c.key === catKey)
  if (!cat) return null
  const item = cat.items.find((i) => i.id === itemId)
  return item ? { ...item, category: cat.label, categoryKey: cat.key } : null
}

export const FOOTER_POLICIES = ['Disclaimer', 'Shipping Policy', 'Terms & Conditions', 'Refund & Return Policy']
export const FOOTER_ABOUT = 'SVR Educational Society is dedicated to empowering communities through education, healthcare, and sustainable development, fostering positive change and growth in underserved areas.'

// ===================== HOMEPAGE BANNER SLIDES =====================
export const BANNER_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=75',
    eyebrow: 'Education for every child',
    title: 'Keep a child in school',
    text: 'Free education, uniforms and books for first-generation learners across Visakhapatnam.',
    cta: { to: '/what-we-do/education', label: 'Support education' },
    cta2: { to: '/donate', label: 'Donate now' },
  },
  {
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=75',
    eyebrow: 'Medical & health support',
    title: 'A future worth fighting for',
    text: 'Help fund life-saving treatment and free health camps for families who cannot afford care.',
    cta: { to: '/what-we-do/medical', label: 'See medical causes' },
    cta2: { to: '/donate', label: 'Donate now' },
  },
  {
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=75',
    eyebrow: 'Service · Humanity since 2020',
    title: 'Food & warmth for the vulnerable',
    text: 'Annadanam meals, dry-ration kits and winter blankets for the homeless and elderly.',
    cta: { to: '/what-we-do/service', label: 'Join a drive' },
    cta2: { to: '/volunteer', label: 'Volunteer' },
  },
  {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1800&q=75',
    eyebrow: 'Awareness',
    title: 'Knowledge that protects',
    text: 'Health, legal, consumer-rights and adolescent-wellbeing awareness across communities.',
    cta: { to: '/what-we-do/awareness', label: 'Explore awareness' },
  },
]

// ===================== REAL CONTENT FROM svrsociety.in =====================

export const ABOUT_INTRO = {
  eyebrow: 'Who We Are',
  title: 'Sri Vommi Ramana Educational Society (SVR)',
  body: [
    'SVR Society is a non-profit organization committed to empowering communities and promoting sustainable development across India. We focus on key areas such as child growth and education, women empowerment, poverty alleviation, and social welfare to create lasting and meaningful change.',
    'With compassion and a strong sense of responsibility, SVR Society implements innovative programs and builds powerful local partnerships to uplift the underserved and promote equal opportunities for all.',
  ],
}

export const HOME_CTA = {
  title: 'Will you be the reason a child smiles today?',
  text: 'Your small help can bring big happiness. Support a child’s education, health, or needs today and become the reason behind their bright smile and future.',
}

// Donor FAQ — paraphrased/condensed from the live site's FAQ section
export const FAQS = [
  {
    q: 'How is my donation used?',
    a: 'Donations fund our core programmes: education (schooling support, infrastructure, teacher training and scholarships) and social development (women empowerment, health and nutrition). Funds are directed to where the need is greatest within these areas.',
  },
  {
    q: 'How can I make a donation?',
    a: 'You can donate online through the official SVR website using secure payment gateways (card, UPI, net banking). Local supporters can also visit our office and contribute by cheque or cash.',
  },
  {
    q: 'How can I be sure my donation is secure?',
    a: 'Please donate only through official channels — the SVR website, our verified payment gateway (Razorpay), or recognised bank transfers. Avoid sending money to any individual account to prevent misuse of funds.',
  },
  {
    q: 'Can I choose where my donation goes?',
    a: 'Yes. You can give to the General Fund (unrestricted — we allocate it where it is needed most), or earmark it for a specific cause or campaign such as child education, a health camp, or an awareness drive.',
  },
]

// Active volunteers shown on the homepage (names from the live site)
export const HOME_VOLUNTEERS = [
  { name: 'Mayuri', role: 'Volunteer' },
  { name: 'Dendeti Jyothi', role: 'Volunteer' },
  { name: 'Sri Rama Rao Bandi', role: 'Volunteer' },
  { name: 'Usha', role: 'Volunteer' },
  { name: 'VijayaLakshmi VL', role: 'Volunteer' },
  { name: 'Amrutha Baddem', role: 'Volunteer' },
]

// Important notice shown on the live site
export const TRUST_NOTICE = 'SVR is a society working for a noble cause for needy people. Donations / subscriptions should be sent only to the authorized account. Please do not send to any individual account, to avoid any misuse of funds.'

// Real shop categories from the live site
export const SHOP_CATEGORIES = ['Spiritual Items', 'Foot Ware', 'SVR Subscriptions']

// Footer policy + about (from live site)
export const FOOTER_POLICIES_REAL = ['Disclaimer', 'Shipping Policy', 'Terms & Conditions', 'Refund & Return Policy']
