import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import Icon from './Icon';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="font-bold text-xl text-brand-text">Menu</h2>
                    <button onClick={onClose}><Icon name="close" className="w-6 h-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
                    <nav className="space-y-4">
                        {Object.entries(CATEGORIES).map(([category, subcategories]) => (
                            <div key={category}>
                                <Link to={`/category/${category.toLowerCase()}`} onClick={onClose} className="font-bold text-lg text-gray-800 hover:text-brand-text transition-colors duration-200 block mb-2">{category}</Link>
                                <ul className="space-y-2 pl-3 border-l-2 border-brand-pink">
                                    {subcategories.map(sub => (
                                        <li key={sub}>
                                            <span className="text-sm text-gray-600">{sub}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Information</h3>
                        <ul className="space-y-3">
                            <li><NavLink to="/contact" onClick={onClose} className={({ isActive }) => `block text-gray-600 hover:text-brand-text transition-colors duration-200 ${isActive ? 'font-bold text-brand-text' : ''}`}>Contact Us</NavLink></li>
                            <li><NavLink to="/terms" onClick={onClose} className={({ isActive }) => `block text-gray-600 hover:text-brand-text transition-colors duration-200 ${isActive ? 'font-bold text-brand-text' : ''}`}>Terms & Conditions</NavLink></li>
                            <li><NavLink to="/privacy" onClick={onClose} className={({ isActive }) => `block text-gray-600 hover:text-brand-text transition-colors duration-200 ${isActive ? 'font-bold text-brand-text' : ''}`}>Privacy Policy</NavLink></li>
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default MobileSidebar;
