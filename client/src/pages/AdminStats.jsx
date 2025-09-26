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
        <div className="pt-6 pb-10 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-chocolate mb-2">Sales Statistics</h2>
                <p className="text-chocolate/70">Track your sweet shop's performance and top-selling items</p>
            </div>
            
            {loading && (
                <div className="text-center py-8">
                    <div className="text-chocolate/70 text-lg">Loading statistics...</div>
                </div>
            )}
            
            {error && (
                <div className="card-dark p-4 mb-6 border-l-4 border-error">
                    <div className="text-error font-medium">Error: {error}</div>
                </div>
            )}
            
            {!loading && !error && (
                <>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="card p-6 text-center hover:shadow-warm transition-all duration-300 animate-slide-up">
                            <div className="text-chocolate/70 text-sm font-medium mb-1">Total Revenue</div>
                            <div className="text-3xl font-bold text-saffron">₹{totals.totalRevenue.toFixed(2)}</div>
                        </div>
                        <div className="card p-6 text-center hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="text-chocolate/70 text-sm font-medium mb-1">Total Quantity Sold</div>
                            <div className="text-3xl font-bold text-saffron">{totals.totalKg} kg(s)</div>
                        </div>
                        <div className="card p-6 text-center hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="text-chocolate/70 text-sm font-medium mb-1">Total Orders</div>
                            <div className="text-3xl font-bold text-saffron">{purchases.length}</div>
                        </div>
                    </div>

                    <div className="card p-6 shadow-chocolate animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-chocolate mb-2">Top Products by Revenue</h3>
                            <p className="text-chocolate/70 text-sm">Your best-performing products</p>
                        </div>
                        {totals.top.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-chocolate/70">No sales data available yet.</div>
                                <div className="text-chocolate/50 text-sm mt-2">Start selling to see your top performers!</div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {totals.top.map((t, index) => (
                                    <div key={t.name} className="flex justify-between items-center p-4 bg-cream-light rounded-lg border border-chocolate/10 hover:border-saffron/30 transition-all">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-saffron text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                {index + 1}
                                            </div>
                                            <div className="font-semibold text-chocolate">{t.name}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-saffron font-bold">₹{t.revenue.toFixed(2)}</div>
                                            <div className="text-chocolate/70 text-sm">{t.qty} kg(s) sold</div>
                                        </div>
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

