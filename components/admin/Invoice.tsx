import React from 'react';
import type { Order } from '../../types';
import { useStore } from '../../hooks/useStore';

interface InvoiceProps {
    order: Order;
    onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ order, onClose }) => {
    const { shopDetails } = useStore();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4 print:p-0 print:bg-white">
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .invoice-container, .invoice-container * {
                        visibility: visible;
                    }
                    .invoice-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        border: none;
                    }
                    .no-print {
                        display: none;
                    }
                }
                `}
            </style>
            <div className="invoice-container bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-4 border-b">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-brand-text">{shopDetails.name}</h1>
                            <p className="text-sm text-gray-500">{shopDetails.address}</p>
                            <p className="text-sm text-gray-500">{shopDetails.contactMobile} | {shopDetails.email}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-semibold text-gray-700">INVOICE</h2>
                            <p className="text-sm text-gray-500"><strong>Invoice #:</strong> {order.id}</p>
                            <p className="text-sm text-gray-500"><strong>Date:</strong> {order.createdAt.toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="py-6">
                        <h3 className="font-semibold text-gray-500 uppercase text-sm mb-2">Bill To</h3>
                        <p className="font-bold text-gray-800">{order.customer.fullName}</p>
                        <p className="text-gray-600">{order.customer.address}</p>
                        <p className="text-gray-600">{order.customer.mobile}</p>
                        <p className="text-gray-600">{order.customer.email}</p>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Item</th>
                                    <th scope="col" className="px-6 py-3 text-center">Qty</th>
                                    <th scope="col" className="px-6 py-3 text-right">Unit Price</th>
                                    <th scope="col" className="px-6 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index} className="bg-white border-b">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.name} <span className="text-gray-500 text-xs">({item.selectedSize}, {item.selectedColor})</span></td>
                                        <td className="px-6 py-4 text-center">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right">PKR {item.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">PKR {(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mt-6">
                        <div className="w-full max-w-sm space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium text-gray-800">PKR {order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sales Tax (10%):</span>
                                <span className="font-medium text-gray-800">PKR {order.tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Charge:</span>
                                <span className="font-medium text-gray-800">PKR {order.deliveryCharge.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 mt-2 font-bold text-lg">
                                <span className="text-gray-900">Grand Total:</span>
                                <span className="text-brand-text">PKR {order.grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                     <div className="border-t mt-8 pt-4 text-center text-xs text-gray-500">
                        <p>Thank you for your business!</p>
                        <p>This is a computer-generated invoice and does not require a signature.</p>
                    </div>

                </div>
                 <div className="no-print flex justify-end space-x-4 p-4 bg-gray-50 rounded-b-lg border-t">
                    <button onClick={onClose} className="bg-gray-300 py-2 px-4 rounded-lg">Close</button>
                    <button onClick={handlePrint} className="bg-blue-600 text-white py-2 px-4 rounded-lg">Print Invoice</button>
                </div>
            </div>
        </div>
    );
};

export default Invoice;