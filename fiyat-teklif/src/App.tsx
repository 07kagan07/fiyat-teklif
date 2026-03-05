import { useState } from 'react';
import { FileDown, Eye, EyeOff, RefreshCw, Save } from 'lucide-react';
import type { Quote } from './types';
import { generateQuoteNumber } from './utils/calculations';
import { exportToPDF } from './utils/pdfExport';
import { loadSavedQuote, useAutoSave } from './hooks/useAutoSave';
import CompanyForm from './components/CompanyForm';
import CustomerForm from './components/CustomerForm';
import QuoteDetails from './components/QuoteDetails';
import ItemsTable from './components/ItemsTable';
import QuotePreview from './components/QuotePreview';

const today = new Date().toISOString().split('T')[0];
const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const defaultQuote: Quote = {
  quoteNumber: generateQuoteNumber(),
  date: today,
  validUntil,
  currency: 'TRY',
  company: { name: '', address: '', phone: '', email: '', taxNumber: '' },
  customer: { name: '', address: '', phone: '', email: '', contactPerson: '' },
  items: [],
  notes: '',
  paymentTerms: '',
  showVat: true,
  priceIncludesVat: false,
};

function getInitialQuote(): Quote {
  const saved = loadSavedQuote<Quote>();
  return saved ?? defaultQuote;
}

export default function App() {
  const [quote, setQuote] = useState<Quote>(getInitialQuote);
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { savedAt } = useAutoSave(quote);

  const handleExport = async () => {
    setShowPreview(true);
    setExporting(true);
    await new Promise((r) => setTimeout(r, 300));
    try {
      await exportToPDF('quote-preview', `Teklif-${quote.quoteNumber}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Tüm bilgileri sıfırlamak istediğinizden emin misiniz?')) {
      const fresh = { ...defaultQuote, quoteNumber: generateQuoteNumber() };
      setQuote(fresh);
      localStorage.removeItem('fiyat-teklif-data');
      setShowPreview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <span className="font-semibold text-gray-800 text-lg">Fiyat Teklifi Oluşturucu</span>
          </div>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-green-600">
                <Save size={12} />
                {savedAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} kaydedildi
              </span>
            )}
            <button
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? 'Formu Göster' : 'Önizle'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Sıfırla
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileDown size={16} />
              {exporting ? 'Oluşturuluyor...' : 'PDF İndir'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {!showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CompanyForm company={quote.company} onChange={(c) => setQuote({ ...quote, company: c })} />
            <CustomerForm customer={quote.customer} onChange={(c) => setQuote({ ...quote, customer: c })} />
            <div className="lg:col-span-2">
              <QuoteDetails quote={quote} onChange={setQuote} />
            </div>
            <div className="lg:col-span-2">
              <ItemsTable
                items={quote.items}
                currency={quote.currency}
                showVat={quote.showVat}
                priceIncludesVat={quote.priceIncludesVat}
                onChange={(items) => setQuote({ ...quote, items })}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="shadow-xl rounded-lg overflow-hidden border border-gray-200">
              <QuotePreview quote={quote} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
