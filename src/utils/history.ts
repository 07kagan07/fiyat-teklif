import type { Quote } from '../types';

const HISTORY_KEY = 'fiyat-teklif-history';

export interface QuoteHistoryItem {
  id: string;
  savedAt: string;
  quoteNumber: string;
  customerName: string;
  total: number;
  currency: string;
  data: Quote;
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getQuoteHistory(): QuoteHistoryItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuoteHistoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveHistory(list: QuoteHistoryItem[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function addQuoteToHistory(quote: Quote, total: number): QuoteHistoryItem[] {
  const list = getQuoteHistory();
  const item: QuoteHistoryItem = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    quoteNumber: quote.quoteNumber,
    customerName: quote.customer.name || 'İsimsiz müşteri',
    total,
    currency: quote.currency,
    data: quote,
  };
  const next = [item, ...list].slice(0, 50);
  saveHistory(next);
  return next;
}

export function deleteFromHistory(id: string): QuoteHistoryItem[] {
  const list = getQuoteHistory();
  const next = list.filter((q) => q.id !== id);
  saveHistory(next);
  return next;
}

export function clearHistory(): QuoteHistoryItem[] {
  saveHistory([]);
  return [];
}

