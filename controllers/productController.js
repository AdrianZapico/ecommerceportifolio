import Product from '../models/productModel.js';

// @desc    Criar um produto (Amostra)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const product = new Product({
            name: 'Novo Produto',
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Marca',
            category: 'Categoria',
            countInStock: 0,
            numReviews: 0,
            description: 'Descrição aqui...',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar um produto
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, image, brand, category, countInStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Produto não encontrado');
        }

        // Atualização seletiva
        product.name = name || product.name;
        product.price = price ?? product.price; // ?? garante que 0 não seja ignorado
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock ?? product.countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar um produto
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Produto não encontrado');
        }

        await product.deleteOne();
        res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar produtos com paginação e busca
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const pageSize = 8; // Aumentei um pouco para ocupar melhor a tela
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword ? {
            name: { $regex: req.query.keyword, $options: 'i' }
        } : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 }); // Produtos novos primeiro

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar produto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Produto não encontrado');
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

// @desc    Criar avaliação
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Produto não encontrado');
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Você já avaliou este produto');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;

        // Cálculo de média mais limpo
        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

        await product.save();
        res.status(201).json({ message: 'Avaliação adicionada' });
    } catch (error) {
        next(error);
    }
};

// @desc    Produtos mais bem avaliados (Carrossel)
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(3);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getTopProducts,
    createProductReview
};