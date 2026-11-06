// All site content lives here, so prices, links and services can be
// updated without touching the page layouts.

export const STORE_URL = 'https://selar.com/m/favoredonline';

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

export const SOCIALS = [
  { label: 'Instagram', url: 'https://www.instagram.com/favoredonline/' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/favoredonline/' },
  { label: 'YouTube', url: 'https://www.youtube.com/@favoredonlineinc' },
  { label: 'Facebook', url: 'https://www.facebook.com/favoredonlineinc/' },
];
