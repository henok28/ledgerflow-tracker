import {
  ExpenseCategory as PrismaExpenseCategory,
  IncomeChannel as PrismaIncomeChannel,
  Expense as PrismaExpense,
  Income as PrismaIncome,
} from '@prisma/client';
import {
  EXPENSE_CATEGORIES,
  INCOME_CHANNELS,
  ExpenseCategory,
  IncomeChannel,
  ExpenseDTO,
  IncomeDTO,
} from './types.js';

// Mapping from UI String to Prisma Enum
export const EXPENSE_CATEGORY_TO_PRISMA: Record<ExpenseCategory, PrismaExpenseCategory> = {
  "Social Media": PrismaExpenseCategory.SOCIAL_MEDIA,
  "Rent": PrismaExpenseCategory.RENT,
  "Delivery": PrismaExpenseCategory.DELIVERY,
  "Salary": PrismaExpenseCategory.SALARY,
  "Product Cost": PrismaExpenseCategory.PRODUCT_COST,
};

// Mapping from Prisma Enum to UI String
export const PRISMA_TO_EXPENSE_CATEGORY: Record<PrismaExpenseCategory, ExpenseCategory> = {
  [PrismaExpenseCategory.SOCIAL_MEDIA]: "Social Media",
  [PrismaExpenseCategory.RENT]: "Rent",
  [PrismaExpenseCategory.DELIVERY]: "Delivery",
  [PrismaExpenseCategory.SALARY]: "Salary",
  [PrismaExpenseCategory.PRODUCT_COST]: "Product Cost",
};

// Mapping from UI String to Prisma Enum
export const INCOME_CHANNEL_TO_PRISMA: Record<IncomeChannel, PrismaIncomeChannel> = {
  "Instagram": PrismaIncomeChannel.INSTAGRAM,
  "TikTok": PrismaIncomeChannel.TIKTOK,
  "Telegram": PrismaIncomeChannel.TELEGRAM,
  "Facebook": PrismaIncomeChannel.FACEBOOK,
  "Other": PrismaIncomeChannel.OTHER,
};

// Mapping from Prisma Enum to UI String
export const PRISMA_TO_INCOME_CHANNEL: Record<PrismaIncomeChannel, IncomeChannel> = {
  [PrismaIncomeChannel.INSTAGRAM]: "Instagram",
  [PrismaIncomeChannel.TIKTOK]: "TikTok",
  [PrismaIncomeChannel.TELEGRAM]: "Telegram",
  [PrismaIncomeChannel.FACEBOOK]: "Facebook",
  [PrismaIncomeChannel.OTHER]: "Other",
};

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function validateExpenseInput(input: any): ValidationResult<{
  amount: number;
  category: PrismaExpenseCategory;
  description: string | null;
  date: Date;
}> {
  const errors: Record<string, string> = {};

  // Validate amount
  const rawAmount = input?.amount;
  const numAmount = typeof rawAmount === 'string' ? parseFloat(rawAmount) : Number(rawAmount);
  if (rawAmount === undefined || rawAmount === null || rawAmount === '') {
    errors.amount = 'Amount is required.';
  } else if (isNaN(numAmount) || numAmount <= 0) {
    errors.amount = 'Amount must be a positive number greater than 0.';
  }

  // Validate category (supports both "Social Media" and Prisma enum string "SOCIAL_MEDIA")
  let prismaCategory: PrismaExpenseCategory | undefined;
  const rawCategory = input?.category;
  if (!rawCategory) {
    errors.category = `Category is required. Must be one of: ${EXPENSE_CATEGORIES.join(', ')}`;
  } else if (rawCategory in EXPENSE_CATEGORY_TO_PRISMA) {
    prismaCategory = EXPENSE_CATEGORY_TO_PRISMA[rawCategory as ExpenseCategory];
  } else if (Object.values(PrismaExpenseCategory).includes(rawCategory)) {
    prismaCategory = rawCategory as PrismaExpenseCategory;
  } else {
    errors.category = `Invalid category. Must be one of: ${EXPENSE_CATEGORIES.join(', ')}`;
  }

  // Validate date
  let parsedDate = new Date();
  if (input?.date) {
    const d = new Date(input.date);
    if (isNaN(d.getTime())) {
      errors.date = 'Invalid date format. Expected a valid ISO date.';
    } else {
      parsedDate = d;
    }
  }

  // Validate description
  let description: string | null = null;
  if (input?.description !== undefined && input?.description !== null) {
    description = String(input.description).trim() || null;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      amount: numAmount,
      category: prismaCategory!,
      description,
      date: parsedDate,
    },
  };
}

export function validateIncomeInput(input: any): ValidationResult<{
  amount: number;
  channel: PrismaIncomeChannel;
  description: string | null;
  date: Date;
}> {
  const errors: Record<string, string> = {};

  // Validate amount
  const rawAmount = input?.amount;
  const numAmount = typeof rawAmount === 'string' ? parseFloat(rawAmount) : Number(rawAmount);
  if (rawAmount === undefined || rawAmount === null || rawAmount === '') {
    errors.amount = 'Amount is required.';
  } else if (isNaN(numAmount) || numAmount <= 0) {
    errors.amount = 'Amount must be a positive number greater than 0.';
  }

  // Validate channel
  let prismaChannel: PrismaIncomeChannel | undefined;
  const rawChannel = input?.channel;
  if (!rawChannel) {
    errors.channel = `Channel is required. Must be one of: ${INCOME_CHANNELS.join(', ')}`;
  } else if (rawChannel in INCOME_CHANNEL_TO_PRISMA) {
    prismaChannel = INCOME_CHANNEL_TO_PRISMA[rawChannel as IncomeChannel];
  } else if (Object.values(PrismaIncomeChannel).includes(rawChannel)) {
    prismaChannel = rawChannel as PrismaIncomeChannel;
  } else {
    errors.channel = `Invalid channel. Must be one of: ${INCOME_CHANNELS.join(', ')}`;
  }

  // Validate date
  let parsedDate = new Date();
  if (input?.date) {
    const d = new Date(input.date);
    if (isNaN(d.getTime())) {
      errors.date = 'Invalid date format. Expected a valid ISO date.';
    } else {
      parsedDate = d;
    }
  }

  // Validate description
  let description: string | null = null;
  if (input?.description !== undefined && input?.description !== null) {
    description = String(input.description).trim() || null;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      amount: numAmount,
      channel: prismaChannel!,
      description,
      date: parsedDate,
    },
  };
}

export function parseDateRangeQuery(startDate?: string | string[], endDate?: string | string[]) {
  const sStr = Array.isArray(startDate) ? startDate[0] : startDate;
  const eStr = Array.isArray(endDate) ? endDate[0] : endDate;

  let start: Date | undefined;
  let end: Date | undefined;

  if (sStr) {
    const d = new Date(sStr);
    if (!isNaN(d.getTime())) {
      // Normalize to beginning of day UTC if only YYYY-MM-DD
      if (sStr.length === 10) {
        d.setUTCHours(0, 0, 0, 0);
      }
      start = d;
    }
  }

  if (eStr) {
    const d = new Date(eStr);
    if (!isNaN(d.getTime())) {
      // Normalize to end of day UTC if only YYYY-MM-DD
      if (eStr.length === 10) {
        d.setUTCHours(23, 59, 59, 999);
      }
      end = d;
    }
  }

  return { start, end };
}

export function serializeExpense(expense: PrismaExpense): ExpenseDTO {
  return {
    id: expense.id,
    amount: Number(expense.amount),
    category: PRISMA_TO_EXPENSE_CATEGORY[expense.category] ?? (expense.category as unknown as ExpenseCategory),
    description: expense.description,
    date: expense.date.toISOString(),
    createdAt: expense.createdAt.toISOString(),
  };
}

export function serializeIncome(income: PrismaIncome): IncomeDTO {
  return {
    id: income.id,
    amount: Number(income.amount),
    channel: PRISMA_TO_INCOME_CHANNEL[income.channel] ?? (income.channel as unknown as IncomeChannel),
    description: income.description,
    date: income.date.toISOString(),
    createdAt: income.createdAt.toISOString(),
  };
}
