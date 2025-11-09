import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-pink text-brand-text">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-2">Roxy Shoes</h3>
                        <p className="text-sm">Style with Comfort.</p>
                        <p className="text-sm mt-2">Owner: Mr. Shakeel Ahmed</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Quick Links</h4>
                        <ul>
                            <li className="mb-1"><Link to="/" className="hover:underline">Home</Link></li>
                            <li className="mb-1"><Link to="/category/ladies" className="hover:underline">Ladies Collection</Link></li>
                            <li className="mb-1"><Link to="/category/kids" className="hover:underline">Kids Collection</Link></li>
                            <li className="mb-1"><Link to="/contact" className="hover:underline">Contact Us</Link></li>
                             <li className="mb-1"><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
                            <li className="mb-1"><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:opacity-75"><Icon name="youtube" className="w-6 h-6" /></a>
                            <a href="#" className="hover:opacity-75"><Icon name="instagram" className="w-6 h-6" /></a>
                            <a href="#" className="hover:opacity-75"><Icon name="facebook" className="w-6 h-6" /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-brand-dark-pink pt-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Roxy Shoes. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;