import React, { useState, useEffect, useRef } from 'react';
import { Barcode as BarcodeIcon, Printer, LayoutGrid, Check } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { productsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function BarcodeLabels() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [selectedSku, setSelectedSku] = useState('');
  const [labelCopies, setLabelCopies] = useState(24);
  const [layoutMode, setLayoutMode] = useState('24up'); // '24up', '65up', 'thermal-roll'

  useEffect(() => {
    productsApi.getAll().then((prods) => {
      setProducts(prods || []);
      if (prods?.length > 0) setSelectedSku(prods[0].sku);
    });
  }, []);

  const selectedProduct = products.find((p) => p.sku === selectedSku);

  // Render Barcode SVG onto DOM
  useEffect(() => {
    if (selectedProduct && selectedProduct.barcode) {
      document.querySelectorAll('.barcode-svg-canvas').forEach((el) => {
        try {
          JsBarcode(el, selectedProduct.barcode || selectedProduct.sku, {
            format: 'CODE128',
            width: layoutMode === '65up' ? 1.1 : 1.5,
            height: layoutMode === '65up' ? 22 : layoutMode === 'thermal-roll' ? 26 : 30,
            displayValue: true,
            fontSize: layoutMode === '65up' ? 9 : 11,
            margin: 0,
            textMargin: 1,
            font: 'monospace',
            fontOptions: 'bold',
          });
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [selectedProduct, labelCopies, layoutMode]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Configuration Toolbar */}
      <div className="data-table-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarcodeIcon size={18} />
          <span>Garment Price Tag & Barcode Label Sheet Generator</span>
        </h3>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {/* Select Product */}
          <div className="form-group" style={{ flex: 2, minWidth: '260px', margin: 0 }}>
            <label>Select Garment Product:</label>
            <select
              className="form-control"
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
            >
              {products.map((p) => (
                <option key={p.id} value={p.sku}>
                  {p.name} ({p.sku}) — Size: {p.size} — ₹{p.selling_price}
                </option>
              ))}
            </select>
          </div>

          {/* Label Standard Layout */}
          <div className="form-group" style={{ flex: 1.5, minWidth: '220px', margin: 0 }}>
            <label>Print Sheet Format / Size:</label>
            <select
              className="form-control"
              value={layoutMode}
              onChange={(e) => {
                setLayoutMode(e.target.value);
                if (e.target.value === '24up') setLabelCopies(24);
                else if (e.target.value === '65up') setLabelCopies(65);
                else setLabelCopies(10);
              }}
            >
              <option value="24up">📄 A4 Sticker Sheet (24-Up: 63.5 × 38.1mm)</option>
              <option value="65up">📄 A4 Sticker Sheet (65-Up: 38.1 × 21.2mm)</option>
              <option value="thermal-roll">🏷️ Thermal Roll (50 × 25mm 2-Inch Tag)</option>
            </select>
          </div>

          {/* Number of Copies */}
          <div className="form-group" style={{ width: '100px', margin: 0 }}>
            <label>Label Copies:</label>
            <input
              type="number"
              min="1"
              max="200"
              className="form-control"
              value={labelCopies}
              onChange={(e) => setLabelCopies(Number(e.target.value))}
            />
          </div>

          {/* Print Button */}
          <button className="btn-primary" onClick={handlePrint} style={{ padding: '8px 20px', fontSize: '13px' }}>
            <Printer size={16} />
            <span>Print {labelCopies} Labels</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet View */}
      {selectedProduct && (
        <div
          className={`printable-barcode-sheet layout-${layoutMode}`}
          style={{
            display: 'grid',
            gridTemplateColumns:
              layoutMode === '24up'
                ? 'repeat(auto-fill, minmax(220px, 1fr))'
                : layoutMode === '65up'
                ? 'repeat(auto-fill, minmax(150px, 1fr))'
                : 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: '12px',
            padding: '20px',
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
          }}
        >
          {Array.from({ length: labelCopies }).map((_, i) => (
            <div
              key={i}
              className="barcode-label-box"
              style={{
                border: '1px dashed #cbd5e1',
                borderRadius: '6px',
                padding: layoutMode === '65up' ? '4px' : '8px',
                textAlign: 'center',
                background: '#ffffff',
                color: '#000000',
                fontFamily: 'sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Header Store Title */}
              <div
                style={{
                  fontSize: layoutMode === '65up' ? '8px' : '9.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '1.2',
                }}
              >
                TAMIL DRESS COLLECTION
              </div>

              {/* Product Name */}
              <div
                style={{
                  fontSize: layoutMode === '65up' ? '9.5px' : '11px',
                  fontWeight: 700,
                  margin: '1px 0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selectedProduct.name}
              </div>

              {/* Variants Info */}
              <div
                style={{
                  fontSize: layoutMode === '65up' ? '8px' : '9.5px',
                  color: '#4b5563',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <span>Size: <b>{selectedProduct.size}</b></span>
                {selectedProduct.color && <span>| {selectedProduct.color}</span>}
              </div>

              {/* High-Resolution Vector Barcode */}
              <div style={{ margin: '3px 0', display: 'flex', justifyContent: 'center' }}>
                <svg className="barcode-svg-canvas" style={{ maxWidth: '100%' }}></svg>
              </div>

              {/* Price & Taxes */}
              <div style={{ lineHeight: '1.1' }}>
                <div
                  style={{
                    fontSize: layoutMode === '65up' ? '11px' : '13px',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                  }}
                >
                  MRP: ₹ {selectedProduct.selling_price}
                </div>
                <div style={{ fontSize: '7.5px', color: '#6b7280' }}>(Incl. of all taxes)</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
