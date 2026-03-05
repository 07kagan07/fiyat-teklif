export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
  logo?: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
}

export interface Quote {
  quoteNumber: string;
  date: string;
  validUntil: string;
  currency: string;
  company: CompanyInfo;
  customer: CustomerInfo;
  items: QuoteItem[];
  notes: string;
  paymentTerms: string;
  showVat: boolean;
  priceIncludesVat: boolean;
}
