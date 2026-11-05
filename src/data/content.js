// All site content lives here, so prices, links and services can be
// updated without touching the page layouts.

export const STORE_URL = 'https://selar.com/m/favoredonline';
export const CONTACT_EMAIL = 'info.favoredonline@gmail.com';

// Pre-order pricing ends on launch day. After this date the site
// automatically switches to regular prices and "Buy" wording.
export const LAUNCH_DATE = new Date('2026-11-16T15:17:00Z');
export const isPreorder = () => Date.now() < LAUNCH_DATE.getTime();
export const launchLabel = 'November 16, 2026';

const COVER = 'https://files.selar.co/product-images';

export const BUNDLE = {
  id: 'bundle',
  title: 'Career Path in Tech',
  subtitle: 'The complete 3-book series',
  url: 'https://selar.com/8j90958dp2',
  cover: `${COVER}/2026/products/favoredonline/pre-order-career-path-in--selar.com-6aeca9d984eef.png`,
  preorderPrice: 15,
  price: 20,
  separatePrice: 24,
  pages: 280,
  formats: 'PDF + EPUB',
  blurb:
    'All three books in one download: deciding whether tech is right for you, landing the role, and building a career that lasts as AI reshapes the job market. Every book comes with worksheets and a glossary.',
};

export const BOOKS = [
  {
    id: 'start',
    number: 1,
    name: 'Start',
    title: 'Finding Your Way Into Tech in the Age of AI',
    url: 'https://selar.com/gkj7313913',
    cover: `${COVER}/2026/products/favoredonline/pre-order-career-path-in--selar.com-6aeca858e20db.png`,
    preorderPrice: 6,
    price: 8,
    pages: 99,
    forWho: 'For anyone deciding whether, and how, to get into tech.',
    topics: [
      'How the tech landscape is laid out and where the opportunities are',
      'Finding a niche, and balancing depth with breadth',
      'Whether tech is still worth it when AI can write code',
      'Degrees, certifications, bootcamps or self-teaching: choosing a learning path',
      'Switching careers and using your past experience as an advantage',
    ],
  },
  {
    id: 'get-in',
    number: 2,
    name: 'Get In',
    title: 'Landing Your Role and Choosing Your Path',
    url: 'https://selar.com/28r71j713u',
    cover: `${COVER}/2026/products/favoredonline/pre-order-career-path-in--selar.com-6aeca88bd4af8.png`,
    preorderPrice: 6,
    price: 8,
    pages: 89,
    forWho: 'For people who have chosen tech and need to get hired.',
    topics: [
      'Interviews, portfolios and getting noticed',
      'Careers in data, AI and cloud',
      'Product management and UX design',
      'IT audit and other tech-enabled professions',
      'Building real expertise and growing in your first role',
    ],
  },
  {
    id: 'grow',
    number: 3,
    name: 'Grow',
    title: 'Building a Lasting Career in the Age of AI',
    url: 'https://selar.com/ahp92l3z89',
    cover: `${COVER}/2026/products/favoredonline/pre-order-career-path-in--selar.com-6aeca243e261f.png`,
    preorderPrice: 6,
    price: 8,
    pages: 90,
    forWho: 'For people already in tech who want to keep moving forward.',
    topics: [
      'Planning a career around where the market is heading',
      'Employment or entrepreneurship',
      'Networking and building a personal brand',
      'Staying relevant through continuous learning',
      'Finding your place whether you build AI or work alongside it',
    ],
  },
];

export const TOOLKIT = {
  title: 'AI Business Growth Toolkit',
  subtitle: 'Strategic prompts for business owners',
  url: 'https://selar.com/q3tk00n000',
  cover: `${COVER}/2025/products/opeyemitaiwo/ai-business-growth-toolki-selar.com-694c3a2b6f3ab.png`,
  blurb:
    'Ready-to-use AI prompts for launching, selling and scaling, so you ask better questions and make clearer decisions. Free to download.',
};

export const SERVICES = [
  {
    title: 'AI inside the tools you already use',
    body: 'We add AI to your existing website, app or internal system, so you get the benefit without rebuilding from scratch.',
    examples: ['Custom AI features and APIs', 'Smart search and recommendations', 'Document reading and summarising'],
  },
  {
    title: 'Chatbots and virtual assistants',
    body: 'Assistants that answer customer questions, qualify leads and book appointments, trained on your own products and policies.',
    examples: ['Website and WhatsApp assistants', 'Internal help desks for staff', 'Lead capture and follow-up'],
  },
  {
    title: 'Workflow automation',
    body: 'We take the repetitive work off your team: onboarding, invoicing, support routing, scheduling and reporting.',
    examples: ['Customer onboarding flows', 'Support ticket routing', 'HR and operations automation'],
  },
  {
    title: 'Data and forecasting',
    body: 'Dashboards that show how the business is doing today, and models that help you plan for next quarter.',
    examples: ['Live KPI dashboards', 'Sales and demand forecasting', 'Customer churn analysis'],
  },
  {
    title: 'AI-powered web and mobile apps',
    body: 'When you need something new, we design and build web and mobile products with AI built in from day one.',
    examples: ['Customer portals and SaaS products', 'iOS and Android apps', 'Secure multi-user systems'],
  },
  {
    title: 'AI strategy and readiness',
    body: 'Not sure where AI fits? We assess your processes and data, then give you a practical, prioritised roadmap.',
    examples: ['AI readiness assessment', 'Roadmap and MVP planning', 'Data and compliance considerations'],
  },
];

export const CONSULTATION_FEE = 100;

export const PROCESS = [
  {
    title: 'Consultation',
    body: `A paid discovery session ($${CONSULTATION_FEE}) where we learn your goals, your current systems and where AI can genuinely help.`,
  },
  {
    title: 'Proposal',
    body: 'You receive a written proposal with scope, timeline and itemised pricing. There is no obligation to go ahead.',
  },
  {
    title: 'Build',
    body: `If you go ahead, we sign a project agreement and the $${CONSULTATION_FEE} consultation fee is credited to your first payment.`,
  },
  {
    title: 'Support',
    body: 'After launch we monitor, maintain and improve the system as your business grows.',
  },
];

export const FAQS = [
  {
    q: 'Can you add AI to my existing website or app?',
    a: 'Yes. Most of our work is upgrading systems businesses already have: adding assistants, automation, recommendations or analytics without starting over.',
  },
  {
    q: 'How does the consultation fee work?',
    a: `The consultation costs $${CONSULTATION_FEE}. It covers your discovery session and a custom proposal. If you build with us, the full amount is credited toward your project. If you decide not to proceed, the fee is non-refundable. Full details are in our Terms of Service.`,
  },
  {
    q: 'What size of business do you work with?',
    a: 'Small businesses, growth-stage startups and larger teams across finance, healthcare, education, e-commerce and professional services. The consultation tells us both whether we are a good fit.',
  },
  {
    q: 'Will I work with real people?',
    a: 'Yes. Every inquiry is read by a member of our team, who will reply by email within 24 hours.',
  },
  {
    q: 'Do you provide support after launch?',
    a: 'Yes. Ongoing maintenance, monitoring and improvements are set out in your project agreement.',
  },
];

export const SOCIALS = [
  { label: 'Instagram', url: 'https://www.instagram.com/favoredonline/' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/favoredonline/' },
  { label: 'YouTube', url: 'https://www.youtube.com/@favoredonlineinc' },
  { label: 'Facebook', url: 'https://www.facebook.com/favoredonlineinc/' },
];

// Inquiries go to the same Google Form the previous site's chatbot used.
export const GOOGLE_FORM = {
  action:
    'https://docs.google.com/forms/d/e/1FAIpQLScKWa6lglk6AYwRDbBIO7R84LX_8QiP4iA9tGowd-BuvvLrQw/formResponse',
  fields: {
    firstName: 'entry.640877948',
    lastName: 'entry.708138434',
    email: 'entry.64027578',
    phone: 'entry.1300524080',
    message: 'entry.1092093939',
    consultation: 'entry.133740837',
  },
};
