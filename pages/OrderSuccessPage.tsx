import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import Invoice from '../components/admin/Invoice';

const OrderSuccessPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { orders } = useStore();
    const order = orders.find(o => o.id === orderId);
    const [isReceiptVisible, setIsReceiptVisible] = useState(false);

    if (!order) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-serif">Order not found.</h1>
            </div>
        )
    }

    return (
        <div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
                    <h1 className="text-4xl font-serif font-bold text-brand-text mb-4">Thank You!</h1>
                    <p className="text-lg text-gray-600 mb-6">Your order has been placed successfully.</p>
                    <div className="bg-brand-pink/50 p-6 rounded-md text-left">
                        <p className="mb-2"><span className="font-bold">Order ID:</span> {order.id}</p>
                        <p className="mb-2"><span className="font-bold">Name:</span> {order.customer.fullName}</p>
                        <p className="mb-2"><span className="font-bold">Total Amount:</span> PKR {order.grandTotal.toLocaleString()}</p>
                        <p>An invoice has been sent to your email: <span className="font-semibold">{order.customer.email}</span></p>
                    </div>
                    <div className="mt-8 flex justify-center items-center space-x-4">
                        <Link to="/" className="inline-block bg-brand-text text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-colors duration-300">
                            Continue Shopping
                        </Link>
                        <button onClick={() => setIsReceiptVisible(true)} className="inline-block bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-colors duration-300">
                            View Receipt
                        </button>
                    </div>
                </div>
            </div>
            {isReceiptVisible && order && <Invoice order={order} onClose={() => setIsReceiptVisible(false)} />}
        </div>
    );
};

export default OrderSuccessPage;
