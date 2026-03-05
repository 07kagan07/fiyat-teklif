import type { Quote } from '../types';
import { calcSubtotal, calcVat, calcTotal, calcQuoteTotals, formatCurrency } from '../utils/calculations';

interface Props {
  quote: Quote;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

export default function QuotePreview({ quote }: Props) {
  const piv = quote.priceIncludesVat;
  const { subtotal, totalVat, grandTotal } = calcQuoteTotals(quote.items, piv);

  return (
    <div
      id="quote-preview"
      className="bg-white"
      style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#1a1a1a', minHeight: '297mm' }}
    >
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '32px 40px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {quote.company.logo && (
              <img
                src={quote.company.logo}
                alt="logo"
                style={{ maxHeight: 56, maxWidth: 200, objectFit: 'contain', marginBottom: 12, background: 'white', borderRadius: 6, padding: '4px 8px' }}
              />
            )}
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4 }}>
              {quote.company.name || 'Firma Adı'}
            </div>
            {quote.company.address && (
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4, whiteSpace: 'pre-line' }}>{quote.company.address}</div>
            )}
            {quote.company.phone && <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Tel: {quote.company.phone}</div>}
            {quote.company.email && <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{quote.company.email}</div>}
            {quote.company.taxNumber && <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Vergi No: {quote.company.taxNumber}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700, opacity: 0.9, letterSpacing: 1 }}>FİYAT TEKLİFİ</div>
            <div style={{ marginTop: 8, fontSize: 13 }}>
              <div style={{ opacity: 0.8 }}>Teklif No: <strong>{quote.quoteNumber}</strong></div>
              <div style={{ opacity: 0.8, marginTop: 2 }}>Tarih: <strong>{formatDate(quote.date)}</strong></div>
              <div style={{ opacity: 0.8, marginTop: 2 }}>Geçerlilik: <strong>{formatDate(quote.validUntil)}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div style={{ padding: '24px 40px 0' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Sayın
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{quote.customer.name || 'Müşteri Adı'}</div>
          {quote.customer.contactPerson && (
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>İlgili: {quote.customer.contactPerson}</div>
          )}
          {quote.customer.address && (
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2, whiteSpace: 'pre-line' }}>{quote.customer.address}</div>
          )}
          {(quote.customer.phone || quote.customer.email) && (
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
              {quote.customer.phone && <span>Tel: {quote.customer.phone}</span>}
              {quote.customer.phone && quote.customer.email && <span> | </span>}
              {quote.customer.email && <span>{quote.customer.email}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div style={{ padding: '20px 40px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#1e40af', color: 'white' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, borderRadius: '4px 0 0 4px' }}>#</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Açıklama</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Miktar</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Birim</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Birim Fiyat</th>
              {quote.showVat && <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>KDV %</th>}
              {quote.showVat && <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Ara Toplam</th>}
              {quote.showVat && <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>KDV</th>}
              <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, borderRadius: '0 4px 4px 0' }}>Toplam</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.length === 0 && (
              <tr>
                <td colSpan={quote.showVat ? 9 : 6} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                  Henüz ürün/hizmet eklenmedi
                </td>
              </tr>
            )}
            {quote.items.map((item, index) => (
              <tr key={item.id} style={{ background: index % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 12px', color: '#64748b', fontWeight: 600 }}>{index + 1}</td>
                <td style={{ padding: '10px 12px' }}>{item.description || '-'}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>{item.unit}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace' }}>
                  {formatCurrency(item.unitPrice, quote.currency)}
                </td>
                {quote.showVat && (
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>%{item.vatRate}</td>
                )}
                {quote.showVat && (
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', color: '#64748b' }}>
                    {formatCurrency(calcSubtotal(item, piv), quote.currency)}
                  </td>
                )}
                {quote.showVat && (
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', color: '#64748b' }}>
                    {formatCurrency(calcVat(item, piv), quote.currency)}
                  </td>
                )}
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>
                  {formatCurrency(quote.showVat ? calcTotal(item, piv) : calcSubtotal(item, piv), quote.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ padding: '16px 40px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ minWidth: 280 }}>
          {quote.showVat && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px 6px 0 0', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#475569', fontSize: 13 }}>Ara Toplam</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatCurrency(subtotal, quote.currency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#475569', fontSize: 13 }}>KDV Toplamı</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatCurrency(totalVat, quote.currency)}</span>
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#1e40af', color: 'white', borderRadius: quote.showVat ? '0 0 6px 6px' : 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>GENEL TOPLAM</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 17 }}>
              {formatCurrency(quote.showVat ? grandTotal : subtotal, quote.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Terms & Notes */}
      {(quote.paymentTerms || quote.notes) && (
        <div style={{ padding: '20px 40px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {quote.paymentTerms && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                Ödeme Koşulları
              </div>
              <div style={{ fontSize: 13, color: '#1e3a8a' }}>{quote.paymentTerms}</div>
            </div>
          )}
          {quote.notes && (
            <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                Notlar
              </div>
              <div style={{ fontSize: 13, color: '#78350f', whiteSpace: 'pre-line' }}>{quote.notes}</div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '24px 40px', marginTop: 24, borderTop: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>
          Bu teklif {formatDate(quote.validUntil)} tarihine kadar geçerlidir.
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #475569', paddingTop: 6, minWidth: 160, fontSize: 11, color: '#475569' }}>
            Yetkili İmza / Kaşe
          </div>
        </div>
      </div>
    </div>
  );
}
