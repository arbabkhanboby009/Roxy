import type { Product } from './types';

export const CATEGORIES = {
    'Ladies': ['Heels', 'Flats', 'Sandals', 'Slippers', 'Sneakers'],
    'Kids': {
        'Boys': ['Sneakers', 'Sandals', 'School Shoes'],
        'Girls': ['Flats', 'Sandals', 'Party Wear']
    }
};


export const PAKISTANI_SHOE_SIZES = ['5', '6', '7', '8', '9', '10', '11'];
export const AVAILABLE_COLORS = ['Black', 'White', 'Pink', 'Beige', 'Blue', 'Red', 'Brown', 'Silver', 'Gold'];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "ROXXY-001",
        addedDate: new Date("2023-10-26T09:00:00Z"),
        name: "Elegant Stiletto Heels",
        description: "Step into sophistication with these classic stiletto heels. Perfect for formal events or a night out, they feature a sleek design and a comfortable footbed for extended wear.",
        price: 4500,
        salePrice: 3999,
        category: "Ladies",
        subcategory: "Heels",
        colors: ["Black", "Red", "Beige"],
        sizes: ["6", "7", "8", "9"],
        stock: [
            { color: "Black", size: "6", quantity: 10 },
            { color: "Black", size: "7", quantity: 15 },
            { color: "Black", size: "8", quantity: 12 },
            { color: "Black", size: "9", quantity: 5 },
            { color: "Red", size: "7", quantity: 8 },
            { color: "Red", size: "8", quantity: 8 },
            { color: "Beige", size: "7", quantity: 10 },
            { color: "Beige", size: "8", quantity: 10 },
        ],
        images: {
            "Black": ["https://i.ibb.co/T0gS27G/elegant-black-heels-1.jpg", "https://i.ibb.co/FbfVz7G/elegant-black-heels-2.jpg"],
            "Red": ["https://i.ibb.co/hKzG0b9/elegant-red-heels-1.jpg"],
            "Beige": ["https://i.ibb.co/VMyPz3R/elegant-beige-heels-1.jpg"],
        }
    },
    {
        id: "ROXXY-002",
        addedDate: new Date("2023-10-25T11:20:00Z"),
        name: "Casual Comfort Sneakers",
        isFeatured: true,
        description: "Your perfect everyday companion. These sneakers blend style and comfort seamlessly, featuring a breathable upper and a cushioned sole for all-day wear.",
        price: 3200,
        category: "Ladies",
        subcategory: "Sneakers",
        colors: ["White", "Pink", "Black"],
        sizes: ["5", "6", "7", "8", "9"],
        stock: [
            { color: "White", size: "6", quantity: 20 },
            { color: "White", size: "7", quantity: 25 },
            { color: "White", size: "8", quantity: 15 },
            { color: "Pink", size: "6", quantity: 10 },
            { color: "Pink", size: "7", quantity: 12 },
            { color: "Black", size: "7", quantity: 18 },
            { color: "Black", size: "8", quantity: 18 },
        ],
        images: {
            "White": ["https://i.ibb.co/mHq36t7/ladies-white-sneakers-1.jpg", "https://i.ibb.co/RSCyTzv/ladies-white-sneakers-2.jpg", "https://i.ibb.co/gPdcDSc/ladies-white-sneakers-3.jpg"],
            "Pink": ["https://i.ibb.co/GvxB52Q/ladies-pink-sneakers-1.jpg"],
            "Black": ["https://i.ibb.co/4M45G2F/ladies-black-sneakers-1.jpg"],
        }
    },
    {
        id: "ROXXY-003",
        addedDate: new Date("2023-10-24T14:00:00Z"),
        name: "Summer Breeze Sandals",
        description: "Embrace the summer with these light and airy sandals. The minimalist design pairs well with any outfit, while the soft straps ensure a comfortable fit.",
        price: 2500,
        category: "Ladies",
        subcategory: "Sandals",
        colors: ["Brown", "Beige"],
        sizes: ["6", "7", "8", "9", "10"],
        stock: [
            { color: "Brown", size: "6", quantity: 15 },
            { color: "Brown", size: "7", quantity: 20 },
            { color: "Brown", size: "8", quantity: 15 },
            { color: "Beige", size: "7", quantity: 18 },
            { color: "Beige", size: "8", quantity: 18 },
        ],
        images: {
            "Brown": ["https://i.ibb.co/Wc2TqL8/ladies-brown-sandals-1.jpg", "https://i.ibb.co/2Z5802x/ladies-brown-sandals-2.jpg"],
            "Beige": ["https://i.ibb.co/YyW0k8k/ladies-beige-sandals-1.jpg"],
        }
    },
    {
        id: "ROXXY-004",
        addedDate: new Date("2023-10-22T10:00:00Z"),
        name: "Chic Ballerina Flats",
        description: "Effortless style and comfort define these ballerina flats. A versatile choice for work or weekend, featuring a classic silhouette and a cushioned insole.",
        price: 2800,
        category: "Ladies",
        subcategory: "Flats",
        colors: ["Black", "Pink", "Silver"],
        sizes: ["5", "6", "7", "8"],
        stock: [
            { color: "Black", size: "6", quantity: 12 },
            { color: "Black", size: "7", quantity: 15 },
            { color: "Pink", size: "6", quantity: 10 },
            { color: "Pink", size: "7", quantity: 10 },
            { color: "Silver", size: "7", quantity: 8 },
        ],
        images: {
            "Black": ["https://i.ibb.co/SJVpRFj/ladies-black-flats-1.jpg"],
            "Pink": ["https://i.ibb.co/VvM5Q6B/ladies-pink-flats-1.jpg"],
            "Silver": ["https://i.ibb.co/FqPq3QC/ladies-silver-flats-1.jpg"],
        }
    },
    {
        id: "ROXXY-005",
        addedDate: new Date("2023-10-21T18:00:00Z"),
        name: "Boys' Adventure Sneakers",
        description: "Built for play, these durable sneakers are ready for any adventure. They feature a rugged sole for grip, easy velcro straps, and a cool, sporty design.",
        price: 2200,
        category: "Boys",
        subcategory: "Sneakers",
        colors: ["Blue", "Red"],
        sizes: ["8", "9", "10", "11"],
        stock: [
            { color: "Blue", size: "8", quantity: 15 },
            { color: "Blue", size: "9", quantity: 20 },
            { color: "Blue", size: "10", quantity: 10 },
            { color: "Red", size: "9", quantity: 12 },
        ],
        images: {
            "Blue": ["https://i.ibb.co/tCgN2zJ/boys-blue-sneakers-1.jpg", "https://i.ibb.co/8Yj04wS/boys-blue-sneakers-2.jpg"],
            "Red": ["https://i.ibb.co/9Vz2s6X/boys-red-sneakers-1.jpg"],
        }
    },
    {
        id: "ROXXY-006",
        addedDate: new Date("2023-10-20T12:00:00Z"),
        name: "Boys' Sturdy School Shoes",
        description: "Smart, comfortable, and built to last the school year. These black leather school shoes offer great support and feature a polished finish for a sharp look.",
        price: 2600,
        category: "Boys",
        subcategory: "School Shoes",
        colors: ["Black"],
        sizes: ["9", "10", "11"],
        stock: [
            { color: "Black", size: "9", quantity: 30 },
            { color: "Black", size: "10", quantity: 35 },
            { color: "Black", size: "11", quantity: 25 },
        ],
        images: {
            "Black": ["https://i.ibb.co/xX4G2dC/boys-school-shoes-1.jpg", "https://i.ibb.co/fnyQ7xQ/boys-school-shoes-2.jpg"],
        }
    },
     {
        id: "ROXXY-007",
        addedDate: new Date("2023-10-19T15:00:00Z"),
        name: "Boys' Sporty Sandals",
        description: "Perfect for warm weather, these sporty sandals have adjustable straps for a secure fit and a grooved footbed for comfort and stability during play.",
        price: 1800,
        category: "Boys",
        subcategory: "Sandals",
        colors: ["Black", "Blue"],
        sizes: ["8", "9", "10"],
        stock: [
            { color: "Black", size: "8", quantity: 15 },
            { color: "Black", size: "9", quantity: 15 },
            { color: "Blue", size: "9", quantity: 10 },
            { color: "Blue", size: "10", quantity: 10 },
        ],
        images: {
            "Black": ["https://i.ibb.co/Rz3yD6Q/boys-black-sandals-1.jpg"],
            "Blue": ["https://i.ibb.co/qmMvBf1/boys-blue-sandals-1.jpg"],
        }
    },
    {
        id: "ROXXY-008",
        addedDate: new Date("2023-10-18T09:30:00Z"),
        name: "Girls' Sparkle Party Flats",
        description: "Let her shine at any occasion with these dazzling party flats. Covered in glitter and topped with a cute bow, they're perfect for celebrations.",
        price: 2100,
        category: "Girls",
        subcategory: "Party Wear",
        colors: ["Gold", "Silver", "Pink"],
        sizes: ["7", "8", "9", "10"],
        stock: [
            { color: "Gold", size: "8", quantity: 10 },
            { color: "Gold", size: "9", quantity: 10 },
            { color: "Silver", size: "8", quantity: 12 },
            { color: "Pink", size: "7", quantity: 15 },
            { color: "Pink", size: "8", quantity: 15 },
        ],
        images: {
            "Gold": ["https://i.ibb.co/mS72x81/girls-gold-party-flats-1.jpg"],
            "Silver": ["https://i.ibb.co/zXj9Vn9/girls-silver-party-flats-1.jpg"],
            "Pink": ["https://i.ibb.co/yQj09Gq/girls-pink-party-flats-1.jpg"],
        }
    },
    {
        id: "ROXXY-009",
        addedDate: new Date("2023-10-17T11:00:00Z"),
        name: "Girls' Floral Sandals",
        description: "Pretty and practical, these sandals are adorned with floral details. They have a soft, flexible sole and a simple strap for easy on and off.",
        price: 1700,
        category: "Girls",
        subcategory: "Sandals",
        colors: ["White", "Pink"],
        sizes: ["7", "8", "9", "10"],
        stock: [
            { color: "White", size: "7", quantity: 18 },
            { color: "White", size: "8", quantity: 20 },
            { color: "Pink", size: "8", quantity: 15 },
            { color: "Pink", size: "9", quantity: 15 },
        ],
        images: {
            "White": ["https://i.ibb.co/9yMvM5x/girls-white-sandals-1.jpg"],
            "Pink": ["https://i.ibb.co/Yd4B1vP/girls-pink-sandals-1.jpg", "https://i.ibb.co/Wc2vC1p/girls-pink-sandals-2.jpg"],
        }
    },
    {
        id: "ROXXY-010",
        addedDate: new Date("2023-10-16T16:00:00Z"),
        name: "Girls' Everyday Cute Flats",
        description: "Simple, sweet, and perfect for everyday wear. These flats come in versatile colors and feature a small decorative accent for a touch of charm.",
        price: 1900,
        category: "Girls",
        subcategory: "Flats",
        colors: ["Beige", "Black"],
        sizes: ["8", "9", "10", "11"],
        stock: [
            { color: "Beige", size: "9", quantity: 15 },
            { color: "Beige", size: "10", quantity: 15 },
            { color: "Black", size: "8", quantity: 20 },
            { color: "Black", size: "9", quantity: 20 },
        ],
        images: {
            "Beige": ["https://i.ibb.co/MhJj0qX/girls-beige-flats-1.jpg"],
            "Black": ["https://i.ibb.co/9p2g50M/girls-black-flats-1.jpg"],
        }
    }
];