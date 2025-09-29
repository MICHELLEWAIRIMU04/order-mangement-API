import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import {
  createOrderSchema,
  updateOrderSchema,
  orderQuerySchema,
} from '../validators/orderValidators';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export class OrderController {
  private orderService = new OrderService();

  /**
   * @swagger
   * /api/orders:
   *   post:
   *     summary: Create a new order
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - customerId
   *               - total
   *             properties:
   *               customerId:
   *                 type: string
   *                 example: clp1234567890
   *               total:
   *                 type: number
   *                 format: decimal
   *                 example: 99.99
   *               status:
   *                 type: string
   *                 enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
   *                 example: PENDING
   *               notes:
   *                 type: string
   *                 example: Special delivery instructions
   *     responses:
   *       201:
   *         description: Order created successfully
   *       400:
   *         description: Validation error
   *       404:
   *         description: Customer not found
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData = createOrderSchema.parse(req.body);
      const order = await this.orderService.createOrder(orderData);

      logger.info(`Order created: ${order.id}`);

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully',
      });
    } catch (error) {
      logger.error('Create order error:', error);
      throw error;
    }
  }

  /**
   * @swagger
   * /api/orders:
   *   get:
   *     summary: Get all orders with pagination and filtering
   *     tags: [Orders]
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
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
   *       - in: query
   *         name: customerId
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Orders retrieved successfully
   */
  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = orderQuerySchema.parse(req.query);
      const result = await this.orderService.getOrders(queryParams);

      res.json({
        success: true,
        data: result,
        message: 'Orders retrieved successfully',
      });
    } catch (error) {
      logger.error('Get orders error:', error);
      throw error;
    }
  }

  /**
   * @swagger
   * /api/orders/{id}:
   *   get:
   *     summary: Get order by ID
   *     tags: [Orders]
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
   *         description: Order retrieved successfully
   *       404:
   *         description: Order not found
   */
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        throw new ApiError(404, 'ORDER_NOT_FOUND', 'Order not found');
      }

      res.json({
        success: true,
        data: order,
        message: 'Order retrieved successfully',
      });
    } catch (error) {
      logger.error('Get order by ID error:', error);
      throw error;
    }
  }

  /**
   * @swagger
   * /api/orders/{id}:
   *   put:
   *     summary: Update order
   *     tags: [Orders]
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
   *               total:
   *                 type: number
   *                 format: decimal
   *               status:
   *                 type: string
   *                 enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Order updated successfully
   *       404:
   *         description: Order not found
   */
  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = updateOrderSchema.parse(req.body);
      
      const order = await this.orderService.updateOrder(id, updateData);

      logger.info(`Order updated: ${id}`);

      res.json({
        success: true,
        data: order,
        message: 'Order updated successfully',
      });
    } catch (error) {
      logger.error('Update order error:', error);
      throw error;
    }
  }

  /**
   * @swagger
   * /api/orders/{id}:
   *   delete:
   *     summary: Delete order
   *     tags: [Orders]
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
   *         description: Order deleted successfully
   *       404:
   *         description: Order not found
   */
  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.orderService.deleteOrder(id);

      logger.info(`Order deleted: ${id}`);

      res.json({
        success: true,
        message: 'Order deleted successfully',
      });
    } catch (error) {
      logger.error('Delete order error:', error);
      throw error;
    }
  }
}