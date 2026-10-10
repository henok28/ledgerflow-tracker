import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import {
  validateExpenseInput,
  parseDateRangeQuery,
  serializeExpense,
  EXPENSE_CATEGORY_TO_PRISMA,
} from '../_lib/validation.js';
import { ExpenseCategory as PrismaExpenseCategory } from '@prisma/client';
import { ExpenseCategory } from '../_lib/types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { category, startDate, endDate } = req.query;
      const { start, end } = parseDateRangeQuery(startDate as string, endDate as string);

      const whereClause: any = {};

      if (category) {
        const catStr = Array.isArray(category) ? category[0] : category;
        if (catStr in EXPENSE_CATEGORY_TO_PRISMA) {
          whereClause.category = EXPENSE_CATEGORY_TO_PRISMA[catStr as ExpenseCategory];
        } else if (Object.values(PrismaExpenseCategory).includes(catStr as any)) {
          whereClause.category = catStr as PrismaExpenseCategory;
        }
      }

      if (start || end) {
        whereClause.date = {};
        if (start) whereClause.date.gte = start;
        if (end) whereClause.date.lte = end;
      }

      const expenses = await prisma.expense.findMany({
        where: whereClause,
        orderBy: [
          { date: 'desc' },
          { createdAt: 'desc' },
        ],
      });

      return res.status(200).json(expenses.map(serializeExpense));
    }

    if (req.method === 'POST') {
      const validation = validateExpenseInput(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        });
      }

      const { amount, category, description, date } = validation.data!;

      const newExpense = await prisma.expense.create({
        data: {
          amount,
          category,
          description,
          date,
        },
      });

      return res.status(201).json(serializeExpense(newExpense));
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    console.error('Error in /api/expenses:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message || 'An unexpected error occurred',
    });
  }
}
