import { Router } from 'express';
import { productsModel } from '../models/products.model.js';

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const limitNumber = parseInt(limit, 10);
        const pageNumber = parseInt(page, 10);
        const filter = query ? { category: query } : {};
        const options = {
            limit: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true
        };

        const products = await productsModel.find(filter, null, options);
        const totalProducts = await productsModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNumber);

        res.send({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            hasPrevPage: pageNumber > 1,
            hasNextPage: pageNumber < totalPages
        });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al obtener los productos.' });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.pid).lean();
        if (!product) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al obtener el producto' });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const { title, description, code, price, category, image } = req.body;

        if (!title || !description || !code || !price || !category || !image) {
            return res.status(400).send({ status: 'error', message: 'Faltan datos' });
        }

        const existingProduct = await productsModel.findOne({ code });
        if (existingProduct) {
            return res.status(400).send({ status: 'error', message: 'El código del producto ya existe.' });
        }

        const newProduct = await productsModel.create({ title, description, code, price, category, image });
        res.send({ status: 'success', message: 'Producto agregado', product: newProduct });
    } catch (error) {
        console.error("Error al agregar el producto:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).send({ status: 'error', message: error.message });
        }

        if (error.code === 11000) {
            return res.status(400).send({ status: 'error', message: 'El código del producto ya existe.' });
        }

        res.status(500).send({ status: 'error', message: 'Error al agregar el producto' });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productsModel.findByIdAndUpdate(req.params.pid, req.body, { new: true }).lean();
        if (!updatedProduct) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
        res.send({ status: 'success', message: 'Producto actualizado', product: updatedProduct });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al actualizar el producto' });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productsModel.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
        res.send({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
    }
});

export default productsRouter;