import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activeSubcategory = queryParams.get('subcategory');

    const getLinkClass = (category: string, subcategory: string) => {
        const isActive = location.pathname.includes(category) && activeSubcategory === subcategory;
        return `block text-sm text-gray-600 hover:text-brand-text transition-colors duration-200 ${isActive ? 'font-bold text-brand-text' : ''}`;
    };

    return (
        <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0 bg-white p-6 rounded-lg shadow-md self-start">
            <h2 className="text-2xl font-serif font-bold text-brand-text mb-6">Shop by Category</h2>
            
            <nav className="space-y-4">
                <div>
                    <Link to={`/category/ladies`} className="font-bold text-lg text-gray-800 hover:text-brand-text transition-colors duration-200 block mb-2">Ladies</Link>
                    <ul className="space-y-1 pl-3 border-l-2 border-brand-pink">
                        {CATEGORIES['Ladies'].map(sub => (
                            <li key={sub}><Link to={`/category/ladies?subcategory=${encodeURIComponent(sub)}`} className={getLinkClass('ladies', sub)}>{sub}</Link></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-bold text-lg text-gray-800 mb-2">Kids</p>
                    <div className="space-y-3 pl-3 border-l-2 border-brand-pink">
                         {Object.entries(CATEGORIES.Kids).map(([parentCat, subCats]) => (
                             <div key={parentCat}>
                                <Link to={`/category/${parentCat.toLowerCase()}`} className="font-semibold text-md text-gray-700 hover:text-brand-text transition-colors duration-200 block mb-1">{parentCat}</Link>
                                 <ul className="space-y-1 pl-3">
                                    {subCats.map(sub => (
                                        <li key={sub}><Link to={`/category/${parentCat.toLowerCase()}?subcategory=${encodeURIComponent(sub)}`} className={getLinkClass(parentCat.toLowerCase(), sub)}>{sub}</Link></li>
                                    ))}
                                </ul>
                            </div>
                         ))}
                    </div>
                </div>
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
