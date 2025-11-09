import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Sidebar: React.FC = () => {
    return (
        <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0 bg-white p-6 rounded-lg shadow-md self-start">
            <h2 className="text-2xl font-serif font-bold text-brand-text mb-6">Shop by Category</h2>
            
            <nav className="space-y-4">
                {Object.entries(CATEGORIES).map(([category, subcategories]) => (
                    <div key={category}>
                        <Link to={`/category/${category.toLowerCase()}`} className="font-bold text-lg text-gray-800 hover:text-brand-text transition-colors duration-200 block mb-2">{category}</Link>
                        <ul className="space-y-1 pl-3 border-l-2 border-brand-pink">
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
                    <ul className="space-y-2">
                        <li><NavLink to="/contact" className={({ isActive }) => `block text-gray-600 hover:text-brand-text transition-colors duration-200 ${isActive ? 'font-bold text-brand-text' : ''}`}>Contact Us</NavLink></li>
                        <li><NavLink to="/terms" className={({ isActive }) => `block text-gray-600 hover:text-brand-text transition-colors duration-200 ${isActive ? 'font-bold text-brand-text' : ''}`}>Terms & Conditions</NavLink></li>
                        <li><NavLink to="/privacy" className={({ isActive }) => `block text-gray-600 hover:text-brand-text transition-colors duration-200 ${isActive ? 'font-bold text-brand-text' : ''}`}>Privacy Policy</NavLink></li>
                    </ul>
            </div>
        </aside>
    );
};

export default Sidebar;