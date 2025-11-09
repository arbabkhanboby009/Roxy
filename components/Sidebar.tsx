import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useStore } from '../hooks/useStore';
import Logo from './Logo';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { shopDetails } = useStore();
    const queryParams = new URLSearchParams(location.search);
    const activeSubcategory = queryParams.get('subcategory');

    const getLinkClass = (category: string, subcategory: string) => {
        const isActive = location.pathname.includes(category) && activeSubcategory === subcategory;
        return `block text-sm text-brand-text-light hover:text-brand-silver transition-colors duration-200 ${isActive ? 'font-bold text-brand-silver' : ''}`;
    };

    return (
        <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0 bg-brand-blue-light/30 backdrop-blur-sm p-6 rounded-lg shadow-lg self-start border border-brand-silver/10">
            <div className="flex flex-col items-center text-center pb-6 mb-6 border-b border-brand-silver/20">
                <Logo className="w-24 h-24 rounded-full mb-3 shadow-md" placeholderClassName="bg-brand-silver/20" textClassName="text-5xl" />
                <h2 className="text-2xl font-serif font-bold text-brand-silver">{shopDetails.name}</h2>
            </div>
            
            <h3 className="text-xl font-serif font-bold text-brand-silver mb-4">Shop by Category</h3>
            <nav className="space-y-4">
                <div>
                    <Link to={`/category/ladies`} className="font-bold text-lg text-gray-300 hover:text-brand-silver transition-colors duration-200 block mb-2">Ladies</Link>
                    <ul className="space-y-1 pl-3 border-l-2 border-brand-silver/30">
                        {CATEGORIES['Ladies'].map(sub => (
                            <li key={sub}><Link to={`/category/ladies?subcategory=${encodeURIComponent(sub)}`} className={getLinkClass('ladies', sub)}>{sub}</Link></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-bold text-lg text-gray-300 mb-2">Kids</p>
                    <div className="space-y-3 pl-3 border-l-2 border-brand-silver/30">
                         {Object.entries(CATEGORIES.Kids).map(([parentCat, subCats]) => (
                             <div key={parentCat}>
                                <Link to={`/category/${parentCat.toLowerCase()}`} className="font-semibold text-md text-gray-300 hover:text-brand-silver transition-colors duration-200 block mb-1">{parentCat}</Link>
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

            <div className="mt-8 pt-6 border-t border-brand-silver/20">
                    <h3 className="font-bold text-lg text-gray-300 mb-2">Information</h3>
                    <ul className="space-y-2">
                        <li><NavLink to="/track" className={({ isActive }) => `block text-brand-text-light hover:text-brand-silver transition-colors duration-200 ${isActive ? 'font-bold text-brand-silver' : ''}`}>Track Your Order</NavLink></li>
                        <li><NavLink to="/contact" className={({ isActive }) => `block text-brand-text-light hover:text-brand-silver transition-colors duration-200 ${isActive ? 'font-bold text-brand-silver' : ''}`}>Contact Us</NavLink></li>
                        <li><NavLink to="/terms" className={({ isActive }) => `block text-brand-text-light hover:text-brand-silver transition-colors duration-200 ${isActive ? 'font-bold text-brand-silver' : ''}`}>Terms & Conditions</NavLink></li>
                        <li><NavLink to="/privacy" className={({ isActive }) => `block text-brand-text-light hover:text-brand-silver transition-colors duration-200 ${isActive ? 'font-bold text-brand-silver' : ''}`}>Privacy Policy</NavLink></li>
                    </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
