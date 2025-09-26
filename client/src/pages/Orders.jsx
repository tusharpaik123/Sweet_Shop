import React, { useEffect, useState } from 'react';
import { getMyPurchases } from '../services/sweets.js';

export default function Orders(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [orders, setOrders] = useState([]);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getMyPurchases();
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    return (
        <div className="pt-6 pb-10 text-white">
            <h2 className="text-3xl font-bold mb-4">My Orders</h2>
            {loading && <div className="text-gray-300">Loading...</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!loading && !error && (
                <div className="space-y-3">
                    {orders.length === 0 ? (
                        <div className="text-slate-300">No orders found.</div>
                    ) : (
                        orders.map((p)=> (
                            <div key={p._id} className="bg-slate-900/70 border border-slate-700 rounded p-4">
                                <div className="flex justify-between">
                                    <div className="font-semibold">{p.sweet?.name}</div>
                                    <div className="text-light-blue font-semibold">₹{Number(p.totalPrice).toFixed(2)}</div>
                                </div>
                                <div className="text-slate-300 text-sm">Qty: {p.quantity} kg(s) @ ₹{Number(p.unitPrice).toFixed(2)}</div>
                                <div className="text-slate-400 text-xs">{new Date(p.createdAt).toLocaleString()}</div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

