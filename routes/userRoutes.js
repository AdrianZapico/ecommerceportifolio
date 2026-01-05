import express from 'express';
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas Base
router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

// Login
router.post('/auth', authUser);

// Perfil (Sempre antes das rotas com :id dinâmico)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Operações por ID (Admin)
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

export default router;