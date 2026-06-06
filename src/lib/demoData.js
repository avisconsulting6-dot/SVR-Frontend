/**
 * DEMO DATA — lets the site run with NO backend (e.g. static deploy / client demo).
 * Mirrors the shapes the real API returns. The API client falls back to this
 * automatically when the backend is unreachable.
 */
const ci = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50)

const CAUSE_DEFS = [
  ['Medical', 'Support to Ramakrishna to recover from kidney failure', 'Help fund dialysis and a life-saving kidney transplant for Ramakrishna, a daily-wage earner and sole breadwinner.', 320000, 800000, 'Ramakrishna, 42', '1579684385127-1ef15d508118'],
  ['Medical', 'Support Yellapu Chiranjeevi Surya from kidney failure', 'Young Chiranjeevi needs urgent, ongoing dialysis. Your support keeps his treatment uninterrupted.', 145000, 600000, 'Y. Chiranjeevi Surya, 19', '1631815588090-d4bfec5b1ccb'],
  ['Medical', 'Support free medical cholesterol test camps', 'Fund free cholesterol and lifestyle-disease screening camps for low-income communities.', 88000, 250000, '2,000+ residents', '1576091160550-2173dba999ef'],
  ['Medical', 'Help this person fight cancer', 'Chemotherapy and care are out of reach for many families. Stand with a patient fighting cancer.', 410000, 1200000, 'Cancer patient & family', '1505751172876-fa1923c5c528'],
  ['Education', 'Support for free child education', 'Sponsor tuition, learning material and a safe space for children who would otherwise drop out.', 260000, 500000, '300 children', '1503676260728-1c00da094a0b'],
  ['Education', 'Donate for kids school uniforms', 'A clean uniform brings dignity and confidence. Gift uniforms to government-school children.', 95000, 200000, '500 students', '1509062522246-3755977927d7'],
  ['Education', 'Donate for books distribution', 'Textbooks, notebooks and library books for children and rural learning centres.', 120000, 250000, '800 students', '1497486751825-1233686d5d80'],
  ['Education', 'Donate furniture to the school', 'Desks, benches and blackboards so children no longer study on the floor.', 70000, 300000, '4 schools', '1580582932707-520aed937b7b'],
  ['Devotional', 'Support Annadanam — free community meals', 'Sponsor wholesome free meals served to devotees, elders and the needy at community kitchens.', 180000, 400000, '10,000 meals', '1488521787991-ed7bbaae773c'],
  ['Devotional', 'Support temple & community seva', 'Help maintain community spaces and organise festivals and seva for the local community.', 64000, 150000, 'Local community', '1540575467063-178a50c2df87'],
  ['Awareness', 'Support awareness of human rights', 'Workshops and campaigns that help communities understand and claim their fundamental rights.', 42000, 120000, 'Communities', '1532619675605-1ede6c2ed2b0'],
  ['Awareness', 'Support awareness of consumer rights', 'Help citizens recognise fraud, unfair trade practices and how to seek redressal.', 31000, 100000, 'Consumers', '1450101499163-c8848c66ca85'],
  ['Awareness', 'Support general health awareness', 'Preventive-health and hygiene awareness sessions across villages and schools.', 58000, 150000, 'Rural families', '1576091160399-112ba8d25d1d'],
  ['Awareness', 'Support gynae & menstrual-health awareness for adolescent girls', 'Safe, respectful health-education sessions and sanitary support for adolescent girls.', 76000, 200000, 'Adolescent girls', '1573496359142-b8d87734a5a2'],
  ['Awareness', 'Support student career awareness', 'Career guidance, scholarships info and counselling for school and college students.', 49000, 120000, 'Students', '1523240795612-9a054b0db644'],
  ['Awareness', 'Support child growth-screening awareness', 'Early growth and nutrition screening to catch and prevent childhood developmental issues.', 33000, 100000, 'Children', '1517256064527-09c73fc73e38'],
  ['Awareness', 'Support legal awareness', 'Free legal-literacy camps so people know their rights and how to access justice.', 27000, 90000, 'General public', '1589829545856-d10d557cf95f'],
  ['Service', 'Donate for blanket distribution', 'Warm blankets for the homeless and elderly through the cold winter months.', 110000, 250000, '1,500 people', '1516627145497-ae6968895b74'],
  ['Service', 'Donate for food distribution', 'Cooked meals and dry-ration kits for families facing hunger and hardship.', 230000, 400000, '5,000 meals', '1488521787991-ed7bbaae773c'],
]

export const DEMO_CAUSES = CAUSE_DEFS.map(([category, title, blurb, raised, goal, beneficiary, img], i) => ({
  id: 'c' + i,
  slug: slug(title),
  title, category, categoryKey: slug(category),
  blurb, story: blurb + ' SVR Educational Society verifies every case on the ground and shares utilisation updates with donors.',
  beneficiary, raised, goal, image: ci(img), active: true,
}))

const PRODUCT_DEFS = [
  ['Brass Puja Diya Lamp', 'Spiritual Items', 'SVR artisan group', 350, 50, '1605651531144-51381895e23d'],
  ['Sacred Tulsi Mala', 'Spiritual Items', 'SVR artisan group', 220, 80, '1599643478518-a784e5dc4c8f'],
  ['Incense & Camphor Gift Set', 'Spiritual Items', 'SVR collective', 180, 100, '1602536052359-ef94c21c5948'],
  ['Everyday Comfort Sandals', 'Foot Ware', 'SVR livelihood unit', 499, 40, '1543163521-1bf539c55dd2'],
  ['Handmade Leather Chappals', 'Foot Ware', 'SVR livelihood unit', 650, 30, '1531310197839-ccf54634509e'],
  ['SVR Annual Subscription', 'SVR Subscriptions', 'SVR Educational Society', 1000, 999, '1450101499163-c8848c66ca85'],
  ['SVR Monthly Support Plan', 'SVR Subscriptions', 'SVR Educational Society', 200, 999, '1488521787991-ed7bbaae773c'],
]

export const DEMO_PRODUCTS = PRODUCT_DEFS.map(([name, category, maker, price, stock, img], i) => ({
  id: 'p' + i, slug: slug(name), name, category, maker, price, stock, image: ci(img), active: true,
  description: `Hand-crafted by ${maker}. Each piece is unique, made with natural materials and traditional techniques.`,
  story: 'Made by one of our livelihood collectives — your purchase pays fair wages and funds our programmes.',
}))

const BLOG_DEFS = [
  ['How a hot midday meal keeps children in school', 'Hunger is the quietest reason children drop out. Here is what a single warm meal changes.', '1488521787991-ed7bbaae773c'],
  ['Inside our mobile health clinic', 'A day on the road with the team bringing doctors to villages that have none.', '1576091160550-2173dba999ef'],
  ['Why we publish every rupee', 'Radical transparency is not a marketing line for us — it is how we earn the right to ask for support.', '1450101499163-c8848c66ca85'],
]
export const DEMO_BLOGS = BLOG_DEFS.map(([title, excerpt, img], i) => ({
  id: 'b' + i, slug: slug(title), title, excerpt, cover: ci(img),
  author: 'SVR Educational Society', published: true,
  createdAt: new Date(Date.now() - i * 6 * 86400000).toISOString(),
  body: `${excerpt}\n\nSVR Educational Society works directly with communities in and around Visakhapatnam. This story is one of many made possible by donors and volunteers like you.\n\nEvery programme we run is verified on the ground and reported back transparently. Thank you for being part of the change.`,
}))

const EVENT_DEFS = [
  ['Mega health & cholesterol screening camp', 'Mushidiwada, Visakhapatnam', 'Free screening, medicines and doctor consultations for the community.', 12, '1576091160399-112ba8d25d1d'],
  ['Annadanam — community meal drive', 'Ganeshnagar', 'Free wholesome meals served to elders and the needy.', 5, '1488521787991-ed7bbaae773c'],
  ['School uniform & books distribution', 'Government School, Mushidiwada', 'Uniforms and learning kits handed to 300 children.', 30, '1509062522246-3755977927d7'],
]
export const DEMO_EVENTS = EVENT_DEFS.map(([title, location, description, days, img], i) => ({
  id: 'e' + i, title, location, description, image: ci(img), published: true,
  date: new Date(Date.now() + days * 86400000).toISOString(),
}))

const GALLERY_DEFS = [
  ['Health camp', 'Camps', '1576091160399-112ba8d25d1d'], ['Classroom support', 'Education', '1497486751825-1233686d5d80'],
  ['Blanket distribution', 'Events', '1516627145497-ae6968895b74'], ['Annadanam drive', 'Events', '1488521787991-ed7bbaae773c'],
  ['Scholarship day', 'Education', '1503676260728-1c00da094a0b'], ['Awareness session', 'Healthcare', '1573496359142-b8d87734a5a2'],
  ['Tree plantation', 'Environment', '1542601906990-b4d3fb778b09'], ['Books distribution', 'Education', '1509062522246-3755977927d7'],
]
export const DEMO_GALLERY = GALLERY_DEFS.map(([title, album, img], i) => ({
  id: 'g' + i, title, album, url: ci(img), createdAt: new Date().toISOString(),
}))

export function groupCauses(causes) {
  const byKey = {}
  for (const c of causes) (byKey[c.categoryKey] ||= { key: c.categoryKey, label: c.category, items: [] }).items.push(c)
  return Object.values(byKey)
}

// A demo wallet/referral payload so dashboards render in offline mode
export const DEMO_WALLET = {
  balance: 150,
  transactions: [
    { id: 't1', type: 'credit', amount: 100, reason: 'referral_earned', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 't2', type: 'credit', amount: 50, reason: 'referral_bonus', createdAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  ],
}
export const DEMO_REFERRALS = {
  referralCode: 'RAVI123',
  rates: { referrer: 0.1, referred: 0.05 },
  totalReferred: 2, rewarded: 1, totalEarned: 100,
  referrals: [
    { name: 'Sita Reddy', email: 'sita@demo.in', status: 'rewarded', coins: 100, joinedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
    { name: 'Mohan Das', email: 'mohan@demo.in', status: 'pending', coins: 0, joinedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  ],
}
