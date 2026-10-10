import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import {
  validateIncomeInput,
  parseDateRangeQuery,
  serializeIncome,
  INCOME_CHANNEL_TO_PRISMA,
} from '../_lib/validation.js';
import { IncomeChannel as PrismaIncomeChannel } from '@prisma/client';
import { IncomeChannel } from '../_lib/types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { channel, startDate, endDate } = req.query;
      const { start, end } = parseDateRangeQuery(startDate as string, endDate as string);

      const whereClause: any = {};

      if (channel) {
        const chanStr = Array.isArray(channel) ? channel[0] : channel;
        if (chanStr in INCOME_CHANNEL_TO_PRISMA) {
          whereClause.channel = INCOME_CHANNEL_TO_PRISMA[chanStr as IncomeChannel];
        } else if (Object.values(PrismaIncomeChannel).includes(chanStr as any)) {
          whereClause.channel = chanStr as PrismaIncomeChannel;
        }
      }

      if (start || end) {
        whereClause.date = {};
        if (start) whereClause.date.gte = start;
        if (end) whereClause.date.lte = end;
      }

      const incomeList = await prisma.income.findMany({
        where: whereClause,
        orderBy: [
          { date: 'desc' },
          { createdAt: 'desc' },
        ],
      });

      return res.status(200).json(incomeList.map(serializeIncome));
    }

    if (req.method === 'POST') {
      const validation = validateIncomeInput(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        });
      }

      const { amount, channel, description, date } = validation.data!;

      const newIncome = await prisma.income.create({
        data: {
          amount,
          channel,
          description,
          date,
        },
      });

      return res.status(201).json(serializeIncome(newIncome));
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    console.error('Error in /api/income:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message || 'An unexpected error occurred',
    });
  }
}
