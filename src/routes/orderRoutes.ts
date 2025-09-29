import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticate } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const orderController = new OrderController();

router.use(authenticate);

router.post('/', asyncHandler(orderController.createOrder.bind(orderController)));
router.get('/', asyncHandler(orderController.getOrders.bind(orderController)));
router.get('/:id', asyncHandler(orderController.getOrderById.bind(orderController)));
router.put('/:id', asyncHandler(orderController.updateOrder.bind(orderController)));
router.delete('/:id', asyncHandler(orderController.deleteOrder.bind(orderController)));

export { router as orderRoutes };