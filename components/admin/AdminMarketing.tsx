import React from 'react';
import { useStore } from '../../hooks/useStore';
import type { Product } from '../../types';

const AdminMarketing: React.FC = () => {
    const { products, updateProduct } = useStore();

    const handleFeatureToggle = (product: Product) => {
        updateProduct({ ...product, isFeatured: !product.isFeatured });
    };

    const handleSalePriceChange = (product: Product, newPriceStr: string) => {
        const newPrice = newPriceStr === '' ? undefined : parseFloat(newPriceStr);
        if (newPrice !== undefined && isNaN(newPrice)) return; // Don't update if it's not a valid number
        updateProduct({ ...product, salePrice: newPrice });
    };

    const inputClass = "w-full max-w-[120px] border p-2 rounded bg-white text-black border-gray-300 focus:ring-1 focus:ring-brand-dark-pink focus:outline-none";

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Marketing & Promotions</h1>
                <p className="text-gray-500 mt-1">Manage featured products and sales for your homepage.</p>
            </div>

            {/* Style Meet Comforts Section */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Style Meet Comforts (Featured Products)</h2>
                <p className="text-sm text-gray-500 mb-4">Select products to feature prominently on your homepage. These will appear in the "Style Meet Comforts" section.</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {products.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                                <p className="font-semibold text-gray-800">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.id}</p>
                            </div>
                            <label className="mode-toggle-switch" style={{ width: '50px', height: '24px'}}>
                                <input type="checkbox" checked={!!product.isFeatured} onChange={() => handleFeatureToggle(product)} />
                                <span className="mode-toggle-slider"></span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sales & Deals Section */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sales & Deals</h2>
                 <p className="text-sm text-gray-500 mb-4">Set a sale price for products to feature them in the "Sales & Deals" section on your homepage. Leave blank to remove the sale.</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                     {products.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                                <p className="font-semibold text-gray-800">{product.name}</p>
                                <p className="text-xs text-gray-500">Original Price: PKR {product.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                               <label className="text-sm font-medium text-gray-700">Sale Price:</label>
                               <input 
                                   type="number" 
                                   placeholder="e.g. 2999"
                                   value={product.salePrice || ''}
                                   onChange={(e) => handleSalePriceChange(product, e.target.value)}
                                   className={inputClass} 
                               />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminMarketing;
