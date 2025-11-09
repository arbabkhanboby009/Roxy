import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { OrderStatus } from '../types';

const TrackOrderPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { orders, cancelOrderByCustomer } = useStore();

    const [searchId, setSearchId] = useState('');
    const [error, setError] = useState('');
    
    const order = orderId ? orders.find(o => o.id.toLowerCase() === orderId.toLowerCase()) : null;

    useEffect(() => {
        if (orderId && !order) {
            setError(`Order with ID "${orderId}" not found.`);
        } else {
            setError('');
        }
    }, [orderId, order]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/track/${searchId.trim()}`);
        }
    };
    
    const handleCancelOrder = () => {
        if (order && window.confirm("Are you sure you want to cancel this order?")) {
            const success = cancelOrderByCustomer(order.id);
            if (!success) {
                alert("This order can no longer be cancelled.");
            }
            // The component will re-render with the new status
        }
    };

    const getStatusInfo = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending: return { text: 'Pending Confirmation', color: 'text-yellow-400' };
            case OrderStatus.Confirmed: return { text: 'Order Confirmed', color: 'text-blue-400' };
            case OrderStatus.Dispatched: return { text: 'Out for Delivery', color: 'text-indigo-400' };
            case OrderStatus.Delivered: return { text: 'Delivered', color: 'text-green-400' };
            case OrderStatus.Cancelled: return { text: 'Cancelled', color: 'text-red-400' };
            default: return { text: 'Unknown', color: 'text-gray-400' };
        }
    };

    return (
        <div className="bg-brand-blue-light/50 backdrop-blur-sm p-8 rounded-lg shadow-md text-brand-text-light max-w-3xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-brand-silver mb-8 text-center">Track Your Order</h1>
            
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <input 
                    type="text" 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter your Order ID (e.g., ONL-001)"
                    className="flex-grow w-full px-4 py-2 border border-brand-silver/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-silver bg-brand-blue-light text-brand-text-light placeholder:text-gray-400"
                />
                <button type="submit" className="bg-brand-silver text-brand-blue font-bold py-2 px-6 rounded-md hover:bg-brand-silver-dark transition-colors">
                    Track
                </button>
            </form>

            {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            {order && (
                <div className="border-t border-brand-silver/20 pt-6">
                    <h2 className="text-2xl font-serif text-brand-silver mb-4">Order Details</h2>
                    <div className="bg-brand-blue/50 p-6 rounded-md space-y-3">
                        <p className="flex justify-between">
                            <span className="font-bold text-gray-300">Order ID:</span> 
                            <span>{order.id}</span>
                        </p>
                         <p className="flex justify-between">
                            <span className="font-bold text-gray-300">Customer Name:</span> 
                            <span>{order.customer.fullName}</span>
                        </p>
                        <p className="flex justify-between items-center">
                            <span className="font-bold text-gray-300">Status:</span> 
                            <span className={`font-bold text-lg ${getStatusInfo(order.status).color}`}>
                                {getStatusInfo(order.status).text}
                            </span>
                        </p>
                    </div>

                    {(order.status === OrderStatus.Pending || order.status === OrderStatus.Confirmed) && (
                        <div className="mt-6 text-center">
                             <button 
                                onClick={handleCancelOrder}
                                className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors duration-300"
                            >
                                Cancel Order
                            </button>
                        </div>
                    )}
                     {order.status === OrderStatus.Delivered && (
                        <p className="mt-6 text-center text-green-400">This order has been successfully delivered. Thank you for shopping with us!</p>
                     )}
                     {order.status === OrderStatus.Cancelled && (
                        <p className="mt-6 text-center text-red-400">This order has been cancelled.</p>
                     )}
                </div>
            )}
        </div>
    );
};

export default TrackOrderPage;