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

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string | null;
  date: string; // ISO date string
  createdAt: string;
}

export interface Income {
  id: string;
  amount: number;
  channel: IncomeChannel;
  description: string | null;
  date: string; // ISO date string
  createdAt: string;
}

export type TransactionType = 'expense' | 'income';

export type Transaction =
  | (Expense & { type: 'expense' })
  | (Income & { type: 'income' });

export interface SummaryData {
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

export type DatePreset = 'THIS_MONTH' | 'LAST_30_DAYS' | 'TODAY' | 'THIS_YEAR' | 'ALL_TIME' | 'CUSTOM';

export type TypeFilter = 'ALL' | 'INCOME' | 'EXPENSE';

export interface FilterState {
  type: TypeFilter;
  category: string; // 'ALL' or specific ExpenseCategory
  channel: string;  // 'ALL' or specific IncomeChannel
  datePreset: DatePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  searchQuery: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface DeleteConfirmModalState {
  isOpen: boolean;
  type: 'expense' | 'income';
  id: string;
  title: string;
  amount: number;
}
