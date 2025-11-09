import React from 'react';
import { useStore } from '../hooks/useStore';
import { Link } from 'react-router-dom';

interface NotificationCenterProps {
    onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-3 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                {notifications.some(n => !n.isRead) && (
                    <button onClick={markAllNotificationsAsRead} className="text-xs text-blue-500 hover:underline">Mark all as read</button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex items-start">
                                {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>}
                                <div className="flex-grow">
                                    <p className="text-gray-700">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{notification.createdAt.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-gray-500">No notifications yet.</p>
                )}
            </div>
             <Link to="/admin/orders" onClick={onClose} className="block text-center p-2 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 rounded-b-lg">View All Orders</Link>
        </div>
    );
};

export default NotificationCenter;