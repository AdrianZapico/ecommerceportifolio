const orders = [
    {
        orderItems: [
            {
                name: 'Airpods Wireless Bluetooth Headphones',
                qty: 1,
                image: '/images/airpods.jpg',
                price: 89.99,
                product: null, // to be populated by seeder
            },
        ],
        totalPrice: 89.99,
        isPaid: true,
        paidAt: '2025-12-25T10:20:30Z',
        isDelivered: false,
    },
    {
        orderItems: [
            {
                name: 'iPhone 11 Pro 256GB Memory',
                qty: 1,
                image: '/images/phone.jpg',
                price: 599.99,
                product: null, // to be populated by seeder
            },
            {
                name: 'Cannon EOS 80D DSLR Camera',
                qty: 1,
                image: '/images/camera.jpg',
                price: 929.99,
                product: null, // to be populated by seeder
            },
        ],
        totalPrice: 1529.98,
        isPaid: false,
        isDelivered: false,
    },
    {
        orderItems: [
            {
                name: 'Airpods Wireless Bluetooth Headphones',
                qty: 1,
                image: '/images/airpods.jpg',
                price: 89.99,
                product: null, // to be populated by seeder
            },
        ],
        totalPrice: 399.99,
        isPaid: true,
        paidAt: '2025-12-27T15:00:00Z',
        isDelivered: true,
        deliveredAt: '2025-12-28T09:00:00Z',
    },
];

export default orders;
