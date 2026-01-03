
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum Category {
  SOFTWARE = 'Software',
  TEMPLATES = 'Templates',
  EBOOKS = 'Ebooks',
  COURSES = 'Courses',
  LOGOS = 'Logo Design'
}

export interface SourceFile {
  filename: string;
  language: 'html' | 'css' | 'javascript' | 'react' | 'python' | 'text';
  content: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  videoUrl?: string;
  price: number;
  discountPrice?: number;
  category: Category;
  fileUrl: string;
  sourceCode: SourceFile[]; // New field to store actual product code
  tags: string[];
  demoLink?: string;
  rating: number;
  reviewsCount: number;
  status: 'Active' | 'Inactive' | 'Draft';
  createdAt: string;
}

// Fixed: Added missing User interface definition
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  orderNumber: string;
  amount: number;
  status: OrderStatus;
  paymentMethod: string;
  customerPhone: string; // Captured to reply back to user
  downloadLink?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}