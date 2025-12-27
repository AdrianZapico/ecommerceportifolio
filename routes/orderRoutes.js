import express from 'express';
const router = express.Router();
import { getOrders, getOrderById } from '../controllers/orderController.js';

router.route('/').get(getOrders);
router.route('/:id').get(getOrderById);

export default router;
