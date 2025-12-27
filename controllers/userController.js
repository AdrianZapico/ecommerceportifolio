import User from '../models/userModel.js';


// @desc    Buscar todos os usuários
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar um único usuário por ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            return res.json(user);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

export { getUsers, getUserById };