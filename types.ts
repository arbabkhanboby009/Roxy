export interface ProductVariant {
  color: string;
  size: string;
  quantity: number;
}

export interface Product {
  id: string; // e.g., ROXXY-001
  addedDate: Date;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  colors: string[];
  sizes: string[];
  stock: ProductVariant[];
  images: { [color: string]: string[] }; // Up to 3 images per color
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

export interface Customer {
  fullName: string;
  address: string;
  mobile: string;
  altMobile?: string;
  email: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export enum PaymentMethod {
  COD = 'Cash on Delivery',
  Online = 'Online Payment',
}

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Dispatched = 'Dispatched',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export enum OrderType {
    Online = 'Online',
    Shop = 'In-Shop'
}

export interface Order {
  id: string; // e.g., ONL-001 or SHP-001
  type: OrderType;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentScreenshot?: string; // base64
  status: OrderStatus;
  createdAt: Date;
}

export interface Expense {
    id: string;
    date: Date;
    description: string;
    amount: number;
}

export interface Payment {
    id: string;
    date: Date;
    description: string;
    amount: number;
}

export interface ShopDetails {
    name: string;
    owner: string;
    address: string;
    contactPerson: string;
    contactMobile: string;
    email: string;
    logo?: string;
    location?: {
        lat: number;
        lng: number;
    }
}

export interface BankDetails {
    id: string;
    bankName: string;
    accountTitle: string;
    accountNumber: string;
}

export interface WalletDetails {
    id: string;
    walletName: string;
    accountTitle: string;
    walletNumber: string;
}

export interface User {
    id: string;
    name: string;
    role: 'Admin' | 'Sales Manager' | 'Rider';
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  message: string;
  orderId: string;
  createdAt: Date;
  isRead: boolean;
}