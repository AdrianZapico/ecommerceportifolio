import express from 'express';
const router = express.Router();
import { getUsers, getUserById, registerUser, updateUser } from '../controllers/userController.js';

router.route('/').get(getUsers).post(registerUser);
router.route('/:id').get(getUserById).put(updateUser);


export default router;
