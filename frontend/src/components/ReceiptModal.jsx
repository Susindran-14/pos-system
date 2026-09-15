import React, { useRef } from 'react';
import { Printer, X, CheckCircle } from 'lucide-react';

export default function ReceiptModal({ sale, onClose, storeSettings }) {
  if (!sale) return null;

  const settings = storeSettings || {
    storeName: 'TAMIL DRESS COLLECTION',
    storeNameTamil: 'தமிழ் டிரஸ் கலெக்ஷன்',
    address: '142, Main Road, Near Bus Stand, Salem - 636001',
    gstin: '33ABCDE1234F1Z5',
    phone: '9876543210',
    upiId: 'tamildress@upi',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '420px', background: '#ffffff', color: '#000000' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Tax Invoice Receipt</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body printable-receipt" style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px' }}>
          {/* STORE HEADER */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{settings.storeName}</h2>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{settings.storeNameTamil}</div>
            <div style={{ fontSize: '10.5px', color: '#4b5563', marginTop: '2px' }}>{settings.address}</div>
            <div style={{ fontSize: '10.5px', fontWeight: 600 }}>GSTIN: {settings.gstin} | PH: {settings.phone}</div>
          </div>

          <div style={{ borderTop: '1px dashed #9ca3af', borderBottom: '1px dashed #9ca3af', padding: '6px 0', margin: '8px 0', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Bill No: <b>{sale.invoice_no}</b></span>
              <span>Date: {new Date(sale.date_time || Date.now()).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Customer: {sale.customer_name || 'Walk-in'}</span>
              <span>Time: {new Date(sale.date_time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {sale.customer_mobile && <div>Phone: {sale.customer_mobile}</div>}
          </div>

          {/* ITEM TABLE */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', margin: '8px 0' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #9ca3af', textAlign: 'left' }}>
                <th style={{ padding: '4px 0' }}>Item Description</th>
                <th style={{ textAlign: 'center', width: '35px' }}>Qty</th>
                <th style={{ textAlign: 'right', width: '50px' }}>Rate</th>
                <th style={{ textAlign: 'right', width: '55px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px dotted #e5e7eb' }}>
                  <td style={{ padding: '4px 0' }}>
                    <div><b>{item.name}</b></div>
                    <div style={{ fontSize: '9.5px', color: '#4b5563' }}>
                      {item.size && `Size: ${item.size}`} {item.color && `| ${item.color}`} (GST {item.gst_rate}%)
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '4px' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right', verticalAlign: 'top', paddingTop: '4px' }}>₹{item.rate}</td>
                  <td style={{ textAlign: 'right', verticalAlign: 'top', paddingTop: '4px', fontWeight: 700 }}>
                    ₹{item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTALS SUMMARY */}
          <div style={{ borderTop: '1px dashed #9ca3af', paddingTop: '6px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>Subtotal:</span>
              <span>₹{sale.subtotal?.toFixed(2)}</span>
            </div>
            {sale.bill_discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', marginBottom: '2px' }}>
                <span>Bill Discount:</span>
                <span>- ₹{sale.bill_discount?.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '10px' }}>
              <span>Taxable Value:</span>
              <span>₹{sale.taxable_amount?.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '10px' }}>
              <span>CGST + SGST:</span>
              <span>₹{(sale.cgst + sale.sgst)?.toFixed(2)}</span>
            </div>
            {sale.round_off !== 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '10px' }}>
                <span>Round Off:</span>
                <span>₹{sale.round_off?.toFixed(2)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                fontWeight: 800,
                borderTop: '1px solid #000000',
                borderBottom: '1px solid #000000',
                padding: '4px 0',
                marginTop: '4px',
              }}
            >
              <span>GRAND TOTAL:</span>
              <span>₹ {sale.grand_total?.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px' }}>
              <span>Payment Mode: <b>{sale.payment_mode}</b></span>
              <span>Paid: ₹{sale.amount_paid?.toFixed(2)}</span>
            </div>
            {sale.change_returned > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span>Change Returned:</span>
                <span>₹{sale.change_returned?.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* STORE POLICIES & THANK YOU FOOTER (WITHOUT UNNECESSARY PAYMENT QR) */}
          <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed #9ca3af' }}>
            <div style={{ fontSize: '9.5px', color: '#4b5563', marginBottom: '6px' }}>
              * Garment exchange accepted within 7 days with original invoice and tag intact.
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>நன்றி மீண்டும் வருக!</div>
            <div style={{ fontSize: '10.5px', color: '#6b7280' }}>Thank You! Visit Again</div>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Close
          </button>
          <button className="btn-primary" onClick={handlePrint} style={{ flex: 2 }}>
            <Printer size={16} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
