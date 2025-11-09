import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { OrderStatus, TransactionMethod, TransactionType } from '../../types';

interface OrderNotificationModalProps {
    orderId: string;
    onClose: () => void;
}

const OrderNotificationModal: React.FC<OrderNotificationModalProps> = ({ orderId, onClose }) => {
    const { orders, updateOrderStatus, addTransaction } = useStore();
    const order = orders.find(o => o.id === orderId);
    
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<TransactionMethod>(TransactionMethod.Cash);

    if (!order) {
        return null;
    }

    const handleStatusUpdate = (newStatus: OrderStatus) => {
        if (newStatus === OrderStatus.Delivered) {
            setIsPaymentModalOpen(true);
        } else {
            updateOrderStatus(order.id, newStatus);
            onClose();
        }
    };
    
    const handleConfirmPayment = () => {
        addTransaction({
            description: `Payment received for Order #${order.id}`,
            amount: order.grandTotal,
            type: TransactionType.Income,
            method: paymentMethod,
            orderId: order.id
        });
        updateOrderStatus(order.id, OrderStatus.Delivered);
        setIsPaymentModalOpen(false);
        onClose();
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case OrderStatus.Confirmed: return 'bg-blue-100 text-blue-800';
            case OrderStatus.Dispatched: return 'bg-indigo-100 text-indigo-800';
            case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
            case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-brand-dark-pink focus:border-brand-dark-pink";

    const renderActionButtons = () => {
        switch (order.status) {
            case OrderStatus.Pending:
                return <button onClick={() => handleStatusUpdate(OrderStatus.Confirmed)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Confirm Order</button>;
            case OrderStatus.Confirmed:
                return <button onClick={() => handleStatusUpdate(OrderStatus.Dispatched)} className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Dispatch Order</button>;
            case OrderStatus.Dispatched:
                return <button onClick={() => handleStatusUpdate(OrderStatus.Delivered)} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">Mark as Delivered</button>;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">Order Details</h2>
                            <p className="text-gray-500">Order ID: {order.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold mb-2">Customer Information</h3>
                            <p><strong>Name:</strong> {order.customer.fullName}</p>
                            <p><strong>Email:</strong> {order.customer.email}</p>
                            <p><strong>Phone:</strong> {order.customer.mobile}</p>
                            <p><strong>Address:</strong> {order.customer.address}</p>
                            {order.customer.location && <p><a href={`https://www.google.com/maps?q=${order.customer.location.lat},${order.customer.location.lng}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View on Google Maps</a></p>}
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Order Summary</h3>
                            <p><strong>Total:</strong> PKR {order.grandTotal.toLocaleString()}</p>
                            <p><strong>Payment:</strong> {order.paymentMethod}</p>
                            {order.paymentScreenshot && (
                                <div>
                                    <h4 className="font-bold mt-2">Payment Screenshot:</h4>
                                    <a href={order.paymentScreenshot} target="_blank" rel="noopener noreferrer"><img src={order.paymentScreenshot} alt="Payment" className="max-w-xs mt-1 rounded border"/></a>
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="font-bold mt-6 mb-2">Items Ordered</h3>
                    <div className="border rounded-lg">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                <div>
                                    <p className="font-semibold">{item.name} (x{item.quantity})</p>
                                    <p className="text-sm text-gray-500">Size: {item.selectedSize}, Color: {item.selectedColor}</p>
                                </div>
                                <p>PKR {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {renderActionButtons()}
                        {/* FIX: Only allow cancellation if order is not delivered or cancelled */}
                        {!['Delivered', 'Cancelled'].includes(order.status) && (
                            <button
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to cancel this order? This action will restock the items.`)) {
                                        updateOrderStatus(order.id, OrderStatus.Cancelled);
                                        onClose();
                                    }
                                }}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                                Cancel Order
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400">Close</button>
                </div>
            </div>
            
            {isPaymentModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirm Payment for Order #{order.id}</h2>
                        <p className="text-sm text-gray-600 mb-4">You are marking this order as delivered. Please confirm how payment was received to record it in the expense sheet.</p>
                        <p className="font-bold text-2xl my-4 text-center text-brand-blue">PKR {order.grandTotal.toLocaleString()}</p>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as TransactionMethod)} className={inputClass}>
                                    <option value={TransactionMethod.Cash}>Received by Cash</option>
                                    <option value={TransactionMethod.Bank}>Received by Bank</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="bg-gray-300 py-2 px-4 rounded-lg">Cancel</button>
                            <button type="button" onClick={handleConfirmPayment} className="bg-green-600 text-white py-2 px-4 rounded-lg">Confirm & Record Payment</button>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default OrderNotificationModal;
