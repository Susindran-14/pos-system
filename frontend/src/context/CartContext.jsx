import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { productsApi, scannerApi } from '../api/client';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [billDiscount, setBillDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('flat'); // 'flat' or 'percent'
  const [heldBills, setHeldBills] = useState([]);
  const [scannerSessionId, setScannerSessionId] = useState(() => {
    return localStorage.getItem('pos_scanner_session') || `SES-${Math.floor(1000 + Math.random() * 9000)}`;
  });
  const [lastScannedItem, setLastScannedItem] = useState(null);

  // Save session ID in localStorage
  useEffect(() => {
    if (scannerSessionId) {
      localStorage.setItem('pos_scanner_session', scannerSessionId);
    }
  }, [scannerSessionId]);

  // Add product to cart (or increment qty if already present)
  const addToCart = (product) => {
    setLastScannedItem(product);
    setCart((prev) => {
      const existing = prev.find((item) => item.sku === product.sku);
      if (existing) {
        return prev.map((item) =>
          item.sku === product.sku ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          sku: product.sku,
          name: product.name,
          size: product.size || '',
          color: product.color || '',
          qty: 1,
          rate: product.selling_price || 0,
          mrp: product.mrp || product.selling_price || 0,
          gst_rate: product.gst_rate || 5,
          discount_type: 'flat',
          discount_value: 0,
        },
      ];
    });
  };

  // Add by barcode or SKU directly (looks up product in database or cache)
  const addBarcodeToCart = async (barcode) => {
    const raw = String(barcode).trim();
    if (!raw) return null;

    try {
      const prod = await productsApi.getByBarcode(raw);
      if (prod) {
        addToCart(prod);
        return prod;
      }
    } catch (e) {
      // Fallback search in catalog
      try {
        const allProds = await productsApi.getAll();
        const matched = (allProds || []).find(
          (p) =>
            p.barcode === raw ||
            p.sku.toLowerCase() === raw.toLowerCase()
        );
        if (matched) {
          addToCart(matched);
          return matched;
        }
      } catch (err) {}
    }

    // If unregistered barcode, still add as a flexible line item so billing is never blocked
    const fallbackItem = {
      id: null,
      sku: raw,
      name: `Garment Item (${raw})`,
      size: '',
      color: '',
      selling_price: 0,
      mrp: 0,
      gst_rate: 5,
    };
    addToCart(fallbackItem);
    return fallbackItem;
  };

  const updateQty = (sku, newQty) => {
    if (newQty <= 0) {
      removeItem(sku);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.sku === sku ? { ...item, qty: newQty } : item))
    );
  };

  const updateItemDiscount = (sku, type, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, discount_type: type, discount_value: Number(value) } : item
      )
    );
  };

  const removeItem = (sku) => {
    setCart((prev) => prev.filter((item) => item.sku !== sku));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setBillDiscount(0);
  };

  const holdCurrentBill = () => {
    if (cart.length === 0) return false;
    setHeldBills((prev) => [
      ...prev,
      {
        id: 'HOLD-' + Date.now(),
        date: new Date().toLocaleTimeString(),
        cart,
        selectedCustomer,
        billDiscount,
      },
    ]);
    clearCart();
    return true;
  };

  const recallHeldBill = (index) => {
    const held = heldBills[index];
    if (!held) return;
    setCart(held.cart);
    setSelectedCustomer(held.selectedCustomer);
    setBillDiscount(held.billDiscount || 0);
    setHeldBills((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculations Engine
  const totals = useMemo(() => {
    let subtotal = 0;
    let itemDiscountTotal = 0;
    let taxableAmount = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const computedItems = cart.map((item) => {
      const lineGross = item.rate * item.qty;
      let discAmt = 0;
      if (item.discount_type === 'percent') {
        discAmt = (lineGross * (item.discount_value || 0)) / 100;
      } else {
        discAmt = (item.discount_value || 0) * item.qty;
      }
      discAmt = Math.min(discAmt, lineGross);
      const lineNet = lineGross - discAmt;

      // Reverse GST calculation from inclusive selling rate
      const taxRate = item.gst_rate || 5;
      const baseTaxable = lineNet / (1 + taxRate / 100);
      const taxTotal = lineNet - baseTaxable;
      const halfTax = taxTotal / 2;

      subtotal += lineGross;
      itemDiscountTotal += discAmt;
      taxableAmount += baseTaxable;
      cgst += halfTax;
      sgst += halfTax;

      return {
        ...item,
        discount_amount: discAmt,
        taxable_amount: baseTaxable,
        cgst: halfTax,
        sgst: halfTax,
        igst: 0,
        total: lineNet,
      };
    });

    let billDiscAmt = 0;
    if (discountType === 'percent') {
      billDiscAmt = (subtotal * (billDiscount || 0)) / 100;
    } else {
      billDiscAmt = Number(billDiscount) || 0;
    }

    const netBeforeRound = Math.max(0, subtotal - itemDiscountTotal - billDiscAmt);
    const roundedGrand = Math.round(netBeforeRound);
    const roundOff = roundedGrand - netBeforeRound;

    return {
      computedItems,
      subtotal: Number(subtotal.toFixed(2)),
      itemDiscountTotal: Number(itemDiscountTotal.toFixed(2)),
      billDiscount: Number(billDiscAmt.toFixed(2)),
      taxableAmount: Number(taxableAmount.toFixed(2)),
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      igst: 0,
      roundOff: Number(roundOff.toFixed(2)),
      grandTotal: roundedGrand,
      totalQty: cart.reduce((sum, i) => sum + i.qty, 0),
    };
  }, [cart, billDiscount, discountType]);

  // Sync Cart status with backend so smartphone gun reflects updated totals
  useEffect(() => {
    if (!scannerSessionId) return;
    scannerApi.syncCart({
      session_id: scannerSessionId,
      total_items: totals.totalQty || 0,
      grand_total: totals.grandTotal || 0,
      last_item_name: lastScannedItem?.name || 'POS Bill Active',
      last_item_price: lastScannedItem?.rate || lastScannedItem?.selling_price || 0,
    }).catch(() => {});
  }, [scannerSessionId, totals, lastScannedItem]);

  // Background polling for scans from smartphone gun
  useEffect(() => {
    if (!scannerSessionId) return;
    const interval = setInterval(async () => {
      try {
        const res = await scannerApi.pollScans(scannerSessionId);
        if (res?.has_scans && Array.isArray(res.scans) && res.scans.length > 0) {
          for (const scan of res.scans) {
            if (scan?.product) {
              addToCart(scan.product);
            } else if (scan?.barcode) {
              await addBarcodeToCart(scan.barcode);
            }
          }
        }
      } catch (e) {}
    }, 800);
    return () => clearInterval(interval);
  }, [scannerSessionId]);

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedCustomer,
        setSelectedCustomer,
        billDiscount,
        setBillDiscount,
        discountType,
        setDiscountType,
        heldBills,
        addToCart,
        addBarcodeToCart,
        scannerSessionId,
        setScannerSessionId,
        lastScannedItem,
        updateQty,
        updateItemDiscount,
        removeItem,
        clearCart,
        holdCurrentBill,
        recallHeldBill,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
