import { DatePreset } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) return 'Today';

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return 'Yesterday';

    return formatDate(dateStr);
  } catch {
    return dateStr;
  }
}

export function toInputDateFormat(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDateRangeForPreset(preset: DatePreset): { startDate: string; endDate: string } {
  const now = new Date();
  const todayStr = toInputDateFormat(now);

  switch (preset) {
    case 'TODAY':
      return { startDate: todayStr, endDate: todayStr };

    case 'LAST_30_DAYS': {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      return { startDate: toInputDateFormat(past), endDate: todayStr };
    }

    case 'THIS_MONTH': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: toInputDateFormat(startOfMonth), endDate: todayStr };
    }

    case 'THIS_YEAR': {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return { startDate: toInputDateFormat(startOfYear), endDate: todayStr };
    }

    case 'ALL_TIME':
    case 'CUSTOM':
    default:
      return { startDate: '', endDate: '' };
  }
}
