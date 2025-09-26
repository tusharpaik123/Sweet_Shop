import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addSweet, updateSweet, getSweet } from '../services/sweets.js';

export default function AddSweet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const emptyForm = { name: '', category: '', price: '', quantity: '', image: null };
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load sweet data if editing
  React.useEffect(() => {
    if (isEditing && id) {
      loadSweetData();
    }
  }, [id, isEditing]);

  const loadSweetData = async () => {
    try {
      setLoading(true);
      const sweet = await getSweet(id);
      setForm({
        name: sweet.name || '',
        category: sweet.category || '',
        price: String(sweet.price || ''),
        quantity: String(sweet.quantity || ''),
        image: null
      });
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load sweet data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', String(Number(form.price)));
      formData.append('quantity', String(Number(form.quantity)));
      
      if (form.image instanceof File) {
        formData.append('image', form.image);
      }

      if (isEditing) {
        await updateSweet(id, formData, true);
      } else {
        await addSweet(formData, true);
      }
      
      navigate('/admin');
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
  };

  if (loading && isEditing) {
    return (
      <div className="pt-4 pb-10 text-white">
        <div className="text-center text-gray-300">Loading sweet data...</div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-10 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
          </h2>
          <button
            onClick={() => navigate('/admin')}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold transition-colors"
          >
            ← Back to Admin
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="bg-slate-900/70 border border-slate-700 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Sweet Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter sweet name"
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:border-light-blue focus:outline-none"
                required
              />
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Category *
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Enter category (e.g., Dessert, Snack)"
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:border-light-blue focus:outline-none"
                required
              />
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Enter price"
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:border-light-blue focus:outline-none"
                required
              />
            </div>

            {/* Quantity Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Quantity (kg) *
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="Enter quantity in kg"
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:border-light-blue focus:outline-none"
                required
              />
            </div>

            {/* Image Field */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:border-light-blue focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-light-blue file:text-dark-primary hover:file:bg-blue-600"
              />
              {form.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Selected: {form.image.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-light-blue hover:bg-blue-600 disabled:bg-gray-600 text-dark-primary px-6 py-2 rounded font-semibold transition-colors"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Sweet' : 'Add Sweet')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
