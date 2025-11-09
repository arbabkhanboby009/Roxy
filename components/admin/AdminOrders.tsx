import React, { useState, useMemo } from 'react';
import { useStore } from '../../hooks/useStore';
import type { Order, CartItem, Product } from '../../types';
import { OrderStatus, OrderType, PaymentMethod, TransactionMethod, TransactionType } from '../../types';
import Icon from '../Icon';
import Invoice from './Invoice';

const AddShopOrderModal: React.FC<{onClose: () => void, onAdd: (order: Omit<Order, 'id' | 'type' | 'createdAt'>) => void}> = ({onClose, onAdd}) => {
    const { products } = useStore();
    const [customer, setCustomer] = useState({ fullName: '', address: '', mobile: '', email: '' });
    const [orderItems, setOrderItems] = useState<CartItem[]>([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, products]);

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setSelectedColor(product.colors[0] || '');
        setSelectedSize(product.sizes[0] || '');
        setSearchTerm('');
        setQuantity(1);
    };

    const handleAddItem = () => {
        if (selectedProduct && selectedColor && selectedSize && quantity > 0) {
            const newItem: CartItem = {
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: quantity,
                selectedColor: selectedColor,
                selectedSize: selectedSize,
                image: selectedProduct.images[selectedColor]?.[0] || '',
            };
            setOrderItems(prev => [...prev, newItem]);
            setSelectedProduct(null);
            setSearchTerm('');
        }
    };
    
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.10;
    const deliveryCharge = 0; // In-shop orders have no delivery charge
    const grandTotal = subtotal + tax + deliveryCharge;

    const handleSubmit = () => {
        if (!customer.fullName || !customer.mobile || orderItems.length === 0) {
            alert("Please fill customer details and add at least one item.");
            return;
        }
        onAdd({
            customer,
            items: orderItems,
            subtotal,
            tax,
            deliveryCharge,
            grandTotal,
            paymentMethod: PaymentMethod.COD,
            status: OrderStatus.Delivered,
        });
        onClose();
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-brand-dark-pink focus:border-brand-dark-pink";
    
    const renderField = (label: string, name: keyof typeof customer, type: string = 'text') => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={customer[name]}
                onChange={e => setCustomer({...customer, [name]: e.target.value})}
                className={inputClass}
                required={name === 'fullName' || name === 'mobile'}
            />
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-brand-text">Add In-Shop Order</h2>
                    
                    <fieldset className="border p-4 rounded-md mb-4">
                        <legend className="px-2 font-semibold text-gray-700">Customer Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField("Full Name", "fullName")}
                            {renderField("Mobile Number", "mobile", "tel")}
                            {renderField("Address", "address")}
                            {renderField("Email", "email", "email")}
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-md mb-4">
                        <legend className="px-2 font-semibold text-gray-700">Order Items</legend>
                        <div className="relative mb-2">
                            <label className="block text-sm font-medium text-gray-700">Search Item (by ID or Name)</label>
                            <input type="text" placeholder="e.g., ROXXY-001 or Star Sneakers" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={inputClass} />
                            {searchResults.length > 0 && searchTerm && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                                    {searchResults.map(p => <li key={p.id} onClick={() => handleSelectProduct(p)} className="px-3 py-2 cursor-pointer hover:bg-gray-100">{p.id} - {p.name}</li> )}
                                </ul>
                            )}
                        </div>
                        {selectedProduct && (
                             <div className="bg-gray-50 p-3 rounded-md grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                <div className="md:col-span-4 font-semibold">{selectedProduct.name}</div>
                                <div>
                                    <label className="text-sm">Color</label>
                                    <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className={`${inputClass} mt-1`}>
                                        {selectedProduct.colors.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm">Size</label>
                                     <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className={`${inputClass} mt-1`}>
                                        {selectedProduct.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm">Quantity</label>
                                    <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} className={`${inputClass} mt-1`} />
                                </div>
                                <button type="button" onClick={handleAddItem} className="bg-blue-500 text-white px-4 py-2 rounded h-fit">Add Item</button>
                            </div>
                        )}
                        <div className="mt-4 space-y-2">
                             {orderItems.map((item, i) => <div key={i} className="flex justify-between p-2 bg-blue-50 rounded-md"><span>{item.name} ({item.selectedColor}, {item.selectedSize}) x{item.quantity}</span> <span>PKR {(item.price * item.quantity).toLocaleString()}</span></div>)}
                        </div>
                    </fieldset>

                    <div className="border-t pt-4 space-y-2 text-right">
                        <p>Subtotal: PKR {subtotal.toLocaleString()}</p>
                        <p>Tax (10%): PKR {tax.toLocaleString()}</p>
                        <p className="font-bold text-lg">Grand Total: PKR {grandTotal.toLocaleString()}</p>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-300 py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-brand-text text-white py-2 px-4 rounded-lg">Generate Invoice & Save Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PaymentConfirmationModal: React.FC<{ order: Order; onClose: () => void; onConfirm: (details: { method: TransactionMethod; remarks: string }) => void; }> = ({ order, onClose, onConfirm }) => {
    const [method, setMethod] = useState<TransactionMethod>(TransactionMethod.Cash);
    const [remarks, setRemarks] = useState('');

    const handleSubmit = () => {
        onConfirm({ method, remarks });
        onClose();
    };
    
    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-brand-dark-pink focus:border-brand-dark-pink";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Confirm Payment for Order #{order.id}</h2>
                <p>You are marking this order as delivered. Please confirm how payment was received to record it in the expense sheet.</p>
                <p className="font-bold text-2xl my-4 text-center">PKR {order.grandTotal.toLocaleString()}</p>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select value={method} onChange={e => setMethod(e.target.value as TransactionMethod)} className={inputClass}>
                            <option value={TransactionMethod.Cash}>Received by Cash</option>
                            <option value={TransactionMethod.Bank}>Received by Bank</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
                        <input type="text" id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} className={inputClass} placeholder="e.g., Paid in full" />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-300 py-2 px-4 rounded-lg">Cancel</button>
                    <button type="button" onClick={handleSubmit} className="bg-green-600 text-white py-2 px-4 rounded-lg">Confirm & Record Payment</button>
                </div>
            </div>
        </div>
    );
};

const AdminOrderHistory: React.FC = () => {
    const { orders, updateOrderStatus, addShopOrder, addTransaction, currentUser } = useStore();
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [filterType, setFilterType] = useState<'All' | 'Online' | 'In-Shop'>('All');

    const filteredAndSortedOrders = useMemo(() => {
        let sortableItems = [...orders];
        if (filterType !== 'All') sortableItems = sortableItems.filter(order => order.type === filterType);
        sortableItems.sort((a, b) => {
            const valA = sortConfig.key === 'date' ? b.createdAt.getTime() : a.grandTotal;
            const valB = sortConfig.key === 'date' ? a.createdAt.getTime() : b.grandTotal;
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        });
        return sortableItems;
    }, [orders, sortConfig, filterType]);
    
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
    
    const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
        if (newStatus === OrderStatus.Delivered && order.status !== OrderStatus.Delivered) {
            setViewingOrder(order);
            setIsPaymentModalOpen(true);
        } else {
            updateOrderStatus(order.id, newStatus);
        }
    };
    
    const handleConfirmPayment = (details: { method: TransactionMethod; remarks: string }) => {
        if (viewingOrder) {
            addTransaction({
                description: `Payment for Order #${viewingOrder.id}. ${details.remarks}`,
                amount: viewingOrder.grandTotal,
                type: TransactionType.Income,
                method: details.method,
                orderId: viewingOrder.id,
            });
            updateOrderStatus(viewingOrder.id, OrderStatus.Delivered);
            setViewingOrder(prev => prev ? {...prev, status: OrderStatus.Delivered } : null);
        }
    };
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
                 <div className="flex items-center gap-4">
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm text-black">
                        <option value="All">All Orders</option>
                        <option value="Online">Online</option>
                        <option value="In-Shop">In-Shop</option>
                    </select>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-brand-text text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center"><Icon name="plus" className="w-5 h-5 mr-2" /> Add Shop Order</button>
                </div>
            </div>
             <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Sr. No.</th>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedOrders.map((order, index) => (
                            <tr key={order.id} className="bg-white border-b">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${order.type === OrderType.Online ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'}`}>{order.type}</span></td>
                                <td className="px-6 py-4">{order.customer.fullName}</td>
                                <td className="px-6 py-4">{order.createdAt.toLocaleDateString()}</td>
                                <td className="px-6 py-4">PKR {order.grandTotal.toLocaleString()}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span></td>
                                <td className="px-6 py-4"><button onClick={() => setViewingOrder(order)} className="text-blue-600 hover:text-blue-800 font-medium">View Details</button></td>
                            </tr>
                        ))}
                         {filteredAndSortedOrders.length === 0 && (<tr><td colSpan={8} className="text-center py-8 text-gray-500">No orders match the current filter.</td></tr>)}
                    </tbody>
                </table>
            </div>

            {isAddModalOpen && <AddShopOrderModal onClose={() => setIsAddModalOpen(false)} onAdd={addShopOrder} />}

            {viewingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-4">Order Details: {viewingOrder.id}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold mb-2">Customer Information</h3>
                                <p><strong>Name:</strong> {viewingOrder.customer.fullName}</p>
                                <p><strong>Email:</strong> {viewingOrder.customer.email}</p>
                                <p><strong>Phone:</strong> {viewingOrder.customer.mobile}</p>
                                <p><strong>Address:</strong> {viewingOrder.customer.address}</p>
                                {viewingOrder.customer.location && <p><a href={`https://www.google.com/maps?q=${viewingOrder.customer.location.lat},${viewingOrder.customer.location.lng}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View on Google Maps</a></p>}
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">Order Summary</h3>
                                <p><strong>Total:</strong> PKR {viewingOrder.grandTotal.toLocaleString()}</p>
                                <p><strong>Payment:</strong> {viewingOrder.paymentMethod}</p>
                                <div className="flex items-center space-x-2">
                                    <strong>Status:</strong>
                                    <select value={viewingOrder.status} onChange={(e) => handleStatusChange(viewingOrder, e.target.value as OrderStatus)} className="p-1 border rounded bg-white text-black border-gray-300">
                                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                {viewingOrder.paymentScreenshot && (
                                    <div>
                                        <h4 className="font-bold mt-2">Payment Screenshot:</h4>
                                        <a href={viewingOrder.paymentScreenshot} target="_blank" rel="noopener noreferrer"><img src={viewingOrder.paymentScreenshot} alt="Payment" className="max-w-xs mt-1 rounded border"/></a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="font-bold mt-6 mb-2">Items Ordered</h3>
                        <div className="border rounded-lg">
                            {viewingOrder.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                    <div>
                                        <p className="font-semibold">{item.name} (x{item.quantity})</p>
                                        <p className="text-sm text-gray-500">Size: {item.selectedSize}, Color: {item.selectedColor}</p>
                                    </div>
                                    <p>PKR {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button onClick={() => setIsInvoiceVisible(true)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">View Invoice</button>
                            <button onClick={() => setViewingOrder(null)} className="bg-gray-300 py-2 px-4 rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
            
            {isInvoiceVisible && viewingOrder && <Invoice order={viewingOrder} onClose={() => setIsInvoiceVisible(false)} />}
            {isPaymentModalOpen && viewingOrder && <PaymentConfirmationModal order={viewingOrder} onClose={() => setIsPaymentModalOpen(false)} onConfirm={handleConfirmPayment} />}
        </div>
    );
};

export default AdminOrderHistory;
