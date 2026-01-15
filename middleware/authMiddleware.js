import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. A MUDANÇA PRINCIPAL: Ler do Cookie 'jwt'
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 2. CORREÇÃO DE ID: No seu generateToken você usou 'userId', aqui estava 'id'
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Não autorizado, token falhou');
        }
    } else {
        res.status(401);
        throw new Error('Não autorizado, sem token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Não autorizado como administrador');
    }
};

export { protect, admin };