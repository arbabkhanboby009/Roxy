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
  viewingOrderId: string | null;
  setViewingOrderId: (id: string | null) => void;
  addToCart: (product: Product, size: string, color: string) => boolean;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  placeOrder: (customer: Customer, paymentMethod: PaymentMethod, paymentScreenshot?: string) => Order;
  cancelOrderByCustomer: (orderId: string) => boolean;
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
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addPayable: (payable: Omit<Payable, 'id' | 'status'>) => void;
  updatePayableStatus: (payableId: string, method: TransactionMethod) => void;
  addReceivable: (receivable: Omit<Receivable, 'id' | 'status'>) => void;
  updateReceivableStatus: (receivableId: string, method: TransactionMethod) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- DUMMY DATA FOR FIRST-TIME LOAD ---
const defaultShopDetails: ShopDetails = {
    name: 'Roxy Shoes',
    owner: 'Mr. Shakeel Ahmed',
    address: 'Shop 123, Shoe Plaza, Karachi',
    contactPerson: 'Imran Khan',
    contactMobile: '+92 300 1234567',
    email: 'contact@roxyshoes.com',
};

const initialPayees: Payee[] = [
    { id: 'payee-1', name: 'Leather Supplier Co.', businessTitle: 'Vendor', paymentPurpose: 'Raw Material Purchase', mobile: '0301-1112233'},
    { id: 'payee-2', name: 'Ali Express Deliveries', businessTitle: 'Courier', paymentPurpose: 'Delivery Services', mobile: '0302-4445566'},
    { id: 'payee-3', name: 'Ayesha Khan', businessTitle: 'Customer', paymentPurpose: 'Online Order Payment', mobile: '0333-9876543'},
];

const initialTransactions: Transaction[] = [
    { id: 'txn-1', date: new Date('2023-10-20'), description: 'Initial Capital Investment', amount: 50000, type: TransactionType.Income, method: TransactionMethod.Cash, runningBalance: 50000 },
    { id: 'txn-2', date: new Date('2023-10-22'), description: 'Purchase of leather stock', amount: 15000, type: TransactionType.Expense, method: TransactionMethod.Cash, payeeId: 'payee-1', runningBalance: 35000 },
    { id: 'txn-3', date: new Date('2023-10-25'), description: 'Payment for In-Shop Order #SHP-001', amount: 2800, type: TransactionType.Income, method: TransactionMethod.Cash, orderId: 'SHP-001', runningBalance: 37800 },
];

const getInitialOrders = (): Order[] => [
    {
      id: 'SHP-001', type: OrderType.Shop, status: OrderStatus.Delivered, createdAt: new Date('2023-10-25'),
      customer: { fullName: 'Walk-in Customer', mobile: 'N/A', address: 'In-Store', email: ''},
      items: [{ id: 'ROXXY-004', name: 'Chic Ballerina Flats', price: 2800, quantity: 1, selectedColor: 'Black', selectedSize: '7', image: MOCK_PRODUCTS.find(p => p.id === 'ROXXY-004')?.images?.['Black']?.[0] || '' }],
      subtotal: 2800, tax: 280, deliveryCharge: 0, grandTotal: 3080, paymentMethod: PaymentMethod.COD
    },
    {
      id: 'ONL-001', type: OrderType.Online, status: OrderStatus.Dispatched, createdAt: new Date('2023-10-26'),
      customer: { fullName: 'Ayesha Khan', mobile: '0333-9876543', address: '12-B, Gulshan Iqbal, Karachi', email: 'ayesha.k@example.com'},
      items: [{ id: 'ROXXY-001', name: 'Elegant Stiletto Heels', price: 4500, quantity: 1, selectedColor: 'Red', selectedSize: '8', image: MOCK_PRODUCTS.find(p => p.id === 'ROXXY-001')?.images?.['Red']?.[0] || '' }],
      subtotal: 4500, tax: 450, deliveryCharge: 300, grandTotal: 5250, paymentMethod: PaymentMethod.COD
    }
];

const initialPayables: Payable[] = [
    { id: 'payable-1', vendor: 'Leather Supplier Co.', description: 'Invoice #LS-987 for leather shipment', amount: 15000, dueDate: new Date('2023-11-15'), status: 'Paid'},
    { id: 'payable-2', vendor: 'K-Electric', description: 'October Electricity Bill', amount: 8500, dueDate: new Date('2023-11-05'), status: 'Pending'}
];

const initialReceivables: Receivable[] = [
    { id: 'receivable-1', customerName: 'Corporate Client A', description: 'Bulk order for office event', amount: 25000, dueDate: new Date('2023-11-20'), status: 'Pending'}
];

// --- LOCALSTORAGE HELPER FUNCTIONS ---

const dateReviver = (key: string, value: any) => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (typeof value === 'string' && isoDateRegex.test(value)) {
        return new Date(value);
    }
    return value;
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const saved = localStorage.getItem(key);
        if (saved === null || saved === undefined) {
            return defaultValue;
        }
        return JSON.parse(saved, dateReviver);
    } catch (e) {
        console.error(`Failed to load ${key} from storage`, e);
        return defaultValue;
    }
};

const saveToStorage = <T,>(key: string, value: T) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (e) {
        console.error(`Failed to save ${key} to storage`, e);
    }
};


export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('app_products', MOCK_PRODUCTS));
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('app_cart', []));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('app_orders', getInitialOrders()));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage('app_transactions', initialTransactions));
  const [payees, setPayees] = useState<Payee[]>(() => loadFromStorage('app_payees', initialPayees));
  const [shopDetails, setShopDetails] = useState<ShopDetails>(() => loadFromStorage('app_shop_details', defaultShopDetails));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('app_reviews', [
      { id: 'rev-1', productId: 'ROXXY-001', customerName: 'Sara Ahmed', rating: 5, comment: 'Absolutely stunning heels! So comfortable too.', createdAt: new Date('2023-10-27')}
  ]));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('app_notifications', [
      { id: 'notif-1', message: 'New online order #ONL-001 received.', orderId: 'ONL-001', createdAt: new Date('2023-10-26'), isRead: false}
  ]));
  const [payables, setPayables] = useState<Payable[]>(() => loadFromStorage('app_payables', initialPayables));
  const [receivables, setReceivables] = useState<Receivable[]>(() => loadFromStorage('app_receivables', initialReceivables));
  const [bankDetails, setBankDetails] = useState<BankDetails[]>(() => loadFromStorage('app_bank_details', [
      {id: 'bank-1', bankName: 'Meezan Bank', accountTitle: 'Roxy Shoes', accountNumber: '0123456789012345'}
  ]));
  const [walletDetails, setWalletDetails] = useState<WalletDetails[]>(() => loadFromStorage('app_wallet_details', [
       {id: 'wallet-1', walletName: 'EasyPaisa', accountTitle: 'Shakeel Ahmed', walletNumber: '03001234567'}
  ]));
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('app_users', [
      { id: 'user-1', name: 'Admin', role: 'Admin' },
  ]));
  const [counters, setCounters] = useState(() => loadFromStorage('app_counters', { product: 10, order: 1, shopOrder: 1, review: 1, notification: 1, payable: 2, receivable: 1 }));


  useEffect(() => { saveToStorage('app_products', products); }, [products]);
  useEffect(() => { saveToStorage('app_cart', cart); }, [cart]);
  useEffect(() => { saveToStorage('app_orders', orders); }, [orders]);
  useEffect(() => { saveToStorage('app_transactions', transactions); }, [transactions]);
  useEffect(() => { saveToStorage('app_payees', payees); }, [payees]);
  useEffect(() => { saveToStorage('app_shop_details', shopDetails); }, [shopDetails]);
  useEffect(() => { saveToStorage('app_reviews', reviews); }, [reviews]);
  useEffect(() => { saveToStorage('app_notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('app_payables', payables); }, [payables]);
  useEffect(() => { saveToStorage('app_receivables', receivables); }, [receivables]);
  useEffect(() => { saveToStorage('app_bank_details', bankDetails); }, [bankDetails]);
  useEffect(() => { saveToStorage('app_wallet_details', walletDetails); }, [walletDetails]);
  useEffect(() => { saveToStorage('app_users', users); }, [users]);
  useEffect(() => { saveToStorage('app_counters', counters); }, [counters]);
  
  // FIX: Add multi-tab state synchronization
  useEffect(() => {
    const syncState = (event: StorageEvent) => {
        if (event.key === 'app_products') setProducts(loadFromStorage('app_products', MOCK_PRODUCTS));
        if (event.key === 'app_cart') setCart(loadFromStorage('app_cart', []));
        if (event.key === 'app_orders') setOrders(loadFromStorage('app_orders', getInitialOrders()));
        if (event.key === 'app_transactions') setTransactions(loadFromStorage('app_transactions', initialTransactions));
        if (event.key === 'app_payees') setPayees(loadFromStorage('app_payees', initialPayees));
        if (event.key === 'app_shop_details') setShopDetails(loadFromStorage('app_shop_details', defaultShopDetails));
        if (event.key === 'app_reviews') setReviews(loadFromStorage('app_reviews', []));
        if (event.key === 'app_notifications') setNotifications(loadFromStorage('app_notifications', []));
    };

    window.addEventListener('storage', syncState);
    return () => window.removeEventListener('storage', syncState);
  }, []);


  const [currentUser] = useState<User | null>(users[0]);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

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
        
    addNotification(`New online order #${newOrder.id} received.`, newOrder.id);

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
        if (o.id === orderId && o.status !== status) {
            // Restore stock if an order is cancelled
            if (o.status !== OrderStatus.Cancelled && status === OrderStatus.Cancelled) {
                 o.items.forEach(item => updateStock(item.id, item.selectedColor, item.selectedSize, item.quantity));
            } 
            // Deduct stock again if a cancelled order is un-cancelled
            else if (o.status === OrderStatus.Cancelled && status !== OrderStatus.Cancelled) {
                 o.items.forEach(item => updateStock(item.id, item.selectedColor, item.selectedSize, -item.quantity));
            }

            return {...o, status};
        }
        return o;
    }));
    
    // If order is completed or cancelled by admin, remove all related notifications.
    if (status === OrderStatus.Delivered || status === OrderStatus.Cancelled) {
        setNotifications(prev => prev.filter(n => n.orderId !== orderId));
    }
  };

  const cancelOrderByCustomer = (orderId: string): boolean => {
    let orderFoundAndCancellable = false;
    
    const originalOrder = orders.find(o => o.id === orderId);
    
    if (originalOrder && (originalOrder.status === OrderStatus.Pending || originalOrder.status === OrderStatus.Confirmed)) {
      orderFoundAndCancellable = true;
      
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: OrderStatus.Cancelled } : o
      ));
      
      originalOrder.items.forEach(item => {
        updateStock(item.id, item.selectedColor, item.selectedSize, item.quantity);
      });
      
      addNotification(`Order #${orderId} has been cancelled by the customer.`, orderId);
      
      // Remove original "new order" notification
      setNotifications(prev => prev.filter(n => 
        !(n.orderId === orderId && n.message.includes('New online order'))
      ));
    }
    
    return orderFoundAndCancellable;
  };


  const updateShopDetails = (details: ShopDetails) => {
    setShopDetails(details);
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
    <StoreContext.Provider value={{ products, cart, orders, transactions, payees, payables, receivables, shopDetails, bankDetails, walletDetails, users, currentUser, reviews, notifications, viewingOrderId, setViewingOrderId, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, placeOrder, cancelOrderByCustomer, addProduct, updateProduct, deleteProduct, updateOrderStatus, addTransaction, addPayee, addShopOrder, updateShopDetails, addBankDetails, deleteBankDetails, addWalletDetails, deleteWalletDetails, addReview, markNotificationAsRead, markAllNotificationsAsRead, addPayable, updatePayableStatus, addReceivable, updateReceivableStatus }}>
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