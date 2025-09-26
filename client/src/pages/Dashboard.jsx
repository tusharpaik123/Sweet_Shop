import React, { useEffect, useMemo, useState } from 'react';
import { listSweets, searchSweets, purchaseSweet } from '../services/sweets.js';
import { SWEET_CATEGORIES, CATEGORY_EMOJIS } from '../constants/sweetCategories.js';

function Products(){
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });
    const [sortBy, setSortBy] = useState('alphabetical'); // Default sort
    const [purchasing, setPurchasing] = useState({}); // _id -> loading

    // Sort options
    const sortOptions = [
        { value: 'alphabetical', label: 'Alphabetical (A-Z)', icon: '🔤' },
        { value: 'price-low', label: 'Price: Low to High', icon: '📈' },
        { value: 'price-high', label: 'Price: High to Low', icon: '📉' },
        { value: 'latest', label: 'Recently Added', icon: '⏰' }
    ];

    // Sorting function
    const applySorting = (sweetsArray, sortType = sortBy) => {
        const sorted = [...sweetsArray];
        
        switch (sortType) {
            case 'alphabetical':
                return sorted.sort((a, b) => 
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                );
            case 'price-low':
                return sorted.sort((a, b) => Number(a.price) - Number(b.price));
            case 'price-high':
                return sorted.sort((a, b) => Number(b.price) - Number(a.price));
            case 'latest':
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.updatedAt || a.createdAt || 0);
                    const dateB = new Date(b.updatedAt || b.createdAt || 0);
                    return dateB - dateA; // Latest first
                });
            default:
                return sorted;
        }
    };

    const fetchAll = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await listSweets();
            const sortedSweets = applySorting(data || []);
            setSweets(sortedSweets);
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
            const data = await searchSweets(query);
            const sortedSweets = applySorting(data || []);
            setSweets(sortedSweets);
        } catch (e) {
            setError(e?.response?.data?.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        const sortedSweets = applySorting(sweets, newSortBy);
        setSweets(sortedSweets);
    };

    const resetFilters = () => {
        setQuery({ name: '', category: '', minPrice: '', maxPrice: '' });
        setSortBy('alphabetical'); // Reset to default sort
        fetchAll(); // This will reload all sweets with default sorting
    };

    const onPurchase = async (_id) => {
        setPurchasing((p) => ({ ...p, [_id]: true }));
        try {
            await purchaseSweet(_id, 1);
            // refresh list
        } catch (e) {
            alert(e?.response?.data?.message || 'Purchase failed');
        } finally {
            setPurchasing((p) => ({ ...p, [_id]: false }));
        }
    };

    useEffect(() => { fetchAll(); }, []);

    return(
        <div className="pt-4 pb-10 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-chocolate mb-2">Sweet Collection</h2>
                <p className="text-chocolate/70">Discover our delicious range of traditional and modern sweets</p>
            </div>

            {/* Category Quick Filters */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-chocolate mb-4">Browse by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <button
                        onClick={() => setQuery({ ...query, category: '' })}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                            query.category === '' 
                                ? 'border-saffron bg-saffron/10 text-saffron' 
                                : 'border-chocolate/20 hover:border-saffron/50 text-chocolate'
                        }`}
                    >
                        <div className="text-sm font-medium">All Categories</div>
                    </button>
                    {SWEET_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setQuery({ ...query, category })}
                            className={`p-4 rounded-lg border-2 transition-all text-center ${
                                query.category === category 
                                    ? 'border-saffron bg-saffron/10 text-saffron' 
                                    : 'border-chocolate/20 hover:border-saffron/50 text-chocolate'
                            }`}
                        >
                            <div className="text-sm font-medium">{category}</div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-chocolate font-medium">Sort by:</span>
                    <select 
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="form-input min-w-[200px]"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="text-sm text-chocolate/70">
                    Showing {sweets.length} sweet(s)
                </div>
            </div>
            
            {/* Search Form */}
            <form onSubmit={doSearch} className="card p-6 mb-8">
                <h3 className="text-lg font-semibold text-chocolate mb-4">Search & Filter</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input 
                        value={query.name} 
                        onChange={(e) => setQuery({ ...query, name: e.target.value })} 
                        placeholder="Sweet name..." 
                        className="form-input" 
                    />
                    <select 
                        value={query.category} 
                        onChange={(e) => setQuery({ ...query, category: e.target.value })} 
                        className="form-input" 
                    >
                        <option value="">All Categories</option>
                        {SWEET_CATEGORIES.map(category => (
                            <option key={category} value={category}>
                                {CATEGORY_EMOJIS[category]} {category}
                            </option>
                        ))}
                    </select>
                    <input 
                        value={query.minPrice} 
                        onChange={(e) => setQuery({ ...query, minPrice: e.target.value })} 
                        placeholder="Min Price" 
                        type="number" 
                        className="form-input" 
                    />
                    <input 
                        value={query.maxPrice} 
                        onChange={(e) => setQuery({ ...query, maxPrice: e.target.value })} 
                        placeholder="Max Price" 
                        type="number" 
                        className="form-input" 
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary flex-1">
                            Search
                        </button>
                        <button type="button" onClick={resetFilters} className="btn-secondary">
                              Reset
                        </button>
                    </div>
                </div>
            </form>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="text-chocolate/70 text-lg">Loading products...</div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="card-dark p-4 mb-6 border-l-4 border-error">
                    <div className="text-error font-medium">Error: {error}</div>
                </div>
            )}

            {/* Sweets Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sweets.map((s) => (
                        <div key={s._id} className="card p-6 hover:shadow-warm transition-all duration-300 animate-slide-up">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-chocolate">{s.name}</h3>
                                <span className={`text-2xl font-bold ${
                                    sortBy.includes('price') 
                                        ? 'text-saffron bg-saffron/10 px-3 py-1 rounded-lg border border-saffron/30' 
                                        : 'text-saffron'
                                }`}>
                                    ₹{Number(s.price).toFixed(2)}
                                </span>
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
                                    <span className="font-medium">In stock:</span>
                                    <span className="ml-2 text-chocolate font-semibold">{s.quantity} kg(s)</span>
                                </div>
                                {sortBy === 'latest' && (s.updatedAt || s.createdAt) && (
                                    <div className="flex items-center text-xs text-chocolate/60">
                                        <span className="font-medium">Last updated:</span>
                                        <span className="ml-2">
                                            {new Date(s.updatedAt || s.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <a 
                                    href={`/buy/${s._id}`}
                                    className="btn-primary flex-1 text-center"
                                >
                                    Buy Now
                                </a>
                            </div>
                        </div>
                    ))}
                    
                    {sweets.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <div className="text-chocolate/70 text-lg">No products found matching your criteria.</div>
                            <div className="text-chocolate/50 text-sm mt-2">Try adjusting your search filters.</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Products;