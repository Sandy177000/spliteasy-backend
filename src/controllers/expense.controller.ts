import { Request, Response } from 'express';
import { getPrismaClient } from '../prisma/client';

const prismaClient = getPrismaClient();

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { description, amount, paidById, groupId, splitAmong, currency, notes, imageUrl, category, createdById, shares } = req.body;
    if (!description || !amount || !paidById || !groupId || !splitAmong) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const expense = await prismaClient.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        paidById,
        groupId,
        splitAmong,
        currency,
        notes,
        imageUrl,
        category,
        createdById,
        shares: shares ? { create: shares } : undefined,
      },
      include: { shares: true }
    });
    return res.status(201).json(expense);
  } catch (error: any) {
    console.error('Create expense error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Expense ID is required.' });
    const expense = await prismaClient.expense.findUnique({
      where: { id },
      include: { shares: true }
    });
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });
    return res.status(200).json(expense);
  } catch (error: any) {
    console.error('Get expense by ID error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getExpensesByGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    if (!groupId) return res.status(400).json({ error: 'Group ID is required.' });
    const expenses = await prismaClient.expense.findMany({
      where: { groupId },
      include: { shares: true }
    });
    return res.status(200).json(expenses);
  } catch (error: any) {
    console.error('Get expenses by group error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description, amount, paidById, splitAmong, currency, notes, imageUrl, category, createdById, deleted, settled } = req.body;
    if (!id) return res.status(400).json({ error: 'Expense ID is required.' });
    const expense = await prismaClient.expense.update({
      where: { id },
      data: {
        description,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        paidById,
        splitAmong,
        currency,
        notes,
        imageUrl,
        category,
        createdById,
        deleted,
        settled
      },
      include: { shares: true }
    });
    return res.status(200).json(expense);
  } catch (error: any) {
    console.error('Update expense error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Expense ID is required.' });
    // Delete related shares first
    await prismaClient.share.deleteMany({ where: { expenseId: id } });
    await prismaClient.expense.delete({ where: { id } });
    return res.status(200).json({ message: 'Expense deleted.' });
  } catch (error: any) {
    console.error('Delete expense error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}; 