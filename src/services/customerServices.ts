import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { CreateCustomerData, UpdateCustomerData, CustomerQueryParams } from '../types/customer';

export class CustomerService {
  private prisma = new PrismaClient();

  async createCustomer(customerData: CreateCustomerData) {
    try {
      // Check if customer with email already exists
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email: customerData.email },
      });

      if (existingCustomer) {
        throw new ApiError(409, 'CUSTOMER_EXISTS', 'Customer with this email already exists');
      }

      return await this.prisma.customer.create({
        data: customerData,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('Database error while creating customer');
    }
  }

  async getCustomers(params: CustomerQueryParams) {
    try {
      const { page = 1, limit = 10, search } = params;
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [customers, total] = await Promise.all([
        this.prisma.customer.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            orders: {
              select: {
                id: true,
                orderNumber: true,
                status: true,
                total: true,
                createdAt: true,
              },
            },
          },
        }),
        this.prisma.customer.count({ where }),
      ]);

      return {
        items: customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Database error while retrieving customers');
    }
  }

  async getCustomerById(id: string) {
    try {
      return await this.prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              total: true,
              notes: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } catch (error) {
      throw new Error('Database error while retrieving customer');
    }
  }

  async updateCustomer(id: string, updateData: UpdateCustomerData) {
    try {
      // Check if customer exists
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { id },
      });

      if (!existingCustomer) {
        throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer not found');
      }

      // If email is being updated, check if it's already taken by another customer
      if (updateData.email && updateData.email !== existingCustomer.email) {
        const emailTaken = await this.prisma.customer.findUnique({
          where: { email: updateData.email },
        });

        if (emailTaken) {
          throw new ApiError(409, 'EMAIL_TAKEN', 'Email is already taken by another customer');
        }
      }

      return await this.prisma.customer.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('Database error while updating customer');
    }
  }

  async deleteCustomer(id: string) {
    try {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { id },
      });

      if (!existingCustomer) {
        throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer not found');
      }

      // Delete customer (orders will be cascade deleted due to schema configuration)
      return await this.prisma.customer.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('Database error while deleting customer');
    }
  }
}