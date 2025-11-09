import React, { createContext, useContext, useState } from 'react';
import type { Product, CartItem, Order, Customer, Expense, Payment, ShopDetails, BankDetails, WalletDetails, User, ProductVariant, Review, Notification } from '../types';
import { OrderStatus, PaymentMethod, OrderType } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  expenses: Expense[];
  payments: Payment[];
  shopDetails: ShopDetails;
  bankDetails: BankDetails[];
  walletDetails: WalletDetails[];
  users: User[];
  currentUser: User | null;
  reviews: Review[];
  notifications: Notification[];
  addToCart: (product: Product, size: string, color: string) => boolean;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  placeOrder: (customer: Customer, paymentMethod: PaymentMethod, paymentScreenshot?: string) => Order;
  addProduct: (productData: Omit<Product, 'id' | 'addedDate'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addExpense: (description: string, amount: number) => void;
  addPayment: (description: string, amount: number) => void;
  addPaymentForOrder: (order: Order, remarks: string) => void;
  addShopOrder: (order: Omit<Order, 'id' | 'type' | 'createdAt'>) => void;
  updateShopDetails: (details: ShopDetails) => void;
  addBankDetails: (details: Omit<BankDetails, 'id'>) => void;
  deleteBankDetails: (id: string) => void;
  addWalletDetails: (details: Omit<WalletDetails, 'id'>) => void;
  deleteWalletDetails: (id: string) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'productId' | 'createdAt'>) => void;
  addNotification: (message: string, orderId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [shopDetails, setShopDetails] = useState<ShopDetails>({
      name: 'Roxy Shoes',
      owner: '',
      address: '',
      contactPerson: '',
      contactMobile: '',
      email: '',
  });
  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  const [walletDetails, setWalletDetails] = useState<WalletDetails[]>([]);
  const [users, setUsers] = useState<User[]>([
      { id: 'user-1', name: 'Admin', role: 'Admin' },
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
  const [counters, setCounters] = useState({ product: products.length, order: 0, shopOrder: 0, review: reviews.length, notification: 0 });

  const addNotification = (message: string, orderId: string) => {
    const newNotification: Notification = {
      id: `notif-${counters.notification + 1}`,
      message,
      orderId,
      createdAt: new Date(),
      isRead: false,
    };
    setCounters(p => ({...p, notification: p.notification + 1}));
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };


  const updateStock = (productId: string, color: string, size: string, quantityChange: number) => {
      setProducts(prevProducts => prevProducts.map(p => {
          if (p.id === productId) {
              const newStock = p.stock.map(variant => {
                  if (variant.color === color && variant.size === size) {
                      return { ...variant, quantity: variant.quantity + quantityChange };
                  }
                  return variant;
              });
              return { ...p, stock: newStock };
          }
          return p;
      }));
  };

  const addToCart = (product: Product, selectedSize: string, selectedColor: string): boolean => {
    const stockItem = product.stock.find(s => s.color === selectedColor && s.size === selectedSize);
    if (!stockItem || stockItem.quantity <= 0) {
        alert('This item is out of stock.');
        return false;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor);
      if (existingItem) {
         if (existingItem.quantity >= stockItem.quantity) {
             alert('Cannot add more than available stock.');
             return prevCart;
         }
        return prevCart.map(item =>
          item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: 1, selectedSize, selectedColor, image: product.images[selectedColor]?.[0] || '' }];
    });
    return true;
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)));
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const placeOrder = (customer: Customer, paymentMethod: PaymentMethod, paymentScreenshot?: string): Order => {
    const subtotal = getCartTotal();
    const tax = subtotal * 0.10; // 10% sales tax
    const deliveryCharge = 300; // Fixed delivery charge for online orders
    const grandTotal = subtotal + tax + deliveryCharge;

    const newOrder: Order = {
        id: `ONL-${String(counters.order + 1).padStart(3, '0')}`,
        type: OrderType.Online,
        customer,
        items: [...cart],
        subtotal,
        tax,
        deliveryCharge,
        grandTotal,
        paymentMethod,
        paymentScreenshot,
        status: OrderStatus.Pending,
        createdAt: new Date(),
    };
    setCounters(p => ({...p, order: p.order + 1}));
    setOrders(prev => [...prev, newOrder]);
    
    // Decrease stock
    cart.forEach(item => {
        updateStock(item.id, item.selectedColor, item.selectedSize, -item.quantity);
    });
    
    addNotification(`Your order #${newOrder.id} has been placed successfully!`, newOrder.id);

    clearCart();
    return newOrder;
  };

  const addShopOrder = (orderData: Omit<Order, 'id' | 'type' | 'createdAt'>) => {
      const newOrder: Order = {
          ...orderData,
          id: `SHP-${String(counters.shopOrder + 1).padStart(3, '0')}`,
          type: OrderType.Shop,
          createdAt: new Date(),
      };
      setCounters(p => ({...p, shopOrder: p.shopOrder + 1}));
      setOrders(prev => [...prev, newOrder]);
      orderData.items.forEach(item => {
        updateStock(item.id, item.selectedColor, item.selectedSize, -item.quantity);
    });
  };

  const addProduct = (productData: Omit<Product, 'id' | 'addedDate'>) => {
    const newId = `ROXXY-${String(counters.product + 1).padStart(3, '0')}`;
    setCounters(p => ({...p, product: p.product + 1}));
    const newProduct: Product = {
        ...productData,
        id: newId,
        addedDate: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  const deleteProduct = (productId: string) => setProducts(prev => prev.filter(p => p.id !== productId));

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
            // If order was cancelled, restore stock
            if (o.status !== OrderStatus.Cancelled && status === OrderStatus.Cancelled) {
                 o.items.forEach(item => updateStock(item.id, item.selectedColor, item.selectedSize, item.quantity));
            } else if (o.status === OrderStatus.Cancelled && status !== OrderStatus.Cancelled) {
                 // If moving from cancelled back to an active state, decrease stock again
                 o.items.forEach(item => updateStock(item.id, item.selectedColor, item.selectedSize, -item.quantity));
            }
            
            if (o.status !== status) {
                 addNotification(`Your order #${o.id} has been updated to: ${status}.`, o.id);
            }

            return {...o, status};
        }
        return o;
    }));
  };

  const addExpense = (description: string, amount: number) => {
    const newExpense: Expense = { id: `exp-${Date.now()}`, date: new Date(), description, amount };
    setExpenses(prev => [...prev, newExpense]);
  };

  const addPayment = (description: string, amount: number) => {
    const newPayment: Payment = { id: `pay-${Date.now()}`, date: new Date(), description, amount };
    setPayments(prev => [...prev, newPayment]);
  };

  const addPaymentForOrder = (order: Order, remarks: string) => {
    addPayment(`Payment for Order #${order.id}. ${remarks}`, order.grandTotal);
  };

  const updateShopDetails = (details: ShopDetails) => setShopDetails(details);
  const addBankDetails = (details: Omit<BankDetails, 'id'>) => setBankDetails(p => [...p, { ...details, id: `bank-${Date.now()}` }]);
  const deleteBankDetails = (id: string) => setBankDetails(p => p.filter(d => d.id !== id));
  const addWalletDetails = (details: Omit<WalletDetails, 'id'>) => setWalletDetails(p => [...p, { ...details, id: `wallet-${Date.now()}` }]);
  const deleteWalletDetails = (id: string) => setWalletDetails(p => p.filter(d => d.id !== id));
  
  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'productId' | 'createdAt'>) => {
    const newReview: Review = {
        ...reviewData,
        id: `rev-${counters.review + 1}`,
        productId,
        createdAt: new Date(),
    };
    setCounters(p => ({...p, review: p.review + 1}));
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <StoreContext.Provider value={{ products, cart, orders, expenses, payments, shopDetails, bankDetails, walletDetails, users, currentUser, reviews, notifications, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, placeOrder, addProduct, updateProduct, deleteProduct, updateOrderStatus, addExpense, addPayment, addPaymentForOrder, addShopOrder, updateShopDetails, addBankDetails, deleteBankDetails, addWalletDetails, deleteWalletDetails, addReview, addNotification, markNotificationAsRead, markAllNotificationsAsRead }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};