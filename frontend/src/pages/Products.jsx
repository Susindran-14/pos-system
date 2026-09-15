import React, { useState, useEffect } from 'react';
import { Shirt, Plus, Search, Edit2, Trash2, Barcode, Filter, X } from 'lucide-react';
import { productsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Products() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    category: 'Shirts',
    brand: 'Louis Philippe',
    size: 'M',
    color: 'White',
    fabric: 'Cotton',
    hsn: '6205',
    gst_rate: 5,
    cost_price: 500,
    selling_price: 1299,
    mrp: 1499,
    stock: 10,
    reorder_level: 5,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [prods, cats, brs] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories(),
        productsApi.getBrands(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setBrands(brs || []);
    } catch (err) {
      showToast('Failed to load products: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      sku: 'SKU-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      barcode: Math.floor(1000000 + Math.random() * 9000000).toString(),
      name: '',
      category: categories[0]?.name || 'Shirts',
      brand: brands[0]?.name || 'Generic',
      size: 'M',
      color: 'White',
      fabric: 'Cotton',
      hsn: '6205',
      gst_rate: 5,
      cost_price: 500,
      selling_price: 1299,
      mrp: 1499,
      stock: 10,
      reorder_level: 5,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await productsApi.delete(id);
      showToast(`Product "${name}" deleted.`);
      loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productsApi.update(editingId, formData);
        showToast('Product updated successfully!');
      } else {
        await productsApi.create(formData);
        showToast('Product created successfully!');
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      p.name.toLowerCase().includes(s) ||
      p.sku.toLowerCase().includes(s) ||
      p.barcode.includes(s);
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div className="data-table-card">
        {/* Table Toolbar */}
        <div className="table-header-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <div className="pos-input-wrapper" style={{ maxWidth: '300px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by Name, SKU, or Barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: '160px' }}
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-primary" onClick={handleOpenAdd} style={{ padding: '8px 16px', fontSize: '13px' }}>
            <Plus size={16} />
            <span>Add Garment / Product</span>
          </button>
        </div>

        {/* Table View */}
        <table className="styled-table">
          <thead>
            <tr>
              <th>SKU / Barcode</th>
              <th>Product Name</th>
              <th>Category & Brand</th>
              <th>Size & Color</th>
              <th>Cost (₹)</th>
              <th>Selling Price (₹)</th>
              <th>Current Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No garments match the criteria. Click "+ Add Garment" to add one!
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{p.sku}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.barcode}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HSN: {p.hsn} | GST: {p.gst_rate}%</div>
                  </td>
                  <td>
                    <div>{p.category}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.brand}</div>
                  </td>
                  <td>
                    <span className="badge info">{p.size}</span> {p.color}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₹{p.cost_price}</td>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹{p.selling_price}</td>
                  <td>
                    <span className={`badge ${p.stock <= p.reorder_level ? 'danger' : 'success'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="nav-btn"
                        style={{ padding: '4px 8px' }}
                        title="Edit product"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="nav-btn danger"
                        style={{ padding: '4px 8px' }}
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                {editingId ? 'Edit Apparel Product' : 'Add New Apparel Product / Variant'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Product / Garment Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Classic Cotton Formal Shirt"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>SKU (Stock Keeping Unit) *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Barcode / EAN *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <select
                    className="form-control"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Size</label>
                  <select
                    className="form-control"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  >
                    {['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', 'Free Size'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Cost Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-control"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>MRP (Max Retail Price)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>GST Tax Slab (%)</label>
                  <select
                    className="form-control"
                    value={formData.gst_rate}
                    onChange={(e) => setFormData({ ...formData, gst_rate: Number(e.target.value) })}
                  >
                    <option value={0}>0% (Tax Exempt)</option>
                    <option value={5}>5% (Apparel under ₹1000)</option>
                    <option value={12}>12% (Apparel above ₹1000)</option>
                    <option value={18}>18% (Accessories / Bags)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Initial Stock (Units)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Reorder Alert Level</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.reorder_level}
                    onChange={(e) => setFormData({ ...formData, reorder_level: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Create Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
