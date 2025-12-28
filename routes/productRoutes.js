import express from 'express';
const router = express.Router();
import { getProducts, getProductById, createProduct, updateProduct } from '../controllers/productController.js';

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct);

export default router;
