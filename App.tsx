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
import TrackOrderPage from './pages/TrackOrderPage';
import Logo from './components/Logo';
import StyleAdvisor from './components/StyleAdvisor';

const SplashScreen: React.FC = () => {
    const { shopDetails } = useStore();
    return (
        <div className="fixed inset-0 bg-brand-blue z-[100] flex flex-col items-center justify-center transition-opacity duration-500">
            <Logo className="w-40 h-40 rounded-full" placeholderClassName="bg-brand-blue-light" textClassName="text-6xl text-brand-silver" />
            <h1 className="text-4xl font-serif font-bold text-brand-text-light mt-4">{shopDetails.name}</h1>
        </div>
    );
};


const CustomerLayout: React.FC = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    return (
        <div className="text-brand-text-light">
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
        </div>
    );
};

const TermsPage: React.FC = () => (
    <div className="bg-brand-blue-light/50 backdrop-blur-sm p-8 rounded-lg shadow-md text-brand-text-light">
        <h1 className="text-4xl font-serif font-bold text-brand-silver mb-8 text-center">Terms & Conditions</h1>
        <div className="prose prose-invert max-w-none">
            <p>Welcome to Roxy Shoes. By accessing our website and placing an order, you agree to be bound by these terms and conditions. Please read them carefully to understand your rights and obligations.</p>
            
            <h2 className="font-serif text-brand-silver">1. Order Policy</h2>
            <p>All orders are subject to product availability and confirmation of the order price. When you place an order, you will receive an acknowledgement e-mail confirming receipt of your order. This email is only an acknowledgement and does not constitute acceptance of your order. A contract between us will not be formed until we send you a separate confirmation by e-mail that the goods you ordered have been dispatched. Only those goods listed in the dispatch confirmation e-mail will be included in the contract formed.</p>
            
            <h2 className="font-serif text-brand-silver">2. Payment Policy</h2>
            <p>We accept two primary methods of payment:</p>
            <ul>
                <li><strong>Online Bank Transfer:</strong> Payments can be made directly to our designated bank account. After completing the transfer, customers are required to upload a screenshot of the transaction receipt as proof of payment. Your order will not be processed or dispatched until the payment has been confirmed and has cleared in our account.</li>
                <li><strong>Cash on Delivery (COD):</strong> This option is available for most locations. Please see the specific conditions for COD orders below.</li>
            </ul>

            <h2 className="font-serif text-brand-silver">3. Cash on Delivery (COD) Policy</h2>
            <p>To ensure a smooth and secure transaction for our delivery personnel, we have a specific procedure for all COD orders:</p>
            <ul>
                <li>Once your order is confirmed and ready for dispatch, our delivery rider will contact you to coordinate the delivery time.</li>
                <li>Before the rider proceeds to your location, the <strong>delivery charges (Rs. 300) must be transferred online</strong> to the account details provided by our team. This is a pre-payment to confirm your order.</li>
                <li>After we confirm receipt of the delivery charges, the rider will be dispatched with your product.</li>
                <li>The remaining amount for the product(s) must be paid in cash directly to the rider upon delivery. The rider will not hand over the product without receiving the full remaining payment.</li>
            </ul>
            <p>This policy helps us minimize risks associated with COD transactions and confirms the customer's commitment to the order.</p>

            <h2 className="font-serif text-brand-silver">4. Refund Policy</h2>
            <p>We are committed to ensuring our customers are satisfied with their purchases. Refunds are available under the following conditions:</p>
            <ul>
                <li><strong>Damaged or Incorrect Product:</strong> If you receive a product that is damaged, defective, or not what you ordered, please contact our customer service within 48 hours of delivery. You must provide photographic evidence of the issue. We will arrange for a return of the product and, upon verification, issue a full refund or a replacement, as per your preference.</li>
                <li><strong>Change of Mind:</strong> We do not offer refunds or exchanges for "change of mind." We encourage you to review your order carefully before confirming your purchase.</li>
                <li><strong>Refund Process:</strong> Once a refund is approved, the amount will be credited back to your original payment method within 7-10 business days. For COD orders, refunds will be processed via bank transfer.</li>
            </ul>

            <h2 className="font-serif text-brand-silver">5. Pricing and Availability</h2>
            <p>While we strive to ensure that all details, descriptions, and prices appearing on this Website are accurate, errors may occur. If we discover an error in the price of any goods which you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it. If we are unable to contact you, we will treat the order as cancelled.</p>
        </div>
    </div>
);

const PrivacyPage: React.FC = () => (
    <div className="bg-brand-blue-light/50 backdrop-blur-sm p-8 rounded-lg shadow-md text-brand-text-light">
        <h1 className="text-4xl font-serif font-bold text-brand-silver mb-8 text-center">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
            <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a a purchase from our website.</p>
            <h2 className="font-serif text-brand-silver">Personal Information We Collect</h2>
            <p>When you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, email address, and phone number. When you place an order, we also collect your live geolocation data to facilitate delivery.</p>
            <h2 className="font-serif text-brand-silver">How Do We Use Your Personal Information?</h2>
            <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including arranging for shipping, and providing you with invoices and/or order confirmations). Your geolocation data is used solely for delivery purposes and is shared only with our delivery personnel for the duration of the delivery process. Additionally, we use this Order Information to communicate with you and screen our orders for potential risk or fraud.</p>
            <h2 className="font-serif text-brand-silver">Sharing Your Personal Information</h2>
            <p>We do not share your Personal Information with third parties except to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</p>
        </div>
    </div>
);


const ContactUsPage: React.FC = () => {
    const { shopDetails } = useStore();

    return (
        <div>
            <h1 className="text-4xl font-serif font-bold text-brand-silver mb-8 text-center">Contact Us</h1>
            <div className="bg-brand-blue-light/50 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-lg mx-auto text-brand-text-light">
                <h2 className="text-2xl font-serif font-bold text-brand-silver mb-4">{shopDetails.name}</h2>
                <div className="space-y-3">
                    <p><strong>Address:</strong> {shopDetails.address}</p>
                    <p><strong>WhatsApp / Mobile:</strong> {shopDetails.contactMobile}</p>
                    <p><strong>Email:</strong> {shopDetails.email}</p>
                    <p><strong>Contact Person:</strong> {shopDetails.contactPerson}</p>
                    <p><strong>Owner:</strong> {shopDetails.owner}</p>
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
      <div className="font-sans">
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
                        <Route path="/track" element={<TrackOrderPage />} />
                        <Route path="/track/:orderId" element={<TrackOrderPage />} />
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