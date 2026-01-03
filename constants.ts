
import { Category, Product, UserRole, OrderStatus } from './types';

export const WHATSAPP_NUMBER = '923264236393';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Ultimate React Dashboard Template',
    description: 'A premium, high-performance React dashboard template with Tailwind CSS and TypeScript. Features 50+ components, fully responsive, and easy to customize.',
    images: ['https://picsum.photos/seed/dash1/800/600', 'https://picsum.photos/seed/dash2/800/600'],
    price: 49.99,
    discountPrice: 29.99,
    category: Category.TEMPLATES,
    fileUrl: 'https://example.com/files/react-dash.zip',
    // Added missing sourceCode property
    sourceCode: [],
    tags: ['react', 'tailwind', 'admin', 'dashboard'],
    demoLink: 'https://demo.example.com',
    rating: 4.8,
    reviewsCount: 124,
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    title: 'Python for Data Science Masterclass',
    description: 'Learn Python from scratch for data analysis, visualization, and machine learning. Includes 20+ real-world projects and full source code.',
    images: ['https://picsum.photos/seed/python/800/600'],
    price: 99.00,
    category: Category.COURSES,
    fileUrl: 'https://example.com/files/python-course.pdf',
    // Added missing sourceCode property
    sourceCode: [],
    tags: ['python', 'data science', 'learning'],
    rating: 4.9,
    reviewsCount: 890,
    status: 'Active',
    createdAt: new Date().toISOString()
  }
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/#products' },
  { label: 'Categories', href: '/#categories' },
  { label: 'About', href: '/#about' }
];