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
        <div className="pt-6 pb-10 text-white">
            {loading && <div className="text-gray-300">Loading...</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!loading && !error && sweet && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/70 border border-slate-700 rounded p-4">
                        <h2 className="text-2xl font-bold mb-2">{sweet.name}</h2>
                        <div className="text-slate-300 mb-1">Category: {sweet.category}</div>
                        <div className="text-slate-300 mb-1">Price: ₹{Number(sweet.price).toFixed(2)}</div>
                        <div className="text-slate-300 mb-4">In stock: {sweet.quantity} kg(s)</div>

                        <form onSubmit={onBuy} className="flex items-end gap-3">
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Quantity (kg)</label>
                                <input 
                                    type="number" min="1" value={qty}
                                    onChange={(e)=>setQty(e.target.value)}
                                    className="px-3 py-2 rounded bg-slate-800 border border-slate-600"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="bg-light-blue text-dark-primary px-4 py-2 rounded font-semibold disabled:opacity-60"
                            >
                                {submitting ? 'Buying...' : 'Final Buy'}
                            </button>
                            <button type="button" onClick={()=>navigate(-1)} className="bg-slate-600 px-4 py-2 rounded">Back</button>
                        </form>
                    </div>

                    
                </div>
            )}
        </div>
    );
}

