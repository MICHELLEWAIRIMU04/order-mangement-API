import { OrderStatus } from '@prisma/client';

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
