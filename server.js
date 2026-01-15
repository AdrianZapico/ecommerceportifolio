import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // <--- 1. Faltava importar isso
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
// Permite que o Netlify converse com este servidor e envie cookies
app.use(cors({
    origin: 'https://ecommerce-front-endd.netlify.app',
    credentials: true
}));

// --- MIDDLEWARES PADRÃO ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <--- 2. Faltava ativar o leitor de cookies

// --- ROTAS ---
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// --- PASTA DE IMAGENS ---
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- TRATAMENTO DE ERROS ---
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));