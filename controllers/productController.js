import Product from '../models/productModel.js';

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

const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, image, brand, category, countInStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Produto não encontrado');
        }

        product.name = name || product.name;
        product.price = price ?? product.price;
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

const getProducts = async (req, res, next) => {
    try {
        const pageSize = 8;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword ? {
            name: { $regex: req.query.keyword, $options: 'i' }
        } : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

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

        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

        await product.save();
        res.status(201).json({ message: 'Avaliação adicionada' });
    } catch (error) {
        next(error);
    }
};

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