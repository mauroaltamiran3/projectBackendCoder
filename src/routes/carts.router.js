import { Router } from 'express';
import CartManager from '../classes/CartManager.js';

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await CM.getCarts();
        res.send({ status: 'success', payload: carts });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await CM.createCart();
        res.send({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CM.getCartById(cartId);
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        const updatedCart = await CM.addProductToCart(cartId, productId, quantity);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

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