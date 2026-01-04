import express from 'express';
import {
    authUser,
    registerUser,
    getUserProfile,    // <--- 1. Importado
    updateUserProfile, // <--- 1. Importado
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

router.post('/auth', authUser);

// ---------------------------------------------------------
// 2. AQUI ESTÁ A CORREÇÃO:
// A rota /profile deve vir ANTES da rota /:id
// ---------------------------------------------------------
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// ---------------------------------------------------------
// Rota Genérica /:id (Sempre por último)
// ---------------------------------------------------------
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

export default router;