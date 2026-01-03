
import { Product, User, Order, UserRole, OrderStatus, Category } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const USERS_KEY = 'digimart_users';
const PRODUCTS_KEY = 'digimart_products';
const ORDERS_KEY = 'digimart_orders';
const CURRENT_USER_KEY = 'digimart_current_user';

export const mockService = {
  init: () => {
    if (!localStorage.getItem(PRODUCTS_KEY)) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(USERS_KEY)) {
      const admin: User = {
        id: 'admin-1',
        name: 'Main Admin',
        email: 'admin@digimart.pro',
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
    }
    if (!localStorage.getItem(ORDERS_KEY)) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
    }
  },

  // Google Identity Login
  loginWithGoogle: async (googlePayload: { name: string, email: string, sub: string }): Promise<User> => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    let user = users.find(u => u.email === googlePayload.email);
    
    if (!user) {
      // Create new user if first time
      user = {
        id: `g-${googlePayload.sub}`,
        name: googlePayload.name,
        email: googlePayload.email,
        role: UserRole.USER,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  login: async (email: string, pass: string): Promise<User | null> => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email);
    if (user) {
      if (user.role === UserRole.ADMIN && pass !== 'admin786') return null;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: async (name: string, email: string): Promise<User> => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: UserRole.USER,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getProducts: async (): Promise<Product[]> => {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  },

  createOrder: async (userId: string, productId: string, productName: string, amount: number, customerPhone: string): Promise<Order> => {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `DIGI-${timestamp}-${random}`;
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId,
      productId,
      productName,
      orderNumber,
      amount,
      customerPhone,
      status: OrderStatus.PENDING,
      paymentMethod: 'WhatsApp',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  },

  getOrders: async (): Promise<Order[]> => {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const orders = await mockService.getOrders();
    return orders.filter(o => o.userId === userId);
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const orders = await mockService.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    
    const updated = { ...orders[index], status };
    orders[index] = updated;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return updated;
  },

  addProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>): Promise<Product> => {
    const products = await mockService.getProducts();
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const products = await mockService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const updated = { ...products[index], ...updates };
    products[index] = updated;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return updated;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const products = await mockService.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  getAllUsers: async (): Promise<User[]> => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }
};
