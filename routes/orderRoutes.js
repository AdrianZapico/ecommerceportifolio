import express from 'express';
const router = express.Router();
import { getOrders, getOrderById, addOrderItems } from '../controllers/orderController.js';

router.route('/').get(getOrders).post(addOrderItems);
router.route('/:id').get(getOrderById);

export default router;
