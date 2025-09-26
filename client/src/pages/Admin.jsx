import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteSweet, listSweets, restockSweet } from '../services/sweets.js';

export default function Admin() {
  const navigate = useNavigate();
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Admin - Manage Sweets</h2>
        <button
          onClick={() => navigate('/admin/add-sweet')}
          className="bg-light-blue hover:bg-blue-600 text-dark-primary px-4 py-2 rounded font-semibold transition-colors"
        >
          + Add New Sweet
        </button>
      </div>

      {loading && <div className="text-gray-300">Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sweets.map((s) => (
            <div key={s._id} className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <span className="text-light-blue font-bold">₹{Number(s.price).toFixed(2)}</span>
              </div>
              {s.image && (
                <img src={s.image} alt={s.name} className="w-full h-40 object-cover rounded mb-3 border border-slate-700" />
              )}
              <div className="text-sm text-slate-300">Category: {s.category}</div>
              <div className="text-sm text-slate-300 mb-3">In stock: {s.quantity} kg(s)</div>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/admin/edit-sweet/${s._id}`)} 
                  className="bg-slate-600 hover:bg-slate-700 px-3 py-1 rounded transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(s._id)} 
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                >
                  Delete
                </button>
                <button 
                  onClick={() => onRestock(s._id)} 
                  className="bg-emerald-400 hover:bg-emerald-500 text-black px-3 py-1 rounded transition-colors"
                >
                  Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
