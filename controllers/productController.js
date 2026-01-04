import Product from '../models/productModel.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Public (should be Private/Admin)
const createProduct = async (req, res, next) => {
    try {
        // Cria um objeto com dados "dummy" (amostra)
        const product = new Product({
            name: 'Nome de Amostra',
            price: 0,
            user: req.user._id, // <--- PEGA O ID DO ADMIN LOGADO (TOKEN)
            image: '/images/sample.jpg',
            brand: 'Marca de Amostra',
            category: 'Categoria de Amostra',
            countInStock: 0,
            numReviews: 0,
            description: 'Descrição de amostra',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (should be Private/Admin)
const updateProduct = async (req, res, next) => {
    try {
        const {
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (should be Private/Admin)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar todos os produtos
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar um único produto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            return res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res, next) => {
    try {
        // Busca todos, ordena por 'rating' decrescente (-1) e pega só os 3 primeiros
        const products = await Product.find({}).sort({ rating: -1 }).limit(3);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getTopProducts };