import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useStore } from '../hooks/useStore';
import { PaymentMethod } from '../types';

const CheckoutPage: React.FC = () => {
    const { cart, getCartTotal, removeFromCart, updateCartQuantity, placeOrder, bankDetails, walletDetails } = useStore();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ fullName: '', address: '', mobile: '', altMobile: '', email: '' });
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState('Click to capture location');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const subtotal = getCartTotal();
    const tax = subtotal * 0.10;
    const deliveryCharge = 300; // Standard delivery charge
    const grandTotal = subtotal + tax + deliveryCharge;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleLocationCapture = () => {
        if (navigator.geolocation) {
            setLocationStatus('Capturing...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                    setLocationStatus('Location Captured!');
                },
                () => {
                    setLocationStatus('Unable to retrieve location. Please check permissions.');
                }
            );
        } else {
            setLocationStatus('Geolocation is not supported by this browser.');
        }
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshot(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!customer.fullName) newErrors.fullName = 'Full Name is required';
        if (!customer.address) newErrors.address = 'Address is required';
        if (!customer.mobile) newErrors.mobile = 'Mobile Number is required';
        if (!customer.email) newErrors.email = 'Email is required';
        if (!location) newErrors.location = 'Location capture is required';
        if (paymentMethod === PaymentMethod.Online && !screenshot) newErrors.screenshot = 'Payment screenshot is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const order = placeOrder({ ...customer, location: location || undefined }, paymentMethod, screenshot || undefined);
            navigate(`/order-success/${order.id}`);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto text-center py-20">
                <h1 className="text-3xl font-serif">Your Cart is Empty</h1>
                <button onClick={() => navigate('/')} className="mt-6 bg-brand-text text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90">Continue Shopping</button>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-4xl font-serif font-bold text-brand-text mb-8 text-center">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Order Form */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-serif font-bold mb-6">Shipping Details</h2>
                    {Object.entries(customer).map(([key, value]) => (
                         <div key={key} className="mb-4">
                            <label htmlFor={key} className="block text-sm font-bold text-gray-700 mb-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                            <input type={key === 'email' ? 'email' : 'text'} id={key} name={key} value={value} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark-pink" />
                            {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                        </div>
                    ))}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Live Location</label>
                        <button type="button" onClick={handleLocationCapture} className="w-full text-left px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{locationStatus}</button>
                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>
                    
                    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">Payment Method</h2>
                    <div className="space-y-4">
                         <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                            <input type="radio" name="paymentMethod" value={PaymentMethod.COD} checked={paymentMethod === PaymentMethod.COD} onChange={() => setPaymentMethod(PaymentMethod.COD)} className="h-4 w-4 text-brand-text focus:ring-brand-dark-pink"/>
                            <span className="ml-3 text-gray-700 font-medium">{PaymentMethod.COD}</span>
                        </label>
                         <label className="flex flex-col p-4 border rounded-lg cursor-pointer">
                            <div className="flex items-center">
                                <input type="radio" name="paymentMethod" value={PaymentMethod.Online} checked={paymentMethod === PaymentMethod.Online} onChange={() => setPaymentMethod(PaymentMethod.Online)} className="h-4 w-4 text-brand-text focus:ring-brand-dark-pink"/>
                                <span className="ml-3 text-gray-700 font-medium">{PaymentMethod.Online}</span>
                            </div>
                            {paymentMethod === PaymentMethod.Online && (
                                <div className="mt-4 pl-7 text-sm text-gray-600 border-l-2 border-brand-pink ml-2 space-y-3">
                                    {bankDetails.map(bank => (
                                        <div key={bank.id}>
                                            <p className="font-bold">{bank.bankName}</p>
                                            <p>Title: {bank.accountTitle}</p>
                                            <p>Account: {bank.accountNumber}</p>
                                        </div>
                                    ))}
                                    {walletDetails.map(wallet => (
                                        <div key={wallet.id}>
                                            <p className="font-bold mt-2">{wallet.walletName}</p>
                                            <p>Title: {wallet.accountTitle}</p>
                                            <p>Number: {wallet.walletNumber}</p>
                                        </div>
                                    ))}
                                    <div className="mt-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Upload Payment Screenshot</label>
                                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="text-sm" />
                                        {screenshot && <img src={screenshot} alt="Payment proof" className="mt-2 h-24 w-auto rounded"/>}
                                        {errors.screenshot && <p className="text-red-500 text-xs mt-1">{errors.screenshot}</p>}
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>
                    <button type="submit" className="w-full mt-8 bg-brand-text text-white font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-colors duration-300">Place Order</button>
                </form>

                {/* Cart Summary */}
                <div className="bg-white p-8 rounded-lg shadow-md h-fit">
                    <h2 className="text-2xl font-serif font-bold mb-6">Your Cart</h2>
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-sm text-gray-500">Size: {item.selectedSize}, Color: {item.selectedColor}</p>
                                        <p className="text-sm text-gray-500">PKR {item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-1"><Icon name="minus" className="w-4 h-4" /></button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-1"><Icon name="plus" className="w-4 h-4" /></button>
                                    <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="ml-4 text-red-500 hover:text-red-700"><Icon name="trash" className="w-5 h-5"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-6 pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>PKR {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Sales Tax (10%)</span>
                            <span>PKR {tax.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Delivery Charge</span>
                            <span>PKR {deliveryCharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl mt-2 border-t pt-2">
                            <span>Grand Total</span>
                            <span>PKR {grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
