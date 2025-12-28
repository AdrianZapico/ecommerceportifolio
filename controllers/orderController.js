import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (should be Protected)
const addOrderItems = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user // passed manually for now
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            const order = new Order({
                orderItems,
                user: user, // manually attached
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid: req.body.isPaid || false,
                paidAt: req.body.paidAt,
                isDelivered: req.body.isDelivered || false,
                deliveredAt: req.body.deliveredAt,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar todos os pedidos
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar um único pedido por ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            return res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

export { addOrderItems, getOrders, getOrderById };
