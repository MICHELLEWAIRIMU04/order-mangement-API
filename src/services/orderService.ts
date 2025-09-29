import { PrismaClient, OrderStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { CreateOrderData, UpdateOrderData, OrderQueryParams } from '../types/order';

export class OrderService {
  private prisma = new PrismaClient();

  async createOrder(orderData: CreateOrderData) {
    try {
      // Check if customer exists
      const customer = await this.prisma.customer.findUnique({
        where: { id: orderData.customerId },
      });

      if (!customer) {
        throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer not found');
      }

      return await this.prisma.order.create({
        data: orderData,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('Database error while creating order');
    }
  }

  async getOrders(params: OrderQueryParams) {
    try {
      const { page = 1, limit = 10, status, customerId } = params;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (customerId) {
        where.customerId = customerId;
      }

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        }),
        this.prisma.order.count({ where }),
      ]);

      return {
        items: orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Database error while retrieving orders');
    }
  }

  async getOrderById(id: string) {
    try {
      return await this.prisma.order.findUnique({
        where: { id },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error('Database error while retrieving order');
    }
  }

  async updateOrder(id: string, updateData: UpdateOrderData) {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        throw new ApiError(404, 'ORDER_NOT_FOUND', 'Order not found');
      }

      return await this.prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('Database error while updating order');
    }
  }

  async deleteOrder(id: string) {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        throw new ApiError(404, 'ORDER_NOT_FOUND', 'Order not found');
      }

      return await this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('Database error while deleting order');
    }
  }
}