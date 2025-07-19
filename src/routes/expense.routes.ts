import { Router } from 'express';
import { createExpense, getExpenseById, getExpensesByGroup, updateExpense, deleteExpense } from '../controllers/expense.controller';

const router = Router();

router.post('/create', createExpense);
router.get('/:id', getExpenseById);
router.get('/group/:groupId', getExpensesByGroup);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router; 