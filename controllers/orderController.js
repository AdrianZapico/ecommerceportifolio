import Order from '../models/orderModel.js';

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

export { getOrders, getOrderById };
