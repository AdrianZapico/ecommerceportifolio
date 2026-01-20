import Order from '../models/orderModel.js';

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
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            const dbOrderItems = orderItems.map((item) => ({
                ...item,
                product: item._id,
                _id: undefined
            }));

            const order = new Order({
                orderItems: dbOrderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

const updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();

            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

const updateOrderToDelivered = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
};