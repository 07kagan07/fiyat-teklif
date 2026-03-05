import { Clock, Trash2, RotateCcw, List } from 'lucide-react';
import type { QuoteHistoryItem } from '../utils/history';

interface Props {
  items: QuoteHistoryItem[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export default function QuoteHistory({ items, onSelect, onDelete, onClear }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-3xl w-full">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <List size={15} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">Geçmiş Teklifler</span>
            {items.length > 0 ? (
              <span className="text-xs text-gray-500 hidden sm:inline">
                Son {items.length} kaydedilmiş teklifi buradan tekrar açabilirsiniz.
              </span>
            ) : (
              <span className="text-xs text-gray-400 hidden sm:inline">
                Henüz kaydedilmiş teklif yok.
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
        >
          Tümünü temizle
        </button>
      </div>

      {items.length > 0 ? (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Tarih</th>
                <th className="px-3 py-2 text-left">Teklif No</th>
                <th className="px-3 py-2 text-left">Müşteri</th>
                <th className="px-3 py-2 text-right">Tutar</th>
                <th className="px-2 py-2 text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const d = new Date(item.savedAt);
                const dateText = isNaN(d.getTime())
                  ? '-'
                  : `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`;
                const total = `${item.currency} ${item.total.toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
                return (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
                        <Clock size={11} />
                        {dateText}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">{item.quoteNumber}</td>
                    <td className="px-3 py-2 text-gray-700 truncate max-w-[140px] sm:max-w-xs">
                      {item.customerName}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs sm:text-sm text-gray-800">{total}</td>
                    <td className="px-2 py-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelect(item.id)}
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-lg mr-1"
                      >
                        <RotateCcw size={12} />
                        Aç
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="inline-flex items-center text-gray-300 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-xs text-gray-400">
          Henüz geçmişte kayıtlı teklif bulunmuyor. Üst menüden <strong>“Teklifi Kaydet”</strong> ile ekleyebilirsiniz.
        </div>
      )}
    </div>
  );
}

