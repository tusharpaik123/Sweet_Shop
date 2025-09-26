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
        <div className="pt-6 pb-10 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-chocolate mb-2">My Orders</h2>
                <p className="text-chocolate/70">Track your sweet purchases and order history</p>
            </div>
            
            {loading && (
                <div className="text-center py-8">
                    <div className="text-chocolate/70 text-lg">Loading your orders...</div>
                </div>
            )}
            
            {error && (
                <div className="card-dark p-4 mb-6 border-l-4 border-error">
                    <div className="text-error font-medium">Error: {error}</div>
                </div>
            )}
            
            {!loading && !error && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-chocolate/70 text-lg">No orders found.</div>
                            <div className="text-chocolate/50 text-sm mt-2">Start shopping to see your orders here!</div>
                            <div className="mt-6">
                                <a href="/products" className="btn-primary px-6 py-3">
                                    Browse Products
                                </a>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Order Summary */}
                            <div className="card p-6 mb-6 shadow-chocolate">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-chocolate">Order Summary</h3>
                                        <p className="text-chocolate/70 text-sm">Total orders placed</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-saffron">{orders.length}</div>
                                        <div className="text-chocolate/70 text-sm">Orders</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-saffron">
                                            ₹{orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0).toFixed(2)}
                                        </div>
                                        <div className="text-chocolate/70 text-sm">Total Spent</div>
                                    </div>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="space-y-4">
                                {orders.map((p, index) => (
                                    <div key={p._id} className="card p-6 hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-saffron/20 rounded-full flex items-center justify-center">
                                                    <span className="text-saffron font-bold">#</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-chocolate text-lg">{p.sweet?.name || 'Unknown Sweet'}</h4>
                                                    <div className="flex items-center space-x-4 text-sm text-chocolate/70">
                                                        <span>Qty: {p.quantity} kg(s)</span>
                                                        <span>₹{Number(p.unitPrice).toFixed(2)} per kg</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-saffron">₹{Number(p.totalPrice).toFixed(2)}</div>
                                                <div className="text-chocolate/70 text-sm">
                                                    {new Date(p.createdAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Order Status */}
                                        <div className="mt-4 pt-4 border-t border-chocolate/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-3 h-3 bg-success rounded-full"></span>
                                                    <span className="text-success font-medium text-sm">Order Completed</span>
                                                </div>
                                                <div className="text-chocolate/70 text-sm">
                                                    Order ID: #{p._id.slice(-8).toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

