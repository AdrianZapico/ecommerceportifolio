import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Configuração OBRIGATÓRIA para Netlify + Render
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Tem que ser true no Render (HTTPS)
        sameSite: 'None', // <--- O SEGREDO! Permite cross-site cookie
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    });
};

export default generateToken;
