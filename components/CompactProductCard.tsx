import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface CompactProductCardProps {
    product: Product;
    onProductClick: () => void;
}

const CompactProductCard: React.FC<CompactProductCardProps> = ({ product, onProductClick }) => {
    const primaryImage = Object.values(product.images)?.[0]?.[0] || 'https://i.ibb.co/9s1T2rR/placeholder-shoe.png';

    return (
        <div className="flex items-center gap-3 p-2 border rounded-lg bg-white max-w-xs my-2 shadow-sm">
            <img src={primaryImage} alt={product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-brand-text truncate">{product.name}</p>
                <p className="text-xs text-gray-500">PKR {product.price.toLocaleString()}</p>
                <Link 
                  to={`/product/${product.id}`} 
                  onClick={onProductClick}
                  className="text-xs text-brand-text hover:underline font-bold mt-1 inline-block"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default CompactProductCard;
