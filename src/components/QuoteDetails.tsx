import type { Quote } from '../types';

interface Props {
  quote: Quote;
  onChange: (quote: Quote) => void;
}

const CURRENCIES = ['TRY', 'USD', 'EUR', 'GBP'];

export default function QuoteDetails({ quote, onChange }: Props) {
  const update = <K extends keyof Quote>(field: K, value: Quote[K]) => {
    onChange({ ...quote, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center font-bold">3</span>
        Teklif Detayları
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teklif No</label>
          <input
            type="text"
            value={quote.quoteNumber}
            onChange={(e) => update('quoteNumber', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teklif Tarihi</label>
          <input
            type="date"
            value={quote.date}
            onChange={(e) => update('date', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Geçerlilik Tarihi</label>
          <input
            type="date"
            value={quote.validUntil}
            onChange={(e) => update('validUntil', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
          <select
            value={quote.currency}
            onChange={(e) => update('currency', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Koşulları</label>
          <input
            type="text"
            value={quote.paymentTerms}
            onChange={(e) => update('paymentTerms', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: 30 gün vadeli"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={quote.showVat}
              onChange={(e) => update('showVat', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">KDV Göster</span>
          </label>
          {quote.showVat && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quote.priceIncludesVat}
                onChange={(e) => update('priceIncludesVat', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Fiyatlar KDV Dahil</span>
            </label>
          )}
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notlar / Açıklamalar</label>
          <textarea
            value={quote.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Ek bilgi veya notlar..."
          />
        </div>
      </div>
    </div>
  );
}
