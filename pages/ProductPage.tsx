import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import StarRating from '../components/StarRating';

const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { products, addToCart, reviews, addReview } = useStore();
    const product = products.find(p => p.id === productId);

    const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
    const [selectedImage, setSelectedImage] = useState('');
    const [notification, setNotification] = useState('');
    
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    useEffect(() => {
        if (product && selectedColor) {
            setSelectedImage(product.images[selectedColor]?.[0] || '');
        }
    }, [product, selectedColor]);
    
    const productReviews = useMemo(() => reviews.filter(r => r.productId === productId), [reviews, productId]);
    const averageRating = useMemo(() => productReviews.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : 0, [productReviews]);

    if (!product) {
        return <div>Product not found</div>;
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            setNotification('Please select a size and color.');
            return;
        }
        const success = addToCart(product, selectedSize, selectedColor);
        if (success) {
            setNotification(`${product.name} added to cart!`);
            setTimeout(() => setNotification(''), 3000);
        }
    };
    
    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reviewName && reviewComment) {
            addReview(product.id, { customerName: reviewName, rating: reviewRating, comment: reviewComment });
            setReviewName('');
            setReviewRating(5);
            setReviewComment('');
        }
    };
    
    const stockInfo = product.stock.find(s => s.color === selectedColor && s.size === selectedSize);
    const isOutOfStock = !stockInfo || stockInfo.quantity <= 0;

    return (
        <div className="space-y-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <img src={selectedImage || product.images[product.colors[0]][0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {(product.images[selectedColor] || []).map((img, index) => (
                                <button key={index} onClick={() => setSelectedImage(img)} className={`aspect-square bg-gray-100 rounded-md overflow-hidden ring-2 ${selectedImage === img ? 'ring-brand-dark-pink' : 'ring-transparent'}`}>
                                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-brand-text">{product.name}</h1>
                        <div className="flex items-center my-4">
                            <StarRating rating={averageRating} />
                            <span className="text-sm text-gray-500 ml-2">({productReviews.length} reviews)</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-text mb-4">PKR {product.price.toLocaleString()}</p>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        
                        <div className="mt-8">
                            {/* Color Selector */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 mb-2">Color: {selectedColor}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 transition shadow-sm ${selectedColor === color ? 'ring-2 ring-offset-2 ring-brand-text border-brand-text' : 'border-gray-400'}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            title={color}
                                        ></button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-gray-800 mb-2">Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-md transition ${selectedSize === size ? 'bg-brand-text text-white border-brand-text' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full bg-brand-text text-white font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            {notification && <p className="mt-4 text-center text-green-600">{notification}</p>}
                        </div>
                    </div>
                </div>
            </div>
            
             {/* Customer Reviews Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-serif font-bold text-brand-text mb-6">Customer Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        {productReviews.length > 0 ? (
                            productReviews.map(review => (
                                <div key={review.id} className="border-b pb-4">
                                    <div className="flex items-center mb-1">
                                        <StarRating rating={review.rating} />
                                        <p className="ml-3 font-bold text-gray-800">{review.customerName}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{review.createdAt.toLocaleDateString()}</p>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold text-brand-text mb-4">Leave a Review</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                             <div>
                                <label htmlFor="reviewName" className="block text-sm font-medium text-gray-700">Your Name</label>
                                <input type="text" id="reviewName" value={reviewName} onChange={e => setReviewName(e.target.value)} className="mt-1 w-full border p-2 rounded-md" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Rating</label>
                                <div className="mt-1">
                                    <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700">Comment</label>
                                <textarea id="reviewComment" value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={4} className="mt-1 w-full border p-2 rounded-md" required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-brand-text text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90">Submit Review</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;