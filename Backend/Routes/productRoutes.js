import express from 'express';
import { addProduct, getProducts, updateProduct, deleteProduct } from '../Controllers/ProductController.js';

const router = express.Router();

// Add a new product
router.post('/', addProduct);

// Get all products
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router; 