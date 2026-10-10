export const EXPENSE_CATEGORIES = [
  "Social Media",
  "Rent",
  "Delivery",
  "Salary",
  "Product Cost",
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const INCOME_CHANNELS = [
  "Instagram",
  "TikTok",
  "Telegram",
  "Facebook",
  "Other",
] as const;

export type IncomeChannel = typeof INCOME_CHANNELS[number];

export interface ExpenseDTO {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string | null;
  date: string; // ISO string
  createdAt: string;
}

export interface IncomeDTO {
  id: string;
  amount: number;
  channel: IncomeChannel;
  description: string | null;
  date: string; // ISO string
  createdAt: string;
}

export interface SummaryDTO {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  incomeCount: number;
  expenseCount: number;
  filter: {
    startDate?: string;
    endDate?: string;
  };
}

export interface ApiErrorResponse {
  error: string;
  details?: Record<string, string[] | string>;
}
