import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, Order, Customer, ShopDetails, BankDetails, WalletDetails, User, ProductVariant, Review, Notification, Payable, Receivable, Transaction, Payee } from '../types';
import { OrderStatus, PaymentMethod, OrderType, TransactionType, TransactionMethod } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  transactions: Transaction[];
  payees: Payee[];
  payables: Payable[];
  receivables: Receivable[];
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
  addTransaction: (txData: Omit<Transaction, 'id' | 'date' | 'runningBalance'>) => void;
  addPayee: (payeeData: Omit<Payee, 'id'>) => Payee;
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
  addPayable: (payable: Omit<Payable, 'id' | 'status'>) => void;
  updatePayableStatus: (payableId: string, method: TransactionMethod) => void;
  addReceivable: (receivable: Omit<Receivable, 'id' | 'status'>) => void;
  updateReceivableStatus: (receivableId: string, method: TransactionMethod) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const defaultShopDetails: ShopDetails = {
    name: 'Roxy Shoes',
    owner: '',
    address: '',
    contactPerson: '',
    contactMobile: '',
    email: '',
    logo: undefined,
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payees, setPayees] = useState<Payee[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [payables, setPayables] = useState<Payable[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);

  const [shopDetails, setShopDetails] = useState<ShopDetails>(() => {
    try {
        const savedDetails = localStorage.getItem('shopDetails');
        return savedDetails ? JSON.parse(savedDetails) : defaultShopDetails;
    } catch (error) {
        console.error("Failed to parse shop details from localStorage", error);
        return defaultShopDetails;
    }
  });

  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  const [walletDetails, setWalletDetails] = useState<WalletDetails[]>([]);
  const [users, setUsers] = useState<User[]>([
      { id: 'user-1', name: 'Admin', role: 'Admin' },
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
  const [counters, setCounters] = useState({ product: products.length, order: 0, shopOrder: 0, review: reviews.length, notification: 0, payable: 0, receivable: 0 });

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
    
    cart.forEach(item => {
        updateStock(item.id, item.selectedColor, item.selectedSize, -item.quantity);
    });
    
    const locationInfo = customer.location ? `Customer location: https://www.google.com/maps?q=${customer.location.lat},${customer.location.lng}` : 'Customer location not provided.';
    console.log(`SIMULATING EMAIL: Order confirmation for #${newOrder.id} to ${customer.email} and admin.`);
    console.log(`ADMIN EMAIL CONTENT: New order received. ${locationInfo}`);
    addNotification(`Your order #${newOrder.id} has been placed!`, newOrder.id);
    addNotification(`New online order #${newOrder.id} received. Location captured.`, newOrder.id);

    clearCart();
    return newOrder;
  };

    const addTransaction = (txData: Omit<Transaction, 'id' | 'date' | 'runningBalance'>) => {
        setTransactions(prev => {
            const lastTransaction = prev.length > 0 ? prev[prev.length - 1] : null;
            const lastBalance = lastTransaction?.runningBalance || 0;
            
            const amountChange = txData.method === TransactionMethod.Cash 
                ? (txData.type === TransactionType.Income ? txData.amount : -txData.amount)
                : 0;
                
            const newBalance = lastBalance + amountChange;

            const newTransaction: Transaction = {
                ...txData,
                id: `txn-${Date.now()}`,
                date: new Date(),
                runningBalance: newBalance,
            };
            return [...prev, newTransaction];
        });
    };

    const addPayee = (payeeData: Omit<Payee, 'id'>): Payee => {
        const newPayee: Payee = {
            ...payeeData,
            id: `payee-${Date.now()}`
        };
        setPayees(prev => [...prev, newPayee]);
        return newPayee;
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
      addTransaction({
        description: `Payment for In-Shop Order #${newOrder.id}`,
        amount: newOrder.grandTotal,
        type: TransactionType.Income,
        method: TransactionMethod.Cash,
        orderId: newOrder.id,
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
            if (o.status !== OrderStatus.Cancelled && status === OrderStatus.Cancelled) {
                 o.items.forEach(item => updateStock(item.id, item.selectedColor, item.selectedSize, item.quantity));
            } else if (o.status === OrderStatus.Cancelled && status !== OrderStatus.Cancelled) {
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

  const updateShopDetails = (details: ShopDetails) => {
    setShopDetails(details);
    try {
        localStorage.setItem('shopDetails', JSON.stringify(details));
    } catch (error) {
        console.error("Failed to save shop details to localStorage", error);
    }
  };

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

  const addPayable = (payable: Omit<Payable, 'id' | 'status'>) => {
    const newPayable: Payable = {
        ...payable,
        id: `payable-${counters.payable + 1}`,
        status: 'Pending',
    };
    setCounters(p => ({...p, payable: p.payable + 1}));
    setPayables(prev => [newPayable, ...prev]);
  };

    const updatePayableStatus = (payableId: string, method: TransactionMethod) => {
      setPayables(prev => prev.map(p => {
          if (p.id === payableId && p.status === 'Pending') {
              addTransaction({
                  description: `Paid: ${p.vendor} - ${p.description}`,
                  amount: p.amount,
                  type: TransactionType.Expense,
                  method: method
              });
              return { ...p, status: 'Paid' };
          }
          return p;
      }));
  };

  const addReceivable = (receivable: Omit<Receivable, 'id' | 'status'>) => {
    const newReceivable: Receivable = {
        ...receivable,
        id: `receivable-${counters.receivable + 1}`,
        status: 'Pending',
    };
    setCounters(p => ({...p, receivable: p.receivable + 1}));
    setReceivables(prev => [newReceivable, ...prev]);
  };

  const updateReceivableStatus = (receivableId: string, method: TransactionMethod) => {
      setReceivables(prev => prev.map(r => {
          if (r.id === receivableId && r.status === 'Pending') {
              addTransaction({
                  description: `Received from: ${r.customerName} - ${r.description}`,
                  amount: r.amount,
                  type: TransactionType.Income,
                  method: method
              });
              return { ...r, status: 'Paid' };
          }
          return r;
      }));
  };

  return (
    <StoreContext.Provider value={{ products, cart, orders, transactions, payees, payables, receivables, shopDetails, bankDetails, walletDetails, users, currentUser, reviews, notifications, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, placeOrder, addProduct, updateProduct, deleteProduct, updateOrderStatus, addTransaction, addPayee, addShopOrder, updateShopDetails, addBankDetails, deleteBankDetails, addWalletDetails, deleteWalletDetails, addReview, addNotification, markNotificationAsRead, markAllNotificationsAsRead, addPayable, updatePayableStatus, addReceivable, updateReceivableStatus }}>
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
