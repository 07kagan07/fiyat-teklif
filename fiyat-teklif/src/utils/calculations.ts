import type { QuoteItem } from '../types';

/** unitPrice KDV dahil girilmişse KDV hariç net fiyatı döner */
export function calcNetUnitPrice(item: QuoteItem, priceIncludesVat: boolean): number {
  if (!priceIncludesVat || item.vatRate === 0) return item.unitPrice;
  return item.unitPrice / (1 + item.vatRate / 100);
}

export function calcSubtotal(item: QuoteItem, priceIncludesVat = false): number {
  return item.quantity * calcNetUnitPrice(item, priceIncludesVat);
}

export function calcVat(item: QuoteItem, priceIncludesVat = false): number {
  return calcSubtotal(item, priceIncludesVat) * (item.vatRate / 100);
}

export function calcTotal(item: QuoteItem, priceIncludesVat = false): number {
  return calcSubtotal(item, priceIncludesVat) + calcVat(item, priceIncludesVat);
}

export function calcQuoteTotals(items: QuoteItem[], priceIncludesVat = false) {
  const subtotal = items.reduce((sum, item) => sum + calcSubtotal(item, priceIncludesVat), 0);
  const totalVat = items.reduce((sum, item) => sum + calcVat(item, priceIncludesVat), 0);
  const grandTotal = subtotal + totalVat;
  return { subtotal, totalVat, grandTotal };
}

export function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = symbols[currency] ?? currency;
  return `${symbol}${value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TKL-${year}${month}-${random}`;
}
