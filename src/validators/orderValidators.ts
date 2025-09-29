import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

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