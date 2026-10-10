import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { validateIncomeInput, serializeIncome } from '../_lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const incomeId = Array.isArray(id) ? id[0] : id;

  if (!incomeId || typeof incomeId !== 'string') {
    return res.status(400).json({ error: 'Valid Income ID is required' });
  }

  try {
    if (req.method === 'GET') {
      const income = await prisma.income.findUnique({
        where: { id: incomeId },
      });

      if (!income) {
        return res.status(404).json({ error: 'Income entry not found' });
      }

      return res.status(200).json(serializeIncome(income));
    }

    if (req.method === 'PUT') {
      const existing = await prisma.income.findUnique({
        where: { id: incomeId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Income entry not found' });
      }

      const validation = validateIncomeInput(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        });
      }

      const { amount, channel, description, date } = validation.data!;

      const updatedIncome = await prisma.income.update({
        where: { id: incomeId },
        data: {
          amount,
          channel,
          description,
          date,
        },
      });

      return res.status(200).json(serializeIncome(updatedIncome));
    }

    if (req.method === 'DELETE') {
      const existing = await prisma.income.findUnique({
        where: { id: incomeId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Income entry not found' });
      }

      await prisma.income.delete({
        where: { id: incomeId },
      });

      return res.status(200).json({
        message: 'Income entry deleted successfully',
        id: incomeId,
      });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    console.error(`Error in /api/income/${incomeId}:`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message || 'An unexpected error occurred',
    });
  }
}
