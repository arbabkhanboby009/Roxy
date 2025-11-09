import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import Icon from './Icon';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { cart, shopDetails, notifications } = useStore();
    const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
    const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationCenterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-3">
                            {shopDetails.logo ? (
                                <img src={shopDetails.logo} alt={`${shopDetails.name} Logo`} className="w-14 h-14 object-contain" />
                            ) : (
                                <div className="w-14 h-14 flex-shrink-0">
                                    <svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-full h-full text-brand-text">
                                      <path d="M21.43,11.39,15.6,22.24h8.86a4.1,4.1,0,1,0,0-8.2H21.43Zm0-3.3H24.46a7.4,7.4,0,0,1,0,14.79H12.91L5,32.41H18.2L28.14,14.6,39.8,32.41H59L50.2,17.13a7.4,7.4,0,0,1-3-14.21H39.8V0H21.43ZM47.2,14.5a4.1,4.1,0,1,0-4.43,4.1H51.5A4.08,4.08,0,0,0,47.2,14.5Z M31.84,48,24,35.11,16.14,48Z" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-2xl font-sans font-bold tracking-widest text-brand-text">
                                    {shopDetails.name.toUpperCase()}
                                </span>
                                <span className="text-xs font-sans tracking-wider text-gray-500 -mt-1">
                                    STYLE WITH COMFORT
                                </span>
                            </div>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="relative" ref={notificationRef}>
                            <button onClick={() => setNotificationCenterOpen(prev => !prev)} className="relative text-gray-600 hover:text-brand-text">
                                <Icon name="bell" className="w-7 h-7" />
                                {unreadNotificationCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadNotificationCount}
                                    </span>
                                )}
                            </button>
                            {isNotificationCenterOpen && <NotificationCenter onClose={() => setNotificationCenterOpen(false)} />}
                        </div>
                        
                        <Link to="/checkout" className="relative text-gray-600 hover:text-brand-text">
                            <Icon name="cart" className="w-7 h-7" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-dark-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        <button className="lg:hidden text-gray-600 hover:text-brand-text" onClick={onMenuClick}>
                            <Icon name="menu" className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;