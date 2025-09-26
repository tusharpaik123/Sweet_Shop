import React, { useEffect, useState } from 'react';
import { addSweet, updateSweet, deleteSweet, listSweets, restockSweet } from '../services/sweets.js';

export default function Admin() {
  const emptyForm = { name: '', category: '', price: '', quantity: '' };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listSweets();
      setSweets(data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSweet(editingId, { ...form, price: Number(form.price), quantity: Number(form.quantity) });
      } else {
        await addSweet({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Save failed');
    }
  };

  const onEdit = (s) => {
    setEditingId(s.id);
    setForm({ name: s.name, category: s.category, price: String(s.price), quantity: String(s.quantity) });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this sweet?')) return;
    try {
      await deleteSweet(id);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  };

  const onRestock = async (id) => {
    const qty = Number(prompt('Restock quantity', '1'));
    if (!qty || qty <= 0) return;
    try {
      await restockSweet(id, qty);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Restock failed');
    }
  };

  return (
    <div className="pt-4 pb-10 text-white">
      <h2 className="text-3xl font-bold mb-6">Admin - Manage Sweets</h2>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-900/70 border border-slate-700 p-4 rounded-lg mb-8">
        <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Name" className="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
        <input value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} placeholder="Category" className="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
        <input value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} placeholder="Price" type="number" step="0.01" className="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
        <input value={form.quantity} onChange={(e)=>setForm({...form,quantity:e.target.value})} placeholder="Quantity" type="number" className="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
        <button type="submit" className="bg-light-blue text-dark-primary px-4 py-2 rounded font-semibold">{editingId ? 'Update' : 'Add'} Sweet</button>
      </form>

      {loading && <div className="text-gray-300">Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sweets.map((s) => (
            <div key={s.id} className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <span className="text-light-blue font-bold">${Number(s.price).toFixed(2)}</span>
              </div>
              <div className="text-sm text-slate-300">Category: {s.category}</div>
              <div className="text-sm text-slate-300 mb-3">In stock: {s.quantity}</div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(s)} className="bg-slate-600 px-3 py-1 rounded">Edit</button>
                <button onClick={() => onDelete(s.id)} className="bg-red-500 px-3 py-1 rounded">Delete</button>
                <button onClick={() => onRestock(s.id)} className="bg-emerald-400 text-black px-3 py-1 rounded">Restock</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
