import React, { useState, useEffect, useMemo, useRef, KeyboardEvent } from 'react';
import { useParams } from 'react-router-dom';
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

    const reviewNameRef = useRef<HTMLInputElement>(null);
    const reviewCommentRef = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        if (product && selectedColor) {
            setSelectedImage(product.images[selectedColor]?.[0] || '');
        }
    }, [product, selectedColor]);
    
    const productReviews = useMemo(() => reviews.filter(r => r.productId === productId), [reviews, productId]);
    const averageRating = useMemo(() => productReviews.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : 0, [productReviews]);

    if (!product) {
        return <div className="text-center text-brand-silver">Product not found</div>;
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
    
    const handleReviewKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            reviewCommentRef.current?.focus();
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
    
    const inputClass = "w-full p-2 rounded-md bg-brand-blue-light border border-brand-silver/30 text-brand-text-light focus:ring-1 focus:ring-brand-silver focus:outline-none";

    return (
        <div className="space-y-12">
            <div className="bg-brand-blue-light/50 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-brand-silver/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="aspect-square bg-brand-blue/50 rounded-lg overflow-hidden mb-4 border border-brand-silver/10">
                            <img src={selectedImage || product.images[product.colors[0]]?.[0] || Object.values(product.images)?.[0]?.[0] || 'https://i.ibb.co/9s1T2rR/placeholder-shoe.png'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {(product.images[selectedColor] || []).map((img, index) => (
                                <button key={index} onClick={() => setSelectedImage(img)} className={`aspect-square bg-brand-blue/50 rounded-md overflow-hidden ring-2 ring-offset-2 ring-offset-brand-blue-light ${selectedImage === img ? 'ring-brand-silver' : 'ring-transparent'}`}>
                                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-brand-silver">{product.name}</h1>
                        <div className="flex items-center my-4">
                            <StarRating rating={averageRating} />
                            <span className="text-sm text-gray-400 ml-2">({productReviews.length} reviews)</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-silver mb-4">PKR {product.price.toLocaleString()}</p>
                        <p className="text-brand-text-light leading-relaxed">{product.description}</p>
                        
                        <div className="mt-8">
                            {/* Color Selector */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-300 mb-2">Color: {selectedColor}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 transition shadow-sm ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-brand-blue-light ring-brand-silver border-brand-silver' : 'border-gray-600'}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            title={color}
                                        ></button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-gray-300 mb-2">Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-md transition ${selectedSize === size ? 'bg-brand-silver text-brand-blue border-brand-silver' : 'bg-transparent text-brand-text-light border-brand-silver/30 hover:bg-brand-blue-light'}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full bg-brand-silver text-brand-blue font-bold py-4 px-8 rounded-lg hover:bg-brand-silver-dark transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
                                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            {notification && <p className="mt-4 text-center text-green-400">{notification}</p>}
                        </div>
                    </div>
                </div>
            </div>
            
             {/* Customer Reviews Section */}
            <div className="bg-brand-blue-light/50 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-brand-silver/10">
                <h2 className="text-3xl font-serif font-bold text-brand-silver mb-6">Customer Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        {productReviews.length > 0 ? (
                            productReviews.map(review => (
                                <div key={review.id} className="border-b border-brand-silver/20 pb-4">
                                    <div className="flex items-center mb-1">
                                        <StarRating rating={review.rating} />
                                        <p className="ml-3 font-bold text-gray-300">{review.customerName}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{review.createdAt.toLocaleDateString()}</p>
                                    <p className="text-brand-text-light">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No reviews yet. Be the first to leave a review!</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold text-brand-silver mb-4">Leave a Review</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                             <div>
                                <label htmlFor="reviewName" className="block text-sm font-medium text-gray-300">Your Name</label>
                                <input type="text" id="reviewName" ref={reviewNameRef} onKeyDown={handleReviewKeyDown} value={reviewName} onChange={e => setReviewName(e.target.value)} className={`${inputClass} mt-1`} required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Rating</label>
                                <div className="mt-1">
                                    <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-300">Comment</label>
                                <textarea id="reviewComment" ref={reviewCommentRef} value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={4} className={`${inputClass} mt-1`} required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-brand-silver text-brand-blue font-bold py-3 px-6 rounded-lg hover:bg-brand-silver-dark">Submit Review</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;