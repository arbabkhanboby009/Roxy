import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import type { ShopDetails, User } from '../types';

import AdminItems from '../components/admin/AdminProducts';
import AdminOrderHistory from '../components/admin/AdminOrders';
import AdminFinance from '../components/admin/AdminLedger';

const AdminDashboard = () => {
    const { orders, products, transactions, shopDetails, updateShopDetails, notifications, markAllNotificationsAsRead } = useStore();
    
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const cashInHand = transactions.length > 0 ? transactions[transactions.length - 1].runningBalance : 0;
    const totalStock = products.reduce((sum, p) => sum + p.stock.reduce((s, v) => s + v.quantity, 0), 0);
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                updateShopDetails({ ...shopDetails, logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const unreadNotifications = notifications.filter(n => !n.isRead);

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to the Roxy Shoes admin panel.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="bg-green-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
                    <p className="text-3xl font-bold text-green-900">PKR {totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-red-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
                    <p className="text-3xl font-bold text-red-900">PKR {totalExpenses.toLocaleString()}</p>
                </div>
                 <div className="bg-blue-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-blue-800">Cash in Hand</h3>
                    <p className="text-3xl font-bold text-blue-900">PKR {cashInHand.toLocaleString()}</p>
                </div>
                 <div className="bg-purple-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-purple-800">Total Stock Items</h3>
                    <p className="text-3xl font-bold text-purple-900">{totalStock}</p>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Pending Tasks</h3>
                        {unreadNotifications.length > 0 && 
                            <button onClick={markAllNotificationsAsRead} className="text-xs text-blue-600 hover:underline">Mark all as read</button>
                        }
                    </div>
                     {unreadNotifications.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {unreadNotifications.map(n => (
                                <div key={n.id} className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded-md flex justify-between items-center">
                                    <p className="pr-2">{n.message}</p>
                                    <Link to={`/admin/orders`} className="text-blue-600 hover:underline text-xs flex-shrink-0">View Order</Link>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-sm text-gray-500">No pending tasks or notifications.</p>
                     )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Branding</h3>
                     <div className="flex items-center gap-4">
                        {shopDetails.logo ? (
                            <img src={shopDetails.logo} alt="Shop Logo" className="w-24 h-24 object-contain rounded-md border p-1 bg-gray-50" />
                        ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">No Logo</div>
                        )}
                        <div>
                             <input type="file" id="logo-upload-dash" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            <label htmlFor="logo-upload-dash" className="cursor-pointer bg-brand-text text-white py-2 px-4 rounded-lg hover:bg-opacity-90 text-sm">
                                Upload Logo
                            </label>
                            <p className="text-xs text-gray-500 mt-2">Update the logo for the entire app.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminShopDetails = () => {
    const { shopDetails, updateShopDetails } = useStore();
    const [details, setDetails] = useState<ShopDetails>(shopDetails);

    useEffect(() => { setDetails(shopDetails); }, [shopDetails]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setDetails({ ...details, [e.target.name]: e.target.value });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setDetails(prev => ({ ...prev, logo: reader.result as string }));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateShopDetails(details);
        alert('Shop details updated!');
    };
    
    const inputClass = "w-full border p-2 rounded mt-1 bg-white text-black border-gray-300 focus:ring-1 focus:ring-brand-dark-pink focus:outline-none";

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop Details</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl">
                 <div className="mb-6 border-b pb-6">
                    <label className="font-bold block mb-2">Shop Logo</label>
                    <div className="flex items-center gap-4">
                        {details.logo ? (
                            <img src={details.logo} alt="Shop Logo" className="w-20 h-20 object-contain rounded-md border p-1 bg-gray-50" />
                        ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">No Logo</div>
                        )}
                        <div>
                            <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            <label htmlFor="logo-upload" className="cursor-pointer bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                                {details.logo ? 'Replace Logo' : 'Upload Logo'}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Recommended: Square image (PNG, JPG)</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="font-bold">Shop Name</label><input name="name" value={details.name} onChange={handleChange} className={inputClass} /></div>
                    <div><label className="font-bold">Owner Name</label><input name="owner" value={details.owner} onChange={handleChange} className={inputClass} /></div>
                    <div><label className="font-bold">Contact Person</label><input name="contactPerson" value={details.contactPerson} onChange={handleChange} className={inputClass} /></div>
                    <div><label className="font-bold">Contact Mobile</label><input name="contactMobile" value={details.contactMobile} onChange={handleChange} className={inputClass} /></div>
                    <div className="md:col-span-2"><label className="font-bold">Contact Email</label><input name="email" value={details.email} onChange={handleChange} className={inputClass} /></div>
                    <div className="md:col-span-2"><label className="font-bold">Address</label><input name="address" value={details.address} onChange={handleChange} className={inputClass} /></div>
                </div>
                 <button type="submit" className="w-full mt-6 bg-brand-text text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90">Save Changes</button>
            </form>
        </div>
    );
};

const AdminUserManagement = () => {
    const { users } = useStore();
    return (
         <div className="p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">User ID</th><th scope="col" className="px-6 py-3">Name</th><th scope="col" className="px-6 py-3">Role</th><th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b">
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4"><select defaultValue={user.role} className="p-1 border rounded-md bg-white text-black border-gray-300"><option>Admin</option><option>Sales Manager</option><option>Rider</option></select></td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button className="text-blue-600 hover:text-blue-800"><Icon name="edit"/></button>
                                    <button className="text-red-600 hover:text-red-800"><Icon name="trash"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { orders, shopDetails } = useStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pendingOrderCount = orders.filter(o => o.status === 'Pending').length;

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
        { name: 'Items', path: '/admin/items', icon: 'products' },
        { name: 'Order History', path: '/admin/orders', icon: 'orders', notification: pendingOrderCount },
        { name: 'Finance', path: '/admin/finance', icon: 'ledger' },
        { name: 'Shop Details', path: '/admin/shop', icon: 'shop' },
        { name: 'User Management', path: '/admin/users', icon: 'users' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="h-20 flex items-center justify-center gap-2 font-bold text-xl border-b border-white/20 flex-shrink-0 px-4">
                 {shopDetails.logo && <img src={shopDetails.logo} alt="Logo" className="h-10 w-10 object-contain"/>}
                 <span className="truncate">{shopDetails.name}</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map(item => (
                    <Link key={item.name} to={item.path} onClick={() => setIsSidebarOpen(false)} className={`flex items-center justify-between space-x-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                        <div className="flex items-center space-x-3"><Icon name={item.icon} className="w-5 h-5" /><span>{item.name}</span></div>
                        {item.notification && item.notification > 0 && (<span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.notification}</span>)}
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-text text-white flex flex-col transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            <div className="lg:ml-64 flex flex-col flex-1">
                <header className="sticky top-0 z-20 bg-white shadow-md lg:hidden h-16 flex items-center px-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 p-2 -ml-2"><Icon name="menu" className="w-6 h-6" /></button>
                    <div className="flex-1 text-center font-bold text-lg text-brand-text">{shopDetails.name}</div>
                </header>
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
};


const AdminPage: React.FC = () => (
    <AdminLayout>
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/items" element={<AdminItems />} />
            <Route path="/orders" element={<AdminOrderHistory />} />
            <Route path="/finance" element={<AdminFinance />} />
            <Route path="/shop" element={<AdminShopDetails />} />
            <Route path="/users" element={<AdminUserManagement />} />
        </Routes>
    </AdminLayout>
);

export default AdminPage;
