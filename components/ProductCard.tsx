import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useStore } from '../hooks/useStore';
import StarRating from './StarRating';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { reviews } = useStore();
    const primaryImage = Object.values(product.images)?.[0]?.[0] || 'https://i.ibb.co/9s1T2rR/placeholder-shoe.png';

    const productReviews = reviews.filter(r => r.productId === product.id);
    const averageRating = productReviews.length > 0
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        : 0;
    
    return (
        <Link to={`/product/${product.id}`} className="group block overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-brand-blue-light/50 backdrop-blur-sm flex flex-col border border-brand-silver/10">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                 {product.salePrice && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        SALE
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-serif text-lg text-brand-text-light truncate">{product.name}</h3>
                <div className="mt-2 flex items-center">
                    <StarRating rating={averageRating} />
                    <span className="text-xs text-gray-400 ml-2">({productReviews.length} reviews)</span>
                </div>
                <div className="mt-auto pt-2 text-lg font-bold text-brand-silver">
                    {product.salePrice ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-red-400">PKR {product.salePrice.toLocaleString()}</span>
                            <span className="text-gray-500 line-through text-base">PKR {product.price.toLocaleString()}</span>
                        </div>
                    ) : (
                        <span>PKR {product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;