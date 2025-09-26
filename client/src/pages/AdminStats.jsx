import React, { useEffect, useMemo, useState } from 'react';
import { getAllPurchases } from '../services/sweets.js';

export default function AdminStats(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [purchases, setPurchases] = useState([]);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getAllPurchases();
            setPurchases(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const totals = useMemo(() => {
        const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.totalPrice || 0), 0);
        const totalKg = purchases.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
        const bySweet = new Map();
        for (const p of purchases) {
            const name = p.sweet?.name || 'Unknown';
            const prev = bySweet.get(name) || { qty: 0, revenue: 0 };
            prev.qty += Number(p.quantity || 0);
            prev.revenue += Number(p.totalPrice || 0);
            bySweet.set(name, prev);
        }
        const top = Array.from(bySweet.entries())
            .map(([name, v]) => ({ name, qty: v.qty, revenue: v.revenue }))
            .sort((a,b) => b.revenue - a.revenue)
            .slice(0, 10);
        return { totalRevenue, totalKg, top };
    }, [purchases]);

    return (
        <div className="pt-6 pb-10 text-white">
            <h2 className="text-3xl font-bold mb-4">Admin - Sales Statistics</h2>
            {loading && <div className="text-gray-300">Loading...</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!loading && !error && (
                <>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-900/70 border border-slate-700 rounded p-4">
                            <div className="text-slate-300">Total Revenue</div>
                            <div className="text-2xl font-bold text-light-blue">₹{totals.totalRevenue.toFixed(2)}</div>
                        </div>
                        <div className="bg-slate-900/70 border border-slate-700 rounded p-4">
                            <div className="text-slate-300">Total Quantity Sold</div>
                            <div className="text-2xl font-bold text-light-blue">{totals.totalKg} kg(s)</div>
                        </div>
                        <div className="bg-slate-900/70 border border-slate-700 rounded p-4">
                            <div className="text-slate-300">Total Orders</div>
                            <div className="text-2xl font-bold text-light-blue">{purchases.length}</div>
                        </div>
                    </div>

                    <div className="bg-slate-900/70 border border-slate-700 rounded p-4">
                        <h3 className="text-xl font-semibold mb-3">Top Sweets by Revenue</h3>
                        {totals.top.length === 0 ? (
                            <div className="text-slate-300">No data.</div>
                        ) : (
                            <div className="space-y-2">
                                {totals.top.map((t) => (
                                    <div key={t.name} className="flex justify-between text-sm border border-slate-700 rounded p-2">
                                        <div>{t.name}</div>
                                        <div className="text-slate-300">{t.qty} kg(s) · ₹{t.revenue.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

