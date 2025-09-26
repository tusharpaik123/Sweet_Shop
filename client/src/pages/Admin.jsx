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
    <div className="pt-4 pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-chocolate mb-2">Admin Dashboard</h2>
          <p className="text-chocolate/70">Manage your sweet inventory</p>
        </div>
        <button
          onClick={() => navigate('/admin/add-sweet')}
          className="btn-primary px-6 py-3 text-lg"
        >
          Add New Product
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="text-chocolate/70 text-lg">Loading products...</div>
        </div>
      )}
      
      {error && (
        <div className="card-dark p-4 mb-6 border-l-4 border-error">
          <div className="text-error font-medium">Error: {error}</div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((s) => (
            <div key={s._id} className="card p-6 hover:shadow-warm transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-chocolate">{s.name}</h3>
                <span className="text-2xl font-bold text-saffron">₹{Number(s.price).toFixed(2)}</span>
              </div>
              
              {s.image && (
                <img 
                  src={s.image} 
                  alt={s.name} 
                  className="w-full h-48 object-cover rounded-lg mb-4 border border-chocolate/20 shadow-cream" 
                />
              )}
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-chocolate/70">
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 bg-saffron/20 text-saffron px-2 py-1 rounded-full text-xs font-medium">
                    {s.category}
                  </span>
                </div>
                <div className="flex items-center text-sm text-chocolate/70">
                  <span className="font-medium">Stock:</span>
                  <span className={`ml-2 font-semibold ${s.quantity > 0 ? 'text-success' : 'text-error'}`}>
                    {s.quantity} kg(s)
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => navigate(`/admin/edit-sweet/${s._id}`)} 
                  className="btn-secondary flex-1 text-sm py-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(s._id)} 
                  className="bg-error text-black px-3 py-2 rounded-lg font-semibold hover:bg-error/90 transition-all text-sm"
                >
                  Delete
                </button>
                {/* <button 
                  onClick={() => onRestock(s._id)} 
                  className="bg-success text-black px-3 py-2 rounded-lg font-semibold hover:bg-success/90 transition-all text-sm"
                >
                  📦 Restock
                </button> */}
              </div>
            </div>
          ))}
          
          {sweets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-chocolate/70 text-lg">No products in inventory yet.</div>
              <div className="text-chocolate/50 text-sm mt-2">Add your first product to get started!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
