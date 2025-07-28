// routes/employeeRoutes.js
import express from 'express';
import {
  addEmployee,
  getEmployees,
  deleteEmployee,
  updateEmployee,
  assignStock,
  getAssignedStock,
  returnStock
} from '../Controllers/employeeController.js';

const router = express.Router();

router.get('/', getEmployees);
router.post('/', addEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.post('/assign-stock', assignStock);
router.get('/assigned-stock', getAssignedStock);
router.post('/return-stock', returnStock);

export default router;
