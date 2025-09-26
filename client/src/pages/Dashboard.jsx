import React, { useEffect, useMemo, useState } from 'react';
import { listSweets, searchSweets, purchaseSweet } from '../services/sweets.js';

function Dashboard(){
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });
    const [purchasing, setPurchasing] = useState({}); // _id -> loading

    const fetchAll = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await listSweets();
            setSweets(data || []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load sweets');
        } finally {
            setLoading(false);
        }
    };

    const doSearch = async (e) => {
        e?.preventDefault?.();
        setLoading(true);
        setError("");
        try {
            const params = {};
            if (query.name) params.name = query.name;
            if (query.category) params.category = query.category;
            if (query.minPrice) params.minPrice = query.minPrice;
            if (query.maxPrice) params.maxPrice = query.maxPrice;
            const data = await searchSweets(params);
            setSweets(data || []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const onPurchase = async (_id) => {
        setPurchasing((p) => ({ ...p, [_id]: true }));
        try {
            await purchaseSweet(_id, 1);
            // refresh list
            await fetchAll();
        } catch (e) {
            alert(e?.response?.data?.message || 'Purchase failed');
        } finally {
            setPurchasing((p) => ({ ...p, [_id]: false }));
        }
    };

    useEffect(() => { fetchAll(); }, []);

    return(
        <div className="pt-4 pb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Sweets</h2>
            <form onSubmit={doSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                <input value={query.name} onChange={(e) => setQuery({ ...query, name: e.target.value })} placeholder="Name" className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600" />
                <input value={query.category} onChange={(e) => setQuery({ ...query, category: e.target.value })} placeholder="Category" className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600" />
                <input value={query.minPrice} onChange={(e) => setQuery({ ...query, minPrice: e.target.value })} placeholder="Min Price" type="number" className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600" />
                <input value={query.maxPrice} onChange={(e) => setQuery({ ...query, maxPrice: e.target.value })} placeholder="Max Price" type="number" className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600" />
                <div className="flex gap-2">
                    <button type="submit" className="bg-light-blue text-dark-primary px-4 py-2 rounded font-semibold">Search</button>
                    <button type="button" onClick={fetchAll} className="bg-slate-600 text-white px-4 py-2 rounded">Reset</button>
                </div>
            </form>

            {loading && <div className="text-gray-300">Loading sweets...</div>}
            {error && <div className="text-red-400">{error}</div>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sweets.map((s) => (
                        <div key={s._id} className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 text-white">
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
                                <a 
                                    href={`/buy/${s._id}`}
                                    className="mt-2 bg-light-blue text-dark-primary px-3 py-2 rounded font-semibold"
                                >
                                    Buy
                                </a>
                            </div>
                        </div>
                    ))}
                    {sweets.length === 0 && (
                        <div className="text-slate-300">No sweets found.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;