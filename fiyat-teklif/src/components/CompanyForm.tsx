import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import type { CompanyInfo } from '../types';

interface Props {
  company: CompanyInfo;
  onChange: (company: CompanyInfo) => void;
}

export default function CompanyForm({ company, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof CompanyInfo, value: string) => {
    onChange({ ...company, [field]: value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...company, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeLogo = () => {
    onChange({ ...company, logo: undefined });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center font-bold">1</span>
        Firma Bilgileri
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Logo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Firma Logosu</label>
          {company.logo ? (
            <div className="flex items-center gap-3">
              <img
                src={company.logo}
                alt="logo"
                className="h-14 max-w-[180px] object-contain border border-gray-200 rounded-lg p-1 bg-gray-50"
              />
              <button
                onClick={removeLogo}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
              >
                <X size={13} />
                Kaldır
              </button>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors w-full"
              >
                <ImagePlus size={16} />
                Logo yükle (PNG, JPG, SVG)
              </button>
            </>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Firma Adı *</label>
          <input
            type="text"
            value={company.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Şirket Adı A.Ş."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
          <textarea
            value={company.address}
            onChange={(e) => update('address', e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Firma adresi..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input
            type="tel"
            value={company.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+90 212 000 00 00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
          <input
            type="email"
            value={company.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="info@firma.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vergi No</label>
          <input
            type="text"
            value={company.taxNumber}
            onChange={(e) => update('taxNumber', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1234567890"
          />
        </div>
      </div>
    </div>
  );
}
