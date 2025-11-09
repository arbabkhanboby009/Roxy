import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { StoreProvider } from './hooks/useStore';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { useStore } from './hooks/useStore';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import StyleAdvisor from './components/StyleAdvisor';

const SplashScreen: React.FC = () => {
    const { shopDetails } = useStore();
    return (
        <div className="fixed inset-0 bg-brand-pink z-[100] flex flex-col items-center justify-center transition-opacity duration-500">
            {shopDetails.logo ? (
                <img src={shopDetails.logo} alt={`${shopDetails.name} Logo`} className="w-40 h-40 object-contain" />
            ) : (
                <div className="w-40 h-40">
                    <svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-full h-full text-brand-text">
                      <path d="M21.43,11.39,15.6,22.24h8.86a4.1,4.1,0,1,0,0-8.2H21.43Zm0-3.3H24.46a7.4,7.4,0,0,1,0,14.79H12.91L5,32.41H18.2L28.14,14.6,39.8,32.41H59L50.2,17.13a7.4,7.4,0,0,1-3-14.21H39.8V0H21.43ZM47.2,14.5a4.1,4.1,0,1,0-4.43,4.1H51.5A4.08,4.08,0,0,0,47.2,14.5Z M31.84,48,24,35.11,16.14,48Z" />
                    </svg>
                </div>
            )}
            <h1 className="text-4xl font-serif font-bold text-brand-text mt-4">{shopDetails.name}</h1>
        </div>
    );
};


const CustomerLayout: React.FC = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    return (
        <>
            <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
            <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
            <div className="container mx-auto flex flex-col lg:flex-row px-4 sm:px-6 lg:px-8 py-12 gap-8">
                <Sidebar />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
            <Footer />
            <StyleAdvisor />
        </>
    );
};

const TermsPage: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-serif font-bold text-brand-text mb-8 text-center">Terms & Conditions</h1>
        <div className="prose max-w-none text-gray-700">
            <p>Welcome to Roxy Shoes. By accessing our website and placing an order, you agree to be bound by these terms and conditions.</p>
            <h2 className="font-serif">1. Orders</h2>
            <p>All orders are subject to availability and confirmation of the order price. Dispatch times may vary according to availability and any guarantees or representations made as to delivery times are subject to any delays resulting from postal delays or force majeure for which we will not be responsible.</p>
            <h2 className="font-serif">2. Pricing and Availability</h2>
            <p>Whilst we try and ensure that all details, descriptions and prices which appear on this Website are accurate, errors may occur. If we discover an error in the price of any goods which you have ordered we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it.</p>
            <h2 className="font-serif">3. Payment</h2>
            <p>We accept Cash on Delivery and Online Payments. For online payments, you must provide proof of payment. Goods will not be dispatched until the funds have cleared.</p>
        </div>
    </div>
);

const PrivacyPage: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-serif font-bold text-brand-text mb-8 text-center">Privacy Policy</h1>
        <div className="prose max-w-none text-gray-700">
            <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.</p>
            <h2 className="font-serif">Personal Information We Collect</h2>
            <p>When you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, email address, and phone number. We refer to this information as “Order Information.”</p>
            <h2 className="font-serif">How Do We Use Your Personal Information?</h2>
            <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to communicate with you and screen our orders for potential risk or fraud.</p>
            <h2 className="font-serif">Sharing Your Personal Information</h2>
            <p>We do not share your Personal Information with third parties except to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</p>
        </div>
    </div>
);


const ContactUsPage: React.FC = () => {
    const { shopDetails } = useStore();

    return (
        <div>
            <h1 className="text-4xl font-serif font-bold text-brand-text mb-8 text-center">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-brand-text mb-4">{shopDetails.name}</h2>
                    <p className="mb-2">
                        <strong>Address:</strong> {shopDetails.address}
                    </p>
                    <p className="mb-2">
                        <strong>WhatsApp / Mobile:</strong> {shopDetails.contactMobile}
                    </p>
                     <p className="mb-2">
                        <strong>Email:</strong> {shopDetails.email}
                    </p>
                     <p className="mb-2">
                        <strong>Contact Person:</strong> {shopDetails.contactPerson}
                    </p>
                    <p className="mb-2">
                        <strong>Owner:</strong> {shopDetails.owner}
                    </p>
                </div>
                <div>
                    {shopDetails.location ? (
                         <iframe
                            src={`https://maps.google.com/maps?q=${shopDetails.location.lat},${shopDetails.location.lng}&hl=es;z=14&amp;output=embed`}
                            width="100%"
                            height="350"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-lg"
                        ></iframe>
                    ) : (
                        <p>Map location not available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const ModeToggle: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAdminMode = location.pathname.startsWith('/admin');

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    return (
      <div style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', color: 'white', fontFamily: 'sans-serif', fontSize: '14px' }}>
        <span>Customer</span>
        <label className="mode-toggle-switch">
            <input type="checkbox" checked={isAdminMode} onChange={handleToggle} />
            <span className="mode-toggle-slider"></span>
        </label>
        <span>Admin</span>
      </div>
    );
};


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Show splash for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <StoreProvider>
      <div className="font-sans bg-gray-50 text-brand-text">
        <HashRouter>
            {isLoading && <SplashScreen />}
            <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <ModeToggle />
                <Routes>
                    <Route element={<CustomerLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/category/:category" element={<CategoryPage />} />
                        <Route path="/product/:productId" element={<ProductPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                        <Route path="/contact" element={<ContactUsPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                    </Route>
                    <Route path="/admin/*" element={<AdminPage />} />
                </Routes>
            </div>
        </HashRouter>
      </div>
    </StoreProvider>
  );
}

export default App;
