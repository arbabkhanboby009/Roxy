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
    // Get the first image of the first color available as the main card image.
    const primaryImage = Object.values(product.images)?.[0]?.[0] || 'https://i.ibb.co/9s1T2rR/placeholder-shoe.png';

    const productReviews = reviews.filter(r => r.productId === product.id);
    const averageRating = productReviews.length > 0
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        : 0;
    
    return (
        <Link to={`/product/${product.id}`} className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-serif text-lg text-brand-text truncate">{product.name}</h3>
                <div className="mt-2 flex items-center">
                    <StarRating rating={averageRating} />
                    <span className="text-xs text-gray-500 ml-2">({productReviews.length} reviews)</span>
                </div>
                <p className="mt-auto pt-2 text-lg font-bold text-brand-text">PKR {product.price.toLocaleString()}</p>
            </div>
        </Link>
    );
};

export default ProductCard;