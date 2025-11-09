import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import Icon from './Icon';
import { useStore } from '../hooks/useStore';
import Logo from './Logo';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
    const { shopDetails } = useStore();

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <aside className={`fixed top-0 left-0 h-full w-72 bg-brand-blue shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="p-6 text-center border-b border-brand-silver/20 relative flex-shrink-0">
                    <Link to="/" onClick={onClose} className="flex flex-col items-center gap-2">
                        <Logo className="w-20 h-20 rounded-full mb-2 shadow-md" placeholderClassName="bg-brand-silver/20" textClassName="text-4xl" />
                        <span className="text-xl font-serif font-bold text-brand-silver">{shopDetails.name}</span>
                    </Link>
                    <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-light"><Icon name="close" className="w-6 h-6" /></button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto text-brand-text-light">
                    <nav className="space-y-4">
                        <div>
                            <Link to={`/category/ladies`} onClick={onClose} className="font-bold text-lg text-gray-300 hover:text-brand-silver transition-colors duration-200 block mb-2">Ladies</Link>
                            <ul className="space-y-2 pl-3 border-l-2 border-brand-silver/30">
                                {CATEGORIES['Ladies'].map(sub => (
                                    <li key={sub}><Link to={`/category/ladies?subcategory=${encodeURIComponent(sub)}`} onClick={onClose} className="block text-sm hover:text-brand-silver">{sub}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-300 mb-2">Kids</p>
                            <div className="space-y-3 pl-3 border-l-2 border-brand-silver/30">
                                {Object.entries(CATEGORIES.Kids).map(([parentCat, subCats]) => (
                                    <div key={parentCat}>
                                        <Link to={`/category/${parentCat.toLowerCase()}`} onClick={onClose} className="font-semibold text-md text-gray-300 hover:text-brand-silver transition-colors duration-200 block mb-1">{parentCat}</Link>
                                         <ul className="space-y-2 pl-3">
                                            {subCats.map(sub => (
                                                <li key={sub}><Link to={`/category/${parentCat.toLowerCase()}?subcategory=${encodeURIComponent(sub)}`} onClick={onClose} className="block text-sm hover:text-brand-silver">{sub}</Link></li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </nav>

                    <div className="mt-8 pt-6 border-t border-brand-silver/20">
                        <h3 className="font-bold text-lg text-gray-300 mb-2">Information</h3>
                        <ul className="space-y-3">
                            <li><NavLink to="/track" onClick={onClose} className={({ isActive }) => `block hover:text-brand-silver ${isActive ? 'font-bold text-brand-silver' : ''}`}>Track Your Order</NavLink></li>
                            <li><NavLink to="/contact" onClick={onClose} className={({ isActive }) => `block hover:text-brand-silver ${isActive ? 'font-bold text-brand-silver' : ''}`}>Contact Us</NavLink></li>
                            <li><NavLink to="/terms" onClick={onClose} className={({ isActive }) => `block hover:text-brand-silver ${isActive ? 'font-bold text-brand-silver' : ''}`}>Terms & Conditions</NavLink></li>
                            <li><NavLink to="/privacy" onClick={onClose} className={({ isActive }) => `block hover:text-brand-silver ${isActive ? 'font-bold text-brand-silver' : ''}`}>Privacy Policy</NavLink></li>
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default MobileSidebar;
