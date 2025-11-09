import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import Icon from './Icon';
import Logo from './Logo';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { cart, shopDetails } = useStore();
    
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <header className="bg-brand-blue-light/30 backdrop-blur-md shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-brand-text-light hover:text-brand-silver" onClick={onMenuClick}>
                            <Icon name="menu" className="w-7 h-7" />
                        </button>
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center gap-3">
                                <Logo className="w-14 h-14" placeholderClassName="bg-brand-silver/20" textClassName="text-2xl" />
                                <div className="flex flex-col">
                                    <span className="text-2xl font-sans font-bold tracking-widest text-brand-silver">
                                        {shopDetails.name?.toUpperCase()}
                                    </span>
                                    <span className="text-xs font-sans tracking-wider text-gray-400 -mt-1">
                                        STYLE WITH COMFORT
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                         <Link to="/track" className="text-brand-text-light hover:text-brand-silver text-sm font-semibold tracking-wider">
                            Track Order
                        </Link>
                        <Link to="/checkout" className="relative text-brand-text-light hover:text-brand-silver">
                            <Icon name="cart" className="w-7 h-7" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-silver-dark text-brand-blue text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;