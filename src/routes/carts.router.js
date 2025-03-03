import { Router } from 'express';
import CartManager from '../classes/CartManager.js';

const cartsRouter = Router();
const CM = new CartManager();

// Obtener todos los carritos
cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await CM.getCarts();
        res.send({ status: 'success', payload: carts });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await CM.createCart();
        res.send({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Obtener un carrito por ID
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CM.getCartById(cartId);
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message });
    }
});

// Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1; // Cantidad por defecto es 1

        const updatedCart = await CM.addProductToCart(cartId, productId, quantity);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Eliminar un producto del carrito
cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await CM.removeProductFromCart(cartId, productId);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Vaciar el carrito
cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await CM.clearCart(cartId);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default cartsRouter;