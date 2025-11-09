import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../hooks/useStore';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { CATEGORIES } from '../constants';

const HomePage: React.FC = () => {
    const { products } = useStore();
    const [sortBy, setSortBy] = useState('latest');
    const [filterCategory, setFilterCategory] = useState('All');

    const saleProducts = products.slice(0, 4);

    const displayedProducts = useMemo(() => {
        let filtered = products;

        if (filterCategory !== 'All') {
            filtered = filtered.filter(p => p.category === filterCategory);
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

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative bg-brand-pink h-[50vh] flex items-center rounded-lg overflow-hidden">
                 <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{backgroundImage: "url('https://i.ibb.co/bFqg38d/roxy-hero-background.jpg')"}}></div>
                <div className="relative z-10 text-center w-full px-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-text">Style Meets Comfort</h1>
                    <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">Discover our latest collection of footwear.</p>
                </div>
            </div>

            {/* Sales and Deals Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-3xl font-serif font-bold text-center text-brand-text mb-8">Sales & Deals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {saleProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            {/* All Products Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-serif font-bold text-brand-text">All Products</h2>
                    <div className="flex items-center gap-4">
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <option value="All">Filter By</option>
                            {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                         <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
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
            
             {/* Social Media Section */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                 <h2 className="text-3xl font-serif font-bold text-brand-text mb-6">Follow Us on Social Media</h2>
                 <div className="flex justify-center items-center gap-6">
                     <a href="#" target="_blank" rel="noopener noreferrer" className="text-brand-text hover:text-brand-dark-pink transition-colors"><Icon name="facebook" className="w-8 h-8" /></a>
                     <a href="#" target="_blank" rel="noopener noreferrer" className="text-brand-text hover:text-brand-dark-pink transition-colors"><Icon name="instagram" className="w-8 h-8" /></a>
                     <a href="#" target="_blank" rel="noopener noreferrer" className="text-brand-text hover:text-brand-dark-pink transition-colors"><Icon name="youtube" className="w-8 h-8" /></a>
                     <a href="#" target="_blank" rel="noopener noreferrer" className="text-brand-text hover:text-brand-dark-pink transition-colors"><Icon name="whatsapp" className="w-8 h-8" /></a>
                 </div>
            </div>

        </div>
    );
};

export default HomePage;