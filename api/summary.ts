import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './_lib/prisma.js';
import { parseDateRangeQuery } from './_lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { startDate, endDate } = req.query;
    const { start, end } = parseDateRangeQuery(startDate as string, endDate as string);

    const dateFilter: any = {};
    if (start || end) {
      if (start) dateFilter.gte = start;
      if (end) dateFilter.lte = end;
    }

    const expenseWhere = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};
    const incomeWhere = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};

    // Execute parallel aggregates for maximum serverless speed
    const [expenseAggregate, incomeAggregate, expenseCount, incomeCount] = await Promise.all([
      prisma.expense.aggregate({
        where: expenseWhere,
        _sum: {
          amount: true,
        },
      }),
      prisma.income.aggregate({
        where: incomeWhere,
        _sum: {
          amount: true,
        },
      }),
      prisma.expense.count({ where: expenseWhere }),
      prisma.income.count({ where: incomeWhere }),
    ]);

    const totalExpense = expenseAggregate._sum.amount ? Number(expenseAggregate._sum.amount) : 0;
    const totalIncome = incomeAggregate._sum.amount ? Number(incomeAggregate._sum.amount) : 0;
    const netProfit = Number((totalIncome - totalExpense).toFixed(2));

    return res.status(200).json({
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
      netProfit,
      incomeCount,
      expenseCount,
      filter: {
        startDate: start ? start.toISOString() : undefined,
        endDate: end ? end.toISOString() : undefined,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/summary:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message || 'An unexpected error occurred',
    });
  }
}
