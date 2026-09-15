import React, { useState, useEffect } from 'react';
import { Tags, Plus, X } from 'lucide-react';
import { productsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function CategoriesBrands() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newBrandName, setNewBrandName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, brs] = await Promise.all([
        productsApi.getCategories(),
        productsApi.getBrands(),
      ]);
      setCategories(cats || []);
      setBrands(brs || []);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await productsApi.addCategory({ name: newCatName, code: newCatCode || newCatName.slice(0, 3).toUpperCase() });
      showToast(`Category "${newCatName}" added!`);
      setNewCatName('');
      setNewCatCode('');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName) return;
    try {
      await productsApi.addBrand({ name: newBrandName });
      showToast(`Brand "${newBrandName}" added!`);
      setNewBrandName('');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Categories Box */}
      <div className="data-table-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tags size={18} />
          <span>Apparel Categories</span>
        </h3>

        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            required
            className="form-control"
            placeholder="Category Name (e.g. Sarees)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Code"
            style={{ width: '80px' }}
            value={newCatCode}
            onChange={(e) => setNewCatCode(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>
            <Plus size={16} />
          </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categories.map((c) => (
            <span key={c.id} className="badge info" style={{ padding: '6px 12px', fontSize: '13px' }}>
              {c.name} {c.code && `(${c.code})`}
            </span>
          ))}
        </div>
      </div>

      {/* Brands Box */}
      <div className="data-table-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tags size={18} />
          <span>Apparel Brands & Labels</span>
        </h3>

        <form onSubmit={handleAddBrand} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            required
            className="form-control"
            placeholder="Brand Name (e.g. Manyavar)"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>
            <Plus size={16} />
          </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {brands.map((b) => (
            <span key={b.id} className="badge warning" style={{ padding: '6px 12px', fontSize: '13px' }}>
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
