import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        // Usa o ID do token (req.user._id) para buscar os dados
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            user.image = req.body.image || user.image;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        // 1. Removi 'isAdmin' daqui. Não deixe o usuário escolher isso!
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('Usuário já existe');
        }

        // 2. Criação segura. O Schema do Mongoose já define isAdmin: false por padrão
        const user = await User.create({
            name,
            email,
            password,
            // Se quiser forçar explicitamente: isAdmin: false 
        });

        if (user) {
            // 3. Loga o usuário e retorna os dados (incluindo a imagem padrão)
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                image: user.image, // <--- ADICIONADO: Retorna a imagem padrão (cinza)
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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        const user = await User.findById(req.params.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            if (password) {
                user.password = password;
            }
            user.isAdmin = isAdmin === undefined ? user.isAdmin : isAdmin;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar todos os usuários
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

// @desc    Buscar um único usuário por ID
// @route   GET /api/users/:id
// @access  Private/Admin
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

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Busca o usuário pelo email
        const user = await User.findOne({ email });

        // Verifica se usuário existe E se a senha bate (usando o método do Model)
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id), // Gera o token para o Frontend salvar
            });
        } else {
            res.status(401);
            throw new Error('Email ou senha inválidos');
        }
    } catch (error) {
        next(error);
    }
};

export {
    authUser, registerUser, getUserProfile, updateUserProfile, getUsers, getUserById, updateUser, deleteUser
};