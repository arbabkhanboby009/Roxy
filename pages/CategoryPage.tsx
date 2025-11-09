import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../hooks/useStore';
import { CATEGORIES } from '../constants';

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const { products } = useStore();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const selectedSubcategory = queryParams.get('subcategory') || 'All';
    
    const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
    
    let subcategories: string[] = [];
    let parentCategory: string | undefined;

    if (categoryName === 'Ladies') {
        subcategories = CATEGORIES.Ladies;
        parentCategory = 'Ladies';
    } else if (categoryName === 'Boys' || categoryName === 'Girls') {
        subcategories = CATEGORIES.Kids[categoryName as keyof typeof CATEGORIES.Kids];
        parentCategory = categoryName;
    }
    
    const filteredProducts = products.filter(p => {
        const pCat = p.category;
        const mainCatMatch = parentCategory === pCat;
        const subCatMatch = selectedSubcategory === 'All' || p.subcategory === selectedSubcategory;
        return mainCatMatch && subCatMatch;
    });

    return (
        <div>
            <h1 className="text-4xl font-serif font-bold text-brand-silver mb-4">{categoryName} Collection</h1>
            
            <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
                <Link 
                    to={`/category/${category?.toLowerCase()}`}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${selectedSubcategory === 'All' ? 'bg-brand-silver text-brand-blue' : 'bg-brand-blue-light/50 text-brand-text-light hover:bg-brand-silver/30'}`}>
                    All
                </Link>
                {subcategories.map(sub => (
                     <Link
                        key={sub}
                        to={`/category/${category?.toLowerCase()}?subcategory=${encodeURIComponent(sub)}`}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${selectedSubcategory === sub ? 'bg-brand-silver text-brand-blue' : 'bg-brand-blue-light/50 text-brand-text-light hover:bg-brand-silver/30'}`}>
                        {sub}
                    </Link>
                ))}
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 text-lg">No products found in this category.</p>
            )}
        </div>
    );
};

export default CategoryPage;