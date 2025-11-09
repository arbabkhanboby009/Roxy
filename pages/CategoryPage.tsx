import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../hooks/useStore';
import { CATEGORIES } from '../constants';

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const { products } = useStore();
    
    const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
    const subcategories = CATEGORIES[categoryName as keyof typeof CATEGORIES] || [];

    const [selectedSubcategory, setSelectedSubcategory] = React.useState<string>('All');

    const filteredProducts = products.filter(p => 
        p.category.toLowerCase() === category &&
        (selectedSubcategory === 'All' || p.subcategory === selectedSubcategory)
    );

    return (
        <div>
            <h1 className="text-4xl font-serif font-bold text-brand-text mb-4">{categoryName} Collection</h1>
            
            <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
                <button 
                    onClick={() => setSelectedSubcategory('All')} 
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedSubcategory === 'All' ? 'bg-brand-text text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    All
                </button>
                {subcategories.map(sub => (
                     <button 
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${selectedSubcategory === sub ? 'bg-brand-text text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {sub}
                    </button>
                ))}
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">No products found in this category.</p>
            )}
        </div>
    );
};

export default CategoryPage;
