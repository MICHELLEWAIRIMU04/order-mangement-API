import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

// Auth Validators
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Customer Validators
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const customerQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

// Order Validators
export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  total: z.number().positive('Total must be a positive number'),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  notes: z.string().optional(),
});

export const updateOrderSchema = z.object({
  total: z.number().positive('Total must be a positive number').optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  notes: z.string().optional(),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.nativeEnum(OrderStatus).optional(),
  customerId: z.string().optional(),
});