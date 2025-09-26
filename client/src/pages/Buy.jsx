import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSweet, purchaseSweet } from '../services/sweets.js';

export default function Buy(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [sweet, setSweet] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const s = await getSweet(id);
            setSweet(s);
            
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [id]);

    const onBuy = async (e) => {
        e.preventDefault();
        if (!sweet) return;
        const n = Number(qty);
        if (!n || n <= 0) return alert('Enter a valid quantity');
        if (sweet.quantity < n) return alert('Insufficient stock');
        setSubmitting(true);
        try {
            await purchaseSweet(sweet._id, n);
            navigate('/orders', { replace: true });
        } catch (e) {
            alert(e?.response?.data?.message || 'Purchase failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-6 pb-10 animate-fade-in">
            {loading && (
                <div className="text-center py-8">
                    <div className="text-chocolate/70 text-lg">Loading product details...</div>
                </div>
            )}
            
            {error && (
                <div className="card-dark p-4 mb-6 border-l-4 border-error">
                    <div className="text-error font-medium">Error: {error}</div>
                </div>
            )}
            
            {!loading && !error && sweet && (
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-chocolate mb-2">Purchase Product</h2>
                        <p className="text-chocolate/70">Complete your purchase below</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Sweet Details */}
                        <div className="card p-6 shadow-chocolate animate-slide-up">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-chocolate mb-2">{sweet.name}</h3>
                            </div>
                            
                            {sweet.image && (
                                <img 
                                    src={sweet.image} 
                                    alt={sweet.name} 
                                    className="w-full h-48 object-cover rounded-lg mb-4 border border-chocolate/20 shadow-cream" 
                                />
                            )}
                            
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-cream-light rounded-lg">
                                    <span className="text-chocolate/70 font-medium">Category:</span>
                                    <span className="bg-saffron/20 text-saffron px-3 py-1 rounded-full text-sm font-medium">
                                        {sweet.category}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-cream-light rounded-lg">
                                    <span className="text-chocolate/70 font-medium">Unit Price:</span>
                                    <span className="text-2xl font-bold text-saffron">₹{Number(sweet.price).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-cream-light rounded-lg">
                                    <span className="text-chocolate/70 font-medium">Available Stock:</span>
                                    <span className={`font-semibold ${sweet.quantity > 0 ? 'text-success' : 'text-error'}`}>
                                        {sweet.quantity} kg(s)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Purchase Form */}
                        <div className="card p-6 shadow-chocolate animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="mb-6">
                                <h4 className="text-xl font-bold text-chocolate mb-2">Purchase Details</h4>
                                <p className="text-chocolate/70 text-sm">Enter the quantity you want to purchase</p>
                            </div>

                            <form onSubmit={onBuy} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-chocolate mb-2">
                                        Quantity (kg)
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max={sweet.quantity}
                                        value={qty}
                                        onChange={(e)=>setQty(e.target.value)}
                                        className="form-input w-full text-lg"
                                        placeholder="Enter quantity"
                                    />
                                    <p className="mt-2 text-chocolate/70 text-sm">
                                        Maximum available: {sweet.quantity} kg(s)
                                    </p>
                                </div>

                                {/* Total Calculation */}
                                <div className="p-4 bg-saffron/10 rounded-lg border border-saffron/30">
                                    <div className="flex justify-between items-center">
                                        <span className="text-chocolate font-medium">Total Amount:</span>
                                        <span className="text-3xl font-bold text-saffron">
                                            ₹{(Number(sweet.price) * Number(qty || 0)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        type="submit" 
                                        disabled={submitting || sweet.quantity < Number(qty)}
                                        className="btn-primary flex-1 py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center justify-center">
                                                Processing...
                                            </span>
                                        ) : (
                                            'Complete Purchase'
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={()=>navigate(-1)} 
                                        className="btn-secondary py-3 text-lg"
                                    >
                                        ← Back
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

