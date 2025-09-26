import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addSweet, updateSweet, getSweet } from '../services/sweets.js';
import { SWEET_CATEGORIES, CATEGORY_EMOJIS } from '../constants/sweetCategories.js';

export default function AddSweet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const emptyForm = { name: '', category: '', price: '', quantity: '', image: null };
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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
        image: null,
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
      <div className="pt-4 pb-10 animate-fade-in">
        <div className="text-center py-8">
          <div className="text-chocolate/70 text-lg">Loading product data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-chocolate mb-2">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-chocolate/70">
              {isEditing ? 'Update sweet details' : 'Add a delicious new sweet to your inventory'}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="btn-secondary px-6 py-3"
          >
            ← Back to Admin
          </button>
        </div>

        {error && (
          <div className="card-dark p-4 mb-6 border-l-4 border-error">
            <div className="text-error font-medium">Error: {error}</div>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="card p-8 shadow-chocolate"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-chocolate mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter sweet name"
                className="form-input w-full"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-chocolate mb-2">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="form-input w-full"
                required
              >
                <option value="">Select a category</option>
                {SWEET_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-chocolate/70 text-sm">
                Choose from our predefined sweet categories
              </p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-chocolate mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Enter price"
                className="form-input w-full"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-chocolate mb-2">
                Quantity (kg) *
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="Enter quantity in kg"
                className="form-input w-full"
                required
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-chocolate mb-2">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-chocolate
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:font-semibold
                           file:bg-saffron file:text-white
                           hover:file:bg-saffron-dark
                           bg-cream border border-chocolate/30 rounded-lg
                           focus:border-saffron focus:outline-none
                           transition-all"
              />
              {form.image && (
                <p className="mt-2 text-sm text-chocolate/70 bg-saffron/10 px-3 py-2 rounded-lg">
                  Selected: {form.image.name}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  Saving...
                </span>
              ) : (
                isEditing ? 'Update Product' : 'Add Product'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn-secondary px-8 py-3 text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
