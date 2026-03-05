import { useRef, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { QuoteItem } from '../types';
import { calcSubtotal, calcVat, calcTotal, formatCurrency } from '../utils/calculations';

interface Props {
  items: QuoteItem[];
  currency: string;
  showVat: boolean;
  priceIncludesVat: boolean;
  onChange: (items: QuoteItem[]) => void;
}

const UNITS = ['Adet', 'Kg', 'Metre', 'M²', 'M³', 'Litre', 'Saat', 'Gün', 'Ay', 'Paket', 'Set'];
const VAT_RATES = [0, 1, 10, 20];

function newItem(): QuoteItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unit: 'Adet',
    unitPrice: 0,
    vatRate: 20,
  };
}

export default function ItemsTable({ items, currency, showVat, priceIncludesVat, onChange }: Props) {
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addItem = () => onChange([...items, newItem()]);
  const removeItem = (id: string) => onChange(items.filter((i) => i.id !== id));
  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex.current === null || dragIndex.current === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(dropIndex, 0, moved);
    onChange(reordered);
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center font-bold">4</span>
        Ürün / Hizmet Listesi
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="px-2 py-2 rounded-l-lg" style={{ width: 28 }}></th>
              <th className="text-left px-3 py-2 font-medium" style={{ minWidth: 240 }}>Açıklama</th>
              <th className="text-center px-3 py-2 font-medium" style={{ width: 80 }}>Miktar</th>
              <th className="text-center px-3 py-2 font-medium" style={{ width: 100 }}>Birim</th>
              <th className="text-right px-3 py-2 font-medium" style={{ width: 130 }}>
                Birim Fiyat {showVat && <span className="text-xs font-normal opacity-70">({priceIncludesVat ? 'KDV Dahil' : 'KDV Hariç'})</span>}
              </th>
              {showVat && <th className="text-center px-3 py-2 font-medium" style={{ width: 90 }}>KDV %</th>}
              {showVat && <th className="text-right px-3 py-2 font-medium" style={{ width: 110 }}>Ara Toplam</th>}
              {showVat && <th className="text-right px-3 py-2 font-medium" style={{ width: 100 }}>KDV</th>}
              <th className="text-right px-3 py-2 font-medium" style={{ width: 120 }}>Toplam</th>
              <th className="px-3 py-2 rounded-r-lg" style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const isDragOver = dragOverIndex === index;
              const isDragging = dragIndex.current === index;
              return (
                <tr
                  key={item.id}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  className={[
                    'transition-colors',
                    isDragging ? 'opacity-40' : '',
                    isDragOver ? 'bg-blue-50 border-t-2 border-blue-400' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50',
                  ].join(' ')}
                >
                  <td className="px-2 py-2 text-center">
                    <span
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnd={handleDragEnd}
                      className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing inline-flex"
                      title="Sürükleyerek sırala"
                    >
                      <GripVertical size={16} />
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ürün veya hizmet açıklaması"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  {showVat && (
                    <td className="px-3 py-2">
                      <select
                        value={item.vatRate}
                        onChange={(e) => updateItem(item.id, 'vatRate', parseInt(e.target.value))}
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {VAT_RATES.map((r) => <option key={r} value={r}>%{r}</option>)}
                      </select>
                    </td>
                  )}
                  {showVat && (
                    <td className="px-3 py-2 text-right text-gray-700 font-mono text-xs">
                      {formatCurrency(calcSubtotal(item, priceIncludesVat), currency)}
                    </td>
                  )}
                  {showVat && (
                    <td className="px-3 py-2 text-right text-gray-500 font-mono text-xs">
                      {formatCurrency(calcVat(item, priceIncludesVat), currency)}
                    </td>
                  )}
                  <td className="px-3 py-2 text-right font-semibold text-gray-800 font-mono text-xs">
                    {formatCurrency(showVat ? calcTotal(item, priceIncludesVat) : calcSubtotal(item, priceIncludesVat), currency)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                      title="Satırı sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={addItem}
        className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors hover:bg-blue-50 px-3 py-2 rounded-lg"
      >
        <Plus size={16} />
        Satır Ekle
      </button>
    </div>
  );
}
