import express from 'express';
const router = express.Router();
import { getOrders, getOrderById, addOrderItems, updateOrder, deleteOrder } from '../controllers/orderController.js';

router.route('/').get(getOrders).post(addOrderItems);
router.route('/:id').get(getOrderById).put(updateOrder).delete(deleteOrder);

export default router;
