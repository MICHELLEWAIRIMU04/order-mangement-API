import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticate } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const customerController = new CustomerController();

router.use(authenticate);

router.post('/', asyncHandler(customerController.createCustomer.bind(customerController)));
router.get('/', asyncHandler(customerController.getCustomers.bind(customerController)));
router.get('/:id', asyncHandler(customerController.getCustomerById.bind(customerController)));
router.put('/:id', asyncHandler(customerController.updateCustomer.bind(customerController)));
router.delete('/:id', asyncHandler(customerController.deleteCustomer.bind(customerController)));

export { router as customerRoutes };