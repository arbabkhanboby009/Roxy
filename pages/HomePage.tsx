import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../hooks/useStore';
import Icon from '../components/Icon';
import { CATEGORIES } from '../constants';

const HomePage: React.FC = () => {
    const { products } = useStore();
    const [sortBy, setSortBy] = useState('latest');
    const [filterCategory, setFilterCategory] = useState('All');

    const featuredProducts = useMemo(() => products.filter(p => p.isFeatured), [products]);
    const saleProducts = useMemo(() => products.filter(p => p.salePrice && p.salePrice > 0), [products]);


    const displayedProducts = useMemo(() => {
        let filtered = products;

        if (filterCategory !== 'All') {
            const isKidCategory = Object.keys(CATEGORIES.Kids).includes(filterCategory);
            if (isKidCategory) {
                filtered = filtered.filter(p => p.category === filterCategory);
            } else { // Ladies
                 filtered = filtered.filter(p => p.category === filterCategory);
            }
        }

        switch (sortBy) {
            case 'price_asc':
                return [...filtered].sort((a, b) => a.price - b.price);
            case 'price_desc':
                return [...filtered].sort((a, b) => b.price - a.price);
            case 'latest':
            default:
                return [...filtered].sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime());
        }
    }, [products, sortBy, filterCategory]);
    
    const selectClass = "border border-brand-silver/30 rounded-md px-3 py-2 text-sm bg-brand-blue-light/50 text-brand-text-light focus:ring-1 focus:ring-brand-silver focus:outline-none";

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative h-[50vh] flex items-center rounded-lg overflow-hidden border border-brand-silver/20 shadow-xl">
                 <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://i.ibb.co/bFqg38d/roxy-hero-background.jpg')"}}></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/50 to-transparent"></div>
                <div className="relative z-10 text-center w-full px-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-silver">Style Meets Comfort</h1>
                    <p className="mt-4 text-lg text-brand-text-light max-w-2xl mx-auto">Discover our latest collection of footwear.</p>
                </div>
            </div>

            {/* Style Meet Comforts Section */}
            {featuredProducts.length > 0 && (
                <div className="bg-brand-blue-light/30 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-brand-silver/10">
                    <h2 className="text-3xl font-serif font-bold text-center text-brand-silver mb-8">Style Meet Comforts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}


            {/* Sales and Deals Section */}
            {saleProducts.length > 0 && (
                <div className="bg-brand-blue-light/30 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-brand-silver/10">
                    <h2 className="text-3xl font-serif font-bold text-center text-brand-silver mb-8">Sales & Deals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {saleProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* All Products Section */}
            <div className="bg-brand-blue-light/30 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-brand-silver/10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-serif font-bold text-brand-silver">All Products</h2>
                    <div className="flex items-center gap-4">
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectClass}>
                            <option value="All">All Categories</option>
                            <option value="Ladies">Ladies</option>
                            <option value="Boys">Boys</option>
                            <option value="Girls">Girls</option>
                        </select>
                         <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
                            <option value="latest">Sort By: Latest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default HomePage;