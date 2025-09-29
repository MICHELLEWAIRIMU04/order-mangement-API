import { Request, Response } from 'express';
import { CustomerService } from '../services/customerServices';
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
} from '../validators/customerValidators';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export class CustomerController {
  private customerService = new CustomerService();

  /**
   * @swagger
   * /api/customers:
   *   post:
   *     summary: Create a new customer
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               phone:
   *                 type: string
   *                 example: +1234567890
   *               address:
   *                 type: string
   *                 example: 123 Main St, City, State
   *     responses:
   *       201:
   *         description: Customer created successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       409:
   *         description: Customer with email already exists
   */
  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerData = createCustomerSchema.parse(req.body);
      const customer = await this.customerService.createCustomer(customerData);

      logger.info(`Customer created: ${customer.id}`);

      res.status(201).json({
        success: true,
        data: customer,
        message: 'Customer created successfully',
      });
    } catch (error) {
      logger.error('Create customer error:', error);
      throw error;
    }
  }

  /**
   * @swagger
   * /api/customers:
   *   get:
   *     summary: Get all customers with pagination
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by name or email
   *     responses:
   *       200:
   *         description: Customers retrieved successfully
   */
  async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = customerQuerySchema.parse(req.query);
      const result = await this.customerService.getCustomers(queryParams);

      res.json({
        success: true,
        data: result,
        message: 'Customers retrieved successfully',
      });
    } catch (error) {
      logger.error('Get customers error:', error);
      throw error;
    }
  }

  /**
   * @swagger
   * /api/customers/{id}:
   *   get:
   *     summary: Get customer by ID
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Customer retrieved successfully
   *       404:
   *         description: Customer not found
   */
  async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomerById(id);

      if (!customer) {
        throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer not found');
      }

      res.json({
        success: true,
        data: customer,
        message: 'Customer retrieved successfully',
      });
    } catch (error) {
      logger.error('Get customer by ID error:', error);
      throw error;
    }
  }

  /**
   * @swagger
   * /api/customers/{id}:
   *   put:
   *     summary: Update customer
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               phone:
   *                 type: string
   *               address:
   *                 type: string
   *     responses:
   *       200:
   *         description: Customer updated successfully
   *       404:
   *         description: Customer not found
   */
  async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = updateCustomerSchema.parse(req.body);
      
      const customer = await this.customerService.updateCustomer(id, updateData);

      logger.info(`Customer updated: ${id}`);

      res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully',
      });
    } catch (error) {
      logger.error('Update customer error:', error);
      throw error;
    }
  }

  /**
   * @swagger
   * /api/customers/{id}:
   *   delete:
   *     summary: Delete customer
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Customer deleted successfully
   *       404:
   *         description: Customer not found
   */
  async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.customerService.deleteCustomer(id);

      logger.info(`Customer deleted: ${id}`);

      res.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      logger.error('Delete customer error:', error);
      throw error;
    }
  }
}