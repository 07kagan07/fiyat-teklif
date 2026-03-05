import type { CustomerInfo } from '../types';

interface Props {
  customer: CustomerInfo;
  onChange: (customer: CustomerInfo) => void;
}

export default function CustomerForm({ customer, onChange }: Props) {
  const update = (field: keyof CustomerInfo, value: string) => {
    onChange({ ...customer, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center font-bold">2</span>
        Müşteri Bilgileri
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri / Firma Adı *</label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Müşteri Firma Adı"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İlgili Kişi</label>
          <input
            type="text"
            value={customer.contactPerson}
            onChange={(e) => update('contactPerson', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ahmet Yılmaz"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input
            type="tel"
            value={customer.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+90 532 000 00 00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
          <input
            type="email"
            value={customer.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="musteri@firma.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
          <textarea
            value={customer.address}
            onChange={(e) => update('address', e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Müşteri adresi..."
          />
        </div>
      </div>
    </div>
  );
}
