import { Expense, Income, SummaryData, ExpenseCategory, IncomeChannel } from '../types';

const API_BASE = '/api';

// Initial demo seeds for instant local testing if database is not yet connected
const LOCAL_STORAGE_EXPENSES_KEY = 'kirubels_expenses_v1';
const LOCAL_STORAGE_INCOME_KEY = 'kirubels_income_v1';

function getLocalExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EXPENSES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  // Default sample expenses
  const today = new Date();
  const sample: Expense[] = [
    {
      id: 'e-1',
      amount: 450.00,
      category: 'Product Cost',
      description: 'Artificial hair batch order #104',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e-2',
      amount: 120.00,
      category: 'Social Media',
      description: 'TikTok promotion campaign',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e-3',
      amount: 35.00,
      category: 'Delivery',
      description: 'Motorbike delivery service',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];
  saveLocalExpenses(sample);
  return sample;
}

function saveLocalExpenses(items: Expense[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_EXPENSES_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

function getLocalIncome(): Income[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_INCOME_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  const today = new Date();
  const sample: Income[] = [
    {
      id: 'i-1',
      amount: 720.00,
      channel: 'Instagram',
      description: 'Sold 3 units premium hair extensions',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'i-2',
      amount: 290.00,
      channel: 'TikTok',
      description: 'Direct live stream sale to customer',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'i-3',
      amount: 180.00,
      channel: 'Telegram',
      description: 'VIP group order deposit',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];
  saveLocalIncome(sample);
  return sample;
}

function saveLocalIncome(items: Income[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_INCOME_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const api = {
  // Expenses
  async getExpenses(params?: { category?: string; startDate?: string; endDate?: string }): Promise<Expense[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'ALL') query.set('category', params.category);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);

    const url = `${API_BASE}/expenses${query.toString() ? `?${query.toString()}` : ''}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      return await res.json();
    } catch {
      // Fallback for offline dev
      let items = getLocalExpenses();
      if (params?.category && params.category !== 'ALL') {
        items = items.filter((x) => x.category === params.category);
      }
      if (params?.startDate) {
        const start = new Date(params.startDate).getTime();
        items = items.filter((x) => new Date(x.date).getTime() >= start);
      }
      if (params?.endDate) {
        const end = new Date(params.endDate);
        end.setHours(23, 59, 59, 999);
        items = items.filter((x) => new Date(x.date).getTime() <= end.getTime());
      }
      return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  },

  async createExpense(data: {
    amount: number;
    category: ExpenseCategory;
    description?: string | null;
    date: string;
  }): Promise<Expense> {
    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to create expense (${res.status})`);
      }
      return await res.json();
    } catch {
      // Fallback
      const items = getLocalExpenses();
      const newExpense: Expense = {
        id: 'e-' + Math.random().toString(36).substring(2, 9),
        amount: data.amount,
        category: data.category,
        description: data.description || null,
        date: data.date,
        createdAt: new Date().toISOString(),
      };
      items.unshift(newExpense);
      saveLocalExpenses(items);
      return newExpense;
    }
  },

  async updateExpense(
    id: string,
    data: {
      amount: number;
      category: ExpenseCategory;
      description?: string | null;
      date: string;
    }
  ): Promise<Expense> {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to update expense (${res.status})`);
      }
      return await res.json();
    } catch {
      const items = getLocalExpenses();
      const idx = items.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error('Expense not found');
      items[idx] = {
        ...items[idx],
        amount: data.amount,
        category: data.category,
        description: data.description || null,
        date: data.date,
      };
      saveLocalExpenses(items);
      return items[idx];
    }
  },

  async deleteExpense(id: string): Promise<{ message: string; id: string }> {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`Failed to delete expense (${res.status})`);
      }
      return await res.json();
    } catch {
      let items = getLocalExpenses();
      items = items.filter((x) => x.id !== id);
      saveLocalExpenses(items);
      return { message: 'Deleted locally', id };
    }
  },

  // Income
  async getIncome(params?: { channel?: string; startDate?: string; endDate?: string }): Promise<Income[]> {
    const query = new URLSearchParams();
    if (params?.channel && params.channel !== 'ALL') query.set('channel', params.channel);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);

    const url = `${API_BASE}/income${query.toString() ? `?${query.toString()}` : ''}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      return await res.json();
    } catch {
      let items = getLocalIncome();
      if (params?.channel && params.channel !== 'ALL') {
        items = items.filter((x) => x.channel === params.channel);
      }
      if (params?.startDate) {
        const start = new Date(params.startDate).getTime();
        items = items.filter((x) => new Date(x.date).getTime() >= start);
      }
      if (params?.endDate) {
        const end = new Date(params.endDate);
        end.setHours(23, 59, 59, 999);
        items = items.filter((x) => new Date(x.date).getTime() <= end.getTime());
      }
      return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  },

  async createIncome(data: {
    amount: number;
    channel: IncomeChannel;
    description?: string | null;
    date: string;
  }): Promise<Income> {
    try {
      const res = await fetch(`${API_BASE}/income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to create income (${res.status})`);
      }
      return await res.json();
    } catch {
      const items = getLocalIncome();
      const newIncome: Income = {
        id: 'i-' + Math.random().toString(36).substring(2, 9),
        amount: data.amount,
        channel: data.channel,
        description: data.description || null,
        date: data.date,
        createdAt: new Date().toISOString(),
      };
      items.unshift(newIncome);
      saveLocalIncome(items);
      return newIncome;
    }
  },

  async updateIncome(
    id: string,
    data: {
      amount: number;
      channel: IncomeChannel;
      description?: string | null;
      date: string;
    }
  ): Promise<Income> {
    try {
      const res = await fetch(`${API_BASE}/income/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to update income (${res.status})`);
      }
      return await res.json();
    } catch {
      const items = getLocalIncome();
      const idx = items.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error('Income not found');
      items[idx] = {
        ...items[idx],
        amount: data.amount,
        channel: data.channel,
        description: data.description || null,
        date: data.date,
      };
      saveLocalIncome(items);
      return items[idx];
    }
  },

  async deleteIncome(id: string): Promise<{ message: string; id: string }> {
    try {
      const res = await fetch(`${API_BASE}/income/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`Failed to delete income (${res.status})`);
      }
      return await res.json();
    } catch {
      let items = getLocalIncome();
      items = items.filter((x) => x.id !== id);
      saveLocalIncome(items);
      return { message: 'Deleted locally', id };
    }
  },

  // Summary
  async getSummary(params?: { startDate?: string; endDate?: string }): Promise<SummaryData> {
    const query = new URLSearchParams();
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);

    const url = `${API_BASE}/summary${query.toString() ? `?${query.toString()}` : ''}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      return await res.json();
    } catch {
      const expenses = await this.getExpenses(params);
      const income = await this.getIncome(params);

      const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
      const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
      const netProfit = Number((totalIncome - totalExpense).toFixed(2));

      return {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        netProfit,
        incomeCount: income.length,
        expenseCount: expenses.length,
        filter: {
          startDate: params?.startDate,
          endDate: params?.endDate,
        },
      };
    }
  },
};
