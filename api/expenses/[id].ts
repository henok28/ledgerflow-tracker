import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { validateExpenseInput, serializeExpense } from '../_lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const expenseId = Array.isArray(id) ? id[0] : id;

  if (!expenseId || typeof expenseId !== 'string') {
    return res.status(400).json({ error: 'Valid Expense ID is required' });
  }

  try {
    if (req.method === 'GET') {
      const expense = await prisma.expense.findUnique({
        where: { id: expenseId },
      });

      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      return res.status(200).json(serializeExpense(expense));
    }

    if (req.method === 'PUT') {
      // Check existence
      const existing = await prisma.expense.findUnique({
        where: { id: expenseId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      const validation = validateExpenseInput(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        });
      }

      const { amount, category, description, date } = validation.data!;

      const updatedExpense = await prisma.expense.update({
        where: { id: expenseId },
        data: {
          amount,
          category,
          description,
          date,
        },
      });

      return res.status(200).json(serializeExpense(updatedExpense));
    }

    if (req.method === 'DELETE') {
      const existing = await prisma.expense.findUnique({
        where: { id: expenseId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      await prisma.expense.delete({
        where: { id: expenseId },
      });

      return res.status(200).json({
        message: 'Expense deleted successfully',
        id: expenseId,
      });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    console.error(`Error in /api/expenses/${expenseId}:`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message || 'An unexpected error occurred',
    });
  }
}
