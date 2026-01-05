import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Autenticar usuário & obter token
// @route   POST /api/users/auth
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                image: user.image,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Email ou senha inválidos');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Registrar novo usuário
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('Usuário já existe');
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                image: user.image,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Dados de usuário inválidos');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Obter perfil do usuário logado
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                image: user.image,
            });
        } else {
            res.status(404);
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar perfil do usuário logado
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.image = req.body.image || user.image;

            if (req.body.password && req.body.password.trim() !== '') {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                image: updatedUser.image,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        next(error);
    }
};

// --- ROTAS DE ADMIN ---

// @desc    Obter todos os usuários
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar usuário
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.isAdmin) {
                res.status(400);
                throw new Error('Não é possível deletar um administrador');
            }
            await user.deleteOne();
            res.json({ message: 'Usuário removido' });
        } else {
            res.status(404);
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Obter usuário por ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404);
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar usuário (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = Boolean(req.body.isAdmin);

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
            res.status(404);
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        next(error);
    }
};

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};