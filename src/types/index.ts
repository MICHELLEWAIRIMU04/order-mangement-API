import { OrderStatus } from '@prisma/client';

// Auth Types
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

// Customer Types
export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Order Types
export interface CreateOrderData {
  customerId: string;
  total: number;
  status?: OrderStatus;
  notes?: string;
}

export interface UpdateOrderData {
  total?: number;
  status?: OrderStatus;
  notes?: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}